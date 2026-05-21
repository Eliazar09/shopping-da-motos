import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Gauge, Calendar, Fuel, Settings, Palette, DoorOpen, Check } from 'lucide-react'
import type { Metadata } from 'next'
import { cars } from '@/lib/mock-data'
import { getSimilarCars } from '@/lib/filters'
import CarGallery from '@/components/car/CarGallery'
import SellerCard from '@/components/car/SellerCard'
import CarCard from '@/components/home/CarCard'
import Container from '@/components/ui/Container'

export async function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const car = cars.find((c) => c.slug === params.slug)
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
  novo: 'Novos',
  seminovo: 'Seminovos',
  repasse: 'Repasse',
}

const categoryHref: Record<string, string> = {
  novo: '/novos',
  seminovo: '/seminovos',
  repasse: '/repasse',
}

const specIcons = {
  km: Gauge,
  year: Calendar,
  fuel: Fuel,
  transmission: Settings,
  color: Palette,
  doors: DoorOpen,
}

export default function CarPage({ params }: { params: { slug: string } }) {
  const car = cars.find((c) => c.slug === params.slug)
  if (!car) notFound()

  const carName = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''}`
  const similar = getSimilarCars(cars, car, 4)

  const specs = [
    { icon: specIcons.km, label: 'Quilometragem', value: formatKm(car.km) },
    { icon: specIcons.year, label: 'Ano', value: `${car.year}/${car.modelYear}` },
    { icon: specIcons.fuel, label: 'Combustível', value: car.fuel },
    { icon: specIcons.transmission, label: 'Câmbio', value: car.transmission },
    { icon: specIcons.color, label: 'Cor', value: car.color },
    { icon: specIcons.doors, label: 'Portas', value: String(car.doors) },
  ]

  return (
    <main className="min-h-screen bg-bg-primary pt-[60px]">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-4 text-[10px] font-medium tracking-wide text-text-muted">
          <Link href="/" className="hover:text-white transition-colors">Início</Link>
          <ChevronRight size={10} />
          <Link href="/estoque" className="hover:text-white transition-colors">Estoque</Link>
          <ChevronRight size={10} />
          <Link
            href={categoryHref[car.category]}
            className="hover:text-white transition-colors"
          >
            {categoryLabel[car.category]}
          </Link>
          <ChevronRight size={10} />
          <span className="text-text-secondary">{carName}</span>
        </nav>

        {/* Status banners */}
        {car.status === 'vendido' && (
          <div className="mb-4 flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <p className="text-[12px] font-medium text-red-400">
              Este veículo foi vendido. Veja outros disponíveis no estoque.
            </p>
          </div>
        )}
        {car.status === 'reservado' && (
          <div className="mb-4 flex items-center gap-2 border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <p className="text-[12px] font-medium text-yellow-400">
              Este veículo está reservado. Entre em contato para verificar disponibilidade.
            </p>
          </div>
        )}

        {/* 2-col layout */}
        <div className="pb-16 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Left column */}
          <div>
            {/* Gallery */}
            <CarGallery images={car.images} alt={carName} />

            {/* Title + price — mobile only */}
            <div className="mt-5 lg:hidden">
              <TitlePriceBlock car={car} carName={carName} />
            </div>

            {/* Specs grid */}
            <section className="mt-8">
              <h2 className="section-label mb-4">Especificações</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-sm p-3.5"
                    style={{ background: '#122038', border: '1px solid #1A2B47' }}
                  >
                    <Icon size={16} className="mt-0.5 flex-shrink-0 text-accent-red" />
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-wider text-text-muted">{label}</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="mt-8">
              <h2 className="section-label mb-4">Opcionais e Equipamentos</h2>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={13} className="mt-0.5 flex-shrink-0 text-accent-red" />
                    <span className="text-[12px] text-text-secondary">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="mt-8">
              <h2 className="section-label mb-4">Sobre este veículo</h2>
              <div
                className="rounded-sm p-5"
                style={{ background: '#122038', border: '1px solid #1A2B47' }}
              >
                <p className="text-[13px] leading-relaxed text-text-secondary">{car.description}</p>
              </div>
            </section>

            {/* Seller card — mobile only */}
            <div className="mt-8 lg:hidden">
              <SellerCard car={car} />
            </div>
          </div>

          {/* Right column (sticky sidebar — desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-[80px] space-y-4">
              <TitlePriceBlock car={car} carName={carName} />
              <SellerCard car={car} />
            </div>
          </aside>
        </div>

        {/* Similar cars */}
        {similar.length > 0 && (
          <section className="border-t border-bg-tertiary py-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="section-label mb-2">VOCÊ TAMBÉM PODE GOSTAR</p>
                <h2
                  className="font-anton text-[24px] leading-none text-white md:text-[32px]"
                  style={{ fontFamily: 'var(--font-anton)' }}
                >
                  Similares
                </h2>
              </div>
              <Link
                href="/estoque"
                className="text-[11px] font-bold tracking-[0.1em] text-accent-red hover:underline"
              >
                VER ESTOQUE
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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

function TitlePriceBlock({ car, carName }: { car: (typeof cars)[0]; carName: string }) {
  return (
    <div>
      {/* Category badge */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="px-2.5 py-1 text-[9px] font-bold tracking-[0.12em]"
          style={
            car.category === 'novo'
              ? { background: '#E50914', color: '#fff' }
              : car.category === 'seminovo'
                ? { background: '#fff', color: '#000' }
                : { background: '#FFA500', color: '#000' }
          }
        >
          {car.category === 'novo' ? 'NOVO' : car.category === 'seminovo' ? 'SEMINOVO' : 'REPASSE'}
        </span>
        {car.featured && (
          <span className="border border-accent-red/30 px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-accent-red">
            DESTAQUE
          </span>
        )}
      </div>

      <h1
        className="font-anton text-[28px] leading-none text-white md:text-[36px]"
        style={{ fontFamily: 'var(--font-anton)' }}
      >
        {carName}
      </h1>
      <p className="mt-1 text-[12px] font-medium text-text-muted">
        {car.year}/{car.modelYear} &bull; {car.km === 0 ? '0km' : `${car.km.toLocaleString('pt-BR')}km`} &bull; {car.transmission}
      </p>

      {/* Highlights */}
      <div className="mt-3 flex flex-wrap gap-2">
        {car.highlights.map((h) => (
          <span
            key={h}
            className="border border-bg-tertiary px-2.5 py-1 text-[9px] font-medium text-text-muted"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-inter text-[32px] font-extrabold text-accent-red md:text-[36px]">
          {formatPrice(car.price)}
        </span>
        {car.oldPrice && (
          <span className="text-[14px] text-text-muted line-through">
            {formatPrice(car.oldPrice)}
          </span>
        )}
      </div>
      {car.negotiable && (
        <p className="mt-1 text-[10px] font-medium tracking-wide text-text-muted">
          Aceita negociação · Consulte condições
        </p>
      )}
    </div>
  )
}
