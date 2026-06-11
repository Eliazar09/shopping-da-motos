'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { CardStack, CardStackItem } from '@/components/ui/card-stack'
import { FrameButton } from '@/components/ui/frame-button'

const CAR_ITEMS: CardStackItem[] = [
  {
    id: 1,
    title: 'Honda CB 600F Hornet',
    description: 'Potência e estilo — a naked mais desejada do mercado',
    imageSrc: '/images/motos/moto-5.png',
    href: '/estoque',
  },
  {
    id: 2,
    title: 'Yamaha Fazer 250',
    description: 'Sport naked com estilo agressivo e ótima performance',
    imageSrc: '/images/motos/moto-2.png',
    href: '/estoque',
  },
  {
    id: 3,
    title: 'Honda CG 160 Titan',
    description: 'A moto mais vendida do Brasil — econômica e confiável',
    imageSrc: '/images/motos/moto-10.png',
    href: '/estoque',
  },
  {
    id: 4,
    title: 'Yamaha MT-03',
    description: 'Naked esportiva com design agressivo e motor potente',
    imageSrc: '/images/motos/moto-1.png',
    href: '/estoque',
  },
  {
    id: 5,
    title: 'Honda NX 400',
    description: 'Adventure urbana — versátil, robusta e cheia de estilo',
    imageSrc: '/images/motos/moto-4.png',
    href: '/estoque',
  },
]

export default function CarCarousel3D() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const cardWidth  = isMobile ? Math.min((typeof window !== 'undefined' ? window.innerWidth : 375) - 80, 300) : 480
  const cardHeight = isMobile ? 200 : 300

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-white">
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">

        {/* ── Headline ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mb-4 text-[13px] font-extrabold uppercase tracking-[0.18em] text-accent"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Catálogo de motos
          </motion.p>

          <h2
            className="font-black leading-none text-marine-900"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(36px, 6vw, 76px)',
              letterSpacing: '0.01em',
              lineHeight: 0.96,
            }}
          >
            Encontre a moto{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, #E31E24 0%, #B8181D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              perfeita
            </em>{' '}
            para você
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-marine-500"
          >
            Novas e seminovas, selecionadas com cuidado para você.
            Financiamento sem entrada e aprovação na hora em Boa Vista, Roraima.
          </motion.p>
        </motion.div>

        {/* ── CardStack ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <CardStack
            items={CAR_ITEMS}
            initialIndex={2}
            autoAdvance
            intervalMs={isMobile ? 1800 : 3000}
            pauseOnHover
            showDots
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            overlap={isMobile ? 0.42 : 0.52}
            spreadDeg={isMobile ? 36 : 44}
            activeLiftPx={isMobile ? 18 : 28}
            activeScale={1.04}
            inactiveScale={isMobile ? 0.88 : 0.92}
            springStiffness={isMobile ? 420 : 280}
            springDamping={isMobile ? 34 : 28}
          />
        </motion.div>

        {/* ── CTA buttons ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <FrameButton as="link" href="/estoque" variant="default">Ver estoque completo</FrameButton>
          <FrameButton as="link" href={defaultWhatsAppLink()} target="_blank" rel="noopener noreferrer" variant="green">
            <WhatsAppIcon className="h-4 w-4 mr-2" />Falar pelo WhatsApp
          </FrameButton>
        </motion.div>

      </div>
    </section>
  )
}
