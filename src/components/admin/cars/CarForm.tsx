'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Loader2, Check, ArrowRight, ArrowLeft, Car, Wrench, FileText, Star, Camera } from 'lucide-react'
import { createCar, updateCar } from '@/app/(admin)/admin/carros/actions'
import PhotoUploader from './PhotoUploader'

const FUEL_OPTIONS = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol',   label: 'Etanol' },
  { value: 'flex',     label: 'Flex' },
  { value: 'diesel',   label: 'Diesel' },
  { value: 'hibrido',  label: 'Híbrido' },
  { value: 'eletrico', label: 'Elétrico' },
]

const TRANS_OPTIONS = [
  { value: 'manual',       label: 'Manual' },
  { value: 'automatico',   label: 'Automático' },
  { value: 'cvt',          label: 'CVT' },
  { value: 'automatizado', label: 'Automatizado' },
]

type Tab = 'basico' | 'tecnico' | 'descricao' | 'extras' | 'fotos'

interface Props {
  mode: 'create' | 'edit'
  car?: Record<string, unknown>
  carId?: string
  initialTab?: Tab
}

const STEPS: { id: Tab; label: string; short: string; icon: React.ElementType }[] = [
  { id: 'basico',    label: 'Básico',     short: '1', icon: Car      },
  { id: 'tecnico',   label: 'Técnico',    short: '2', icon: Wrench   },
  { id: 'descricao', label: 'Descrição',  short: '3', icon: FileText },
  { id: 'extras',    label: 'Extras',     short: '4', icon: Star     },
  { id: 'fotos',     label: 'Fotos',      short: '5', icon: Camera   },
]

export default function CarForm({ mode, car, carId, initialTab = 'basico' }: Props) {
  const router = useRouter()

  const [brand,       setBrand]       = useState(String(car?.brand             ?? ''))
  const [model,       setModel]       = useState(String(car?.model             ?? ''))
  const [version,     setVersion]     = useState(String(car?.version           ?? ''))
  const [modelYear,   setModelYear]   = useState(String(car?.model_year ?? car?.year ?? new Date().getFullYear()))
  const [category,    setCategory]    = useState(String(car?.category          ?? 'seminovo'))
  const [status,      setStatus]      = useState(String(car?.status            ?? 'disponivel'))
  const [km,          setKm]          = useState(String(car?.km                ?? '0'))
  const [fuel,        setFuel]        = useState(String(car?.fuel              ?? 'flex'))
  const [transmission,setTransmission]= useState(String(car?.transmission      ?? 'automatico'))
  const [color,       setColor]       = useState(String(car?.color             ?? ''))
  const [doors,       setDoors]       = useState(String(car?.doors             ?? '4'))
  // price/oldPrice stored as raw digits string ("450000"), formatted on display
  const [price,       setPrice]       = useState(String(car?.price             ?? '').replace(/\D/g, ''))
  const [oldPrice,    setOldPrice]    = useState(String(car?.old_price         ?? '').replace(/\D/g, ''))
  const [negotiable,  setNegotiable]  = useState(Boolean(car?.negotiable       ?? false))
  const [shortDesc,   setShortDesc]   = useState(String(car?.short_description ?? ''))
  const [description, setDescription] = useState(String(car?.description       ?? ''))
  const [features,    setFeatures]    = useState(
    Array.isArray(car?.features)   ? (car.features as string[]).join('\n')   : ''
  )
  const [highlights,  setHighlights]  = useState(
    Array.isArray(car?.highlights) ? (car.highlights as string[]).join('\n') : ''
  )
  const [featured,    setFeatured]    = useState(Boolean(car?.featured         ?? false))
  const [metaTitle,   setMetaTitle]   = useState(String(car?.meta_title        ?? ''))
  const [metaDesc,    setMetaDesc]    = useState(String(car?.meta_description  ?? ''))

  const [tab,    setTab]    = useState<Tab>(initialTab)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  const availableSteps = mode === 'edit'
    ? STEPS
    : STEPS.filter(s => s.id !== 'fotos')

  const currentIndex = availableSteps.findIndex(s => s.id === tab)

  function buildData(): Record<string, unknown> {
    return {
      brand:             brand.trim(),
      model:             model.trim(),
      version:           version.trim() || null,
      year:              Number(modelYear),
      model_year:        Number(modelYear),
      category,
      status,
      km:                Number(km),
      fuel,
      transmission,
      color:             color.trim(),
      doors:             Number(doors),
      price:             Number(price) || 0,
      old_price:         oldPrice ? Number(oldPrice) : null,
      negotiable,
      short_description: shortDesc.trim(),
      description:       description.trim(),
      features:          features.split('\n').map(s => s.trim()).filter(Boolean),
      highlights:        highlights.split('\n').map(s => s.trim()).filter(Boolean),
      featured,
      meta_title:        metaTitle.trim() || null,
      meta_description:  metaDesc.trim() || null,
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!brand.trim() || !model.trim()) { setError('Marca e modelo são obrigatórios.'); return }
    if (!price)                          { setError('Preço é obrigatório.'); return }
    setError(''); setSaving(true)

    const data = buildData()

    if (mode === 'create') {
      const res = await createCar(data)
      if (res?.error) { setError(res.error); setSaving(false); return }
      router.push(`/admin/carros/${res.id}?tab=fotos`)
    } else {
      const res = await updateCar(carId!, data)
      if (res?.error) { setError(res.error); setSaving(false); return }
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  const isPhotosTab = tab === 'fotos'

  async function goNext() {
    const next = availableSteps[currentIndex + 1]
    if (!next) return
    // In edit mode, auto-save on every "Próximo"
    if (mode === 'edit' && carId) {
      setSaving(true)
      const data = buildData()
      const res = await updateCar(carId, data)
      setSaving(false)
      if (res?.error) { setError(res.error); return }
    }
    setTab(next.id)
  }
  function goPrev() {
    const prev = availableSteps[currentIndex - 1]
    if (prev) setTab(prev.id)
  }

  return (
    <div className="w-full max-w-2xl">
      {/* ── Step indicator ─────────────────────────────────── */}
      <div className="mb-6 flex items-center gap-0">
        {availableSteps.map((step, i) => {
          const isActive    = step.id === tab
          const isCompleted = i < currentIndex
          const isLast      = i === availableSteps.length - 1

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setTab(step.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-200 ${
                    isActive
                      ? 'scale-110 text-white shadow-lg'
                      : isCompleted
                        ? 'text-white'
                        : 'text-marine-400 bg-marine-100'
                  }`}
                  style={
                    isActive
                      ? { background: '#0A1929', boxShadow: '0 4px 12px rgba(10,25,41,0.3)' }
                      : isCompleted
                        ? { background: '#10B981' }
                        : {}
                  }
                >
                  {isCompleted ? <Check size={14} /> : step.short}
                </div>
                <span
                  className={`hidden sm:block text-[10px] font-semibold transition-colors whitespace-nowrap ${
                    isActive ? 'text-marine-900' : 'text-marine-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {!isLast && (
                <div
                  className={`h-[2px] flex-1 mx-1 transition-colors duration-300 ${
                    i < currentIndex ? 'bg-emerald-400' : 'bg-marine-100'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Form content ───────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Tab 1: Básico ─────────────────────────────── */}
            {tab === 'basico' && (
              <Card title="Informações Básicas">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Marca *"  value={brand}    onChange={setBrand}    placeholder="Toyota" />
                  <Field label="Modelo *" value={model}    onChange={setModel}    placeholder="Hilux" />
                </div>
                <Field label="Versão" value={version} onChange={setVersion} placeholder="SRX 4x4 Diesel" />
                <Field label="Ano do modelo *" value={modelYear} onChange={setModelYear} type="number" placeholder="2024" />
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Categoria"
                    value={category}
                    onChange={setCategory}
                    options={[
                      { value: 'novo',         label: 'Novo' },
                      { value: 'seminovo',     label: 'Seminovo' },
                      { value: 'venda-direta', label: 'Venda Direta' },
                      { value: 'consorcio',    label: 'Consórcio' },
                      { value: 'repasse',      label: 'Repasse' },
                      { value: 'entregas',     label: 'Entregas' },
                    ]}
                  />
                  <SelectField
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    options={[
                      { value: 'disponivel', label: 'Disponível' },
                      { value: 'reservado',  label: 'Reservado' },
                      { value: 'vendido',    label: 'Vendido' },
                    ]}
                  />
                </div>
              </Card>
            )}

            {/* ── Tab 2: Técnico ────────────────────────────── */}
            {tab === 'tecnico' && (
              <Card title="Especificações Técnicas">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="KM *" value={km} onChange={setKm} type="number" placeholder="0" />
                  <Field label="Portas" value={doors} onChange={setDoors} type="number" placeholder="4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Combustível" value={fuel}         onChange={setFuel}         options={FUEL_OPTIONS} />
                  <SelectField label="Câmbio"       value={transmission} onChange={setTransmission} options={TRANS_OPTIONS} />
                </div>
                <Field label="Cor *" value={color} onChange={setColor} placeholder="Branco Pérola" />
                <div className="grid grid-cols-2 gap-4">
                  <PriceField label="Preço (R$) *"       value={price}    onChange={setPrice}    placeholder="350.000" />
                  <PriceField label="Preço anterior (R$)" value={oldPrice} onChange={setOldPrice} placeholder="370.000" />
                </div>
                <CheckboxField
                  label="Preço negociável"
                  checked={negotiable}
                  onChange={setNegotiable}
                />
              </Card>
            )}

            {/* ── Tab 3: Descrição ──────────────────────────── */}
            {tab === 'descricao' && (
              <Card title="Descrição do Veículo">
                <Field
                  label="Descrição curta *"
                  value={shortDesc}
                  onChange={setShortDesc}
                  placeholder="Ex: Hilux SRX top de linha, diesel, 4x4, único dono…"
                />
                <TextArea
                  label="Descrição completa"
                  value={description}
                  onChange={setDescription}
                  rows={8}
                  placeholder="Descreva o veículo em detalhes: histórico, estado, revisões, diferenciais…"
                />
              </Card>
            )}

            {/* ── Tab 4: Extras ─────────────────────────────── */}
            {tab === 'extras' && (
              <Card title="Opcionais, Destaques & SEO">
                <TextArea
                  label="Opcionais — um por linha"
                  value={features}
                  onChange={setFeatures}
                  rows={7}
                  placeholder={'Ar condicionado digital\nVidros elétricos\nCâmera de ré 360°\nSom JBL\nTeto solar panorâmico'}
                />
                <TextArea
                  label="Destaques — um por linha (máx 3)"
                  value={highlights}
                  onChange={setHighlights}
                  rows={3}
                  placeholder={'4x4 com bloqueio de diferencial\nDiesel 204cv\nSRX Premium'}
                />
                <CheckboxField
                  label="Exibir em destaque na home"
                  checked={featured}
                  onChange={setFeatured}
                />
                <div className="border-t border-marine-100 pt-4 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-marine-400">SEO (opcional)</p>
                  <Field
                    label="Meta título"
                    value={metaTitle}
                    onChange={setMetaTitle}
                    placeholder="Toyota Hilux SRX 2024 | Rafael Mota"
                  />
                  <TextArea
                    label="Meta descrição"
                    value={metaDesc}
                    onChange={setMetaDesc}
                    rows={3}
                    placeholder="Descrição curta para mecanismos de busca…"
                  />
                </div>
              </Card>
            )}

            {/* ── Tab 5: Fotos ──────────────────────────────── */}
            {tab === 'fotos' && mode === 'edit' && carId && (
              <Card title="Fotos do Veículo">
                <PhotoUploader
                  carId={carId}
                  initialImages={Array.isArray(car?.images) ? (car.images as string[]) : []}
                  initialCover={String(car?.cover_image ?? '')}
                />
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Error ─────────────────────────────────────────── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3"
            style={{ border: '1px solid #fecaca' }}
          >
            <span className="text-[13px] font-medium text-red-700">{error}</span>
          </motion.div>
        )}

        {/* ── Fotos tab: botão Concluído ────────────────────── */}
        {isPhotosTab && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center gap-1.5 rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-600 transition-all hover:bg-marine-50"
            >
              <ArrowLeft size={14} />
              Anterior
            </button>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/carros"
                className="flex items-center gap-2 rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-700 transition-all hover:bg-marine-50"
              >
                Ver lista de carros
              </Link>
              <Link
                href="/admin/carros"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                <Check size={14} />
                Concluído
              </Link>
            </div>
          </div>
        )}

        {/* ── Navigation + Submit ───────────────────────────── */}
        {!isPhotosTab && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-600 transition-all hover:bg-marine-50 disabled:opacity-0"
            >
              <ArrowLeft size={14} />
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {/* If not last step → show Next; if last step → show Save */}
              {currentIndex < availableSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-marine-900 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-marine-800 active:scale-[0.98] disabled:opacity-60"
                >
                  {saving ? (
                    <><Loader2 size={14} className="animate-spin" /> Salvando…</>
                  ) : (
                    <>Próximo <ArrowRight size={14} /></>
                  )}
                </button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ boxShadow: '0 4px 16px rgba(227,30,36,0.3)' }}
                >
                  {saving ? (
                    <><Loader2 size={14} className="animate-spin" /> Salvando…</>
                  ) : saved ? (
                    <><Check size={14} /> Salvo!</>
                  ) : mode === 'create' ? (
                    <>Salvar e adicionar fotos <ArrowRight size={14} /></>
                  ) : (
                    'Salvar alterações'
                  )}
                </motion.button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl bg-white p-5 sm:p-6 space-y-4"
      style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(10,25,41,0.06)' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">{title}</p>
      {children}
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E4E7EB] bg-white px-4 py-3 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10"
      />
    </div>
  )
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#E4E7EB] bg-white px-4 py-3 text-[14px] text-marine-900 outline-none transition-all focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10 appearance-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function TextArea({
  label, value, onChange, rows, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; rows: number; placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-[#E4E7EB] bg-white px-4 py-3 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10"
      />
    </div>
  )
}

function PriceField({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const display = value ? Number(value).toLocaleString('pt-BR') : ''

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    onChange(digits)
  }

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-marine-400">R$</span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#E4E7EB] bg-white py-3 pl-10 pr-4 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10"
        />
      </div>
    </div>
  )
}

function CheckboxField({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-marine-100 bg-marine-50 px-4 py-3 transition-colors hover:bg-marine-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 accent-accent"
      />
      <span className="text-[13px] font-medium text-marine-800">{label}</span>
    </label>
  )
}
