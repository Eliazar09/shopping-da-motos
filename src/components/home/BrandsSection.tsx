'use client'

import { motion } from 'framer-motion'

const brands = [
  {
    name: 'Honda',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-auto" aria-label="Honda">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zm-3.75 5.25v10.5h1.875v-4.5h3.75v4.5H15.75V6.75h-1.875v4.5h-3.75V6.75H8.25z"/>
      </svg>
    ),
  },
  {
    name: 'Yamaha',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-auto" aria-label="Yamaha">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5S16.142 4.5 12 4.5zm0 1.5a6 6 0 110 12A6 6 0 0112 6zm-1 3v6h2V9h-2z"/>
      </svg>
    ),
  },
  {
    name: 'Kawasaki',
    svg: (
      <svg viewBox="0 0 100 24" className="h-6 w-auto" aria-label="Kawasaki">
        <text x="0" y="20" fill="currentColor" fontSize="22" fontWeight="900" fontFamily="Arial Black, sans-serif" letterSpacing="1">KAWASAKI</text>
      </svg>
    ),
  },
  {
    name: 'Suzuki',
    svg: (
      <svg viewBox="0 0 80 24" className="h-7 w-auto" aria-label="Suzuki">
        <text x="0" y="20" fill="currentColor" fontSize="22" fontWeight="900" fontFamily="Arial Black, sans-serif" letterSpacing="1">SUZUKI</text>
      </svg>
    ),
  },
  {
    name: 'Harley-Davidson',
    svg: (
      <svg viewBox="0 0 130 24" className="h-6 w-auto" aria-label="Harley-Davidson">
        <text x="0" y="20" fill="currentColor" fontSize="18" fontWeight="900" fontFamily="Arial Black, sans-serif" letterSpacing="0.5">HARLEY-DAVIDSON</text>
      </svg>
    ),
  },
  {
    name: 'BMW',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-auto" aria-label="BMW Motorrad">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 1.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19zM7 12h5V7a5 5 0 000 10V12H7z"/>
      </svg>
    ),
  },
  {
    name: 'Ducati',
    svg: (
      <svg viewBox="0 0 70 24" className="h-7 w-auto" aria-label="Ducati">
        <text x="0" y="20" fill="currentColor" fontSize="22" fontWeight="900" fontFamily="Arial Black, sans-serif" letterSpacing="1">DUCATI</text>
      </svg>
    ),
  },
]

const track = [...brands, ...brands, ...brands]

export default function BrandsSection() {
  return (
    <section className="overflow-hidden border-y py-12" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
      <motion.p
        className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-marine-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Marcas disponíveis no estoque
      </motion.p>

      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <motion.div
          className="flex items-center gap-16"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {track.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex flex-shrink-0 items-center justify-center text-marine-400 transition-colors duration-300 hover:text-marine-900"
              style={{ minWidth: '120px' }}
              title={brand.name}
            >
              {brand.svg}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
