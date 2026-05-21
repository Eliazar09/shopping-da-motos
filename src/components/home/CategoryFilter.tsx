'use client'

import { motion } from 'framer-motion'
import type { CarCategory } from '@/types'

type Filter = CarCategory | 'todos'

const filters: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'TODOS' },
  { id: 'novo', label: 'NOVOS' },
  { id: 'seminovo', label: 'SEMINOVOS' },
  { id: 'repasse', label: 'REPASSE' },
]

interface Props {
  active: Filter
  onChange: (cat: Filter) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="sticky top-[60px] z-30 border-b border-bg-tertiary bg-bg-primary/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none md:justify-center">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className="relative flex-shrink-0 px-5 py-4 text-[11px] font-bold tracking-[0.12em] transition-colors md:px-7"
              style={{ color: active === f.id ? '#ffffff' : '#666666' }}
            >
              {f.label}
              {active === f.id && (
                <motion.div
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-red"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
