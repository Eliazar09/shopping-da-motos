import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Gauge, Calendar, Fuel, Settings, Palette, DoorOpen, Check } from 'lucide-react'
import type { Metadata } from 'next'
import { getCarBySlug, getSimilarCars } from '@/lib/queries/cars'
import type { Car } from '@/types'
import CarGallery from '@/components/car/CarGallery'
import SellerCard from '@/components/car/SellerCard'
import CarCard from '@/components/home/CarCard'
import Container from '@/components/ui/Container'
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

  const carName = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const similar = await getSimilarCars(car.id, car.category, 4)

  const specs = [
    { icon: specIcons.km,           label: 'Quilometragem', value: formatKm(car.km) },
    { icon: specIcons.year,         label: 'Ano',           value: `${car.year}/${car.modelYear}` },
    { icon: specIcons.fuel,         label: 'Combustível',   value: FUEL_LABELS[car.fuel]  ?? car.fuel },
    { icon: specIcons.transmission, label: 'Câmbio',        value: TRANSMISSION_LABELS[car.transmission] ?? car.transmission },
    { icon: specIcons.color,        label: 'Cor',           value: car.color },
    { icon: specIcons.doors,        label: 'Portas',        value: String(car.doors) },
  ]

  return (
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

        {/* Similar cars */}
        {similar.length > 0 && (
          <section className="border-t border-gray-200 py-14">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="section-label mb-2">Você também pode gostar</p>
                <h2
                  className="text-[24px] font-bold text-marine-900 md:text-[32px]"
                  style={{ fontFamily: 'var(--font-jakarta)', letterSpacing: '-0.02em' }}
                >
                  Similares
                </h2>
              </div>
              <Link
                href="/estoque"
                className="text-[12px] font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                Ver estoque
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {similar.map((s, i) => (
                <CarCard key={s.id} car={s} index={i} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
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
          style={{ fontFamily: 'var(--font-inter)', fontFeatureSettings: "'tnum' 1", letterSpacing: '-0.02em' }}
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
