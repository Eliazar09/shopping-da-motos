import type { Metadata } from 'next'
import { jakarta, inter, oswald } from './fonts'
import './globals.css'

const BASE_URL = 'https://shoppingdasmotos.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Shopping das Motos | Motos em Boa Vista, Roraima — Novas e Seminovas',
    template: '%s | Shopping das Motos — Boa Vista RR',
  },
  description:
    'Compre sua moto em Boa Vista, Roraima no Shopping das Motos. Motos novas e seminovas com financiamento sem entrada. Aprovação na hora! Atendimento pelo WhatsApp. Av. Gen. Ataíde Teive, 4063 — Asa Branca.',
  keywords: [
    'motos Boa Vista', 'comprar moto Roraima', 'motos novas Boa Vista', 'motos seminovas Roraima',
    'financiamento moto Boa Vista', 'moto barata Roraima',
    'shopping das motos', 'moto usada Boa Vista', 'moto parcelada Roraima',
    'financiamento sem entrada moto', 'moto 0km Boa Vista', 'Honda Boa Vista', 'Yamaha Roraima',
  ],
  authors: [{ name: 'Shopping das Motos', url: BASE_URL }],
  creator: 'Shopping das Motos — Boa Vista RR',
  publisher: 'Shopping das Motos',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Shopping das Motos | Motos em Boa Vista, Roraima',
    description:
      'Motos novas e seminovas com financiamento sem entrada. Aprovação na hora! Boa Vista — RR.',
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Shopping das Motos',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shopping das Motos — Boa Vista, Roraima',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopping das Motos | Boa Vista, Roraima',
    description: 'Motos novas e seminovas. Financiamento sem entrada. Fale pelo WhatsApp.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  category: 'automotive',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MotorcycleDealer',
  name: 'Shopping das Motos',
  description: 'Compre sua moto em Boa Vista, Roraima. Motos novas e seminovas com financiamento sem entrada. Aprovação na hora!',
  url: BASE_URL,
  telephone: '+55-95-98410-2562',
  image: `${BASE_URL}/images/og-image.jpg`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Gen. Ataíde Teive, 4063',
    addressLocality: 'Boa Vista',
    addressRegion: 'RR',
    postalCode: '69312-242',
    addressCountry: 'BR',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://www.instagram.com/shopping.dasmotos', `https://wa.me/5595984102562`],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Motos Novas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Motos Seminovas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Motos Seminovas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Financiamento sem entrada' } },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${jakarta.variable} ${inter.variable} ${oswald.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-marine-900 font-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
