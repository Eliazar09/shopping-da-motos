import type { ElementType, ReactNode } from 'react'

interface Props {
  icon: ElementType
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: '#F1F5F9', border: '1px solid #E4E7EB' }}
      >
        <Icon size={28} className="text-marine-300" strokeWidth={1.5} color="#A0BADC" />
      </div>
      <p
        className="text-[16px] font-bold text-marine-800"
        style={{ fontFamily: 'var(--font-fraunces)' }}
      >
        {title}
      </p>
      {description && (
        <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-marine-400">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
