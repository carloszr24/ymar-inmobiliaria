'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AGENT, phoneHref } from '@/lib/contact'
import { HEADER_HEIGHT_CLASS, LOGO_IMAGE_CLASS, LOGO_RENDER, LOGO_SRC } from '@/lib/logo'
import { cn } from '@/lib/utils'
import { ValoracionGratuitaModal } from '@/components/home/ValoracionGratuitaModal'
import { SERVICE_ITEMS } from '@/data/services'

const links = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/sobre-nosotros', label: 'Servicios' },
  { href: '/contacto', label: 'Contacto' },
]

const navLinkClass =
  'inline-flex items-center leading-none text-[11px] font-medium uppercase tracking-[0.13em] transition-colors duration-200'

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  if (pathname.startsWith('/admin')) return null

  const cancelClose = () => {
    if (!closeTimer.current) return
    clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  const openServices = () => {
    cancelClose()
    setServicesOpen(true)
  }

  const closeServices = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setServicesOpen(false), 110)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto pl-5 pr-4 md:pl-12 md:pr-10">
        <div className={cn('flex w-full items-center', HEADER_HEIGHT_CLASS)}>
          <Link href="/" className="relative z-10 flex shrink-0 items-center py-3 md:py-4">
            <Image
              src={LOGO_SRC}
              alt="YMAR"
              width={LOGO_RENDER.width}
              height={LOGO_RENDER.height}
              sizes="(max-width: 768px) 160px, 200px"
              priority
              className={cn(
                LOGO_IMAGE_CLASS,
                'transition-opacity duration-200',
                transparent ? 'opacity-95' : 'opacity-100'
              )}
            />
          </Link>

          <div className="ml-auto hidden md:flex items-center gap-7 shrink-0 self-center">
            {/* Desktop nav */}
            <nav className="flex items-center gap-7">
              {links.map((link) => (
                link.href === '/sobre-nosotros' ? (
                  <div
                    key={link.href}
                    className="relative inline-flex items-center"
                    onMouseEnter={openServices}
                    onMouseLeave={closeServices}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        navLinkClass,
                        'gap-1',
                        pathname === link.href || servicesOpen
                          ? transparent
                            ? 'text-white'
                            : 'text-stone-900'
                          : transparent
                            ? 'text-stone-200 hover:text-white'
                            : 'text-stone-500 hover:text-stone-900'
                      )}
                    >
                      {link.label}
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className={cn('h-3 w-3 shrink-0 transition-transform duration-200', servicesOpen && 'rotate-180')}
                      >
                        <path
                          d="M5.5 7.5 10 12l4.5-4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <div
                      className={cn(
                        'absolute right-0 top-full z-[60] pt-3',
                        servicesOpen ? 'pointer-events-auto' : 'pointer-events-none'
                      )}
                      onMouseEnter={openServices}
                      onMouseLeave={closeServices}
                    >
                      <div
                        className={cn(
                          'w-[min(48rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl transition-all duration-200',
                          servicesOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        )}
                      >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {SERVICE_ITEMS.map((service) => (
                          <Link
                            key={service.title}
                            href="/sobre-nosotros"
                            className="block rounded-xl border border-stone-200/80 bg-stone-50/50 p-4 transition-colors duration-150 hover:border-stone-300 hover:bg-white"
                          >
                            <p className="text-sm font-medium text-stone-900">{service.title}</p>
                            <p className="mt-1.5 text-xs leading-relaxed text-stone-500 line-clamp-3">{service.desc}</p>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-stone-100 pt-4 text-center">
                        <a
                          href={phoneHref}
                          className="inline-flex items-center justify-center gap-1 text-sm font-medium text-brand-red hover:text-brand-red-dark transition-colors"
                        >
                          Llámanos y te damos la solución que buscas →
                        </a>
                      </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      navLinkClass,
                      pathname === link.href
                        ? transparent
                          ? 'text-white'
                          : 'text-stone-900'
                        : transparent
                          ? 'text-stone-200 hover:text-white'
                          : 'text-stone-500 hover:text-stone-900'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* CTA */}
            <ValoracionGratuitaModal
              triggerLabel="Valoración gratuita"
              triggerClassName={cn(
                'inline-flex shrink-0 whitespace-nowrap rounded-md text-[11px] uppercase tracking-[0.1em] px-5 py-2.5',
                transparent
                  ? 'inline-flex items-center justify-center border border-white/80 text-white hover:bg-white hover:text-stone-900 transition-colors duration-200'
                  : 'btn-primary'
              )}
            />
          </div>

          {/* Mobile toggle */}
          <button
            className={cn('md:hidden ml-auto p-2 transition-colors', transparent ? 'text-white' : 'text-stone-600')}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="w-5 space-y-1.5">
              <span
                className={cn(
                  'block h-px transition-all duration-300',
                  transparent ? 'bg-white' : 'bg-stone-900',
                  open && 'rotate-45 translate-y-2'
                )}
              />
              <span
                className={cn(
                  'block h-px transition-all duration-300',
                  transparent ? 'bg-white' : 'bg-stone-900',
                  open && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'block h-px transition-all duration-300',
                  transparent ? 'bg-white' : 'bg-stone-900',
                  open && '-rotate-45 -translate-y-2'
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white px-6 py-6 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-stone-600 hover:text-stone-900 py-1"
            >
              {link.label}
            </Link>
          ))}
          <ValoracionGratuitaModal
            triggerLabel="Valoración gratuita"
            triggerClassName="btn-primary text-xs mt-4 w-full text-center"
          />
        </div>
      )}
    </header>
  )
}
