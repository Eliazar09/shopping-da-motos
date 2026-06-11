'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const MOTO = '/images/motos/moto-hero.png'
const WA   = defaultWhatsAppLink()

function up(delay = 0) {
  return {
    hidden: { opacity: 0, y: 22 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay } },
  }
}

const slideRight = {
  hidden: { opacity: 0, x: 48, scale: 0.97 },
  show:   { opacity: 1, x: 0,  scale: 1,    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 } },
}

const TRUST = [
  { icon: <CheckCircle2 size={13} />, text: 'Financiamento sem entrada' },
  { icon: <CheckCircle2 size={13} />, text: 'Aprovação na hora' },
  { icon: <CheckCircle2 size={13} />, text: 'Novas e Seminovas' },
]

export default function HeroCarousel() {
  return (
    <section className="relative w-full overflow-hidden" style={{ background: '#0D0D0F' }}>

      {/* Speed lines texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.016]"
        style={{ backgroundImage: 'repeating-linear-gradient(78deg,#fff 0px,#fff 1px,transparent 1px,transparent 64px)' }}
      />

      {/* Red glow — right half */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-[55%]"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 80% 50%, rgba(227,30,36,0.14) 0%, transparent 70%)' }}
      />

      {/* Accent stripe top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent z-20" />

      {/* ════════════════ DESKTOP ════════════════════ */}
      <div
        className="relative hidden md:grid"
        style={{ gridTemplateColumns: '1fr 1fr', minHeight: '100svh', paddingTop: 80 }}
      >
        {/* LEFT — text */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-16 lg:px-24">

          <motion.h1
            variants={up(0.1)}
            initial="hidden"
            animate="show"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(60px, 7.5vw, 112px)',
              fontWeight: 800,
              lineHeight: 0.94,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            A moto<br />
            que você<br />
            <span style={{ color: 'var(--accent)' }}>sempre&nbsp;quis.</span>
          </motion.h1>

          <motion.p
            variants={up(0.25)}
            initial="hidden"
            animate="show"
            className="mt-7 text-[15px] leading-[1.75]"
            style={{ color: 'rgba(255,255,255,0.54)', maxWidth: 400 }}
          >
            Financiamento sem entrada e aprovação na hora.
            Motos novas e seminovas com as melhores
            condições de Roraima.
          </motion.p>

          <motion.div
            variants={up(0.38)}
            initial="hidden"
            animate="show"
            className="mt-10 flex items-center gap-3 flex-wrap"
          >
            <Link
              href="/estoque"
              className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-bold text-marine-900 transition-all duration-300 hover:brightness-110 active:scale-95"
              style={{ background: '#fff' }}
            >
              Ver estoque
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-3.5 text-[13px] font-bold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/5"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Falar por WhatsApp
            </a>
          </motion.div>

          <motion.div
            variants={up(0.5)}
            initial="hidden"
            animate="show"
            className="mt-12 flex items-stretch"
          >
            {[
              { value: '1.000+', label: 'Clientes' },
              { value: '500+',   label: 'Motos vendidas' },
              { value: '100%',   label: 'Aprovação' },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  paddingLeft: i > 0 ? 28 : 0,
                  paddingRight: 28,
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.09)' : 'none',
                }}
              >
                <div className="text-[26px] font-black leading-none text-white" style={{ fontFamily: 'var(--font-oswald)' }}>
                  {s.value}
                </div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — moto */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="show"
          className="relative flex items-center justify-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[10%] left-[15%] right-[15%] h-[22%] rounded-full blur-[72px]"
            style={{ background: 'rgba(227,30,36,0.28)' }}
          />
          <div className="relative w-full h-full" style={{ maxHeight: 'calc(100svh - 80px)' }}>
            <Image
              src={MOTO}
              alt="Shopping das Motos — Boa Vista, Roraima"
              fill
              priority
              sizes="50vw"
              className="object-contain object-center"
              style={{ padding: '32px 20px 64px', filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))' }}
            />
          </div>
        </motion.div>
      </div>

      {/* ════════════════ MOBILE ══════════════════════ */}
      <div className="relative flex flex-col md:hidden" style={{ paddingTop: 72, minHeight: '100svh' }}>

        {/* Red glow mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 50% at 50% 20%, rgba(227,30,36,0.11) 0%, transparent 60%)' }}
        />

        {/* Text block */}
        <div className="relative z-10 flex flex-col px-6 pt-8 pb-4">

          <motion.h1
            variants={up(0.1)}
            initial="hidden"
            animate="show"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(50px, 15vw, 78px)',
              fontWeight: 800,
              lineHeight: 0.93,
              letterSpacing: '-0.015em',
              color: '#fff',
            }}
          >
            A moto<br />
            que você<br />
            <span style={{ color: 'var(--accent)' }}>sempre quis.</span>
          </motion.h1>

          <motion.p
            variants={up(0.22)}
            initial="hidden"
            animate="show"
            className="mt-5 text-[14px] leading-[1.72]"
            style={{ color: 'rgba(255,255,255,0.52)' }}
          >
            Financiamento sem entrada — aprovação na hora. Motos novas e seminovas em Boa Vista, Roraima.
          </motion.p>

          <motion.div
            variants={up(0.34)}
            initial="hidden"
            animate="show"
            className="mt-7 flex flex-col gap-3"
          >
            <Link
              href="/estoque"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[14px] font-bold text-marine-900"
              style={{ background: '#fff' }}
            >
              Ver estoque <ArrowRight size={14} />
            </Link>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 px-6 py-4 text-[14px] font-bold text-white"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Falar por WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Moto image — BELOW text on mobile */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="show"
          className="relative w-full flex-1"
          style={{ minHeight: 260, maxHeight: '42dvh' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-[5%] left-[15%] right-[15%] h-[30%] rounded-full blur-[60px]"
            style={{ background: 'rgba(227,30,36,0.26)' }}
          />
          <Image
            src={MOTO}
            alt="Shopping das Motos"
            fill
            priority
            sizes="100vw"
            className="object-contain"
            style={{ padding: '0 16px 8px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
          />
        </motion.div>

        {/* Stats mobile */}
        <motion.div
          variants={up(0.65)}
          initial="hidden"
          animate="show"
          className="mx-6 mb-8 grid grid-cols-3 rounded-2xl px-4 py-5"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
        >
          {[
            { value: '1.000+', label: 'Clientes' },
            { value: '500+',   label: 'Motos' },
            { value: '100%',   label: 'Aprovação' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center"
              style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
            >
              <span className="text-[22px] font-black leading-none text-white" style={{ fontFamily: 'var(--font-oswald)' }}>
                {s.value}
              </span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.34)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ════ TRUST BAR ══════════════════════════════ */}
      <motion.div
        variants={up(0.72)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[2, 5, 8].map((n) => (
              <div key={n} className="h-7 w-7 overflow-hidden rounded-full border-2 border-[#0D0D0F]" style={{ background: '#1A1A1E' }}>
                <Image src={`/images/motos/moto-${n}.png`} alt="" width={28} height={28} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="h-3 w-3" viewBox="0 0 12 12" fill="#E31E24">
                  <path d="M6 1l1.3 3.9H11L8 7.3l1 3.9L6 9l-3 2.2 1-3.9L1 4.9h3.7z" />
                </svg>
              ))}
            </div>
            <p className="text-[10px] font-bold text-white/40">
              <span className="text-white/65">+1.000</span> clientes satisfeitos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {TRUST.map((t) => (
            <div key={t.text} className="flex items-center gap-1.5 text-[11px] font-semibold text-white/45">
              <span style={{ color: 'var(--accent)' }}>{t.icon}</span>
              {t.text}
            </div>
          ))}
        </div>

        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white md:flex"
        >
          FALAR NO WHATSAPP <ArrowRight size={11} />
        </a>
      </motion.div>

    </section>
  )
}
