import Link from 'next/link'
import {
  CONTACT,
  emailHref,
  mapsHref,
  phoneHref,
  scheduleSummary,
  whatsappHref,
} from '@/lib/contact'

export function Footer() {

  return (
    <footer className="bg-stone-100 text-stone-700 mt-24 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <p className="font-display text-2xl text-stone-900">Alessandra Maggi</p>
            <p className="mt-4 text-sm leading-relaxed text-stone-600 max-w-sm">
              Agente inmobiliaria en Almería. Asesoramiento personalizado para compra, venta e
              inversión en Roquetas de Mar y alrededores.
            </p>
          </div>
          <div>
            <h4 className="text-stone-900 text-xs tracking-widest uppercase mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/propiedades" className="hover:text-stone-900 transition-colors">Propiedades</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-stone-900 transition-colors">Sobre mi</Link></li>
              <li><Link href="/contacto" className="hover:text-stone-900 transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-stone-900 text-xs tracking-widest uppercase mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 transition-colors"
                >
                  {CONTACT.address.full}
                </a>
              </li>
              <li>
                <a href={phoneHref} className="hover:text-stone-900 transition-colors">{CONTACT.phone.display}</a>
              </li>
              <li>
                <a href={emailHref} className="hover:text-stone-900 transition-colors">{CONTACT.email}</a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 transition-colors"
                >
                  WhatsApp: +34 {CONTACT.phone.display}
                </a>
              </li>
              <li className="text-stone-600">{scheduleSummary}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Alessandra Maggi. Todos los derechos reservados.</span>
          <Link href="/admin" className="hover:text-stone-900 transition-colors">Panel Admin</Link>
        </div>
      </div>
    </footer>
  )
}
