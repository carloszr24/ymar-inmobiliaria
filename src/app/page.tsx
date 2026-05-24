import Link from 'next/link'
import { createPublicSupabase } from '@/lib/supabase/public-server'
import { isFeaturedFlag, MAX_FEATURED_ON_HOME, rowsToProperties, type PropertyRow } from '@/lib/property-db'
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel'
import { FeaturedPropertiesGrid } from '@/components/home/FeaturedPropertiesGrid'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { ValoracionGratuitaModal } from '@/components/home/ValoracionGratuitaModal'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getFeaturedProperties() {
  const supabase = createPublicSupabase()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(80)
  if (error) throw error

  const rows = (data as PropertyRow[] | null) ?? []
  const featuredRows = rows.filter((r) => isFeaturedFlag(r.featured))
  const picked = featuredRows.slice(0, MAX_FEATURED_ON_HOME)
  if (picked.length >= MAX_FEATURED_ON_HOME) {
    return rowsToProperties(picked)
  }
  const pickedIds = new Set(picked.map((r) => r.id))
  const fill: PropertyRow[] = [...picked]
  for (const r of rows) {
    if (fill.length >= MAX_FEATURED_ON_HOME) break
    if (pickedIds.has(r.id)) continue
    if (!isFeaturedFlag(r.featured)) fill.push(r)
  }
  return rowsToProperties(fill)
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-svh pt-24 pb-14 md:pt-28 md:pb-20 flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <HeroCarousel />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/55 to-stone-950/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 min-[400px]:px-6 max-w-5xl mx-auto">
          <h1 className="font-display text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] text-balance max-md:tracking-[-0.02em] text-[calc(clamp(2.25rem,7.5vw+0.35rem,3.45rem)+4pt)] md:text-[calc(clamp(2.65rem,5.2vw+1.1rem,5.8rem)+4pt)] leading-[1.11] md:leading-[1.05] mb-6 md:mb-8 animate-fade-up">
            Compra o vende tu vivienda en Almería
            <span className="hidden md:inline"> </span>
            <br className="md:hidden" aria-hidden="true" />
            en <span className="text-rose-100 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">menos de 60 días</span>
          </h1>
          <p className="text-stone-200 text-[calc(1rem+4pt)] sm:text-[calc(1.125rem+4pt)] md:text-[calc(1.25rem+4pt)] font-normal max-w-[min(100%,22rem)] sm:max-w-2xl mx-auto mb-8 sm:mb-9 md:mb-10 leading-relaxed text-pretty animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            Te acompaño desde el inicio hasta el final de la operación con un servicio totalmente personalizado
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
              triggerClassName="inline-flex w-full sm:flex-1 sm:min-w-0 min-h-[3.25rem] items-center justify-center px-8 py-4 text-[calc(0.875rem+4pt)] tracking-wide font-medium border-2 border-gold text-gold box-border hover:bg-gold hover:text-white transition-colors duration-200"
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
      <section className="bg-stone-50 py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏡',
                title: 'Compra y venta',
                desc: 'Acompañamiento completo durante toda la operación, de principio a fin.',
              },
              {
                icon: '📋',
                title: 'Valoración profesional',
                desc: 'Conoce el precio real de mercado de tu inmueble en Almería.',
              },
              {
                icon: '🤝',
                title: 'Asesoramiento integral',
                desc: 'Negociación, documentación y acompañamiento para una decisión segura.',
              },
            ].map((item) => (
              <div key={item.title} className="p-8 bg-white border border-stone-100 hover:border-gold transition-colors duration-300">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-medium text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-6 md:px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title mb-6">¿Listo para encontrar<br />tu próximo hogar?</h2>
          <p className="section-subtitle mb-10">
            Cuéntame qué necesitas y prepararemos la mejor estrategia para ti.
          </p>
          <Link href="/contacto" className="btn-primary px-12 py-4 text-sm tracking-wide">
            Hablar con Alessandra
          </Link>
        </div>
      </section>
    </>
  )
}
