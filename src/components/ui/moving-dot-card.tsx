'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface DotCardProps {
  value: number
  suffix: string
  label: string
  sublabel: string
  duration?: number
  animationDelay?: number
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let current = 0
    const increment = Math.ceil(target / (duration / 50))
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setCount(current)
    }, 50)
    return () => clearInterval(timer)
  }, [active, target, duration])

  return count
}

export default function DotCard({
  value,
  suffix,
  label,
  sublabel,
  duration = 1800,
  animationDelay = 0,
}: DotCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useCountUp(value, duration, inView)

  const display =
    value >= 1000
      ? count >= 1000
        ? `${Math.floor(count / 1000)}k`
        : count.toString()
      : count.toString()

  return (
    <div ref={ref} className="dc-outer">
      <div
        className="dc-dot"
        style={{ animationDelay: `${animationDelay}s` }}
      />
      <div className="dc-card">
        <div className="dc-ray" />
        <div className="dc-value" aria-label={`${value}${suffix}`}>
          {display}{suffix}
        </div>
        <div className="dc-label">{label}</div>
        <div className="dc-sublabel">{sublabel}</div>
        <div className="dc-line topl" />
        <div className="dc-line leftl" />
        <div className="dc-line bottoml" />
        <div className="dc-line rightl" />
      </div>
    </div>
  )
}
