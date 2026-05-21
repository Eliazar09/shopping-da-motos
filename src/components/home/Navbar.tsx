'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { defaultWhatsAppLink } from '@/lib/whatsapp'

type NavLink =
  | { label: string; type: 'route'; href: string }
  | { label: string; type: 'anchor'; href: string }

const navLinks: NavLink[] = [
  { label: 'ESTOQUE', type: 'route', href: '/estoque' },
  { label: 'NOVOS', type: 'route', href: '/novos' },
  { label: 'SEMINOVOS', type: 'route', href: '/seminovos' },
  { label: 'REPASSE', type: 'route', href: '/repasse' },
  { label: 'SOBRE', type: 'anchor', href: '#sobre' },
  { label: 'CONTATO', type: 'anchor', href: '#contato' },
]

function LogoMark() {
  return (
    <Image
      src="/images/logo-rafael.png"
      alt="Rafael Mota"
      width={160}
      height={52}
      className="h-9 w-auto object-contain md:h-10"
      priority
    />
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleAnchorClick = (href: string) => {
    setDrawerOpen(false)
    if (pathname !== '/') {
      window.location.href = `/${href}`
      return
    }
    const el = document.querySelector(href)
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    }
  }

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-40 transition-all duration-300"
        animate={{
          backgroundColor: scrolled ? 'rgba(10,22,40,0.98)' : 'rgba(10,22,40,0)',
          borderBottomColor: scrolled ? 'rgba(26,43,71,1)' : 'rgba(26,43,71,0)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          boxShadow: scrolled ? '0 1px 0 rgba(74,144,226,0.15)' : 'none',
        }}
        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
      >
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
          <Link href="/" aria-label="Rafael Mota — Início">
            <LogoMark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) =>
              link.type === 'route' ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-bold tracking-[0.12em] transition-colors hover:text-white ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-white'
                      : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleAnchorClick(link.href)}
                  className="text-[11px] font-bold tracking-[0.12em] text-text-secondary transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={defaultWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-sm bg-accent-red px-4 py-2 text-[11px] font-bold tracking-[0.08em] text-white transition-colors hover:bg-accent-red-dark"
            >
              <WhatsAppIcon />
              FALAR NO WHATSAPP
            </a>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={defaultWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 bg-accent-red px-3 text-[10px] font-bold tracking-[0.06em] text-white"
            >
              <WhatsAppIcon />
              <span className="sr-only sm:not-sr-only">WHATSAPP</span>
            </a>
            <button
              aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:text-white"
            >
              {drawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 right-0 top-0 z-40 flex w-[280px] flex-col bg-bg-secondary md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex h-[60px] items-center justify-between border-b border-bg-tertiary px-6">
                <span
                  className="font-anton text-[13px] tracking-widest text-white"
                  style={{ fontFamily: 'var(--font-anton)' }}
                >
                  MENU
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-text-muted hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) =>
                  link.type === 'route' ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center px-3 py-3.5 text-left text-[12px] font-bold tracking-[0.12em] transition-colors hover:text-white ${
                        pathname === link.href ? 'text-white' : 'text-text-secondary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.href}
                      onClick={() => handleAnchorClick(link.href)}
                      className="flex items-center px-3 py-3.5 text-left text-[12px] font-bold tracking-[0.12em] text-text-secondary transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>
                  ),
                )}
              </nav>

              <div className="mt-auto border-t border-bg-tertiary p-6">
                <a
                  href={defaultWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent-red py-3.5 text-[11px] font-bold tracking-[0.08em] text-white"
                >
                  <WhatsAppIcon />
                  FALAR NO WHATSAPP
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
