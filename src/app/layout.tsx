import type { Metadata } from 'next'
import { anton, inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rafael Mota — Consultor Toyota em Roraima',
  description:
    'Rafael Mota, Gerente de Negócios da Toyolex em Boa Vista, Roraima. Carros novos, seminovos e repasse com atendimento personalizado.',
  keywords: ['Toyota', 'Roraima', 'Boa Vista', 'Hilux', 'SW4', 'Corolla', 'RAV4', 'carros novos', 'seminovos'],
  authors: [{ name: 'Rafael Mota' }],
  creator: 'Arvex Agency',
  openGraph: {
    title: 'Rafael Mota — Consultor Toyota em Roraima',
    description:
      'Carros novos, seminovos e repasse com atendimento personalizado em Boa Vista, RR.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Rafael Mota Consultoria Automotiva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafael Mota — Consultor Toyota em Roraima',
    description: 'Carros novos, seminovos e repasse com atendimento personalizado em Boa Vista, RR.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-[#0A1628] text-white font-inter antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
