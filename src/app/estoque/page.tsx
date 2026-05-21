'use client'

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import CarCard from '@/components/home/CarCard'
import { cars } from '@/lib/mock-data'
import {
  filterCars,
  sortCars,
  parseFiltersFromURL,
  filtersToURL,
  countActiveFilters,
  getAvailableBrands,
} from '@/lib/filters'
import { defaultFilters } from '@/types'
import type { FilterState, FuelType, TransmissionType, CarCategory, SortBy } from '@/types'

const allBrands = getAvailableBrands(cars)
const fuels: FuelType[] = ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Híbrido', 'Elétrico']
const transmissions: TransmissionType[] = ['Manual', 'Automático', 'CVT', 'Automatizado']

function formatPrice(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function SortDropdown({ value, onChange }: { value: SortBy; onChange: (v: SortBy) => void }) {
  const [open, setOpen] = useState(false)
  const options: { label: string; value: SortBy }[] = [
    { label: 'Mais recentes', value: 'newest' },
    { label: 'Menor preço', value: 'price-asc' },
    { label: 'Maior preço', value: 'price-desc' },
    { label: 'Menor KM', value: 'km-asc' },
  ]
  const current = options.find((o) => o.value === value)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-bg-tertiary bg-bg-secondary px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-text-secondary transition-colors hover:text-white"
      >
        {current?.label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-20 mt-1 min-w-[160px] border border-bg-tertiary bg-bg-secondary py-1 shadow-xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`block w-full px-4 py-2.5 text-left text-[11px] font-medium transition-colors hover:bg-bg-tertiary ${
                  o.value === value ? 'text-accent-red' : 'text-text-secondary'
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
  onChange,
  onReset,
}: {
  filters: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}) {
  const activeCount = countActiveFilters(filters)

  function toggleArray<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
  }

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold tracking-[0.12em] text-white">FILTROS</h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-bold tracking-wide text-accent-red hover:underline"
          >
            <X size={10} />
            LIMPAR ({activeCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">BUSCA</label>
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Marca, modelo, cor…"
            className="w-full border border-bg-tertiary bg-bg-secondary py-2 pl-8 pr-3 text-[12px] text-white placeholder-text-muted outline-none focus:border-accent-red/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">CATEGORIA</label>
        <div className="space-y-1.5">
          {(['novo', 'seminovo', 'repasse'] as CarCategory[]).map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => onChange({ categories: toggleArray(filters.categories, cat) })}
                className="h-3.5 w-3.5 accent-red-600"
              />
              <span className="text-[12px] capitalize text-text-secondary">{cat === 'novo' ? 'Novos' : cat === 'seminovo' ? 'Seminovos' : 'Repasse'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">MARCA</label>
        <div className="space-y-1.5">
          {allBrands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onChange({ brands: toggleArray(filters.brands, brand) })}
                className="h-3.5 w-3.5 accent-red-600"
              />
              <span className="text-[12px] text-text-secondary">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">PREÇO</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => onChange({ priceMin: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Mín"
            className="w-full border border-bg-tertiary bg-bg-secondary px-3 py-2 text-[12px] text-white placeholder-text-muted outline-none focus:border-accent-red/50"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => onChange({ priceMax: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Máx"
            className="w-full border border-bg-tertiary bg-bg-secondary px-3 py-2 text-[12px] text-white placeholder-text-muted outline-none focus:border-accent-red/50"
          />
        </div>
      </div>

      {/* Year range */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">ANO</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.yearMin}
            onChange={(e) => onChange({ yearMin: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="De"
            className="w-full border border-bg-tertiary bg-bg-secondary px-3 py-2 text-[12px] text-white placeholder-text-muted outline-none focus:border-accent-red/50"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            value={filters.yearMax}
            onChange={(e) => onChange({ yearMax: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Até"
            className="w-full border border-bg-tertiary bg-bg-secondary px-3 py-2 text-[12px] text-white placeholder-text-muted outline-none focus:border-accent-red/50"
          />
        </div>
      </div>

      {/* KM max */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">KM MÁXIMO</label>
        <input
          type="number"
          value={filters.kmMax}
          onChange={(e) => onChange({ kmMax: e.target.value === '' ? '' : Number(e.target.value) })}
          placeholder="Ex: 50000"
          className="w-full border border-bg-tertiary bg-bg-secondary px-3 py-2 text-[12px] text-white placeholder-text-muted outline-none focus:border-accent-red/50"
        />
      </div>

      {/* Fuels */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">COMBUSTÍVEL</label>
        <div className="space-y-1.5">
          {fuels.map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.fuels.includes(f)}
                onChange={() => onChange({ fuels: toggleArray(filters.fuels, f) })}
                className="h-3.5 w-3.5 accent-red-600"
              />
              <span className="text-[12px] text-text-secondary">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmissions */}
      <div>
        <label className="mb-2 block text-[9px] font-bold tracking-[0.12em] text-text-muted">CÂMBIO</label>
        <div className="space-y-1.5">
          {transmissions.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.transmissions.includes(t)}
                onChange={() => onChange({ transmissions: toggleArray(filters.transmissions, t) })}
                className="h-3.5 w-3.5 accent-red-600"
              />
              <span className="text-[12px] text-text-secondary">{t}</span>
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
          className="h-3.5 w-3.5 accent-red-600"
        />
        <span className="text-[12px] text-text-secondary">Exibir vendidos</span>
      </label>
    </aside>
  )
}

function EstoqueContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    ...parseFiltersFromURL(new URLSearchParams(searchParams.toString())),
  }))
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [gridView, setGridView] = useState(true)

  const filtered = useMemo(() => sortCars(filterCars(cars, filters), filters.sortBy), [filters])
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

  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileFilterOpen])

  return (
    <main className="min-h-screen bg-bg-primary pt-[60px]">
      {/* Hero strip */}
      <div
        className="border-b border-bg-tertiary py-8"
        style={{ background: '#122038' }}
      >
        <Container>
          <p className="section-label mb-2">ESTOQUE COMPLETO</p>
          <h1
            className="font-anton text-[32px] leading-none text-white md:text-[48px]"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            Todos os Veículos
          </h1>
          <p className="mt-2 text-[13px] text-text-secondary">
            {filtered.length} {filtered.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[80px]">
              <FilterSidebar filters={filters} onChange={updateFilters} onReset={resetFilters} />
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 border border-bg-tertiary px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-text-secondary transition-colors hover:text-white lg:hidden"
              >
                <SlidersHorizontal size={13} />
                FILTROS
                {activeCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-red text-[9px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* View toggle */}
                <button
                  onClick={() => setGridView(true)}
                  className={`flex h-8 w-8 items-center justify-center border transition-colors ${gridView ? 'border-accent-red text-accent-red' : 'border-bg-tertiary text-text-muted'}`}
                  aria-label="Grade"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`flex h-8 w-8 items-center justify-center border transition-colors ${!gridView ? 'border-accent-red text-accent-red' : 'border-bg-tertiary text-text-muted'}`}
                  aria-label="Lista"
                >
                  <List size={14} />
                </button>
                <SortDropdown value={filters.sortBy} onChange={(v) => updateFilters({ sortBy: v })} />
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.search && (
                  <FilterChip
                    label={`Busca: ${filters.search}`}
                    onRemove={() => updateFilters({ search: '' })}
                  />
                )}
                {filters.categories.map((c) => (
                  <FilterChip
                    key={c}
                    label={c}
                    onRemove={() => updateFilters({ categories: filters.categories.filter((x) => x !== c) })}
                  />
                ))}
                {filters.brands.map((b) => (
                  <FilterChip
                    key={b}
                    label={b}
                    onRemove={() => updateFilters({ brands: filters.brands.filter((x) => x !== b) })}
                  />
                ))}
                {filters.priceMin !== '' && (
                  <FilterChip
                    label={`Min: ${formatPrice(Number(filters.priceMin))}`}
                    onRemove={() => updateFilters({ priceMin: '' })}
                  />
                )}
                {filters.priceMax !== '' && (
                  <FilterChip
                    label={`Max: ${formatPrice(Number(filters.priceMax))}`}
                    onRemove={() => updateFilters({ priceMax: '' })}
                  />
                )}
                {filters.fuels.map((f) => (
                  <FilterChip
                    key={f}
                    label={f}
                    onRemove={() => updateFilters({ fuels: filters.fuels.filter((x) => x !== f) })}
                  />
                ))}
                {filters.transmissions.map((t) => (
                  <FilterChip
                    key={t}
                    label={t}
                    onRemove={() => updateFilters({ transmissions: filters.transmissions.filter((x) => x !== t) })}
                  />
                ))}
                {filters.showSold && (
                  <FilterChip label="Exibindo vendidos" onRemove={() => updateFilters({ showSold: false })} />
                )}
              </div>
            )}

            {/* Results grid */}
            {filtered.length === 0 ? (
              <EmptyResults onReset={resetFilters} />
            ) : (
              <motion.div
                className={`grid gap-4 ${gridView ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}
                layout
              >
                {filtered.map((car, i) => (
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
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-bg-secondary p-6 lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[13px] font-bold tracking-[0.1em] text-white">FILTROS</h2>
                <button onClick={() => setMobileFilterOpen(false)} aria-label="Fechar">
                  <X size={20} className="text-text-muted" />
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={updateFilters} onReset={resetFilters} />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="mt-6 w-full bg-accent-red py-3.5 text-[12px] font-bold tracking-[0.1em] text-white"
              >
                VER {filtered.length} VEÍCULOS
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}

export default function EstoquePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary pt-[60px]" />}>
      <EstoqueContent />
    </Suspense>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 border border-bg-tertiary bg-bg-secondary px-2.5 py-1 text-[10px] font-medium text-text-secondary">
      {label}
      <button onClick={onRemove} aria-label="Remover filtro" className="hover:text-white">
        <X size={10} />
      </button>
    </span>
  )
}

function EmptyResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm"
        style={{ background: '#122038', border: '1px solid #1A2B47' }}
      >
        <Search size={24} className="text-text-muted" />
      </div>
      <p className="text-[14px] font-bold text-white">Nenhum veículo encontrado</p>
      <p className="mt-2 text-[12px] text-text-muted">Tente ajustar os filtros de busca.</p>
      <button
        onClick={onReset}
        className="mt-6 border border-accent-red px-6 py-2.5 text-[11px] font-bold tracking-[0.1em] text-accent-red transition-colors hover:bg-accent-red hover:text-white"
      >
        LIMPAR FILTROS
      </button>
    </div>
  )
}
