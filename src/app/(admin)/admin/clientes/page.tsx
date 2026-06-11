'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Users, MapPin, Phone, ShoppingBag,
  Pencil, Trash2, X, Loader2, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import Badge from '@/components/admin/ui/Badge'
import EmptyState from '@/components/admin/ui/EmptyState'
import { SkeletonCard } from '@/components/admin/ui/Skeleton'

interface Client {
  id: string
  name: string
  phone: string
  email: string | null
  cpf: string | null
  city: string | null
  notes: string | null
  created_at: string
}

interface SaleRecord {
  id: string
  client_id: string | null
  car_name: string | null
  sale_date: string
  sale_price: number
}

const AVATAR_COLORS = [
  '#0D0D0F', '#1D4ED8', '#7C3AED', '#B45309',
  '#0F766E', '#BE123C', '#1E40AF', '#065F46',
]

function avatarColor(name: string) {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function formatPhone(p: string): string {
  const d = p.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return p
}

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function clientBadge(count: number): { label: string; variant: 'neutral' | 'info' | 'vip' } {
  if (count === 0) return { label: 'Lead', variant: 'neutral' }
  if (count === 1) return { label: 'Cliente', variant: 'info' }
  return { label: 'Cliente VIP', variant: 'vip' }
}

const INTEREST_OPTIONS = [
  { value: '', label: 'Sem interesse definido' },
  { value: '[Interesse: Sem interesse]', label: 'Sem interesse' },
  { value: '[Interesse: Pode trocar em breve]', label: 'Pode trocar em breve' },
  { value: '[Interesse: Procurando outro]', label: 'Procurando outro' },
  { value: '[Interesse: VIP — prioridade]', label: 'VIP — prioridade máxima' },
]

function getInterestFromNotes(notes: string | null) {
  if (!notes) return ''
  const match = notes.match(/\[Interesse:[^\]]+\]/)
  return match ? match[0] : ''
}

function stripInterestFromNotes(notes: string | null) {
  if (!notes) return ''
  return notes.replace(/\[Interesse:[^\]]+\]\n?/, '').trim()
}

type ModalMode = 'create' | 'edit' | 'delete' | null

// ── Modal overlay ─────────────────────────────────────────────
function Overlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  )
}

export default function ClientesPage() {
  const [clients, setClients]     = useState<Client[]>([])
  const [sales, setSales]         = useState<SaleRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState<ModalMode>(null)
  const [target, setTarget]       = useState<Client | null>(null)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [formError, setFormError] = useState('')
  const [deleting, setDeleting]   = useState(false)

  const [fName,     setFName]     = useState('')
  const [fPhone,    setFPhone]    = useState('')
  const [fEmail,    setFEmail]    = useState('')
  const [fCity,     setFCity]     = useState('')
  const [fNotes,    setFNotes]    = useState('')
  const [fInterest, setFInterest] = useState('')

  async function load() {
    const supabase = createDynamicClient()
    const [clientsRes, salesRes] = await Promise.all([
      supabase.from('clients').select('id,name,phone,email,cpf,city,notes,created_at').order('created_at', { ascending: false }),
      supabase.from('sales').select('id,client_id,car_name,sale_date,sale_price').order('sale_date', { ascending: false }),
    ])
    setClients((clientsRes.data ?? []) as Client[])
    setSales((salesRes.data ?? []) as SaleRecord[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Group sales by client_id (JS-side, no N+1)
  const salesByClient = useMemo(() => {
    const map = new Map<string, SaleRecord[]>()
    for (const s of sales) {
      if (!s.client_id) continue
      const arr = map.get(s.client_id) ?? []
      arr.push(s)
      map.set(s.client_id, arr)
    }
    return map
  }, [sales])

  const filtered = useMemo(() =>
    clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.city ?? '').toLowerCase().includes(search.toLowerCase())
    ),
    [clients, search]
  )

  function openCreate() {
    setFName(''); setFPhone(''); setFEmail(''); setFCity(''); setFNotes(''); setFInterest('')
    setFormError(''); setSaved(false); setTarget(null)
    setModal('create')
  }

  function openEdit(client: Client) {
    setFName(client.name)
    setFPhone(client.phone)
    setFEmail(client.email ?? '')
    setFCity(client.city ?? '')
    setFInterest(getInterestFromNotes(client.notes))
    setFNotes(stripInterestFromNotes(client.notes))
    setFormError(''); setSaved(false); setTarget(client)
    setModal('edit')
  }

  function openDelete(client: Client) {
    setTarget(client)
    setModal('delete')
  }

  function closeModal() { setModal(null); setTarget(null) }

  function buildNotes() {
    const parts = [fInterest.trim(), fNotes.trim()].filter(Boolean)
    return parts.length ? parts.join('\n') : null
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!fName.trim()) { setFormError('Nome é obrigatório.'); return }
    if (!fPhone.trim()) { setFormError('WhatsApp é obrigatório.'); return }
    setFormError(''); setSaving(true)

    const supabase = createDynamicClient()
    const payload = {
      name:  fName.trim(),
      phone: fPhone.replace(/\D/g, ''),
      email: fEmail.trim() || null,
      city:  fCity.trim() || null,
      notes: buildNotes(),
    }

    if (modal === 'create') {
      const { error } = await supabase.from('clients').insert(payload)
      if (error) { setFormError('Erro ao salvar. Tente novamente.'); setSaving(false); return }
    } else if (modal === 'edit' && target) {
      const { error } = await supabase.from('clients').update(payload).eq('id', target.id)
      if (error) { setFormError('Erro ao atualizar. Tente novamente.'); setSaving(false); return }
    }

    setSaving(false)
    setSaved(true)
    await load()
    setTimeout(closeModal, 1000)
  }

  async function handleDelete() {
    if (!target) return
    setDeleting(true)
    const supabase = createDynamicClient()
    await supabase.from('clients').delete().eq('id', target.id)
    setDeleting(false)
    closeModal()
    await load()
  }

  const totalClients = clients.length
  const vipCount  = clients.filter(c => (salesByClient.get(c.id)?.length ?? 0) >= 2).length
  const leadCount = clients.filter(c => (salesByClient.get(c.id)?.length ?? 0) === 0).length

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
            Clientes
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          style={{ boxShadow: '0 4px 16px rgba(227,30,36,0.25)', minHeight: 44 }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Novo Cliente</span>
          <span className="sm:hidden">Novo</span>
        </motion.button>
      </motion.div>

      {/* ── Mini stats ─────────────────────────────────────────── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {[
            { label: `${totalClients} clientes`, color: '#0D0D0F' },
            { label: `${vipCount} VIP`, color: '#92400E' },
            { label: `${leadCount} leads`, color: '#64748B' },
          ].map(s => (
            <span
              key={s.label}
              className="rounded-xl px-3 py-1.5 text-[12px] font-semibold"
              style={{ background: '#F1F5F9', color: s.color }}
            >
              {s.label}
            </span>
          ))}
        </motion.div>
      )}

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-marine-300" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, telefone ou cidade…"
          className="w-full rounded-xl border border-marine-100 bg-white py-2.5 pl-10 pr-4 text-[13px] text-marine-900 outline-none transition-all focus:border-marine-400 focus:ring-2 focus:ring-marine-900/8"
        />
      </div>

      {/* ── Grid ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          description={search ? 'Tente outro nome, telefone ou cidade.' : 'Clique em + Novo Cliente para começar.'}
          action={!search ? (
            <button
              onClick={openCreate}
              className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
            >
              + Novo Cliente
            </button>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client, i) => {
            const clientSales = salesByClient.get(client.id) ?? []
            const totalSpent  = clientSales.reduce((s, r) => s + (r.sale_price ?? 0), 0)
            const badge       = clientBadge(clientSales.length)
            const bgColor     = avatarColor(client.name)
            const interest    = getInterestFromNotes(client.notes)
            const cleanNotes  = stripInterestFromNotes(client.notes)
            const lastSale    = clientSales[0]

            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col rounded-2xl bg-white"
                style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(13,13,15,0.06)' }}
              >
                {/* Card top */}
                <div className="p-5 pb-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-[16px] font-bold text-white"
                      style={{ background: bgColor }}
                    >
                      {client.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-bold text-marine-900 leading-tight">{client.name}</p>
                        <Badge variant={badge.variant} dot>{badge.label}</Badge>
                      </div>
                      {client.city && (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-marine-400">
                          <MapPin size={10} />
                          {client.city}, RR
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  {client.phone && (
                    <p className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-marine-600">
                      <Phone size={11} className="text-marine-300" />
                      {formatPhone(client.phone)}
                    </p>
                  )}

                  {/* Interest tag */}
                  {interest && (
                    <p className="mt-2 text-[11px] text-marine-400 italic">
                      {interest.replace(/[\[\]]/g, '')}
                    </p>
                  )}

                  {/* Notes */}
                  {cleanNotes && (
                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-marine-400">{cleanNotes}</p>
                  )}
                </div>

                {/* Purchase history */}
                <div
                  className="mx-5 mb-4 rounded-xl p-3"
                  style={{ background: '#FAFBFC', border: '1px solid #F1F5F9' }}
                >
                  {clientSales.length === 0 ? (
                    <p className="text-[11px] text-marine-300 flex items-center gap-1.5">
                      <ShoppingBag size={11} />
                      Ainda não comprou — potencial lead
                    </p>
                  ) : (
                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-marine-400">
                        {clientSales.length} {clientSales.length === 1 ? 'compra' : 'compras'}
                        {lastSale && (
                          <span className="ml-1 font-normal lowercase">
                            · última {formatDistanceToNow(parseISO(lastSale.sale_date), { addSuffix: true, locale: ptBR })}
                          </span>
                        )}
                      </p>
                      <div className="space-y-1">
                        {clientSales.slice(0, 2).map(sale => (
                          <div key={sale.id} className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-medium text-marine-700">
                              {sale.car_name ?? '—'}
                            </p>
                            {sale.sale_price > 0 && (
                              <p className="shrink-0 text-[11px] font-bold text-marine-900">
                                {formatBRL(sale.sale_price)}
                              </p>
                            )}
                          </div>
                        ))}
                        {clientSales.length > 2 && (
                          <p className="text-[10px] text-marine-400">+{clientSales.length - 2} mais…</p>
                        )}
                      </div>
                      {totalSpent > 0 && (
                        <div className="mt-2 flex items-center justify-between border-t border-marine-100 pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-marine-400">Total gasto</span>
                          <span className="text-[13px] font-bold text-emerald-700">{formatBRL(totalSpent)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-marine-50 px-4 py-3">
                  {client.phone && (
                    <a
                      href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ minHeight: 36 }}
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(client)}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-marine-100 text-marine-500 transition-colors hover:bg-marine-50 hover:text-marine-900"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => openDelete(client)}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-marine-100 text-marine-300 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-accent"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {(modal === 'create' || modal === 'edit') && (
          <>
            <Overlay onClose={closeModal} />
            <motion.div
              className="fixed inset-x-4 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-white p-6 md:inset-0 md:m-auto md:h-fit md:rounded-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)' }}>
                  {modal === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
                </h2>
                <button onClick={closeModal} className="rounded-xl p-1.5 text-marine-400 transition-colors hover:bg-marine-50 hover:text-marine-700">
                  <X size={18} />
                </button>
              </div>

              {saved ? (
                <div className="flex flex-col items-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CheckCircle2 size={48} className="mb-3 text-emerald-500" />
                  </motion.div>
                  <p className="font-bold text-marine-900">Salvo com sucesso!</p>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nome *" value={fName} onChange={setFName} placeholder="Nome completo" className="col-span-2" />
                    <FormField label="WhatsApp *" value={fPhone} onChange={setFPhone} placeholder="95 99999-9999" type="tel" />
                    <FormField label="Cidade" value={fCity} onChange={setFCity} placeholder="Boa Vista" />
                  </div>
                  <FormField label="E-mail" value={fEmail} onChange={setFEmail} placeholder="email@exemplo.com" type="email" />

                  <div>
                    <label className="field-label">Interesse futuro</label>
                    <select
                      value={fInterest}
                      onChange={e => setFInterest(e.target.value)}
                      className="field-input"
                    >
                      {INTEREST_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Notas</label>
                    <textarea
                      value={fNotes}
                      onChange={e => setFNotes(e.target.value)}
                      rows={3}
                      placeholder="Observações sobre o cliente…"
                      className="field-input resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="flex items-center gap-1.5 text-[12px] font-medium text-accent">
                      <AlertTriangle size={12} /> {formError}
                    </p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeModal} className="flex-1 rounded-xl border border-marine-200 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50">
                      Cancelar
                    </button>
                    <motion.button
                      type="submit"
                      disabled={saving}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
                    >
                      {saving ? <><Loader2 size={14} className="animate-spin" /> Salvando…</> : 'Salvar'}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}

        {modal === 'delete' && target && (
          <>
            <Overlay onClose={closeModal} />
            <motion.div
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-6"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 size={22} className="text-accent" />
              </div>
              <h3 className="text-[16px] font-bold text-marine-900">Excluir cliente?</h3>
              <p className="mt-1.5 text-[13px] text-marine-500">
                <strong>{target.name}</strong> será removido permanentemente.
              </p>
              {(salesByClient.get(target.id)?.length ?? 0) > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                  <p className="text-[11px] text-amber-700">
                    Este cliente tem {salesByClient.get(target.id)!.length} {salesByClient.get(target.id)!.length === 1 ? 'venda' : 'vendas'} registradas.
                    As vendas ficam no histórico sem vínculo de cliente.
                  </p>
                </div>
              )}
              <div className="mt-5 flex gap-3">
                <button onClick={closeModal} className="flex-1 rounded-xl border border-marine-200 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50">
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
                >
                  {deleting ? <><Loader2 size={13} className="animate-spin" /> Excluindo…</> : 'Excluir'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .field-label {
          display: block;
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2D2D30;
        }
        .field-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #E4E7EB;
          background: white;
          padding: 10px 14px;
          font-size: 14px;
          color: #0D0D0F;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none;
        }
        .field-input:focus {
          border-color: #94A3B8;
          box-shadow: 0 0 0 3px rgba(13,13,15,0.07);
        }
      `}</style>
    </div>
  )
}

function FormField({
  label, value, onChange, placeholder, type = 'text', className = '',
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; className?: string
}) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input"
      />
      <style jsx>{`
        .field-label {
          display: block; margin-bottom: 6px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em; color: #2D2D30;
        }
        .field-input {
          width: 100%; border-radius: 12px; border: 1px solid #E4E7EB; background: white;
          padding: 10px 14px; font-size: 14px; color: #0D0D0F; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus { border-color: #94A3B8; box-shadow: 0 0 0 3px rgba(13,13,15,0.07); }
      `}</style>
    </div>
  )
}
