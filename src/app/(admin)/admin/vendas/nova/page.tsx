'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'

interface AvailableCar {
  id: string
  brand: string
  model: string
  year: number
  version: string | null
  price: number
}

const PAYMENT_LABELS: Record<string, string> = {
  a_vista:          'À Vista',
  financiamento:    'Financiamento',
  consorcio:        'Consórcio',
  troca:            'Troca',
  troca_diferenca:  'Troca com Diferença',
}

// ── PriceField: guarda só dígitos, exibe formatado ──
function PriceField({
  label, value, onChange, placeholder, required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  const display = value ? Number(value).toLocaleString('pt-BR') : ''
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-marine-400 pointer-events-none">
          R$
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
          className="field pl-10"
        />
      </div>
    </div>
  )
}

export default function NovaVendaPage() {
  const [cars, setCars]               = useState<AvailableCar[]>([])
  const [carId, setCarId]             = useState('')
  const [clientName, setClientName]   = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientCity, setClientCity]   = useState('')
  const [saleDate, setSaleDate]       = useState(new Date().toISOString().split('T')[0])
  const [salePrice, setSalePrice]     = useState('')
  const [commissionRate, setCommissionRate] = useState('3')
  const [paymentMethod, setPaymentMethod]   = useState('a_vista')
  const [notes, setNotes]             = useState('')
  const [saleStatus, setSaleStatus]   = useState<'concluida' | 'em_negociacao'>('concluida')
  const [markSold, setMarkSold]       = useState(true)
  const [saving, setSaving]           = useState(false)
  const [done, setDone]               = useState(false)
  const [error, setError]             = useState('')

  // Comissão calculada em tempo real
  const commissionValue = Number(salePrice) * (Number(commissionRate) / 100)

  useEffect(() => {
    async function load() {
      const supabase = createDynamicClient()
      const { data } = await supabase
        .from('cars')
        .select('id,brand,model,year,version,price')
        .eq('status', 'disponivel')
        .order('created_at', { ascending: false })
      setCars((data ?? []) as AvailableCar[])
    }
    load()
  }, [])

  // Preenche preço sugerido quando seleciona carro
  function handleCarChange(id: string) {
    setCarId(id)
    const car = cars.find(c => c.id === id)
    if (car?.price) setSalePrice(String(car.price))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Validações
    if (!clientName.trim()) { setError('Nome do cliente é obrigatório.'); return }
    if (!clientPhone.trim()) { setError('Telefone do cliente é obrigatório para vincular a venda ao cadastro.'); return }
    if (!salePrice || Number(salePrice) <= 0) { setError('Valor da venda é obrigatório e deve ser maior que zero.'); return }
    if (markSold && !carId) { setError('Selecione a moto para marcar como vendida.'); return }

    setSaving(true)
    const supabase = createDynamicClient()
    const selectedCar = cars.find(c => c.id === carId)

    // ── 1. Busca ou cria cliente ──────────────────────────────
    let clientId: string | null = null
    const cleanPhone = clientPhone.replace(/\D/g, '')

    if (cleanPhone) {
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle()

      if (existing) {
        clientId = existing.id
      } else {
        const { data: newClient, error: clientErr } = await supabase
          .from('clients')
          .insert({
            name:  clientName.trim(),
            phone: cleanPhone,
            city:  clientCity.trim() || null,
            state: 'RR',
          })
          .select('id')
          .single()
        if (clientErr || !newClient) {
          setError('Erro ao criar cliente. Tente novamente.')
          setSaving(false)
          return
        }
        clientId = newClient.id
      }
    }

    // ── 2. Monta notas (inclui forma de pagamento) ───────────
    const notesText = [
      `Forma de pagamento: ${PAYMENT_LABELS[paymentMethod] ?? paymentMethod}`,
      notes.trim() || null,
    ].filter(Boolean).join('\n')

    // Garantia: phone é required, clientId nunca deve ser null
    if (!clientId) {
      setError('Informe os dados do cliente para registrar a venda.')
      setSaving(false)
      return
    }

    // ── 3. Registra venda (trigger calc_commission calcula commission_value) ──
    const { error: saleErr } = await supabase.from('sales').insert({
      car_id:          markSold && carId ? carId : null,
      client_id:       clientId,
      car_name:        selectedCar
        ? `${selectedCar.brand} ${selectedCar.model} ${selectedCar.year}`
        : '',
      client_name:     clientName.trim(),
      sale_price:      Number(salePrice),
      commission_rate: Number(commissionRate),
      sale_date:       saleDate,
      notes:           notesText,
      status:          saleStatus,
    })

    if (saleErr) {
      setError('Erro ao salvar venda: ' + saleErr.message)
      setSaving(false)
      return
    }

    // ── 4. Garante carro como vendido (belt + suspenders além do trigger) ──
    if (markSold && carId) {
      await supabase
        .from('cars')
        .update({ status: 'vendido', sold_at: new Date().toISOString() })
        .eq('id', carId)
    } else if (!markSold && carId) {
      await supabase.from('cars').update({ status: 'reservado' }).eq('id', carId)
    }

    setDone(true)
    setSaving(false)
  }

  // ── Tela de sucesso ────────────────────────────────────────
  if (done) {
    const cv = commissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const sp = Number(salePrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <CheckCircle2 size={56} className="mb-4 text-emerald-500" />
        </motion.div>
        <h2
          className="text-[22px] font-bold text-marine-900"
          style={{ fontFamily: 'var(--font-oswald)' }}
        >
          Venda registrada!
        </h2>
        <p className="mt-2 text-[14px] text-marine-500">
          {markSold ? 'Moto marcada como vendida no catálogo.' : 'Moto marcada como reservada no catálogo.'}
        </p>

        {/* Resumo financeiro */}
        <div className="mt-5 flex gap-4">
          <div className="rounded-xl border border-marine-100 bg-marine-50 px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-marine-400">Valor da Venda</p>
            <p className="mt-1 text-[18px] font-bold text-marine-900">{sp}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-500">Sua Comissão</p>
            <p className="mt-1 text-[18px] font-bold text-emerald-700">{cv}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/admin/vendas/nova"
            onClick={() => {
              setDone(false)
              setCarId('')
              setSalePrice('')
              setCommissionRate('3')
              setClientName('')
              setClientPhone('')
              setClientCity('')
              setNotes('')
              setPaymentMethod('a_vista')
              setSaleStatus('concluida')
            }}
            className="rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50"
          >
            Nova Venda
          </Link>
          <Link
            href="/admin/vendas"
            className="rounded-xl bg-accent px-4 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
          >
            Ver Vendas
          </Link>
        </div>
      </div>
    )
  }

  // ── Formulário ─────────────────────────────────────────────
  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/vendas" className="text-marine-400 hover:text-marine-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-marine-500">Vendas</p>
          <h1
            className="mt-0.5 text-[24px] font-bold text-marine-900"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Nova Venda
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">

        {/* ── Carro ── */}
        <div>
          <label className="label">
            Moto vendida {markSold && <span className="text-accent">*</span>}
          </label>
          <select
            value={carId}
            onChange={e => handleCarChange(e.target.value)}
            className="field"
          >
            <option value="">Selecione uma moto disponível…</option>
            {cars.map(c => (
              <option key={c.id} value={c.id}>
                {c.brand} {c.model} {c.year}{c.version ? ` — ${c.version}` : ''}
              </option>
            ))}
          </select>
          {cars.length === 0 && (
            <p className="mt-1 text-[11px] text-amber-600">Nenhuma moto disponível no catálogo.</p>
          )}
        </div>

        {/* ── Dados do Cliente ── */}
        <div className="pt-1">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">Dados do Cliente</p>
          <div className="space-y-4">
            <div>
              <label className="label">Nome <span className="text-accent">*</span></label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Nome completo"
                className="field"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">WhatsApp <span style={{ color: '#E31E24' }}>*</span></label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="95 99999-9999"
                  className="field"
                  required
                />
              </div>
              <div>
                <label className="label">Cidade</label>
                <input
                  type="text"
                  value={clientCity}
                  onChange={e => setClientCity(e.target.value)}
                  placeholder="Boa Vista"
                  className="field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Dados Financeiros ── */}
        <div className="pt-1">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">
            Dados Financeiros
          </p>
          <div className="space-y-4">
            <PriceField
              label="Valor da Venda"
              value={salePrice}
              onChange={setSalePrice}
              placeholder="389.990"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Comissão (%) <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={e => setCommissionRate(e.target.value)}
                  placeholder="3"
                  className="field"
                  required
                />
              </div>
              <div>
                <label className="label">Comissão Calculada</label>
                <div
                  className="field flex items-center gap-1.5 font-semibold"
                  style={{
                    background: commissionValue > 0 ? '#ECFDF5' : undefined,
                    borderColor: commissionValue > 0 ? '#6EE7B7' : undefined,
                    color: commissionValue > 0 ? '#059669' : '#94A3B8',
                  }}
                >
                  <TrendingUp size={14} />
                  {commissionValue > 0
                    ? commissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'R$ —'}
                </div>
              </div>
            </div>

            <div>
              <label className="label">
                <CreditCard size={11} className="inline mr-1" />
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="field"
              >
                {Object.entries(PAYMENT_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Data ── */}
        <div>
          <label className="label">Data da venda</label>
          <input
            type="date"
            value={saleDate}
            onChange={e => setSaleDate(e.target.value)}
            className="field"
          />
        </div>

        {/* ── Status da venda ── */}
        <div>
          <label className="label">Status da Venda</label>
          <select
            value={saleStatus}
            onChange={e => setSaleStatus(e.target.value as 'concluida' | 'em_negociacao')}
            className="field"
          >
            <option value="concluida">Concluída</option>
            <option value="em_negociacao">Em negociação</option>
          </select>
        </div>

        {/* ── Observações ── */}
        <div>
          <label className="label">Observações</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Detalhes adicionais sobre a venda…"
            className="field resize-none"
          />
        </div>

        {/* ── Checkbox marcar como vendido ── */}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-marine-100 bg-marine-50 px-4 py-3">
          <input
            type="checkbox"
            checked={markSold}
            onChange={e => setMarkSold(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          <span className="text-[13px] font-medium text-marine-800">
            Marcar moto como <strong>vendida</strong> no catálogo do site
          </span>
        </label>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-accent">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            href="/admin/vendas"
            className="rounded-xl border border-marine-200 px-5 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50"
          >
            Cancelar
          </Link>
          <motion.button
            type="submit"
            disabled={saving}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-[13px] font-bold text-white disabled:opacity-60 hover:opacity-90"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Salvando…</>
              : 'Salvar Venda'}
          </motion.button>
        </div>
      </form>

      <style jsx>{`
        .label {
          display: block;
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2D2D30;
        }
        .field {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #E4E7EB;
          background: white;
          padding: 10px 14px;
          font-size: 14px;
          color: #0D0D0F;
          outline: none;
          transition: border-color 0.15s;
        }
        .field:focus {
          border-color: #E31E24;
          box-shadow: 0 0 0 3px rgba(227,30,36,0.1);
        }
      `}</style>
    </div>
  )
}
