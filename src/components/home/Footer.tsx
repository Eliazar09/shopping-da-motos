import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react'
import { defaultWhatsAppLink } from '@/lib/whatsapp'

function LogoMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm bg-accent-red">
      <span
        className="font-anton text-[19px] tracking-tight text-white"
        style={{ fontFamily: 'var(--font-anton)' }}
      >
        RM
      </span>
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const navLinks = [
  { label: 'Estoque Completo', href: '/estoque' },
  { label: 'Carros Novos', href: '/novos' },
  { label: 'Seminovos', href: '/seminovos' },
  { label: 'Repasse', href: '/repasse' },
  { label: 'Sobre', href: '/#sobre' },
]

const contactItems = [
  { icon: MapPin, text: 'Boa Vista, Roraima' },
  { icon: Phone, text: '(95) 9XXXX-XXXX' },
  { icon: Mail, text: 'contato@rafaelmota.com.br' },
  { icon: Clock, text: 'Seg-Sab: 8h – 19h' },
]

export default function Footer() {
  return (
    <footer className="bg-bg-primary">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:px-12">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p
                  className="font-anton text-[13px] leading-none tracking-widest text-white"
                  style={{ fontFamily: 'var(--font-anton)' }}
                >
                  RAFAEL MOTA
                </p>
                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted">
                  Gerente de Negocios
                </p>
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-text-muted">
              Rafael Mota — Gerente de Negocios Toyolex Roraima. Atendimento personalizado,
              transparente e focado em voce.
            </p>

            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do Rafael Mota"
                className="flex h-9 w-9 items-center justify-center border border-bg-tertiary text-text-muted transition-colors hover:border-white/20 hover:text-white"
              >
                <Instagram size={16} />
              </a>
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp do Rafael Mota"
                className="flex h-9 w-9 items-center justify-center border border-bg-tertiary text-text-muted transition-colors hover:border-white/20 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <p
              className="mb-5 font-anton text-[11px] tracking-[0.15em] text-white"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              NAVEGAÇÃO
            </p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[13px] text-text-muted transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <p
              className="mb-5 font-anton text-[11px] tracking-[0.15em] text-white"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              CONTATO
            </p>
            <ul className="flex flex-col gap-3.5">
              {contactItems.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon size={14} className="flex-shrink-0 text-accent-red" />
                  <span className="text-[13px] text-text-muted">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t border-bg-tertiary px-4 py-5 md:px-8 lg:px-12"
        style={{ background: '#05101F' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-[11px] text-text-muted">
            &copy; 2025 Rafael Mota. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-text-muted">
            SITE DESENVOLVIDO POR{' '}
            <a
              href="https://arvexagency.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent-red hover:text-accent-red-dark transition-colors"
            >
              ARVEX AGENCY
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
