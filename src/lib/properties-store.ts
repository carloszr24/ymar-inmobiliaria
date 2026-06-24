import { DEMO_PROPERTIES } from '@/data/properties'
import { isFeaturedFlag, MAX_FEATURED_ON_HOME } from '@/lib/property-db'
import type { Property } from '@/types'
import type { PropertyFilters } from '@/types'

function hasExtra(value?: string | null): boolean {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  if (!normalized) return false
  return normalized === 'si' || normalized === 'sí' || normalized === 'true' || normalized.startsWith('con ')
}

function extractProvince(location: string): string | null {
  const match = location.match(/\(([^)]+)\)\s*$/)
  return match ? match[1].trim() : null
}

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
  const text = `${property.description} ${property.garage ?? ''}`.toLowerCase()
  switch (extra) {
    case 'garage':
      return hasExtra(property.garage) || /plaza de garaje|garaje/i.test(text)
    case 'elevator':
      return hasExtra(property.elevator)
    case 'furnished':
      return hasExtra(property.furnished)
    case 'heating':
      return hasExtra(property.heating)
    case 'pool':
      return /piscina/i.test(text)
    case 'storage':
      return /trastero/i.test(text)
    case 'common_areas':
      return /zonas comunes/i.test(text)
    default:
      return true
  }
}

function parseExtrasParam(extras?: string, legacyExtra?: string): string[] {
  const fromList = (extras || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (fromList.length > 0) return fromList
  return legacyExtra ? [legacyExtra] : []
}

export function getAllProperties(): Property[] {
  return [...DEMO_PROPERTIES].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getPropertyById(id: string): Property | undefined {
  return DEMO_PROPERTIES.find((p) => p.id === id)
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
    list = list.filter((p) => extractProvince(p.location) === searchParams.province)
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

export function getFeaturedPropertiesForHome(): Property[] {
  const featured = DEMO_PROPERTIES.filter((p) => isFeaturedFlag(p.featured))
  if (featured.length >= MAX_FEATURED_ON_HOME) {
    return featured.slice(0, MAX_FEATURED_ON_HOME)
  }
  const fill = [...featured]
  for (const p of DEMO_PROPERTIES) {
    if (fill.length >= MAX_FEATURED_ON_HOME) break
    if (!fill.some((x) => x.id === p.id)) fill.push(p)
  }
  return fill
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
