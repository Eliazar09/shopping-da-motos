import Link from 'next/link'
import { Shield, Star, Wrench, Gift, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import CarCard from '@/components/home/CarCard'
import { getCarsByCategory } from '@/lib/queries/cars'

export const metadata: Metadata = {
  title: 'Motos Novas 0 km | Shopping das Motos — Boa Vista, Roraima',
  description:
    'Motos novas 0 km em Boa Vista, Roraima. Honda, Yamaha, Suzuki, Kawasaki e muito mais. Financiamento sem entrada. Fale com a gente!',
}

const benefits = [
  {
    icon: Shield,
    title: 'Garantia de Fábrica',
    desc: 'Todas as motos novas com garantia oficial do fabricante e suporte técnico.',
  },
  {
    icon: Star,
    title: 'Modelos Atuais',
    desc: 'Últimas versões das principais marcas com tecnologia e desempenho superiores.',
  },
  {
    icon: Wrench,
    title: 'Revisões Programadas',
    desc: 'Revisões periódicas garantindo desempenho máximo e segurança na pista.',
  },
  {
    icon: Gift,
    title: 'Condições Especiais',
    desc: 'Financiamento facilitado, primeiro emplacamento e assessoria completa.',
  },
]

export default async function NovosPage() {
  const novos = await getCarsByCategory('novo')
  return (
    <main className="min-h-screen bg-white pt-[64px]">
      {/* Hero */}
      <section className="border-b border-gray-200 py-16 md:py-24" style={{ background: '#FAFBFC' }}>
        <Container>
          <div className="max-w-2xl">
            <p className="section-label mb-4">Motos Novas</p>
            <h1
              className="font-bold leading-none text-marine-900"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(40px, 6vw, 68px)',
                letterSpacing: '0.01em',
                lineHeight: 1.05,
              }}
            >
              Motos Novas.
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-marine-600 md:text-[17px]">
              As melhores marcas 0 km disponíveis em Boa Vista, Roraima. Da urbana compacta à
              esportiva mais potente, todas com garantia de fábrica e assessoria personalizada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[13px] font-bold text-white transition-all hover:bg-accent-hover"
                style={{ boxShadow: '0 12px 32px rgba(227,30,36,0.15)' }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Falar no WhatsApp
              </a>
              <Link
                href="/estoque?categoria=novo"
                className="inline-flex items-center gap-2 rounded-full border border-marine-200 bg-marine-50 px-7 py-3.5 text-[13px] font-bold text-marine-700 transition-all hover:border-marine-500"
              >
                Ver estoque completo
                <ArrowRight size={14} />
              </Link>
            </div>
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

      {/* Motos grid */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="mb-8">
            <p className="section-label mb-2">Zero Quilômetro</p>
            <h2
              className="text-[28px] font-bold text-marine-900 md:text-[40px]"
              style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '0.01em' }}
            >
              {novos.length} {novos.length === 1 ? 'Moto Disponível' : 'Motos Disponíveis'}
            </h2>
          </div>

          {novos.length === 0 ? (
            <p className="text-[15px] text-marine-500">
              Nenhuma moto disponível no momento.{' '}
              <a
                href={defaultWhatsAppLink()}
                className="font-semibold text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Consulte-nos no WhatsApp.
              </a>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
