import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getPublishedArtworks } from '@/db/queries'
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', ...getPublishedArtworks().map((a) => `/artwork/${a.slug}`)].map((path) => ({ url: `${siteConfig.siteUrl}${path}`, lastModified: new Date() }))
}
