import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, operation?: string): string {
  if (!price || price <= 0) return 'Consultar precio'
  const base = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
  return operation === 'alquiler' ? `${base}/mes` : base
}

export function parseImages(images: string): string[] {
  try {
    return JSON.parse(images)
  } catch {
    return []
  }
}

export const PROPERTY_TYPES = ['piso', 'casa', 'local', 'terreno', 'oficina', 'garaje'] as const
export const PROPERTY_OPERATIONS = ['venta', 'alquiler'] as const
export const PROPERTY_STATUSES = ['disponible', 'reservado', 'vendido'] as const
export const PROPERTY_PROVINCES = [
  'Álava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Ávila',
  'Badajoz',
  'Baleares',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ceuta',
  'Ciudad Real',
  'Córdoba',
  'A Coruña',
  'Cuenca',
  'Girona',
  'Granada',
  'Guadalajara',
  'Guipúzcoa',
  'Huelva',
  'Huesca',
  'Jaén',
  'León',
  'Lleida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Melilla',
  'Murcia',
  'Navarra',
  'Ourense',
  'Palencia',
  'Las Palmas',
  'Pontevedra',
  'La Rioja',
  'Salamanca',
  'Santa Cruz de Tenerife',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vizcaya',
  'Zamora',
  'Zaragoza',
] as const

export const BEDROOM_FILTER_OPTIONS = ['1', '2', '3', '4'] as const
export const BATHROOM_FILTER_OPTIONS = ['1', '2', '3'] as const

export const STATUS_LABELS: Record<string, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

/** Etiquetas de estado en fichas y listado público (con borde). */
export const STATUS_BADGE_CLASSES: Record<string, string> = {
  disponible: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reservado: 'bg-stone-100 text-stone-600 border-stone-300',
  vendido: 'bg-red-50 text-red-700 border-red-200',
}

/** Etiquetas de estado en el panel admin (sin borde). */
export const STATUS_BADGE_CLASSES_ADMIN: Record<string, string> = {
  disponible: 'text-emerald-600 bg-emerald-50',
  reservado: 'text-stone-600 bg-stone-100',
  vendido: 'text-red-600 bg-red-50',
}

export const TYPE_LABELS: Record<string, string> = {
  piso: 'Piso',
  casa: 'Casa',
  local: 'Local',
  terreno: 'Terreno',
  oficina: 'Oficina',
  garaje: 'Plaza de garaje',
}

export const OPERATION_LABELS: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
}
