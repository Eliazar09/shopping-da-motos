'use client'

import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CarCard from './CarCard'
import type { Car, CarCategory } from '@/types'
import Container from '@/components/ui/Container'
import { FlipReveal, FlipRevealItem } from '@/components/ui/flip-reveal'

type Filter = CarCategory | 'todos'

interface Props {
  activeCategory: Filter
  cars: Car[]
}

const titles: Record<Filter, string> = {
  todos:          'Todas as motos',
  novo:           'Motos novas',
  seminovo:       'Seminovas',
  'venda-direta': 'Venda Direta',
  consorcio:      'Consórcio',
  repasse:        'Outras',
  entregas:       'Entregas',
}

export default function CarsShowcase({ activeCategory, cars }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [dotIndex, setDotIndex] = useState(0)

  const filtered = (
    activeCategory === 'todos'
      ? cars
      : cars.filter((c) => c.category === activeCategory)
  ).filter((c) => c.status !== 'vendido')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
      setDotIndex(0)
    }
  }, [activeCategory])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const maxScroll = scrollWidth - clientWidth
    const index = Math.round((scrollLeft / maxScroll) * (filtered.length - 1))
    setDotIndex(Math.max(0, Math.min(index, filtered.length - 1)))
  }

  return (
    <section className="bg-white pb-10 pt-6 md:py-24">
      <Container>
        <div className="mb-10 flex items-end justify-between md:mb-14">
          {/* Title block */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: 'var(--accent)' }}
            >
              Shopping das Motos · Boa Vista RR
            </motion.p>

            {/* Main title */}
            <h2
              className="font-bold leading-none text-marine-900"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(36px, 5vw, 60px)',
                letterSpacing: '0.01em',
                lineHeight: 1.0,
              }}
            >
              {titles[activeCategory]}
            </h2>

            {/* Count pill */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="mt-3 flex items-center gap-2"
            >
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold"
                style={{ background: '#F4F4F5', color: '#52525B' }}
              >
                {filtered.length} {filtered.length === 1 ? 'veículo disponível' : 'veículos disponíveis'}
              </span>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
          >
            <Link
              href="/estoque"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold text-white transition-all duration-300"
              style={{
                background: '#0D0D0F',
                boxShadow: '0 4px 16px rgba(13,13,15,0.18)',
              }}
            >
              Ver estoque completo
              <motion.span
                className="inline-flex"
                initial={false}
                animate={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                <ArrowRight size={14} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile: carousel snap (1 card + peek) */}
        <div className="md:hidden -mx-4">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
          >
            <AnimatePresence>
              {filtered.map((car, i) => (
                <div key={car.id} className="snap-start flex-shrink-0 w-[68vw]">
                  <CarCard car={car} index={i} />
                </div>
              ))}
            </AnimatePresence>
          </div>
          {filtered.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {filtered.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === dotIndex
                      ? 'w-5 h-[6px] bg-marine-900'
                      : 'w-[6px] h-[6px] bg-marine-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop: grid com Flip animation */}
        <FlipReveal
          keys={activeCategory === 'todos' ? ['all'] : [activeCategory]}
          showClass="block"
          hideClass="hidden"
          className="hidden md:grid md:grid-cols-3 md:gap-6"
        >
          {cars.filter(c => c.status !== 'vendido').map((car) => (
            <FlipRevealItem key={car.id} flipKey={car.category}>
              <CarCard car={car} index={0} />
            </FlipRevealItem>
          ))}
        </FlipReveal>

        {cars.filter(c => c.status !== 'vendido' && (activeCategory === 'todos' || c.category === activeCategory)).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center py-24 text-center"
          >
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(13,13,15,0.05)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-marine-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            </div>
            <p
              className="text-[18px] font-bold text-marine-900"
              style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
            >
              Nenhuma moto nesta categoria
            </p>
            <p className="mt-2 text-[14px] text-marine-500">Fale pelo WhatsApp para saber o que está chegando.</p>
          </motion.div>
        )}
      </Container>
    </section>
  )
}
