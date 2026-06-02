import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Gauge, Calendar, Fuel, Settings, Palette, DoorOpen, Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getCarBySlug, getSimilarCars } from '@/lib/queries/cars'
import type { Car } from '@/types'
import CarGallery from '@/components/car/CarGallery'
import SellerCard from '@/components/car/SellerCard'
import CarCard from '@/components/home/CarCard'
import Container from '@/components/ui/Container'
import Navbar from '@/components/home/Navbar'
import { FUEL_LABELS, TRANSMISSION_LABELS } from '@/lib/labels'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const car = await getCarBySlug(params.slug)
  if (!car) return {}

  const name = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  return {
    title: car.metaTitle ?? `${name} ${car.year} | Rafael Mota - Toyolex Roraima`,
    description:
      car.metaDescription ??
      `${name} ${car.year} com ${car.km === 0 ? '0km' : car.km.toLocaleString('pt-BR') + 'km'}. ${car.shortDescription} Fale com Rafael Mota.`,
    openGraph: {
      images: [{ url: car.coverImage }],
    },
  }
}

function formatPrice(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatKm(n: number) {
  if (n === 0) return '0 km'
  return `${n.toLocaleString('pt-BR')} km`
}

const categoryLabel: Record<string, string> = {
  novo:     'Novos',
  seminovo: 'Seminovos',
  repasse:  'Repasse',
}

const categoryHref: Record<string, string> = {
  novo:     '/novos',
  seminovo: '/seminovos',
  repasse:  '/repasse',
}

const specIcons = {
  km:           Gauge,
  year:         Calendar,
  fuel:         Fuel,
  transmission: Settings,
  color:        Palette,
  doors:        DoorOpen,
}

function getCategoryBadge(category: string) {
  if (category === 'novo')     return { bg: '#0A1929', color: '#fff',      label: 'Novo'     }
  if (category === 'seminovo') return { bg: '#fff',    color: '#0A1929',   label: 'Seminovo', border: '1px solid #E4E7EB' }
  return                              { bg: '#B8860B', color: '#fff',      label: 'Repasse'  }
}

export default async function CarPage({ params }: { params: { slug: string } }) {
  const car = await getCarBySlug(params.slug)
  if (!car) notFound()

  const carName = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const similar = await getSimilarCars(car.id, car.category, 6)
  const badge   = getCategoryBadge(car.category)

  const specs = [
    { icon: specIcons.km,           label: 'Quilometragem', value: formatKm(car.km) },
    { icon: specIcons.year,         label: 'Ano / Modelo',  value: `${car.year}/${car.modelYear}` },
    { icon: specIcons.fuel,         label: 'Combustível',   value: FUEL_LABELS[car.fuel]  ?? car.fuel },
    { icon: specIcons.transmission, label: 'Câmbio',        value: TRANSMISSION_LABELS[car.transmission] ?? car.transmission },
    { icon: specIcons.color,        label: 'Cor',           value: car.color },
    { icon: specIcons.doors,        label: 'Portas',        value: `${car.doors} portas` },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* ── Dark breadcrumb header strip ─────────────────────────── */}
        <div
          className="relative overflow-hidden pt-[64px]"
          style={{ background: 'linear-gradient(120deg, #080f1a 0%, #0d1f38 100%)' }}
        >
          {/* dot texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(rgba(200,151,58,1) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />
          {/* subtle red glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full opacity-25 blur-3xl" style={{ background: '#E31E24' }} />

          <Container>
            <div className="relative z-10 py-5 md:py-7">
              {/* Breadcrumb */}
              <nav className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-white/40">
                <Link href="/" className="transition-colors hover:text-white/80">Início</Link>
                <ChevronRight size={10} />
                <Link href="/estoque" className="transition-colors hover:text-white/80">Estoque</Link>
                <ChevronRight size={10} />
                <Link href={categoryHref[car.category]} className="transition-colors hover:text-white/80">{categoryLabel[car.category]}</Link>
                <ChevronRight size={10} />
                <span className="text-white/70">{carName}</span>
              </nav>

              {/* Car name + category on desktop breadcrumb bar */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase"
                  style={{ background: badge.bg, color: badge.color, border: (badge as {border?: string}).border }}
                >
                  {badge.label}
                </span>
                {car.featured && (
                  <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-amber-400">
                    Destaque
                  </span>
                )}
                <h1
                  className="text-[18px] font-bold text-white md:text-[22px]"
                  style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
                >
                  {carName}
                </h1>
                <span className="hidden text-white/40 md:inline">·</span>
                <span className="hidden text-[14px] font-bold text-[#C8973A] md:inline" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  {formatPrice(car.price)}
                </span>
              </div>
            </div>
          </Container>
        </div>

        {/* ── Status banners ───────────────────────────────────────── */}
        {(car.status === 'vendido' || car.status === 'reservado') && (
          <div className="border-b" style={{ background: car.status === 'vendido' ? '#FFF1F1' : '#FFFBEB', borderColor: car.status === 'vendido' ? '#FECACA' : '#FDE68A' }}>
            <Container>
              <div className="flex items-center gap-2 py-3">
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: car.status === 'vendido' ? '#E31E24' : '#D97706' }} />
                <p className="text-[12px] font-medium" style={{ color: car.status === 'vendido' ? '#B91C1C' : '#92400E' }}>
                  {car.status === 'vendido'
                    ? 'Este veículo foi vendido. Veja outros disponíveis no estoque.'
                    : 'Este veículo está reservado. Entre em contato para verificar disponibilidade.'}
                </p>
              </div>
            </Container>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────── */}
        <Container>
          <div className="pb-16 pt-8 lg:grid lg:grid-cols-[1fr_340px] lg:gap-12 lg:pt-10">

            {/* ── Left column ── */}
            <div>
              {/* Gallery */}
              <div className="overflow-hidden rounded-2xl">
                <CarGallery images={car.images} alt={carName} />
              </div>

              {/* Title + price block — mobile */}
              <div className="mt-7 lg:hidden">
                <TitlePriceBlock car={car} carName={carName} />
              </div>

              {/* ── Specs ── */}
              <section className="mt-10">
                <SectionLabel>Especificações técnicas</SectionLabel>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="group relative overflow-hidden rounded-2xl p-4 transition-all"
                      style={{ background: '#0A1929', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {/* subtle red dot top-right */}
                      <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full opacity-60" style={{ background: '#E31E24' }} />
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(200,151,58,0.12)' }}>
                        <Icon size={15} style={{ color: '#C8973A' }} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</p>
                      <p className="mt-0.5 text-[13px] font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Features ── */}
              {car.features.length > 0 && (
                <section className="mt-10">
                  <SectionLabel>Opcionais e Equipamentos</SectionLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {car.features.map((f) => (
                      <span
                        key={f}
                        className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-medium"
                        style={{ background: '#F0F4F8', color: '#1e3a5f', border: '1px solid #E4EAF0' }}
                      >
                        <Check size={12} className="flex-shrink-0" style={{ color: '#E31E24' }} />
                        {f}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Description ── */}
              {car.description && (
                <section className="mt-10">
                  <SectionLabel>Sobre este veículo</SectionLabel>
                  <div
                    className="mt-4 rounded-2xl p-6"
                    style={{ background: '#F8FAFC', border: '1px solid #E8EDF2' }}
                  >
                    {/* accent line */}
                    <div className="mb-4 h-[2px] w-12 rounded-full" style={{ background: '#E31E24' }} />
                    <p className="text-[14px] leading-relaxed" style={{ color: '#3D5166' }}>{car.description}</p>
                  </div>
                </section>
              )}

              {/* Seller card — mobile */}
              <div className="mt-8 lg:hidden">
                <SellerCard car={car} />
              </div>
            </div>

            {/* ── Right column (sticky) ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-[84px] space-y-5">
                <TitlePriceBlock car={car} carName={carName} />
                <SellerCard car={car} />
              </div>
            </aside>
          </div>
        </Container>

        {/* ── Similar cars — full-width dark section ───────────────── */}
        {similar.length > 0 && (
          <section style={{ background: '#080f1a' }}>
            {/* top edge accent */}
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #E31E24 0%, #C8973A 50%, transparent 100%)' }} />

            <div className="relative overflow-hidden py-16 md:py-20">
              {/* dot grid bg */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(rgba(200,151,58,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
              />
              {/* glow */}
              <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full opacity-10 blur-3xl" style={{ background: '#E31E24' }} />
              <div className="pointer-events-none absolute right-0 bottom-0 h-60 w-60 rounded-full opacity-08 blur-3xl" style={{ background: '#C8973A' }} />

              <Container>
                {/* Section heading */}
                <div className="relative z-10 mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#C8973A' }}>
                      Você também pode gostar
                    </p>
                    <h2
                      className="text-[28px] font-bold leading-none text-white md:text-[38px]"
                      style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.03em' }}
                    >
                      Veículos <span style={{ color: '#E31E24' }}>similares</span>
                    </h2>
                  </div>
                  <Link
                    href="/estoque"
                    className="flex items-center gap-1.5 text-[12px] font-bold transition-colors"
                    style={{ color: '#C8973A' }}
                  >
                    Ver estoque completo
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </Container>

              {/* Horizontal scroll on mobile, grid on desktop */}
              <div className="relative z-10">
                {/* Mobile: horizontal scroll */}
                <div
                  className="flex gap-4 overflow-x-auto px-4 pb-4 lg:hidden"
                  style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {similar.map((s, i) => (
                    <div
                      key={s.id}
                      className="w-[72vw] max-w-[280px] flex-shrink-0"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <CarCard car={s} index={i} />
                    </div>
                  ))}
                </div>

                {/* Desktop: contained grid */}
                <Container>
                  <div className="hidden grid-cols-3 gap-5 lg:grid xl:grid-cols-4">
                    {similar.slice(0, 4).map((s, i) => (
                      <CarCard key={s.id} car={s} index={i} />
                    ))}
                  </div>
                </Container>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[3px] w-5 rounded-full flex-shrink-0" style={{ background: '#E31E24' }} />
      <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: '#6B7E8F' }}>
        {children}
      </p>
    </div>
  )
}

function TitlePriceBlock({ car, carName }: { car: Car; carName: string }) {
  const badge = getCategoryBadge(car.category)

  return (
    <div className="rounded-2xl p-6" style={{ background: '#F8FAFC', border: '1px solid #E8EDF2' }}>
      {/* Badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase"
          style={{ background: badge.bg, color: badge.color, border: (badge as {border?: string}).border }}
        >
          {badge.label}
        </span>
        {car.featured && (
          <span className="rounded-full border border-amber-400/50 bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-amber-600">
            Destaque
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        className="text-[24px] font-bold leading-tight text-marine-900 md:text-[30px]"
        style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.025em' }}
      >
        {carName}
      </h1>

      {/* Sub info */}
      <p className="mt-2 text-[13px] font-medium" style={{ color: '#6B7E8F' }}>
        {car.year}/{car.modelYear}
        <span className="mx-2 text-gray-300">·</span>
        {car.km === 0 ? '0 km' : `${car.km.toLocaleString('pt-BR')} km`}
        <span className="mx-2 text-gray-300">·</span>
        {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
      </p>

      {/* Highlights */}
      {car.highlights.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {car.highlights.map((h) => (
            <span
              key={h}
              className="rounded-lg px-2.5 py-1 text-[11px] font-medium"
              style={{ background: '#EDF2F7', color: '#2D4A6A' }}
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="my-5 h-px" style={{ background: '#E8EDF2' }} />

      {/* Price */}
      <div>
        {car.oldPrice && (
          <p className="mb-1 text-[13px] text-marine-400 line-through">
            {formatPrice(car.oldPrice)}
          </p>
        )}
        <span
          className="text-[36px] font-black leading-none text-marine-900"
          style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.03em', fontFeatureSettings: "'tnum' 1" }}
        >
          {formatPrice(car.price)}
        </span>
        {car.negotiable && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#C8973A' }}>
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: '#C8973A' }} />
            Aceita negociação · Consulte condições
          </p>
        )}
      </div>
    </div>
  )
}
