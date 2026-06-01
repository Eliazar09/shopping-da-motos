import { createDynamicServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Car, Pencil, Gauge, Settings2, Calendar, CheckCircle } from 'lucide-react'
import CarFilters from './_components/CarFilters'
import DeleteCarButton from './_components/DeleteCarButton'
import { TRANSMISSION_LABELS, CATEGORY_LABELS } from '@/lib/labels'

type SP = { status?: string; category?: string; sort?: string; q?: string }

function formatPrice(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
function formatKm(n: number) {
  return n === 0 ? '0 km' : `${n.toLocaleString('pt-BR')} km`
}

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  disponivel: { label: 'Disponível', bg: '#D1FAE5', color: '#059669' },
  reservado:  { label: 'Reservado',  bg: '#FEF3C7', color: '#D97706' },
  vendido:    { label: 'Vendido',    bg: '#F1F5F9', color: '#94A3B8' },
}

export default async function CarrosPage({ searchParams }: { searchParams: SP }) {
  const supabase = createDynamicServerClient()

  const { data: allCars } = await supabase.from('cars').select('status')
  const totalCars     = allCars?.length ?? 0
  const availableCars = allCars?.filter(c => c.status === 'disponivel').length ?? 0
  const soldCars      = allCars?.filter(c => c.status === 'vendido').length ?? 0
  const reservedCars  = allCars?.filter(c => c.status === 'reservado').length ?? 0

  // eslint-disable-next-line prefer-const
  let query = supabase
    .from('cars')
    .select('id,brand,model,version,year,category,status,price,km,transmission,cover_image,images,created_at')

  if (searchParams.status && searchParams.status !== 'todos')
    query = query.eq('status', searchParams.status)
  if (searchParams.category && searchParams.category !== 'todos')
    query = query.eq('category', searchParams.category)
  if (searchParams.q) {
    const q = searchParams.q
    query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%,version.ilike.%${q}%`)
  }

  switch (searchParams.sort) {
    case 'oldest':     query = query.order('created_at', { ascending: true });  break
    case 'price_desc': query = query.order('price',      { ascending: false }); break
    case 'price_asc':  query = query.order('price',      { ascending: true });  break
    case 'km_asc':     query = query.order('km',         { ascending: true });  break
    default:           query = query.order('created_at', { ascending: false })
  }

  const { data: cars, error } = await query.limit(200)

  return (
    <div style={{ minHeight: '100%', background: '#F5F6FA', padding: 24 }}>

      {/* ── Header ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A0BADC' }}>
            Catálogo
          </p>
          <h1 style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: '#0A1929', fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}>
            Carros{cars && <span style={{ marginLeft: 8, fontSize: 16, fontWeight: 400, color: '#A0BADC' }}>({cars.length})</span>}
          </h1>
        </div>
        <Link
          href="/admin/carros/novo"
          style={{
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
            background: '#E31E24', color: '#fff', borderRadius: 12,
            padding: '10px 16px', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(227,30,36,0.25)',
          }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Novo Carro</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      {/* ── Mini stats ──────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {[
          { label: `${totalCars} total`,           icon: Car,         color: '#0A1929' },
          { label: `${availableCars} disponíveis`, icon: CheckCircle, color: '#059669' },
          { label: `${reservedCars} reservados`,   icon: Calendar,    color: '#B45309' },
          { label: `${soldCars} vendidos`,          icon: Gauge,       color: '#64748B' },
        ].map(s => (
          <span
            key={s.label}
            style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 12, padding: '6px 12px', fontSize: 12, fontWeight: 600, background: '#fff', color: s.color, border: '1px solid #E8ECF0' }}
          >
            <s.icon size={12} />
            {s.label}
          </span>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────── */}
      <CarFilters searchParams={searchParams as Record<string, string | undefined>} />

      {/* ── Error ───────────────────────────────────── */}
      {error && (
        <div style={{ marginBottom: 16, borderRadius: 16, border: '1px solid #FECACA', background: '#FEF2F2', padding: 16, fontSize: 13, color: '#DC2626' }}>
          Erro ao carregar: {error.message}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────── */}
      {!error && (!cars || cars.length === 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: '#F1F5F9' }}>
            <Car size={28} color="#A0BADC" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1B3A57' }}>Nenhum carro encontrado</p>
          <p style={{ marginTop: 4, fontSize: 13, color: '#A0BADC' }}>
            {searchParams.q ? 'Tente outros termos de busca.' : 'Clique em + Novo Carro para começar.'}
          </p>
        </div>
      )}

      {/* ── Grid ────────────────────────────────────── */}
      {cars && cars.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 20 }}>
          {(cars as Record<string, unknown>[]).map(car => {
            const thumb =
              String(car.cover_image ?? '') ||
              (Array.isArray(car.images) && car.images.length > 0 ? String(car.images[0]) : '') ||
              ''
            const label    = `${car.brand} ${car.model} ${car.year}`
            const st       = STATUS_STYLE[String(car.status)] ?? { label: String(car.status), bg: '#F1F5F9', color: '#6B7280' }
            const catLabel = CATEGORY_LABELS[String(car.category)] ?? String(car.category)

            return (
              <div
                key={String(car.id)}
                className="hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
                style={{
                  display: 'flex', flexDirection: 'column',
                  overflow: 'hidden', borderRadius: 20,
                  background: '#fff',
                  border: '1px solid #E8ECF0',
                  boxShadow: '0 2px 8px rgba(10,25,41,0.06)',
                }}
              >
                {/* ── Foto ── */}
                <div style={{ position: 'relative', height: 192, overflow: 'hidden', background: '#E8F0FB', flexShrink: 0 }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Car size={40} color="#C8D8EC" />
                      <p style={{ fontSize: 11, color: '#A0BADC' }}>Sem foto</p>
                    </div>
                  )}

                  {/* Badge categoria — canto superior esquerdo */}
                  <span style={{
                    position: 'absolute', top: 10, left: 10,
                    borderRadius: 999, padding: '4px 10px',
                    fontSize: 10, fontWeight: 700, color: '#fff',
                    background: 'rgba(10,25,41,0.65)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  }}>
                    {catLabel}
                  </span>

                  {/* Badge status — canto superior direito */}
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    borderRadius: 999, padding: '4px 10px',
                    fontSize: 10, fontWeight: 700,
                    background: st.bg, color: st.color,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                  }}>
                    {st.label}
                  </span>
                </div>

                {/* ── Info ── */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '14px 16px 16px' }}>

                  {/* Nome + Preço */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1929', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                        {String(car.brand)} {String(car.model)}
                      </p>
                      {!!car.version && (
                        <p style={{ marginTop: 2, fontSize: 11, color: '#A0BADC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {String(car.version)}
                        </p>
                      )}
                    </div>
                    <p style={{ flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#0A1929', fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.01em' }}>
                      {formatPrice(Number(car.price))}
                    </p>
                  </div>

                  {/* Specs — cada item separado com gap */}
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#486581' }}>
                      <Gauge size={12} color="#A0BADC" strokeWidth={1.8} />
                      {formatKm(Number(car.km))}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#486581' }}>
                      <Settings2 size={12} color="#A0BADC" strokeWidth={1.8} />
                      {TRANSMISSION_LABELS[String(car.transmission)] ?? String(car.transmission)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#486581' }}>
                      <Calendar size={12} color="#A0BADC" strokeWidth={1.8} />
                      {String(car.year)}
                    </span>
                  </div>

                  {/* Ações */}
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link
                      href={`/admin/carros/${String(car.id)}`}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        borderRadius: 12, padding: '9px 0', fontSize: 12, fontWeight: 700,
                        color: '#fff', background: '#0A1929', textDecoration: 'none',
                      }}
                    >
                      <Pencil size={12} />
                      Editar
                    </Link>
                    <DeleteCarButton id={String(car.id)} label={label} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
