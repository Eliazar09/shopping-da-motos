import { Suspense } from 'react'
import { searchCars, getAvailableBrands } from '@/lib/queries/cars'
import EstoqueClient from './_components/EstoqueClient'
import { parseFiltersFromURL } from '@/lib/filters'
import { defaultFilters } from '@/types'
import type { CarFilters } from '@/lib/queries/types'
import type { FilterState } from '@/types'

function toURLSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): URLSearchParams {
  const usp = new URLSearchParams()
  for (const [key, val] of Object.entries(searchParams)) {
    if (Array.isArray(val)) {
      val.forEach((v) => usp.append(key, v))
    } else if (val != null) {
      usp.set(key, val)
    }
  }
  return usp
}

function toCarFilters(fs: FilterState): CarFilters {
  return {
    query:         fs.search || undefined,
    categories:    fs.categories.length    ? fs.categories    : undefined,
    brands:        fs.brands.length        ? fs.brands        : undefined,
    fuels:         fs.fuels.length         ? fs.fuels         : undefined,
    transmissions: fs.transmissions.length ? fs.transmissions : undefined,
    minPrice:      fs.priceMin !== ''      ? Number(fs.priceMin) : undefined,
    maxPrice:      fs.priceMax !== ''      ? Number(fs.priceMax) : undefined,
    minYear:       fs.yearMin  !== ''      ? Number(fs.yearMin)  : undefined,
    maxYear:       fs.yearMax  !== ''      ? Number(fs.yearMax)  : undefined,
    maxKm:         fs.kmMax    !== ''      ? Number(fs.kmMax)    : undefined,
    showSold:      fs.showSold,
  }
}

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const usp = toURLSearchParams(searchParams)
  const filterState: FilterState = { ...defaultFilters, ...parseFiltersFromURL(usp) }
  const carFilters = toCarFilters(filterState)

  const [cars, brands] = await Promise.all([
    searchCars(carFilters),
    getAvailableBrands(),
  ])

  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-[64px]" />}>
      <EstoqueClient cars={cars} brands={brands} />
    </Suspense>
  )
}
