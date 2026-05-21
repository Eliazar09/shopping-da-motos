'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { heroSlides } from '@/lib/mock-data'
import { defaultWhatsAppLink, repaseWhatsAppLink } from '@/lib/whatsapp'

const AUTOPLAY_INTERVAL = 5000

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function getCtaHref(slideId: string): string {
  if (slideId === '3') return repaseWhatsAppLink()
  if (slideId === '2') return '/carros/sw4-diamond-2024'
  return defaultWhatsAppLink()
}

function getCtaTarget(slideId: string): string {
  if (slideId === '2') return '_self'
  return '_blank'
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + heroSlides.length) % heroSlides.length)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, paused, next])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 40) {
      setPaused(true)
      diff > 0 ? next() : prev()
    }
  }

  const slide = heroSlides[current]

  return (
    <section
      className="relative h-[280px] w-full overflow-hidden md:h-[600px]"
      aria-label="Carousel de destaque"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background */}
          {slide.bg ? (
            <>
              <Image
                src={slide.bg}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: `rgba(10,22,40,${slide.overlay})` }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #0A1628 0%, #1A2B47 40%, #2D0A0E 100%)',
              }}
            />
          )}

          {/* Slide 3 decorative lines */}
          {slide.id === '3' && (
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 40px,
                  rgba(229,9,20,0.3) 40px,
                  rgba(229,9,20,0.3) 41px
                )`,
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-center px-5 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="hero-line-1 mb-3 inline-flex md:mb-5">
                <span
                  className={`px-3 py-1 text-[9px] font-bold tracking-[0.15em] md:text-[10px] ${
                    slide.badgeVariant === 'red'
                      ? 'bg-accent-red text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  {slide.badge}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="hero-line-2 font-anton text-[38px] leading-none text-white md:text-[80px]"
                style={{
                  fontFamily: 'var(--font-anton)',
                  whiteSpace: 'pre-line',
                  letterSpacing: '0.02em',
                }}
              >
                {slide.headline}
              </h1>

              {/* Subline */}
              <p className="hero-line-3 mt-3 text-[13px] font-medium text-text-secondary md:mt-4 md:text-[16px]">
                {slide.subline}
              </p>

              {/* CTA */}
              <div className="hero-line-4 mt-5 md:mt-7">
                <a
                  href={getCtaHref(slide.id)}
                  target={getCtaTarget(slide.id)}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 px-5 py-3 text-[11px] font-bold tracking-[0.1em] transition-opacity hover:opacity-90 md:px-7 md:py-3.5 md:text-[12px] ${
                    slide.ctaVariant === 'white'
                      ? 'bg-white text-black'
                      : 'bg-accent-red text-white'
                  }`}
                >
                  {slide.ctaIcon === 'whatsapp' ? (
                    <WhatsAppIcon className="h-4 w-4" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {slide.cta}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow buttons — desktop only */}
      <button
        onClick={() => { setPaused(true); prev() }}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center border border-white/20 bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => { setPaused(true); next() }}
        aria-label="Próximo slide"
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center border border-white/20 bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:flex"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-8">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPaused(true); goTo(i) }}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-[3px] transition-all duration-300 ${
              i === current ? 'w-6 bg-accent-red' : 'w-3 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 z-20 h-[2px] bg-accent-red"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
        />
      )}
    </section>
  )
}
