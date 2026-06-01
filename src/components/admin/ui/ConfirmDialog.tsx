'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Excluir', loading = false, onConfirm, onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-6"
            initial={{ opacity: 0, scale: 0.94, y: '-46%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.94, y: '-46%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.20)' }}
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: '#FEF2F2' }}
            >
              <AlertTriangle size={22} color="#DC2626" />
            </div>

            <h3
              className="text-[17px] font-bold text-marine-900"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              {title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-marine-500">{message}</p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 rounded-xl border border-marine-200 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-xl py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
                style={{ background: '#DC2626', boxShadow: '0 4px 12px rgba(220,38,38,0.25)' }}
              >
                {loading ? 'Excluindo…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
