'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react'
import Image from 'next/image'
import { createDynamicClient, isSupabaseConfigured } from '@/lib/supabase/client'

// ── Schema ──────────────────────────────────────────────────
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

// ── Pupil ───────────────────────────────────────────────────
interface PupilProps {
  size?: number
  maxDistance?: number
  pupilColor?: string
  forceLookX?: number
  forceLookY?: number
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = '#2D2D2D', forceLookX, forceLookY }: PupilProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY }
    if (!ref.current) return { x: 0, y: 0 }
    const r = ref.current.getBoundingClientRect()
    const dx = mouse.x - (r.left + r.width / 2)
    const dy = mouse.y - (r.top + r.height / 2)
    const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const a = Math.atan2(dy, dx)
    return { x: Math.cos(a) * d, y: Math.sin(a) * d }
  })()

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{
        width: size, height: size,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}

// ── EyeBall ─────────────────────────────────────────────────
interface EyeBallProps {
  size?: number; pupilSize?: number; maxDistance?: number
  eyeColor?: string; pupilColor?: string; isBlinking?: boolean
  forceLookX?: number; forceLookY?: number
}

function EyeBall({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = 'white', pupilColor = '#2D2D2D', isBlinking = false, forceLookX, forceLookY }: EyeBallProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY }
    if (!ref.current) return { x: 0, y: 0 }
    const r = ref.current.getBoundingClientRect()
    const dx = mouse.x - (r.left + r.width / 2)
    const dy = mouse.y - (r.top + r.height / 2)
    const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const a = Math.atan2(dy, dx)
    return { x: Math.cos(a) * d, y: Math.sin(a) * d }
  })()

  return (
    <div
      ref={ref}
      className="rounded-full flex items-center justify-center"
      style={{
        width: size, height: isBlinking ? 2 : size,
        backgroundColor: eyeColor, overflow: 'hidden',
        transition: 'height 0.1s ease',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: pupilSize, height: pupilSize,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  )
}

// ── Characters scene ─────────────────────────────────────────
interface SceneProps {
  isMobile?: boolean
  isTypingEmail: boolean
  isPasswordVisible: boolean
  hasPassword: boolean
}

function CharactersScene({ isMobile = false, isTypingEmail, isPasswordVisible, hasPassword }: SceneProps) {
  const [purpleBlink, setPurpleBlink] = useState(false)
  const [blackBlink, setBlackBlink] = useState(false)
  const [lookAtEach, setLookAtEach] = useState(false)
  const [purplePeeking, setPurplePeeking] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const purpleRef = useRef<HTMLDivElement>(null)
  const blackRef  = useRef<HTMLDivElement>(null)
  const yellowRef = useRef<HTMLDivElement>(null)
  const orangeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  // Blinking purple
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setPurpleBlink(true)
        setTimeout(() => { setPurpleBlink(false); schedule() }, 150)
      }, Math.random() * 4000 + 3000)
      return t
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  // Blinking black
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setBlackBlink(true)
        setTimeout(() => { setBlackBlink(false); schedule() }, 150)
      }, Math.random() * 4000 + 3000)
      return t
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  // Look at each other when typing starts
  useEffect(() => {
    if (isTypingEmail) {
      setLookAtEach(true)
      const t = setTimeout(() => setLookAtEach(false), 800)
      return () => clearTimeout(t)
    }
  }, [isTypingEmail])

  // Purple peek when password visible
  useEffect(() => {
    if (hasPassword && isPasswordVisible) {
      const schedule = () => {
        const t = setTimeout(() => {
          setPurplePeeking(true)
          setTimeout(() => { setPurplePeeking(false) }, 800)
        }, Math.random() * 3000 + 2000)
        return t
      }
      const t = schedule()
      return () => clearTimeout(t)
    }
    setPurplePeeking(false)
  }, [hasPassword, isPasswordVisible, purplePeeking])

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 3
    const dx = mouse.x - cx
    const dy = mouse.y - cy
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    }
  }

  const pp = calcPos(purpleRef)
  const bp = calcPos(blackRef)
  const yp = calcPos(yellowRef)
  const op = calcPos(orangeRef)

  // Mobile: characters look down at the form below
  const mobileLookX = 0
  const mobileLookY = 8

  const scale = isMobile ? 0.52 : 1
  const containerW = isMobile ? 286 : 550
  const containerH = isMobile ? 208 : 400

  const hiding = hasPassword && !isPasswordVisible

  return (
    <div style={{ width: containerW, height: containerH, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>

      {/* Purple tall */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 70, width: 180,
          height: hiding ? 440 : 400,
          backgroundColor: '#6C3FF5',
          borderRadius: '10px 10px 0 0',
          zIndex: 1,
          transform: (hasPassword && isPasswordVisible)
            ? 'skewX(0deg)'
            : hiding
              ? `skewX(${pp.bodySkew - 12}deg) translateX(40px)`
              : `skewX(${pp.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{
            left: (hasPassword && isPasswordVisible) ? 20 : lookAtEach ? 55 : (isMobile ? 45 : 45 + pp.faceX),
            top:  (hasPassword && isPasswordVisible) ? 35 : lookAtEach ? 65 : (isMobile ? 40 : 40 + pp.faceY),
          }}
        >
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={purpleBlink}
            forceLookX={(hasPassword && isPasswordVisible) ? (purplePeeking ? 4 : -4) : lookAtEach ? 3 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? (purplePeeking ? 5 : -4) : lookAtEach ? 4 : isMobile ? mobileLookY : undefined}
          />
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={purpleBlink}
            forceLookX={(hasPassword && isPasswordVisible) ? (purplePeeking ? 4 : -4) : lookAtEach ? 3 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? (purplePeeking ? 5 : -4) : lookAtEach ? 4 : isMobile ? mobileLookY : undefined}
          />
        </div>
      </div>

      {/* Black tall */}
      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 240, width: 120, height: 310,
          backgroundColor: '#2D2D2D',
          borderRadius: '8px 8px 0 0',
          zIndex: 2,
          transform: (hasPassword && isPasswordVisible)
            ? 'skewX(0deg)'
            : lookAtEach
              ? `skewX(${bp.bodySkew * 1.5 + 10}deg) translateX(20px)`
              : `skewX(${hiding ? bp.bodySkew * 1.5 : bp.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{
            left: (hasPassword && isPasswordVisible) ? 10 : lookAtEach ? 32 : (isMobile ? 26 : 26 + bp.faceX),
            top:  (hasPassword && isPasswordVisible) ? 28 : lookAtEach ? 12 : (isMobile ? 32 : 32 + bp.faceY),
          }}
        >
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={blackBlink}
            forceLookX={(hasPassword && isPasswordVisible) ? -4 : lookAtEach ? 0 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? -4 : lookAtEach ? -4 : isMobile ? mobileLookY : undefined}
          />
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={blackBlink}
            forceLookX={(hasPassword && isPasswordVisible) ? -4 : lookAtEach ? 0 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? -4 : lookAtEach ? -4 : isMobile ? mobileLookY : undefined}
          />
        </div>
      </div>

      {/* Orange semi-circle */}
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 0, width: 240, height: 200,
          backgroundColor: '#FF9B6B',
          borderRadius: '120px 120px 0 0',
          zIndex: 3,
          transform: (hasPassword && isPasswordVisible) ? 'skewX(0deg)' : `skewX(${op.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{
            left: (hasPassword && isPasswordVisible) ? 50 : (isMobile ? 82 : 82 + op.faceX),
            top:  (hasPassword && isPasswordVisible) ? 85 : (isMobile ? 90 : 90 + op.faceY),
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(hasPassword && isPasswordVisible) ? -5 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? -4 : isMobile ? mobileLookY : undefined}
          />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(hasPassword && isPasswordVisible) ? -5 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? -4 : isMobile ? mobileLookY : undefined}
          />
        </div>
      </div>

      {/* Yellow rounded rect */}
      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 310, width: 140, height: 230,
          backgroundColor: '#E8D754',
          borderRadius: '70px 70px 0 0',
          zIndex: 4,
          transform: (hasPassword && isPasswordVisible) ? 'skewX(0deg)' : `skewX(${yp.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{
            left: (hasPassword && isPasswordVisible) ? 20 : (isMobile ? 52 : 52 + yp.faceX),
            top:  (hasPassword && isPasswordVisible) ? 35 : (isMobile ? 40 : 40 + yp.faceY),
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(hasPassword && isPasswordVisible) ? -5 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? -4 : isMobile ? mobileLookY : undefined}
          />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(hasPassword && isPasswordVisible) ? -5 : isMobile ? mobileLookX : undefined}
            forceLookY={(hasPassword && isPasswordVisible) ? -4 : isMobile ? mobileLookY : undefined}
          />
        </div>
        {/* mouth */}
        <div
          className="absolute h-[4px] w-20 rounded-full bg-[#2D2D2D] transition-all duration-200 ease-out"
          style={{
            left: (hasPassword && isPasswordVisible) ? 10 : (isMobile ? 40 : 40 + yp.faceX),
            top:  (hasPassword && isPasswordVisible) ? 88 : (isMobile ? 88 : 88 + yp.faceY),
          }}
        />
      </div>
    </div>
  )
}

// ── LoginPage ────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [isTypingEmail, setIsTypingEmail] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const watchedPassword = watch('password', '')
  useEffect(() => { setPasswordValue(watchedPassword ?? '') }, [watchedPassword])

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

  const form = (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
      transition={{ duration: 0.45 }}
      className="w-full max-w-[400px]"
    >
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-[28px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}>
          Bem-vindo de volta
        </h1>
        <p className="mt-1.5 text-[14px] text-marine-500">
          Entre com suas credenciais para acessar o painel.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            onFocus={() => setIsTypingEmail(true)}
            onBlur={() => setIsTypingEmail(false)}
            className="w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/8"
            style={{ borderColor: errors.email ? '#E31E24' : '#E4E7EB', boxShadow: '0 1px 4px rgba(10,25,41,0.06)' }}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-1.5 flex items-center gap-1 text-[11px] text-accent"
              >
                <AlertCircle size={11} /> {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Senha */}
        <div>
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
              style={{ borderColor: errors.password ? '#E31E24' : '#E4E7EB', boxShadow: '0 1px 4px rgba(10,25,41,0.06)' }}
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
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
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
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2.5 overflow-hidden rounded-xl bg-red-50 px-4 py-3"
              style={{ border: '1px solid #fecaca' }}
            >
              <AlertCircle size={14} className="flex-shrink-0 text-accent" />
              <p className="text-[12px] font-medium text-accent">{serverError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-marine-900 py-3.5 text-[14px] font-bold text-white transition-all hover:bg-marine-700 disabled:opacity-60"
          style={{ boxShadow: '0 4px 16px rgba(10,25,41,0.18)' }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={15} className="animate-spin" /> Entrando…
            </span>
          ) : 'Entrar'}
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-marine-400">
        <Shield size={11} />
        <span>Acesso restrito</span>
      </div>
    </motion.div>
  )

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">

      {/* ── Mobile: personagens no topo olhando pra baixo ──── */}
      <div className="flex justify-center overflow-hidden bg-gradient-to-br from-[#0A1929] to-[#1a3354] pt-10 pb-0 lg:hidden"
        style={{ minHeight: 160 }}
      >
        <div className="relative" style={{ width: 286, height: 108 }}>
          <CharactersScene
            isMobile
            isTypingEmail={isTypingEmail}
            isPasswordVisible={showPassword}
            hasPassword={passwordValue.length > 0}
          />
        </div>
      </div>

      {/* ── Desktop: painel esquerdo ─────────────────────── */}
      <div className="relative hidden w-[52%] flex-shrink-0 overflow-hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0A1929] via-[#0d2240] to-[#1a3354] p-12">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Image
              src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png"
              alt="Rafael Mota" width={36} height={36}
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div>
            <p className="text-[14px] font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>Rafael Mota</p>
            <p className="text-[11px] text-white/50">Consultor Automotivo</p>
          </div>
        </motion.div>

        {/* Characters */}
        <div className="flex items-end justify-center" style={{ height: 420 }}>
          <div className="relative" style={{ width: 550, height: 400 }}>
            <CharactersScene
              isTypingEmail={isTypingEmail}
              isPasswordVisible={showPassword}
              hasPassword={passwordValue.length > 0}
            />
          </div>
        </div>

        {/* Bottom text */}
        <div>
          <motion.div className="mb-4 h-[3px] w-11 rounded-full bg-accent"
            initial={{ width: 0, opacity: 0 }} animate={{ width: 44, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          />
          <motion.h2
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-[34px] font-bold leading-[1.1] text-white"
            style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.025em' }}
          >
            Gerencie seu<br />catálogo com<br />
            <span className="text-accent">facilidade.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/50"
          >
            Adicione carros, acompanhe vendas e atenda clientes em um só lugar.
          </motion.p>
        </div>

        {/* Decorative glows */}
        <div className="pointer-events-none absolute -bottom-48 -left-48 h-[560px] w-[560px] rounded-full blur-3xl opacity-20" style={{ background: '#E31E24' }} />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-10" style={{ background: '#C8973A' }} />
      </div>

      {/* ── Right panel: form ────────────────────────────── */}
      <motion.div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 md:px-12"
        style={{ background: '#F8F9FB' }}
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Mobile logo */}
        <motion.div
          className="mb-8 flex items-center gap-2.5 lg:hidden"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-marine-900 p-2">
            <Image src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png" alt="RM" width={28} height={28}
              className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <span className="text-[15px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Rafael Mota
          </span>
        </motion.div>

        <div className="relative z-10 w-full max-w-[400px]">
          {form}
        </div>

        {/* Background orbs */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-60" style={{ background: 'rgba(227,30,36,0.06)' }} />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-60" style={{ background: 'rgba(200,151,58,0.05)' }} />
      </motion.div>
    </main>
  )
}
