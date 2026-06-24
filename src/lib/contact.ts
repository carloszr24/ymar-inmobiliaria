export const CONTACT_EMAIL = 'ymarinmobiliaria@gmail.com'

export const AGENT = {
  name: 'YMAR Inmobiliaria',
  title: 'Agencia inmobiliaria',
  tagline:
    'Más de 30 años de experiencia en compra, venta y alquiler en todo el territorio nacional.',
} as const

export const LEGAL = {
  ownerName: 'Ángel García del Valle',
  legalForm: 'autónomo',
  taxId: '50066862W',
  address: 'Av. de la Constitución, 62, 28931 Móstoles, Madrid',
} as const

export const OFFICES = {
  primary: {
    label: 'Oficina principal',
    line1: 'Av. de la Constitución, 62',
    line2: '28931 Móstoles, Madrid',
    full: 'Av. de la Constitución, 62, 28931 Móstoles, Madrid',
    mapsQuery: 'Av.+de+la+Constitucion,+62,+28931+Mostoles,+Madrid',
  },
  secondary: {
    label: 'Segunda oficina',
    line1: 'C/ Veracruz, 10',
    line2: '28936 Móstoles, Madrid',
    full: 'C/ Veracruz, 10, 28936 Móstoles, Madrid',
    mapsQuery: 'Calle+Veracruz+10,+28936+Mostoles,+Madrid',
  },
} as const

const contactEmail = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? CONTACT_EMAIL).trim()

export const CONTACT = {
  address: OFFICES.primary,
  offices: OFFICES,
  phone: {
    display: '606 620 776',
    e164: '+34606620776',
    wa: '34606620776',
    label: 'Móvil',
  },
  landline: {
    display: '91 613 60 36',
    e164: '+34916136036',
    label: 'Fijo',
  },
  email: contactEmail,
} as const

export const mapsHref = `https://maps.google.com/?q=${CONTACT.address.mapsQuery}`
export const secondaryMapsHref = `https://maps.google.com/?q=${OFFICES.secondary.mapsQuery}`
export const phoneHref = `tel:${CONTACT.phone.e164}`
export const landlineHref = `tel:${CONTACT.landline.e164}`
export const hasEmail = CONTACT.email.length > 0
export const emailHref = hasEmail ? `mailto:${CONTACT.email}` : ''
export const whatsappHref = `https://wa.me/${CONTACT.phone.wa}`
export const whatsappDisplay = `+34 ${CONTACT.phone.display}`
