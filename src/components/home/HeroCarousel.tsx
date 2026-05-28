'use client'

import Image from 'next/image'

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/foto-fondo-mostoles%20(1).jpg"
        alt="Vista urbana de Mostoles"
        fill
        priority
        className="object-cover"
      />
    </div>
  )
}
