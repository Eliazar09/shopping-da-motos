'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react'
import Image from 'next/image'
import { createDynamicClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { FrameButton } from '@/components/ui/frame-button'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

const PARTICLES = [
  { x: 12, y: 18, delay: 0,   size: 3, dur: 4.2 },
  { x: 78, y: 12, delay: 0.6, size: 2, dur: 3.5 },
  { x: 42, y: 32, delay: 1.1, size: 4, dur: 5.0 },
  { x: 68, y: 58, delay: 1.7, size: 2, dur: 3.8 },
  { x: 22, y: 72, delay: 0.9, size: 3, dur: 4.5 },
  { x: 55, y: 82, delay: 0.3, size: 2, dur: 3.2 },
  { x: 88, y: 38, delay: 1.4, size: 3, dur: 4.8 },
  { x: 8,  y: 48, delay: 0.7, size: 2, dur: 3.6 },
  { x: 33, y: 90, delay: 1.9, size: 2, dur: 4.1 },
  { x: 92, y: 70, delay: 0.4, size: 3, dur: 5.2 },
]

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
    <main className="flex min-h-screen overflow-hidden">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="relative hidden w-[52%] flex-shrink-0 overflow-hidden lg:flex">

        {/* Car photo — zoom-out entrance */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/carros/yaris.png"
            alt="Toyota Yaris"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(145deg, rgba(10,25,41,0.96) 0%, rgba(10,25,41,0.65) 55%, rgba(10,25,41,0.88) 100%)',
          }}
        />

        {/* Pulsing red glow — bottom left */}
        <motion.div
          className="pointer-events-none absolute -bottom-48 -left-48 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: '#E31E24' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Pulsing gold glow — top right */}
        <motion.div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: '#C8973A' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -22, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
              whileHover={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <Image
                src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
                alt="Rafael Mota"
                width={36}
                height={36}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </motion.div>
            <div>
              <p className="text-[14px] font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Rafael Mota
              </p>
              <p className="text-[11px] text-white/50">Consultor Automotivo</p>
            </div>
          </motion.div>

          {/* Bottom text */}
          <div>
            {/* Animated accent line */}
            <motion.div
              className="mb-5 h-[3px] rounded-full bg-accent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 44, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-[38px] font-bold leading-[1.08] text-white"
              style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.025em' }}
            >
              Gerencie seu<br />
              catálogo com<br />
              <motion.span
                className="inline-block text-accent"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                facilidade.
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/50"
            >
              Adicione carros, acompanhe vendas e atenda clientes em um só lugar.
            </motion.p>

            {/* Stats */}
            <div className="mt-8 flex gap-8">
              {[
                { n: '100%', label: 'Online' },
                { n: '24/7', label: 'Disponível' },
                { n: '∞',   label: 'Carros' },
              ].map(({ n, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.75 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="text-[22px] font-bold text-white"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    {n}
                  </p>
                  <p className="text-[11px] text-white/40">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ─────────────────────────────────── */}
      <motion.div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 md:px-12"
        style={{ background: '#F8F9FB' }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background orbs */}
        <motion.div
          className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: 'rgba(227,30,36,0.06)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'rgba(200,151,58,0.05)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Mobile logo */}
        <motion.div
          className="mb-8 flex items-center gap-2.5 lg:hidden"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
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
        </motion.div>

        <motion.div
          key={shakeKey}
          animate={shakeKey > 0 ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="relative z-10 w-full max-w-[400px]"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <motion.div
              className="mb-6 hidden h-14 w-14 items-center justify-center rounded-2xl bg-marine-900 shadow-lg lg:flex"
              initial={{ opacity: 0, scale: 0.75, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '10px' }}
            >
              <Image
                src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
                alt="RM"
                width={44}
                height={44}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </motion.div>

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/8"
                style={{
                  borderColor: errors.email ? '#E31E24' : '#E4E7EB',
                  boxShadow: '0 1px 4px rgba(10,25,41,0.06)',
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
            </motion.div>

            {/* Senha */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/8"
                  style={{
                    borderColor: errors.password ? '#E31E24' : '#E4E7EB',
                    boxShadow: '0 1px 4px rgba(10,25,41,0.06)',
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
            </motion.div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="flex items-center gap-2.5 overflow-hidden rounded-xl bg-red-50 px-4 py-3"
                  style={{ border: '1px solid #fecaca' }}
                >
                  <AlertCircle size={14} className="flex-shrink-0 text-accent" />
                  <p className="text-[12px] font-medium text-accent">{serverError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <FrameButton
                type="submit"
                disabled={isSubmitting}
                variant="default"
                className="w-full justify-center disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><Loader2 size={15} className="animate-spin mr-2" /> Entrando…</>
                ) : (
                  <>Entrar</>
                )}
              </FrameButton>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-marine-400"
          >
            <Shield size={11} />
            <span>Acesso restrito</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  )
}
