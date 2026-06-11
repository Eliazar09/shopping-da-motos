'use client'

import Link from 'next/link'
import {
  Bike, ShoppingBag, TrendingUp, Ticket,
  ArrowRight, Pin, StickyNote, Activity,
} from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const BG   = '#F5F6FA'
const CARD = { background: '#fff', borderRadius: 20, border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(13,13,15,0.05)' }

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  disponivel: { label: 'Disponível', bg: '#D1FAE5', color: '#059669' },
  reservado:  { label: 'Reservado',  bg: '#FEF3C7', color: '#B45309' },
  vendido:    { label: 'Vendido',    bg: '#F1F5F9', color: '#94A3B8' },
}

const TAG_COLORS: Record<string, string> = {
  Cliente: '#3B82F6', Lembrete: '#F59E0B', Trabalho: '#6B7280',
  Pessoal: '#8B5CF6', Importante: '#E31E24',
}

export interface DbNote      { id: string; title: string | null; content: string; tags: string[]; is_pinned: boolean; updated_at: string }
export interface DbCar       { id: string; brand: string; model: string; year: number; cover_image: string; status: string; price: number }
export interface ActivityItem { id: string; type: 'sale' | 'car'; description: string; date: string }

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function StatCard({
  icon: Icon, label, value, accent, href,
}: {
  icon: React.ElementType; label: string; value: string;
  accent: string; href?: string
}) {
  const inner = (
    <div style={{ ...CARD, padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, background: accent, borderBottomRightRadius: 6 }} />
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} style={{ color: accent, strokeWidth: 1.8 }} />
      </div>
      <p style={{ marginTop: 14, fontSize: 30, fontWeight: 700, color: '#0D0D0F', lineHeight: 1, fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
        {value}
      </p>
      <p style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </p>
    </div>
  )
  return href ? <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link> : inner
}

function Section({
  title, icon: Icon, href, linkLabel, children,
}: {
  title: string; icon: React.ElementType; href: string; linkLabel: string; children: React.ReactNode
}) {
  return (
    <section style={{ ...CARD, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 20 }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0D0D0F', flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Icon size={14} style={{ color: '#A1A1AA', flexShrink: 0 }} strokeWidth={2} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        </p>
        <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#A1A1AA', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {linkLabel} <ArrowRight size={11} />
        </Link>
      </div>
      {children}
    </section>
  )
}

interface Props {
  activeCars:   number
  salesMonth:   number
  commMonth:    number
  avgTicket:    number
  recentCars:   DbCar[]
  activity:     ActivityItem[]
  recentNotes:  DbNote[]
  notesError:   boolean
}

export default function DashboardClient({
  activeCars, salesMonth, commMonth, avgTicket,
  recentCars, activity, recentNotes, notesError,
}: Props) {
  return (
    <div style={{ minHeight: '100%', background: BG, padding: 24 }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Visão geral
        </p>
        <h1 style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: '#0D0D0F', fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
          Dashboard
        </h1>
      </div>

      {/* ── 4 Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
        <StatCard icon={Bike}        label="Motos disponíveis" value={String(activeCars)}                                accent="#1D4ED8" href="/admin/carros"  />
        <StatCard icon={ShoppingBag} label="Vendas no mês"     value={String(salesMonth)}                               accent="#059669" href="/admin/vendas"  />
        <StatCard icon={TrendingUp}  label="Comissão do mês"   value={commMonth > 0 ? fmtBRL(commMonth) : '—'}          accent="#059669" href="/admin/vendas"  />
        <StatCard icon={Ticket}      label="Ticket médio"      value={avgTicket > 0 ? fmtBRL(avgTicket) : '—'}          accent="#B45309" href="/admin/vendas"  />
      </div>

      {/* ── Bottom grid ───────────────────────────────────── */}
      <div className="grid lg:grid-cols-2" style={{ gap: 20 }}>

        {/* Motos recentes */}
        <Section title="Motos Recentes" icon={Bike} href="/admin/carros" linkLabel="Ver catálogo">
          {recentCars.length === 0 ? (
            <p style={{ fontSize: 13, color: '#A1A1AA' }}>Nenhuma moto cadastrada ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {recentCars.map((car) => {
                const st = STATUS_STYLE[car.status] ?? { label: car.status, bg: '#F1F5F9', color: '#6B7280' }
                return (
                  <Link key={car.id} href={`/admin/carros/${car.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 14, transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F5F6FA')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: 56, height: 40, borderRadius: 10, overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                        {car.cover_image
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={car.cover_image} alt={car.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bike size={16} color="#E4E4E7" /></div>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {car.brand} {car.model} {car.year}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                          <span style={{ borderRadius: 99, padding: '2px 8px', fontSize: 10, fontWeight: 700, background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                          {car.price > 0 && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B6B70' }}>{fmtBRL(car.price)}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight size={13} color="#E4E4E7" style={{ flexShrink: 0 }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Section>

        {/* Coluna direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Atividade recente */}
          <Section title="Atividade Recente" icon={Activity} href="/admin/vendas" linkLabel="Ver vendas">
            {activity.length === 0 ? (
              <p style={{ fontSize: 13, color: '#A1A1AA' }}>Nenhuma atividade recente.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activity.map((act, i) => (
                  <div
                    key={act.id}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  >
                    <div style={{
                      marginTop: 4, width: 8, height: 8, borderRadius: 99, flexShrink: 0,
                      background: act.type === 'sale' ? '#059669' : '#1D4ED8',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#141416', lineHeight: 1.4 }}>{act.description}</p>
                      <p style={{ marginTop: 2, fontSize: 10, color: '#A1A1AA' }}>
                        {formatDistanceToNow(parseISO(act.date), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Anotações */}
          <Section title="Anotações" icon={StickyNote} href="/admin/anotacoes" linkLabel="Ver todas">
            {notesError ? (
              <p style={{ fontSize: 12, color: '#D97706' }}>
                Tabela <code style={{ background: '#FFFBEB', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>notes</code> não encontrada.
              </p>
            ) : recentNotes.length === 0 ? (
              <p style={{ fontSize: 13, color: '#A1A1AA' }}>Nenhuma anotação ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentNotes.map(note => (
                  <Link key={note.id} href="/admin/anotacoes" style={{ textDecoration: 'none' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 12, padding: 12, background: '#F8FAFC', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
                    >
                      {note.is_pinned && <Pin size={11} style={{ marginTop: 2, flexShrink: 0, color: '#E31E24' }} />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {note.title || 'Sem título'}
                        </p>
                        <p style={{ marginTop: 2, fontSize: 11, color: '#9CA3AF', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
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
