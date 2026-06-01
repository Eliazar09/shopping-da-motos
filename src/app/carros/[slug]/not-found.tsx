import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import { defaultWhatsAppLink } from '@/lib/whatsapp'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function CarNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 pt-[64px]">
        <div className="w-full max-w-lg text-center">
          <p className="section-label mb-4">Veículo não encontrado</p>

          <h1
            className="font-bold leading-none text-marine-900"
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(80px, 14vw, 140px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            404
          </h1>

          <p className="mt-6 text-[15px] leading-relaxed text-marine-500 md:text-[17px]">
            Este veículo pode ter sido vendido ou o link está incorreto.
            Confira nosso estoque completo para encontrar o carro ideal para você.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/estoque"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[13px] font-bold text-white transition-all hover:bg-accent-hover"
              style={{ boxShadow: '0 12px 32px rgba(227,30,36,0.15)' }}
            >
              <Search size={14} />
              Ver estoque completo
            </Link>
            <a
              href={defaultWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-marine-200 bg-marine-50 px-7 py-3.5 text-[13px] font-bold text-marine-700 transition-all hover:border-marine-500"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              Falar no WhatsApp
            </a>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-marine-400 transition-colors hover:text-marine-700"
          >
            <ArrowLeft size={13} />
            Voltar ao início
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
