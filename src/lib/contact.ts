import { SITE, formatOpeningHours } from '@/lib/site'

/** Compatibilidad con componentes que importan AGENT / CONTACT */
export const AGENT = {
  name: SITE.name,
  title: 'Inmobiliaria',
  tagline: SITE.tagline,
} as const

export const CONTACT = {
  address: {
    line1: SITE.address.line1,
    line2: SITE.address.line2,
    full: SITE.address.full,
    mapsQuery: SITE.address.full,
  },
  phone: {
    display: SITE.phone.display,
    e164: SITE.phone.href.replace('tel:', ''),
    wa: SITE.phone.whatsappHref.replace('https://wa.me/', ''),
  },
  email: '',
} as const

export const OPENING_HOURS = SITE.openingHours.map(({ label, hours }) => ({
  day: label,
  hours,
})) as ReadonlyArray<{ day: string; hours: string }>

export const mapsHref = SITE.mapsHref
export const phoneHref = SITE.phone.href
export const whatsappHref = SITE.phone.whatsappHref
export const hasEmail = CONTACT.email.trim().length > 0
export const emailHref = hasEmail ? `mailto:${CONTACT.email}` : ''
export const whatsappDisplay = `+34 ${SITE.phone.display}`
export const scheduleSummary = formatOpeningHours().replace(/\n/g, ' · ')
