'use client'

import { useEffect, useState } from 'react'
import { Property } from '@/types'
import { MAX_FEATURED_ON_HOME } from '@/lib/property-db'
import { formatPrice, OPERATION_LABELS, PROPERTY_OPERATIONS, PROPERTY_STATUSES, PROPERTY_TYPES, STATUS_LABELS, TYPE_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

type ImageItem =
  | { id: string; kind: 'existing'; url: string }
  | { id: string; kind: 'new'; file: File; previewUrl: string }

function safeParseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return images
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }
}

function isSupabasePublicUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/property-images/')
}

function supabasePathFromPublicUrl(url: string): string | null {
  // https://<ref>.supabase.co/storage/v1/object/public/property-images/<path>
  const marker = '/storage/v1/object/public/property-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

const emptyForm = {
  title: '',
  price: '',
  location: '',
  type: 'piso',
  operation: 'venta',
  status: 'disponible',
  description: '',
  fotocasaUrl: '',
  bedrooms: '',
  bathrooms: '',
  sqMeters: '',
  availability: '',
  hotWater: '',
  heating: '',
  condition: '',
  propertyAge: '',
  floor: '',
  garage: '',
  elevator: '',
  furnished: '',
  energyRating: '',
  energyValue: '',
  emissionsRating: '',
  emissionsValue: '',
  featured: false,
}

const statusColors: Record<string, string> = {
  disponible: 'text-emerald-600 bg-emerald-50',
  reservado: 'text-amber-600 bg-amber-50',
  vendido: 'text-stone-500 bg-stone-100',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageItems, setImageItems] = useState<ImageItem[]>([])
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [featuredCapError, setFeaturedCapError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const debugLog = (
    hypothesisId: string,
    location: string,
    message: string,
    data: Record<string, unknown>,
    runId = 'run1'
  ) => {
    // #region agent log
    fetch('http://127.0.0.1:7469/ingest/9fce4d37-ece9-4a64-80a2-f7181108eb3e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f55194'},body:JSON.stringify({sessionId:'f55194',runId,hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{})
    // #endregion
  }

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        // #region agent log
        debugLog('A', 'admin/page.tsx:session-check', 'session check response', { ok: r.ok, status: r.status, authed: (data as { authed?: boolean }).authed })
        // #endregion
        return data
      })
      .then((data: { authed?: boolean }) => {
        if (data.authed) setAuthed(true)
      })
      .catch(() => {})
  }, [])

  const login = async () => {
    setPwError(false)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthed(true)
        setPassword('')
      } else {
        setPwError(true)
      }
    } catch {
      setPwError(true)
    }
  }

  // Fetch
  const fetchProperties = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/propiedades', { credentials: 'include' })
      const data = await res.json().catch(() => ([]))
      // #region agent log
      debugLog('B', 'admin/page.tsx:fetchProperties', 'properties fetch result', {
        ok: res.ok,
        status: res.status,
        count: Array.isArray(data) ? data.length : -1,
        firstIds: Array.isArray(data) ? data.slice(0, 5).map((p: { id?: string }) => p.id) : [],
      })
      // #endregion
      if (res.ok && Array.isArray(data)) setProperties(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) fetchProperties()
  }, [authed])

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'featured') {
        if (checked) {
          const selfFeatured = editingId ? properties.some((p) => p.id === editingId && p.featured) : false
          const nFeatured = properties.filter((p) => p.featured).length
          if (!selfFeatured && nFeatured >= MAX_FEATURED_ON_HOME) {
            setFeaturedCapError(
              `Solo puedes tener ${MAX_FEATURED_ON_HOME} destacadas en la home. Quita la marca en otra propiedad primero.`
            )
            return
          }
        } else {
          setFeaturedCapError(null)
        }
      }
      setForm({ ...form, [name]: checked })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setImageItems([])
    setInitialImageUrls([])
    setFeaturedCapError(null)
    setSubmitError(null)
    setShowForm(true)
  }

  const openEdit = (p: Property) => {
    const urls = safeParseImages(p.images)
    setForm({
      title: p.title,
      price: p.price.toString(),
      location: p.location,
      type: p.type,
      operation: p.operation || 'venta',
      status: p.status,
      description: p.description,
      fotocasaUrl: p.fotocasaUrl || '',
      bedrooms: p.bedrooms?.toString() || '',
      bathrooms: p.bathrooms?.toString() || '',
      sqMeters: p.sqMeters?.toString() || '',
      availability: p.availability || '',
      hotWater: p.hotWater || '',
      heating: p.heating || '',
      condition: p.condition || '',
      propertyAge: p.propertyAge || '',
      floor: p.floor || '',
      garage: p.garage || '',
      elevator: p.elevator || '',
      furnished: p.furnished || '',
      energyRating: p.energyRating || '',
      energyValue: p.energyValue?.toString() || '',
      emissionsRating: p.emissionsRating || '',
      emissionsValue: p.emissionsValue?.toString() || '',
      featured: p.featured,
    })
    setEditingId(p.id)
    setInitialImageUrls(urls)
    setImageItems(urls.map((url) => ({ id: crypto.randomUUID(), kind: 'existing', url })))
    setFeaturedCapError(null)
    setSubmitError(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp'])
    const maxBytes = 5 * 1024 * 1024
    const next: ImageItem[] = []
    for (const f of Array.from(files)) {
      if (!allowed.has(f.type)) continue
      if (f.size > maxBytes) continue
      next.push({ id: crypto.randomUUID(), kind: 'new', file: f, previewUrl: URL.createObjectURL(f) })
    }
    if (next.length) setImageItems((prev) => [...prev, ...next].slice(0, 15))
  }

  const removeItem = async (id: string) => {
    const item = imageItems.find((x) => x.id === id)
    if (!item) return
    if (item.kind === 'new') {
      URL.revokeObjectURL(item.previewUrl)
    }
    setImageItems((prev) => prev.filter((x) => x.id !== id))
  }

  const moveItem = (from: number, to: number) => {
    setImageItems((prev) => {
      const next = [...prev]
      const [it] = next.splice(from, 1)
      next.splice(to, 0, it)
      return next
    })
  }

  const uploadNewImages = async (propertyId: string) => {
    const results: { id: string; url: string }[] = []
    for (const item of imageItems) {
      if (item.kind !== 'new') continue
      const fd = new FormData()
      fd.append('file', item.file)
      const res = await fetch(`/api/uploads/property-image?propertyId=${encodeURIComponent(propertyId)}`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      if (!res.ok) {
        throw new Error('Error al subir imagen')
      }
      const data = await res.json() as { url: string }
      results.push({ id: item.id, url: data.url })
    }
    return results
  }

  const deleteRemovedImages = async (finalUrls: string[]) => {
    const removed = initialImageUrls.filter((u) => !finalUrls.includes(u))
    for (const url of removed) {
      if (!isSupabasePublicUrl(url)) continue
      const path = supabasePathFromPublicUrl(url)
      if (!path) continue
      await fetch('/api/uploads/property-image', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSubmitError(null)
    // #region agent log
    debugLog('C', 'admin/page.tsx:handleSubmit-start', 'submit start', {
      mode: editingId ? 'edit' : 'create',
      editingId,
      featured: form.featured,
      imageItems: imageItems.length,
    })
    // #endregion
    try {
      const existingUrlsInOrder = imageItems
        .filter((i): i is Extract<ImageItem, { kind: 'existing' }> => i.kind === 'existing')
        .map((i) => i.url)

      // 1) Crear/actualizar propiedad (sin nuevas imágenes aún)
      if (!editingId) {
        const createRes = await fetch('/api/propiedades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...form, images: existingUrlsInOrder }),
        })
        if (!createRes.ok) {
          const errBody = (await createRes.json().catch(() => ({}))) as { error?: string }
          // #region agent log
          debugLog('D', 'admin/page.tsx:createRes-error', 'create failed', { status: createRes.status, error: errBody.error || null })
          // #endregion
          setSubmitError(errBody.error || 'Error al crear propiedad')
          return
        }
        const created = await createRes.json() as { id: string }
        const propertyId = created.id
        // #region agent log
        debugLog('D', 'admin/page.tsx:createRes-ok', 'create ok', { propertyId })
        // #endregion

        // 2) Subir imágenes nuevas y actualizar orden final
        const uploaded = await uploadNewImages(propertyId)
        const finalUrls = imageItems.map((it) => {
          if (it.kind === 'existing') return it.url
          const match = uploaded.find((u) => u.id === it.id)
          return match?.url || ''
        }).filter(Boolean)

        const putAfterCreate = await fetch(`/api/propiedades/${propertyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...form, images: finalUrls }),
        })
        if (!putAfterCreate.ok) {
          const errBody = (await putAfterCreate.json().catch(() => ({}))) as { error?: string }
          // #region agent log
          debugLog('E', 'admin/page.tsx:putAfterCreate-error', 'put after create failed', { status: putAfterCreate.status, error: errBody.error || null, propertyId })
          // #endregion
          setSubmitError(errBody.error || 'Error al guardar la propiedad')
          return
        }
        // #region agent log
        debugLog('E', 'admin/page.tsx:putAfterCreate-ok', 'put after create ok', { status: putAfterCreate.status, propertyId })
        // #endregion
      } else {
        const propertyId = editingId

        // Subir nuevas primero
        const uploaded = await uploadNewImages(propertyId)
        const finalUrls = imageItems.map((it) => {
          if (it.kind === 'existing') return it.url
          const match = uploaded.find((u) => u.id === it.id)
          return match?.url || ''
        }).filter(Boolean)

        const putRes = await fetch(`/api/propiedades/${propertyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...form, images: finalUrls }),
        })
        if (!putRes.ok) {
          const errBody = (await putRes.json().catch(() => ({}))) as { error?: string }
          // #region agent log
          debugLog('E', 'admin/page.tsx:putEdit-error', 'put edit failed', { status: putRes.status, error: errBody.error || null, propertyId })
          // #endregion
          setSubmitError(errBody.error || 'Error al guardar la propiedad')
          return
        }
        // #region agent log
        debugLog('E', 'admin/page.tsx:putEdit-ok', 'put edit ok', { status: putRes.status, propertyId })
        // #endregion

        await deleteRemovedImages(finalUrls)
      }

      setShowForm(false)
      setEditingId(null)
      await fetchProperties()
      // #region agent log
      debugLog('B', 'admin/page.tsx:postSubmit-refetch', 'refetch after submit complete', { mode: editingId ? 'edit' : 'create' })
      // #endregion
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/propiedades/${id}`, { method: 'DELETE', credentials: 'include' })
    setDeleteId(null)
    await fetchProperties()
  }

  // PASSWORD SCREEN
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-light text-stone-900 mb-8 text-center">Acceso admin</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Contraseña"
              className={cn(
                'w-full border px-4 py-3 text-sm focus:outline-none transition-colors',
                pwError ? 'border-red-300 bg-red-50' : 'border-stone-200 focus:border-stone-900'
              )}
            />
            {pwError && <p className="text-red-500 text-xs">Contraseña incorrecta</p>}
            <button onClick={login} className="btn-primary w-full py-3 text-sm">
              Entrar
            </button>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-stone-400 text-center">
                Local: usa la variable <code className="bg-stone-100 px-1">ADMIN_PASSWORD</code> de <code className="bg-stone-100 px-1">.env</code>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-stone-900">Propiedades</h1>
          <p className="text-stone-400 text-sm mt-1">{properties.length} inmuebles en total</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
              setAuthed(false)
            }}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            Cerrar sesión
          </button>
          <button onClick={openCreate} className="btn-primary text-xs px-5 py-2.5">
            + Nueva propiedad
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white border border-stone-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-medium text-stone-900">
              {editingId ? 'Editar propiedad' : 'Nueva propiedad'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-900 text-xl leading-none">×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-xs text-stone-500 block mb-1.5">Título *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Precio (€) *</label>
                <input name="price" value={form.price} onChange={handleChange} required type="number"
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Ubicación *</label>
                <input name="location" value={form.location} onChange={handleChange} required
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Tipo</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900 bg-white">
                  {PROPERTY_TYPES.map(t => (
                    <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Operación</label>
                <select name="operation" value={form.operation} onChange={handleChange}
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900 bg-white">
                  {PROPERTY_OPERATIONS.map(op => (
                    <option key={op} value={op}>{OPERATION_LABELS[op]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Estado</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900 bg-white">
                  {PROPERTY_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">m²</label>
                <input name="sqMeters" value={form.sqMeters} onChange={handleChange} type="number"
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Habitaciones</label>
                <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number"
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Baños</label>
                <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number"
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Link Idealista</label>
                <input name="fotocasaUrl" value={form.fotocasaUrl} onChange={handleChange} type="text"
                  placeholder="www.idealista.com/... (con o sin https://)"
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-stone-500 block mb-1.5">Descripción *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900 resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-stone-500 block mb-2">Imágenes</label>
                <div className="border border-stone-200 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-stone-400">
                      Sube hasta 15 imágenes (JPG/PNG/WebP, máx. 5MB). Arrastra para reordenar.
                    </div>
                    <label className="btn-outline text-[11px] px-4 py-2 cursor-pointer">
                      + Añadir fotos
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                    </label>
                  </div>

                  {imageItems.length === 0 ? (
                    <div className="text-sm text-stone-400 py-6 text-center">
                      No hay imágenes aún.
                    </div>
                  ) : (
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {imageItems.map((item, idx) => {
                        const preview = item.kind === 'existing' ? item.url : item.previewUrl
                        return (
                          <li
                            key={item.id}
                            className="border border-stone-200 bg-stone-50"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', String(idx))
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault()
                              const from = Number(e.dataTransfer.getData('text/plain'))
                              if (!Number.isFinite(from)) return
                              if (from === idx) return
                              moveItem(from, idx)
                            }}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={preview} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-stone-700 text-xs px-2 py-1 border border-stone-200"
                              >
                                Quitar
                              </button>
                              {idx === 0 && (
                                <span className="absolute bottom-2 left-2 bg-gold text-white text-[10px] px-2 py-1">
                                  Principal
                                </span>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 border border-stone-100 p-4">
                <p className="text-xs text-stone-500 tracking-wide mb-4">Características opcionales</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Disponibilidad</label>
                    <input name="availability" value={form.availability} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Agua caliente</label>
                    <input name="hotWater" value={form.hotWater} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Calefacción</label>
                    <input name="heating" value={form.heating} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Estado</label>
                    <input name="condition" value={form.condition} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Antigüedad</label>
                    <input name="propertyAge" value={form.propertyAge} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Planta</label>
                    <input name="floor" value={form.floor} onChange={handleChange}
                      placeholder="Ej: 6º"
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Garaje</label>
                    <input name="garage" value={form.garage} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Ascensor</label>
                    <input name="elevator" value={form.elevator} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Amueblado</label>
                    <input name="furnished" value={form.furnished} onChange={handleChange}
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Etiqueta energética</label>
                    <input name="energyRating" value={form.energyRating} onChange={handleChange}
                      placeholder="Ej: G"
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Valor energía (kg CO₂/m²/año)</label>
                    <input name="energyValue" value={form.energyValue} onChange={handleChange} type="number" step="any"
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Etiqueta emisiones</label>
                    <input name="emissionsRating" value={form.emissionsRating} onChange={handleChange}
                      placeholder="Ej: G"
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1.5">Valor emisiones (kg CO₂/m²/año)</label>
                    <input name="emissionsValue" value={form.emissionsValue} onChange={handleChange} type="number" step="any"
                      className="w-full border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-900" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" name="featured" id="featured"
                  checked={form.featured} onChange={handleChange}
                  className="accent-stone-900 w-4 h-4" />
                <label htmlFor="featured" className="text-sm text-stone-600 cursor-pointer">
                  Destacar en home (máx. {MAX_FEATURED_ON_HOME})
                </label>
              </div>
              {featuredCapError && (
                <p className="text-red-600 text-xs -mt-2">{featuredCapError}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-stone-100">
              {submitError && (
                <p className="text-red-600 text-sm">{submitError}</p>
              )}
              <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50">
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear propiedad'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                Cancelar
              </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-400 text-sm">Cargando...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-stone-400 mb-4">No hay propiedades aún.</p>
            <button onClick={openCreate} className="btn-primary text-xs px-5 py-2.5">
              Crear la primera
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['Título', 'Precio', 'Operación', 'Tipo', 'Estado', 'Ubicación', 'Dest.', 'Acciones'].map(h => (
                    <th key={h} className="text-left text-xs text-stone-500 font-medium px-4 py-3 tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-stone-900 line-clamp-1 max-w-[200px] block">
                        {p.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                      {formatPrice(p.price, p.operation)}
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {OPERATION_LABELS[p.operation || 'venta'] || p.operation || 'Venta'}
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {TYPE_LABELS[p.type] || p.type}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 font-medium', statusColors[p.status] || '')}>
                        {STATUS_LABELS[p.status] || p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs max-w-[150px] truncate">
                      {p.location}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.featured ? '⭐' : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6">
          <div className="bg-white p-8 max-w-sm w-full">
            <h3 className="font-medium text-stone-900 mb-2">¿Confirmar eliminación?</h3>
            <p className="text-stone-500 text-sm mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="btn-primary text-xs px-5 py-2.5"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
