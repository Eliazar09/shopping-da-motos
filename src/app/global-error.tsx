'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0D0D0F', marginBottom: '0.5rem' }}>
            Algo deu errado
          </h2>
          <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Tente recarregar a página.
          </p>
          <button
            onClick={reset}
            style={{ background: '#0D0D0F', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
