import type { Metadata } from 'next'
import { jakarta, inter, fraunces } from './fonts'
import './globals.css'

const BASE_URL = 'https://rafaelmota.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Rafael Mota | Comprar Toyota em Boa Vista Roraima — Novos, Seminovos e Repasse',
    template: '%s | Rafael Mota — Toyota Roraima',
  },
  description:
    'Compre Toyota em Boa Vista, Roraima com Rafael Mota — Gerente de Negócios da Toyolex. Hilux, SW4, Corolla, RAV4 e mais. Carros 0km, seminovos e repasse com financiamento, entrega e atendimento pelo WhatsApp. Mais de 15 anos de experiência. Mais de 2.000 famílias atendidas.',
  keywords: [
    'Toyota Boa Vista', 'comprar Toyota Roraima', 'Hilux 0km Roraima', 'SW4 Roraima',
    'Corolla Boa Vista', 'RAV4 Roraima', 'Yaris Boa Vista', 'carros novos Boa Vista',
    'seminovos Roraima', 'repasse carro Roraima', 'Toyolex Roraima', 'Rafael Mota consultor',
    'financiamento Toyota Roraima', 'concessionária Toyota Boa Vista', 'carro 0km Roraima',
    'comprar carro Roraima', 'consultor automotivo Boa Vista', 'Toyota Ranger Roraima',
  ],
  authors: [{ name: 'Rafael Mota', url: BASE_URL }],
  creator: 'Rafael Mota — Toyolex Roraima',
  publisher: 'Rafael Mota Consultoria Automotiva',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Rafael Mota | Comprar Toyota em Boa Vista, Roraima',
    description:
      'Hilux, SW4, Corolla, RAV4 e mais — 0km, seminovos e repasse. Atendimento pelo WhatsApp. 15 anos vendendo confiança em Roraima.',
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Rafael Mota — Consultor Toyota Roraima',
    images: [
      {
        url: '/images/rafael/rafael-hero-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Rafael Mota — Consultor Toyota Toyolex Roraima',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafael Mota | Toyota em Boa Vista, Roraima',
    description: 'Hilux, SW4, Corolla — 0km, seminovos e repasse. Fale pelo WhatsApp. 15 anos de confiança.',
    images: ['/images/rafael/rafael-hero-1.jpg'],
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
  '@type': 'AutoDealer',
  name: 'Rafael Mota — Consultor Toyota Roraima',
  description: 'Consultor Toyota na Toyolex em Boa Vista, Roraima. Carros novos, seminovos e repasse com atendimento personalizado pelo WhatsApp.',
  url: BASE_URL,
  telephone: '+55-95-98116-8956',
  image: `${BASE_URL}/images/rafael/rafael-hero-1.jpg`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Boa Vista',
    addressRegion: 'RR',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 2.8235,
    longitude: -60.6758,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '08:00',
      closes: '13:00',
    },
  ],
  sameAs: [`https://wa.me/5595981168956`],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Toyota Hilux 0km' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Toyota SW4 0km' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Toyota Corolla 0km' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Carros Seminovos Roraima' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Repasse de Veículos' } },
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
      className={`${jakarta.variable} ${inter.variable} ${fraunces.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-marine-900 font-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
