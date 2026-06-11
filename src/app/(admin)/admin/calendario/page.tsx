'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, ShoppingBag, User, TrendingUp, Receipt,
} from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, parseISO, isToday, addMonths, subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Sale {
  id: string
  sale_date: string
  car_name: string | null
  client_name: string | null
  sale_price: number
  commission_value: number
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export default function CalendarioPage() {
  const [sales, setSales]           = useState<Sale[]>([])
  const [loading, setLoading]       = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createDynamicClient()
      const { data } = await supabase
        .from('sales')
        .select('id,sale_date,car_name,client_name,sale_price,commission_value')
        .order('sale_date', { ascending: false })
      setSales((data ?? []) as Sale[])
      setLoading(false)
    }
    load()
  }, [])

  const salesByDate = useMemo(() => {
    const map = new Map<string, Sale[]>()
    for (const sale of sales) {
      const key = sale.sale_date.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(sale)
    }
    return map
  }, [sales])

  const monthStart   = startOfMonth(currentMonth)
  const monthEnd     = endOfMonth(currentMonth)
  const days         = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startWeekday = getDay(monthStart)

  const monthKey   = format(currentMonth, 'yyyy-MM')
  const monthSales = useMemo(
    () => sales.filter(s => s.sale_date.startsWith(monthKey)),
    [sales, monthKey],
  )

  const monthVolume = monthSales.reduce((s, r) => s + (r.sale_price ?? 0), 0)
  const monthComm   = monthSales.reduce((s, r) => s + (r.commission_value ?? 0), 0)

  const selectedSales = selectedDate ? (salesByDate.get(selectedDate) ?? []) : []

  function prevMonth() { setCurrentMonth(prev => subMonths(prev, 1)); setSelectedDate(null) }
  function nextMonth() { setCurrentMonth(prev => addMonths(prev, 1)); setSelectedDate(null) }

  return (
    <div style={{ minHeight: '100%', background: '#F5F6FA', padding: 24 }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A1A1AA' }}>
          Negócios
        </p>
        <h1 style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: '#0D0D0F', fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
          Calendário
        </h1>
      </div>

      {/* ── Calendar card ───────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: 20,
        border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(13,13,15,0.05)',
        padding: 16, marginBottom: 16,
      }}>

        {/* Month navigator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button
            onClick={prevMonth}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: '1px solid #E8ECF0', background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={16} color="#6B6B70" />
          </button>

          <p style={{
            fontSize: 16, fontWeight: 700, color: '#0D0D0F',
            fontFamily: 'var(--font-oswald)', textTransform: 'capitalize',
          }}>
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </p>

          <button
            onClick={nextMonth}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: '1px solid #E8ECF0', background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={16} color="#6B6B70" />
          </button>
        </div>

        {/* Month summary pills */}
        {!loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              borderRadius: 10, padding: '4px 10px',
              fontSize: 11, fontWeight: 600,
              background: '#F1F5F9', color: '#0D0D0F', border: '1px solid #E8ECF0',
            }}>
              <ShoppingBag size={12} color="#A1A1AA" />
              {monthSales.length} {monthSales.length === 1 ? 'venda' : 'vendas'}
            </span>
            {monthVolume > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 6,
                borderRadius: 12, padding: '6px 12px',
                fontSize: 12, fontWeight: 600,
                background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE',
              }}>
                <Receipt size={12} />
                {fmtBRL(monthVolume)}
              </span>
            )}
            {monthComm > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 6,
                borderRadius: 12, padding: '6px 12px',
                fontSize: 12, fontWeight: 600,
                background: '#ECFDF5', color: '#059669', border: '1px solid #D1FAE5',
              }}>
                <TrendingUp size={12} />
                {fmtBRL(monthComm)} comissão
              </span>
            )}
          </div>
        )}

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
          {WEEKDAYS.map(d => (
            <p key={d} style={{
              textAlign: 'center', fontSize: 9, fontWeight: 700,
              color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.04em',
              padding: '3px 0',
            }}>
              {d}
            </p>
          ))}
        </div>

        {/* Days grid */}
        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: '#A1A1AA' }}>
            Carregando…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {/* Empty cells for alignment */}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {days.map(day => {
              const dateKey  = format(day, 'yyyy-MM-dd')
              const daySales = salesByDate.get(dateKey) ?? []
              const hasSales = daySales.length > 0
              const isSelected = selectedDate === dateKey
              const isTodayDay = isToday(day)

              return (
                <button
                  key={dateKey}
                  onClick={() => hasSales && setSelectedDate(isSelected ? null : dateKey)}
                  style={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    aspectRatio: '1',
                    minHeight: 28,
                    borderRadius: 8,
                    border: isTodayDay && !isSelected
                      ? '2px solid #E31E24'
                      : isSelected
                        ? '2px solid #0D0D0F'
                        : '2px solid transparent',
                    background: isSelected ? '#0D0D0F' : hasSales ? '#F0F7FF' : 'transparent',
                    cursor: hasSales ? 'pointer' : 'default',
                    transition: 'all 0.12s',
                    padding: 1,
                    gap: 1,
                  }}
                >
                  <span style={{
                    fontSize: 11,
                    fontWeight: isTodayDay || isSelected || hasSales ? 700 : 400,
                    color: isSelected ? '#fff' : isTodayDay ? '#E31E24' : hasSales ? '#0D0D0F' : '#94A3B8',
                    lineHeight: 1,
                  }}>
                    {format(day, 'd')}
                  </span>
                  {hasSales && (
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 12, height: 12, borderRadius: 99,
                      background: '#E31E24',
                      fontSize: 7, fontWeight: 700, color: '#fff',
                      flexShrink: 0,
                    }}>
                      {daySales.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Selected day panel ──────────────────────────── */}
      <AnimatePresence>
        {selectedDate && selectedSales.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: '#fff', borderRadius: 20,
              border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(13,13,15,0.05)',
              padding: 20,
            }}
          >
            <p style={{
              fontSize: 14, fontWeight: 700, color: '#0D0D0F',
              marginBottom: 14, fontFamily: 'var(--font-oswald)',
              textTransform: 'capitalize',
            }}>
              {format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: ptBR })}
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: '#A1A1AA', textTransform: 'none' }}>
                — {selectedSales.length} {selectedSales.length === 1 ? 'venda' : 'vendas'}
              </span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedSales.map(sale => (
                <div
                  key={sale.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 14,
                    background: '#F8FAFC', border: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#D1FAE5', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <ShoppingBag size={16} color="#059669" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, color: '#0D0D0F',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {sale.car_name ?? 'Carro não informado'}
                    </p>
                    {sale.client_name && (
                      <p style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 11, color: '#9CA3AF', marginTop: 2,
                      }}>
                        <User size={10} />
                        {sale.client_name}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {sale.sale_price > 0 && (
                      <p style={{
                        fontSize: 13, fontWeight: 700, color: '#0D0D0F',
                        fontFamily: 'var(--font-oswald)',
                      }}>
                        {fmtBRL(sale.sale_price)}
                      </p>
                    )}
                    {sale.commission_value > 0 && (
                      <p style={{ fontSize: 10, fontWeight: 600, color: '#059669', marginTop: 2 }}>
                        +{fmtBRL(sale.commission_value)} comissão
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
