'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import { clientPhotos } from '@/lib/mock-data'

const row1 = [...clientPhotos, ...clientPhotos, ...clientPhotos]
const row2 = [...clientPhotos].reverse().concat([...clientPhotos].reverse(), [...clientPhotos].reverse())

function PhotoCard({ photo }: { photo: typeof clientPhotos[0] }) {
  return (
    <div
      className="group relative flex-shrink-0 overflow-hidden rounded-2xl"
      style={{ width: '220px', height: '160px', background: '#F1F3F5' }}
    >
      <Image
        src={photo.image}
        alt={photo.carModel}
        fill
        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
        sizes="220px"
        loading="lazy"
      />
      <div
        className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'linear-gradient(to top, rgba(10,25,41,0.85) 0%, transparent 60%)' }}
      >
        <p className="text-[12px] font-semibold text-white leading-tight">{photo.carModel}</p>
      </div>
    </div>
  )
}

export default function ClientsGallery() {
  return (
    <section className="overflow-hidden py-16 md:py-24" style={{ background: '#FAFBFC' }}>
      {/* Header */}
      <Container>
        <motion.div
          className="mb-12 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="section-label mb-2">Estoque</p>
            <h2 className="text-section-title">Veículos disponíveis</h2>
          </div>
          <p className="max-w-xs text-[14px] leading-relaxed text-marine-400">
            Novos, seminovos e repasse. Consulte Rafael e encontre o ideal para você.
          </p>
        </motion.div>
      </Container>

      {/* Row 1 — scroll left */}
      <div
        className="relative mb-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <motion.div
          className="flex gap-4"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {row1.map((photo, i) => (
            <PhotoCard key={`r1-${i}`} photo={photo} />
          ))}
        </motion.div>
      </div>

      {/* Row 2 — scroll right */}
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <motion.div
          className="flex gap-4"
          animate={{ x: ['-33.33%', '0%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        >
          {row2.map((photo, i) => (
            <PhotoCard key={`r2-${i}`} photo={photo} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
