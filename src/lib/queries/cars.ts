import { createDynamicServerClient } from '@/lib/supabase/server'
import { dbCarToCar, dbCarsToCars } from '@/lib/mappers/car-mapper'
import type { DbCar } from '@/lib/supabase/types'
import type { Car } from '@/types'
import type { CarFilters } from './types'

const isDev = process.env.NODE_ENV === 'development'

function logError(fn: string, err: unknown) {
  if (isDev) console.error(`[cars.ts] ${fn}:`, err)
}

export async function getAllCars(): Promise<Car[]> {
  try {
    const supabase = createDynamicServerClient()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .in('status', ['disponivel', 'reservado'])
      .order('created_at', { ascending: false })
    if (error) throw error
    return dbCarsToCars((data ?? []) as DbCar[])
  } catch (err) {
    logError('getAllCars', err)
    return []
  }
}

export async function getCarsByCategory(
  category: 'novo' | 'seminovo' | 'repasse'
): Promise<Car[]> {
  try {
    const supabase = createDynamicServerClient()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('category', category)
      .eq('status', 'disponivel')
      .order('created_at', { ascending: false })
    if (error) throw error
    return dbCarsToCars((data ?? []) as DbCar[])
  } catch (err) {
    logError('getCarsByCategory', err)
    return []
  }
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  try {
    const supabase = createDynamicServerClient()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('featured', true)
      .eq('status', 'disponivel')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return dbCarsToCars((data ?? []) as DbCar[])
  } catch (err) {
    logError('getFeaturedCars', err)
    return []
  }
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  try {
    const supabase = createDynamicServerClient()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    if (!data) return null
    return dbCarToCar(data as DbCar)
  } catch (err) {
    logError('getCarBySlug', err)
    return null
  }
}

export async function getSimilarCars(
  carId: string,
  category: string,
  limit = 4
): Promise<Car[]> {
  try {
    const supabase = createDynamicServerClient()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('category', category)
      .eq('status', 'disponivel')
      .neq('id', carId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return dbCarsToCars((data ?? []) as DbCar[])
  } catch (err) {
    logError('getSimilarCars', err)
    return []
  }
}

export async function searchCars(filters: CarFilters): Promise<Car[]> {
  try {
    const supabase = createDynamicServerClient()
    let q = supabase.from('cars').select('*')

    if (filters.showSold) {
      q = q.in('status', ['disponivel', 'reservado', 'vendido'])
    } else {
      q = q.in('status', ['disponivel', 'reservado'])
    }

    if (filters.categories?.length)    q = q.in('category', filters.categories)
    if (filters.brands?.length)        q = q.in('brand', filters.brands)
    if (filters.fuels?.length)         q = q.in('fuel', filters.fuels)
    if (filters.transmissions?.length) q = q.in('transmission', filters.transmissions)
    if (filters.minPrice != null)      q = q.gte('price', filters.minPrice)
    if (filters.maxPrice != null)      q = q.lte('price', filters.maxPrice)
    if (filters.minYear != null)       q = q.gte('year', filters.minYear)
    if (filters.maxYear != null)       q = q.lte('year', filters.maxYear)
    if (filters.maxKm != null)         q = q.lte('km', filters.maxKm)
    if (filters.query) {
      q = q.or(
        `brand.ilike.%${filters.query}%,model.ilike.%${filters.query}%,version.ilike.%${filters.query}%`
      )
    }

    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) throw error
    return dbCarsToCars((data ?? []) as DbCar[])
  } catch (err) {
    logError('searchCars', err)
    return []
  }
}

export async function getAvailableBrands(): Promise<string[]> {
  try {
    const supabase = createDynamicServerClient()
    const { data, error } = await supabase
      .from('cars')
      .select('brand')
      .eq('status', 'disponivel')
      .order('brand', { ascending: true })
    if (error) throw error
    const seen = new Set<string>()
    const unique: string[] = []
    for (const r of (data ?? []) as { brand: string }[]) {
      if (!seen.has(r.brand)) { seen.add(r.brand); unique.push(r.brand) }
    }
    return unique
  } catch (err) {
    logError('getAvailableBrands', err)
    return []
  }
}
