'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const HERO_IMAGES = [
  '/images/roquetas-carrusel-1.webp',
  '/images/roquetas-carrusel-2.jpg',
  '/images/roquetas-carrusel-3.jpg',
  '/images/roquetas-carrusel-4.jpg',
  '/images/roquetas-carrusel-5.jpg',
] as const

export function HeroCarousel() {
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
          alt="Viviendas en Almería y Roquetas"
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  )
}
