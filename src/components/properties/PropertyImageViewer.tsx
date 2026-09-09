'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PropertyImageViewerProps {
  images: string[]
  title: string
}

export function PropertyImageViewer({ images, title }: PropertyImageViewerProps) {
  const safeImages = images
  const [index, setIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const previewThumbs = safeImages.slice(0, 3)
  const showViewAllTile = safeImages.length > 3
  const viewAllPreview = safeImages[3] ?? safeImages[safeImages.length - 1]

  const openGallery = (startAt = 0) => {
    setIndex(startAt)
    setLightboxOpen(true)
  }

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }

  const goNext = () => {
    setIndex((prev) => (prev + 1) % safeImages.length)
  }

  const onTouchStart = (clientX: number) => setTouchStartX(clientX)
  const onTouchEnd = (clientX: number) => {
    if (touchStartX == null) return
    const dx = clientX - touchStartX
    if (dx > 50) goPrev()
    if (dx < -50) goNext()
    setTouchStartX(null)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen])

  useEffect(() => {
    setZoom(1)
  }, [index, lightboxOpen])

  if (safeImages.length === 0) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 mb-10 flex items-center justify-center text-stone-400">
        <span className="text-xs uppercase tracking-[0.18em]">Sin fotos disponibles</span>
      </div>
    )
  }

  return (
    <>
      <div
        className="relative aspect-[16/10] overflow-hidden bg-stone-100 mb-3"
        onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
      >
        <Image
          src={safeImages[index]}
          alt={`${title} ${index + 1}`}
          fill
          className="object-cover"
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
          aria-label="Ver imagen ampliada"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setLightboxOpen(true)
          }}
          className="absolute top-3 right-3 z-20 bg-black/55 text-white text-xs px-2.5 py-1.5 backdrop-blur-sm hover:bg-black/65"
        >
          Ampliar
        </button>
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center bg-black/45 text-white text-xl"
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center bg-black/45 text-white text-xl"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div
          className={cn('grid gap-2 mb-10', showViewAllTile ? 'grid-cols-4' : 'grid-cols-3')}
          style={
            !showViewAllTile
              ? { gridTemplateColumns: `repeat(${previewThumbs.length}, minmax(0, 1fr))` }
              : undefined
          }
        >
          {previewThumbs.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative aspect-square overflow-hidden bg-stone-100 border ${index === i ? 'border-stone-900' : 'border-transparent'}`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} miniatura ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
                loading="lazy"
                sizes="96px"
              />
            </button>
          ))}
          {showViewAllTile && (
            <button
              type="button"
              onClick={() => openGallery(0)}
              className="relative aspect-square overflow-hidden bg-stone-100 border border-transparent"
              aria-label={`Ver todas las imágenes (${safeImages.length})`}
            >
              <Image
                src={viewAllPreview}
                alt=""
                fill
                className="object-cover scale-110 blur-[3px] brightness-75"
                unoptimized
                loading="lazy"
                sizes="96px"
                aria-hidden
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white text-xs font-medium tracking-wide uppercase">
                Ver todas
              </span>
            </button>
          )}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 p-4 md:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative h-full w-full"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 z-30 h-10 w-10 bg-white/10 text-white text-2xl"
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="absolute top-2 left-2 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                className="h-10 w-10 bg-white/10 text-white text-xl"
                aria-label="Alejar"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="h-10 w-10 bg-white/10 text-white text-xl"
                aria-label="Acercar"
              >
                +
              </button>
            </div>

            <div className="relative h-full w-full overflow-auto flex items-center justify-center">
              <div
                className="relative w-full h-full max-w-[1400px] max-h-[90vh]"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 150ms ease' }}
              >
                <Image
                  src={safeImages[index]}
                  alt={`${title} ampliada ${index + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                  sizes="100vw"
                />
              </div>
            </div>

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 bg-white/10 text-white text-3xl"
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 bg-white/10 text-white text-3xl"
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

