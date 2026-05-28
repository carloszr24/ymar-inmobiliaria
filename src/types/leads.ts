export type LeadTipo = 'comprador' | 'vendedor'
export type LeadTemperatura = 'caliente' | 'tibio' | 'frio'
export type LeadEstado =
  | 'nuevo'
  | 'llamado'
  | 'en_negociacion'
  | 'cerrado'
  | 'descartado'
export type LeadFuente = 'facebook' | 'web' | 'whatsapp' | 'recomendacion' | 'otro'

export interface Property {
  id: string
  created_at: string
  titulo: string
  direccion: string | null
  precio: string | null
  tipo: 'venta' | 'alquiler'
  activo: boolean
}

export interface Lead {
  id: string
  created_at: string
  nombre: string
  telefono: string
  email: string | null
  propiedad_id: string | null
  propiedad_texto: string | null
  tipo: LeadTipo
  temperatura: LeadTemperatura
  estado: LeadEstado
  fuente: LeadFuente
  notas: string | null
  properties?: Property | null
}

export interface LeadFormInput {
  nombre: string
  telefono: string
  email?: string
  propiedad_id?: string
  propiedad_texto?: string
  tipo: LeadTipo
  temperatura: LeadTemperatura
  fuente: LeadFuente
  notas?: string
}
