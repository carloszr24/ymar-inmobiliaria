import { NextRequest, NextResponse } from 'next/server'
import { getAdminTokenFromRequest, verifyAdminSessionToken } from '@/lib/admin-session'
import {
  insertDemoLead,
  listDemoLeadRows,
  updateDemoLead,
} from '@/lib/demo-leads-store'
import { LEAD_INTENTS, LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STATUSES, rowsToLeads } from '@/lib/leads'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

async function sendLeadEmailNotification(payload: {
  fullName: string
  phone: string
  email?: string
  source: string
  intent: string
  notes?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEADS_NOTIFICATION_EMAIL
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  if (!apiKey || !to) return

  const text = [
    'Nuevo lead recibido',
    '',
    `Nombre: ${payload.fullName}`,
    `Telefono: ${payload.phone}`,
    `Email: ${payload.email || 'No indicado'}`,
    `Origen: ${payload.source}`,
    `Interes: ${payload.intent}`,
    `Notas: ${payload.notes || 'No indicado'}`,
  ].join('\n')

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nuevo lead: ${payload.fullName}`,
      text,
    }),
  }).catch(() => null)
}

export async function GET(request: NextRequest) {
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }

  return NextResponse.json(rowsToLeads(listDemoLeadRows()))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fullName = String(body.fullName || '').trim()
    const phone = String(body.phone || '').trim()
    const email = String(body.email || '').trim() || null
    const notes = String(body.notes || '').trim() || null
    const source = String(body.source || 'web_contacto')
    const intent = String(body.intent || 'otro')
    const priority = String(body.priority || 'media')
    const propertyRef = String(body.propertyRef || '').trim() || null
    const saleTimeline = String(body.saleTimeline || '').trim() || null

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'Nombre y telefono son obligatorios' }, { status: 400 })
    }
    if (!LEAD_SOURCES.includes(source as (typeof LEAD_SOURCES)[number])) {
      return NextResponse.json({ error: 'Origen de lead no valido' }, { status: 400 })
    }
    if (!LEAD_INTENTS.includes(intent as (typeof LEAD_INTENTS)[number])) {
      return NextResponse.json({ error: 'Tipo de interes no valido' }, { status: 400 })
    }
    if (!LEAD_PRIORITIES.includes(priority as (typeof LEAD_PRIORITIES)[number])) {
      return NextResponse.json({ error: 'Prioridad no valida' }, { status: 400 })
    }

    const row = insertDemoLead({
      full_name: fullName,
      phone,
      email,
      notes,
      source: source as (typeof LEAD_SOURCES)[number],
      intent: intent as (typeof LEAD_INTENTS)[number],
      priority: priority as (typeof LEAD_PRIORITIES)[number],
      property_ref: propertyRef,
      sale_timeline: saleTimeline,
    })

    await sendLeadEmailNotification({
      fullName,
      phone,
      email: email || undefined,
      source,
      intent,
      notes: notes || undefined,
    })

    return NextResponse.json(rowsToLeads([row])[0], { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear lead' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSessionToken(getAdminTokenFromRequest(request))) {
    return unauthorized()
  }

  try {
    const body = await request.json()
    const id = String(body.id || '').trim()
    if (!id) return NextResponse.json({ error: 'ID no valido' }, { status: 400 })

    const updates: Parameters<typeof updateDemoLead>[1] = {}

    if (body.status) {
      const status = String(body.status)
      if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) {
        return NextResponse.json({ error: 'Estado no valido' }, { status: 400 })
      }
      updates.status = status as (typeof LEAD_STATUSES)[number]
      if (status === 'contactado' && !body.firstResponseAt) {
        updates.first_response_at = new Date().toISOString()
      }
    }
    if (body.priority) {
      const priority = String(body.priority)
      if (!LEAD_PRIORITIES.includes(priority as (typeof LEAD_PRIORITIES)[number])) {
        return NextResponse.json({ error: 'Prioridad no valida' }, { status: 400 })
      }
      updates.priority = priority as (typeof LEAD_PRIORITIES)[number]
    }
    if (body.notes !== undefined) updates.notes = String(body.notes || '').trim() || null
    if (body.assignedTo !== undefined) updates.assigned_to = String(body.assignedTo || '').trim() || null
    if (body.lastContactAt) updates.last_contact_at = new Date(body.lastContactAt).toISOString()
    updates.updated_at = new Date().toISOString()

    const row = updateDemoLead(id, updates)
    if (!row) return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })

    return NextResponse.json(rowsToLeads([row])[0])
  } catch {
    return NextResponse.json({ error: 'Error al actualizar lead' }, { status: 500 })
  }
}
