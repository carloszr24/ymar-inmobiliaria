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
export const PROPERTY_PROVINCES = ['Madrid', 'Toledo'] as const

export const BEDROOM_FILTER_OPTIONS = ['1', '2', '3', '4'] as const
export const BATHROOM_FILTER_OPTIONS = ['1', '2', '3'] as const

export const STATUS_LABELS: Record<string, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
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
