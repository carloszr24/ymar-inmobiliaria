import Image from 'next/image'
import Link from 'next/link'
import {
  AGENT,
  CONTACT,
  OFFICES,
  emailHref,
  hasEmail,
  landlineHref,
  mapsHref,
  phoneHref,
  secondaryMapsHref,
  whatsappHref,
} from '@/lib/contact'
import { LOGO_IMAGE_CLASS, LOGO_RENDER, LOGO_SRC } from '@/lib/logo'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-800 bg-stone-900 text-stone-400">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Image
              src={LOGO_SRC}
              alt={`${AGENT.name} logo`}
              width={LOGO_RENDER.width}
              height={LOGO_RENDER.height}
              className={LOGO_IMAGE_CLASS}
            />
            <p className="mt-4 text-sm leading-relaxed text-stone-300 max-w-md">
              {AGENT.tagline} Oficina principal en Móstoles; operamos en todo el territorio nacional.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/propiedades" className="transition-colors hover:text-white">Propiedades</Link></li>
              <li><Link href="/sobre-nosotros" className="transition-colors hover:text-white">Servicios</Link></li>
              <li><Link href="/contacto" className="transition-colors hover:text-white">Contacto</Link></li>
              <li><Link href="/aviso-legal" className="transition-colors hover:text-white">Aviso legal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={phoneHref} className="transition-colors hover:text-white">
                  {CONTACT.phone.label}: {CONTACT.phone.display}
                </a>
              </li>
              <li>
                <a href={landlineHref} className="transition-colors hover:text-white">
                  {CONTACT.landline.label}: {CONTACT.landline.display}
                </a>
              </li>
              {hasEmail && (
                <li>
                  <a href={emailHref} className="transition-colors hover:text-white">{CONTACT.email}</a>
                </li>
              )}
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  WhatsApp: +34 {CONTACT.phone.display}
                </a>
              </li>
              <li className="pt-2">
                <p className="text-stone-500 text-xs mb-0.5">{OFFICES.primary.label}</p>
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  {OFFICES.primary.full}
                </a>
              </li>
              <li>
                <p className="text-stone-500 text-xs mb-0.5">{OFFICES.secondary.label}</p>
                <a href={secondaryMapsHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  {OFFICES.secondary.full}
                </a>
              </li>
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
