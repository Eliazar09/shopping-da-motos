'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, ShoppingBag, TrendingUp, User, Calendar,
  Car, CreditCard, X, Receipt, Trash2,
} from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'
import { format, parseISO, startOfMonth, subMonths, startOfYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import StatCard from '@/components/admin/ui/StatCard'
import Badge from '@/components/admin/ui/Badge'
import EmptyState from '@/components/admin/ui/EmptyState'
import Skeleton from '@/components/admin/ui/Skeleton'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'

interface Sale {
  id: string
  car_id: string | null
  car_name: string | null
  client_name: string | null
  sale_date: string
  notes: string | null
  sale_price: number
  commission_value: number
  commission_rate: number
  status: string
}

type Period = 'month' | 'last_month' | 'year' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  month:      'Este mês',
  last_month: 'Mês passado',
  year:       'Este ano',
  all:        'Tudo',
}

function getRange(period: Period): { start: string; end: string } | null {
  const now = new Date()
  if (period === 'month') {
    return {
      start: format(startOfMonth(now), 'yyyy-MM-dd'),
      end:   format(now, 'yyyy-MM-dd'),
    }
  }
  if (period === 'last_month') {
    const prev = subMonths(now, 1)
    return {
      start: format(startOfMonth(prev), 'yyyy-MM-dd'),
      end:   format(new Date(now.getFullYear(), now.getMonth(), 0), 'yyyy-MM-dd'),
    }
  }
  if (period === 'year') {
    return {
      start: format(startOfYear(now), 'yyyy-MM-dd'),
      end:   format(now, 'yyyy-MM-dd'),
    }
  }
  return null
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function getPaymentMethod(notes: string | null) {
  if (!notes) return null
  const m = notes.match(/Forma de pagamento: ([^\n]+)/)
  return m ? m[1] : null
}

function paymentBadge(method: string | null): { label: string; variant: 'success' | 'info' | 'warning' | 'neutral' } {
  if (!method) return { label: 'Não informado', variant: 'neutral' }
  if (method.includes('Vista'))        return { label: 'À Vista', variant: 'success' }
  if (method.includes('Financiamento')) return { label: 'Financiamento', variant: 'info' }
  if (method.includes('Troca'))        return { label: method, variant: 'warning' }
  return { label: method, variant: 'neutral' }
}

export default function VendasPage() {
  const [sales, setSales]               = useState<Sale[]>([])
  const [loading, setLoading]           = useState(true)
  const [period, setPeriod]             = useState<Period>('all')
  const [selected, setSelected]         = useState<Sale | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Sale | null>(null)
  const [deleting, setDeleting]         = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createDynamicClient()
      const { data } = await supabase
        .from('sales')
        .select('id,car_id,car_name,client_name,sale_date,notes,sale_price,commission_value,commission_rate,status')
        .order('sale_date', { ascending: false })
      setSales((data ?? []) as Sale[])
      setLoading(false)
    }
    load()
  }, [])

  async function handleDeleteSale(sale: Sale) {
    setDeleting(true)
    const supabase = createDynamicClient()
    await supabase.from('sales').delete().eq('id', sale.id)
    if (sale.car_id) {
      await supabase.from('cars').update({ status: 'disponivel', sold_at: null }).eq('id', sale.car_id)
    }
    setSales(prev => prev.filter(s => s.id !== sale.id))
    setConfirmDelete(null)
    setDeleting(false)
  }

  const filtered = useMemo(() => {
    const range = getRange(period)
    if (!range) return sales
    return sales.filter(s => s.sale_date >= range.start && s.sale_date <= range.end)
  }, [sales, period])

  const stats = useMemo(() => {
    const concluded  = filtered.filter(s => s.status === 'concluida')
    const count      = filtered.length
    const volume     = concluded.reduce((s, r) => s + (r.sale_price ?? 0), 0)
    const commission = concluded.reduce((s, r) => s + (r.commission_value ?? 0), 0)
    const avg        = concluded.length > 0 ? Math.round(volume / concluded.length) : 0
    return { count, volume, commission, avg }
  }, [filtered])

  return (
    <div className="min-h-full p-5 sm:p-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-marine-400">Negócios</p>
          <h1
            className="mt-0.5 text-[28px] font-bold text-marine-900"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
          >
            Vendas
          </h1>
        </div>
        <Link
          href="/admin/vendas/nova"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
          style={{ boxShadow: '0 4px 16px rgba(227,30,36,0.25)', minHeight: 44 }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nova Venda</span>
          <span className="sm:hidden">Nova</span>
        </Link>
      </motion.div>

      {/* ── Period filter ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="rounded-xl px-4 py-2 text-[12px] font-semibold transition-all"
            style={
              period === p
                ? { background: '#0D0D0F', color: '#fff' }
                : { background: '#F1F5F9', color: '#64748B' }
            }
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </motion.div>

      {/* ── 4 StatCards ──────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Vendas"           value={loading ? null : String(stats.count)}          accent="#059669" index={0} loading={loading} />
        <StatCard icon={Receipt}     label="Volume"           value={loading ? null : fmtBRL(stats.volume)}         accent="#1D4ED8" index={1} loading={loading} />
        <StatCard icon={TrendingUp}  label="Comissão"         value={loading ? null : fmtBRL(stats.commission)}     accent="#059669" index={2} loading={loading} />
        <StatCard icon={Car}         label="Ticket médio"     value={loading ? null : (stats.avg > 0 ? fmtBRL(stats.avg) : '—')} accent="#B45309" index={3} loading={loading} />
      </div>

      {/* ── Lista ──────────────────────────────────────────────── */}
      {loading ? (
        <Skeleton count={4} className="h-24" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Nenhuma venda neste período"
          description="Tente outro período ou registre uma nova venda."
          action={
            <Link
              href="/admin/vendas/nova"
              className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
            >
              + Nova Venda
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((sale, i) => {
            const pmRaw    = getPaymentMethod(sale.notes)
            const pmBadge  = paymentBadge(pmRaw)
            const cleanNote = (sale.notes ?? '').replace(/Forma de pagamento: [^\n]+\n?/, '').trim()

            return (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.28), ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full"
              >
                <button
                  type="button"
                  onClick={() => setSelected(sale)}
                  className="w-full text-left"
                >
                <div
                  className="flex items-start gap-4 rounded-2xl bg-white px-5 py-4 transition-shadow hover:shadow-lg"
                  style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(13,13,15,0.06)' }}
                >
                  {/* Icon */}
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: '#D1FAE5' }}
                  >
                    <ShoppingBag size={18} className="text-emerald-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Row 1: car + price */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] font-bold text-marine-900 leading-tight">
                        {sale.car_name ?? 'Moto não informada'}
                      </p>
                      {sale.sale_price > 0 && (
                        <p
                          className="shrink-0 text-[16px] font-bold text-marine-900"
                          style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
                        >
                          {fmtBRL(sale.sale_price)}
                        </p>
                      )}
                    </div>

                    {/* Row 2: client + date */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      {sale.client_name && (
                        <span className="flex items-center gap-1 text-[12px] text-marine-500">
                          <User size={11} className="text-marine-300" />
                          {sale.client_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[12px] text-marine-400">
                        <Calendar size={11} className="text-marine-300" />
                        {format(parseISO(sale.sale_date), "d 'de' MMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>

                    {/* Row 3: commission + payment + status */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {sale.commission_value > 0 && (
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                          <TrendingUp size={11} />
                          {fmtBRL(sale.commission_value)} ({sale.commission_rate}%)
                        </span>
                      )}
                      <Badge variant={pmBadge.variant} dot>{pmBadge.label}</Badge>
                      {sale.status === 'em_negociacao' && (
                        <Badge variant="warning" dot>Em negociação</Badge>
                      )}
                    </div>

                    {cleanNote && (
                      <p className="mt-1.5 truncate text-[11px] text-marine-400">{cleanNote}</p>
                    )}
                  </div>
                </div>
                </button>

                {/* Trash button — outside the clickable area */}
                <button
                  type="button"
                  onClick={() => setConfirmDelete(sale)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl text-marine-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Excluir venda"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── Confirm Delete ─────────────────────────────────────── */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir venda?"
        message={`A venda${confirmDelete?.car_name ? ` de "${confirmDelete.car_name}"` : ''} será removida permanentemente${confirmDelete?.car_id ? ' e a moto voltará para disponível' : ''}.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={() => confirmDelete && handleDeleteSale(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* ── Detail Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl bg-white p-6"
              initial={{ opacity: 0, scale: 0.94, y: '-46%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%' }}
              exit={{ opacity: 0, scale: 0.94, y: '-46%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)' }}>
                  Detalhes da Venda
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl p-1.5 text-marine-400 hover:bg-marine-50 hover:text-marine-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <Row icon={Car}      label="Moto"     value={selected.car_name ?? '—'} />
                <Row icon={User}     label="Cliente"  value={selected.client_name ?? '—'} />
                <Row icon={Calendar} label="Data"     value={format(parseISO(selected.sale_date), "d 'de' MMMM, yyyy", { locale: ptBR })} />
                <Row icon={ShoppingBag} label="Status" value={selected.status === 'concluida' ? 'Concluída' : 'Em negociação'} green={selected.status === 'concluida'} />
                <Row icon={Receipt}  label="Valor"    value={selected.sale_price > 0 ? fmtBRL(selected.sale_price) : '—'} bold green={false} big />
                <Row
                  icon={TrendingUp}
                  label={`Comissão (${selected.commission_rate}%)`}
                  value={selected.commission_value > 0 ? fmtBRL(selected.commission_value) : '—'}
                  green
                />
                {getPaymentMethod(selected.notes) && (
                  <Row icon={CreditCard} label="Pagamento" value={getPaymentMethod(selected.notes)!} />
                )}
                {(selected.notes ?? '').replace(/Forma de pagamento: [^\n]+\n?/, '').trim() && (
                  <div
                    className="rounded-xl p-3 text-[12px] text-marine-600 leading-relaxed"
                    style={{ background: '#FAFBFC', border: '1px solid #F1F5F9' }}
                  >
                    {(selected.notes ?? '').replace(/Forma de pagamento: [^\n]+\n?/, '').trim()}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-5 w-full rounded-xl border border-marine-200 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50"
              >
                Fechar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({
  icon: Icon, label, value, bold, green, big,
}: {
  icon: React.ElementType; label: string; value: string; bold?: boolean; green?: boolean; big?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
      style={{ background: '#FAFBFC', border: '1px solid #F1F5F9' }}
    >
      <div className="flex items-center gap-2 text-[12px] text-marine-500">
        <Icon size={13} className="text-marine-300" />
        {label}
      </div>
      <p
        className={`text-right font-semibold ${big ? 'text-[16px]' : 'text-[13px]'} ${green ? 'text-emerald-700' : 'text-marine-900'}`}
        style={big ? { fontFamily: 'var(--font-oswald)' } : {}}
      >
        {value}
      </p>
    </div>
  )
}
