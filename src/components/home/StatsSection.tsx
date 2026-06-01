'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(ease * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setCount(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return count
}

const stats = [
  {
    value:    15,
    display:  (n: number) => `${n}`,
    suffix:   '+',
    label:    'Anos',
    sub:      'de experiência',
    duration: 1400,
  },
  {
    value:    2000,
    display:  (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`,
    suffix:   '+',
    label:    'Famílias',
    sub:      'atendidas',
    duration: 1800,
  },
  {
    value:    100,
    display:  (n: number) => `${n}`,
    suffix:   '%',
    label:    'Confiança',
    sub:      'garantida',
    duration: 1600,
  },
]

function Stat({
  stat,
  index,
}: {
  stat: (typeof stats)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(stat.value, stat.duration, inView)

  return (
    <motion.div
      ref={ref}
      className="flex flex-1 flex-col items-center py-8 text-center md:py-12"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Number */}
      <div
        className="flex items-start leading-none"
        style={{ fontFamily: 'var(--font-fraunces)' }}
      >
        <span
          className="text-marine-900"
          style={{ fontSize: 'clamp(72px, 10vw, 112px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}
        >
          {stat.display(count)}
        </span>
        <span
          className="mt-3 text-[32px] font-bold md:mt-4 md:text-[42px]"
          style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}
        >
          {stat.suffix}
        </span>
      </div>

      {/* Accent line */}
      <motion.div
        className="my-4 h-[2px] w-8 rounded-full bg-accent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.4 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Label */}
      <p
        className="text-[11px] font-bold uppercase tracking-[0.14em] text-marine-900"
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        {stat.label}
      </p>
      <p className="mt-1 text-[13px] text-marine-400">{stat.sub}</p>
    </motion.div>
  )
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className="bg-white">
      {/* Top accent stripe */}
      <div className="h-[3px] w-full bg-accent" />

      <Container>
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-between pt-10 pb-0 md:pt-14"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">Em números</p>
          <p className="hidden text-[14px] font-semibold text-marine-400 md:block" style={{ fontFamily: 'var(--font-jakarta)' }}>
            15 anos construindo confiança em Roraima
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="flex flex-col divide-y divide-gray-100 md:flex-row md:divide-x md:divide-y-0">
          {stats.map((s, i) => (
            <Stat key={s.label} stat={s} index={i} />
          ))}
        </div>

        {/* Bottom banner — Yaris GR */}
        <motion.div
          className="relative mb-10 mt-2 overflow-hidden rounded-[28px]"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#0A1929' }}
        >
          {/* Gold glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ background: '#C8973A' }} />
          {/* Grid texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative flex flex-col md:flex-row-reverse md:items-center">
            {/* Car — direita */}
            <div className="relative h-[200px] w-full flex-shrink-0 md:h-[300px] md:w-[50%]">
              <Image
                src="/images/carros/yarisgrdelado.png"
                alt="Toyota Yaris GR 2025"
                fill
                className="object-contain object-center p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to left, transparent 35%, #0A1929 100%)' }} />
              <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A1929 100%)' }} />
            </div>

            {/* Text — esquerda */}
            <div className="relative z-10 flex flex-col px-8 pb-10 pt-6 md:px-10 md:py-12 lg:px-12">
              <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#C8973A' }}>
                Rafael Mota · Toyota Toyolex
              </span>
              <h3
                className="text-[26px] font-bold leading-tight text-white md:text-[36px] lg:text-[42px]"
                style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
              >
                Quer fazer parte{' '}
                <span style={{ color: '#C8973A' }}>dessa história?</span>
              </h3>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-gray-400">
                Mais de 2.000 famílias já realizaram o sonho do carro novo com Rafael. A sua vez pode ser agora.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={defaultWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[13px] font-bold text-white transition-all hover:bg-[#1ebe5d]"
                  style={{ boxShadow: '0 6px 20px rgba(37,211,102,0.30)' }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Falar com Rafael
                </a>
                <Link
                  href="/estoque"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] font-bold text-white transition-all hover:border-white/50 hover:bg-white/10"
                >
                  Ver estoque <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
