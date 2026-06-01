import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createDynamicServerClient } from '@/lib/supabase/server'
import CarForm from '@/components/admin/cars/CarForm'

export default async function EditCarPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string }
}) {
  const supabase = createDynamicServerClient()

  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !car) notFound()

  const label = `${(car as Record<string, unknown>).brand} ${(car as Record<string, unknown>).model} ${(car as Record<string, unknown>).year}`

  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/carros" className="text-marine-400 hover:text-marine-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-marine-500">Catálogo</p>
          <h1
            className="mt-0.5 text-[24px] font-bold text-marine-900"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            {label}
          </h1>
        </div>
      </div>

      <CarForm
        mode="edit"
        car={car as Record<string, unknown>}
        carId={params.id}
        initialTab={(searchParams.tab as 'basico' | 'tecnico' | 'descricao' | 'extras' | 'fotos') ?? 'basico'}
      />
    </div>
  )
}
