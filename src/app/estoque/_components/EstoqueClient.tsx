'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import CarCard from '@/components/home/CarCard'
import Navbar from '@/components/home/Navbar'
import { sortCars, filtersToURL, parseFiltersFromURL, countActiveFilters } from '@/lib/filters'
import { defaultFilters } from '@/types'
import type { FilterState, FuelType, TransmissionType, CarCategory, SortBy, Car } from '@/types'

const fuels: FuelType[] = ['gasolina', 'etanol', 'flex', 'diesel', 'hibrido', 'eletrico']
const transmissions: TransmissionType[] = ['manual', 'automatico', 'cvt', 'automatizado']

const FUEL_LABELS: Record<FuelType, string> = {
  gasolina: 'Gasolina', etanol: 'Etanol', flex: 'Flex',
  diesel: 'Diesel', hibrido: 'Híbrido', eletrico: 'Elétrico',
}
const TRANS_LABELS: Record<TransmissionType, string> = {
  manual: 'Manual', automatico: 'Automático', cvt: 'CVT', automatizado: 'Automatizado',
}

function formatPrice(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function SortDropdown({ value, onChange }: { value: SortBy; onChange: (v: SortBy) => void }) {
  const [open, setOpen] = useState(false)
  const options: { label: string; value: SortBy }[] = [
    { label: 'Mais recentes', value: 'newest' },
    { label: 'Menor preço',   value: 'price-asc' },
    { label: 'Maior preço',   value: 'price-desc' },
    { label: 'Menor KM',      value: 'km-asc' },
  ]
  const current = options.find((o) => o.value === value)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[12px] font-semibold text-marine-700 transition-colors hover:border-marine-300 hover:text-marine-900"
      >
        {current?.label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-20 mt-1 min-w-[170px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-marine-lg"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`block w-full px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-marine-50 ${
                  o.value === value ? 'text-accent font-semibold' : 'text-marine-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterSidebar({
  filters,
  brands,
  onChange,
  onReset,
}: {
  filters: FilterState
  brands: string[]
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}) {
  const activeCount = countActiveFilters(filters)

  function toggleArray<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-marine-900 placeholder-marine-400 outline-none transition-colors focus:border-marine-500'

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold tracking-wide text-marine-900">Filtros</h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
          >
            <X size={10} />
            Limpar ({activeCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Busca</label>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-marine-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Marca, modelo, cor…"
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Categoria</label>
        <div className="space-y-2">
          {(['novo', 'seminovo', 'repasse'] as CarCategory[]).map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => onChange({ categories: toggleArray(filters.categories, cat) })}
                className="h-4 w-4 rounded accent-red-600"
              />
              <span className="text-[13px] text-marine-700">
                {cat === 'novo' ? 'Novos' : cat === 'seminovo' ? 'Seminovos' : 'Repasse'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Marca</label>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => onChange({ brands: toggleArray(filters.brands, brand) })}
                  className="h-4 w-4 rounded accent-red-600"
                />
                <span className="text-[13px] text-marine-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Preço</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => onChange({ priceMin: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Mín"
            className={inputCls}
          />
          <span className="text-marine-400">–</span>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => onChange({ priceMax: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Máx"
            className={inputCls}
          />
        </div>
      </div>

      {/* Year range */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Ano</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.yearMin}
            onChange={(e) => onChange({ yearMin: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="De"
            className={inputCls}
          />
          <span className="text-marine-400">–</span>
          <input
            type="number"
            value={filters.yearMax}
            onChange={(e) => onChange({ yearMax: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Até"
            className={inputCls}
          />
        </div>
      </div>

      {/* KM max */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">KM Máximo</label>
        <input
          type="number"
          value={filters.kmMax}
          onChange={(e) => onChange({ kmMax: e.target.value === '' ? '' : Number(e.target.value) })}
          placeholder="Ex: 50000"
          className={inputCls}
        />
      </div>

      {/* Fuels */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Combustível</label>
        <div className="space-y-2">
          {fuels.map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.fuels.includes(f)}
                onChange={() => onChange({ fuels: toggleArray(filters.fuels, f) })}
                className="h-4 w-4 rounded accent-red-600"
              />
              <span className="text-[13px] text-marine-700">{FUEL_LABELS[f]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmissions */}
      <div>
        <label className="mb-2 block text-[10px] font-bold tracking-[0.1em] uppercase text-marine-500">Câmbio</label>
        <div className="space-y-2">
          {transmissions.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.transmissions.includes(t)}
                onChange={() => onChange({ transmissions: toggleArray(filters.transmissions, t) })}
                className="h-4 w-4 rounded accent-red-600"
              />
              <span className="text-[13px] text-marine-700">{TRANS_LABELS[t]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Show sold */}
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={filters.showSold}
          onChange={(e) => onChange({ showSold: e.target.checked })}
          className="h-4 w-4 rounded accent-red-600"
        />
        <span className="text-[13px] text-marine-700">Exibir vendidos</span>
      </label>
    </aside>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-marine-100 bg-marine-50 px-3 py-1 text-[11px] font-medium text-marine-700">
      {label}
      <button onClick={onRemove} aria-label="Remover filtro" className="text-marine-400 hover:text-accent">
        <X size={10} />
      </button>
    </span>
  )
}

function EmptyResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-marine-50">
        <Search size={26} className="text-marine-400" />
      </div>
      <p className="text-[16px] font-semibold text-marine-900">Nenhum veículo encontrado</p>
      <p className="mt-2 text-[13px] text-marine-500">Tente ajustar os filtros de busca.</p>
      <button
        onClick={onReset}
        className="mt-7 rounded-full bg-accent px-7 py-3 text-[12px] font-bold text-white transition-colors hover:bg-accent-hover"
      >
        Limpar filtros
      </button>
    </div>
  )
}

interface Props {
  cars: Car[]
  brands: string[]
}

export default function EstoqueClient({ cars, brands }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    ...parseFiltersFromURL(new URLSearchParams(searchParams.toString())),
  }))
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [gridView, setGridView] = useState(true)

  // cars prop is pre-filtered by server — only apply client-side sort
  const displayed = sortCars(cars, filters.sortBy)
  const activeCount = countActiveFilters(filters)

  const updateFilters = useCallback(
    (patch: Partial<FilterState>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch }
        const params = filtersToURL(next)
        router.replace(`/estoque${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
        return next
      })
    },
    [router],
  )

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
    router.replace('/estoque', { scroll: false })
  }, [router])

  // Sync filters when URL changes (e.g. navbar navigation)
  useEffect(() => {
    const parsed = parseFiltersFromURL(new URLSearchParams(searchParams.toString()))
    setFilters(prev => ({ ...prev, ...parsed }))
  }, [searchParams])

  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFilterOpen])

  const CAT_TABS: { label: string; value: CarCategory[] }[] = [
    { label: 'Todos',        value: [] },
    { label: 'Novos',        value: ['novo'] },
    { label: 'Seminovos',    value: ['seminovo'] },
    { label: 'Venda Direta', value: ['venda-direta'] },
    { label: 'Consórcio',    value: ['consorcio'] },
    { label: 'Repasse',      value: ['repasse'] },
    { label: 'Entregas',     value: ['entregas'] },
  ]

  function isCatActive(value: CarCategory[]) {
    if (value.length === 0) return filters.categories.length === 0
    return filters.categories.length === value.length && value.every((v) => filters.categories.includes(v))
  }

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-white">
      {/* Hero strip */}
      <div className="relative overflow-hidden border-b border-white/10 pt-[64px]" style={{ background: 'linear-gradient(130deg, #0A1929 0%, #1a3354 100%)' }}>
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(rgba(200,151,58,1) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        {/* red glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: '#E31E24' }} />
        {/* gold glow */}
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full opacity-10 blur-3xl" style={{ background: '#C8973A' }} />

        <Container>
          <div className="relative z-10 py-10 md:py-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: '#C8973A' }}
            >
              Estoque Completo
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-bold text-white"
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 'clamp(32px, 5vw, 60px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
              }}
            >
              Todos os{' '}
              <span style={{ color: '#E31E24' }}>Veículos</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-3 text-[13px] text-white/50"
            >
              {displayed.length} {displayed.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
            </motion.p>
          </div>
        </Container>
      </div>

      {/* Category tabs — mobile & desktop */}
      <div className="border-b border-gray-100 bg-white py-5 md:py-7">
        <div className="flex justify-center px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 md:gap-3" style={{ scrollbarWidth: 'none' }}>
            {CAT_TABS.map((tab) => {
              const active = isCatActive(tab.value)
              return (
                <button
                  key={tab.label}
                  onClick={() => updateFilters({ categories: tab.value })}
                  className="flex-shrink-0 rounded-full px-6 py-2.5 text-[13px] font-bold transition-all md:px-8 md:py-3 md:text-[15px]"
                  style={active
                    ? { fontFamily: 'var(--font-jakarta)', background: '#E31E24', color: '#fff', boxShadow: '0 6px 20px rgba(227,30,36,0.25)' }
                    : { fontFamily: 'var(--font-jakarta)', background: '#F1F3F5', color: '#374151' }
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Container>
        <div className="py-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[84px] rounded-2xl border border-gray-200 bg-cream p-6">
              <FilterSidebar filters={filters} brands={brands} onChange={updateFilters} onReset={resetFilters} />
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[12px] font-semibold text-marine-700 transition-colors hover:border-marine-300 lg:hidden"
              >
                <SlidersHorizontal size={14} />
                Filtros
                {activeCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setGridView(true)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
                    border-0 md:border
                    ${gridView
                      ? 'text-accent md:border-accent md:bg-accent-light'
                      : 'text-marine-400 md:border-gray-200 md:text-marine-500 md:hover:border-marine-300'
                    }`}
                  aria-label="Grade"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
                    border-0 md:border
                    ${!gridView
                      ? 'text-accent md:border-accent md:bg-accent-light'
                      : 'text-marine-400 md:border-gray-200 md:text-marine-500 md:hover:border-marine-300'
                    }`}
                  aria-label="Lista"
                >
                  <List size={14} />
                </button>
                <SortDropdown value={filters.sortBy} onChange={(v) => updateFilters({ sortBy: v })} />
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {filters.search && (
                  <FilterChip label={`Busca: ${filters.search}`} onRemove={() => updateFilters({ search: '' })} />
                )}
                {filters.categories.map((c) => (
                  <FilterChip key={c} label={c} onRemove={() => updateFilters({ categories: filters.categories.filter((x) => x !== c) })} />
                ))}
                {filters.brands.map((b) => (
                  <FilterChip key={b} label={b} onRemove={() => updateFilters({ brands: filters.brands.filter((x) => x !== b) })} />
                ))}
                {filters.priceMin !== '' && (
                  <FilterChip label={`Min: ${formatPrice(Number(filters.priceMin))}`} onRemove={() => updateFilters({ priceMin: '' })} />
                )}
                {filters.priceMax !== '' && (
                  <FilterChip label={`Max: ${formatPrice(Number(filters.priceMax))}`} onRemove={() => updateFilters({ priceMax: '' })} />
                )}
                {filters.fuels.map((f) => (
                  <FilterChip key={f} label={FUEL_LABELS[f]} onRemove={() => updateFilters({ fuels: filters.fuels.filter((x) => x !== f) })} />
                ))}
                {filters.transmissions.map((t) => (
                  <FilterChip key={t} label={TRANS_LABELS[t]} onRemove={() => updateFilters({ transmissions: filters.transmissions.filter((x) => x !== t) })} />
                ))}
                {filters.showSold && (
                  <FilterChip label="Exibindo vendidos" onRemove={() => updateFilters({ showSold: false })} />
                )}
              </div>
            )}

            {/* Results grid */}
            {displayed.length === 0 ? (
              <EmptyResults onReset={resetFilters} />
            ) : (
              <motion.div
                className={`grid gap-5 ${gridView ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}
                layout
              >
                {displayed.map((car, i) => (
                  <CarCard key={car.id} car={car} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-marine-900/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-6 lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="mb-1 flex justify-center">
                <div className="h-1 w-10 rounded-full bg-gray-200" />
              </div>
              <div className="mb-6 flex items-center justify-between pt-4">
                <h2 className="text-[16px] font-bold text-marine-900">Filtros</h2>
                <button onClick={() => setMobileFilterOpen(false)} aria-label="Fechar">
                  <X size={20} className="text-marine-500" />
                </button>
              </div>
              <FilterSidebar filters={filters} brands={brands} onChange={updateFilters} onReset={resetFilters} />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="mt-8 w-full rounded-full bg-accent py-3.5 text-[13px] font-bold text-white"
              >
                Ver {displayed.length} veículos
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
    </>
  )
}
