'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import type { Car } from '@/types'
import { carWhatsAppLinkDynamic, consorcioWhatsAppLinkDynamic, entregaWhatsAppLinkDynamic } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

interface Props {
  car: Car
}

export default function SellerCard({ car }: Props) {
  const [copied, setCopied] = useState(false)
  const carName = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const waLink  = car.category === 'consorcio'
    ? consorcioWhatsAppLinkDynamic(car.consorcioTipoGrupo ?? carName, car.slug)
    : car.category === 'entregas'
    ? entregaWhatsAppLinkDynamic()
    : carWhatsAppLinkDynamic(carName, car.year, car.slug)

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
      className="rounded-2xl p-6"
      style={{ background: '#FAFBFC', border: '1px solid #E4E7EB', boxShadow: '0 2px 4px rgba(13,13,15,0.06)' }}
    >
      {/* Availability */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[12px] font-medium text-marine-600">Disponibilidade</span>
        {car.category === 'entregas' ? (
          <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wide text-white" style={{ background: '#6C3FF5', border: '1px solid #5a32d0' }}>
            CONCLUÍDA
          </span>
        ) : car.category === 'consorcio' ? (
          <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wide text-white" style={{ background: '#1a4d8f', border: '1px solid #1a3a6e' }}>
            OFERTA ATIVA
          </span>
        ) : car.status === 'disponivel' ? (
          <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold tracking-wide text-green-600" style={{ border: '1px solid #bbf7d0' }}>
            DISPONÍVEL
          </span>
        ) : car.status === 'reservado' ? (
          <span className="rounded-full bg-yellow-50 px-3 py-1 text-[10px] font-bold tracking-wide text-yellow-600" style={{ border: '1px solid #fde68a' }}>
            RESERVADO
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold tracking-wide text-marine-500">
            VENDIDO
          </span>
        )}
      </div>

      {/* CTA */}
      {car.status !== 'vendido' ? (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-whatsapp py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-whatsapp-hover"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Tenho interesse
        </a>
      ) : (
        <div className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 py-3.5 text-[13px] font-bold text-marine-400">
          Veículo vendido
        </div>
      )}

      <button
        onClick={handleShare}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[12px] font-semibold text-marine-600 transition-all hover:border-marine-300 hover:bg-marine-50 hover:text-marine-900"
      >
        {copied ? (
          <>
            <Check size={14} className="text-whatsapp" />
            <span className="text-whatsapp">Link copiado!</span>
          </>
        ) : (
          <>
            <Share2 size={14} />
            Compartilhar
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
        {[
          '15+ anos de experiência',
          'Vistoria cautelar garantida',
          'Documentação sem pendências',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span className="text-[12px] text-marine-500">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
