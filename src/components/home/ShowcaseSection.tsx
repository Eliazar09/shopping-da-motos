'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Puzzle, Zap } from 'lucide-react'
import Container from '@/components/ui/Container'
import type { Car } from '@/types'

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Motos revisadas',
    desc: 'Toda moto passa por inspeção completa antes da venda',
  },
  {
    icon: Puzzle,
    title: 'Financiamento sem entrada',
    desc: 'Aprovação na hora com as melhores taxas do mercado',
  },
  {
    icon: Zap,
    title: 'Atendimento ágil',
    desc: 'Resposta rápida no WhatsApp. Saia de moto no mesmo dia!',
  },
]

const fanConfig = [
  { rotate: -14, translateY: 40, scale: 0.80, z: 10 },
  { rotate: -6,  translateY: 16, scale: 0.91, z: 20 },
  { rotate: 0,   translateY: 0,  scale: 1,    z: 30 },
  { rotate: 6,   translateY: 16, scale: 0.91, z: 20 },
  { rotate: 14,  translateY: 40, scale: 0.80, z: 10 },
]

interface Props {
  cars: Car[]
}

function buildFan(cars: Car[]) {
  const withPhoto = cars.filter(c => c.coverImage)
  if (withPhoto.length === 0) return []

  // Fill 5 slots — repeat photos if needed
  const result = []
  for (let i = 0; i < 5; i++) {
    const car = withPhoto[i % withPhoto.length]
    result.push({ src: car.coverImage, label: `${car.brand} ${car.model} ${car.year}` })
  }
  return result
}

export default function ShowcaseSection({ cars }: Props) {
  const fanPhotos = buildFan(cars)
  const showFan   = fanPhotos.length === 5

  return (
    <section className="overflow-hidden py-20 md:py-28" style={{ background: '#F8F9FB' }}>
      <Container>
        {/* ── Headline ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            Por que escolher o Shopping das Motos
          </p>
          <h2
            className="text-[28px] font-bold leading-tight text-marine-900 md:text-[40px]"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
          >
            Cada moto conta uma história.{' '}
            <span className="text-accent">A sua começa aqui.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-marine-500 md:text-[17px]">
            Atendimento especializado em motos, do primeiro contato ao financiamento aprovado.
            Venha sair de moto hoje mesmo em Boa Vista, Roraima.
          </p>
        </motion.div>

        {/* ── Benefits ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(13,13,15,0.07)' }}
              >
                <Icon size={22} className="text-marine-700" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-marine-900">{title}</p>
              <p className="text-[12px] leading-relaxed text-marine-500">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Fan of cars ──────────────────────────────── */}
        {showFan && (
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-16 hidden sm:flex items-end justify-center"
            style={{ height: 340, maxWidth: 860 }}
          >
            {fanPhotos.map((photo, i) => {
              const cfg = fanConfig[i]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: cfg.rotate }}
                  whileInView={{ opacity: 1, y: 0, rotate: cfg.rotate }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute overflow-hidden rounded-[20px] shadow-2xl"
                  style={{
                    width: 210,
                    height: 270,
                    transform: `rotate(${cfg.rotate}deg) translateY(${cfg.translateY}px) scale(${cfg.scale})`,
                    zIndex: cfg.z,
                    left: `calc(50% - 105px + ${(i - 2) * 118}px)`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(13,13,15,0.55) 0%, transparent 55%)' }}
                  />
                  <p className="absolute bottom-3 left-3 right-3 truncate text-[10px] font-semibold text-white/90 drop-shadow">
                    {photo.label}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </Container>
    </section>
  )
}
