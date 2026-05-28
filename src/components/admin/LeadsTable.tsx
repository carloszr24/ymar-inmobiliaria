'use client'

import { useState } from 'react'
import { Lead, LeadEstado, LeadTemperatura } from '@/types/leads'
import {
  updateLeadEstado,
  updateLeadTemperatura,
  updateLeadNotas,
  deleteLead,
} from '@/app/actions/leads'

const TEMPERATURA_CONFIG = {
  caliente: { label: '🔥 Caliente', class: 'bg-red-100 text-red-700' },
  tibio: { label: '🌤 Tibio', class: 'bg-yellow-100 text-yellow-700' },
  frio: { label: '❄️ Frío', class: 'bg-blue-100 text-blue-700' },
}

const ESTADO_CONFIG = {
  nuevo: { label: 'Nuevo', class: 'bg-gray-100 text-gray-700' },
  llamado: { label: 'Llamado', class: 'bg-blue-100 text-blue-700' },
  en_negociacion: { label: 'En negociación', class: 'bg-purple-100 text-purple-700' },
  cerrado: { label: 'Cerrado', class: 'bg-green-100 text-green-700' },
  descartado: { label: 'Descartado', class: 'bg-red-100 text-red-400' },
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroTemperatura, setFiltroTemperatura] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [leadDetalle, setLeadDetalle] = useState<Lead | null>(null)
  const [editandoNotas, setEditandoNotas] = useState('')
  const [guardandoNotas, setGuardandoNotas] = useState(false)

  const leadsFiltrados = leads.filter((l) => {
    if (filtroTipo !== 'todos' && l.tipo !== filtroTipo) return false
    if (filtroEstado !== 'todos' && l.estado !== filtroEstado) return false
    if (filtroTemperatura !== 'todos' && l.temperatura !== filtroTemperatura)
      return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !l.nombre.toLowerCase().includes(q) &&
        !l.telefono.includes(q) &&
        !l.email?.toLowerCase().includes(q) &&
        !l.notas?.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  async function handleEstado(id: string, estado: LeadEstado) {
    await updateLeadEstado(id, estado)
    if (leadDetalle?.id === id) setLeadDetalle({ ...leadDetalle, estado })
  }

  async function handleTemperatura(id: string, temperatura: LeadTemperatura) {
    await updateLeadTemperatura(id, temperatura)
    if (leadDetalle?.id === id) setLeadDetalle({ ...leadDetalle, temperatura })
  }

  async function handleGuardarNotas() {
    if (!leadDetalle) return
    setGuardandoNotas(true)
    await updateLeadNotas(leadDetalle.id, editandoNotas)
    setLeadDetalle({ ...leadDetalle, notas: editandoNotas })
    setGuardandoNotas(false)
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este contacto?')) return
    await deleteLead(id)
    setLeadDetalle(null)
  }

  function abrirDetalle(lead: Lead) {
    setLeadDetalle(lead)
    setEditandoNotas(lead.notas || '')
  }

  // Stats rápidas
  const stats = {
    total: leads.length,
    calientes: leads.filter((l) => l.temperatura === 'caliente').length,
    nuevos: leads.filter((l) => l.estado === 'nuevo').length,
    cerrados: leads.filter((l) => l.estado === 'cerrado').length,
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: '🔥 Calientes', value: stats.calientes, color: 'text-red-600' },
          { label: 'Nuevos', value: stats.nuevos, color: 'text-blue-600' },
          { label: 'Cerrados', value: stats.cerrados, color: 'text-green-600' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-100 p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, teléfono, email..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="flex flex-wrap gap-2">
          {/* Tipo */}
          {['todos', 'comprador', 'vendedor'].map((v) => (
            <button
              key={v}
              onClick={() => setFiltroTipo(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filtroTipo === v
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {v === 'todos' ? 'Todos' : v === 'comprador' ? 'Compradores' : 'Vendedores'}
            </button>
          ))}
          <span className="text-gray-200">|</span>
          {/* Temperatura */}
          {['todos', 'caliente', 'tibio', 'frio'].map((v) => (
            <button
              key={v}
              onClick={() => setFiltroTemperatura(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filtroTemperatura === v
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {v === 'todos'
                ? 'Toda temperatura'
                : TEMPERATURA_CONFIG[v as LeadTemperatura]?.label}
            </button>
          ))}
          <span className="text-gray-200">|</span>
          {/* Estado */}
          {[
            'todos',
            'nuevo',
            'llamado',
            'en_negociacion',
            'cerrado',
            'descartado',
          ].map((v) => (
            <button
              key={v}
              onClick={() => setFiltroEstado(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filtroEstado === v
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {v === 'todos' ? 'Todos los estados' : ESTADO_CONFIG[v as LeadEstado]?.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          {leadsFiltrados.length} resultado{leadsFiltrados.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de leads — diseño de cards para móvil */}
      <div className="space-y-2">
        {leadsFiltrados.map((lead) => (
          <div
            key={lead.id}
            onClick={() => abrirDetalle(lead)}
            className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:border-gray-300 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900 truncate">
                    {lead.nombre}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${TEMPERATURA_CONFIG[lead.temperatura].class}`}
                  >
                    {TEMPERATURA_CONFIG[lead.temperatura].label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_CONFIG[lead.estado].class}`}
                  >
                    {ESTADO_CONFIG[lead.estado].label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <a
                    href={`tel:${lead.telefono}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    {lead.telefono}
                  </a>
                  <span className="text-xs text-gray-400 capitalize">{lead.fuente}</span>
                  <span className="text-xs text-gray-400 capitalize">{lead.tipo}</span>
                </div>
                {(lead.properties?.titulo || lead.propiedad_texto) && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    🏠 {lead.properties?.titulo || lead.propiedad_texto}
                  </p>
                )}
                {lead.notas && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{lead.notas}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                {new Date(lead.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {leadsFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No hay contactos con estos filtros
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {leadDetalle && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setLeadDetalle(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{leadDetalle.nombre}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(leadDetalle.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setLeadDetalle(null)}
                  className="text-gray-400 hover:text-black text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Contacto */}
              <div className="space-y-2">
                <a
                  href={`tel:${leadDetalle.telefono}`}
                  className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-xl font-medium text-sm hover:bg-green-100 transition"
                >
                  📞 Llamar — {leadDetalle.telefono}
                </a>
                {leadDetalle.email && (
                  <a
                    href={`mailto:${leadDetalle.email}`}
                    className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-medium text-sm hover:bg-blue-100 transition"
                  >
                    ✉️ {leadDetalle.email}
                  </a>
                )}
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Tipo</p>
                  <p className="font-medium capitalize">{leadDetalle.tipo}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Fuente</p>
                  <p className="font-medium capitalize">{leadDetalle.fuente}</p>
                </div>
              </div>

              {/* Propiedad */}
              {(leadDetalle.properties?.titulo || leadDetalle.propiedad_texto) && (
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  <p className="text-xs text-gray-400 mb-0.5">Propiedad de interés</p>
                  <p className="font-medium">
                    {leadDetalle.properties?.titulo || leadDetalle.propiedad_texto}
                  </p>
                  {leadDetalle.properties?.precio && (
                    <p className="text-gray-500 text-xs mt-0.5">
                      {leadDetalle.properties.precio}
                    </p>
                  )}
                </div>
              )}

              {/* Temperatura */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                  Temperatura
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    Object.entries(TEMPERATURA_CONFIG) as [
                      LeadTemperatura,
                      (typeof TEMPERATURA_CONFIG)[LeadTemperatura],
                    ][]
                  ).map(([val, cfg]) => (
                    <button
                      key={val}
                      onClick={() => handleTemperatura(leadDetalle.id, val)}
                      className={`py-2 rounded-lg text-xs font-medium border transition ${
                        leadDetalle.temperatura === val
                          ? cfg.class + ' border-current'
                          : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                  Estado
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(ESTADO_CONFIG) as [
                      LeadEstado,
                      (typeof ESTADO_CONFIG)[LeadEstado],
                    ][]
                  ).map(([val, cfg]) => (
                    <button
                      key={val}
                      onClick={() => handleEstado(leadDetalle.id, val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        leadDetalle.estado === val
                          ? cfg.class + ' border-current'
                          : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                  Notas
                </p>
                <textarea
                  value={editandoNotas}
                  onChange={(e) => setEditandoNotas(e.target.value)}
                  rows={3}
                  placeholder="Añade notas sobre este contacto..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                <button
                  onClick={handleGuardarNotas}
                  disabled={guardandoNotas || editandoNotas === (leadDetalle.notas || '')}
                  className="mt-2 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-black disabled:opacity-40 transition"
                >
                  {guardandoNotas ? 'Guardando...' : 'Guardar notas'}
                </button>
              </div>

              {/* Eliminar */}
              <button
                onClick={() => handleEliminar(leadDetalle.id)}
                className="w-full text-red-500 text-sm py-2 hover:bg-red-50 rounded-lg transition"
              >
                Eliminar contacto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
