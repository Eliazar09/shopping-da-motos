'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import ProfileCard from './ProfileCard'

const differentials = [
  'Atendimento exclusivo e personalizado',
  'Avaliação justa de seu carro usado',
  'Financiamento facilitado em até 60x',
  'Entrega em Boa Vista e interior de Roraima',
]

export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden py-20 md:py-32"
      style={{ background: '#0A1929' }}
    >
      {/* Decorative large number background */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[280px] font-bold leading-none opacity-[0.03] md:text-[380px]"
        style={{ fontFamily: 'var(--font-fraunces)', color: '#fff', lineHeight: 1 }}
      >
        15
      </div>

      <Container>
        <div className="grid items-center gap-16 md:grid-cols-[1fr_1.15fr] md:gap-20 lg:gap-28">

          {/* ── LEFT: Profile Cards ── */}
          <motion.div
            className="relative order-1 flex items-center justify-center"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProfileCard dark={false} />
            </motion.div>
          </motion.div>

          {/* ── RIGHT: text ── */}
          <motion.div
            className="relative order-2 flex flex-col justify-center"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 text-[13px] font-extrabold uppercase tracking-[0.18em] text-marine-500" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Sobre Rafael
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 'clamp(34px, 5vw, 60px)',
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              Não vendo carro.{' '}
              <span style={{ color: 'var(--accent)' }}>Realizo o sonho</span>{' '}
              da sua família.
            </h2>

            <p className="mt-6 text-[15px] leading-[1.75] text-marine-400">
              Há mais de 15 anos em Roraima, já ajudei mais de 2 mil famílias a encontrarem o
              carro perfeito. Como Gerente de Negócios na Toyolex, meu trabalho é fazer o processo
              ser transparente, simples e focado em você.
            </p>

            {/* Differentials */}
            <ul className="mt-8 flex flex-col">
              {differentials.map((d, i) => (
                <motion.li
                  key={d}
                  className="flex items-center gap-4 border-t py-4 first:border-t-0"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                >
                  <span
                    className="flex-shrink-0 text-[11px] font-bold tabular-nums"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-fraunces)', minWidth: '20px' }}
                  >
                    0{i + 1}
                  </span>
                  <span className="text-[14px] font-medium text-marine-200">{d}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-10">
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-whatsapp px-8 py-4 text-[13px] font-bold text-white transition-all hover:bg-whatsapp-hover"
                style={{ boxShadow: '0 12px 40px rgba(37,211,102,0.25)' }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Falar com Rafael
              </a>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
