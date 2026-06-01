'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A1929', marginBottom: '0.5rem' }}>
        Algo deu errado
      </h2>
      <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Tente recarregar a página.
      </p>
      <button
        onClick={reset}
        style={{ background: '#0A1929', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}
      >
        Tentar novamente
      </button>
    </div>
  )
}
