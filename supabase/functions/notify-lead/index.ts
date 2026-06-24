import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

type LeadRecord = {
  full_name: string
  phone: string
  email?: string | null
  source: string
  intent: string
  notes?: string | null
  property_ref?: string | null
  sale_timeline?: string | null
}

type WebhookPayload = {
  type?: string
  table?: string
  record?: LeadRecord
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = Deno.env.get('LEADS_NOTIFICATION_EMAIL') ?? 'ymarinmobiliaria@gmail.com'
const FROM_EMAIL =
  Deno.env.get('RESEND_FROM_EMAIL') ?? 'YMAR Inmobiliaria <onboarding@resend.dev>'
const WEBHOOK_SECRET = Deno.env.get('LEAD_WEBHOOK_SECRET')

function unauthorized() {
  return new Response(JSON.stringify({ error: 'No autorizado' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

function checkAuth(req: Request): boolean {
  if (!WEBHOOK_SECRET) return true

  const headerSecret = req.headers.get('x-lead-webhook-secret')
  if (headerSecret === WEBHOOK_SECRET) return true

  const auth = req.headers.get('Authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (serviceRole && token === serviceRole) return true

  return false
}

function buildEmailContent(record: LeadRecord) {
  const lines: [string, string][] = [
    ['Nombre', record.full_name],
    ['Teléfono', record.phone],
    ['Email', record.email || 'No indicado'],
    ['Origen', record.source],
    ['Interés', record.intent],
    ['Referencia', record.property_ref || 'No indicado'],
    ['Plazo venta', record.sale_timeline || 'No indicado'],
    ['Mensaje', record.notes || 'No indicado'],
  ]

  const text = ['Nuevo lead recibido en YMAR Inmobiliaria', '', ...lines.map(([k, v]) => `${k}: ${v}`)].join(
    '\n'
  )

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#1c1917">
      <h2 style="margin:0 0 16px;font-size:18px">Nuevo lead en la web</h2>
      <table style="border-collapse:collapse;width:100%;max-width:520px">
        ${lines
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#57534e">${label}</td>
            <td style="padding:8px 0;white-space:pre-wrap">${value}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>
  `.trim()

  return { text, html }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!checkAuth(req)) {
    return unauthorized()
  }

  try {
    const payload = (await req.json()) as WebhookPayload | LeadRecord
    const record = ('record' in payload && payload.record ? payload.record : payload) as LeadRecord

    if (!record?.full_name || !record?.phone) {
      return new Response(JSON.stringify({ error: 'Payload de lead no valido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!RESEND_API_KEY) {
      console.error('[notify-lead] Falta RESEND_API_KEY en secrets de Supabase')
      return new Response(JSON.stringify({ error: 'Email no configurado' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { text, html } = buildEmailContent(record)
    const body: Record<string, unknown> = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Nuevo lead: ${record.full_name}`,
      text,
      html,
    }

    if (record.email) {
      body.reply_to = record.email
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[notify-lead] Resend error:', res.status, err)
      return new Response(JSON.stringify({ error: err }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[notify-lead]', error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
