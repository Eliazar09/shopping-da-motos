'use server'

import { createDynamicServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function generateSlug(brand: string, model: string, year: string | number): string {
  const base = `${brand} ${model} ${year}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base}-${Math.random().toString(36).slice(2, 7)}`
}

export async function createCar(data: Record<string, unknown>) {
  const supabase = createDynamicServerClient()

  const slug = generateSlug(
    String(data.brand ?? 'carro'),
    String(data.model ?? ''),
    String(data.year ?? new Date().getFullYear()),
  )

  const { data: car, error } = await supabase
    .from('cars')
    .insert({ ...data, slug, images: [], cover_image: '', views: 0, whatsapp_clicks: 0 })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/carros')
  revalidatePath('/', 'layout')
  return { id: car.id as string }
}

export async function updateCar(id: string, data: Record<string, unknown>) {
  const supabase = createDynamicServerClient()

  const { error } = await supabase
    .from('cars')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/carros')
  revalidatePath(`/admin/carros/${id}`)
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteCar(id: string) {
  const supabase = createDynamicServerClient()

  // Remove todas as fotos do Storage
  const { data: files } = await supabase.storage.from('car-photos').list(id)
  if (files && files.length > 0) {
    const paths = files.map(f => `${id}/${f.name}`)
    await supabase.storage.from('car-photos').remove(paths)
  }

  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/carros')
  return { success: true }
}
