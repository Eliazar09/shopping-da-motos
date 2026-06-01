import type { CarCategory, FuelType, TransmissionType } from '@/types'

export interface CarFilters {
  query?:         string
  categories?:    CarCategory[]
  brands?:        string[]
  minPrice?:      number
  maxPrice?:      number
  minYear?:       number
  maxYear?:       number
  maxKm?:         number
  fuels?:         FuelType[]
  transmissions?: TransmissionType[]
  showSold?:      boolean
}
