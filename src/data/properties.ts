import type { Property } from '@/types'

const now = new Date('2026-05-28T12:00:00.000Z')

/** Catálogo demo en archivo (sin Supabase). Añade URLs en `images` cuando tengas las fotos. */
export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'alcorcon-fuente-cisneros',
    title: 'Piso de 3 dormitorios en Fuente Cisneros, Alcorcón',
    price: 450_000,
    location: 'Alcorcón (Madrid)',
    type: 'piso',
    operation: 'venta',
    status: 'disponible',
    description: `Ref: 555768252 · Ref: 920.

En la exclusiva y tranquila zona de Fuente Cisneros, en Alcorcón, a escasos minutos de Móstoles y el Parque Oeste, se vende esta fantástica vivienda de 3 dormitorios y 2 baños completos, uno de ellos en suite.

El piso cuenta con puerta de acceso acorazada, suelo porcelánico en todas las estancias, ventanas climalit oscilobatientes, aire acondicionado por conductos, calefacción de gas natural con caldera nueva, tomas de internet en todas las habitaciones y terraza cerrada con vistas a zonas comunes.

La urbanización dispone de dos piscinas, dos pistas de pádel, zonas infantiles, mesas de ping-pong, salas de reunión, Citibox y portería con vigilancia 24 h.

Incluye trastero (~6 m²), plaza de garaje (~40 m², dos vehículos) e instalación para cargador de vehículo eléctrico. Portal con doble ascensor.

Contacto: Angel · ${'606 62 07 76'}.`,
    images: JSON.stringify([
      '/images/casa-alcorcon-1.webp',
      '/images/casa-alcorcon-2.webp',
      '/images/casa-alcorcon-3.webp',
    ]),
    fotocasaUrl:
      'https://www.fotocasa.es/es/comprar/vivienda/alcorcon/aire-acondicionado-calefaccion-terraza-zona-comunitaria-ascensor-internet-piscina-no-amueblado/187435568/d',
    bedrooms: 3,
    bathrooms: 2,
    sqMeters: 117,
    availability: 'Sin restricciones',
    hotWater: 'Gas natural',
    heating: 'Gas natural',
    condition: 'Buen estado',
    floor: '2ª planta',
    garage: 'Plaza de garaje (2 vehículos)',
    elevator: 'Sí',
    furnished: 'No',
    featured: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'solar-navaltoril',
    title: 'Solar en Navaltoril, Robledo del Mazo',
    price: 35_000,
    location: 'Navaltoril, Robledo del Mazo (Toledo)',
    type: 'terreno',
    operation: 'venta',
    status: 'disponible',
    description: `Ref: 595285839 · Ref: 301.

Solar en Navaltoril, pedanía de Robledo del Mazo, vallado y de semiesquina. Superficie de 625 m².

Posibilidad de adquirir, de manera adicional, otro solar de semiesquina de 625 m² justo enfrente de la vivienda por 40.000 € adicionales (consultar con la agencia).

Zona inmejorable en el Valle del Gévalo, Parque Natural de Cabañeros.

Contacto: Angel · ${'606 62 07 76'}.`,
    images: JSON.stringify([
      '/images/solar_navaltoril_1.webp',
      '/images/solar_navaltoril_2.webp',
      '/images/solar_navaltoril_3.webp',
    ]),
    fotocasaUrl: 'https://www.fotocasa.es/es/comprar/terrenos/robledo-del-mazo/todas-las-zonas/l',
    bedrooms: null,
    bathrooms: null,
    sqMeters: 625,
    availability: 'Sin restricciones',
    featured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'casa-navaltoril-robledo',
    title: 'Casa con parcela en Navaltoril, Robledo del Mazo',
    price: 140_000,
    location: 'Robledo del Mazo (Toledo)',
    type: 'casa',
    operation: 'venta',
    status: 'disponible',
    description: `En Navaltoril, pedanía de Robledo del Mazo, en un paraje de ensueño, se vende esta magnífica casa de altos techos con 4 habitaciones y baño con plato de ducha.

Completan la vivienda la zona de tránsito con dos armarios empotrados, el salón-comedor y una cocina con chimenea de piedra (también calefacción por gasóleo).

Parcela de 372 m², circundada por muro y con portón de acceso. En el exterior: porche, patio con horno-barbacoa y dos edificios anejos de almacén.

Desde el patio hay acceso a finca agrícola «Las Hoyas» (+2.100 m²), que se vende de manera conjunta con la vivienda.

Posibilidad de adquirir solar adicional de 625 m² enfrente por 40.000 € (consultar).

Certificación energética G.

Contacto: Angel · ${'606 62 07 76'}.`,
    images: JSON.stringify([
      '/images/casa_chalet_robledo_mazo_1.webp',
      '/images/casa_chalet_robledo_mazo_2.webp',
      '/images/casa_chalet_robledo_mazo.webp',
    ]),
    fotocasaUrl:
      'https://www.fotocasa.es/es/comprar/vivienda/robledo-del-mazo/calefaccion-patio-amueblado/189680916/d',
    bedrooms: 4,
    bathrooms: 1,
    sqMeters: 372,
    availability: 'Sin restricciones',
    hotWater: 'Gasóleo',
    heating: 'Gasóleo',
    condition: 'Buen estado',
    elevator: 'No',
    furnished: 'Sí',
    energyRating: 'G',
    energyValue: 999,
    emissionsRating: 'G',
    emissionsValue: 999,
    featured: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
]
