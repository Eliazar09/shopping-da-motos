'use client'

import { useState, useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import CarImage from '@/components/ui/CarImage'
import { AnimatePresence, motion } from 'framer-motion'

const PLACEHOLDER = '/images/placeholder-car.svg'

interface Props {
  images: string[]
  alt: string
}

export default function CarGallery({ images: rawImages, alt }: Props) {
  const images = rawImages?.length ? rawImages : [PLACEHOLDER]
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.changedTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
  }

  return (
    <>
      {/* Main gallery */}
      <div className="space-y-2">
        <div
          className="relative h-[260px] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-marine-50 md:h-[460px]"
          onClick={() => setLightbox(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CarImage
                src={images[current]}
                alt={`${alt} — foto ${current + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 backdrop-blur-sm" style={{ border: '1px solid #E4E7EB' }}>
            <ZoomIn size={12} className="text-marine-600" />
            <span className="text-[9px] font-bold tracking-[0.1em] text-marine-600">AMPLIAR</span>
          </div>

          {/* Counter */}
          <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-sm" style={{ border: '1px solid #E4E7EB' }}>
            <span className="text-[10px] font-bold text-marine-700">
              {current + 1} / {images.length}
            </span>
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-marine-700 shadow-marine-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-marine-md"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-marine-700 shadow-marine-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-marine-md"
                aria-label="Próxima foto"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all md:h-16 md:w-24 ${
                  i === current
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-white'
                    : 'opacity-50 hover:opacity-80'
                }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <CarImage
                  src={img}
                  alt={`${alt} miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={() => setLightbox(false)}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-widest text-white/60">
              {current + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.div
              className="relative h-[80vh] w-[90vw]"
              key={current}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CarImage
                src={images[current]}
                alt={`${alt} — foto ${current + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
