import Link from 'next/link'
import { Camera, TrendingUp, Zap, Handshake, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CarCard from '@/components/home/CarCard'
import { cars } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Repasse de Veículos | Rafael Mota - Toyolex Roraima',
  description:
    'Quer vender seu carro? Rafael Mota faz o repasse com avaliação justa e processo rápido. Envie fotos pelo WhatsApp e receba proposta em minutos.',
}

const repasses = cars.filter((c) => c.category === 'repasse')

const steps = [
  {
    num: '01',
    title: 'Envie as fotos',
    desc: 'Mande fotos do seu carro pelo WhatsApp. Exterior, interior e painel.',
  },
  {
    num: '02',
    title: 'Avaliação justa',
    desc: 'Rafael analisa e envia uma proposta baseada na tabela FIPE e mercado local.',
  },
  {
    num: '03',
    title: 'Documentação',
    desc: 'Cuidamos de toda a papelada. Vistoria, transferência e liberação de multas.',
  },
  {
    num: '04',
    title: 'Dinheiro na conta',
    desc: 'Pagamento à vista, rápido e seguro. Sem enrolação.',
  },
]

const benefits = [
  {
    icon: Camera,
    title: 'Tudo pelo WhatsApp',
    desc: 'Envie fotos do conforto da sua casa. Sem precisar ir até a loja.',
  },
  {
    icon: TrendingUp,
    title: 'Avaliação Justa',
    desc: 'Preço baseado em FIPE e mercado local, sem abaixar o valor do seu carro.',
  },
  {
    icon: Zap,
    title: 'Processo Rápido',
    desc: 'Proposta em minutos. Negociação resolvida em até 48 horas.',
  },
  {
    icon: Handshake,
    title: 'Segurança Total',
    desc: '15 anos de experiência garantem um processo transparente e sem riscos.',
  },
]

export default function RepassePage() {
  return (
    <main className="min-h-screen bg-bg-primary pt-[60px]">
      {/* Hero */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background: 'linear-gradient(135deg, #1a0306 0%, #0A1628 40%, #122038 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(229,9,20,0.5) 40px,
              rgba(229,9,20,0.5) 41px
            )`,
          }}
        />
        <Container>
          <div className="max-w-2xl">
            <p className="section-label mb-4">QUER VENDER SEU CARRO?</p>
            <h1
              className="font-anton text-[42px] leading-none text-white md:text-[72px]"
              style={{ fontFamily: 'var(--font-anton)', letterSpacing: '0.02em' }}
            >
              EU FAÇO O
              <br />
              <span className="text-accent-red">REPASSE.</span>
            </h1>
            <p className="mt-5 text-[14px] leading-relaxed text-text-secondary md:text-[16px]">
              Avaliação justa, processo rápido e pagamento garantido. Envie as fotos do seu carro agora pelo WhatsApp e receba uma proposta em minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/5595999999999?text=Ol%C3%A1%20Rafael!%20Quero%20enviar%20fotos%20do%20meu%20carro%20para%20avalia%C3%A7%C3%A3o%20de%20repasse."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-white transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                ENVIAR FOTOS AGORA
              </a>
              <Link
                href="/estoque"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-white transition-colors hover:border-white/40"
              >
                VER REPASSES NO ESTOQUE
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-bg-tertiary py-12" style={{ background: '#0A1628' }}>
        <Container>
          <p className="section-label mb-8 text-center">COMO FUNCIONA</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center font-bold"
                  style={{
                    border: '1px solid rgba(229,9,20,0.3)',
                    color: '#E50914',
                    fontFamily: 'var(--font-anton)',
                    fontSize: '20px',
                  }}
                >
                  {num}
                </div>
                <h3 className="text-[13px] font-bold text-white">{title}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-b border-bg-tertiary" style={{ background: '#122038' }}>
        <Container>
          <div className="grid grid-cols-2 gap-px bg-bg-tertiary md:grid-cols-4">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-bg-secondary p-6 md:p-8">
                <Icon size={22} className="mb-4 text-accent-red" />
                <h3 className="text-[13px] font-bold text-white">{title}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Repasses in stock */}
      {repasses.length > 0 && (
        <section className="py-12 md:py-16">
          <Container>
            <div className="mb-8">
              <p className="section-label mb-2">NO ESTOQUE</p>
              <h2
                className="font-anton text-[28px] leading-none text-white md:text-[40px]"
                style={{ fontFamily: 'var(--font-anton)' }}
              >
                Repasses Disponíveis
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {repasses.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  )
}
