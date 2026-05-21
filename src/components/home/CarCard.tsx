'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { Car } from '@/types'
import { carWhatsAppLink } from '@/lib/whatsapp'

const categoryBadge = {
  novo: { label: 'NOVO', bg: '#E50914', color: '#fff' },
  seminovo: { label: 'SEMINOVO', bg: '#ffffff', color: '#000000' },
  repasse: { label: 'REPASSE', bg: '#FFA500', color: '#000000' },
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatKm(km: number): string {
  if (km === 0) return '0km'
  return `${km.toLocaleString('pt-BR')}km`
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface Props {
  car: Car
  index: number
}

export default function CarCard({ car, index }: Props) {
  const [liked, setLiked] = useState(false)
  const badge = categoryBadge[car.category]
  const isSold = car.status === 'vendido'
  const isReserved = car.status === 'reservado'
  const carName = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const waLink = carWhatsAppLink(carName, car.year, car.slug)

  return (
    <motion.div
      className="group flex w-[240px] flex-shrink-0 flex-col overflow-hidden rounded-sm bg-bg-secondary md:w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={!isSold ? { y: -3, boxShadow: '0 8px 32px rgba(74,144,226,0.2)' } : {}}
    >
      {/* Image */}
      <div className="relative h-[152px] w-full overflow-hidden bg-bg-tertiary md:h-[180px]">
        <Image
          src={car.coverImage}
          alt={`${carName} ${car.year}`}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale' : ''}`}
          sizes="(max-width: 768px) 240px, 33vw"
          loading="lazy"
        />

        {/* VENDIDO overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div
              className="rotate-[-20deg] border-2 border-red-600 px-4 py-1"
              style={{ color: '#E50914' }}
            >
              <span className="font-anton text-[22px] tracking-widest" style={{ fontFamily: 'var(--font-anton)' }}>
                VENDIDO
              </span>
            </div>
          </div>
        )}

        {/* RESERVADO badge */}
        {isReserved && (
          <div className="absolute inset-x-0 bottom-0 bg-yellow-500/90 py-0.5 text-center">
            <span className="text-[9px] font-bold tracking-[0.12em] text-black">RESERVADO</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute left-2.5 top-2.5">
          <span
            className="px-2 py-0.5 text-[9px] font-bold tracking-[0.1em]"
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>

        {/* Heart */}
        {!isSold && (
          <button
            aria-label={liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            onClick={() => setLiked(!liked)}
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart
              size={13}
              className={liked ? 'fill-accent-red text-accent-red' : 'text-white'}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-[14px] font-bold leading-tight text-white">
          {car.brand} {car.model}
          {car.version && (
            <span className="ml-1 text-[11px] font-medium text-text-muted">{car.version}</span>
          )}
        </h3>
        <p className="mt-1 text-[10px] font-medium tracking-wide text-text-muted">
          {car.year} &bull; {formatKm(car.km)} &bull; {car.fuel}
        </p>

        {/* Highlights */}
        <div className="mt-2 flex flex-wrap gap-1">
          {car.highlights.slice(0, 2).map((h) => (
            <span
              key={h}
              className="border border-bg-tertiary px-1.5 py-0.5 text-[9px] font-medium text-text-muted"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <p className="font-inter text-[16px] font-extrabold text-accent-red">
            {formatPrice(car.price)}
          </p>
          {car.oldPrice && (
            <p className="text-[11px] text-text-muted line-through">
              {formatPrice(car.oldPrice)}
            </p>
          )}
        </div>

        {car.negotiable && (
          <p className="mt-0.5 text-[9px] font-medium tracking-wide text-text-muted">
            Aceita negociação
          </p>
        )}

        {/* Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`/carros/${car.slug}`}
            className="flex items-center justify-center border border-bg-tertiary py-2 text-[10px] font-bold tracking-[0.08em] text-text-secondary transition-colors hover:border-white/30 hover:text-white"
          >
            VER
          </a>
          {isSold ? (
            <div className="flex items-center justify-center bg-bg-tertiary py-2 text-[10px] font-bold tracking-[0.08em] text-text-muted cursor-not-allowed">
              VENDIDO
            </div>
          ) : (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-accent-red py-2 text-[10px] font-bold tracking-[0.08em] text-white transition-colors hover:bg-accent-red-dark"
            >
              <WhatsAppIcon className="h-3 w-3" />
              CHAMAR
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
