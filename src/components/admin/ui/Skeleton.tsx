interface Props {
  className?: string
  count?: number
  gap?: string
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-marine-100 ${className}`}
      style={{
        background: 'linear-gradient(90deg, #F1F5F9 25%, #E4E7EB 50%, #F1F5F9 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  )
}

export default function Skeleton({ className = 'h-20', count = 1, gap = 'gap-3' }: Props) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className={`flex flex-col ${gap}`}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonLine key={i} className={className} />
        ))}
      </div>
    </>
  )
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl bg-white p-5 space-y-3"
      style={{ border: '1px solid #E4E7EB' }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E8EDF2 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
      `}</style>
      <div className="flex items-center gap-3">
        <div className="shimmer h-10 w-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3.5 w-32" />
          <div className="shimmer h-2.5 w-20" />
        </div>
      </div>
      <div className="shimmer h-2.5 w-full" />
      <div className="shimmer h-2.5 w-3/4" />
      <div className="shimmer h-9 w-full rounded-xl" />
    </div>
  )
}
