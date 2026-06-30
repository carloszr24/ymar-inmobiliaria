import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from '@/lib/admin-session'
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  getAdminCookieOptions,
  getAdminSessionMaxAgeSeconds,
  getClientIp,
  isAdminAuthConfigured,
  isAdminIpAllowed,
  recordLoginFailure,
  verifyAdminCredentials,
} from '@/lib/admin-security'

export async function POST(request: Request) {
  if (!isAdminIpAllowed(request)) {
    return NextResponse.json({ error: 'Acceso no permitido' }, { status: 403 })
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: 'Configuración de admin incompleta' }, { status: 503 })
  }

  const ip = getClientIp(request)
  const rate = checkLoginRateLimit(ip)
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: `Demasiados intentos. Espera ${Math.ceil(rate.retryAfterSec / 60)} minutos e inténtalo de nuevo.`,
      },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
    )
  }

  try {
    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''
    const pin = typeof body?.pin === 'string' ? body.pin : ''

    if (!verifyAdminCredentials(password, pin)) {
      recordLoginFailure(ip)
      return NextResponse.json({ ok: false, error: 'Contraseña o PIN incorrectos' }, { status: 401 })
    }

    const token = createAdminSessionToken()
    if (!token) {
      return NextResponse.json({ error: 'Configuración de admin incompleta' }, { status: 503 })
    }

    clearLoginAttempts(ip)
    const maxAge = getAdminSessionMaxAgeSeconds()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions(maxAge))
    return res
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
