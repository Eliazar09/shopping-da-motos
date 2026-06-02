import Link from 'next/link'
import styles from './PearlButton.module.css'

type Variant = 'dark' | 'red' | 'gold'

interface PearlButtonProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  target?: string
  rel?: string
  variant?: Variant
}

function Inner({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <p>
        <span className={styles.star1}>✧</span>
        <span className={styles.star2}>✦</span>
        {children}
      </p>
    </div>
  )
}

export default function PearlButton({
  href,
  onClick,
  children,
  target,
  rel,
  variant = 'dark',
}: PearlButtonProps) {
  const cls = `${styles.button} ${styles[variant]}`

  if (href && target) {
    return (
      <a href={href} target={target} rel={rel} className={cls}>
        <Inner>{children}</Inner>
      </a>
    )
  }

  if (href) {
    return (
      <Link href={href} className={cls}>
        <Inner>{children}</Inner>
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={cls}>
      <Inner>{children}</Inner>
    </button>
  )
}
