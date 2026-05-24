'use client'

import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    icon: '🏠',
    title: 'Compra y venta',
    desc: 'Gestionamos todo el proceso de compraventa, desde la búsqueda hasta la firma en notaría. Negociamos en tu nombre para obtener las mejores condiciones.',
  },
  {
    icon: '📊',
    title: 'Valoración de inmuebles',
    desc: 'Estudio de mercado riguroso para conocer el precio real de tu propiedad. Sin compromisos, con total transparencia.',
  },
  {
    icon: '💼',
    title: 'Asesoramiento jurídico',
    desc: 'Revisión de contratos, verificación registral y acompañamiento legal en todo el proceso. Tu seguridad es nuestra prioridad.',
  },
  {
    icon: '🔑',
    title: 'Gestión post-venta',
    desc: 'Nuestro servicio no termina con la firma. Te ayudamos con cambios de suministros, reformas y cualquier gestión posterior.',
  },
  {
    icon: '🏦',
    title: 'Financiación',
    desc: 'Colaboramos con las principales entidades bancarias para conseguirte la mejor hipoteca adaptada a tu situación.',
  },
  {
    icon: '🌐',
    title: 'Inversión internacional',
    desc: 'Asesoramiento especializado para compradores internacionales. Servicios en español, inglés y francés.',
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="pt-16">
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
            <h2 className="section-title">Nuestros servicios</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white p-8 border border-stone-100 hover:border-gold transition-colors duration-300 group"
              >
                <span className="text-3xl mb-5 block">{service.icon}</span>
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
            {/* Left: text + RE/MAX badge */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">El equipo</p>
                <h2 className="section-title mb-2">Alessandra Maggi</h2>
                <p className="text-stone-500 text-base md:text-lg font-medium mb-8">Agente asociada RE/MAX en Almería</p>

                <div className="space-y-6 text-stone-600 text-lg leading-relaxed mb-10">
                  <p>
                    Soy agente inmobiliaria especializada en Almería, y mi forma de trabajar se basa
                    en la cercanía, la transparencia y una visión estratégica de cada operación.
                    Mi prioridad es que cada cliente se sienta acompañado con claridad y confianza
                    desde el primer contacto.
                  </p>
                  <p>
                    Trabajo cada proceso de principio a fin: análisis realista del mercado, estrategia
                    de comercialización y negociación orientada a proteger tus intereses y maximizar
                    el valor de cada decisión.
                  </p>
                  <p>
                    Como agente asociada RE/MAX, he reforzado mi método con formación específica en
                    comercialización y cierre, captación en exclusiva, trabajo con compradores y el
                    modelo profesional del agente inmobiliario RE/MAX. Ese enfoque me permite ofrecer
                    un servicio sólido, personalizado y enfocado en resultados.
                  </p>
                </div>

                {/* RE/MAX badge */}
                <div className="mt-6">
                  <a
                    href="https://www.remax.es/buscador-de-agentes/almeria/roquetas-de-mar/todos/alessandra-maggi-18639/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/remax.certified-agent.png"
                      alt="RE/MAX Certified Agent"
                      width={240}
                      height={120}
                      className="h-auto w-56 object-contain hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: photo */}
            <div className="relative w-full max-w-[680px] ml-auto">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/alessandra-maggi.png"
                  alt="Alessandra Maggi, agente inmobiliaria en Almería"
                  fill
                  className="object-cover object-top"
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
