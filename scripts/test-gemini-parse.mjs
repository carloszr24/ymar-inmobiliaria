#!/usr/bin/env node
/**
 * Prueba local del parser Gemini.
 * Uso: GEMINI_API_KEY=... node scripts/test-gemini-parse.mjs
 * O añade GEMINI_API_KEY a .env y: node --env-file=.env scripts/test-gemini-parse.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

try {
  const raw = readFileSync(resolve(root, '.env'), 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (!m || process.env[m[1]]) continue
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  // optional .env
}

const apiKey = process.env.GEMINI_API_KEY?.trim()
if (!apiKey) {
  console.error('Falta GEMINI_API_KEY en el entorno o en .env')
  process.exit(1)
}

const sample = `Piso de 3 dormitorios en Fuente Cisneros, Alcorcón
Precio: 450.000 €
117 m² construidos
3 habitaciones, 2 baños
Planta 2ª con ascensor
Garaje para 2 vehículos
Calefacción gas natural, aire acondicionado
Certificado energético consumo C
En venta. Zona Fuente Cisneros, Alcorcón (Madrid).
https://www.fotocasa.es/es/comprar/vivienda/alcorcon/aire-acondicionado-calefaccion-terraza-zona-comunitaria-ascensor-internet-piscina-no-amueblado/187435568/d`

const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash-lite'
const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({
  model: modelName,
  generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
})

const prompt = `Extrae JSON con: title, price, location, type, operation, status, description, fotocasaUrl, bedrooms, bathrooms, sqMeters, garage, elevator, imageUrls. No inventes datos.

Anuncio:
"""
${sample}
"""`

console.log('Modelo:', modelName)
const result = await model.generateContent(prompt)
const text = result.response.text()
console.log('Respuesta:\n', text)
const parsed = JSON.parse(text)
console.log('\nOK — título:', parsed.title, '| precio:', parsed.price, '| hab:', parsed.bedrooms)
