import { NextRequest, NextResponse } from 'next/server'
import {
  adminAccessDeniedResponse,
  applyAdminSecurityHeaders,
  isAdminIpAllowed,
} from '@/lib/admin-security'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const touchesAdmin =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/propiedades') ||
    pathname.startsWith('/api/uploads') ||
    pathname.startsWith('/api/leads')

  if (!touchesAdmin) {
    return NextResponse.next()
  }

  if (!isAdminIpAllowed(request)) {
    return adminAccessDeniedResponse(403)
  }

  // Todas las páginas /admin/* son client components envueltos en
  // AdminAuthGuard, que verifica la sesión contra /api/admin/session
  // (verificación HMAC completa) y muestra el login si no hay sesión
  // válida. Las API Routes también verifican el token en cada mutación.
  // El middleware ya no redirige por presencia de cookie: esa comprobación
  // naive causaba falsos rebotes a /admin?auth=required en subrutas.
  return applyAdminSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/propiedades/:path*', '/api/uploads/:path*', '/api/leads'],
}
