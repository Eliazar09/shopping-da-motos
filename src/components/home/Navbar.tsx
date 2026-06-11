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
  { label: 'Motos Novas',      href: '/estoque?categoria=novo'      },
  { label: 'Seminovas',        href: '/estoque?categoria=seminovo'  },
]
const anchorLinks = [
  { label: 'Sobre',   href: '#sobre'   },
  { label: 'Contato', href: '#contato' },
]
const drawerLinks = [
  { label: 'Estoque Completo', href: '/estoque',                       type: 'route'  },
  { label: 'Motos Novas',      href: '/estoque?categoria=novo',        type: 'route'  },
  { label: 'Seminovas',        href: '/estoque?categoria=seminovo',    type: 'route'  },
  { label: 'Sobre nós',        href: '#sobre',                         type: 'anchor' },
  { label: 'Contato',          href: '#contato',                       type: 'anchor' },
]
const STOCK_ROUTES = ['/estoque']

function isActive(href: string, pathname: string) {
  const path = href.split('?')[0]
  return pathname === path || pathname.startsWith(path + '/')
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
  const pillBg     = scrolled ? 'rgba(10,10,12,0.97)' : 'rgba(13,13,15,0.25)'
  const pillBlur   = scrolled ? 'blur(28px)'           : 'blur(20px)'
  const pillShadow = scrolled
    ? '0 8px 40px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.20), 0 0 0 1px rgba(255,255,255,0.07)'
    : '0 2px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.08)'

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
          <div className="flex h-[64px] items-center justify-between px-5 md:px-8">

            {/* Logo */}
            <Link href="/" aria-label="Shopping das Motos — Início" className="relative z-10 flex-shrink-0">
              <Image
                src="/images/image/image.png"
                alt="Shopping das Motos"
                width={150}
                height={48}
                className="h-9 w-auto object-contain md:h-11"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-0.5 md:flex">

              {/* Dropdown Estoque */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (stockTimeout.current) clearTimeout(stockTimeout.current)
                  setStockOpen(true)
                }}
                onMouseLeave={() => {
                  stockTimeout.current = setTimeout(() => setStockOpen(false), 140)
                }}
              >
                <button
                  className="relative flex items-center gap-1.5 rounded-xl px-4 py-2.5 transition-all duration-200"
                  style={{ color: isStockActive ? '#fff' : 'rgba(255,255,255,0.72)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = isStockActive ? '#fff' : 'rgba(255,255,255,0.72)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em]"
                    style={{ fontFamily: 'var(--font-inter)' }}>
                    Estoque
                  </span>
                  <motion.span animate={{ rotate: stockOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={12} strokeWidth={2.5} />
                  </motion.span>
                  {isStockActive && (
                    <span className="absolute bottom-1.5 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>

                <AnimatePresence>
                  {stockOpen && (
                    <motion.div
                      className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl py-2"
                      style={{
                        background: 'rgba(13,13,15,0.98)',
                        backdropFilter: 'blur(28px)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                      }}
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                    >
                      {stockLinks.map((l) => {
                        const active = isActive(l.href, pathname)
                        return (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="flex items-center justify-between px-4 py-3 transition-all duration-150"
                            style={{ color: active ? '#fff' : 'rgba(255,255,255,0.60)' }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'
                              ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                              ;(e.currentTarget as HTMLAnchorElement).style.color = active ? '#fff' : 'rgba(255,255,255,0.60)'
                            }}
                          >
                            <span className="text-[12px] font-bold uppercase tracking-[0.12em]"
                              style={{ fontFamily: 'var(--font-inter)' }}>
                              {l.label}
                            </span>
                            {active
                              ? <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                              : <ChevronRight size={12} className="opacity-25" />}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dot separator */}
              <span className="mx-1 h-1 w-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} />

              {/* Sobre / Contato */}
              {anchorLinks.map((l, i) => (
                <>
                  <button
                    key={l.href}
                    onClick={() => handleAnchor(l.href)}
                    className="relative rounded-xl px-4 py-2.5 transition-all duration-200"
                    style={{ color: 'rgba(255,255,255,0.72)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.72)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span className="text-[12px] font-bold uppercase tracking-[0.14em]"
                      style={{ fontFamily: 'var(--font-inter)' }}>
                      {l.label}
                    </span>
                  </button>
                  {i < anchorLinks.length - 1 && (
                    <span className="mx-1 h-1 w-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} />
                  )}
                </>
              ))}
            </nav>

            {/* WhatsApp CTA — desktop */}
            <div className="hidden md:flex">
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  background: '#25D366',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.30)',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Falar no WhatsApp
              </a>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              <motion.button
                aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="flex items-center justify-center rounded-xl border"
                style={{
                  minHeight: '40px', minWidth: '40px',
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.12)',
                }}
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
              style={{ background: '#0D0D0F', width: 'min(92vw, 360px)' }}
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
                  src="/images/image/image.png"
                  alt="Shopping das Motos"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  style={{ minHeight: '40px', minWidth: '40px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Brand strip */}
              <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl" style={{ background: '#0D0D0F' }}>
                  <Image
                    src="/images/motos/moto-10.png"
                    alt="Shopping das Motos"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">Shopping das Motos</p>
                  <p className="text-[11px] text-white/50">Motos Novas · Seminovas</p>
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
                            fontFamily: 'var(--font-oswald)',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
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
                            fontFamily: 'var(--font-oswald)',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
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
                  Shopping das Motos · Motos Novas e Seminovas
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
