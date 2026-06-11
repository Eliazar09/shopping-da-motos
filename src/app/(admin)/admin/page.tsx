import { createDynamicServerClient } from '@/lib/supabase/server'
import DashboardClient from './_components/DashboardClient'
import type { DbCar, DbNote, ActivityItem } from './_components/DashboardClient'

export const revalidate = 30

export default async function DashboardPage() {
  const supabase   = createDynamicServerClient()
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0]

  const [
    { count: activeCars },
    { count: salesCount },
    { data: salesData },
    { data: recentCarsData },
    { data: salesAct },
    { data: carsAct },
    { data: notesData, error: notesErr },
  ] = await Promise.all([
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'disponivel'),
    supabase.from('sales').select('*', { count: 'exact', head: true }).eq('status', 'concluida').gte('sale_date', monthStart),
    supabase.from('sales').select('commission_value,sale_price').eq('status', 'concluida').gte('sale_date', monthStart),
    supabase.from('cars').select('id,brand,model,year,cover_image,status,price').order('created_at', { ascending: false }).limit(4),
    supabase.from('sales').select('id,car_name,client_name,sale_date').order('sale_date', { ascending: false }).limit(5),
    supabase.from('cars').select('id,brand,model,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('notes').select('id,title,content,tags,is_pinned,updated_at').order('is_pinned', { ascending: false }).order('updated_at', { ascending: false }).limit(3),
  ])

  const salesArr  = (salesData ?? []) as { commission_value: number; sale_price: number }[]
  const commMonth = salesArr.reduce((s, r) => s + Number(r.commission_value ?? 0), 0)
  const avgTicket = salesArr.length > 0
    ? Math.round(salesArr.reduce((s, r) => s + Number(r.sale_price ?? 0), 0) / salesArr.length)
    : 0

  const saleItems: ActivityItem[] = (
    (salesAct ?? []) as { id: string; car_name: string | null; client_name: string | null; sale_date: string }[]
  ).map(s => ({
    id: `sale-${s.id}`,
    type: 'sale',
    description: `Venda: ${s.car_name ?? 'Moto'}${s.client_name ? ` para ${s.client_name}` : ''}`,
    date: s.sale_date,
  }))

  const carItems: ActivityItem[] = (
    (carsAct ?? []) as { id: string; brand: string; model: string; created_at: string }[]
  ).map(c => ({
    id: `car-${c.id}`,
    type: 'car',
    description: `Moto cadastrada: ${c.brand} ${c.model}`,
    date: c.created_at,
  }))

  const activity = [...saleItems, ...carItems]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)

  return (
    <DashboardClient
      activeCars={activeCars ?? 0}
      salesMonth={salesCount ?? 0}
      commMonth={commMonth}
      avgTicket={avgTicket}
      recentCars={(recentCarsData ?? []) as DbCar[]}
      activity={activity}
      recentNotes={(notesData ?? []) as DbNote[]}
      notesError={!!notesErr}
    />
  )
}
