'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell } from 'lucide-react'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Topbar() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const greet  = mounted ? greeting() : 'Olá'
  const date   = mounted ? format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR }) : ''

  return (
    <header style={{
      height: 64, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      background: '#fff',
      borderBottom: '1px solid #E4E7EB',
    }}>
      {/* Left: greeting */}
      <div className="pl-14 md:pl-0" style={{ minWidth: 0, overflow: 'hidden' }}>
        <p style={{
          fontSize: 16, fontWeight: 700, color: '#0A1929',
          whiteSpace: 'nowrap', lineHeight: 1.25,
          fontFamily: 'var(--font-fraunces)',
          letterSpacing: '-0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {greet}, Rafael!
        </p>
        {date && (
          <p className="hidden md:block" style={{ fontSize: 11, color: '#A0BADC', textTransform: 'capitalize', marginTop: 1 }}>
            {date}
          </p>
        )}
      </div>

      {/* Right: bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          border: '1px solid #E4E7EB', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#486581', flexShrink: 0,
        }}>
          <Bell size={16} />
        </button>

        {/* Avatar — hard-constrained, never overflows */}
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          borderRadius: 10, border: '1px solid #E4E7EB',
          background: '#fff', padding: 5, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
            alt="RM"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>
    </header>
  )
}
