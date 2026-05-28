import Link from 'next/link'
import { getFeaturedPropertiesForHome } from '@/lib/properties-store'
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel'
import { FeaturedPropertiesGrid } from '@/components/home/FeaturedPropertiesGrid'
import { HeroImageCarousel } from '@/components/home/HeroImageCarousel'
import { SITE } from '@/lib/site'
import { ValoracionGratuitaModal } from '@/components/home/ValoracionGratuitaModal'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M3 11.25 12 4l9 7.25" />
      <path d="M5.25 10.5V20h13.5v-9.5" />
      <path d="M9.75 20v-5.5h4.5V20" />
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

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M9.5 10.5 12 13l2.5-2.5a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8l-1.4 1.4a2 2 0 0 1-2.8 0L12 13.7" />
      <path d="M14.5 10.5 12 8 9.5 10.5a2 2 0 0 1-2.8 0L3.5 7.3a2 2 0 0 1 0-2.8l1.4-1.4a2 2 0 0 1 2.8 0L12 7.3" />
    </svg>
  )
}

export default async function HomePage() {
  const featured = getFeaturedPropertiesForHome()

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-svh pt-24 pb-28 md:pt-28 md:pb-28 flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <HeroImageCarousel />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/55 to-stone-950/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 min-[400px]:px-6 max-w-5xl mx-auto">
          <p className="mb-5 text-[11px] uppercase tracking-[0.16em] text-stone-200/95 animate-fade-up">
            Servicio inmobiliario en {SITE.city}
          </p>
          <h1 className="font-display text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] text-balance max-md:tracking-[-0.02em] text-[calc(clamp(2.25rem,7.5vw+0.35rem,3.45rem)+4pt)] md:text-[calc(clamp(2.65rem,5.2vw+1.1rem,5.8rem)+4pt)] leading-[1.11] md:leading-[1.05] mb-6 md:mb-8 animate-fade-up">
            Encuentra tu hogar en
            <span className="hidden md:inline"> </span>
            <br className="md:hidden" aria-hidden="true" />
            <span className="text-rose-100 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">{SITE.city}</span>
          </h1>
          <p className="text-stone-200 text-[calc(1rem+4pt)] sm:text-[calc(1.125rem+4pt)] md:text-[calc(1.25rem+4pt)] font-normal max-w-[min(100%,22rem)] sm:max-w-2xl mx-auto mb-8 sm:mb-9 md:mb-10 leading-relaxed text-pretty animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            {SITE.tagline}
          </p>
          <div
            className="flex w-full max-w-xl mx-auto flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <Link
              href="/propiedades"
              className="btn-gold w-full sm:flex-1 sm:min-w-0 min-h-[3.25rem] px-8 py-4 text-[calc(0.875rem+4pt)] tracking-wide text-center border-2 border-transparent box-border"
            >
              Quiero comprar
            </Link>
            <ValoracionGratuitaModal
              triggerLabel="Quiero vender"
              triggerClassName="inline-flex w-full sm:flex-1 sm:min-w-0 min-h-[3.25rem] items-center justify-center px-8 py-4 text-[calc(0.875rem+4pt)] tracking-wide font-medium border-2 border-white text-white box-border hover:bg-white hover:text-stone-900 transition-colors duration-200"
            />
          </div>
        </div>

      </section>

      <ReviewsCarousel />

      {/* FEATURED PROPERTIES */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        {featured.length > 0 ? (
          <div className="space-y-7">
            <div className="relative min-h-10">
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-center">
                Nuevas <span className="text-gold">oportunidades</span>
              </h2>
              <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2">
                <Link href="/propiedades" className="btn-outline text-xs shrink-0">
                  Ver todas →
                </Link>
              </div>
            </div>
            <FeaturedPropertiesGrid properties={featured} />
            <div className="flex justify-end md:hidden">
              <Link href="/propiedades" className="btn-outline text-xs shrink-0">
                Ver todas →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p>Pronto añadiremos propiedades destacadas.</p>
          </div>
        )}
      </section>

      {/* SERVICES STRIP */}
      <section className="bg-stone-900 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.13em] text-stone-400">Servicio completo</p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Todo lo que necesitas para vender con confianza
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: HomeIcon,
                title: 'Compra y venta',
                desc: 'Acompañamiento completo durante toda la operación, de principio a fin.',
              },
              {
                icon: FileIcon,
                title: 'Valoración profesional',
                desc: `Conoce el precio real de mercado de tu inmueble en ${SITE.city} y alrededores.`,
              },
              {
                icon: HandshakeIcon,
                title: 'Asesoramiento integral',
                desc: 'Negociación, documentación y acompañamiento para una decisión segura.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-8 border border-stone-700 bg-stone-950/40 hover:border-brand-red transition-colors duration-300">
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-stone-700 text-stone-100">
                  <item.icon />
                </span>
                <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-stone-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-brand-red-dark via-brand-red to-brand-red-light py-24 px-6 md:px-10 text-center">
        <div className="max-w-2xl mx-auto rounded-2xl border border-white/25 bg-black/10 px-6 py-10 md:px-10 md:py-12">
          <p className="mb-4 text-xs uppercase tracking-[0.13em] text-rose-100">
            {SITE.name}
          </p>
          <h2 className="mb-6 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            ¿Listo para encontrar<br />tu próximo hogar?
          </h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-rose-50">
            Cuéntanos qué necesitas y te asesoramos con un trato cercano y profesional.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacto"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-md border border-transparent bg-white px-10 py-3 text-sm font-medium tracking-wide text-brand-red hover:bg-rose-50 transition-colors duration-200"
            >
              Contactar
            </Link>
            <Link
              href="/propiedades"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-md border border-white px-10 py-3 text-sm font-medium tracking-wide text-white hover:bg-white hover:text-brand-red transition-colors duration-200"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
