'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import { TestimonialsColumn, type TestimonialItem } from '@/components/ui/testimonials-columns-1'
import { testimonials } from '@/lib/mock-data'

const items: TestimonialItem[] = testimonials.map((t) => ({
  text:  t.text,
  image: t.avatar,
  name:  t.name,
  role:  `Comprou ${t.car}`,
}))


const col1 = items.slice(0, 2)
const col2 = items.slice(2, 4)
const col3 = items.slice(4, 6)

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-white py-20 md:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 flex max-w-[540px] flex-col items-center text-center"
        >
          <p className="section-label mb-3">Depoimentos</p>
          <h2 className="text-section-title">O que dizem nossos clientes</h2>
          <p className="mt-4 text-[15px] text-marine-500">
            Mais de 1.000 clientes satisfeitos em Boa Vista, Roraima.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={18} />
          <TestimonialsColumn testimonials={col2} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={col3} className="hidden lg:block" duration={20} />
        </div>
      </Container>
    </section>
  )
}
