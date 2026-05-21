'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import type { Car } from '@/types'
import { carWhatsAppLinkDynamic } from '@/lib/whatsapp'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface Props {
  car: Car
}

export default function SellerCard({ car }: Props) {
  const [copied, setCopied] = useState(false)
  const carName = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const waLink = carWhatsAppLinkDynamic(carName, car.year, car.slug)

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${carName} ${car.year}`, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // share cancelled
    }
  }

  return (
    <div
      className="rounded-sm p-5"
      style={{ background: '#122038', border: '1px solid #1A2B47' }}
    >
      {/* Seller info */}
      <div className="flex items-center gap-3 border-b border-bg-tertiary pb-4">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm text-[18px] font-bold"
          style={{ background: '#E50914', color: '#fff', fontFamily: 'var(--font-anton)' }}
        >
          RM
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">Rafael Mota</p>
          <p className="text-[10px] font-medium tracking-wide text-text-muted">
            Gerente de Negócios · Toyolex Roraima
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="text-[9px] font-medium text-green-400">Online agora</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="my-4 flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-secondary">Disponibilidade</span>
        {car.status === 'disponivel' ? (
          <span className="bg-green-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-green-400">
            DISPONÍVEL
          </span>
        ) : car.status === 'reservado' ? (
          <span className="bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-yellow-400">
            RESERVADO
          </span>
        ) : (
          <span className="bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-400">
            VENDIDO
          </span>
        )}
      </div>

      {/* CTA buttons */}
      {car.status !== 'vendido' ? (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 bg-[#25D366] py-3.5 text-[12px] font-bold tracking-[0.08em] text-white transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          TENHO INTERESSE
        </a>
      ) : (
        <div className="flex w-full items-center justify-center gap-2 bg-bg-tertiary py-3.5 text-[12px] font-bold tracking-[0.08em] text-text-muted cursor-not-allowed">
          VEÍCULO VENDIDO
        </div>
      )}

      <button
        onClick={handleShare}
        className="mt-2 flex w-full items-center justify-center gap-2 border border-bg-tertiary py-3 text-[11px] font-bold tracking-[0.08em] text-text-secondary transition-colors hover:border-white/20 hover:text-white"
      >
        {copied ? (
          <>
            <Check size={14} className="text-green-400" />
            <span className="text-green-400">LINK COPIADO!</span>
          </>
        ) : (
          <>
            <Share2 size={14} />
            COMPARTILHAR
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="mt-4 space-y-1.5 border-t border-bg-tertiary pt-4">
        {[
          '15+ anos de experiência',
          'Vistoria cautelar garantida',
          'Documentação sem pendências',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="h-1 w-1 flex-shrink-0 rounded-full bg-accent-red" />
            <span className="text-[10px] text-text-muted">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
