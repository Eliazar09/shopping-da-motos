const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5595999999999'

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function carWhatsAppLink(carName: string, carYear: number, carSlug: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rafaelmota.com.br'
  const message = `Olá Rafael! Tenho interesse no ${carName} ${carYear}\nLink: ${siteUrl}/carros/${carSlug}`
  return buildWhatsAppLink(message)
}

export function defaultWhatsAppLink(): string {
  const message = 'Olá Rafael! Gostaria de saber mais sobre os carros disponíveis.'
  return buildWhatsAppLink(message)
}

export function repaseWhatsAppLink(): string {
  const message = 'Olá Rafael! Quero enviar fotos do meu carro para avaliação de repasse.'
  return buildWhatsAppLink(message)
}

export function carWhatsAppLinkDynamic(carName: string, carYear: number, carSlug: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://rafaelmota.com.br'
  const message = `Olá Rafael! Tenho interesse no ${carName} ${carYear}\nLink: ${origin}/carros/${carSlug}`
  return buildWhatsAppLink(message)
}
