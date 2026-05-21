'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Container from '@/components/ui/Container'
import { defaultWhatsAppLink } from '@/lib/whatsapp'

const differentials = [
  'Atendimento exclusivo e personalizado',
  'Avaliação justa de seu carro usado',
  'Financiamento facilitado em até 60x',
  'Entrega em Boa Vista e interior',
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #122038 60%, #0A1628 100%)',
      }}
    >
      {/* Decorative accent line */}
      <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent-red/40 to-transparent" />

      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Photo col */}
          <motion.div
            className="relative"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative h-[320px] w-full overflow-hidden bg-bg-secondary md:h-[480px]"
              style={{ border: '1px solid #1f1f1f' }}
            >
              {/* Placeholder for Rafael's photo */}
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-bg-secondary">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-bg-tertiary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-12 w-12 text-text-muted"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
                  Foto do Rafael
                </span>
              </div>

              {/* Red corner accent */}
              <div className="absolute bottom-0 left-0 h-1 w-16 bg-accent-red" />
            </div>

            {/* Floating card */}
            <div
              className="absolute -bottom-4 -right-0 bg-bg-secondary px-4 py-3 md:-right-6"
              style={{ border: '1px solid #1f1f1f' }}
            >
              <p className="font-anton text-[28px] leading-none text-accent-red" style={{ fontFamily: 'var(--font-anton)' }}>
                15+
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Anos de experiência
              </p>
            </div>
          </motion.div>

          {/* Text col */}
          <motion.div
            className="flex flex-col justify-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="section-label mb-4">SOBRE RAFAEL</p>

            <h2
              className="font-anton text-[32px] leading-none text-white md:text-[44px] lg:text-[52px]"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              NAO VENDO CARRO.
              <br />
              <span className="text-accent-red">REALIZO O SONHO</span>
              <br />
              DA SUA FAMILIA.
            </h2>

            <p className="mt-6 text-[14px] leading-relaxed text-text-secondary md:text-[15px]">
              Ha mais de 15 anos trabalhando com vendas de veiculos em Roraima, ja ajudei mais
              de 2 mil familias a encontrarem o carro perfeito. Como gerente de negocios na
              Toyolex, ofereço um atendimento personalizado, transparente e focado no que
              realmente importa: voce sair satisfeito.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {differentials.map((d, i) => (
                <motion.li
                  key={d}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center bg-accent-red">
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </span>
                  <span className="text-[13px] font-medium text-text-secondary">{d}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-accent-red px-6 py-3 text-[11px] font-bold tracking-[0.1em] text-accent-red transition-all hover:bg-accent-red hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                FALAR COM RAFAEL
              </a>
            </div>
          </motion.div>
        </div>
      </Container>

      <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent-red/20 to-transparent" />
    </section>
  )
}
