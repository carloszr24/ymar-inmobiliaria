import type { LeadRow } from '@/lib/leads'
import { LEAD_PRIORITIES, LEAD_STATUSES } from '@/lib/leads'
import type { LeadIntent, LeadPriority, LeadSource } from '@/types'

type GlobalWithLeads = typeof globalThis & { __cillerosDemoLeads?: LeadRow[] }

function store(): LeadRow[] {
  const g = globalThis as GlobalWithLeads
  if (!g.__cillerosDemoLeads) g.__cillerosDemoLeads = []
  return g.__cillerosDemoLeads
}

export function listDemoLeadRows(): LeadRow[] {
  return [...store()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function insertDemoLead(input: {
  full_name: string
  phone: string
  email: string | null
  notes: string | null
  source: LeadSource
  intent: LeadIntent
  priority: LeadPriority
  property_ref: string | null
  sale_timeline: string | null
}): LeadRow {
  const now = new Date().toISOString()
  const row: LeadRow = {
    id: crypto.randomUUID(),
    full_name: input.full_name,
    phone: input.phone,
    email: input.email,
    notes: input.notes,
    source: input.source,
    intent: input.intent,
    priority: input.priority,
    property_ref: input.property_ref,
    sale_timeline: input.sale_timeline,
    status: 'nuevo',
    assigned_to: null,
    first_response_at: null,
    last_contact_at: null,
    created_at: now,
    updated_at: now,
  }
  store().push(row)
  return row
}

export function updateDemoLead(
  id: string,
  updates: Partial<
    Pick<
      LeadRow,
      | 'status'
      | 'priority'
      | 'notes'
      | 'assigned_to'
      | 'first_response_at'
      | 'last_contact_at'
      | 'updated_at'
    >
  >,
): LeadRow | null {
  const row = store().find((l) => l.id === id)
  if (!row) return null
  if (updates.status && !LEAD_STATUSES.includes(updates.status)) return null
  if (updates.priority && !LEAD_PRIORITIES.includes(updates.priority)) return null
  Object.assign(row, updates, { updated_at: updates.updated_at ?? new Date().toISOString() })
  return row
}
