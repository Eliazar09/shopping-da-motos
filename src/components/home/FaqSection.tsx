'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Container from '@/components/ui/Container'
import { defaultWhatsAppLink } from '@/lib/whatsapp'

const faqs = [
  {
    q: 'O Shopping das Motos atende em qual região?',
    a: 'Estamos localizados na Av. Gen. Ataíde Teive, 4063 — Asa Branca, Boa Vista, Roraima. Também atendemos pelo WhatsApp para quem é do interior do estado. Grande parte do processo pode ser feito online, da escolha da moto até a documentação.',
  },
  {
    q: 'Como funciona o financiamento sem entrada?',
    a: 'Trabalhamos com diversas financeiras parceiras para aprovar seu crédito da forma mais fácil possível. Você envia seus documentos básicos e nossa equipe resolve o resto. A aprovação é rápida e as condições são diferenciadas.',
  },
  {
    q: 'Aceita minha moto usada como parte do pagamento?',
    a: 'Sim! Avaliamos sua moto e usamos o valor como parte do pagamento da nova. Envie fotos pelo WhatsApp, avaliamos na hora e mandamos a proposta em minutos.',
  },
  {
    q: 'As motos seminovas têm garantia?',
    a: 'Todas as motos seminovas passam por vistoria completa antes da venda. Oferecemos garantia no motor e câmbio, além de histórico verificado sem sinistro ou roubo. Você compra com total segurança.',
  },
  {
    q: 'Aceita moto usada como entrada?',
    a: 'Sim! Avaliamos sua moto usada e usamos o valor como parte do pagamento da nova. É uma das formas mais práticas de renovar sem precisar desembolsar tudo de uma vez.',
  },
  {
    q: 'Quanto tempo demora para sair com a moto?',
    a: 'Para motos em estoque com financiamento aprovado, você pode sair no mesmo dia! Em alguns casos, em até 2 dias úteis após a confirmação da documentação.',
  },
]

function FaqItem({
  q,
  a,
  index,
  defaultOpen = false,
}: {
  q: string
  a: string
  index: number
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white px-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span
          className="text-[14px] font-semibold leading-snug text-marine-900 md:text-[15px]"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          {q}
        </span>
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors"
          style={{
            background: open ? '#0D0D0F' : '#F3F4F6',
            color: open ? '#fff' : '#6B7280',
          }}
        >
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[13px] leading-relaxed text-marine-500 md:text-[14px]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="py-20 md:py-28"
      style={{ background: '#F5F4F0' }}
    >
      <Container>
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">

          {/* ── LEFT: imagem + floating card ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{ height: 'clamp(260px, 48vw, 520px)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80&auto=format"
                alt="Shopping das Motos — Boa Vista, Roraima"
                className="h-full w-full object-cover object-center"
              />
              {/* Bottom gradient */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(13,13,15,0.55) 100%)' }}
              />
              {/* Top-left red accent */}
              <div
                className="absolute left-0 top-0 h-1 w-20 rounded-br-full"
                style={{ background: '#E31E24' }}
              />
            </div>

            {/* Floating social proof card */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-2xl bg-white px-4 py-3.5 sm:bottom-5 sm:left-5 sm:right-5 sm:px-5 sm:py-4"
              style={{ boxShadow: '0 16px 48px rgba(13,13,15,0.16)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-shrink-0 -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80&auto=format',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80&auto=format',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&q=80&auto=format',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="cliente"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white sm:h-9 sm:w-9"
                  />
                ))}
              </div>
              <div>
                <p className="text-[13px] font-bold text-marine-900 sm:text-[14px]" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  +1.000 clientes satisfeitos
                </p>
                <p className="text-[11px] text-marine-400 sm:text-[12px]">Em Boa Vista e Roraima</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: header + accordion ── */}
          <div>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="section-label mb-3">Dúvidas frequentes</p>
              <h2 className="text-section-title">Perguntas &amp; Respostas</h2>
              <p className="mt-3 text-[14px] text-marine-500">
                Não encontrou o que procura?{' '}
                <a
                  href={defaultWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  Manda no WhatsApp.
                </a>
              </p>
            </motion.div>

            <div className="flex flex-col gap-3">
              {faqs.map((item, i) => (
                <FaqItem
                  key={item.q}
                  q={item.q}
                  a={item.a}
                  index={i}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}
