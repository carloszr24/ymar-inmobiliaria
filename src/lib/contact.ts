export const CONTACT = {
  address: {
    line1: 'Ctra. de Alicun, 28',
    line2: '04740 Roquetas de Mar, Almería',
    full: 'Ctra. de Alicun, 28, 04740 Roquetas de Mar, Almería',
    mapsQuery: 'Ctra.+de+Alicun,+28,+04740+Roquetas+de+Mar,+Almeria',
  },
  phone: {
    display: '664 65 37 25',
    e164: '+34664653725',
    wa: '34664653725',
  },
  email: 'ino.estrella@remax.es',
} as const

export const OPENING_HOURS = [
  { day: 'Lunes', hours: '9:00–21:00' },
  { day: 'Martes', hours: '9:00–21:00' },
  { day: 'Miércoles', hours: '9:00–21:00' },
  { day: 'Jueves', hours: '9:00–21:00' },
  { day: 'Viernes', hours: '9:00–21:00' },
  { day: 'Sábado', hours: '9:00–14:00' },
  { day: 'Domingo', hours: 'Cerrado' },
] as const

export const mapsHref = `https://maps.google.com/?q=${CONTACT.address.mapsQuery}`
export const phoneHref = `tel:${CONTACT.phone.e164}`
export const whatsappHref = `https://wa.me/${CONTACT.phone.wa}`
export const emailHref = `mailto:${CONTACT.email}`
export const whatsappDisplay = `+34 ${CONTACT.phone.display}`

export const scheduleSummary = 'Lun–Vie: 9:00–21:00 · Sáb: 9:00–14:00 · Dom: Cerrado'
