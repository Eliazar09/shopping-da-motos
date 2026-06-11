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
        src="/images/motos/moto-6.png"
        alt="Shopping das Motos — Boa Vista, Roraima"
      />
      <section>
        <h2>Shopping das Motos</h2>
        <p>Compra · Vende · Financia · Boa Vista, Roraima · Financiamento sem entrada!</p>
        <div>
          <div className={styles.tag} aria-label="Mais de 1000 clientes satisfeitos">
            <Users size={13} />
            1k+ clientes
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
