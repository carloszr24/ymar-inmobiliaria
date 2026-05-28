import { Suspense } from 'react'
import { filterProperties, getAllProperties } from '@/lib/properties-store'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyFilters } from '@/components/properties/PropertyFilters'

interface SearchParams {
  type?: string
  operation?: string
  status?: string
  minPrice?: string
  maxPrice?: string
  extra?: string
}

export default function PropiedadesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const properties = filterProperties(getAllProperties(), searchParams)

  return (
    <div className="pt-16">
      <div className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <h1 className="font-display text-4xl font-semibold text-stone-900">Propiedades</h1>
          <p className="mt-2 text-sm text-stone-500">
            {properties.length} inmueble{properties.length !== 1 ? 's' : ''} disponible
            {properties.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="skeleton h-40 w-full" />}>
        <PropertyFilters />
      </Suspense>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        {properties.length === 0 ? (
          <div className="border border-dashed border-stone-200 py-32 text-center">
            <p className="mb-2 text-lg text-stone-400">Sin resultados</p>
            <p className="mb-6 text-sm text-stone-400">Prueba ajustando los filtros o explora todo el catálogo</p>
            <a href="/propiedades" className="btn-primary px-8 py-3 text-sm">
              Ver todas las propiedades
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
