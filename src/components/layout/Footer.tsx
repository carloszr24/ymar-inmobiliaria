import Image from 'next/image'
import Link from 'next/link'
import {
  AGENT,
  CONTACT,
  emailHref,
  hasEmail,
  mapsHref,
  phoneHref,
  scheduleSummary,
  whatsappHref,
} from '@/lib/contact'
import { SITE } from '@/lib/site'

export function Footer() {

  return (
    <footer className="mt-24 border-t border-stone-800 bg-stone-900 text-stone-400">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Image
              src={SITE.logo}
              alt={`${SITE.name} logo`}
              width={360}
              height={96}
              className="h-16 w-auto md:h-20"
            />
            <p className="mt-4 text-sm leading-relaxed text-stone-300 max-w-sm">
              {AGENT.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/propiedades" className="transition-colors hover:text-white">Propiedades</Link></li>
              <li><Link href="/sobre-nosotros" className="transition-colors hover:text-white">Servicios</Link></li>
              <li><Link href="/contacto" className="transition-colors hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {CONTACT.address.full}
                </a>
              </li>
              <li>
                <a href={phoneHref} className="transition-colors hover:text-white">{CONTACT.phone.display}</a>
              </li>
              {hasEmail && (
                <li>
                  <a href={emailHref} className="transition-colors hover:text-white">{CONTACT.email}</a>
                </li>
              )}
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp: +34 {CONTACT.phone.display}
                </a>
              </li>
              <li className="text-stone-400">{scheduleSummary}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} {AGENT.name}. Todos los derechos reservados.</span>
          <Link href="/admin" className="transition-colors hover:text-white">Panel Admin</Link>
        </div>
      </div>
    </footer>
  )
}
