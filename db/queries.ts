import { and, asc, eq } from 'drizzle-orm'
import { db } from './index'
import { artworkMedia, artworks, siteSettings, socialLinks } from './schema'

export function getProfile() { return db.select().from(siteSettings).where(eq(siteSettings.id, 1)).get() }
export function getSocialLinks(includeDisabled = false) {
  const rows = db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)).all()
  return includeDisabled ? rows : rows.filter((row) => row.enabled)
}
export function getPublishedArtworks() { return db.select().from(artworks).where(eq(artworks.status, 'published')).orderBy(asc(artworks.sortOrder)).all() }
export function getAllArtworkRecords() { return db.select().from(artworks).orderBy(asc(artworks.sortOrder)).all() }
export function getPublishedArtwork(slug: string) { return db.select().from(artworks).where(and(eq(artworks.slug, slug), eq(artworks.status, 'published'))).get() }
export function getArtworkById(id: number) { return db.select().from(artworks).where(eq(artworks.id, id)).get() }
export function getArtworkMedia(artworkId: number) { return db.select().from(artworkMedia).where(eq(artworkMedia.artworkId, artworkId)).orderBy(asc(artworkMedia.sortOrder)).all() }
export function getPublishedNeighbors(slug: string) {
  const rows = getPublishedArtworks(); const index = rows.findIndex((row) => row.slug === slug)
  return { previous: index > 0 ? rows[index - 1] : undefined, next: index >= 0 && index < rows.length - 1 ? rows[index + 1] : undefined }
}
