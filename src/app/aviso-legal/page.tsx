import Link from 'next/link'
import { AGENT, CONTACT, LEGAL, hasEmail } from '@/lib/contact'

export const metadata = {
  title: `Aviso legal | ${AGENT.name}`,
  description: `Información legal y protección de datos de ${AGENT.name}.`,
}

export default function AvisoLegalPage() {
  return (
    <div className="pt-24 md:pt-[8.5rem]">
      <div className="bg-stone-950 text-white py-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl font-light">Aviso legal y privacidad</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 prose prose-stone prose-sm max-w-none">
        <section className="mb-10">
          <h2 className="font-display text-2xl text-stone-900 mb-4">Titular del sitio web</h2>
          <p className="text-stone-600 leading-relaxed">
            {LEGAL.ownerName}, {LEGAL.legalForm}.
            {LEGAL.taxId ? ` DNI/NIF: ${LEGAL.taxId}.` : ''} Domicilio profesional: {LEGAL.address}.
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            Denominación comercial: <strong>{AGENT.name}</strong>.
          </p>
          {hasEmail && (
            <p className="text-stone-600 leading-relaxed mt-3">
              Correo de contacto:{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-brand-red hover:underline">
                {CONTACT.email}
              </a>
            </p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-stone-900 mb-4">Objeto</h2>
          <p className="text-stone-600 leading-relaxed">
            Este sitio web tiene carácter informativo y comercial. Su finalidad es presentar los servicios
            inmobiliarios de {AGENT.name} y facilitar el contacto con clientes interesados en compra, venta,
            alquiler o asesoramiento relacionado con inmuebles.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-stone-900 mb-4">Protección de datos</h2>
          <p className="text-stone-600 leading-relaxed">
            Los datos personales facilitados a través de los formularios de contacto serán tratados por el
            titular con la finalidad de atender solicitudes de información, gestionar consultas y mantener la
            relación comercial. La base legal es el consentimiento del interesado y la ejecución de medidas
            precontractuales.
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            Los datos se conservarán el tiempo necesario para cumplir la finalidad indicada y las obligaciones
            legales aplicables. El usuario puede ejercer sus derechos de acceso, rectificación, supresión,
            oposición, limitación y portabilidad escribiendo al correo de contacto indicado.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl text-stone-900 mb-4">Propiedad intelectual</h2>
          <p className="text-stone-600 leading-relaxed">
            Los contenidos de este sitio web, incluidos textos, imágenes, logotipos y diseño, son propiedad de{' '}
            {AGENT.name} o de terceros que han autorizado su uso, quedando prohibida su reproducción sin
            autorización expresa.
          </p>
        </section>

        <p className="text-stone-500 text-sm">
          <Link href="/contacto" className="text-brand-red hover:underline">
            Volver a contacto
          </Link>
        </p>
      </div>
    </div>
  )
}
