'use client'

import { Users } from 'lucide-react'
import { defaultWhatsAppLink } from '@/lib/whatsapp'
import styles from './ProfileCard.module.css'

interface ProfileCardProps {
  dark?: boolean
}

export default function ProfileCard({ dark = false }: ProfileCardProps) {
  return (
    <div className={`${styles.card} ${dark ? styles.dark : ''}`}>
      <img
        src="/images/carros/sw4preta.png"
        alt="Rafael Mota — Consultor Toyota Toyolex"
      />
      <section>
        <h2>Rafael Mota</h2>
        <p>Gerente de Negócios · Toyolex Roraima · 15+ anos realizando sonhos.</p>
        <div>
          <div className={styles.tag} aria-label="Mais de 2000 famílias atendidas">
            <Users size={13} />
            2k+ famílias
          </div>
          <a
            href={defaultWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button style={{ background: dark ? '#25D366' : undefined, color: dark ? '#fff' : undefined }}>
              WhatsApp
            </button>
          </a>
        </div>
      </section>
    </div>
  )
}
