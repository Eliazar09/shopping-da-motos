import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight, Gauge, Calendar, Fuel, Settings, Palette, Zap,
  Check, ArrowRight, MapPin, CreditCard, Gift, CalendarDays,
} from 'lucide-react'
import type { Metadata } from 'next'
import { getCarBySlug, getSimilarCars } from '@/lib/queries/cars'
import type { Car } from '@/types'
import CarGallery from '@/components/car/CarGallery'
import SellerCard from '@/components/car/SellerCard'
import Container from '@/components/ui/Container'
import Navbar from '@/components/home/Navbar'
import { FUEL_LABELS, TRANSMISSION_LABELS, CATEGORY_LABELS } from '@/lib/labels'
import type React from 'react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const car = await getCarBySlug(params.slug)
  if (!car) return {}

  if (car.category === 'consorcio') {
    const title = car.consorcioTipoGrupo ?? car.model
    return {
      title: `Consórcio ${title} | Shopping das Motos — Boa Vista, Roraima`,
      description: `Consórcio de moto ${title}. Parcela a partir de ${car.consorcioValorParcela ? `R$ ${car.consorcioValorParcela.toLocaleString('pt-BR')}` : 'consulte'}. Fale com a gente!`,
    }
  }

  if (car.category === 'entregas') {
    return {
      title: `${car.entregaVeiculo ?? car.model} — Entregue para ${car.entregaClienteNome} | Shopping das Motos`,
      description: `Entrega da ${car.entregaVeiculo ?? car.model} para ${car.entregaClienteNome}. Sonho realizado no Shopping das Motos — Boa Vista, Roraima.`,
      openGraph: { images: [{ url: car.coverImage }] },
    }
  }

  const name = buildCarName(car)
  return {
    title: car.metaTitle ?? `${name} ${car.year} | Shopping das Motos — Boa Vista, Roraima`,
    description: car.metaDescription ?? `${name} ${car.year} com ${car.km === 0 ? '0km' : car.km.toLocaleString('pt-BR') + 'km'}. ${car.shortDescription} Fale com a gente!`,
    openGraph: { images: [{ url: car.coverImage }] },
  }
}

function buildCarName(car: Car) {
  const brand = car.brand.trim()
  const model = car.model.trim()
  const modelPart = model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`
  return car.version ? `${modelPart} ${car.version}` : modelPart
}

function formatPrice(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
function formatKm(n: number) {
  if (n === 0) return '0 km'
  return `${n.toLocaleString('pt-BR')} km`
}
function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const categoryLabel: Record<string, string> = {
  novo:           'Novos',
  seminovo:       'Seminovos',
  'venda-direta': 'Venda Direta',
  consorcio:      'Consórcios',
  repasse:        'Repasse',
  entregas:       'Entregas',
}
const categoryHref: Record<string, string> = {
  novo:           '/estoque?categoria=novo',
  seminovo:       '/estoque?categoria=seminovo',
  'venda-direta': '/estoque?categoria=venda-direta',
  consorcio:      '/estoque?categoria=consorcio',
  repasse:        '/estoque?categoria=repasse',
  entregas:       '/estoque?categoria=entregas',
}

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  novo:           { background: '#0D0D0F', color: '#fff' },
  seminovo:       { background: '#ffffff', color: '#0D0D0F', border: '1px solid #E4E7EB' },
  'venda-direta': { background: '#1a6b3c', color: '#fff' },
  consorcio:      { background: '#1a4d8f', color: '#fff' },
  repasse:        { background: '#B8860B', color: '#fff' },
  entregas:       { background: '#6C3FF5', color: '#fff' },
}

function getBadgeStyle(category: string): React.CSSProperties {
  return BADGE_STYLES[category] ?? { background: '#6B7280', color: '#fff' }
}

export default async function MotoPage({ params }: { params: { slug: string } }) {
  const car = await getCarBySlug(params.slug)
  if (!car) notFound()

  const isConsorcio = car.category === 'consorcio'
  const isEntrega   = car.category === 'entregas'
  const isCar       = !isConsorcio && !isEntrega

  const carName   = buildCarName(car)
  const pageTitle = isConsorcio
    ? (car.consorcioTipoGrupo ?? car.model)
    : isEntrega
    ? (car.entregaVeiculo ?? car.model)
    : carName

  const similar = await getSimilarCars(car.id, car.category, 6)

  const specs = isCar ? [
    { icon: Gauge,     label: 'Quilometragem', value: formatKm(car.km) },
    { icon: Calendar,  label: 'Ano',           value: `${car.year}/${car.modelYear}` },
    { icon: Fuel,      label: 'Combustível',   value: car.fuel ? (FUEL_LABELS[car.fuel] ?? car.fuel) : '—' },
    { icon: Settings,  label: 'Câmbio',        value: car.transmission ? (TRANSMISSION_LABELS[car.transmission] ?? car.transmission) : '—' },
    { icon: Palette,   label: 'Cor',           value: car.color ?? '—' },
    { icon: Zap,       label: 'Cilindradas',    value: car.doors != null ? `${car.doors} cc` : '—' },
  ] : []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[64px]">
        <Container>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 py-5 text-[12px] font-medium text-marine-500">
            <Link href="/" className="transition-colors hover:text-marine-900">Início</Link>
            <ChevronRight size={11} className="text-marine-300" />
            <Link href="/estoque" className="transition-colors hover:text-marine-900">Estoque</Link>
            <ChevronRight size={11} className="text-marine-300" />
            <Link href={categoryHref[car.category] ?? '/estoque'} className="transition-colors hover:text-marine-900">
              {categoryLabel[car.category]}
            </Link>
            <ChevronRight size={11} className="text-marine-300" />
            <span className="text-marine-900 font-semibold">{pageTitle}</span>
          </nav>

          {/* Status banners */}
          {isCar && car.status === 'vendido' && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <p className="text-[13px] font-medium text-accent">Esta moto foi vendida. Veja outras disponíveis no estoque.</p>
            </div>
          )}
          {isCar && car.status === 'reservado' && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-reserved" />
              <p className="text-[13px] font-medium text-yellow-700">Esta moto está reservada.</p>
            </div>
          )}

          {/* 2-col layout */}
          <div className="pb-16 lg:grid lg:grid-cols-[1fr_340px] lg:gap-10">
            {/* Left column */}
            <div>
              <CarGallery images={car.images} alt={pageTitle} />

              {/* Title block — mobile only */}
              <div className="mt-6 lg:hidden">
                {isCar       && <TitlePriceBlock car={car} carName={carName} />}
                {isConsorcio && <ConsorcioTitleBlock car={car} />}
                {isEntrega   && <EntregaTitleBlock   car={car} />}
              </div>

              {/* ── CAR sections ─────────────────────────────── */}
              {isCar && (
                <>
                  <section className="mt-10">
                    <p className="section-label mb-4">Especificações</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {specs.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3 rounded-xl p-4" style={{ background: '#FAFBFC', border: '1px solid #E4E7EB' }}>
                          <Icon size={16} className="mt-0.5 flex-shrink-0 text-marine-500" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-marine-400">{label}</p>
                            <p className="mt-0.5 text-[13px] font-semibold text-marine-900">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {car.features.length > 0 && (
                    <section className="mt-10">
                      <p className="section-label mb-4">Opcionais e Equipamentos</p>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                        {car.features.map(f => (
                          <div key={f} className="flex items-start gap-2.5">
                            <Check size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                            <span className="text-[13px] text-marine-700">{f}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {car.description && (
                    <section className="mt-10">
                      <p className="section-label mb-4">Sobre esta moto</p>
                      <div className="rounded-2xl p-6" style={{ background: '#FAFBFC', border: '1px solid #E4E7EB' }}>
                        <p className="text-[14px] leading-relaxed text-marine-600">{car.description}</p>
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* ── CONSÓRCIO section ─────────────────────────── */}
              {isConsorcio && <ConsorcioDetailsSection car={car} />}

              {/* ── ENTREGA section ───────────────────────────── */}
              {isEntrega && <EntregaDetailsSection car={car} />}

              {/* Seller card — mobile */}
              <div className="mt-8 lg:hidden">
                <SellerCard car={car} />
              </div>
            </div>

            {/* Right column (sticky) */}
            <aside className="hidden lg:block">
              <div className="sticky top-[84px] space-y-5">
                {isCar       && <TitlePriceBlock     car={car} carName={carName} />}
                {isConsorcio && <ConsorcioTitleBlock  car={car} />}
                {isEntrega   && <EntregaTitleBlock    car={car} />}
                <SellerCard car={car} />
              </div>
            </aside>
          </div>
        </Container>

        {/* Similar */}
        {similar.length > 0 && (
          <section style={{ background: '#F2F4F7' }} className="py-12 md:py-16">
            <Container>
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[20px] font-bold text-marine-900 md:text-[24px]" style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '0.01em' }}>
                  {isConsorcio ? 'Outros consórcios' : isEntrega ? 'Outras entregas' : 'Você também pode gostar'}
                </h2>
                <Link href="/estoque" className="flex items-center gap-1 text-[12px] font-semibold text-accent transition-colors hover:text-accent-hover">
                  Ver todos <ArrowRight size={13} />
                </Link>
              </div>
            </Container>
            <div className="flex gap-4 overflow-x-auto px-4 md:px-6 pb-2" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              {similar.map(s => <SimilarCarCard key={s.id} car={s} />)}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

// ── Car title block ────────────────────────────────────────────────────────
function TitlePriceBlock({ car, carName }: { car: Car; carName: string }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase" style={getBadgeStyle(car.category)}>
          {CATEGORY_LABELS[car.category] ?? car.category}
        </span>
        {car.featured && (
          <span className="rounded-full border border-accent/30 bg-accent-light px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase text-accent">Destaque</span>
        )}
      </div>
      <h1 className="text-[26px] font-bold leading-tight text-marine-900 md:text-[34px]" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
        {carName}
      </h1>
      <p className="mt-1.5 text-[13px] font-medium text-marine-500">
        {car.year}/{car.modelYear} &bull; {car.km === 0 ? '0 km' : `${car.km.toLocaleString('pt-BR')} km`}
        {car.transmission && <> &bull; {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}</>}
      </p>
      {car.highlights.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {car.highlights.map(h => (
            <span key={h} className="rounded-lg bg-marine-50 px-3 py-1 text-[11px] font-medium text-marine-700">{h}</span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-[34px] font-bold text-marine-900 md:text-[38px]" style={{ fontFamily: 'var(--font-oswald)', fontFeatureSettings: "'tnum' 1", letterSpacing: '0.01em' }}>
          {formatPrice(car.price)}
        </span>
        {car.oldPrice && <span className="text-[15px] text-marine-400 line-through">{formatPrice(car.oldPrice)}</span>}
      </div>
      {car.negotiable && <p className="mt-1 text-[11px] font-medium text-marine-400">Aceita negociação · Consulte condições</p>}
    </div>
  )
}

// ── Consórcio title block ──────────────────────────────────────────────────
function ConsorcioTitleBlock({ car }: { car: Car }) {
  const title = car.consorcioTipoGrupo ?? car.model
  return (
    <div>
      <div className="mb-3">
        <span className="rounded-full bg-[#1a4d8f] px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase text-white">
          Consórcio
        </span>
      </div>
      <h1 className="text-[26px] font-bold leading-tight text-marine-900 md:text-[34px]" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
        {title}
      </h1>
      {car.consorcioValorParcela && (
        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-[34px] font-bold text-marine-900 md:text-[38px]" style={{ fontFamily: 'var(--font-oswald)', fontFeatureSettings: "'tnum' 1", letterSpacing: '0.01em' }}>
              {formatPrice(car.consorcioValorParcela)}
            </span>
            <span className="text-[15px] text-marine-400">/mês</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-[12px] text-marine-500">
            {car.consorcioPrazo    && <span>{car.consorcioPrazo} meses</span>}
            {car.consorcioValorCarta && <span>Carta: {formatPrice(car.consorcioValorCarta)}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Entrega title block ────────────────────────────────────────────────────
function EntregaTitleBlock({ car }: { car: Car }) {
  const veiculo = car.entregaVeiculo ?? car.model
  const cliente = car.entregaClienteNome ?? ''
  const data    = car.entregaData ? formatDate(car.entregaData) : ''
  return (
    <div>
      <div className="mb-3">
        <span className="rounded-full bg-[#6C3FF5] px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase text-white">
          Entregue com sucesso!
        </span>
      </div>
      <h1 className="text-[26px] font-bold leading-tight text-marine-900 md:text-[34px]" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}>
        {veiculo}
      </h1>
      {(cliente || data) && (
        <p className="mt-2 text-[14px] text-marine-600">
          {cliente && <>Entregue para <strong>{cliente}</strong></>}
          {cliente && data && ' · '}
          {data}
        </p>
      )}
    </div>
  )
}

// ── Consórcio detail section ───────────────────────────────────────────────
function ConsorcioDetailsSection({ car }: { car: Car }) {
  const rows = [
    car.consorcioValorCarta   && ['Valor da carta',      formatPrice(car.consorcioValorCarta)],
    car.consorcioValorParcela && ['Parcela mensal',       formatPrice(car.consorcioValorParcela)],
    car.consorcioPrazo        && ['Prazo',                `${car.consorcioPrazo} meses`],
    car.consorcioTaxaAdmin    && ['Taxa administrativa',  car.consorcioTaxaAdmin],
    car.consorcioFundoReserva && ['Fundo de reserva',     car.consorcioFundoReserva],
    car.consorcioAssembleia   && ['Assembleia',           car.consorcioAssembleia],
    car.consorcioDiaVencimento && ['1º vencimento',       car.consorcioDiaVencimento],
    car.consorcioCashback     && ['Cashback',              formatPrice(car.consorcioCashback!)],
  ].filter(Boolean) as [string, string][]

  return (
    <section className="mt-10">
      <p className="section-label mb-4">Condições do Consórcio</p>
      <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid #E4E7EB' }}>
        {rows.map(([label, value], i) => (
          <div key={label} className={`flex items-center justify-between px-5 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}`}>
            <span className="text-[13px] font-medium text-marine-500">{label}</span>
            <span className="text-[14px] font-bold text-marine-900">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3" style={{ border: '1px solid #bfdbfe' }}>
        <CreditCard size={16} className="flex-shrink-0 text-blue-600" />
        <p className="text-[13px] font-medium text-blue-700">
          Entre em contato conosco para obter todas as condições e realizar sua adesão.
        </p>
      </div>
    </section>
  )
}

// ── Entrega detail section ─────────────────────────────────────────────────
function EntregaDetailsSection({ car }: { car: Car }) {
  const cliente = car.entregaClienteNome ?? ''
  const veiculo = car.entregaVeiculo ?? car.model
  const data    = car.entregaData ? formatDate(car.entregaData) : ''
  const rows = [
    cliente && ['Cliente',  cliente],
    veiculo && ['Moto',     veiculo],
    data    && ['Data',     data],
  ].filter(Boolean) as [string, string][]

  return (
    <>
      {rows.length > 0 && (
        <section className="mt-10">
          <p className="section-label mb-4">Detalhes da entrega</p>
          <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid #E4E7EB' }}>
            {rows.map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between px-5 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}`}>
                <span className="text-[13px] font-medium text-marine-500">{label}</span>
                <span className="text-[14px] font-bold text-marine-900">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {car.description && (
        <section className="mt-8">
          <p className="section-label mb-4">Depoimento</p>
          <div className="relative rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)', border: '1px solid #ddd6fe' }}>
            <Gift size={20} className="mb-3 text-[#6C3FF5]" />
            <p className="text-[15px] italic leading-relaxed text-marine-700">&ldquo;{car.description}&rdquo;</p>
            {cliente && <p className="mt-3 text-[12px] font-semibold text-marine-500">— {cliente}</p>}
          </div>
        </section>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-3" style={{ border: '1px solid #e9d5ff' }}>
        <CalendarDays size={16} className="flex-shrink-0 text-purple-600" />
        <p className="text-[13px] font-medium text-purple-700">
          Quer realizar o seu sonho também? Fale conosco e encontre a moto ideal para você.
        </p>
      </div>
    </>
  )
}

// ── Similar moto card ──────────────────────────────────────────────────────
function SimilarCarCard({ car }: { car: Car }) {
  const isConsorcio = car.category === 'consorcio'
  const isEntrega   = car.category === 'entregas'
  const title = isConsorcio
    ? (car.consorcioTipoGrupo ?? car.model)
    : isEntrega
    ? (car.entregaVeiculo ?? car.model)
    : buildCarName(car)

  return (
    <Link
      href={`/motos/${car.slug}`}
      className="group flex-shrink-0 overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
      style={{ width: 'clamp(220px, 55vw, 280px)', scrollSnapAlign: 'start', border: '1px solid #E4E9F0', boxShadow: '0 1px 4px rgba(13,13,15,0.06)' }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image
          src={car.coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="280px"
        />
        {!isConsorcio && !isEntrega && car.status === 'vendido' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rotate-[-18deg] border-2 border-white px-3 py-0.5 text-[14px] font-bold tracking-widest text-white">VENDIDO</span>
          </div>
        )}
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-[13px] font-bold uppercase leading-snug text-marine-900" style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '0.01em' }}>
          {isConsorcio || isEntrega ? title : `${car.brand} ${car.model}`}
        </p>
        {!isConsorcio && !isEntrega && car.version && (
          <p className="mt-0.5 truncate text-[11px] text-marine-400">{car.version}</p>
        )}

        {isConsorcio && car.consorcioValorParcela ? (
          <div className="mt-2">
            <p className="text-[18px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)', fontFeatureSettings: "'tnum' 1" }}>
              {formatPrice(car.consorcioValorParcela)}<span className="text-[11px] text-marine-400 font-normal">/mês</span>
            </p>
            {car.consorcioPrazo && <p className="text-[11px] text-marine-400">{car.consorcioPrazo} meses</p>}
          </div>
        ) : isEntrega ? (
          <div className="mt-2">
            {car.entregaClienteNome && <p className="text-[12px] font-medium text-marine-600">{car.entregaClienteNome}</p>}
            {car.entregaData && <p className="text-[11px] text-marine-400">{new Date(car.entregaData + 'T00:00:00').toLocaleDateString('pt-BR')}</p>}
          </div>
        ) : (
          <>
            <p className="mt-3 text-[20px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em', fontFeatureSettings: "'tnum' 1" }}>
              {car.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-marine-400">
              <span>{car.year}/{car.modelYear}</span>
              <span>{car.km === 0 ? '0 km' : `${car.km.toLocaleString('pt-BR')} km`}</span>
            </div>
          </>
        )}

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-marine-300">
          <MapPin size={10} />
          <span>Roraima</span>
        </div>
      </div>
    </Link>
  )
}
