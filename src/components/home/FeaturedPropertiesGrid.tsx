import { Property } from '@/types'
import { PropertyCard } from '@/components/properties/PropertyCard'

interface FeaturedPropertiesGridProps {
  properties: Property[]
}

/** Sin animación ni opacity inline: evita tarjetas invisibles tras hidratación (SSR + opacity:0 + animate). */
export function FeaturedPropertiesGrid({ properties }: FeaturedPropertiesGridProps) {
  const gridCols =
    properties.length >= 3
      ? 'lg:grid-cols-3'
      : properties.length === 2
        ? 'lg:grid-cols-2'
        : 'lg:grid-cols-1 lg:max-w-md lg:mx-auto'

  return (
    <div>
      <div className="overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
        <div className={`flex gap-5 md:gap-7 lg:grid ${gridCols} lg:gap-7`}>
          {properties.map((property) => (
            <div
              key={property.id}
              className="snap-start shrink-0 w-[86vw] sm:w-[68vw] md:w-[52%] lg:w-auto lg:min-w-0"
            >
              <PropertyCard property={property} variant="featuredMinimal" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
