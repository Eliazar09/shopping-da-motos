'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import PearlButton from '@/components/ui/PearlButton'

const AUTOPLAY_MS = 6000

const SLIDES = [
  {
    id: 0,
    image: '/images/rafael/rafael-hero-1.jpg',
    alt: 'Rafael Mota — Consultor Toyota Toyolex Roraima',
    eyebrow: 'Consultor Toyota Oficial',
    title: ['Realizando', 'o sonho', 'da sua família.'],
    subtitle: 'Mais de 15 anos vendendo confiança em Roraima.',
  },
  {
    id: 1,
    image: '/images/rafael/rafael-hero-2.jpg',
    alt: 'Rafael Mota — Atendimento personalizado',
    eyebrow: 'Atendimento Pessoal',
    title: ['Cliente', 'vira', 'amigo.'],
    subtitle: 'Do primeiro contato à entrega, sem pressão.',
  },
  {
    id: 2,
    image: '/images/rafael/rafael-hero-3.jpg',
    alt: 'Rafael Mota — Roraima',
    eyebrow: 'Toyota Toyolex Roraima',
    title: ['Confiança', 'que move', 'Roraima.'],
    subtitle: 'Avaliação honesta, entrega garantida. É assim que Rafael trabalha.',
  },
]

// Word-by-word stagger variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, y: -10, filter: 'blur(2px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX   = useRef(0)

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length)
  }, [])
  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTOPLAY_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, paused, next])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 40) { setPaused(true); diff > 0 ? next() : prev() }
  }

  const slide = SLIDES[current]
  const waLink = defaultWhatsAppLink()

  return (
    <section
      aria-label="Carrossel de apresentação"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full"
    >

      {/* ══════════════════════════════════════════════════════════
          MOBILE LAYOUT: Full-image hero with text overlay
          ══════════════════════════════════════════════════════════ */}
      <div className="md:hidden">

        <div className="relative w-full overflow-hidden" style={{ height: '50dvh', minHeight: 300 }}>
          {/* Image */}
          <AnimatePresence mode="sync">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.07 }}
                animate={{ scale: 1 }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={current === 0}
                  sizes="100vw"
                  className="object-cover object-[center_8%]"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Dark gradient — bottom to top for text legibility */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{ height: '75%', background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}
          />

          {/* Text + CTAs + dots — absolute bottom-left over image */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5">
            <AnimatePresence mode="wait">
              <motion.div key={current}>
                {/* Title — word stagger */}
                <motion.h1
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="leading-[1.05] tracking-[-0.03em]"
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontSize: 'clamp(26px, 8vw, 40px)',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {slide.title.map((line, li) => (
                    <span key={li} className="block">
                      {line.split(' ').map((word, wi) => (
                        <motion.span
                          key={`${li}-${wi}`}
                          variants={wordVariants}
                          className="inline-block"
                          style={{ marginRight: wi < line.split(' ').length - 1 ? '0.28em' : 0 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeUp}
                  custom={0.35}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-1.5 leading-relaxed"
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)' }}
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={fadeUp}
                  custom={0.5}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-3 flex flex-row gap-2"
                >
                  <PearlButton href="/estoque">Ver estoque</PearlButton>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full font-semibold text-[13px] transition-all duration-300"
                    style={{
                      minHeight: 42,
                      background: '#25D366',
                      color: '#ffffff',
                      paddingLeft: 22,
                      paddingRight: 22,
                    }}
                  >
                    Falar com Rafael
                  </a>
                </motion.div>

                {/* Dots */}
                <div className="mt-3 flex items-center gap-1.5">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setPaused(true); goTo(idx) }}
                      aria-label={`Slide ${idx + 1}`}
                      className="flex items-center justify-center p-2 -m-2"
                    >
                      <motion.span
                        className="block h-[4px] rounded-full"
                        animate={{
                          width: current === idx ? 22 : 6,
                          backgroundColor: current === idx ? '#ffffff' : 'rgba(255,255,255,0.40)',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP LAYOUT: Fullscreen with overlay text
          ══════════════════════════════════════════════════════════ */}
      <div
        className="relative hidden md:flex"
        style={{ height: '100svh', minHeight: 620, overflow: 'hidden' }}
      >
        {/* Photos */}
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.07 }}
              animate={{ scale: 1 }}
              transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={current === 0}
                sizes="100vw"
                className="object-cover object-[center_8%]"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, rgba(5,15,28,0.82) 0%, rgba(5,15,28,0.55) 50%, rgba(5,15,28,0.18) 100%)',
          }}
        />

        {/* Content left-aligned */}
        <div className="relative z-10 flex h-full items-center px-16 lg:px-24 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={current} className="max-w-2xl">

              {/* Title — word-by-word stagger */}
              <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-white leading-[1.03] tracking-[-0.035em]"
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: 'clamp(52px, 7vw, 92px)',
                  fontWeight: 700,
                }}
              >
                {slide.title.map((line, li) => (
                  <span key={li} className="block">
                    {line.split(' ').map((word, wi) => (
                      <motion.span
                        key={`${li}-${wi}`}
                        variants={wordVariants}
                        className="inline-block"
                        style={{ marginRight: wi < line.split(' ').length - 1 ? '0.28em' : 0 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                custom={0.4}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-5 text-white/75 leading-relaxed max-w-md"
                style={{ fontSize: 17 }}
              >
                {slide.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                custom={0.55}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-9 flex flex-row gap-4 flex-wrap"
              >
                <PearlButton href="/estoque">Ver estoque</PearlButton>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full font-semibold text-[14px] transition-all duration-300 hover:opacity-90"
                  style={{
                    minHeight: 52,
                    background: '#25D366',
                    color: '#ffffff',
                    paddingLeft: 36,
                    paddingRight: 36,
                  }}
                >
                  Falar com Rafael
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop arrows */}
        <motion.button
          onClick={() => { setPaused(true); prev() }}
          aria-label="Slide anterior"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
          style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.93)', boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}
          whileHover={{ scale: 1.08, background: '#ffffff' }}
          whileTap={{ scale: 0.93 }}
        >
          <ChevronLeft size={26} style={{ color: '#0A1929' }} strokeWidth={2.5} />
        </motion.button>
        <motion.button
          onClick={() => { setPaused(true); next() }}
          aria-label="Próximo slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
          style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.93)', boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}
          whileHover={{ scale: 1.08, background: '#ffffff' }}
          whileTap={{ scale: 0.93 }}
        >
          <ChevronRight size={26} style={{ color: '#0A1929' }} strokeWidth={2.5} />
        </motion.button>

        {/* Desktop dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setPaused(true); goTo(idx) }}
              aria-label={`Slide ${idx + 1}`}
              className="flex items-center justify-center p-3 -m-3"
            >
              <motion.span
                className="block h-[5px] rounded-full"
                animate={{
                  width: current === idx ? 28 : 8,
                  backgroundColor: current === idx ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>

        {/* Progress bar */}
        {!paused && (
          <motion.div
            key={`bar-${current}`}
            className="absolute bottom-0 left-0 z-20 h-[2px] bg-white/50"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </section>
  )
}
