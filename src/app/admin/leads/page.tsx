'use client'

import { useEffect, useMemo, useState } from 'react'
import { hoursToFirstResponse, isLeadInSla, LEAD_PRIORITY_LABELS, LEAD_STATUS_LABELS } from '@/lib/leads'
import type { Lead } from '@/types'

const SLA_TARGET_MINUTES = 15

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})
  const [newLead, setNewLead] = useState({
    fullName: '',
    phone: '',
    source: 'facebook',
    intent: 'comprar',
    notes: '',
  })

  const fetchLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', { credentials: 'include' })
      const data = await res.json().catch(() => [])
      if (!res.ok) throw new Error('Error cargando leads')
      setLeads(
        (data as Lead[]).map((lead) => ({
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
          firstResponseAt: lead.firstResponseAt ? new Date(lead.firstResponseAt) : null,
          lastContactAt: lead.lastContactAt ? new Date(lead.lastContactAt) : null,
        }))
      )
    } catch {
      setError('No se pudieron cargar los leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const weeklyMetrics = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const weekLeads = leads.filter((lead) => lead.createdAt.getTime() >= sevenDaysAgo)
    const contacted24h = weekLeads.filter((lead) => {
      if (!lead.firstResponseAt) return false
      return lead.firstResponseAt.getTime() - lead.createdAt.getTime() <= 24 * 60 * 60 * 1000
    }).length
    const contactedRate = weekLeads.length ? Math.round((contacted24h / weekLeads.length) * 100) : 0

    const meanFirstResponseHours = weekLeads
      .map(hoursToFirstResponse)
      .filter((v): v is number => v !== null)
    const avgFirstResponse = meanFirstResponseHours.length
      ? (meanFirstResponseHours.reduce((acc, value) => acc + value, 0) / meanFirstResponseHours.length).toFixed(2)
      : 'N/D'

    const visitStageCount = weekLeads.filter((lead) =>
      ['visita_agendada', 'visita_realizada', 'oferta', 'reserva', 'cerrado'].includes(lead.status)
    ).length
    const visitRate = weekLeads.length ? Math.round((visitStageCount / weekLeads.length) * 100) : 0

    const closedCount = weekLeads.filter((lead) => lead.status === 'cerrado').length
    const closeRate = weekLeads.length ? Math.round((closedCount / weekLeads.length) * 100) : 0

    return {
      incoming: weekLeads.length,
      avgFirstResponse,
      contactedRate,
      visitRate,
      closeRate,
    }
  }, [leads])

  const updateLead = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, ...payload }),
    })
    if (!res.ok) throw new Error('Error al actualizar')
    const updated = await res.json() as Lead
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
            ...updated,
            createdAt: new Date(updated.createdAt),
            updatedAt: new Date(updated.updatedAt),
            firstResponseAt: updated.firstResponseAt ? new Date(updated.firstResponseAt) : null,
            lastContactAt: updated.lastContactAt ? new Date(updated.lastContactAt) : null,
          }
          : lead
      )
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-light text-stone-900">Leads</h1>
          <p className="text-stone-500 text-sm mt-1">
            Pipeline operativo y control SLA ({SLA_TARGET_MINUTES} min primer contacto)
          </p>
        </div>
        <button type="button" className="btn-outline text-xs px-4 py-2.5" onClick={fetchLeads}>
          Actualizar
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <MetricCard label="Leads 7 dias" value={String(weeklyMetrics.incoming)} />
        <MetricCard label="Tiempo medio 1a respuesta (h)" value={String(weeklyMetrics.avgFirstResponse)} />
        <MetricCard label="% contactados <24h" value={`${weeklyMetrics.contactedRate}%`} />
        <MetricCard label="% pasan a visita" value={`${weeklyMetrics.visitRate}%`} />
        <MetricCard label="% cierre" value={`${weeklyMetrics.closeRate}%`} />
      </section>

      <section className="bg-white border border-stone-200 p-4">
        <h2 className="text-sm font-medium text-stone-900 mb-3">Alta rapida de lead manual</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            className="border border-stone-200 px-3 py-2 text-xs md:col-span-2"
            placeholder="Nombre y apellidos"
            value={newLead.fullName}
            onChange={(e) => setNewLead((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          <input
            className="border border-stone-200 px-3 py-2 text-xs"
            placeholder="Telefono"
            value={newLead.phone}
            onChange={(e) => setNewLead((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <select
            className="border border-stone-200 px-3 py-2 text-xs bg-white"
            value={newLead.source}
            onChange={(e) => setNewLead((prev) => ({ ...prev, source: e.target.value }))}
          >
            <option value="facebook">Facebook</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telefono">Telefono</option>
            <option value="otro">Otro</option>
          </select>
          <select
            className="border border-stone-200 px-3 py-2 text-xs bg-white"
            value={newLead.intent}
            onChange={(e) => setNewLead((prev) => ({ ...prev, intent: e.target.value }))}
          >
            <option value="comprar">Comprar</option>
            <option value="vender">Vender</option>
            <option value="alquilar">Alquilar</option>
            <option value="otro">Otro</option>
          </select>
          <button
            type="button"
            className="btn-primary text-xs px-4 py-2"
            onClick={async () => {
              try {
                const res = await fetch('/api/leads', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newLead),
                })
                if (!res.ok) throw new Error('error')
                setNewLead({ fullName: '', phone: '', source: 'facebook', intent: 'comprar', notes: '' })
                fetchLeads()
              } catch {
                setError('No se pudo crear el lead manual')
              }
            }}
          >
            Guardar
          </button>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white border border-stone-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-stone-400 text-sm">Cargando leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">Todavia no hay leads registrados.</div>
        ) : (
          <table className="w-full text-sm min-w-[980px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {['Lead', 'Origen', 'Interes', 'Estado', 'Prioridad', 'SLA', 'Ultimo contacto', 'Notas'].map((header) => (
                  <th key={header} className="text-left text-xs text-stone-500 font-medium px-4 py-3 tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {leads.map((lead) => {
                const inSla = isLeadInSla(lead)
                return (
                  <tr key={lead.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{lead.fullName}</p>
                      <p className="text-xs text-stone-500">{lead.phone}</p>
                      {lead.email && <p className="text-xs text-stone-500">{lead.email}</p>}
                      <p className="text-[11px] text-stone-400 mt-1">Alta: {formatDate(lead.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">{lead.source}</td>
                    <td className="px-4 py-3 text-xs text-stone-600">{lead.intent}</td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        className="border border-stone-200 bg-white px-2 py-1 text-xs"
                        onChange={async (e) => {
                          const nextStatus = e.target.value
                          const payload: Record<string, unknown> = { status: nextStatus }
                          if (nextStatus === 'contactado') payload.lastContactAt = new Date().toISOString()
                          await updateLead(lead.id, payload).catch(() => setError('No se pudo actualizar el estado'))
                        }}
                      >
                        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.priority}
                        className="border border-stone-200 bg-white px-2 py-1 text-xs"
                        onChange={async (e) => {
                          await updateLead(lead.id, { priority: e.target.value }).catch(() => setError('No se pudo actualizar la prioridad'))
                        }}
                      >
                        {Object.entries(LEAD_PRIORITY_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 ${inSla ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {inSla ? 'En SLA' : 'Fuera SLA'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      {lead.lastContactAt ? formatDate(lead.lastContactAt) : 'Sin contacto'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          className="w-full border border-stone-200 px-2 py-1 text-xs resize-y"
                          value={noteDraft[lead.id] ?? lead.notes ?? ''}
                          onChange={(e) => setNoteDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                        />
                        <button
                          type="button"
                          className="text-xs text-stone-600 underline"
                          onClick={async () => {
                            await updateLead(lead.id, {
                              notes: noteDraft[lead.id] ?? lead.notes ?? '',
                              lastContactAt: new Date().toISOString(),
                            }).catch(() => setError('No se pudieron guardar las notas'))
                          }}
                        >
                          Guardar nota
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="bg-white border border-stone-200 p-4">
      <p className="text-[11px] text-stone-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-light text-stone-900 mt-1">{value}</p>
    </article>
  )
}

