'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import CarImage from '@/components/ui/CarImage'
import { Gauge, Settings2, Calendar } from 'lucide-react'
import type { Car } from '@/types'
import { carWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { TRANSMISSION_LABELS } from '@/lib/labels'

const CATEGORY_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  novo:           { label: 'Novo',         bg: '#0A1929', color: '#fff' },
  seminovo:       { label: 'Seminovo',     bg: '#fff',    color: '#0A1929' },
  repasse:        { label: 'Repasse',      bg: '#B8860B', color: '#fff' },
  'venda-direta': { label: 'Venda Direta', bg: '#1a6b3c', color: '#fff' },
  consorcio:      { label: 'Consórcio',   bg: '#1a4d8f', color: '#fff' },
  entregas:       { label: 'Entregas',    bg: '#6C3FF5', color: '#fff' },
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatKm(km: number): string {
  if (km === 0) return '0 km'
  return `${km.toLocaleString('pt-BR')} km`
}

interface Props {
  car: Car
  index: number
}

export default function CarCard({ car, index }: Props) {
  const isSold     = car.status === 'vendido'
  const isReserved = car.status === 'reservado'
  const carName    = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const waLink     = carWhatsAppLink(carName, car.year, car.slug)
  const cat        = CATEGORY_STYLE[car.category] ?? CATEGORY_STYLE.seminovo

  return (
    <motion.div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white"
      style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(16,42,67,0.07)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={!isSold ? { y: -4, boxShadow: '0 16px 36px rgba(16,42,67,0.12)' } : {}}
    >
      {/* ── Image ───────────────────────────────── */}
      <Link href={`/carros/${car.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <CarImage
          src={car.coverImage}
          alt={`${carName} ${car.year}`}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-60' : ''}`}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          loading="lazy"
        />

        {/* VENDIDO overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-marine-900/50">
            <span className="rotate-[-20deg] border-2 border-white px-4 py-1 text-[18px] font-bold tracking-widest text-white">
              VENDIDO
            </span>
          </div>
        )}

        {/* RESERVADO stripe */}
        {isReserved && (
          <div className="absolute inset-x-0 bottom-0 bg-amber-500/90 py-1 text-center">
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white">Reservado</span>
          </div>
        )}

        {/* Category badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm"
          style={{ background: cat.bg, color: cat.color, border: cat.bg === '#fff' ? '1px solid #E4E7EB' : 'none' }}
        >
          {cat.label}
        </span>
      </Link>

      {/* ── Info ────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="truncate text-[15px] font-bold leading-tight text-marine-900"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {car.brand} {car.model}
            </h3>
            {car.version && (
              <p className="mt-0.5 truncate text-[11px] text-marine-400">{car.version}</p>
            )}
          </div>
          <p
            className="shrink-0 text-[16px] font-bold text-marine-900"
            style={{ fontFamily: 'var(--font-fraunces)', fontFeatureSettings: "'tnum' 1" }}
          >
            {formatPrice(car.price)}
          </p>
        </div>

        {/* Specs row */}
        <div className="mt-3 flex items-center gap-4 text-[12px] text-marine-500">
          <span className="flex items-center gap-1.5">
            <Gauge size={14} className="text-marine-300" strokeWidth={1.8} />
            {formatKm(car.km)}
          </span>
          <span className="flex items-center gap-1.5">
            <Settings2 size={14} className="text-marine-300" strokeWidth={1.8} />
            {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-marine-300" strokeWidth={1.8} />
            {car.year}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/carros/${car.slug}`}
            className="flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-[12px] font-semibold text-marine-700 transition-all hover:border-marine-300 hover:bg-marine-50"
          >
            Ver detalhes
          </Link>

          {isSold ? (
            <div className="flex cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 py-2.5 text-[12px] font-semibold text-marine-400">
              Vendido
            </div>
          ) : (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
