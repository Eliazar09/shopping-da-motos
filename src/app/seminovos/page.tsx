import Link from 'next/link'
import { ClipboardCheck, BadgeCheck, Percent, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CarCard from '@/components/home/CarCard'
import { cars } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Carros Seminovos | Rafael Mota - Toyolex Roraima',
  description:
    'Seminovos revisados e com procedência garantida em Roraima. Vistoria cautelar aprovada, IPVA pago e garantia de loja. Fale com Rafael Mota.',
}

const seminovos = cars.filter((c) => c.category === 'seminovo')

const benefits = [
  {
    icon: ClipboardCheck,
    title: 'Laudo Cautelar',
    desc: 'Todos os veículos passam por vistoria cautelar completa com laudo aprovado.',
  },
  {
    icon: BadgeCheck,
    title: 'Procedência Garantida',
    desc: 'Histórico verificado, sem ocorrência de sinistro ou roubo. Documentação em dia.',
  },
  {
    icon: Percent,
    title: 'Melhor Negócio',
    desc: 'Veículos com excelente custo-benefício, muitas vezes abaixo da tabela FIPE.',
  },
  {
    icon: Clock,
    title: 'Garantia de Loja',
    desc: 'Garantia adicional no motor e câmbio por 90 dias em todos os seminovos.',
  },
]

export default function SeminovosPage() {
  return (
    <main className="min-h-screen bg-bg-primary pt-[60px]">
      {/* Hero */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0D1B35 40%, #122038 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #ffffff,
              #ffffff 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />
        <Container>
          <div className="max-w-2xl">
            <p className="section-label mb-4">COM PROCEDÊNCIA</p>
            <h1
              className="font-anton text-[42px] leading-none text-white md:text-[72px]"
              style={{ fontFamily: 'var(--font-anton)', letterSpacing: '0.02em' }}
            >
              SEMI
              <br />
              <span style={{ color: '#ffffff', WebkitTextStroke: '1px #E50914' }}>NOVOS.</span>
            </h1>
            <p className="mt-5 text-[14px] leading-relaxed text-text-secondary md:text-[16px]">
              Veículos revisados, com laudo cautelar aprovado e histórico verificado. A qualidade que você merece com o preço que cabe no seu bolso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/5595999999999?text=Ol%C3%A1%20Rafael!%20Quero%20ver%20os%20semin%C3%B3vos%20dispon%C3%ADveis."
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
              {seminovos.length} {seminovos.length === 1 ? 'Veículo Disponível' : 'Veículos Disponíveis'}
            </h2>
          </div>

          {seminovos.length === 0 ? (
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
              {seminovos.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
