'use client'

import Link from 'next/link'
import { SERVICE_ITEMS } from '@/data/services'
import { BrandName } from '@/components/BrandName'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M3 11.25 12 4l9 7.25" />
      <path d="M5.25 10.5V20h13.5v-9.5" />
      <path d="M9.75 20v-5.5h4.5V20" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="M8 14v4M12 10v8M16 6v12" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M3 7h18v12H3z" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M3 21h18M5 21V5h14v16" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  )
}

const serviceIcons = [HomeIcon, ChartIcon, BriefcaseIcon, FileIcon, BuildingIcon, GlobeIcon]

const services = SERVICE_ITEMS.map((service, index) => ({
  ...service,
  icon: serviceIcons[index] ?? HomeIcon,
}))

export default function SobreNosotrosPage() {
  return (
    <div className="pt-24 md:pt-[8.5rem]">
      <section className="bg-stone-950 text-white py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-red text-xs tracking-[0.3em] uppercase mb-4">Quiénes somos</p>
          <h1 className="font-display text-5xl md:text-6xl font-light">
            Sobre <BrandName />
          </h1>
          <p className="text-stone-400 mt-4 text-lg font-light max-w-2xl leading-relaxed">
            Inmobiliaria de confianza con más de 30 años de experiencia en el sector.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-10 max-w-4xl mx-auto">
        <div className="space-y-6 text-stone-600 text-lg leading-relaxed text-justify">
          <p>
            Te ayudamos a vender, comprar o alquilar, ofreciendo un servicio integral durante todo el
            proceso.
          </p>
          <p>
            Además de la intermediación inmobiliaria, gestionamos certificados energéticos, revisamos y
            tramitamos la documentación necesaria y te acompañamos en todos los trámites relacionados con
            el Registro de la Propiedad y la notaría.
          </p>
          <p>
            También prestamos apoyo en situaciones que requieren una gestión más especializada, como
            herencias, adjudicaciones o cualquier operación inmobiliaria que implique trámites complejos.
            Nuestro objetivo es que puedas realizar la operación con seguridad, tranquilidad y el respaldo de
            profesionales que se encargan de todo el proceso.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { value: 'Transparencia', desc: 'Información clara y honesta en cada paso del proceso.' },
            { value: 'Proximidad', desc: 'Te acompañamos personalmente desde el primer contacto.' },
            { value: 'Experiencia', desc: 'Más de 30 años ayudando a clientes en todo tipo de operaciones.' },
          ].map((item) => (
            <div key={item.value} className="p-8">
              <div className="w-1 h-8 bg-gold mx-auto mb-6" />
              <h3 className="font-display text-2xl font-light text-stone-900 mb-3">{item.value}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-50 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Lo que hacemos</p>
            <h2 className="section-title">Servicios inmobiliarios</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white p-8 border border-stone-100 hover:border-gold transition-colors duration-300 group"
              >
                <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-700 group-hover:text-gold transition-colors">
                  <service.icon />
                </span>
                <h3 className="font-medium text-stone-900 mb-3 group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 text-white py-20 px-6 md:px-10 text-center">
        <h2 className="font-display text-4xl font-light mb-6">¿Hablamos?</h2>
        <p className="text-stone-400 mb-10 max-w-md mx-auto">
          Cuéntanos tu situación y encontraremos la mejor solución para ti.
        </p>
        <Link href="/contacto" className="btn-gold px-10 py-4 text-sm">
          Contactar ahora
        </Link>
      </section>
    </div>
  )
}
