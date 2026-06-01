'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { createDynamicClient, isSupabaseConfigured } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      if (!isSupabaseConfigured()) {
        setServerError('Supabase não configurado. Adicione as credenciais no .env.local')
        setShakeKey(k => k + 1)
        return
      }
      const supabase = createDynamicClient()
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (signInError || !signInData?.session) {
        setServerError('Email ou senha incorretos')
        setShakeKey(k => k + 1)
        return
      }
      window.location.href = '/admin'
    } catch {
      setServerError('Erro inesperado. Tente novamente.')
      setShakeKey(k => k + 1)
    }
  }

  return (
    <main className="flex min-h-screen">

      {/* ── LEFT PANEL — Car image ─────────────────────────────── */}
      <div className="relative hidden w-[52%] flex-shrink-0 overflow-hidden lg:flex">
        {/* Car photo */}
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=90&auto=format&fit=crop"
          alt="Carro de luxo"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(10,25,41,0.92) 0%, rgba(10,25,41,0.55) 50%, rgba(10,25,41,0.75) 100%)',
          }}
        />

        {/* Red glow */}
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: '#E31E24' }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12">
          {/* Logo top */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-2 backdrop-blur-sm">
              <Image
                src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
                alt="Rafael Mota"
                width={36}
                height={36}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Rafael Mota
              </p>
              <p className="text-[11px] text-white/50">Consultor Automotivo</p>
            </div>
          </motion.div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="mb-4 h-0.5 w-10 rounded-full bg-accent" />
            <h2
              className="text-[32px] font-bold leading-tight text-white"
              style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
            >
              Gerencie seu<br />
              catálogo com<br />
              <span className="text-accent">facilidade.</span>
            </h2>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/50">
              Adicione carros, acompanhe vendas e atenda clientes — tudo em um só lugar.
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-6">
              {[
                { n: '100%', label: 'Online' },
                { n: '24/7', label: 'Disponível' },
                { n: '∞',   label: 'Carros' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-[20px] font-bold text-white" style={{ fontFamily: 'var(--font-fraunces)' }}>{n}</p>
                  <p className="text-[11px] text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12"
        style={{ background: '#FAFBFC' }}
      >
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-marine-900 p-2">
            <Image
              src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
              alt="RM"
              width={28}
              height={28}
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <span className="text-[15px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Rafael Mota
          </span>
        </div>

        <motion.div
          key={shakeKey}
          animate={shakeKey > 0 ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[400px]"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-8"
          >
            {/* RM logo badge — desktop */}
            <div className="mb-6 hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl bg-marine-900 p-3 shadow-lg">
              <Image
                src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
                alt="RM"
                width={44}
                height={44}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            <h1
              className="text-[28px] font-bold text-marine-900"
              style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
            >
              Bem-vindo de volta
            </h1>
            <p className="mt-1.5 text-[14px] text-marine-500">
              Entre com suas credenciais para acessar o painel.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-marine-600 uppercase tracking-[0.08em]">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10"
                style={{
                  borderColor: errors.email ? '#E31E24' : '#E4E7EB',
                  boxShadow: '0 1px 3px rgba(10,25,41,0.05)',
                }}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 flex items-center gap-1 text-[11px] text-accent"
                  >
                    <AlertCircle size={11} /> {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Senha */}
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-marine-600 uppercase tracking-[0.08em]">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/10"
                  style={{
                    borderColor: errors.password ? '#E31E24' : '#E4E7EB',
                    boxShadow: '0 1px 3px rgba(10,25,41,0.05)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-marine-300 transition-colors hover:text-marine-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 flex items-center gap-1 text-[11px] text-accent"
                  >
                    <AlertCircle size={11} /> {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3"
                  style={{ border: '1px solid #fecaca' }}
                >
                  <AlertCircle size={14} className="flex-shrink-0 text-accent" />
                  <p className="text-[12px] font-medium text-accent">{serverError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-bold text-white transition-all disabled:opacity-60"
              style={{
                background: isSubmitting ? '#0A1929' : '#0A1929',
                boxShadow: '0 8px 24px rgba(10,25,41,0.20)',
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="animate-spin" /> Entrando…</>
              ) : (
                <>Entrar <ArrowRight size={15} /></>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <p className="mt-10 text-center text-[11px] text-marine-400">
            Acesso restrito &bull; Desenvolvido por{' '}
            <span className="font-semibold text-marine-500">Arvex Agency</span>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
