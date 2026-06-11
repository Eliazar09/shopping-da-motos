'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import Container from '@/components/ui/Container'
import { FrameButton } from '@/components/ui/frame-button'

export default function CtaSection() {
  return (
    <section id="contato" className="py-16 md:py-24" style={{ background: '#F5F5F6' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px]"
          style={{ background: '#111827' }}
        >
          {/* Subtle grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Red glow accent top-right */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
            style={{ background: '#E31E24' }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center">
            {/* ── Car image ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[240px] w-full md:h-[340px] md:w-[55%] lg:w-[52%] flex-shrink-0"
            >
              <Image
                src="/images/motos/moto-9.png"
                alt="Shopping das Motos — Boa Vista, Roraima"
                fill
                className="object-contain object-center p-6"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
              {/* Fade right into dark bg */}
              <div
                className="absolute inset-0 hidden md:block"
                style={{
                  background:
                    'linear-gradient(to right, transparent 40%, #111827 100%)',
                }}
              />
              {/* Fade bottom on mobile */}
              <div
                className="absolute inset-0 md:hidden"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 40%, #111827 100%)',
                }}
              />
            </motion.div>

            {/* ── Text ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col px-8 pb-12 pt-6 md:px-10 md:py-14 lg:px-12"
            >
              <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Financiamento sem entrada
              </span>

              <h2
                className="text-[32px] font-bold leading-tight text-white md:text-[42px] lg:text-[48px]"
                style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
              >
                Saia de moto{' '}
                <span className="text-accent">hoje mesmo,</span>
                <br />sem complicação.
              </h2>

              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-gray-400">
                Aprovamos seu crédito na hora. Motos novas e seminovas com as
                melhores condições de Boa Vista, Roraima. Mande uma mensagem agora!
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <FrameButton as="link" href={defaultWhatsAppLink()} target="_blank" rel="noopener noreferrer" variant="green">
                  <WhatsAppIcon className="h-4 w-4 mr-2" />Falar pelo WhatsApp
                </FrameButton>
                <FrameButton as="link" href="/estoque" variant="outline">Ver estoque</FrameButton>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {['Aprovação na hora', 'Sem entrada', 'Boa Vista — RR'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

      </Container>
    </section>
  )
}
