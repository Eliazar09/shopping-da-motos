import { clsx } from 'clsx'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx('mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12', className)}>
      {children}
    </div>
  )
}
