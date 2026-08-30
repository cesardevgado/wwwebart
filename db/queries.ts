import { and, asc, eq } from 'drizzle-orm'
import { db } from './index'
import { artworkMedia, artworks, siteSettings, socialLinks } from './schema'

export async function getProfile() { return db.select().from(siteSettings).where(eq(siteSettings.id, 1)).get() }
export async function getSocialLinks(includeDisabled = false) {
  const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)).all()
  return includeDisabled ? rows : rows.filter((row) => row.enabled)
}
export async function getPublishedArtworks() { return db.select().from(artworks).where(eq(artworks.status, 'published')).orderBy(asc(artworks.sortOrder)).all() }
export async function getAllArtworkRecords() { return db.select().from(artworks).orderBy(asc(artworks.sortOrder)).all() }
export async function getPublishedArtwork(slug: string) { return db.select().from(artworks).where(and(eq(artworks.slug, slug), eq(artworks.status, 'published'))).get() }
export async function getArtworkById(id: number) { return db.select().from(artworks).where(eq(artworks.id, id)).get() }
export async function getArtworkMedia(artworkId: number) { return db.select().from(artworkMedia).where(eq(artworkMedia.artworkId, artworkId)).orderBy(asc(artworkMedia.sortOrder)).all() }
export async function getPublishedNeighbors(slug: string) {
  const rows = await getPublishedArtworks(); const index = rows.findIndex((row) => row.slug === slug)
  return { previous: index > 0 ? rows[index - 1] : undefined, next: index >= 0 && index < rows.length - 1 ? rows[index + 1] : undefined }
}
