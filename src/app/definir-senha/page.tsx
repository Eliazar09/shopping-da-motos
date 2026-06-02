'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Shield } from 'lucide-react'
import Image from 'next/image'
import { createDynamicClient } from '@/lib/supabase/client'

// ── Pupil ────────────────────────────────────────────────────
function Pupil({ size = 12, maxDistance = 5, pupilColor = '#2D2D2D', forceLookX, forceLookY }: {
  size?: number; maxDistance?: number; pupilColor?: string; forceLookX?: number; forceLookY?: number
}) {
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
    <div ref={ref} className="rounded-full"
      style={{ width: size, height: size, backgroundColor: pupilColor, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'transform 0.1s ease-out' }}
    />
  )
}

// ── EyeBall ──────────────────────────────────────────────────
function EyeBall({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = 'white', pupilColor = '#2D2D2D', isBlinking = false, forceLookX, forceLookY }: {
  size?: number; pupilSize?: number; maxDistance?: number; eyeColor?: string; pupilColor?: string; isBlinking?: boolean; forceLookX?: number; forceLookY?: number
}) {
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
    <div ref={ref} className="rounded-full flex items-center justify-center"
      style={{ width: size, height: isBlinking ? 2 : size, backgroundColor: eyeColor, overflow: 'hidden', transition: 'height 0.1s ease' }}
    >
      {!isBlinking && (
        <div className="rounded-full" style={{ width: pupilSize, height: pupilSize, backgroundColor: pupilColor, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'transform 0.1s ease-out' }} />
      )}
    </div>
  )
}

// ── Characters Scene ─────────────────────────────────────────
function CharactersScene({ isMobile = false, isTyping, showingPassword }: { isMobile?: boolean; isTyping: boolean; showingPassword: boolean }) {
  const [purpleBlink, setPurpleBlink] = useState(false)
  const [blackBlink,  setBlackBlink]  = useState(false)
  const [lookAtEach,  setLookAtEach]  = useState(false)
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

  useEffect(() => {
    const s = () => { const t = setTimeout(() => { setPurpleBlink(true); setTimeout(() => { setPurpleBlink(false); s() }, 150) }, Math.random() * 4000 + 3000); return t }
    const t = s(); return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const s = () => { const t = setTimeout(() => { setBlackBlink(true); setTimeout(() => { setBlackBlink(false); s() }, 150) }, Math.random() * 4000 + 3000); return t }
    const t = s(); return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (isTyping) { setLookAtEach(true); const t = setTimeout(() => setLookAtEach(false), 800); return () => clearTimeout(t) }
  }, [isTyping])

  const calc = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
    const r = ref.current.getBoundingClientRect()
    const dx = mouse.x - (r.left + r.width / 2)
    const dy = mouse.y - (r.top + r.height / 3)
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    }
  }
  const pp = calc(purpleRef)
  const bp = calc(blackRef)
  const yp = calc(yellowRef)
  const op = calc(orangeRef)
  const ml = 0; const my = 8 // mobile look-down direction

  return (
    <div style={{ width: isMobile ? 286 : 550, height: isMobile ? 208 : 400, transform: isMobile ? 'scale(0.52)' : 'scale(1)', transformOrigin: 'bottom center' }}>
      {/* Purple */}
      <div ref={purpleRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 70, width: 180, height: 400, backgroundColor: '#6C3FF5', borderRadius: '10px 10px 0 0', zIndex: 1, transform: `skewX(${pp.bodySkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-8 transition-all duration-700"
          style={{ left: lookAtEach ? 55 : (isMobile ? 45 : 45 + pp.faceX), top: lookAtEach ? 65 : (isMobile ? 40 : 40 + pp.faceY) }}
        >
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={purpleBlink}
            forceLookX={lookAtEach ? 3 : isMobile ? ml : undefined} forceLookY={lookAtEach ? 4 : isMobile ? my : undefined} />
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={purpleBlink}
            forceLookX={lookAtEach ? 3 : isMobile ? ml : undefined} forceLookY={lookAtEach ? 4 : isMobile ? my : undefined} />
        </div>
      </div>
      {/* Black */}
      <div ref={blackRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 240, width: 120, height: 310, backgroundColor: '#2D2D2D', borderRadius: '8px 8px 0 0', zIndex: 2, transform: `skewX(${bp.bodySkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-6 transition-all duration-700"
          style={{ left: lookAtEach ? 32 : (isMobile ? 26 : 26 + bp.faceX), top: lookAtEach ? 12 : (isMobile ? 32 : 32 + bp.faceY) }}
        >
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={blackBlink}
            forceLookX={lookAtEach ? 0 : isMobile ? ml : undefined} forceLookY={lookAtEach ? -4 : isMobile ? my : undefined} />
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={blackBlink}
            forceLookX={lookAtEach ? 0 : isMobile ? ml : undefined} forceLookY={lookAtEach ? -4 : isMobile ? my : undefined} />
        </div>
      </div>
      {/* Orange */}
      <div ref={orangeRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 0, width: 240, height: 200, backgroundColor: '#FF9B6B', borderRadius: '120px 120px 0 0', zIndex: 3, transform: `skewX(${op.bodySkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-8 transition-all duration-200"
          style={{ left: isMobile ? 82 : 82 + op.faceX, top: isMobile ? 90 : 90 + op.faceY }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isMobile ? ml : undefined} forceLookY={isMobile ? my : undefined} />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isMobile ? ml : undefined} forceLookY={isMobile ? my : undefined} />
        </div>
      </div>
      {/* Yellow */}
      <div ref={yellowRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 310, width: 140, height: 230, backgroundColor: '#E8D754', borderRadius: '70px 70px 0 0', zIndex: 4, transform: `skewX(${yp.bodySkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-6 transition-all duration-200"
          style={{ left: isMobile ? 52 : 52 + yp.faceX, top: isMobile ? 40 : 40 + yp.faceY }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isMobile ? ml : undefined} forceLookY={isMobile ? my : undefined} />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isMobile ? ml : undefined} forceLookY={isMobile ? my : undefined} />
        </div>
        <div className="absolute h-[4px] w-20 rounded-full bg-[#2D2D2D] transition-all duration-200"
          style={{ left: isMobile ? 40 : 40 + yp.faceX, top: isMobile ? 88 : 88 + yp.faceY }} />
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────
export default function DefinirSenhaPage() {
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPass, setShowPass]         = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [isTyping, setIsTyping]         = useState(false)
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState('')
  const [sessionReady, setSessionReady] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createDynamicClient()

    // Supabase implicit flow: token vem no hash da URL (#access_token=...&refresh_token=...)
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken  = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ error }) => setSessionReady(!error))
        return
      }
    }

    // PKCE flow ou sessão já existente
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(!!data.session)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('A senha precisa ter no mínimo 8 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    setLoading(true)
    const supabase = createDynamicClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError('Não foi possível definir a senha. O link pode ter expirado.')
      setLoading(false)
      return
    }
    setSuccess(true)
    setTimeout(() => { window.location.href = '/admin' }, 2500)
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">

      {/* Mobile: personagens olhando pra baixo */}
      <div className="flex justify-center overflow-hidden bg-gradient-to-br from-[#0A1929] to-[#1a3354] pt-10 pb-0 lg:hidden" style={{ minHeight: 160 }}>
        <div className="relative" style={{ width: 286, height: 108 }}>
          <CharactersScene isMobile isTyping={isTyping} showingPassword={showPass} />
        </div>
      </div>

      {/* Desktop: painel esquerdo */}
      <div className="relative hidden w-[52%] flex-shrink-0 overflow-hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0A1929] via-[#0d2240] to-[#1a3354] p-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Image src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png" alt="Rafael Mota" width={36} height={36} className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>Rafael Mota</p>
            <p className="text-[11px] text-white/50">Consultor Automotivo</p>
          </div>
        </motion.div>

        <div className="flex items-end justify-center" style={{ height: 420 }}>
          <div className="relative" style={{ width: 550, height: 400 }}>
            <CharactersScene isTyping={isTyping} showingPassword={showPass} />
          </div>
        </div>

        <div>
          <motion.div className="mb-4 h-[3px] w-11 rounded-full bg-accent" initial={{ width: 0, opacity: 0 }} animate={{ width: 44, opacity: 1 }} transition={{ duration: 0.9, delay: 0.5 }} />
          <motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="text-[34px] font-bold leading-[1.1] text-white" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.025em' }}
          >
            Seja bem-vindo<br />ao seu painel<br /><span className="text-accent">Rafael.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/50"
          >
            Configure sua senha de acesso e comece a gerenciar seu catálogo.
          </motion.p>
        </div>

        <div className="pointer-events-none absolute -bottom-48 -left-48 h-[560px] w-[560px] rounded-full blur-3xl opacity-20" style={{ background: '#E31E24' }} />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-10" style={{ background: '#C8973A' }} />
      </div>

      {/* Painel direito: formulário */}
      <motion.div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 md:px-12"
        style={{ background: '#F8F9FB' }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
      >
        {/* Mobile logo */}
        <motion.div className="mb-8 flex items-center gap-2.5 lg:hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-marine-900 p-2">
            <Image src="/images/RAFAEL MOTA LOGO PRETA SEM FUNDO copy.png" alt="RM" width={28} height={28} className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <span className="text-[15px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-jakarta)' }}>Rafael Mota</span>
        </motion.div>

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Link inválido */}
          {sessionReady === false && (
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mx-auto">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h1 className="text-[22px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-fraunces)' }}>Link inválido ou expirado</h1>
              <p className="mt-2 text-[14px] text-marine-500">Peça um novo link de acesso ao administrador.</p>
            </div>
          )}

          {/* Sucesso */}
          {success && (
            <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 mx-auto">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h1 className="text-[22px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-fraunces)' }}>Senha definida!</h1>
              <p className="mt-2 text-[14px] text-marine-500">Redirecionando para o painel…</p>
            </motion.div>
          )}

          {/* Formulário */}
          {sessionReady === true && !success && (
            <>
              <div className="mb-8">
                <h1 className="text-[28px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}>
                  Primeiro acesso
                </h1>
                <p className="mt-1.5 text-[14px] text-marine-500">
                  Escolha uma senha segura para acessar seu painel.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Senha */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">Nova senha</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      className="w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/8"
                      style={{ borderColor: '#E4E7EB', boxShadow: '0 1px 4px rgba(10,25,41,0.06)' }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-marine-300 transition-colors hover:text-marine-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar senha */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-marine-500">Confirmar senha</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repita a senha"
                      required
                      className="w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-[14px] text-marine-900 outline-none transition-all placeholder:text-marine-300 focus:border-marine-400 focus:ring-2 focus:ring-marine-900/8"
                      style={{ borderColor: '#E4E7EB', boxShadow: '0 1px 4px rgba(10,25,41,0.06)' }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-marine-300 transition-colors hover:text-marine-600"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Erro */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2.5 overflow-hidden rounded-xl bg-red-50 px-4 py-3"
                      style={{ border: '1px solid #fecaca' }}
                    >
                      <AlertCircle size={14} className="flex-shrink-0 text-red-500" />
                      <p className="text-[12px] font-medium text-red-600">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={loading}
                  className="w-full rounded-xl bg-marine-900 py-3.5 text-[14px] font-bold text-white transition-all hover:bg-marine-700 disabled:opacity-60"
                  style={{ boxShadow: '0 4px 16px rgba(10,25,41,0.18)' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" /> Salvando…</span>
                    : 'Definir senha e entrar'
                  }
                </button>
              </form>
            </>
          )}

          {/* Loading inicial */}
          {sessionReady === null && (
            <div className="flex flex-col items-center gap-3 text-marine-400">
              <Loader2 size={24} className="animate-spin" />
              <p className="text-[13px]">Verificando link…</p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-marine-400">
            <Shield size={11} />
            <span>Acesso restrito</span>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-60" style={{ background: 'rgba(227,30,36,0.06)' }} />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-60" style={{ background: 'rgba(200,151,58,0.05)' }} />
      </motion.div>
    </main>
  )
}
