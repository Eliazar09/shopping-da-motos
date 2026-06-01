'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Car, ShoppingBag, Users, StickyNote,
  LogOut, Menu, X, CalendarDays,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { label: 'Dashboard',  href: '/admin',            icon: LayoutDashboard },
  { label: 'Carros',     href: '/admin/carros',     icon: Car },
  { label: 'Vendas',     href: '/admin/vendas',     icon: ShoppingBag },
  { label: 'Calendário', href: '/admin/calendario', icon: CalendarDays },
  { label: 'Clientes',   href: '/admin/clientes',   icon: Users },
  { label: 'Anotações',  href: '/admin/anotacoes',  icon: StickyNote },
]

const LOGO = (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
    alt="RM"
    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
  />
)

function isActive(href: string, pathname: string) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href)
}

async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/login'
}

/* ── Desktop: icon-only pill ─────────────────────────── */
function DeskNav({ pathname }: { pathname: string }) {
  return (
    <aside
      className="hidden md:flex"
      style={{ width: 88, flexShrink: 0, flexDirection: 'column' }}
    >
      {/* Floating dark panel */}
      <div style={{
        margin: 12,
        borderRadius: 24,
        background: '#0A1929',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 16,
      }}>
        {/* Logo */}
        <div style={{
          width: 40, height: 40,
          background: '#fff', borderRadius: 12,
          padding: 6, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28, flexShrink: 0,
        }}>
          {LOGO}
        </div>

        {/* Icons */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, alignItems: 'center', width: '100%', padding: '0 10px' }}>
          {NAV.map(item => {
            const active = isActive(item.href, pathname)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: 12,
                  background: active ? '#E31E24' : 'transparent',
                  boxShadow: active ? '0 4px 14px rgba(227,30,36,0.35)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={19}
                  style={{ color: active ? '#fff' : '#729CC4', strokeWidth: active ? 2 : 1.8 }}
                />
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ width: '100%', padding: '8px 10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={logout}
            title="Sair"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 12,
              background: 'transparent', border: 'none', cursor: 'pointer',
              margin: '0 auto',
            }}
          >
            <LogOut size={18} style={{ color: '#486581' }} />
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ── Mobile: hamburger + slide-in drawer ─────────────── */
function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Hamburger — fixed so it never moves */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 60,
          width: 40, height: 40, borderRadius: 12,
          background: '#0A1929', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(10,25,41,0.25)',
        }}
      >
        <Menu size={18} color="#fff" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(10,25,41,0.55)', backdropFilter: 'blur(4px)',
              }}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 55,
                width: 264, background: '#0A1929',
                display: 'flex', flexDirection: 'column',
                padding: 20,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, padding: 5, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {LOGO}
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Rafael Mota</p>
                    <p style={{ color: '#486581', fontSize: 10 }}>Admin</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} style={{ color: '#486581', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              {/* Nav with labels */}
              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NAV.map(item => {
                  const active = isActive(item.href, pathname)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 12,
                        background: active ? '#E31E24' : 'transparent',
                        color: active ? '#fff' : '#A0BADC',
                        fontSize: 14, fontWeight: active ? 700 : 500,
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                    >
                      <Icon size={18} style={{ color: active ? '#fff' : '#729CC4', flexShrink: 0 }} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                <button
                  onClick={logout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 12,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#486581', fontSize: 14, width: '100%',
                  }}
                >
                  <LogOut size={18} style={{ color: '#486581', flexShrink: 0 }} />
                  Sair
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <>
      <DeskNav pathname={pathname} />
      <MobileNav pathname={pathname} />
    </>
  )
}
