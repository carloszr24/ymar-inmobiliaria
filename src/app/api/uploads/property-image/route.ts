import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { getAdminTokenFromRequest, verifyAdminSessionToken } from '@/lib/admin-session'
import { optimizePropertyImage } from '@/lib/optimize-image'

const BUCKET = 'property-images'
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }

  const propertyId = request.nextUrl.searchParams.get('propertyId')?.trim()
  if (!propertyId) return badRequest('Falta propertyId')

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return badRequest('Falta file')
  if (!ALLOWED_TYPES.has(file.type)) return badRequest('Tipo no permitido (jpg/png/webp)')
  if (file.size > MAX_BYTES) return badRequest('La imagen supera 5MB')

  const originalBuffer = Buffer.from(await file.arrayBuffer())
  const optimized = await optimizePropertyImage(originalBuffer)
  const objectPath = `properties/${propertyId}/${crypto.randomUUID()}.${optimized.ext}`

  // Uint8Array/Blob: evita corrupción UTF-8 si un Buffer de Node se serializa como texto
  const uploadBody = new Blob([new Uint8Array(optimized.data)], { type: optimized.contentType })

  const supabase = createAdminSupabase()
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, uploadBody, { contentType: optimized.contentType, upsert: false })

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
  return NextResponse.json({ url: data.publicUrl, path: objectPath })
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    body = null
  }

  const path = (body as { path?: string } | null)?.path?.trim()
  if (!path) return badRequest('Falta path')

  const supabase = createAdminSupabase()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

