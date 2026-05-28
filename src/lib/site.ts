export const SITE = {
  name: 'Inmobiliaria Cilleros',
  tagline:
    'Compra, venta y alquiler de viviendas en Salamanca con un trato cercano y profesional.',
  description:
    'Inmobiliaria en Salamanca especializada en la gestión de compraventa y alquiler de viviendas. Asesoramiento personalizado en C. María Auxiliadora.',
  logo: '/images/inmobiliaria-cilleros-logo.png',
  city: 'Salamanca',
  address: {
    line1: 'C. María Auxiliadora, 37',
    line2: '37004 Salamanca',
    full: 'C. María Auxiliadora, 37, 37004 Salamanca',
  },
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Calle+Mar%C3%ADa+Auxiliadora+37+37004+Salamanca',
  phone: {
    display: '699 32 04 37',
    href: 'tel:+34699320437',
    whatsappHref: 'https://wa.me/34699320437',
  },
  /** Horario agrupado por franjas iguales (más legible en web) */
  openingHours: [
    { label: 'Domingo', hours: 'Cerrado' },
    { label: 'Lunes', hours: '10:00–12:00, 17:00–20:00' },
    { label: 'Martes a viernes', hours: '10:00–14:00, 17:00–20:00' },
    { label: 'Sábado', hours: '10:30–13:30' },
  ],
} as const

export function formatOpeningHours(): string {
  return SITE.openingHours.map(({ label, hours }) => `${label}: ${hours}`).join('\n')
}
