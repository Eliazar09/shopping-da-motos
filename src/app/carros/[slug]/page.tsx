import { redirect } from 'next/navigation'

export default function LegacyCarRoute({ params }: { params: { slug: string } }) {
  redirect(`/motos/${params.slug}`)
}
