import { NextRequest, NextResponse } from 'next/server'
import { getAdminTokenFromRequest, verifyAdminSessionToken } from '@/lib/admin-session'
import { getPropertyById } from '@/lib/properties-store'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

function demoReadOnly() {
  return NextResponse.json(
    { error: 'Catálogo en modo demo (archivo local). Edita src/data/properties.ts.' },
    { status: 501 }
  )
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const property = getPropertyById(params.id)
  if (!property) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json(property)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  void params
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }
  return demoReadOnly()
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  void params
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }
  return demoReadOnly()
}
