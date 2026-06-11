'use client'

import { useEffect, useState, useMemo } from 'react'
import { createDynamicClient } from '@/lib/supabase/client'
import { format, parseISO, startOfMonth, subMonths, startOfYear, getMonth, getYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  TrendingUp, TrendingDown, DollarSign, Receipt,
  ShoppingBag, BarChart3, Calendar,
} from 'lucide-react'

interface Sale {
  id: string
  car_name: string | null
  client_name: string | null
  sale_date: string
  sale_price: number
  commission_value: number
  commission_rate: number
  status: string
  notes: string | null
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function getPayment(notes: string | null) {
  if (!notes) return 'Não informado'
  const m = notes.match(/Forma de pagamento: ([^\n]+)/)
  return m ? m[1] : 'Não informado'
}

const CARD = { background: '#fff', borderRadius: 20, border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(13,13,15,0.05)' }

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default function FinanceiroPage() {
  const [sales, setSales]     = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createDynamicClient()
    supabase
      .from('sales')
      .select('id,car_name,client_name,sale_date,sale_price,commission_value,commission_rate,status,notes')
      .order('sale_date', { ascending: false })
      .then(({ data }) => {
        setSales((data ?? []) as Sale[])
        setLoading(false)
      })
  }, [])

  const now       = new Date()
  const thisStart = startOfMonth(now).toISOString().split('T')[0]
  const lastStart = startOfMonth(subMonths(now, 1)).toISOString().split('T')[0]
  const lastEnd   = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
  const yearStart = startOfYear(now).toISOString().split('T')[0]

  const concluded = useMemo(() => sales.filter(s => s.status === 'concluida'), [sales])

  const thisMonth  = useMemo(() => concluded.filter(s => s.sale_date >= thisStart), [concluded, thisStart])
  const lastMonth  = useMemo(() => concluded.filter(s => s.sale_date >= lastStart && s.sale_date <= lastEnd), [concluded, lastStart, lastEnd])
  const thisYear   = useMemo(() => concluded.filter(s => s.sale_date >= yearStart), [concluded, yearStart])

  function sum(arr: Sale[]) { return arr.reduce((t, s) => t + (s.sale_price ?? 0), 0) }
  function comm(arr: Sale[]) { return arr.reduce((t, s) => t + (s.commission_value ?? 0), 0) }

  const revMonth  = sum(thisMonth)
  const revLast   = sum(lastMonth)
  const revYear   = sum(thisYear)
  const commMonth = comm(thisMonth)
  const commYear  = comm(thisYear)
  const avg       = thisMonth.length > 0 ? Math.round(revMonth / thisMonth.length) : 0

  const delta = revLast > 0 ? Math.round(((revMonth - revLast) / revLast) * 100) : null

  // Monthly chart data — last 6 months
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d   = subMonths(now, 5 - i)
      const m   = getMonth(d)
      const y   = getYear(d)
      const arr = concluded.filter(s => {
        const sd = parseISO(s.sale_date)
        return getMonth(sd) === m && getYear(sd) === y
      })
      return { label: MONTHS_PT[m], revenue: sum(arr), commission: comm(arr), count: arr.length }
    })
  }, [concluded])

  const maxRev = Math.max(...monthlyData.map(d => d.revenue), 1)

  // Payment breakdown
  const paymentMap = useMemo(() => {
    const map: Record<string, number> = {}
    thisYear.forEach(s => {
      const p = getPayment(s.notes)
      map[p] = (map[p] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [thisYear])

  if (loading) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 8, color: '#A1A1AA', fontSize: 14 }}>
        <div style={{ width: 18, height: 18, borderRadius: 99, border: '2px solid #E31E24', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }} />
        Carregando...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100%', background: '#F5F6FA', padding: 24 }}>

      {/* ── Header ──────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Financeiro
        </p>
        <h1 style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: '#0D0D0F', fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
          Resumo Financeiro
        </h1>
      </div>

      {/* ── 4 KPI cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>

        {/* Receita este mês */}
        <div style={{ ...CARD, padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, background: '#1D4ED8', borderBottomRightRadius: 6 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} style={{ color: '#1D4ED8' }} />
            </div>
            {delta !== null && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 11, fontWeight: 700,
                color: delta >= 0 ? '#059669' : '#E31E24',
                background: delta >= 0 ? '#D1FAE5' : '#FEE2E2',
                borderRadius: 99, padding: '3px 8px',
              }}>
                {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(delta)}%
              </span>
            )}
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0F', lineHeight: 1, fontFamily: 'var(--font-oswald)' }}>
            {fmtBRL(revMonth)}
          </p>
          <p style={{ marginTop: 5, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Receita este mês
          </p>
          {revLast > 0 && (
            <p style={{ marginTop: 4, fontSize: 11, color: '#A1A1AA' }}>
              Mês passado: {fmtBRL(revLast)}
            </p>
          )}
        </div>

        {/* Comissão este mês */}
        <div style={{ ...CARD, padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, background: '#059669', borderBottomRightRadius: 6 }} />
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <TrendingUp size={16} style={{ color: '#059669' }} />
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0F', lineHeight: 1, fontFamily: 'var(--font-oswald)' }}>
            {commMonth > 0 ? fmtBRL(commMonth) : '—'}
          </p>
          <p style={{ marginTop: 5, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Comissão este mês
          </p>
          <p style={{ marginTop: 4, fontSize: 11, color: '#A1A1AA' }}>
            {thisMonth.length} venda{thisMonth.length !== 1 ? 's' : ''} concluída{thisMonth.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Receita no ano */}
        <div style={{ ...CARD, padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, background: '#7C3AED', borderBottomRightRadius: 6 }} />
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <BarChart3 size={16} style={{ color: '#7C3AED' }} />
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0F', lineHeight: 1, fontFamily: 'var(--font-oswald)' }}>
            {revYear > 0 ? fmtBRL(revYear) : '—'}
          </p>
          <p style={{ marginTop: 5, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Receita {now.getFullYear()}
          </p>
          <p style={{ marginTop: 4, fontSize: 11, color: '#A1A1AA' }}>
            Comissão: {commYear > 0 ? fmtBRL(commYear) : '—'}
          </p>
        </div>

        {/* Ticket médio */}
        <div style={{ ...CARD, padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, background: '#B45309', borderBottomRightRadius: 6 }} />
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Receipt size={16} style={{ color: '#B45309' }} />
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#0D0D0F', lineHeight: 1, fontFamily: 'var(--font-oswald)' }}>
            {avg > 0 ? fmtBRL(avg) : '—'}
          </p>
          <p style={{ marginTop: 5, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Ticket médio
          </p>
          <p style={{ marginTop: 4, fontSize: 11, color: '#A1A1AA' }}>
            Este mês
          </p>
        </div>
      </div>

      {/* ── Charts row ───────────────────────────────── */}
      <div className="grid lg:grid-cols-3" style={{ gap: 20, marginBottom: 24 }}>

        {/* Monthly bar chart */}
        <div style={{ ...CARD, padding: 24, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Calendar size={14} style={{ color: '#A1A1AA' }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0F' }}>Receita mensal — últimos 6 meses</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
            {monthlyData.map((d, i) => {
              const pct = maxRev > 0 ? (d.revenue / maxRev) * 100 : 0
              const isLast = i === monthlyData.length - 1
              return (
                <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#A1A1AA' }}>
                    {d.revenue > 0 ? (d.revenue >= 1000 ? `${Math.round(d.revenue / 1000)}k` : fmtBRL(d.revenue)) : ''}
                  </p>
                  <div
                    title={`${d.label}: ${fmtBRL(d.revenue)}`}
                    style={{
                      width: '100%',
                      height: `${Math.max(pct, d.revenue > 0 ? 4 : 0)}%`,
                      minHeight: d.revenue > 0 ? 4 : 0,
                      borderRadius: '6px 6px 0 0',
                      background: isLast ? '#E31E24' : '#1D4ED8',
                      opacity: isLast ? 1 : 0.55 + (i / (monthlyData.length - 1)) * 0.35,
                      transition: 'height 0.3s',
                    }}
                  />
                  <p style={{ fontSize: 11, fontWeight: 600, color: isLast ? '#0D0D0F' : '#A1A1AA' }}>{d.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ ...CARD, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <ShoppingBag size={14} style={{ color: '#A1A1AA' }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0F' }}>Formas de pagamento</p>
          </div>
          {paymentMap.length === 0 ? (
            <p style={{ fontSize: 13, color: '#A1A1AA' }}>Nenhuma venda neste ano.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {paymentMap.slice(0, 5).map(([method, count]) => {
                const pct = Math.round((count / thisYear.length) * 100)
                return (
                  <div key={method}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{method}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0F' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, background: '#1D4ED8', width: `${pct}%`, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Sales table ──────────────────────────────── */}
      <div style={{ ...CARD, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Receipt size={14} style={{ color: '#A1A1AA' }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0F' }}>Histórico de vendas</p>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#A1A1AA' }}>{concluded.length} vendas concluídas</span>
        </div>

        {concluded.length === 0 ? (
          <p style={{ fontSize: 13, color: '#A1A1AA', padding: '24px 0', textAlign: 'center' }}>
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Moto', 'Cliente', 'Data', 'Pagamento', 'Valor', 'Comissão'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {concluded.slice(0, 30).map((sale, i) => (
                  <tr key={sale.id} style={{ borderBottom: i < concluded.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0D0D0F', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.car_name || '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#374151', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.client_name || '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                      {format(parseISO(sale.sale_date), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#6B7280', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getPayment(sale.notes)}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0D0D0F', whiteSpace: 'nowrap', fontFamily: 'var(--font-oswald)' }}>
                      {fmtBRL(sale.sale_price)}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#059669', whiteSpace: 'nowrap' }}>
                      {sale.commission_value > 0 ? fmtBRL(sale.commission_value) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {concluded.length > 30 && (
              <p style={{ marginTop: 12, fontSize: 12, color: '#A1A1AA', textAlign: 'center' }}>
                Mostrando 30 de {concluded.length} vendas. Acesse <a href="/admin/vendas" style={{ color: '#1D4ED8', fontWeight: 600 }}>Vendas</a> para ver todas.
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
