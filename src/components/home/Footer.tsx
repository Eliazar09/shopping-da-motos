import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Instagram, ArrowUpRight } from 'lucide-react'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

const navLinks = [
  { label: 'Estoque Completo', href: '/estoque' },
  { label: 'Motos Novas',      href: '/estoque?categoria=novo' },
  { label: 'Seminovas',        href: '/estoque?categoria=seminovo' },
]

const anchors = [
  { label: 'Sobre nós',    href: '/#sobre' },
  { label: 'Depoimentos',  href: '/#depoimentos' },
  { label: 'FAQ',          href: '/#faq' },
  { label: 'Contato',      href: '/#contato' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0C' }}>

      {/* ── Top CTA strip ── */}
      <div
        className="border-b"
        style={{ borderColor: '#101012' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2
              className="max-w-lg text-[36px] font-bold leading-[1.05] text-white md:text-[52px]"
              style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
            >
              A moto certa<br />
              para{' '}
              <span style={{ color: 'var(--accent)' }}>você.</span>
            </h2>

            <div className="flex flex-col gap-3">
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-whatsapp px-8 py-4 text-[14px] font-bold text-white transition-all hover:bg-whatsapp-hover"
                style={{ boxShadow: '0 8px 32px rgba(37,211,102,0.25)' }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Falar com a gente agora
              </a>
              <p className="text-center text-[11px] text-marine-500">
                Resposta em até 15 minutos · Seg–Sab 8h–18h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-8">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/image/image.png"
              alt="Shopping das Motos"
              width={160}
              height={56}
              className="mb-5 h-14 w-auto object-contain"
            />
            <p className="text-[13px] leading-relaxed text-marine-400" style={{ maxWidth: '260px' }}>
              Shopping das Motos — motos novas e seminovas com as melhores condições do mercado.
            </p>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-[#06111E]"
                  />
                ))}
              </div>
              <div className="ml-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 12 12" fill="#B8860B" className="h-3 w-3">
                      <path d="M6 0l1.545 3.09L11 3.635l-2.5 2.455.59 3.455L6 7.91l-3.09 1.635L3.5 6.09 1 3.635l3.455-.545z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-0.5 text-[11px] text-marine-500">+1.000 clientes satisfeitos</p>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-6 flex gap-2">
              <a
                href="https://www.instagram.com/shopping.dasmotos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-marine-400 transition-all hover:border-marine-500 hover:bg-marine-800 hover:text-white"
                style={{ borderColor: '#1E1E21' }}
              >
                <Instagram size={15} />
              </a>
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-marine-400 transition-all hover:border-marine-500 hover:bg-marine-800 hover:text-white"
                style={{ borderColor: '#1E1E21' }}
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2 — Estoque */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-marine-500">
              Estoque
            </p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-1 text-[13px] text-marine-400 transition-colors hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Menu */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-marine-500">
              Menu
            </p>
            <ul className="flex flex-col gap-3">
              {anchors.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group flex items-center gap-1 text-[13px] text-marine-400 transition-colors hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contato */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-marine-500">
              Contato
            </p>
            <ul className="flex flex-col gap-4">
                      <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                <span className="text-[13px] leading-snug text-marine-400">
                  Av. Gen. Ataíde Teive, 4063<br />
                  Asa Branca — Boa Vista, RR
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="flex-shrink-0 text-accent" />
                <span className="text-[13px] text-marine-400">Seg–Sab: 8h – 18h</span>
              </li>
            </ul>

            <a
              href={defaultWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-marine-700 px-5 py-2.5 text-[12px] font-semibold text-marine-300 transition-all hover:border-marine-500 hover:text-white"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-whatsapp" />
              Enviar mensagem
            </a>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid #101012' }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
          <p className="text-[11px] text-marine-600">
            &copy; {new Date().getFullYear()} Shopping das Motos. Todos os direitos reservados.
          </p>
          <a
            href="https://arvexagency.online"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-[11px] text-marine-600 transition-colors hover:text-marine-400"
          >
            Desenvolvido por Arvex Agency
            <ArrowUpRight size={11} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

    </footer>
  )
}
