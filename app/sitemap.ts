import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getPublishedArtworks } from '@/db/queries'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return ['', '/about', ...(await getPublishedArtworks()).map((a) => `/artwork/${a.slug}`)].map((path) => ({ url: `${siteConfig.siteUrl}${path}`, lastModified: new Date() }))
}
