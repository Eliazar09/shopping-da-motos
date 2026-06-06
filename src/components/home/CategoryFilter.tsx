'use client'

import { motion } from 'framer-motion'
import type { CarCategory } from '@/types'

type Filter = CarCategory | 'todos'

const filters: { id: Filter; label: string }[] = [
  { id: 'todos',        label: 'Todos'        },
  { id: 'novo',         label: 'Novos'        },
  { id: 'seminovo',     label: 'Seminovos'    },
  { id: 'venda-direta', label: 'Venda Direta' },
  { id: 'consorcio',    label: 'Consórcio'    },
  { id: 'repasse',      label: 'Repasse'      },
  { id: 'entregas',     label: 'Entregas'     },
]

interface Props {
  active: Filter
  onChange: (cat: Filter) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <motion.div
      className="relative z-10 backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.94)', borderBottom: '1px solid rgba(10,25,41,0.08)' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-1.5 overflow-x-auto md:justify-center md:gap-2"
          style={{
            padding: '10px 1rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filters.map((f, i) => {
            const isActive = active === f.id
            return (
              <motion.button
                key={f.id}
                onClick={() => onChange(f.id)}
                className="relative flex-shrink-0 px-3 md:px-6"
                style={{
                  minHeight: 36,
                  borderRadius: 999,
                  color: isActive ? '#ffffff' : '#4A5568',
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: 'clamp(13px, 3.5vw, 17px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  border: isActive ? 'none' : '1.5px solid rgba(10,25,41,0.12)',
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: '#0A1929' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative z-10 block whitespace-nowrap">
                  {f.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
