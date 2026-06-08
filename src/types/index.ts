export type CarCategory = 'novo' | 'seminovo' | 'venda-direta' | 'consorcio' | 'repasse' | 'entregas'
export type CarStatus = 'disponivel' | 'reservado' | 'vendido'
export type FuelType = 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'hibrido' | 'eletrico'
export type TransmissionType = 'manual' | 'automatico' | 'cvt' | 'automatizado'
export type SortBy = 'newest' | 'price-asc' | 'price-desc' | 'km-asc'

export interface Car {
  id: string
  slug: string
  category: CarCategory
  status: CarStatus

  brand: string
  model: string
  version?: string
  year: number
  modelYear: number

  km: number
  fuel?: FuelType
  transmission?: TransmissionType
  color?: string
  doors?: number

  price: number
  oldPrice?: number
  negotiable: boolean

  shortDescription: string
  description: string
  features: string[]
  highlights: string[]

  images: string[]
  coverImage: string

  featured: boolean
  views: number
  createdAt: string
  soldAt?: string

  metaTitle?: string
  metaDescription?: string

  // Consórcio
  consorcioTipoGrupo?: string
  consorcioValorCarta?: number
  consorcioValorParcela?: number
  consorcioPrazo?: number
  consorcioTaxaAdmin?: string
  consorcioFundoReserva?: string
  consorcioAssembleia?: string
  consorcioDiaVencimento?: string
  consorcioCashback?: number

  // Entrega
  entregaData?: string
  entregaClienteNome?: string
  entregaVeiculo?: string
}

export interface FilterState {
  search: string
  categories: CarCategory[]
  brands: string[]
  priceMin: number | ''
  priceMax: number | ''
  yearMin: number | ''
  yearMax: number | ''
  kmMax: number | ''
  fuels: FuelType[]
  transmissions: TransmissionType[]
  showSold: boolean
  sortBy: SortBy
}

export const defaultFilters: FilterState = {
  search: '',
  categories: [],
  brands: [],
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  kmMax: '',
  fuels: [],
  transmissions: [],
  showSold: false,
  sortBy: 'newest',
}

export interface Testimonial {
  id: string
  name: string
  car: string
  rating: number
  text: string
  avatar: string
}

export interface ClientPhoto {
  id: string
  clientName: string
  carModel: string
  image: string
  tall?: boolean
}

export interface HeroSlide {
  id: string
  badge: string
  badgeVariant: 'red' | 'white'
  headline: string
  subline: string
  cta: string
  ctaVariant: 'white' | 'red'
  ctaIcon: 'whatsapp' | 'arrow'
  ctaHref?: string
  bg: string
  overlay: number
}
