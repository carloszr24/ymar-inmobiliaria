import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminTokenFromRequest, verifyAdminSessionToken } from '@/lib/admin-session'

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin/leads')) {
    return NextResponse.next()
  }

  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/leads/:path*'],
}
