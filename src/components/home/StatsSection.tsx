'use client'

import Container from '@/components/ui/Container'
import DotCard from '@/components/ui/moving-dot-card'

const stats = [
  { value: 15,   suffix: '+', label: 'ANOS',     sublabel: 'de experiência', delay: 0 },
  { value: 2000, suffix: '+', label: 'VENDAS',   sublabel: 'realizadas',     delay: 1 },
  { value: 100,  suffix: '%', label: 'CONFIANÇA', sublabel: 'garantida',     delay: 2 },
]

export default function StatsSection() {
  return (
    <section className="bg-bg-primary py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {stats.map((s) => (
            <DotCard
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              sublabel={s.sublabel}
              animationDelay={s.delay}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
