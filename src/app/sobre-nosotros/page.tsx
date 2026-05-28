'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AGENT } from '@/lib/contact'
import { SITE } from '@/lib/site'

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

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <circle cx="7.5" cy="12.5" r="3.5" />
      <path d="M11 12.5h10M18 12.5v-2M21 12.5v-2" />
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

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="m4 16 6-6 4 4 6-6" />
      <path d="M16 8h4v4" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
    </svg>
  )
}

const services = [
  {
    icon: HomeIcon,
    title: 'Alquiler de propiedades',
    desc: 'Gestionamos alquileres con filtrado de inquilinos, documentación y acompañamiento completo en todo el proceso.',
  },
  {
    icon: ChartIcon,
    title: 'Alquiler y venta en playa',
    desc: 'Servicio especializado en propiedades en costa para alquiler vacacional, residencial y compraventa.',
  },
  {
    icon: BriefcaseIcon,
    title: 'Terrenos: arrendamiento y venta',
    desc: 'Asesoramos operaciones de suelo con análisis de mercado, estrategia comercial y cierre seguro.',
  },
  {
    icon: KeyIcon,
    title: 'Inmuebles de lujo',
    desc: 'Compra y venta de propiedades premium con plan de marketing y negociación personalizada.',
  },
  {
    icon: BuildingIcon,
    title: 'Compra y venta residencial',
    desc: `Pisos, casas y locales en ${SITE.city} y provincia con gestión integral de principio a fin.`,
  },
  {
    icon: GlobeIcon,
    title: 'Asesoramiento integral',
    desc: 'Orientación legal y comercial para que tomes decisiones con claridad en cada etapa de la operación.',
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="pt-24 md:pt-28">
      <section className="bg-stone-950 text-white py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-red text-xs tracking-[0.3em] uppercase mb-4">Quiénes somos</p>
          <h1 className="font-display text-5xl md:text-6xl font-light">Sobre nosotros</h1>
          <p className="text-stone-400 mt-4 text-lg font-light max-w-md">
            Inmobiliaria en {SITE.city} con asesoramiento cercano y profesional.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { value: 'Transparencia', desc: 'Información clara y honesta en cada paso del proceso.' },
            { value: 'Proximidad', desc: 'Te acompañamos personalmente desde el primer contacto.' },
            { value: 'Resultados', desc: 'Más del 95% de nuestros clientes nos recomiendan.' },
          ].map((item) => (
            <div key={item.value} className="p-8">
              <div className="w-1 h-8 bg-gold mx-auto mb-6" />
              <h3 className="font-display text-2xl font-light text-stone-900 mb-3">{item.value}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Services */}
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
      
      {/* Team */}
      <section className="py-24 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            {/* Left: text */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">La agencia</p>
                <h2 className="section-title mb-2">{AGENT.name}</h2>
                <p className="text-stone-500 text-base md:text-lg font-medium mb-8">En {SITE.city}</p>

                <div className="space-y-6 text-stone-600 text-lg leading-relaxed mb-10">
                  <p>
                    En {SITE.name} trabajamos con cercanía, transparencia y una visión estratégica de cada
                    operación. Acompañamos tanto a propietarios como a compradores durante todo el proceso
                    para que cada decisión se tome con tranquilidad y seguridad.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t border-stone-100 sm:grid-cols-3">
                  {[
                    { icon: TargetIcon, text: 'Análisis realista de mercado' },
                    { icon: TrendIcon, text: 'Estrategia de comercialización' },
                    { icon: ShieldIcon, text: 'Negociación en tu interés' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <Icon />
                      <span className="text-sm text-stone-600">{text}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right: photo */}
            <div className="relative w-full max-w-[680px] ml-auto">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/salamanca-imagenes-2.webp"
                  alt={`${SITE.name} en ${SITE.city}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
