const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5595984102562'

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function carWhatsAppLink(carName: string, carYear: number, carSlug: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shoppingdasmotos.com.br'
  const message = `Olá, Shopping das Motos! Tenho interesse no ${carName} ${carYear}\nLink: ${siteUrl}/carros/${carSlug}`
  return buildWhatsAppLink(message)
}

export function defaultWhatsAppLink(): string {
  const message = 'Olá, Shopping das Motos! Gostaria de saber mais sobre as motos disponíveis. Vi o site e quero saber mais!'
  return buildWhatsAppLink(message)
}

export function repaseWhatsAppLink(): string {
  const message = 'Olá, Shopping das Motos! Quero enviar fotos da minha moto para avaliação de repasse.'
  return buildWhatsAppLink(message)
}

export function carWhatsAppLinkDynamic(carName: string, carYear: number, carSlug: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://shoppingdasmotos.com.br'
  const message = `Olá, Shopping das Motos! Tenho interesse no ${carName} ${carYear}\nLink: ${origin}/carros/${carSlug}`
  return buildWhatsAppLink(message)
}

export function consorcioWhatsAppLinkDynamic(tipoGrupo: string, slug: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://shoppingdasmotos.com.br'
  const message = `Olá, Shopping das Motos! Tenho interesse no consórcio ${tipoGrupo}\nLink: ${origin}/carros/${slug}`
  return buildWhatsAppLink(message)
}

export function entregaWhatsAppLinkDynamic(): string {
  const message = 'Olá, Shopping das Motos! Quero conhecer as condições de financiamento para adquirir uma moto.'
  return buildWhatsAppLink(message)
}
