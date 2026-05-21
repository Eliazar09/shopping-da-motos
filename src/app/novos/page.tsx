import Link from 'next/link'
import { Shield, Star, Wrench, Gift, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CarCard from '@/components/home/CarCard'
import { cars } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Carros Novos Toyota | Rafael Mota - Toyolex Roraima',
  description:
    'Carros novos Toyota 0km em Roraima. Hilux, SW4, Corolla, Corolla Cross, Yaris e muito mais. Fale com Rafael Mota, seu consultor Toyota de confiança.',
}

const novos = cars.filter((c) => c.category === 'novo')

const benefits = [
  {
    icon: Shield,
    title: 'Garantia Toyota',
    desc: '3 anos ou 100.000km de garantia de fábrica com suporte técnico oficial.',
  },
  {
    icon: Star,
    title: 'Tecnologia de Ponta',
    desc: 'Últimas versões com Toyota Safety Sense, conectividade e eficiência superiores.',
  },
  {
    icon: Wrench,
    title: 'Revisões Programadas',
    desc: 'Revisões periódicas com preço fixo garantindo desempenho e segurança.',
  },
  {
    icon: Gift,
    title: 'Brindes e Benefícios',
    desc: 'Condições especiais, primeiro emplacamento e assessoria no financiamento.',
  },
]

export default function NovosPage() {
  return (
    <main className="min-h-screen bg-bg-primary pt-[60px]">
      {/* Hero */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #122038 50%, #1A2B47 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(229,9,20,0.4) 0px,
              rgba(229,9,20,0.4) 1px,
              transparent 1px,
              transparent 80px
            )`,
          }}
        />
        <Container>
          <div className="max-w-2xl">
            <p className="section-label mb-4">TOYOTA RORAIMA</p>
            <h1
              className="font-anton text-[42px] leading-none text-white md:text-[72px]"
              style={{ fontFamily: 'var(--font-anton)', letterSpacing: '0.02em' }}
            >
              CARROS
              <br />
              <span className="text-accent-red">NOVOS.</span>
            </h1>
            <p className="mt-5 text-[14px] leading-relaxed text-text-secondary md:text-[16px]">
              A linha completa Toyota 0km disponível em Roraima. Do compacto urbano ao SUV mais imponente — todos com garantia de fábrica e assessoria personalizada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/5595999999999?text=Ol%C3%A1%20Rafael!%20Quero%20ver%20os%20carros%20novos%20dispon%C3%ADveis."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent-red px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-white transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                FALAR COM RAFAEL
              </a>
              <Link
                href="/estoque"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-white transition-colors hover:border-white/40"
              >
                VER ESTOQUE COMPLETO
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-y border-bg-tertiary" style={{ background: '#122038' }}>
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

      {/* Cars grid */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-8">
            <p className="section-label mb-2">DISPONÍVEIS</p>
            <h2
              className="font-anton text-[28px] leading-none text-white md:text-[40px]"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              {novos.length} {novos.length === 1 ? 'Modelo Disponível' : 'Modelos Disponíveis'}
            </h2>
          </div>

          {novos.length === 0 ? (
            <p className="text-[14px] text-text-muted">
              Nenhum veículo disponível no momento.{' '}
              <a
                href="https://wa.me/5595999999999"
                className="text-accent-red hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Consulte o Rafael no WhatsApp.
              </a>
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {novos.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
