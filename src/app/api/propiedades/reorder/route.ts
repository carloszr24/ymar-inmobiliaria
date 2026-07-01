import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAdminTokenFromRequest, verifyAdminSessionToken } from '@/lib/admin-session'
import { isSupabaseConfigured, updatePropertySortOrders } from '@/lib/property-db'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })
  }

  let body: { ids?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean) : []
  if (ids.length === 0) {
    return NextResponse.json({ error: 'Falta la lista de ids' }, { status: 400 })
  }

  try {
    await updatePropertySortOrders(ids)
    revalidatePath('/propiedades')
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al reordenar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
