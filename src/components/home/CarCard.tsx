'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import CarImage from '@/components/ui/CarImage'
import { Gauge, Settings2, Calendar, CreditCard, CheckCircle2 } from 'lucide-react'
import type { Car } from '@/types'
import { carWhatsAppLink, consorcioWhatsAppLinkDynamic, entregaWhatsAppLinkDynamic } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { TRANSMISSION_LABELS } from '@/lib/labels'

const CATEGORY_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  novo:           { label: 'Novo',         bg: '#0D0D0F', color: '#fff' },
  seminovo:       { label: 'Seminovo',     bg: '#fff',    color: '#0D0D0F' },
  repasse:        { label: 'Repasse',      bg: '#B8860B', color: '#fff' },
  'venda-direta': { label: 'Venda Direta', bg: '#1a6b3c', color: '#fff' },
  consorcio:      { label: 'Consórcio',   bg: '#1a4d8f', color: '#fff' },
  entregas:       { label: 'Entregue!',   bg: '#6C3FF5', color: '#fff' },
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatKm(km: number): string {
  if (km === 0) return '0 km'
  return `${km.toLocaleString('pt-BR')} km`
}

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const cardBase = 'group flex flex-col overflow-hidden rounded-2xl'
const cardStyle = { background: '#fff', border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(13,13,15,0.06)' }

interface Props {
  car: Car
  index: number
}

export default function CarCard({ car, index }: Props) {
  if (car.category === 'consorcio') return <ConsorcioCard car={car} index={index} />
  if (car.category === 'entregas')  return <EntregaCard   car={car} index={index} />
  return <DefaultCarCard car={car} index={index} />
}

// ── Carro normal ────────────────────────────────────────────────────────────
function DefaultCarCard({ car, index }: Props) {
  const isSold     = car.status === 'vendido'
  const isReserved = car.status === 'reservado'
  const carName    = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const waLink     = carWhatsAppLink(carName, car.year, car.slug)
  const cat        = CATEGORY_STYLE[car.category] ?? CATEGORY_STYLE.seminovo

  return (
    <motion.div
      className={cardBase}
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={!isSold ? { y: -4, boxShadow: '0 16px 36px rgba(13,13,15,0.12)' } : {}}
    >
      {/* Image */}
      <Link href={`/motos/${car.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <CarImage
          src={car.coverImage}
          alt={`${carName} ${car.year}`}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-60' : ''}`}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          loading="lazy"
        />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-marine-900/50">
            <span className="rotate-[-20deg] border-2 border-white px-4 py-1 text-[18px] font-bold tracking-widest text-white">
              VENDIDO
            </span>
          </div>
        )}
        {isReserved && (
          <div className="absolute inset-x-0 bottom-0 bg-amber-500/90 py-1 text-center">
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white">Reservado</span>
          </div>
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm"
          style={{ background: cat.bg, color: cat.color, border: cat.bg === '#fff' ? '1px solid #E4E7EB' : 'none' }}
        >
          {cat.label}
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold leading-tight text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {car.brand} {car.model}
            </h3>
            {car.version && <p className="mt-0.5 truncate text-[11px] text-marine-500">{car.version}</p>}
          </div>
          <p className="shrink-0 text-[16px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)', fontFeatureSettings: "'tnum' 1" }}>
            {formatPrice(car.price)}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-4 text-[12px] text-marine-500">
          <span className="flex items-center gap-1.5">
            <Gauge size={14} className="text-marine-300" strokeWidth={1.8} />
            {formatKm(car.km)}
          </span>
          {car.transmission && (
            <span className="flex items-center gap-1.5">
              <Settings2 size={14} className="text-marine-300" strokeWidth={1.8} />
              {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-marine-300" strokeWidth={1.8} />
            {car.year}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/motos/${car.slug}`}
            className="flex items-center justify-center rounded-xl border py-2.5 text-[12px] font-semibold text-marine-700 transition-all"
            style={{ borderColor: '#E4E7EB', background: 'transparent' }}
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

// ── Consórcio ───────────────────────────────────────────────────────────────
function ConsorcioCard({ car, index }: Props) {
  const title  = car.consorcioTipoGrupo ?? car.model
  const waLink = consorcioWhatsAppLinkDynamic(title, car.slug)

  return (
    <motion.div
      className={cardBase}
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(26,77,143,0.14)' }}
    >
      {/* Image */}
      <Link href={`/motos/${car.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#0d2547]">
        {car.coverImage && !car.coverImage.includes('placeholder') ? (
          <Image
            src={car.coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard size={48} className="text-white/20" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#1a4d8f] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          Consórcio
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="truncate text-[15px] font-bold leading-tight text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
          {title}
        </h3>
        <p className="mt-0.5 text-[11px] text-marine-400">Consórcio de moto</p>

        <div className="mt-3 space-y-1.5">
          {car.consorcioValorParcela && (
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)', fontFeatureSettings: "'tnum' 1" }}>
                {formatPrice(car.consorcioValorParcela)}
              </span>
              <span className="text-[11px] text-marine-400">/mês</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-[12px] text-marine-500">
            {car.consorcioPrazo && (
              <span>{car.consorcioPrazo} meses</span>
            )}
            {car.consorcioValorCarta && (
              <span>Carta: {formatPrice(car.consorcioValorCarta)}</span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/motos/${car.slug}`}
            className="flex items-center justify-center rounded-xl border py-2.5 text-[12px] font-semibold text-marine-700 transition-all"
            style={{ borderColor: '#E4E7EB', background: 'transparent' }}
          >
            Ver detalhes
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ── Entrega ─────────────────────────────────────────────────────────────────
function EntregaCard({ car, index }: Props) {
  const veiculo = car.entregaVeiculo ?? car.model
  const cliente = car.entregaClienteNome ?? ''
  const data    = car.entregaData ? formatDate(car.entregaData) : ''
  const waLink  = entregaWhatsAppLinkDynamic()

  return (
    <motion.div
      className={cardBase}
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(108,63,245,0.14)' }}
    >
      {/* Image */}
      <Link href={`/motos/${car.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#1a0d40]">
        {car.coverImage && !car.coverImage.includes('placeholder') ? (
          <Image
            src={car.coverImage}
            alt={`${cliente} - ${veiculo}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-white/20" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#6C3FF5] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          Entregue!
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="truncate text-[15px] font-bold leading-tight text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
          {veiculo}
        </h3>
        {cliente && <p className="mt-0.5 truncate text-[12px] font-medium text-marine-600">{cliente}</p>}
        {data    && <p className="mt-0.5 text-[11px] text-marine-400">{data}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/motos/${car.slug}`}
            className="flex items-center justify-center rounded-xl border py-2.5 text-[12px] font-semibold text-marine-700 transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
          >
            Ver entrega
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#6C3FF5] py-2.5 text-[12px] font-bold text-white transition-all hover:bg-[#5a32d0]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  )
}
