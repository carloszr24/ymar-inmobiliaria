'use client'

import { useState } from 'react'
import {
  Property,
  LeadFormInput,
  LeadTipo,
  LeadTemperatura,
  LeadFuente,
} from '@/types/leads'
import { createLead } from '@/app/actions/leads'

const TEMPERATURA_CONFIG = {
  caliente: { label: '🔥 Caliente', class: 'bg-red-100 text-red-700 border-red-200' },
  tibio: { label: '🌤 Tibio', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  frio: { label: '❄️ Frío', class: 'bg-blue-100 text-blue-700 border-blue-200' },
}

const FUENTE_OPTIONS: { value: LeadFuente; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'web', label: 'Web' },
  { value: 'recomendacion', label: 'Recomendación' },
  { value: 'otro', label: 'Otro' },
]

interface Props {
  properties: Property[]
  onSuccess: () => void
}

export default function NuevoLeadForm({ properties, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [tipo, setTipo] = useState<LeadTipo>('comprador')
  const [temperatura, setTemperatura] = useState<LeadTemperatura>('tibio')
  const [fuente, setFuente] = useState<LeadFuente>('facebook')
  const [propiedadId, setPropiedadId] = useState('')
  const [propiedadTexto, setPropiedadTexto] = useState('')
  const [notas, setNotas] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const input: LeadFormInput = {
      nombre,
      telefono,
      email: email || undefined,
      tipo,
      temperatura,
      fuente,
      propiedad_id: propiedadId || undefined,
      propiedad_texto: !propiedadId ? propiedadTexto : undefined,
      notas: notas || undefined,
    }

    const result = await createLead(input)

    if (result.success) {
      // Reset
      setNombre('')
      setTelefono('')
      setEmail('')
      setPropiedadId('')
      setPropiedadTexto('')
      setNotas('')
      setTipo('comprador')
      setTemperatura('tibio')
      setFuente('facebook')
      onSuccess()
    } else {
      setError(result.error || 'Error al guardar')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo de contacto */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Tipo
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['comprador', 'vendedor'] as LeadTipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                tipo === t
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {t === 'comprador' ? '🏠 Comprador' : '💰 Vendedor'}
            </button>
          ))}
        </div>
      </div>

      {/* Datos básicos */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Nombre *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Nombre y apellidos"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Teléfono *
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          placeholder="6XX XXX XXX"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="opcional"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Propiedad de interés */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Propiedad de interés
        </label>
        <select
          value={propiedadId}
          onChange={(e) => {
            setPropiedadId(e.target.value)
            if (e.target.value) setPropiedadTexto('')
          }}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
        >
          <option value="">Seleccionar propiedad...</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.titulo} {p.precio ? `— ${p.precio}` : ''}
            </option>
          ))}
          <option value="">Otra (escribe abajo)</option>
        </select>
        {!propiedadId && (
          <input
            type="text"
            value={propiedadTexto}
            onChange={(e) => setPropiedadTexto(e.target.value)}
            placeholder="Describe la propiedad si no está en la lista"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        )}
      </div>

      {/* Temperatura */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Temperatura del lead
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            Object.entries(TEMPERATURA_CONFIG) as [
              LeadTemperatura,
              (typeof TEMPERATURA_CONFIG)[LeadTemperatura],
            ][]
          ).map(([val, cfg]) => (
            <button
              key={val}
              type="button"
              onClick={() => setTemperatura(val)}
              className={`py-2 rounded-lg text-xs font-medium border transition ${
                temperatura === val
                  ? cfg.class + ' border-current'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fuente */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          De dónde viene
        </label>
        <div className="flex flex-wrap gap-2">
          {FUENTE_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFuente(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                fuente === f.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Notas
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          placeholder="Qué busca, presupuesto, observaciones..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
      >
        {loading ? 'Guardando...' : 'Guardar contacto'}
      </button>
    </form>
  )
}
