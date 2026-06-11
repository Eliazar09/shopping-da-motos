'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell } from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Topbar() {
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('Admin')
  const [initial, setInitial] = useState('A')

  useEffect(() => {
    setMounted(true)
    const supabase = createDynamicClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const raw = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'
        const pretty = raw.charAt(0).toUpperCase() + raw.slice(1)
        setName(pretty)
        setInitial(pretty.charAt(0).toUpperCase())
      }
    })
  }, [])

  const greet = mounted ? greeting() : 'Olá'
  const date  = mounted ? format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR }) : ''

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
          fontSize: 16, fontWeight: 700, color: '#0D0D0F',
          whiteSpace: 'nowrap', lineHeight: 1.25,
          fontFamily: 'var(--font-oswald)',
          letterSpacing: '0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {greet}, {name}!
        </p>
        {date && (
          <p className="hidden md:block" style={{ fontSize: 11, color: '#A1A1AA', textTransform: 'capitalize', marginTop: 1 }}>
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
          cursor: 'pointer', color: '#6B6B70', flexShrink: 0,
        }}>
          <Bell size={16} />
        </button>

        {/* Avatar — initials */}
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          borderRadius: 10, border: '1px solid #E4E7EB',
          background: '#0D0D0F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {initial}
          </span>
        </div>
      </div>
    </header>
  )
}
