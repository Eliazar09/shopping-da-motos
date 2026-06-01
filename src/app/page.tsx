import Navbar from '@/components/home/Navbar'
import HeroCarousel from '@/components/home/HeroCarousel'
import CarsSection from '@/components/home/CarsSection'
import CarCarousel3D from '@/components/home/CarCarousel3D'
import AboutSection from '@/components/home/AboutSection'
import StatsSection from '@/components/home/StatsSection'
import ClientsGallery from '@/components/home/ClientsGallery'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FaqSection from '@/components/home/FaqSection'
import CtaSection from '@/components/home/CtaSection'
import Footer from '@/components/home/Footer'
import WhatsappFloat from '@/components/ui/WhatsappFloat'
import { getAllCars } from '@/lib/queries/cars'

export default async function HomePage() {
  const cars = await getAllCars()

  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />
        <CarsSection cars={cars} />
        <CarCarousel3D />
        <AboutSection />
        <StatsSection />
        <ClientsGallery />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsappFloat />
    </>
  )
}
