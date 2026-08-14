import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  checkRateLimit,
  isRateLimitBlocked,
  resetRateLimit,
} from '@/lib/rate-limiter'

const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_WINDOW_MINUTES = 15
const LOGIN_BLOCK_MINUTES = 30

function loginRateLimitKey(ip: string): string {
  return `login:${ip}`
}

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export function getAllowedAdminIps(): string[] {
  const raw = process.env.ADMIN_ALLOWED_IPS?.trim()
  if (!raw) return []
  return raw
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)
}

export function isAdminIpAllowed(request: NextRequest | Request): boolean {
  const allowed = getAllowedAdminIps()
  if (allowed.length === 0) return true
  const ip = getClientIp(request)
  return allowed.includes(ip)
}

export function adminSecurityHeaders(): HeadersInit {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': 'no-store, max-age=0',
  }
}

export function applyAdminSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(adminSecurityHeaders())) {
    response.headers.set(key, value)
  }
  return response
}

export function adminAccessDeniedResponse(status = 403): NextResponse {
  return applyAdminSecurityHeaders(
    NextResponse.json({ error: 'Acceso no permitido' }, { status })
  )
}

export async function checkLoginRateLimit(
  ip: string
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const status = await isRateLimitBlocked(loginRateLimitKey(ip))
  if (!status.blocked || !status.retryAfter) return { ok: true }

  return {
    ok: false,
    retryAfterSec: Math.max(1, Math.ceil((status.retryAfter.getTime() - Date.now()) / 1000)),
  }
}

export async function recordLoginFailure(ip: string): Promise<void> {
  await checkRateLimit(loginRateLimitKey(ip), {
    maxAttempts: MAX_LOGIN_ATTEMPTS,
    windowMinutes: LOGIN_WINDOW_MINUTES,
    blockMinutes: LOGIN_BLOCK_MINUTES,
  })
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  await resetRateLimit(loginRateLimitKey(ip))
}

export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[admin-security] ADMIN_SESSION_SECRET es obligatorio en producción. ' +
      'Genera uno con: openssl rand -base64 32'
    )
  }
  return process.env.ADMIN_PASSWORD?.trim() || 'dev-secret-inseguro'
}

export function getAdminSessionMaxAgeSeconds(): number {
  const hours = Number(process.env.ADMIN_SESSION_MAX_AGE_HOURS)
  if (Number.isFinite(hours) && hours > 0 && hours <= 168) {
    return Math.floor(hours * 60 * 60)
  }
  return 12 * 60 * 60
}

export function getAdminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
