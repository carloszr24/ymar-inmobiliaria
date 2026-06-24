'use client'

import Image from 'next/image'

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/mostoles.png"
        alt="Vista urbana de Móstoles"
        fill
        priority
        className="object-cover brightness-[1.08] saturate-[1.12]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-transparent to-orange-300/10"
        aria-hidden="true"
      />
    </div>
  )
}
