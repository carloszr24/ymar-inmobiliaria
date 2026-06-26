import type { Property } from '@/types'
import { createAdminSupabase } from '@/lib/supabase/admin'

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function normalizeExternalUrl(value?: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/** Máximo de inmuebles destacados en la página de inicio (home). */
export const MAX_FEATURED_ON_HOME = 3

/** Máximo de fotos por propiedad en el panel admin. */
export const MAX_PROPERTY_IMAGES = 50

/** Coherente con el filtro de la home ante valores raros desde DB. */
export function isFeaturedFlag(value: unknown): boolean {
  return value === true || value === 'true' || value === 't' || value === 1
}

/**
 * ¿Activar destacada superaría el cupo? Si esta fila ya es destacada, no ocupa “nuevo” cupo.
 */
export function wouldExceedFeaturedHomeLimit(
  rows: { id: string; featured: unknown }[],
  opts: { wantFeatured: boolean; editingPropertyId: string | null }
): boolean {
  if (!opts.wantFeatured) return false
  const featuredIds = rows.filter((r) => isFeaturedFlag(r.featured)).map((r) => r.id)
  if (opts.editingPropertyId && featuredIds.includes(opts.editingPropertyId)) return false
  return featuredIds.length >= MAX_FEATURED_ON_HOME
}

export type PropertyRow = {
  id: string
  title: string
  price: number
  location: string
  type: string
  operation: string | null
  status: string
  description: string
  images: string
  fotocasa_url: string | null
  bedrooms: number | null
  bathrooms: number | null
  sq_meters: number | null
  availability: string | null
  hot_water: string | null
  heating: string | null
  condition: string | null
  property_age: string | null
  floor: string | null
  garage: string | null
  elevator: string | null
  furnished: string | null
  energy_rating: string | null
  energy_value: number | null
  emissions_rating: string | null
  emissions_value: number | null
  featured: boolean
  created_at: string
  updated_at: string
}

export function rowToProperty(r: PropertyRow): Property {
  return {
    id: r.id,
    title: r.title,
    price: r.price,
    location: r.location,
    type: r.type,
    operation: r.operation || 'venta',
    status: r.status,
    description: r.description,
    images: r.images,
    fotocasaUrl: r.fotocasa_url,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    sqMeters: r.sq_meters,
    availability: r.availability,
    hotWater: r.hot_water,
    heating: r.heating,
    condition: r.condition,
    propertyAge: r.property_age,
    floor: r.floor,
    garage: r.garage,
    elevator: r.elevator,
    furnished: r.furnished,
    energyRating: r.energy_rating,
    energyValue: r.energy_value,
    emissionsRating: r.emissions_rating,
    emissionsValue: r.emissions_value,
    featured: r.featured,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  }
}

export function rowsToProperties(rows: PropertyRow[] | null): Property[] {
  if (!rows?.length) return []
  return rows.map(rowToProperty)
}

export type PropertyInsert = {
  title: string
  price: number
  location: string
  type: string
  operation: string
  status: string
  description: string
  images: string
  fotocasa_url: string | null
  bedrooms: number | null
  bathrooms: number | null
  sq_meters: number | null
  availability: string | null
  hot_water: string | null
  heating: string | null
  condition: string | null
  property_age: string | null
  floor: string | null
  garage: string | null
  elevator: string | null
  furnished: string | null
  energy_rating: string | null
  energy_value: number | null
  emissions_rating: string | null
  emissions_value: number | null
  featured: boolean
}

export function bodyToInsert(body: {
  title: string
  price: string | number
  location: string
  type: string
  operation?: string
  status?: string
  description: string
  images: string | string[]
  fotocasaUrl?: string | null
  bedrooms?: string | number | null
  bathrooms?: string | number | null
  sqMeters?: string | number | null
  availability?: string | null
  hotWater?: string | null
  heating?: string | null
  condition?: string | null
  propertyAge?: string | null
  floor?: string | null
  garage?: string | null
  elevator?: string | null
  furnished?: string | null
  energyRating?: string | null
  energyValue?: string | number | null
  emissionsRating?: string | null
  emissionsValue?: string | number | null
  featured?: boolean
}): PropertyInsert {
  const imagesStr = Array.isArray(body.images) ? JSON.stringify(body.images) : String(body.images)
  return {
    title: body.title,
    price: typeof body.price === 'number' ? body.price : parseFloat(String(body.price)),
    location: body.location,
    type: body.type,
    operation: body.operation || 'venta',
    status: body.status || 'disponible',
    description: body.description,
    images: imagesStr,
    fotocasa_url: normalizeExternalUrl(body.fotocasaUrl),
    bedrooms: body.bedrooms !== undefined && body.bedrooms !== '' && body.bedrooms !== null
      ? parseInt(String(body.bedrooms), 10)
      : null,
    bathrooms: body.bathrooms !== undefined && body.bathrooms !== '' && body.bathrooms !== null
      ? parseInt(String(body.bathrooms), 10)
      : null,
    sq_meters: body.sqMeters !== undefined && body.sqMeters !== '' && body.sqMeters !== null
      ? parseFloat(String(body.sqMeters))
      : null,
    availability: body.availability || null,
    hot_water: body.hotWater || null,
    heating: body.heating || null,
    condition: body.condition || null,
    property_age: body.propertyAge || null,
    floor: body.floor || null,
    garage: body.garage || null,
    elevator: body.elevator || null,
    furnished: body.furnished || null,
    energy_rating: body.energyRating || null,
    energy_value: body.energyValue !== undefined && body.energyValue !== '' && body.energyValue !== null
      ? parseFloat(String(body.energyValue))
      : null,
    emissions_rating: body.emissionsRating || null,
    emissions_value: body.emissionsValue !== undefined && body.emissionsValue !== '' && body.emissionsValue !== null
      ? parseFloat(String(body.emissionsValue))
      : null,
    featured: Boolean(body.featured),
  }
}

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
  return base || `propiedad-${Date.now()}`
}

async function uniquePropertyId(base: string): Promise<string> {
  const supabase = createAdminSupabase()
  let candidate = base
  let n = 2
  while (true) {
    const { data } = await supabase.from('properties').select('id').eq('id', candidate).maybeSingle()
    if (!data) return candidate
    candidate = `${base}-${n}`
    n += 1
  }
}

export async function listPropertyRows(): Promise<PropertyRow[]> {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PropertyRow[]
}

export async function getPropertyRowById(id: string): Promise<PropertyRow | null> {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return (data as PropertyRow | null) ?? null
}

export async function createPropertyRow(insert: PropertyInsert, titleForSlug: string): Promise<PropertyRow> {
  const supabase = createAdminSupabase()
  const id = await uniquePropertyId(slugifyTitle(titleForSlug))
  const { data, error } = await supabase
    .from('properties')
    .insert({ ...insert, id })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as PropertyRow
}

export async function updatePropertyRow(id: string, insert: PropertyInsert): Promise<PropertyRow> {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('properties')
    .update({ ...insert, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as PropertyRow
}

export async function deletePropertyRow(id: string): Promise<void> {
  const supabase = createAdminSupabase()
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function assertFeaturedHomeLimit(
  wantFeatured: boolean,
  editingPropertyId: string | null
): Promise<string | null> {
  if (!wantFeatured) return null
  const rows = await listPropertyRows()
  if (wouldExceedFeaturedHomeLimit(rows, { wantFeatured, editingPropertyId })) {
    return `Solo puedes tener ${MAX_FEATURED_ON_HOME} destacadas en la home. Quita la marca en otra propiedad primero.`
  }
  return null
}
