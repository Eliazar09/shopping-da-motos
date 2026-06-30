import { redirect } from 'next/navigation'

export default function LegacyNotFound() {
  redirect('/estoque')
}
