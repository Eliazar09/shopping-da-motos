'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'
import Container from '@/components/ui/Container'
import { testimonials } from '@/lib/mock-data'

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      className="flex h-full flex-col p-6"
      style={{
        background: '#122038',
        border: '1px solid #1A2B47',
        borderRadius: '12px',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Text */}
      <p className="mt-4 flex-1 text-[13px] italic leading-relaxed text-text-secondary">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="my-5 h-[1px] bg-bg-tertiary" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-bg-tertiary">
          <Image
            src={t.avatar}
            alt={t.name}
            fill
            className="object-cover"
            sizes="40px"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">{t.name}</p>
          <p className="text-[11px] text-text-muted">Comprou {t.car}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [dotIndex, setDotIndex] = useState(0)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const max = scrollWidth - clientWidth
    const idx = Math.round((scrollLeft / max) * (testimonials.length - 1))
    setDotIndex(Math.max(0, Math.min(idx, testimonials.length - 1)))
  }

  return (
    <section id="depoimentos" className="bg-bg-primary py-14 md:py-20">
      <Container>
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label mb-3">DEPOIMENTOS</p>
          <h2
            className="font-anton text-[28px] leading-none text-white md:text-[42px]"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            O QUE DIZEM SOBRE MIM
          </h2>
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-4 snap-x"
            style={{ scrollbarWidth: 'none' }}
          >
            {testimonials.map((t, i) => (
              <div key={t.id} className="w-[300px] flex-shrink-0 snap-start">
                <TestimonialCard t={t} index={i} />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-1.5">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === dotIndex ? 'w-5 bg-accent-red' : 'w-2 bg-bg-tertiary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid 3 cols */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} index={i} />
          ))}
        </div>
      </Container>
    </section>
  )
}
