import type { Car, FilterState, SortBy, CarCategory, FuelType, TransmissionType } from '@/types'

export function filterCars(cars: Car[], filters: FilterState): Car[] {
  return cars.filter((car) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const match =
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        (car.version?.toLowerCase().includes(q) ?? false) ||
        car.color.toLowerCase().includes(q) ||
        String(car.year).includes(q)
      if (!match) return false
    }

    if (filters.categories.length > 0 && !filters.categories.includes(car.category)) return false
    if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) return false

    if (filters.priceMin !== '' && car.price < filters.priceMin) return false
    if (filters.priceMax !== '' && car.price > filters.priceMax) return false

    if (filters.yearMin !== '' && car.year < filters.yearMin) return false
    if (filters.yearMax !== '' && car.year > filters.yearMax) return false

    if (filters.kmMax !== '' && car.km > filters.kmMax) return false

    if (filters.fuels.length > 0 && !filters.fuels.includes(car.fuel)) return false
    if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false

    if (!filters.showSold && car.status === 'vendido') return false

    return true
  })
}

export function sortCars(cars: Car[], sortBy: SortBy): Car[] {
  return [...cars].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'km-asc':
        return a.km - b.km
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
}

export function parseFiltersFromURL(params: URLSearchParams): Partial<FilterState> {
  const result: Partial<FilterState> = {}

  const search = params.get('q')
  if (search) result.search = search

  const categories = params.getAll('categoria') as CarCategory[]
  if (categories.length > 0) result.categories = categories

  const brands = params.getAll('marca')
  if (brands.length > 0) result.brands = brands

  const priceMin = params.get('precoMin')
  if (priceMin) result.priceMin = Number(priceMin)

  const priceMax = params.get('precoMax')
  if (priceMax) result.priceMax = Number(priceMax)

  const yearMin = params.get('anoMin')
  if (yearMin) result.yearMin = Number(yearMin)

  const yearMax = params.get('anoMax')
  if (yearMax) result.yearMax = Number(yearMax)

  const kmMax = params.get('kmMax')
  if (kmMax) result.kmMax = Number(kmMax)

  const fuels = params.getAll('combustivel') as FuelType[]
  if (fuels.length > 0) result.fuels = fuels

  const transmissions = params.getAll('cambio') as TransmissionType[]
  if (transmissions.length > 0) result.transmissions = transmissions

  if (params.get('vendidos') === '1') result.showSold = true

  const sortBy = params.get('ordem') as SortBy | null
  if (sortBy) result.sortBy = sortBy

  return result
}

export function filtersToURL(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search) params.set('q', filters.search)
  filters.categories.forEach((c) => params.append('categoria', c))
  filters.brands.forEach((b) => params.append('marca', b))
  if (filters.priceMin !== '') params.set('precoMin', String(filters.priceMin))
  if (filters.priceMax !== '') params.set('precoMax', String(filters.priceMax))
  if (filters.yearMin !== '') params.set('anoMin', String(filters.yearMin))
  if (filters.yearMax !== '') params.set('anoMax', String(filters.yearMax))
  if (filters.kmMax !== '') params.set('kmMax', String(filters.kmMax))
  filters.fuels.forEach((f) => params.append('combustivel', f))
  filters.transmissions.forEach((t) => params.append('cambio', t))
  if (filters.showSold) params.set('vendidos', '1')
  if (filters.sortBy !== 'newest') params.set('ordem', filters.sortBy)

  return params
}

export function countActiveFilters(filters: FilterState): number {
  let count = 0
  if (filters.search) count++
  if (filters.categories.length) count++
  if (filters.brands.length) count++
  if (filters.priceMin !== '') count++
  if (filters.priceMax !== '') count++
  if (filters.yearMin !== '') count++
  if (filters.yearMax !== '') count++
  if (filters.kmMax !== '') count++
  if (filters.fuels.length) count++
  if (filters.transmissions.length) count++
  if (filters.showSold) count++
  return count
}

export function getAvailableBrands(cars: Car[]): string[] {
  return Array.from(new Set(cars.map((c) => c.brand))).sort()
}

export function getSimilarCars(cars: Car[], current: Car, limit = 4): Car[] {
  return cars
    .filter(
      (c) =>
        c.id !== current.id &&
        c.status !== 'vendido' &&
        (c.category === current.category || c.brand === current.brand),
    )
    .slice(0, limit)
}
