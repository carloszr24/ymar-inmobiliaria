import { createHmac, timingSafeEqual } from 'crypto'
import { getSessionSecret } from '@/lib/admin-security'

export function safeCompareStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export function passwordSessionVersion(): string {
  const password = process.env.ADMIN_PASSWORD?.trim() || ''
  if (!password || !getSessionSecret()) return ''
  return createHmac('sha256', getSessionSecret()).update(password).digest('base64url').slice(0, 16)
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD?.trim() &&
    process.env.ADMIN_PIN?.trim() &&
    getSessionSecret()
  )
}

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim() || ''
  if (!expectedPassword) return false
  return safeCompareStrings(password, expectedPassword)
}

export function verifyAdminPin(pin: string): boolean {
  const expectedPin = process.env.ADMIN_PIN?.trim() || ''
  if (!expectedPin) return false
  return safeCompareStrings(pin, expectedPin)
}

export function verifyAdminLogin(password: string, pin: string): boolean {
  return verifyAdminPassword(password) && verifyAdminPin(pin)
}
