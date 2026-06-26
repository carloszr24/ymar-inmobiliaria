import { GoogleGenerativeAI } from '@google/generative-ai'
import { PROPERTY_OPERATIONS, PROPERTY_STATUSES, PROPERTY_TYPES } from '@/lib/utils'

export type ParsedListingDraft = {
  title: string
  price: string
  location: string
  type: string
  operation: string
  status: string
  description: string
  fotocasaUrl: string
  bedrooms: string
  bathrooms: string
  sqMeters: string
  availability: string
  hotWater: string
  heating: string
  condition: string
  propertyAge: string
  floor: string
  garage: string
  elevator: string
  furnished: string
  energyRating: string
  energyValue: string
  emissionsRating: string
  emissionsValue: string
  imageUrls: string[]
}

function str(value: unknown): string {
  if (value == null) return ''
  return String(value).trim()
}

function pickEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const v = str(value).toLowerCase()
  return (allowed as readonly string[]).includes(v) ? (v as T) : fallback
}

function normalizePrice(value: unknown): string {
  const raw = str(value).replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')
  if (!raw) return ''
  const n = parseFloat(raw)
  return Number.isFinite(n) ? String(Math.round(n)) : ''
}

function normalizeUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((u) => str(u))
    .filter((u) => /^https?:\/\//i.test(u))
    .slice(0, 50)
}

export function normalizeParsedListing(raw: Record<string, unknown>): ParsedListingDraft {
  return {
    title: str(raw.title),
    price: normalizePrice(raw.price),
    location: str(raw.location),
    type: pickEnum(raw.type, PROPERTY_TYPES, 'piso'),
    operation: pickEnum(raw.operation, PROPERTY_OPERATIONS, 'venta'),
    status: pickEnum(raw.status, PROPERTY_STATUSES, 'disponible'),
    description: str(raw.description),
    fotocasaUrl: str(raw.fotocasaUrl),
    bedrooms: str(raw.bedrooms).replace(/[^\d]/g, ''),
    bathrooms: str(raw.bathrooms).replace(/[^\d]/g, ''),
    sqMeters: str(raw.sqMeters).replace(/[^\d.,]/g, '').replace(',', '.'),
    availability: str(raw.availability),
    hotWater: str(raw.hotWater),
    heating: str(raw.heating),
    condition: str(raw.condition),
    propertyAge: str(raw.propertyAge),
    floor: str(raw.floor),
    garage: str(raw.garage),
    elevator: str(raw.elevator),
    furnished: str(raw.furnished),
    energyRating: str(raw.energyRating).toUpperCase().slice(0, 1),
    energyValue: str(raw.energyValue),
    emissionsRating: str(raw.emissionsRating).toUpperCase().slice(0, 1),
    emissionsValue: str(raw.emissionsValue),
    imageUrls: normalizeUrls(raw.imageUrls),
  }
}

export async function parseListingTextWithGemini(text: string): Promise<ParsedListingDraft> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada')
  }

  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash-lite'
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  })

  const prompt = `Eres un asistente de una inmobiliaria en España. Extrae datos estructurados del siguiente anuncio o texto de propiedad.

Responde ÚNICAMENTE con un JSON válido (sin markdown) con estas claves:
title, price, location, type, operation, status, description, fotocasaUrl, bedrooms, bathrooms, sqMeters,
availability, hotWater, heating, condition, propertyAge, floor, garage, elevator, furnished,
energyRating, energyValue, emissionsRating, emissionsValue, imageUrls

Reglas:
- No inventes datos que no aparezcan en el texto.
- Si un campo no está claro, déjalo vacío (cadena "") o usa el valor por defecto del enum.
- price: solo el número en euros, sin puntos de miles ni símbolo.
- type: uno de ${PROPERTY_TYPES.join(', ')}.
- operation: ${PROPERTY_OPERATIONS.join(' o ')}.
- status: ${PROPERTY_STATUSES.join(', ')} (por defecto disponible).
- description: texto limpio para la ficha web (párrafos, sin relleno de marketing ajeno).
- imageUrls: solo URLs http(s) que aparezcan literalmente en el texto.
- fotocasaUrl: enlace al portal si aparece (Fotocasa, Idealista, etc.).

Texto del anuncio:
"""
${text.trim().slice(0, 30000)}
"""`

  const result = await model.generateContent(prompt)
  const jsonText = result.response.text()
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonText) as Record<string, unknown>
  } catch {
    throw new Error('La IA no devolvió un JSON válido. Prueba con un texto más claro.')
  }

  const draft = normalizeParsedListing(parsed)
  if (!draft.title && !draft.description) {
    throw new Error('No se pudo extraer información útil del texto.')
  }

  return draft
}
