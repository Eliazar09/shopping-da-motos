'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Car, ShoppingBag, TrendingUp, Ticket,
  ArrowRight, Pin, StickyNote, Activity,
} from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Skeleton from '@/components/admin/ui/Skeleton'

/* ── Palette ─────────────────────────────────────────── */
const BG   = '#F5F6FA'
const CARD = { background: '#fff', borderRadius: 20, border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(10,25,41,0.05)' }

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  disponivel: { label: 'Disponível', bg: '#D1FAE5', color: '#059669' },
  reservado:  { label: 'Reservado',  bg: '#FEF3C7', color: '#B45309' },
  vendido:    { label: 'Vendido',    bg: '#F1F5F9', color: '#94A3B8' },
}

const TAG_COLORS: Record<string, string> = {
  Cliente: '#3B82F6', Lembrete: '#F59E0B', Trabalho: '#6B7280',
  Pessoal: '#8B5CF6', Importante: '#E31E24',
}

interface DbNote      { id: string; title: string | null; content: string; tags: string[]; is_pinned: boolean; updated_at: string }
interface DbCar       { id: string; brand: string; model: string; year: number; cover_image: string; status: string; price: number }
interface ActivityItem { id: string; type: 'sale' | 'car'; description: string; date: string }

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

/* ── Stat card ────────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, accent, href, index, loading,
}: {
  icon: React.ElementType; label: string; value: string | null;
  accent: string; href?: string; index: number; loading: boolean
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={href ? { y: -3, boxShadow: '0 8px 28px rgba(10,25,41,0.10)' } : {}}
      style={{ ...CARD, padding: 24, position: 'relative', overflow: 'hidden' }}
    >
      {/* Accent strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, background: accent, borderBottomRightRadius: 6 }} />

      {/* Icon circle */}
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} style={{ color: accent, strokeWidth: 1.8 }} />
      </div>

      {loading ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ height: 32, width: 112, borderRadius: 8, background: '#F1F5F9', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 10, width: 64, borderRadius: 4, background: '#F1F5F9', marginTop: 8 }} />
        </div>
      ) : (
        <>
          <p style={{ marginTop: 14, fontSize: 30, fontWeight: 700, color: '#0A1929', lineHeight: 1, fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}>
            {value ?? '—'}
          </p>
          <p style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: '#A0BADC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </p>
        </>
      )}
    </motion.div>
  )
  return href ? <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link> : inner
}

/* ── Section wrapper ──────────────────────────────────── */
function Section({
  title, icon: Icon, href, linkLabel, delay, children,
}: {
  title: string; icon: React.ElementType; href: string; linkLabel: string; delay: number; children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...CARD, padding: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 20 }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0A1929', flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Icon size={14} style={{ color: '#A0BADC', flexShrink: 0 }} strokeWidth={2} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        </p>
        <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#A0BADC', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {linkLabel} <ArrowRight size={11} />
        </Link>
      </div>
      {children}
    </motion.section>
  )
}

/* ── Page ─────────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeCars,  setActiveCars]  = useState<number | null>(null)
  const [salesMonth,  setSalesMonth]  = useState<number | null>(null)
  const [commMonth,   setCommMonth]   = useState<number | null>(null)
  const [avgTicket,   setAvgTicket]   = useState<number | null>(null)
  const [recentNotes, setRecentNotes] = useState<DbNote[]>([])
  const [recentCars,  setRecentCars]  = useState<DbCar[]>([])
  const [activity,    setActivity]    = useState<ActivityItem[]>([])
  const [notesError,  setNotesError]  = useState(false)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const supabase  = createDynamicClient()
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

      const [carsRes, salesCountRes, salesDataRes, carsListRes, salesActRes, carsActRes] = await Promise.all([
        supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'disponivel'),
        supabase.from('sales').select('*', { count: 'exact', head: true }).eq('status', 'concluida').gte('sale_date', monthStart),
        supabase.from('sales').select('commission_value,sale_price').eq('status', 'concluida').gte('sale_date', monthStart),
        supabase.from('cars').select('id,brand,model,year,cover_image,status,price').order('created_at', { ascending: false }).limit(4),
        supabase.from('sales').select('id,car_name,client_name,sale_date').order('sale_date', { ascending: false }).limit(5),
        supabase.from('cars').select('id,brand,model,created_at').order('created_at', { ascending: false }).limit(5),
      ])

      setActiveCars(carsRes.count ?? 0)
      setSalesMonth(salesCountRes.count ?? 0)

      const arr      = (salesDataRes.data ?? []) as { commission_value: number; sale_price: number }[]
      const totComm  = arr.reduce((s, r) => s + Number(r.commission_value ?? 0), 0)
      const totVol   = arr.reduce((s, r) => s + Number(r.sale_price      ?? 0), 0)
      setCommMonth(totComm)
      setAvgTicket(arr.length > 0 ? Math.round(totVol / arr.length) : 0)
      setRecentCars((carsListRes.data ?? []) as DbCar[])

      const saleItems = ((salesActRes.data ?? []) as { id: string; car_name: string | null; client_name: string | null; sale_date: string }[])
        .map(s => ({
          id: `sale-${s.id}`,
          type: 'sale' as const,
          description: `Venda: ${s.car_name ?? 'Carro'}${s.client_name ? ` para ${s.client_name}` : ''}`,
          date: s.sale_date,
        }))
      const carItems = ((carsActRes.data ?? []) as { id: string; brand: string; model: string; created_at: string }[])
        .map(c => ({
          id: `car-${c.id}`,
          type: 'car' as const,
          description: `Carro cadastrado: ${c.brand} ${c.model}`,
          date: c.created_at,
        }))
      setActivity([...saleItems, ...carItems].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7))

      const { data: notes, error: notesErr } = await supabase
        .from('notes')
        .select('id,title,content,tags,is_pinned,updated_at')
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false })
        .limit(3)
      if (notesErr) setNotesError(true)
      else setRecentNotes((notes ?? []) as DbNote[])

      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100%', background: BG, padding: 24 }}>

      {/* ── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: '#A0BADC', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Visão geral
        </p>
        <h1 style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: '#0A1929', fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
      </motion.div>

      {/* ── 4 Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
        <StatCard icon={Car}       label="Carros disponíveis" value={loading ? null : String(activeCars ?? 0)}                              accent="#1D4ED8" href="/admin/carros"  index={0} loading={loading} />
        <StatCard icon={ShoppingBag} label="Vendas no mês"   value={loading ? null : String(salesMonth ?? 0)}                              accent="#059669" href="/admin/vendas"  index={1} loading={loading} />
        <StatCard icon={TrendingUp}  label="Comissão do mês"  value={loading ? null : (commMonth  !== null ? fmtBRL(commMonth)  : '—')}    accent="#059669" href="/admin/vendas"  index={2} loading={loading} />
        <StatCard icon={Ticket}      label="Ticket médio"     value={loading ? null : (avgTicket  !== null && avgTicket > 0 ? fmtBRL(avgTicket) : '—')} accent="#B45309" href="/admin/vendas" index={3} loading={loading} />
      </div>

      {/* ── Bottom grid ───────────────────────────────────── */}
      <div className="grid lg:grid-cols-2" style={{ gap: 20 }}>

        {/* Carros recentes */}
        <Section title="Carros Recentes" icon={Car} href="/admin/carros" linkLabel="Ver catálogo" delay={0.22}>
          {loading ? (
            <Skeleton count={4} className="h-14" />
          ) : recentCars.length === 0 ? (
            <p style={{ fontSize: 13, color: '#A0BADC' }}>Nenhum carro cadastrado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {recentCars.map((car, i) => {
                const st = STATUS_STYLE[car.status] ?? { label: car.status, bg: '#F1F5F9', color: '#6B7280' }
                return (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28 + i * 0.05 }}
                  >
                    <Link href={`/admin/carros/${car.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 14, transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F5F6FA')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Thumb */}
                        <div style={{ width: 56, height: 40, borderRadius: 10, overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                          {car.cover_image
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={car.cover_image} alt={car.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Car size={16} color="#C8D8EC" /></div>
                          }
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1929', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {car.brand} {car.model} {car.year}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                            <span style={{ borderRadius: 99, padding: '2px 8px', fontSize: 10, fontWeight: 700, background: st.bg, color: st.color }}>
                              {st.label}
                            </span>
                            {car.price > 0 && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#486581' }}>{fmtBRL(car.price)}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={13} color="#C8D8EC" style={{ flexShrink: 0 }} />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Section>

        {/* Coluna direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Atividade recente */}
          <Section title="Atividade Recente" icon={Activity} href="/admin/vendas" linkLabel="Ver vendas" delay={0.26}>
            {loading ? (
              <Skeleton count={4} className="h-10" />
            ) : activity.length === 0 ? (
              <p style={{ fontSize: 13, color: '#A0BADC' }}>Nenhuma atividade recente.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activity.map((act, i) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  >
                    <div style={{
                      marginTop: 4, width: 8, height: 8, borderRadius: 99, flexShrink: 0,
                      background: act.type === 'sale' ? '#059669' : act.type === 'car' ? '#1D4ED8' : '#94A3B8',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#102A43', lineHeight: 1.4 }}>{act.description}</p>
                      <p style={{ marginTop: 2, fontSize: 10, color: '#A0BADC' }}>
                        {formatDistanceToNow(parseISO(act.date), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Section>

          {/* Anotações */}
          <Section title="Anotações" icon={StickyNote} href="/admin/anotacoes" linkLabel="Ver todas" delay={0.30}>
            {notesError ? (
              <p style={{ fontSize: 12, color: '#D97706' }}>
                Tabela <code style={{ background: '#FFFBEB', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>notes</code> não encontrada.
              </p>
            ) : loading ? (
              <Skeleton count={2} className="h-14" />
            ) : recentNotes.length === 0 ? (
              <p style={{ fontSize: 13, color: '#A0BADC' }}>Nenhuma anotação ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentNotes.map(note => (
                  <Link key={note.id} href="/admin/anotacoes" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 12, padding: 12, background: '#F8FAFC', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
                    >
                      {note.is_pinned && <Pin size={11} style={{ marginTop: 2, flexShrink: 0, color: '#E31E24' }} />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1929', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {note.title || 'Sem título'}
                        </p>
                        <p style={{ marginTop: 2, fontSize: 11, color: '#729CC4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                          {note.content}
                        </p>
                        {note.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                            {note.tags.slice(0, 2).map(tag => (
                              <span key={tag} style={{ borderRadius: 99, padding: '2px 8px', fontSize: 10, fontWeight: 700, color: '#fff', background: TAG_COLORS[tag] ?? '#6B7280' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}
