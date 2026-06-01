import Link from 'next/link'
import { Camera, TrendingUp, Zap, Handshake, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { repaseWhatsAppLink, defaultWhatsAppLink } from '@/lib/whatsapp'
import CarCard from '@/components/home/CarCard'
import { getCarsByCategory } from '@/lib/queries/cars'

export const metadata: Metadata = {
  title: 'Repasse de Veículos | Rafael Mota - Toyolex Roraima',
  description:
    'Quer vender seu carro? Rafael Mota faz o repasse com avaliação justa e processo rápido. Envie fotos pelo WhatsApp e receba proposta em minutos.',
}

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

export default async function RepassePage() {
  const repasses = await getCarsByCategory('repasse')
  return (
    <main className="min-h-screen bg-white pt-[64px]">
      {/* Hero */}
      <section className="border-b border-gray-200 py-16 md:py-24" style={{ background: '#FAFBFC' }}>
        <Container>
          <div className="max-w-2xl">
            <p className="section-label mb-4">Quer vender seu carro?</p>
            <h1
              className="font-bold leading-none text-marine-900"
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 'clamp(40px, 6vw, 68px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              Repasse com<br />
              <span style={{ color: 'var(--marine-600)' }}>avaliação justa.</span>
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-marine-600 md:text-[17px]">
              Avaliação justa, processo rápido e pagamento garantido. Envie as fotos do seu carro agora pelo WhatsApp e receba uma proposta em minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={repaseWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 text-[13px] font-bold text-white transition-all hover:bg-whatsapp-hover"
                style={{ boxShadow: '0 12px 32px rgba(37,211,102,0.20)' }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Enviar fotos agora
              </a>
              <Link
                href="/estoque"
                className="inline-flex items-center gap-2 rounded-full border border-marine-200 bg-marine-50 px-7 py-3.5 text-[13px] font-bold text-marine-700 transition-all hover:border-marine-500"
              >
                Ver repasses no estoque
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-gray-200 bg-white py-14">
        <Container>
          <div className="mb-10 text-center">
            <p className="section-label mb-2">Simples assim</p>
            <h2
              className="text-[28px] font-bold text-marine-900 md:text-[36px]"
              style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.02em' }}
            >
              Como funciona o repasse
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {steps.map(({ num, title, desc }) => (
              <div
                key={num}
                className="rounded-2xl p-6 text-center"
                style={{ background: '#FAFBFC', border: '1px solid #E4E7EB' }}
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-[18px] font-bold"
                  style={{
                    background: 'var(--marine-50)',
                    color: 'var(--marine-600)',
                    fontFamily: 'var(--font-fraunces)',
                  }}
                >
                  {num}
                </div>
                <h3 className="text-[14px] font-semibold text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-marine-500">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-b border-gray-200 bg-white py-12">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-6"
                style={{ background: '#FAFBFC', border: '1px solid #E4E7EB' }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-marine-50">
                  <Icon size={20} className="text-marine-600" />
                </div>
                <h3 className="text-[14px] font-semibold text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-marine-500">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Repasses in stock */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="mb-8">
            <p className="section-label mb-2">No Estoque</p>
            <h2
              className="text-[28px] font-bold text-marine-900 md:text-[40px]"
              style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.02em' }}
            >
              {repasses.length === 0
                ? 'Sem repasses no momento'
                : `${repasses.length} ${repasses.length === 1 ? 'Repasse Disponível' : 'Repasses Disponíveis'}`}
            </h2>
          </div>

          {repasses.length === 0 ? (
            <p className="text-[15px] text-marine-500">
              Nenhum repasse disponível no momento.{' '}
              <a
                href={defaultWhatsAppLink()}
                className="font-semibold text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fale com o Rafael pelo WhatsApp.
              </a>
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {repasses.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
