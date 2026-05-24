'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ValoracionGratuitaModal } from '@/components/home/ValoracionGratuitaModal'

const links = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/sobre-nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname.startsWith('/admin')) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-logo text-[1.5rem] md:text-[1.7rem] leading-none font-extrabold tracking-[-0.025em] text-stone-900">
              Alessandra Maggi
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 ml-auto">
            {/* Desktop nav */}
            <nav className="flex items-center gap-7">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-200',
                    pathname === link.href
                      ? 'text-stone-900'
                      : 'text-stone-500 hover:text-stone-900'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <ValoracionGratuitaModal
              triggerLabel="Valoración gratuita"
              triggerClassName="btn-primary text-[11px] uppercase tracking-[0.12em] px-4 py-2"
            />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto p-2 text-stone-600"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="w-5 space-y-1.5">
              <span className={cn('block h-px bg-stone-900 transition-all duration-300', open && 'rotate-45 translate-y-2')} />
              <span className={cn('block h-px bg-stone-900 transition-all duration-300', open && 'opacity-0')} />
              <span className={cn('block h-px bg-stone-900 transition-all duration-300', open && '-rotate-45 -translate-y-2')} />
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
