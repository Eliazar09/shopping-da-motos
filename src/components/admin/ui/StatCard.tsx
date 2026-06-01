'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ElementType } from 'react'

interface Props {
  icon: ElementType
  label: string
  value: string | null
  sub?: string
  accent?: string
  href?: string
  index?: number
  loading?: boolean
}

export default function StatCard({
  icon: Icon, label, value, sub, accent = '#3B82F6', href, index = 0, loading,
}: Props) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={href ? { y: -2, boxShadow: '0 8px 24px rgba(10,25,41,0.10)' } : {}}
      className="relative overflow-hidden rounded-2xl bg-white p-5 transition-shadow"
      style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(10,25,41,0.06)' }}
    >
      {/* Accent strip top-left */}
      <div
        className="absolute left-0 top-0 h-[3px] w-10 rounded-br-full"
        style={{ background: accent }}
      />

      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `${accent}18` }}
      >
        <Icon size={18} style={{ color: accent }} strokeWidth={1.8} />
      </div>

      {loading ? (
        <div className="mt-3 space-y-2">
          <div
            className="h-8 w-28 rounded-lg animate-pulse"
            style={{ background: 'linear-gradient(90deg,#F1F5F9 25%,#E4E7EB 50%,#F1F5F9 75%)', backgroundSize: '200% 100%' }}
          />
          <div
            className="h-2.5 w-16 rounded animate-pulse"
            style={{ background: '#F1F5F9' }}
          />
        </div>
      ) : (
        <>
          <p
            className="mt-3 text-[28px] font-bold leading-none text-marine-900 sm:text-[32px]"
            style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
          >
            {value ?? '—'}
          </p>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-marine-400">
            {label}
          </p>
          {sub && <p className="mt-0.5 text-[11px] text-marine-400">{sub}</p>}
        </>
      )}
    </motion.div>
  )

  return href ? <Link href={href} className="block">{inner}</Link> : inner
}
