'use client'

import { useState } from 'react'
import CategoryFilter from './CategoryFilter'
import CarsShowcase from './CarsShowcase'
import type { Car, CarCategory } from '@/types'

export default function CarsSection({ cars }: { cars: Car[] }) {
  const [activeCategory, setActiveCategory] = useState<CarCategory | 'todos'>('todos')

  return (
    <section id="estoque">
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      <CarsShowcase activeCategory={activeCategory} cars={cars} />
    </section>
  )
}
