'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'
import { ValoracionGratuitaModal } from '@/components/home/ValoracionGratuitaModal'

const links = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/sobre-nosotros', label: 'Servicios' },
  { href: '/contacto', label: 'Contacto' },
]

const serviceColumns = [
  {
    title: 'Para propietarios',
    items: [
      { href: '/contacto', title: 'Valoracion gratuita', description: 'Analisis real de mercado y estrategia de venta.' },
      { href: '/contacto', title: 'Plan de venta premium', description: 'Fotos, video, difusion y filtro de compradores.' },
      { href: '/contacto', title: 'Acompanamiento legal', description: 'Gestion documental y soporte hasta notaria.' },
    ],
  },
  {
    title: 'Para compradores',
    items: [
      { href: '/propiedades', title: 'Busqueda personalizada', description: 'Seleccionamos viviendas segun tus criterios.' },
      { href: '/propiedades', title: 'Visitas eficaces', description: 'Agenda optimizada para que compares mejor.' },
      { href: '/contacto', title: 'Negociacion y cierre', description: 'Te representamos para conseguir mejor acuerdo.' },
    ],
  },
]

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
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={SITE.logo}
              alt={`${SITE.name} logo`}
              width={220}
              height={58}
              priority
              className={cn(
                'h-10 w-auto md:h-11 transition-opacity duration-200',
                transparent ? 'opacity-95' : 'opacity-100'
              )}
            />
          </Link>

          <div className="hidden md:flex items-center gap-7 ml-auto">
            {/* Desktop nav */}
            <nav className="flex items-center gap-7">
              {links.map((link) => (
                link.href === '/sobre-nosotros' ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={openServices}
                    onMouseLeave={closeServices}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.13em] transition-colors duration-200',
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
                        className={cn('h-3.5 w-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')}
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
                        'absolute left-1/2 top-full z-50 mt-4 w-[42rem] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl transition-all duration-200',
                        servicesOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                      )}
                    >
                      <div className="grid grid-cols-2 gap-5">
                        {serviceColumns.map((column) => (
                          <div key={column.title} className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-900">{column.title}</p>
                            <div className="space-y-1.5">
                              {column.items.map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  className="block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white"
                                >
                                  <p className="text-sm font-medium text-stone-900">{item.title}</p>
                                  <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{item.description}</p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-[11px] font-medium uppercase tracking-[0.13em] transition-colors duration-200',
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
                'rounded-md text-[11px] uppercase tracking-[0.13em] px-5 py-2.5',
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
