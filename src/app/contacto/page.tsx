'use client'

import { useState } from 'react'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const mapsHref = 'https://maps.google.com/?q=Carretera+de+Alicun+28,+Pl.+Archivo+de+Indias,+4,+04740+Roquetas+de+Mar,+Almeria'
  const phoneDisplay = '672 80 42 86'
  const phoneHref = 'tel:+34672804286'
  const email = 'alessandra.maggi@remax.es'
  const emailHref = `mailto:${email}`
  const whatsappDisplay = '+34 672 80 42 86'
  const whatsappHref = 'https://wa.me/34672804286'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.nombre,
          email: form.email,
          phone: form.telefono || 'No facilitado',
          notes: form.mensaje,
          source: 'web_contacto',
          intent: 'comprar',
          priority: 'media',
        }),
      })
      if (!res.ok) {
        throw new Error('No se pudo enviar el mensaje')
      }
      setSent(true)
    } catch {
      setError('No se pudo enviar el formulario. Prueba de nuevo en unos minutos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-stone-950 text-white py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Estamos aquí</p>
          <h1 className="font-display text-5xl md:text-6xl font-light">Contacto</h1>
          <p className="text-stone-400 mt-4 text-lg font-light max-w-md">
            Escríbeme o llámame. Te respondo en menos de 24 horas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 p-10 text-center">
                <span className="text-4xl mb-4 block">✓</span>
                <h3 className="font-medium text-emerald-800 text-lg mb-2">Mensaje enviado</h3>
                <p className="text-emerald-600 text-sm">
                  Nos pondremos en contacto contigo en las próximas horas.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nombre: '', email: '', telefono: '', mensaje: '' }) }}
                  className="mt-6 text-sm text-emerald-700 underline hover:no-underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-3xl font-light text-stone-900 mb-8">Envíame un mensaje</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-stone-500 tracking-wide block mb-2">Nombre *</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                      className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 tracking-wide block mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                      className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 tracking-wide block mb-2">Teléfono</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-500 tracking-wide block mb-2">Mensaje *</label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Cuéntanos qué necesitas..."
                    className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
                {error && (
                  <p className="text-xs text-red-600 text-center">
                    {error}
                  </p>
                )}

                <p className="text-xs text-stone-400 text-center">
                  Al enviar aceptas nuestra política de privacidad.
                </p>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-3xl font-light text-stone-900 mb-8">Información</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-xl shrink-0">📍</span>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wide mb-1">Dirección</p>
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-700 text-sm whitespace-pre-line hover:text-stone-900 transition-colors"
                    >
                      Carretera de Alicún 28, Pl. Archivo de Indias, 4
                      <br />
                      04740 Roquetas de Mar, Almería
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-xl shrink-0">📞</span>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wide mb-1">Teléfono</p>
                    <a href={phoneHref} className="text-stone-700 text-sm hover:text-stone-900 transition-colors">
                      {phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-xl shrink-0">✉️</span>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wide mb-1">Email</p>
                    <a href={emailHref} className="text-stone-700 text-sm hover:text-stone-900 transition-colors break-all">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="shrink-0 mt-0.5 text-[#25D366]" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.42 0 .05 5.36.05 11.96c0 2.1.55 4.16 1.6 5.97L0 24l6.24-1.63a11.9 11.9 0 0 0 5.78 1.48h.01c6.6 0 11.97-5.36 11.97-11.96 0-3.2-1.25-6.22-3.48-8.41Zm-8.5 18.35h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.7.97.99-3.6-.23-.37a9.92 9.92 0 0 1-1.52-5.28c0-5.5 4.47-9.97 9.98-9.97 2.66 0 5.17 1.04 7.05 2.92a9.9 9.9 0 0 1 2.92 7.05c0 5.5-4.48 9.98-9.99 9.98Zm5.47-7.49c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.43-1.49-.9-.8-1.51-1.79-1.69-2.09-.18-.3-.02-.46.14-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.66-.94-2.28-.25-.6-.5-.52-.69-.53l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.26 5.15 4.57.72.31 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.18-1.44-.08-.13-.28-.2-.58-.35Z"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wide mb-1">WhatsApp</p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-700 text-sm hover:text-stone-900 transition-colors"
                    >
                      {whatsappDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-xl shrink-0">🕐</span>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wide mb-1">Horario</p>
                    <p className="text-stone-700 text-sm whitespace-pre-line">Lun–Vie: 9:30–14:00 · 17:00–20:00
Sáb–Dom: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="border-t border-stone-100 pt-8">
              <p className="text-xs text-stone-400 tracking-widest uppercase mb-4">Redes sociales</p>
              <div className="flex gap-4">
                {[
                  { name: 'WhatsApp', href: whatsappHref },
                  { name: 'Google Maps', href: mapsHref },
                  { name: 'Email', href: emailHref },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
