import type { MetadataRoute } from 'next'
import { getAllCars } from '@/lib/queries/cars'

const BASE_URL = 'https://rafaelmota.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getAllCars()
  const carRoutes = cars.map((car) => ({
    url: `${BASE_URL}/carros/${car.slug}`,
    lastModified: new Date(car.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/estoque`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/novos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/seminovos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/repasse`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...carRoutes,
  ]
}
