'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const PLACEHOLDER = '/images/placeholder-car.svg'

interface CarImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
}

export default function CarImage({ src, alt, fill, sizes, className, priority, loading }: CarImageProps) {
  const safeSrc = src || PLACEHOLDER
  const [imgSrc, setImgSrc] = useState(safeSrc)

  useEffect(() => {
    setImgSrc(src || PLACEHOLDER)
  }, [src])

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={loading}
      unoptimized={imgSrc === PLACEHOLDER}
      onError={() => setImgSrc(PLACEHOLDER)}
    />
  )
}
