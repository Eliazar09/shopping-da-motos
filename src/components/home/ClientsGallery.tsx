'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import { clientPhotos } from '@/lib/mock-data'

function GalleryItem({ photo, index }: { photo: typeof clientPhotos[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="group relative overflow-hidden bg-bg-secondary"
      style={{
        height: photo.tall ? '320px' : '220px',
        border: '1px solid #1a1a1a',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={photo.image}
        alt={`${photo.clientName} — ${photo.carModel}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 240px, 33vw"
        loading="lazy"
      />

      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-[13px] font-bold text-white">{photo.clientName}</p>
        <p className="mt-0.5 text-[11px] font-medium text-text-secondary">{photo.carModel}</p>
      </motion.div>

      {/* Persistent bottom line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-red transition-all duration-300 group-hover:w-full" />
    </motion.div>
  )
}

export default function ClientsGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-bg-primary py-14 md:py-20">
      <Container>
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label mb-3">CLIENTES</p>
          <h2
            className="font-anton text-[28px] leading-none text-white md:text-[42px]"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            QUEM JA E DA FAMILIA
          </h2>
          <p className="mt-3 text-[13px] text-text-secondary md:text-[14px]">
            Mais de 2 mil clientes satisfeitos ao longo dos anos
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-4 snap-x"
            style={{ scrollbarWidth: 'none' }}
          >
            {clientPhotos.map((photo, i) => (
              <div key={photo.id} className="flex-shrink-0 w-[220px] snap-start">
                <GalleryItem photo={{ ...photo, tall: false }} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: masonry 3 cols */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex flex-col gap-4">
              {clientPhotos
                .filter((_, i) => i % 3 === col)
                .map((photo, i) => (
                  <GalleryItem key={photo.id} photo={photo} index={col * 3 + i} />
                ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
