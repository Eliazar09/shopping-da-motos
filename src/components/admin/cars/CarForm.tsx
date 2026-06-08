'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Loader2, Check, ArrowRight, ArrowLeft,
  Car, Wrench, FileText, Star, Camera, CreditCard, Gift,
} from 'lucide-react'
import { createCar, updateCar } from '@/app/(admin)/admin/carros/actions'
import PhotoUploader from './PhotoUploader'
import type React from 'react'

// ── Constants ──────────────────────────────────────────────────────────────
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
const STATUS_OPTIONS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado',  label: 'Reservado' },
  { value: 'vendido',    label: 'Vendido' },
]

// ── Form type ──────────────────────────────────────────────────────────────
type FormType = 'car' | 'consorcio' | 'entrega'
type AnyTab  = 'basico' | 'tecnico' | 'descricao' | 'extras' | 'info' | 'fotos'

function getFormType(cat: string): FormType {
  if (cat === 'consorcio') return 'consorcio'
  if (cat === 'entregas')  return 'entrega'
  return 'car'
}

// ── Step configs ───────────────────────────────────────────────────────────
const CAR_STEPS = [
  { id: 'basico'    as AnyTab, label: 'Básico',    short: '1', icon: Car      },
  { id: 'tecnico'   as AnyTab, label: 'Técnico',   short: '2', icon: Wrench   },
  { id: 'descricao' as AnyTab, label: 'Descrição', short: '3', icon: FileText },
  { id: 'extras'    as AnyTab, label: 'Extras',    short: '4', icon: Star     },
  { id: 'fotos'     as AnyTab, label: 'Fotos',     short: '5', icon: Camera   },
]
const SPECIAL_STEPS = [
  { id: 'info'  as AnyTab, label: 'Informações', short: '1', icon: FileText },
  { id: 'fotos' as AnyTab, label: 'Fotos',        short: '2', icon: Camera   },
]

// ── Category options ───────────────────────────────────────────────────────
const CAT_OPTIONS = [
  { value: 'novo',         label: 'Novo',         icon: Car,       desc: 'Veículo 0km' },
  { value: 'seminovo',     label: 'Seminovo',     icon: Car,       desc: 'Usado c/ histórico' },
  { value: 'venda-direta', label: 'Venda Direta', icon: Car,       desc: 'Venda imediata' },
  { value: 'repasse',      label: 'Repasse',      icon: Car,       desc: 'Avaliação p/ compra' },
  { value: 'consorcio',    label: 'Consórcio',   icon: CreditCard, desc: 'Oferta de consórcio' },
  { value: 'entregas',     label: 'Entrega',     icon: Gift,       desc: 'Case de venda' },
]

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  mode: 'create' | 'edit'
  car?: Record<string, unknown>
  carId?: string
  initialTab?: string
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CarForm({ mode, car, carId, initialTab = 'basico' }: Props) {
  const router = useRouter()

  // ── Category ──────────────────────────────────────────────────────────
  const [category, setCategory] = useState(String(car?.category ?? 'seminovo'))
  const formType: FormType = getFormType(category)

  // ── Car fields ────────────────────────────────────────────────────────
  const [brand,        setBrand]        = useState(String(car?.brand             ?? ''))
  const [model,        setModel]        = useState(String(car?.model             ?? ''))
  const [version,      setVersion]      = useState(String(car?.version           ?? ''))
  const [modelYear,    setModelYear]    = useState(String(car?.model_year ?? car?.year ?? new Date().getFullYear()))
  const [status,       setStatus]       = useState(String(car?.status            ?? 'disponivel'))
  const [km,           setKm]           = useState(String(car?.km                ?? '0'))
  const [fuel,         setFuel]         = useState(String(car?.fuel              ?? 'flex'))
  const [transmission, setTransmission] = useState(String(car?.transmission      ?? 'automatico'))
  const [color,        setColor]        = useState(String(car?.color             ?? ''))
  const [doors,        setDoors]        = useState(String(car?.doors             ?? '4'))
  const [price,        setPrice]        = useState(String(car?.price             ?? '').replace(/\D/g, ''))
  const [oldPrice,     setOldPrice]     = useState(String(car?.old_price         ?? '').replace(/\D/g, ''))
  const [negotiable,   setNegotiable]   = useState(Boolean(car?.negotiable       ?? false))
  const [shortDesc,    setShortDesc]    = useState(String(car?.short_description ?? ''))
  const [description,  setDescription]  = useState(String(car?.description       ?? ''))
  const [features,     setFeatures]     = useState(
    Array.isArray(car?.features)   ? (car.features as string[]).join('\n')   : ''
  )
  const [highlights,   setHighlights]   = useState(
    Array.isArray(car?.highlights) ? (car.highlights as string[]).join('\n') : ''
  )
  const [featured,     setFeatured]     = useState(Boolean(car?.featured         ?? false))
  const [metaTitle,    setMetaTitle]    = useState(String(car?.meta_title        ?? ''))
  const [metaDesc,     setMetaDesc]     = useState(String(car?.meta_description  ?? ''))

  // ── Consórcio fields ──────────────────────────────────────────────────
  const [cTipoGrupo,    setCTipoGrupo]    = useState(String(car?.consorcio_tipo_grupo    ?? ''))
  const [cValorCarta,   setCValorCarta]   = useState(String(car?.consorcio_valor_carta   ?? '').replace(/\D/g, ''))
  const [cValorParcela, setCValorParcela] = useState(String(car?.consorcio_valor_parcela ?? '').replace(/\D/g, ''))
  const [cPrazo,        setCPrazo]        = useState(String(car?.consorcio_prazo         ?? ''))
  const [cTaxaAdmin,    setCTaxaAdmin]    = useState(String(car?.consorcio_taxa_admin    ?? ''))
  const [cFundoReserva, setCFundoReserva] = useState(String(car?.consorcio_fundo_reserva ?? ''))
  const [cAssembleia,   setCAssembleia]   = useState(String(car?.consorcio_assembleia    ?? ''))
  const [cDiaVenc,      setCDiaVenc]      = useState(String(car?.consorcio_dia_vencimento ?? ''))
  const [cCashback,     setCCashback]     = useState(String(car?.consorcio_cashback      ?? '').replace(/\D/g, ''))

  // ── Entrega fields ────────────────────────────────────────────────────
  const [eData,        setEData]        = useState(String(car?.entrega_data         ?? ''))
  const [eClienteNome, setEClienteNome] = useState(String(car?.entrega_cliente_nome ?? ''))
  const [eVeiculo,     setEVeiculo]     = useState(String(car?.entrega_veiculo      ?? ''))
  const [eMensagem,    setEMensagem]    = useState(
    car?.category === 'entregas' ? String(car?.description ?? '') : ''
  )

  // ── UI state ──────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<'select' | 'form'>(mode === 'edit' ? 'form' : 'select')
  const [tab, setTab] = useState<AnyTab>(() => {
    if (initialTab === 'fotos') return 'fotos'
    const ft = getFormType(String(car?.category ?? 'seminovo'))
    if (ft !== 'car') return 'info'
    return (initialTab as AnyTab) || 'basico'
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  // ── Steps ─────────────────────────────────────────────────────────────
  const allSteps = formType === 'car' ? CAR_STEPS : SPECIAL_STEPS
  const steps    = mode === 'edit' ? allSteps : allSteps.filter(s => s.id !== 'fotos')
  const currentIndex = steps.findIndex(s => s.id === tab)
  const isPhotosTab  = tab === 'fotos'

  // ── Category change ───────────────────────────────────────────────────
  function handleCategoryChange(newCat: string) {
    const oldType = getFormType(category)
    const newType = getFormType(newCat)
    setCategory(newCat)
    if (oldType !== newType) {
      setTab(newType === 'car' ? 'basico' : 'info')
    }
  }

  // ── Build data ────────────────────────────────────────────────────────
  function buildData(): Record<string, unknown> {
    const consorcioFields = {
      consorcio_tipo_grupo:     formType === 'consorcio' ? (cTipoGrupo.trim() || null)    : null,
      consorcio_valor_carta:    formType === 'consorcio' ? (Number(cValorCarta) || null)   : null,
      consorcio_valor_parcela:  formType === 'consorcio' ? (Number(cValorParcela) || null) : null,
      consorcio_prazo:          formType === 'consorcio' ? (Number(cPrazo) || null)        : null,
      consorcio_taxa_admin:     formType === 'consorcio' ? (cTaxaAdmin.trim() || null)     : null,
      consorcio_fundo_reserva:  formType === 'consorcio' ? (cFundoReserva.trim() || null)  : null,
      consorcio_assembleia:     formType === 'consorcio' ? (cAssembleia.trim() || null)    : null,
      consorcio_dia_vencimento: formType === 'consorcio' ? (cDiaVenc.trim() || null)       : null,
      consorcio_cashback:       formType === 'consorcio' ? (Number(cCashback) || null)     : null,
    }
    const entregaFields = {
      entrega_data:         formType === 'entrega' ? (eData || null)              : null,
      entrega_cliente_nome: formType === 'entrega' ? (eClienteNome.trim() || null) : null,
      entrega_veiculo:      formType === 'entrega' ? (eVeiculo.trim() || null)    : null,
    }

    if (formType === 'car') {
      return {
        category, status, featured,
        brand: brand.trim(), model: model.trim(),
        version: version.trim() || null,
        year: Number(modelYear), model_year: Number(modelYear),
        km: Number(km), fuel, transmission,
        color: color.trim(), doors: Number(doors),
        price: Number(price) || 0,
        old_price: oldPrice ? Number(oldPrice) : null,
        negotiable,
        short_description: shortDesc.trim(),
        description: description.trim(),
        features: features.split('\n').map(s => s.trim()).filter(Boolean),
        highlights: highlights.split('\n').map(s => s.trim()).filter(Boolean),
        meta_title: metaTitle.trim() || null,
        meta_description: metaDesc.trim() || null,
        ...consorcioFields,
        ...entregaFields,
      }
    }

    if (formType === 'consorcio') {
      return {
        category, status: 'disponivel', featured: false,
        brand: 'Toyota',
        model: cTipoGrupo.trim() || 'Consórcio',
        version: null,
        year: new Date().getFullYear(),
        model_year: new Date().getFullYear(),
        km: 0, fuel: null, transmission: null, color: null, doors: null,
        price: Number(cValorCarta) || 0,
        old_price: null, negotiable: false,
        short_description: cTipoGrupo.trim() || 'Consórcio Toyota',
        description: '',
        features: [], highlights: [],
        meta_title: null, meta_description: null,
        ...consorcioFields,
        ...entregaFields,
      }
    }

    // entrega
    const entregaYear = eData ? new Date(eData + 'T00:00:00').getFullYear() : new Date().getFullYear()
    return {
      category, status: 'disponivel', featured: false,
      brand: 'Toyota',
      model: eVeiculo.trim() || 'Entrega',
      version: null,
      year: entregaYear, model_year: entregaYear,
      km: 0, fuel: null, transmission: null, color: null, doors: null,
      price: 0, old_price: null, negotiable: false,
      short_description: eClienteNome.trim() || 'Entrega Toyota',
      description: eMensagem.trim(),
      features: [], highlights: [],
      meta_title: null, meta_description: null,
      ...consorcioFields,
      ...entregaFields,
    }
  }

  // ── Validate ──────────────────────────────────────────────────────────
  function validate(): string | null {
    if (formType === 'car') {
      if (!brand.trim() || !model.trim()) return 'Marca e modelo são obrigatórios.'
      if (!price) return 'Preço é obrigatório.'
    } else if (formType === 'consorcio') {
      if (!cTipoGrupo.trim()) return 'Tipo de grupo é obrigatório.'
      if (!cValorCarta)       return 'Valor da carta é obrigatório.'
      if (!cValorParcela)     return 'Valor da parcela é obrigatório.'
      if (!cPrazo)            return 'Prazo é obrigatório.'
    } else {
      if (!eClienteNome.trim()) return 'Nome do cliente é obrigatório.'
      if (!eVeiculo.trim())     return 'Veículo entregue é obrigatório.'
      if (!eData)               return 'Data da entrega é obrigatória.'
    }
    return null
  }

  // ── Submit ────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setSaving(true)

    const data = buildData()

    if (mode === 'create') {
      const res = await createCar(data)
      if (res?.error) { setError(res.error); setSaving(false); return }
      router.push(`/admin/carros/${res.id}?tab=fotos`)
    } else {
      const res = await updateCar(carId!, data)
      if (res?.error) { setError(res.error); setSaving(false); return }
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  async function goNext() {
    const next = steps[currentIndex + 1]
    if (!next) return
    if (mode === 'edit' && carId) {
      setSaving(true)
      const res = await updateCar(carId, buildData())
      setSaving(false)
      if (res?.error) { setError(res.error); return }
    }
    setTab(next.id)
  }
  function goPrev() {
    const prev = steps[currentIndex - 1]
    if (prev) setTab(prev.id)
  }

  // ── FASE 1: Seleção de categoria (create mode only) ───────────────
  if (phase === 'select') {
    return (
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-6 sm:p-8" style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(10,25,41,0.06)' }}>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-marine-400">Passo 1 de 1</p>
          <h2 className="mb-6 text-[20px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-fraunces)' }}>
            O que você quer cadastrar?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CAT_OPTIONS.map(({ value: v, label, icon: Icon, desc }) => {
              const isActive = category === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCategory(v)}
                  className="flex flex-col items-start gap-1.5 rounded-xl p-4 text-left transition-all"
                  style={{
                    border: isActive ? '2px solid #0A1929' : '1.5px solid #E4E7EB',
                    background: isActive ? '#0A1929' : '#FAFBFC',
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? '#fff' : '#486581' }} />
                  <span className="text-[13px] font-bold leading-tight" style={{ color: isActive ? '#fff' : '#0A1929' }}>{label}</span>
                  <span className="text-[11px] leading-snug" style={{ color: isActive ? 'rgba(255,255,255,0.55)' : '#829AB1' }}>{desc}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                handleCategoryChange(category)
                setPhase('form')
              }}
              className="flex items-center gap-2 rounded-xl bg-marine-900 px-7 py-3 text-[14px] font-bold text-white transition-all hover:bg-marine-800 active:scale-[0.98]"
              style={{ boxShadow: '0 4px 16px rgba(10,25,41,0.2)' }}
            >
              Avançar <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── FASE 2: Formulário ─────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl">
      {/* Indicador de categoria selecionada */}
      {mode === 'create' && (
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPhase('select')}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-marine-400 transition-colors hover:text-marine-700"
          >
            <ArrowLeft size={14} /> Trocar tipo
          </button>
          <span className="text-marine-200">·</span>
          <span className="rounded-full bg-marine-900 px-3 py-1 text-[11px] font-bold text-white">
            {CAT_OPTIONS.find(o => o.value === category)?.label ?? category}
          </span>
        </div>
      )}

      {/* ── Step indicator ─────────────────────────────────────── */}
      <div className="mb-6 flex items-center gap-0">
        {steps.map((step, i) => {
          const isActive    = step.id === tab
          const isCompleted = i < currentIndex
          const isLast      = i === steps.length - 1
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <button type="button" onClick={() => setTab(step.id)} className="flex flex-col items-center gap-1 group">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-200 ${
                    isActive ? 'scale-110 text-white shadow-lg' : isCompleted ? 'text-white' : 'text-marine-400 bg-marine-100'
                  }`}
                  style={isActive ? { background: '#0A1929', boxShadow: '0 4px 12px rgba(10,25,41,0.3)' } : isCompleted ? { background: '#10B981' } : {}}
                >
                  {isCompleted ? <Check size={14} /> : step.short}
                </div>
                <span className={`hidden sm:block text-[10px] font-semibold transition-colors whitespace-nowrap ${isActive ? 'text-marine-900' : 'text-marine-400'}`}>
                  {step.label}
                </span>
              </button>
              {!isLast && (
                <div className={`h-[2px] flex-1 mx-1 transition-colors duration-300 ${i < currentIndex ? 'bg-emerald-400' : 'bg-marine-100'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Form content ───────────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + category}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── CAR — Tab Básico ──────────────────────────────── */}
            {formType === 'car' && tab === 'basico' && (
              <Card title="Informações Básicas">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Marca *"  value={brand} onChange={setBrand} placeholder="Toyota" />
                  <Field label="Modelo *" value={model} onChange={setModel} placeholder="Hilux" />
                </div>
                <Field label="Versão" value={version} onChange={setVersion} placeholder="SRX 4x4 Diesel" />
                <Field label="Ano do modelo *" value={modelYear} onChange={setModelYear} type="number" placeholder="2024" />
                <SelectField label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
              </Card>
            )}

            {/* ── CAR — Tab Técnico ─────────────────────────────── */}
            {formType === 'car' && tab === 'tecnico' && (
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
                  <PriceField label="Preço (R$) *"        value={price}    onChange={setPrice}    placeholder="350.000" />
                  <PriceField label="Preço anterior (R$)" value={oldPrice} onChange={setOldPrice} placeholder="370.000" />
                </div>
                <CheckboxField label="Preço negociável" checked={negotiable} onChange={setNegotiable} />
              </Card>
            )}

            {/* ── CAR — Tab Descrição ───────────────────────────── */}
            {formType === 'car' && tab === 'descricao' && (
              <Card title="Descrição do Veículo">
                <Field label="Descrição curta *" value={shortDesc} onChange={setShortDesc} placeholder="Hilux SRX top de linha, diesel, 4x4, único dono…" />
                <TextArea label="Descrição completa" value={description} onChange={setDescription} rows={8} placeholder="Descreva o veículo em detalhes…" />
              </Card>
            )}

            {/* ── CAR — Tab Extras ──────────────────────────────── */}
            {formType === 'car' && tab === 'extras' && (
              <Card title="Opcionais, Destaques & SEO">
                <TextArea label="Opcionais — um por linha" value={features} onChange={setFeatures} rows={7}
                  placeholder={'Ar condicionado digital\nVidros elétricos\nCâmera de ré 360°'} />
                <TextArea label="Destaques — um por linha (máx 3)" value={highlights} onChange={setHighlights} rows={3}
                  placeholder={'4x4 com bloqueio de diferencial\nDiesel 204cv'} />
                <CheckboxField label="Exibir em destaque na home" checked={featured} onChange={setFeatured} />
                <div className="border-t border-marine-100 pt-4 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-marine-400">SEO (opcional)</p>
                  <Field label="Meta título" value={metaTitle} onChange={setMetaTitle} placeholder="Toyota Hilux SRX 2024 | Rafael Mota" />
                  <TextArea label="Meta descrição" value={metaDesc} onChange={setMetaDesc} rows={3} placeholder="Descrição curta para mecanismos de busca…" />
                </div>
              </Card>
            )}

            {/* ── CONSÓRCIO — Tab Info ──────────────────────────── */}
            {formType === 'consorcio' && tab === 'info' && (
              <Card title="Dados do Consórcio">
                <Field label="Tipo de Grupo *" value={cTipoGrupo} onChange={setCTipoGrupo} placeholder="Ex: Hilux SRX 4x4 Diesel" />
                <div className="grid grid-cols-2 gap-4">
                  <PriceField label="Valor da Carta *" value={cValorCarta}   onChange={setCValorCarta}   placeholder="180.000" />
                  <PriceField label="Parcela Mensal *"  value={cValorParcela} onChange={setCValorParcela} placeholder="2.800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Prazo (meses) *"   value={cPrazo}    onChange={setCPrazo}    type="number" placeholder="180" />
                  <Field label="Taxa Administrativa" value={cTaxaAdmin} onChange={setCTaxaAdmin} placeholder="Ex: 22,50%" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Fundo de Reserva" value={cFundoReserva} onChange={setCFundoReserva} placeholder="Ex: 1,50%" />
                  <Field label="Assembleia"        value={cAssembleia}  onChange={setCAssembleia}  placeholder="Ex: Mensal" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Dia do 1º Vencimento" value={cDiaVenc}  onChange={setCDiaVenc}  placeholder="Ex: Dia 10" />
                  <PriceField label="Cashback Toyota"  value={cCashback} onChange={setCCashback} placeholder="5.000" />
                </div>
              </Card>
            )}

            {/* ── ENTREGA — Tab Info ────────────────────────────── */}
            {formType === 'entrega' && tab === 'info' && (
              <Card title="Dados da Entrega">
                <Field label="Nome do cliente *"   value={eClienteNome} onChange={setEClienteNome} placeholder="João Silva" />
                <Field label="Veículo entregue *"  value={eVeiculo}     onChange={setEVeiculo}     placeholder="Toyota Hilux SRX 2024" />
                <Field label="Data da entrega *"   value={eData}        onChange={setEData}        type="date" />
                <TextArea label="Depoimento / Mensagem (opcional)" value={eMensagem} onChange={setEMensagem} rows={4}
                  placeholder="Ex: Sonho realizado! Atendimento excelente do Rafael…" />
              </Card>
            )}

            {/* ── FOTOS (edit mode only) ────────────────────────── */}
            {tab === 'fotos' && mode === 'edit' && carId && (
              <Card title="Fotos">
                <PhotoUploader
                  carId={carId}
                  initialImages={Array.isArray(car?.images) ? (car.images as string[]) : []}
                  initialCover={String(car?.cover_image ?? '')}
                />
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Error ─────────────────────────────────────────────── */}
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

        {/* ── Fotos tab: Concluído ───────────────────────────────── */}
        {isPhotosTab && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={goPrev}
              className="flex items-center gap-1.5 rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-600 transition-all hover:bg-marine-50">
              <ArrowLeft size={14} /> Anterior
            </button>
            <div className="flex items-center gap-2">
              <Link href="/admin/carros"
                className="flex items-center gap-2 rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-700 transition-all hover:bg-marine-50">
                Ver lista
              </Link>
              <Link href="/admin/carros"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]">
                <Check size={14} /> Concluído
              </Link>
            </div>
          </div>
        )}

        {/* ── Navigation + Submit ───────────────────────────────── */}
        {!isPhotosTab && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={goPrev} disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-marine-200 px-4 py-2.5 text-[13px] font-semibold text-marine-600 transition-all hover:bg-marine-50 disabled:opacity-0">
              <ArrowLeft size={14} /> Anterior
            </button>
            <div className="flex items-center gap-2">
              {currentIndex < steps.length - 1 ? (
                <button type="button" onClick={goNext} disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-marine-900 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-marine-800 active:scale-[0.98] disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Salvando…</> : <>Próximo <ArrowRight size={14} /></>}
                </button>
              ) : (
                <motion.button type="submit" disabled={saving} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ boxShadow: '0 4px 16px rgba(227,30,36,0.3)' }}>
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Salvando…</> :
                   saved  ? <><Check size={14} /> Salvo!</> :
                   mode === 'create' ? <>Salvar e adicionar fotos <ArrowRight size={14} /></> :
                   'Salvar alterações'}
                </motion.button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4" style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(10,25,41,0.06)' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">{label}</label>
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

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">{label}</label>
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

function TextArea({ label, value, onChange, rows, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows: number; placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">{label}</label>
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

function PriceField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const display = value ? Number(value).toLocaleString('pt-BR') : ''
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value.replace(/\D/g, ''))
  }
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-marine-600">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-marine-400">R$</span>
        <input
          type="text" inputMode="numeric"
          value={display} onChange={handleChange} placeholder={placeholder}
          className="w-full rounded-xl border border-[#E4E7EB] bg-white py-3 pl-10 pr-4 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10"
        />
      </div>
    </div>
  )
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-marine-100 bg-marine-50 px-4 py-3 transition-colors hover:bg-marine-100">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="h-4 w-4 accent-accent" />
      <span className="text-[13px] font-medium text-marine-800">{label}</span>
    </label>
  )
}
