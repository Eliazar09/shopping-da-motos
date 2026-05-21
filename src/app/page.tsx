'use client'

import { useState } from 'react'
import Navbar from '@/components/home/Navbar'
import HeroCarousel from '@/components/home/HeroCarousel'
import CategoryFilter from '@/components/home/CategoryFilter'
import CarsShowcase from '@/components/home/CarsShowcase'
import AboutSection from '@/components/home/AboutSection'
import StatsSection from '@/components/home/StatsSection'
import ClientsGallery from '@/components/home/ClientsGallery'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CtaSection from '@/components/home/CtaSection'
import Footer from '@/components/home/Footer'
import WhatsappFloat from '@/components/ui/WhatsappFloat'
import type { CarCategory } from '@/types'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CarCategory | 'todos'>('todos')

  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />
        <section id="estoque">
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
          />
          <CarsShowcase activeCategory={activeCategory} />
        </section>
        <AboutSection />
        <StatsSection />
        <ClientsGallery />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsappFloat />
    </>
  )
}
