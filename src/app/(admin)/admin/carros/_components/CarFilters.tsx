'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'

const STATUS_TABS = [
  { value: 'todos',      label: 'Todos' },
  { value: 'disponivel', label: 'Disponíveis' },
  { value: 'reservado',  label: 'Reservados' },
  { value: 'vendido',    label: 'Vendidos' },
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mais recentes' },
  { value: 'oldest',     label: 'Mais antigos' },
  { value: 'price_desc', label: 'Preço (maior)' },
  { value: 'price_asc',  label: 'Preço (menor)' },
  { value: 'km_asc',     label: 'KM (menor)' },
]

export default function CarFilters({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const [search, setSearch] = useState(searchParams.q ?? '')

  const push = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString())
      value ? p.set(key, value) : p.delete(key)
      router.replace(`${pathname}?${p.toString()}`)
    },
    [params, pathname, router],
  )

  // Debounce da busca (não é fetch — apenas atualiza URL)
  useEffect(() => {
    const t = setTimeout(() => push('q', search), 300)
    return () => clearTimeout(t)
  }, [search, push])

  const active = searchParams.status ?? 'todos'

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Status tabs */}
      <div className="flex rounded-xl border border-marine-100 bg-marine-50 p-1 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => push('status', tab.value === 'todos' ? '' : tab.value)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${
              active === tab.value
                ? 'bg-white text-marine-900 shadow-sm'
                : 'text-marine-500 hover:text-marine-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tipo */}
      <select
        defaultValue={searchParams.category ?? 'todos'}
        onChange={e => push('category', e.target.value === 'todos' ? '' : e.target.value)}
        className="rounded-xl border border-marine-100 bg-white px-3 py-2 text-[12px] font-semibold text-marine-700 outline-none"
      >
        <option value="todos">Todos os tipos</option>
        <option value="novo">Novo</option>
        <option value="seminovo">Seminovo</option>
        <option value="repasse">Repasse</option>
      </select>

      {/* Sort */}
      <select
        defaultValue={searchParams.sort ?? 'newest'}
        onChange={e => push('sort', e.target.value)}
        className="rounded-xl border border-marine-100 bg-white px-3 py-2 text-[12px] font-semibold text-marine-700 outline-none"
      >
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-marine-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar marca, modelo, placa…"
          className="w-full rounded-xl border border-marine-100 bg-white py-2 pl-9 pr-3 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
        />
      </div>
    </div>
  )
}
