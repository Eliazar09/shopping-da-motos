'use client'

import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CarCard from './CarCard'
import { cars } from '@/lib/mock-data'
import type { CarCategory } from '@/types'
import Container from '@/components/ui/Container'

type Filter = CarCategory | 'todos'

interface Props {
  activeCategory: Filter
}

export default function CarsShowcase({ activeCategory }: Props) {
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
    <section className="bg-bg-primary pb-12 pt-8 md:py-16">
      <Container>
        <div className="mb-6 flex items-end justify-between md:mb-10">
          <div>
            <p className="section-label mb-2">ESTOQUE</p>
            <h2
              className="font-anton text-[28px] leading-none text-white md:text-[42px]"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              {activeCategory === 'todos' && 'TODOS OS CARROS'}
              {activeCategory === 'novo' && 'CARROS NOVOS'}
              {activeCategory === 'seminovo' && 'SEMINOVOS'}
              {activeCategory === 'repasse' && 'REPASSE'}
            </h2>
          </div>
          <span className="text-[12px] text-text-muted">
            {filtered.length} {filtered.length === 1 ? 'carro' : 'carros'}
          </span>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-4 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence>
              {filtered.map((car, i) => (
                <div key={car.id} className="snap-start flex-shrink-0">
                  <CarCard car={car} index={i} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots */}
          {filtered.length > 1 && (
            <div className="mt-4 flex justify-center gap-1.5">
              {filtered.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    i === dotIndex ? 'w-5 bg-accent-red' : 'w-2 bg-bg-tertiary'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-5">
          <AnimatePresence>
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <CarCard car={car} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-[14px] text-text-muted">
              Nenhum carro nesta categoria no momento.
            </p>
            <p className="mt-2 text-[12px] text-text-muted">
              Fale com Rafael para saber o que está chegando.
            </p>
          </div>
        )}
      </Container>
    </section>
  )
}
