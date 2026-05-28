'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { LeadEstado, LeadFormInput, LeadTemperatura } from '@/types/leads'

export async function getLeads() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*, properties(id, titulo, direccion, precio)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getProperties() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('activo', true)
    .order('titulo')

  if (error) throw new Error(error.message)
  return data
}

export async function createLead(input: LeadFormInput) {
  const supabase = await createClient()

  const { error } = await supabase.from('leads').insert({
    nombre: input.nombre.trim(),
    telefono: input.telefono.trim(),
    email: input.email?.trim() || null,
    propiedad_id: input.propiedad_id || null,
    propiedad_texto: input.propiedad_texto?.trim() || null,
    tipo: input.tipo,
    temperatura: input.temperatura,
    fuente: input.fuente,
    notas: input.notas?.trim() || null,
    estado: 'nuevo',
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function updateLeadEstado(id: string, estado: LeadEstado) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ estado }).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function updateLeadTemperatura(
  id: string,
  temperatura: LeadTemperatura,
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ temperatura })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function updateLeadNotas(id: string, notas: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ notas }).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}
