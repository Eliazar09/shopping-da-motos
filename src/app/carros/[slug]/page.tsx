import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Gauge, Calendar, Fuel, Settings, Palette, DoorOpen, Check, ArrowRight, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { getCarBySlug, getSimilarCars } from '@/lib/queries/cars'
import type { Car } from '@/types'
import CarGallery from '@/components/car/CarGallery'
import SellerCard from '@/components/car/SellerCard'
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

  const name = buildCarName(car)
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

function buildCarName(car: Car) {
  const brand = car.brand.trim()
  const model = car.model.trim()
  // avoid "Toyota Toyota Corolla" when model already starts with brand
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

function getBadgeStyle(category: string) {
  if (category === 'novo')     return { background: '#0A1929', color: '#fff' }
  if (category === 'seminovo') return { background: '#ffffff', color: '#0A1929', border: '1px solid #E4E7EB' }
  return                              { background: '#B8860B', color: '#fff' }
}

function getBadgeLabel(category: string) {
  if (category === 'novo')     return 'Novo'
  if (category === 'seminovo') return 'Seminovo'
  return 'Repasse'
}

export default async function CarPage({ params }: { params: { slug: string } }) {
  const car = await getCarBySlug(params.slug)
  if (!car) notFound()

  const carName = buildCarName(car)
  const similar = await getSimilarCars(car.id, car.category, 6)

  const specs = [
    { icon: specIcons.km,           label: 'Quilometragem', value: formatKm(car.km) },
    { icon: specIcons.year,         label: 'Ano',           value: `${car.year}/${car.modelYear}` },
    { icon: specIcons.fuel,         label: 'Combustível',   value: FUEL_LABELS[car.fuel]  ?? car.fuel },
    { icon: specIcons.transmission, label: 'Câmbio',        value: TRANSMISSION_LABELS[car.transmission] ?? car.transmission },
    { icon: specIcons.color,        label: 'Cor',           value: car.color },
    { icon: specIcons.doors,        label: 'Portas',        value: String(car.doors) },
  ]

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
            <Link
              href={categoryHref[car.category]}
              className="transition-colors hover:text-marine-900"
            >
              {categoryLabel[car.category]}
            </Link>
            <ChevronRight size={11} className="text-marine-300" />
            <span className="text-marine-900 font-semibold">{carName}</span>
          </nav>

          {/* Status banners */}
          {car.status === 'vendido' && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <p className="text-[13px] font-medium text-accent">
                Este veículo foi vendido. Veja outros disponíveis no estoque.
              </p>
            </div>
          )}
          {car.status === 'reservado' && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-reserved" />
              <p className="text-[13px] font-medium text-yellow-700">
                Este veículo está reservado. Entre em contato para verificar disponibilidade.
              </p>
            </div>
          )}

          {/* 2-col layout */}
          <div className="pb-16 lg:grid lg:grid-cols-[1fr_340px] lg:gap-10">
            {/* Left column */}
            <div>
              <CarGallery images={car.images} alt={carName} />

              {/* Title + price — mobile only */}
              <div className="mt-6 lg:hidden">
                <TitlePriceBlock car={car} carName={carName} />
              </div>

              {/* Specs grid */}
              <section className="mt-10">
                <p className="section-label mb-4">Especificações</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: '#FAFBFC', border: '1px solid #E4E7EB' }}
                    >
                      <Icon size={16} className="mt-0.5 flex-shrink-0 text-marine-500" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-marine-400">{label}</p>
                        <p className="mt-0.5 text-[13px] font-semibold text-marine-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section className="mt-10">
                <p className="section-label mb-4">Opcionais e Equipamentos</p>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {car.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                      <span className="text-[13px] text-marine-700">{f}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Description */}
              <section className="mt-10">
                <p className="section-label mb-4">Sobre este veículo</p>
                <div
                  className="rounded-2xl p-6"
                  style={{ background: '#FAFBFC', border: '1px solid #E4E7EB' }}
                >
                  <p className="text-[14px] leading-relaxed text-marine-600">{car.description}</p>
                </div>
              </section>

              {/* Seller card — mobile */}
              <div className="mt-8 lg:hidden">
                <SellerCard car={car} />
              </div>
            </div>

            {/* Right column (sticky) */}
            <aside className="hidden lg:block">
              <div className="sticky top-[84px] space-y-5">
                <TitlePriceBlock car={car} carName={carName} />
                <SellerCard car={car} />
              </div>
            </aside>
          </div>
        </Container>

        {/* ── Similar cars — estilo Webmotors ─────────────────────── */}
        {similar.length > 0 && (
          <section style={{ background: '#F2F4F7' }} className="py-12 md:py-16">
            {/* Heading */}
            <Container>
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <h2
                  className="text-[20px] font-bold text-marine-900 md:text-[24px]"
                  style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.01em' }}
                >
                  Você também pode gostar
                </h2>
                <Link
                  href="/estoque"
                  className="flex items-center gap-1 text-[12px] font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  Ver todos
                  <ArrowRight size={13} />
                </Link>
              </div>
            </Container>

            {/* Cards — scroll horizontal em mobile, linha no desktop */}
            <div
              className="flex gap-4 overflow-x-auto px-4 md:px-6 pb-2"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {similar.map((s) => (
                <SimilarCarCard key={s.id} car={s} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

function SimilarCarCard({ car }: { car: Car }) {
  const name = buildCarName(car)

  return (
    <Link
      href={`/carros/${car.slug}`}
      className="group flex-shrink-0 overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
      style={{
        width: 'clamp(220px, 55vw, 280px)',
        scrollSnapAlign: 'start',
        border: '1px solid #E4E9F0',
        boxShadow: '0 1px 4px rgba(16,42,67,0.06)',
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image
          src={car.coverImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="280px"
        />
        {car.status === 'vendido' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rotate-[-18deg] border-2 border-white px-3 py-0.5 text-[14px] font-bold tracking-widest text-white">
              VENDIDO
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-3">
        <p
          className="text-[13px] font-bold uppercase leading-snug text-marine-900"
          style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '0.01em' }}
        >
          {car.brand} {car.model}
        </p>
        {car.version && (
          <p className="mt-0.5 truncate text-[11px] text-marine-400">{car.version}</p>
        )}

        <p
          className="mt-3 text-[20px] font-bold text-marine-900"
          style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', fontFeatureSettings: "'tnum' 1" }}
        >
          {car.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
        </p>

        <div className="mt-2 flex items-center justify-between text-[11px] text-marine-400">
          <span>{car.year}/{car.modelYear}</span>
          <span>{car.km === 0 ? '0 km' : `${car.km.toLocaleString('pt-BR')} km`}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-marine-300">
          <MapPin size={10} />
          <span>Roraima</span>
        </div>
      </div>
    </Link>
  )
}

function TitlePriceBlock({ car, carName }: { car: Car; carName: string }) {
  return (
    <div>
      {/* Category badge */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase"
          style={getBadgeStyle(car.category)}
        >
          {getBadgeLabel(car.category)}
        </span>
        {car.featured && (
          <span className="rounded-full border border-accent/30 bg-accent-light px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase text-accent">
            Destaque
          </span>
        )}
      </div>

      <h1
        className="text-[26px] font-bold leading-tight text-marine-900 md:text-[34px]"
        style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
      >
        {carName}
      </h1>
      <p className="mt-1.5 text-[13px] font-medium text-marine-500">
        {car.year}/{car.modelYear} &bull; {car.km === 0 ? '0 km' : `${car.km.toLocaleString('pt-BR')} km`} &bull; {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
      </p>

      {/* Highlights */}
      <div className="mt-3 flex flex-wrap gap-2">
        {car.highlights.map((h) => (
          <span
            key={h}
            className="rounded-lg bg-marine-50 px-3 py-1 text-[11px] font-medium text-marine-700"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="mt-5 flex items-baseline gap-3">
        <span
          className="text-[34px] font-bold text-marine-900 md:text-[38px]"
          style={{ fontFamily: 'var(--font-fraunces)', fontFeatureSettings: "'tnum' 1", letterSpacing: '-0.02em' }}
        >
          {formatPrice(car.price)}
        </span>
        {car.oldPrice && (
          <span className="text-[15px] text-marine-400 line-through">
            {formatPrice(car.oldPrice)}
          </span>
        )}
      </div>
      {car.negotiable && (
        <p className="mt-1 text-[11px] font-medium text-marine-400">
          Aceita negociação · Consulte condições
        </p>
      )}
    </div>
  )
}
