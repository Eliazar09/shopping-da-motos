import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CarForm from '@/components/admin/cars/CarForm'

export default function NovoCarro() {
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
            Novo Carro
          </h1>
        </div>
      </div>

      <CarForm mode="create" />
    </div>
  )
}
