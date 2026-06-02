'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { CardStack, CardStackItem } from '@/components/ui/card-stack'
import PearlButton from '@/components/ui/PearlButton'

const CAR_ITEMS: CardStackItem[] = [
  {
    id: 1,
    title: 'Toyota Corolla GR Sport 2025',
    description: 'Esportividade e tecnologia na versão mais desejada',
    imageSrc: '/images/carros/corolla.png',
    href: '/estoque',
  },
  {
    id: 2,
    title: 'Hyundai Creta 2025',
    description: 'SUV compacto com design moderno e muito conforto',
    imageSrc: '/images/carros/creta.png',
    href: '/estoque',
  },
  {
    id: 3,
    title: 'Toyota Yaris 2025',
    description: 'Compacto ideal para o dia a dia em Roraima',
    imageSrc: '/images/carros/yaris.png',
    href: '/estoque',
  },
  {
    id: 4,
    title: 'Ford Ranger Raptor 2025',
    description: 'A pickup mais robusta para qualquer terreno',
    imageSrc: '/images/carros/ranger.png',
    href: '/estoque',
  },
  {
    id: 5,
    title: 'Chevrolet Onix Plus 2025',
    description: 'Sedan econômico e espaçoso para toda a família',
    imageSrc: '/images/carros/onixplus.png',
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
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
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
            className="mb-4 text-[13px] font-extrabold uppercase tracking-[0.18em]"
            style={{ color: '#C8973A', fontFamily: 'var(--font-jakarta)' }}
          >
            Catálogo exclusivo
          </motion.p>

          <h2
            className="font-black leading-none text-marine-900"
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(36px, 6vw, 76px)',
              letterSpacing: '-0.04em',
              lineHeight: 0.96,
            }}
          >
            Encontre o carro{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, #E31E24 0%, #C8973A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              perfeito
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
            Novos, seminovos e repasse, selecionados com cuidado para você.
            Atendimento exclusivo com entrega em toda Roraima.
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
          <PearlButton href="/estoque" variant="red">Ver estoque completo</PearlButton>

          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <a
              href={defaultWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#25D366] px-8 py-[14px] text-[13px] font-bold text-[#1a9e4e] transition-all hover:bg-[#25D366] hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar com Rafael
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
