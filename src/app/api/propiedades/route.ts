import { NextRequest, NextResponse } from 'next/server'
import { getAdminTokenFromRequest, verifyAdminSessionToken } from '@/lib/admin-session'
import { getAllProperties } from '@/lib/properties-store'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

function demoReadOnly() {
  return NextResponse.json(
    { error: 'Catálogo en modo demo (archivo local). Edita src/data/properties.ts.' },
    { status: 501 }
  )
}

export async function GET() {
  return NextResponse.json(getAllProperties())
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }
  return demoReadOnly()
}
