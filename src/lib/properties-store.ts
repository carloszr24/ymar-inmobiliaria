import { DEMO_PROPERTIES } from '@/data/properties'
import {
  getPropertyRowById,
  isFeaturedFlag,
  isSupabaseConfigured,
  listFeaturedPropertyRows,
  listPropertyRows,
  MAX_FEATURED_ON_HOME,
  rowsToProperties,
  rowToProperty,
} from '@/lib/property-db'
import type { Property } from '@/types'
import { getPropertyProvince } from '@/lib/property-location'
import type { PropertyFilters } from '@/types'
import { propertyHasExtra } from '@/lib/property-extras'

function matchesBedrooms(property: Property, minBedrooms: string): boolean {
  if (property.bedrooms == null) return false
  const min = Number(minBedrooms)
  if (Number.isNaN(min)) return true
  if (min >= 4) return property.bedrooms >= 4
  return property.bedrooms === min
}

function matchesBathrooms(property: Property, minBathrooms: string): boolean {
  if (property.bathrooms == null) return false
  const min = Number(minBathrooms)
  if (Number.isNaN(min)) return true
  if (min >= 3) return property.bathrooms >= 3
  return property.bathrooms === min
}

function matchesExtra(property: Property, extra: string): boolean {
  return propertyHasExtra(property, extra)
}

function parseExtrasParam(extras?: string, legacyExtra?: string): string[] {
  const fromList = (extras || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (fromList.length > 0) return fromList
  return legacyExtra ? [legacyExtra] : []
}

function sortByDisplayOrder(properties: Property[]): Property[] {
  return [...properties].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    if (orderDiff !== 0) return orderDiff
    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}

function demoCatalog(): Property[] {
  return sortByDisplayOrder(DEMO_PROPERTIES)
}

export async function getAllProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return demoCatalog()
  const rows = await listPropertyRows()
  return rowsToProperties(rows)
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  if (!isSupabaseConfigured()) {
    return DEMO_PROPERTIES.find((p) => p.id === id)
  }
  const row = await getPropertyRowById(id)
  return row ? rowToProperty(row) : undefined
}

export function filterProperties(
  properties: Property[],
  searchParams: {
    type?: string
    operation?: string
    status?: string
    minPrice?: string
    maxPrice?: string
    extra?: string
    extras?: string
    bedrooms?: string
    bathrooms?: string
    province?: string
  }
): Property[] {
  let list = [...properties]

  if (searchParams.type) list = list.filter((p) => p.type === searchParams.type)
  if (searchParams.operation) list = list.filter((p) => p.operation === searchParams.operation)
  if (searchParams.status) list = list.filter((p) => p.status === searchParams.status)
  if (searchParams.minPrice) {
    const min = parseFloat(searchParams.minPrice)
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min)
  }
  if (searchParams.maxPrice) {
    const max = parseFloat(searchParams.maxPrice)
    if (!Number.isNaN(max)) list = list.filter((p) => p.price > 0 && p.price <= max)
  }

  if (searchParams.province) {
    list = list.filter((p) => getPropertyProvince(p) === searchParams.province)
  }
  if (searchParams.bedrooms) {
    list = list.filter((p) => matchesBedrooms(p, searchParams.bedrooms!))
  }
  if (searchParams.bathrooms) {
    list = list.filter((p) => matchesBathrooms(p, searchParams.bathrooms!))
  }

  const selectedExtras = parseExtrasParam(searchParams.extras, searchParams.extra)
  if (selectedExtras.length > 0) {
    list = list.filter((property) => selectedExtras.every((extra) => matchesExtra(property, extra)))
  }

  return list
}

export async function getFeaturedPropertiesForHome(): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    return demoCatalog()
      .filter((p) => isFeaturedFlag(p.featured))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, MAX_FEATURED_ON_HOME)
  }
  const rows = await listFeaturedPropertyRows()
  return rowsToProperties(rows)
}

export function applyPropertyFilters(properties: Property[], filters: PropertyFilters): Property[] {
  let list = [...properties]
  if (filters.type) list = list.filter((p) => p.type === filters.type)
  if (filters.operation) list = list.filter((p) => p.operation === filters.operation)
  if (filters.status) list = list.filter((p) => p.status === filters.status)
  if (filters.minPrice != null) list = list.filter((p) => p.price >= filters.minPrice!)
  if (filters.maxPrice != null) list = list.filter((p) => p.price > 0 && p.price <= filters.maxPrice!)
  return list
}
