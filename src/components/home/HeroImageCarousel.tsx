'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const HERO_IMAGES = [
  '/images/salamanca-imagenes-1.png',
  '/images/salamanca-imagenes-2.webp',
  '/images/salamanca-imagenes-3.jpg',
]

export function HeroImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Viviendas en Salamanca"
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-700 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
