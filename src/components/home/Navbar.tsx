'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

// ── Links ──────────────────────────────────────────────────
const stockLinks = [
  { label: 'Estoque Completo', href: '/estoque' },
  { label: 'Carros Novos',     href: '/novos'   },
  { label: 'Seminovos',        href: '/seminovos'},
  { label: 'Repasse',          href: '/repasse' },
]
const anchorLinks = [
  { label: 'Sobre',   href: '#sobre'   },
  { label: 'Contato', href: '#contato' },
]
const drawerLinks = [
  { label: 'Estoque Completo', href: '/estoque',   type: 'route'  },
  { label: 'Carros Novos',     href: '/novos',     type: 'route'  },
  { label: 'Seminovos',        href: '/seminovos', type: 'route'  },
  { label: 'Repasse',          href: '/repasse',   type: 'route'  },
  { label: 'Sobre Rafael',     href: '#sobre',     type: 'anchor' },
  { label: 'Contato',          href: '#contato',   type: 'anchor' },
]
const STOCK_ROUTES = ['/estoque', '/novos', '/seminovos', '/repasse']

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

async function logout() {
  if (typeof window !== 'undefined') window.location.href = '/login'
}
void logout // suppress unused warning

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [stockOpen,  setStockOpen]  = useState(false)
  const stockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname     = usePathname()
  const scrollY      = useMotionValue(0)

  // ── Scroll detection ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      scrollY.set(y)
      setScrolled(y > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollY])

  useEffect(() => { setDrawerOpen(false); setStockOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleAnchor = (href: string) => {
    setDrawerOpen(false)
    const id = href.replace('#', '')
    if (pathname !== '/') { window.location.href = `/${href}`; return }
    const el = document.getElementById(id)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
  }

  const isStockActive = STOCK_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))

  // ── Pill glass states ─────────────────────────────────────
  const pillBg     = scrolled ? 'rgba(10,25,41,0.96)' : 'rgba(10,25,41,0.18)'
  const pillBlur   = scrolled ? 'blur(24px)'           : 'blur(16px)'
  const pillShadow = scrolled
    ? '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)'
    : '0 2px 20px rgba(0,0,0,0.10)'

  const textColor   = 'rgba(255,255,255,0.82)'
  const textHover   = '#ffffff'
  const activeColor = '#ffffff'

  return (
    <>
      {/* ── Floating Navbar ──────────────────────────────────── */}
      <motion.header
        className="fixed left-0 right-0 top-0 z-40 px-4 pt-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          y: { type: 'spring', stiffness: 280, damping: 28 },
          opacity: { duration: 0.5, delay: 0.1, ease: 'easeOut' },
        }}
      >
        <motion.div
          className="mx-auto max-w-7xl rounded-2xl"
          animate={{ background: pillBg, backdropFilter: pillBlur, boxShadow: pillShadow }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ border: '1px solid rgba(255,255,255,0.13)' }}
        >
          <div className="flex h-[60px] items-center justify-between px-5 md:px-8">

            {/* Logo */}
            <Link href="/" aria-label="Rafael Mota — Início" className="relative z-10 flex-shrink-0">
              <Image
                src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO.png"
                alt="Rafael Mota"
                width={150}
                height={48}
                className="h-8 w-auto object-contain md:h-9"
                style={{ filter: 'brightness(0) invert(1)' }}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">

              {/* Dropdown Estoque */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (stockTimeout.current) clearTimeout(stockTimeout.current)
                  setStockOpen(true)
                }}
                onMouseLeave={() => {
                  stockTimeout.current = setTimeout(() => setStockOpen(false), 120)
                }}
              >
                <button
                  className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-colors"
                  style={{ color: isStockActive ? activeColor : textColor }}
                  onMouseEnter={e => { e.currentTarget.style.color = textHover }}
                  onMouseLeave={e => { e.currentTarget.style.color = isStockActive ? activeColor : textColor }}
                >
                  <span
                    className="text-[16px] font-bold"
                    style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
                  >
                    Estoque
                  </span>
                  <motion.span animate={{ rotate: stockOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={13} />
                  </motion.span>
                  {isStockActive && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>

                <AnimatePresence>
                  {stockOpen && (
                    <motion.div
                      className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl py-1.5"
                      style={{
                        background: 'rgba(8,20,36,0.98)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
                      }}
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                    >
                      {stockLinks.map((l) => {
                        const active = isActive(l.href, pathname)
                        return (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="flex items-center justify-between px-4 py-3 transition-colors"
                            style={{
                              color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                              fontFamily: 'var(--font-fraunces)',
                              fontSize: '15px',
                              fontWeight: 700,
                              letterSpacing: '-0.02em',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)'
                              ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                              ;(e.currentTarget as HTMLAnchorElement).style.color = active ? '#ffffff' : 'rgba(255,255,255,0.65)'
                            }}
                          >
                            {l.label}
                            {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sobre / Contato */}
              {anchorLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => handleAnchor(l.href)}
                  className="relative px-4 py-2.5 rounded-xl transition-colors group"
                  style={{
                    color: textColor,
                    fontFamily: 'var(--font-fraunces)',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = textHover }}
                  onMouseLeave={e => { e.currentTarget.style.color = textColor }}
                >
                  {l.label}
                  <span
                    className="absolute bottom-1.5 left-4 right-4 h-[1.5px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  />
                </button>
              ))}
            </nav>

            {/* WhatsApp CTA — desktop */}
            <div className="hidden md:flex">
              <motion.a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold tracking-wide text-white"
                style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.32)' }}
                whileHover={{ scale: 1.04, boxShadow: '0 6px 22px rgba(37,211,102,0.50)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Falar no WhatsApp
              </motion.a>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 text-[11px] font-bold text-white"
                style={{ minHeight: '40px', boxShadow: '0 4px 12px rgba(37,211,102,0.35)' }}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
              <motion.button
                aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="flex items-center justify-center rounded-xl"
                style={{ minHeight: '40px', minWidth: '40px', background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.92 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {drawerOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <X size={18} className="text-white" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <Menu size={18} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

          </div>
        </motion.div>
      </motion.header>

      {/* ── Mobile Drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(5,12,22,0.72)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              className="fixed bottom-0 right-0 top-0 z-40 flex flex-col md:hidden"
              style={{ background: '#0A1929', width: 'min(92vw, 360px)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              {/* Header */}
              <div
                className="flex h-[68px] items-center justify-between px-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Image
                  src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO.png"
                  alt="Rafael Mota"
                  width={130}
                  height={44}
                  className="h-8 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  style={{ minHeight: '40px', minWidth: '40px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Avatar Rafael */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40">
                  <Image
                    src="/images/rafael/rafael-concessionaria.webp"
                    alt="Rafael Mota"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">Rafael Mota</p>
                  <p className="text-[11px] text-white/50">Consultor Toyota · Toyolex</p>
                </div>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {drawerLinks.map((link, i) => {
                  const active = link.type === 'route' && isActive(link.href, pathname)
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.08, type: 'spring', stiffness: 300, damping: 28 }}
                    >
                      {link.type === 'route' ? (
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all"
                          style={{
                            background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                            color: active ? '#ffffff' : 'rgba(255,255,255,0.60)',
                            fontFamily: 'var(--font-fraunces)',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {link.label}
                          {active
                            ? <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            : <ChevronRight size={14} className="opacity-30" />
                          }
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAnchor(link.href)}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition-all"
                          style={{
                            color: 'rgba(255,255,255,0.60)',
                            fontFamily: 'var(--font-fraunces)',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {link.label}
                          <ChevronRight size={14} className="opacity-30" />
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <a
                  href={defaultWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.35)', minHeight: '52px' }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Falar no WhatsApp
                </a>
                <p className="mt-4 text-center text-[10px] text-white/25">
                  Rafael Mota · Consultor Automotivo · Toyolex Roraima
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
