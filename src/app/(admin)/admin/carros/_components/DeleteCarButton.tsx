'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteCar } from '../actions'

interface Props {
  id: string
  label: string
}

export default function DeleteCarButton({ id, label }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const res = await deleteCar(id)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
      return
    }
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-marine-400 transition-colors hover:bg-red-50 hover:text-accent"
        title="Excluir moto"
      >
        <Trash2 size={14} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-bold text-marine-900">Excluir moto</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-marine-600">
              Tem certeza que deseja excluir <strong>{label}</strong>?{' '}
              Todas as fotos também serão removidas. Esta ação não pode ser desfeita.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-marine-200 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                {loading ? 'Excluindo…' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
