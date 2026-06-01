import type { ReactNode } from 'react'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'vip' | 'neutral'

const STYLES: Record<Variant, { bg: string; color: string; border: string }> = {
  success: { bg: '#D1FAE5', color: '#059669', border: '#6EE7B7' },
  warning: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
  danger:  { bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' },
  info:    { bg: '#EFF6FF', color: '#2563EB', border: '#93C5FD' },
  vip:     { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  neutral: { bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1' },
}

interface Props {
  variant?: Variant
  children: ReactNode
  dot?: boolean
  size?: 'sm' | 'md'
}

export default function Badge({ variant = 'neutral', children, dot, size = 'sm' }: Props) {
  const s = STYLES[variant]
  const px = size === 'md' ? '10px' : '8px'
  const py = size === 'md' ? '4px' : '2px'
  const fs = size === 'md' ? '11px' : '10px'

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-[0.06em]"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: `${py} ${px}`,
        fontSize: fs,
      }}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ background: s.color }}
        />
      )}
      {children}
    </span>
  )
}
