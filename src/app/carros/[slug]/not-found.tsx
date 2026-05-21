import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function CarNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4 pt-[60px]">
      <div className="w-full max-w-md text-center">
        <p className="section-label mb-4">VEÍCULO NÃO ENCONTRADO</p>

        <h1
          className="font-anton text-[48px] leading-none text-white md:text-[64px]"
          style={{ fontFamily: 'var(--font-anton)' }}
        >
          404
        </h1>

        <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">
          Este veículo pode ter sido vendido ou o link está incorreto.
          Confira nosso estoque completo para encontrar o carro ideal para você.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/estoque"
            className="inline-flex items-center justify-center gap-2 bg-accent-red px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-white transition-colors hover:bg-accent-red-dark"
          >
            <Search size={14} />
            VER ESTOQUE
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-bg-tertiary px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-text-secondary transition-colors hover:border-white/20 hover:text-white"
          >
            <ArrowLeft size={14} />
            INÍCIO
          </Link>
        </div>
      </div>
    </main>
  )
}
