import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createPublicSupabase } from '@/lib/supabase/public-server'
import { rowToProperty, type PropertyRow } from '@/lib/property-db'
import { formatPrice, OPERATION_LABELS, parseImages, STATUS_LABELS, TYPE_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { PropertyImageViewer } from '@/components/properties/PropertyImageViewer'

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  disponible: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reservado: 'bg-amber-50 text-amber-700 border-amber-200',
  vendido: 'bg-stone-100 text-stone-500 border-stone-200',
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createPublicSupabase()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (error) throw error
  if (!data) notFound()

  const property = rowToProperty(data as PropertyRow)

  const images = parseImages(property.images)
  const floorLabel = property.floor?.trim()
  const elevatorLabel = property.elevator?.trim().toLowerCase()
  const hasElevator =
    elevatorLabel === 'si' ||
    elevatorLabel === 'sí' ||
    elevatorLabel === 'con ascensor' ||
    elevatorLabel === 'true'
  const showFloorCard = Boolean(floorLabel || hasElevator)
  const whatsappText = `Hola! Me gustaría solicitar información sobre ${property.title}`
  const whatsappUrl = `https://wa.me/34672804286?text=${encodeURIComponent(whatsappText)}`
  const featureItems = [
    { label: 'Tipo de inmueble', value: TYPE_LABELS[property.type] || property.type },
    { label: 'Disponibilidad', value: property.availability },
    { label: 'Agua caliente', value: property.hotWater },
    { label: 'Calefacción', value: property.heating },
    { label: 'Estado', value: property.condition },
    { label: 'Antigüedad', value: property.propertyAge },
    { label: 'Garaje', value: property.garage },
    { label: 'Ascensor', value: property.elevator },
    { label: 'Amueblado', value: property.furnished },
    {
      label: 'Energía',
      value:
        property.energyRating || property.energyValue != null
          ? `${property.energyRating ?? '-'}${property.energyValue != null ? ` · ${property.energyValue} kg CO₂/m²/año` : ''}`
          : null,
    },
    {
      label: 'Emisiones',
      value:
        property.emissionsRating || property.emissionsValue != null
          ? `${property.emissionsRating ?? '-'}${property.emissionsValue != null ? ` · ${property.emissionsValue} kg CO₂/m²/año` : ''}`
          : null,
    },
  ].filter((item) => item.value)

  return (
    <div className="pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-stone-400">
          <Link href="/" className="hover:text-stone-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/propiedades" className="hover:text-stone-600 transition-colors">Propiedades</Link>
          <span>/</span>
          <span className="text-stone-600 truncate max-w-[200px]">{property.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* LEFT: Images + description */}
          <div className="lg:col-span-3">
            <PropertyImageViewer images={images} title={property.title} />

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-display text-2xl font-light text-stone-900 mb-4">Descripción</h2>
              <p className="text-stone-600 leading-relaxed text-sm">{property.description}</p>
            </div>

            {featureItems.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-light text-stone-900 mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featureItems.map((item) => (
                    <div key={item.label} className="border border-stone-100 p-4">
                      <p className="text-xs uppercase tracking-wide text-stone-400 mb-1">{item.label}</p>
                      <p className="text-sm text-stone-700 font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Info panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {/* Status + type */}
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                  'text-xs font-medium px-2.5 py-1 border',
                  statusColors[property.status] || statusColors.disponible
                )}>
                  {STATUS_LABELS[property.status] || property.status}
                </span>
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1">
                  {TYPE_LABELS[property.type] || property.type}
                </span>
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1">
                  {OPERATION_LABELS[property.operation || 'venta'] || property.operation || 'Venta'}
                </span>
              </div>

              <h1 className="font-display text-3xl font-light text-stone-900 leading-tight mb-2">
                {property.title}
              </h1>

              <p className="text-stone-500 text-sm mb-6 flex items-center gap-1">
                📍 {property.location}
              </p>

              {/* Price */}
              <div className="bg-stone-50 border border-stone-200 p-6 mb-6">
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Precio</p>
                <p className="font-display text-4xl font-light text-stone-900">
                  {formatPrice(property.price, property.operation)}
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {property.sqMeters && (
                  <div className="text-center p-4 border border-stone-100">
                    <p className="text-xl font-light text-stone-900">{property.sqMeters}</p>
                    <p className="text-xs text-stone-400 mt-1">m²</p>
                  </div>
                )}
                {property.bedrooms != null && property.bedrooms > 0 && (
                  <div className="text-center p-4 border border-stone-100">
                    <p className="text-xl font-light text-stone-900">{property.bedrooms}</p>
                    <p className="text-xs text-stone-400 mt-1">Habitaciones</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-4 border border-stone-100">
                    <p className="text-xl font-light text-stone-900">{property.bathrooms}</p>
                    <p className="text-xs text-stone-400 mt-1">Baños</p>
                  </div>
                )}
                {showFloorCard && (
                  <div className="text-center p-4 border border-stone-100">
                    <p className="text-xl font-light text-stone-900">{floorLabel || '-'}</p>
                    <p className="text-xs text-stone-400 mt-1">Planta</p>
                    {hasElevator && (
                      <p className="text-[11px] text-stone-500 mt-1">con ascensor</p>
                    )}
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center text-sm py-4"
                >
                  Solicitar información
                </a>
                {property.fotocasaUrl && (
                  <a
                    href={property.fotocasaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center text-sm py-4 border border-[#69BE28] text-[#69BE28] hover:bg-[#69BE28] hover:text-white transition-colors duration-200"
                  >
                    Ver en Idealista ↗
                  </a>
                )}
                <a
                  href="tel:+34672804286"
                  className="block text-center text-sm text-stone-500 hover:text-stone-900 transition-colors py-2"
                >
                  📞 +34 672 80 42 86
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-16">
        <Link href="/propiedades" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
          ← Volver a propiedades
        </Link>
      </div>
    </div>
  )
}
