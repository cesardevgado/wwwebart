'use server'

import bcrypt from 'bcryptjs'
import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/db'
import { adminUsers, artworkMedia, artworks, siteSettings, socialLinks } from '@/db/schema'
import { createSession, destroySession, requireAdmin } from '@/lib/auth/session'
import { slugify } from '@/lib/slug'
import { storage } from '@/lib/storage'

export type ActionState = { error?: string; success?: string }
const optionalUrl = z.union([z.literal(''), z.string().url()])
const artworkSchema = z.object({
  title: z.string().trim().min(1).max(160), slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  year: z.coerce.number().int().min(1000).max(9999), medium: z.string().trim().min(1).max(500),
  type: z.enum(['image', 'video', 'interactive', 'external']), status: z.enum(['draft', 'published']),
  description: z.string().max(3000), mediaUrl: optionalUrl.or(z.string().startsWith('/')), externalUrl: optionalUrl.or(z.string().startsWith('/')),
  sourceUrl: optionalUrl, componentKey: z.string().max(80), altText: z.string().max(500), dimensions: z.string().max(200),
  duration: z.string().max(200), edition: z.string().max(200), fileSize: z.string().max(100), dateCreated: z.string().max(20),
  software: z.string().max(300), hardware: z.string().max(300), programmingLanguage: z.string().max(300),
})
const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim()

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const password = text(formData, 'password'); const user = db.select().from(adminUsers).where(eq(adminUsers.id, 1)).get()
  if (!user || !await bcrypt.compare(password, user.passwordHash)) return { error: 'Incorrect password.' }
  await createSession(); redirect('/admin')
}
export async function logoutAction() { await requireAdmin(); await destroySession(); redirect('/admin/login') }

export async function saveProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const parsed = z.object({ artistName: z.string().trim().min(1).max(120), subtitle: z.string().max(240), bio: z.string().max(12000), linksJson: z.string() }).safeParse({ artistName: text(formData, 'artistName'), subtitle: text(formData, 'subtitle'), bio: text(formData, 'bio'), linksJson: text(formData, 'linksJson') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the profile fields.' }
  let portraitPath = db.select().from(siteSettings).where(eq(siteSettings.id, 1)).get()?.portraitPath
  const portrait = formData.get('portrait')
  try { if (portrait instanceof File && portrait.size) portraitPath = (await storage.upload(portrait, 'image')).publicUrl } catch (error) { return { error: (error as Error).message } }
  let links: unknown
  try { links = JSON.parse(parsed.data.linksJson) } catch { return { error: 'Social links could not be read.' } }
  const linkResult = z.array(z.object({ platform: z.string().max(50), label: z.string().trim().min(1).max(80), url: z.string().trim().min(1).max(500), enabled: z.boolean() })).max(30).safeParse(links)
  if (!linkResult.success) return { error: 'Every social link needs a label and URL.' }
  db.transaction((tx) => {
    tx.update(siteSettings).set({ artistName: parsed.data.artistName, subtitle: parsed.data.subtitle, bio: parsed.data.bio, portraitPath, updatedAt: new Date().toISOString() }).where(eq(siteSettings.id, 1)).run()
    tx.delete(socialLinks).run()
    if (linkResult.data.length) tx.insert(socialLinks).values(linkResult.data.map((link, sortOrder) => ({ ...link, sortOrder }))).run()
  })
  revalidatePath('/'); revalidatePath('/about'); return { success: 'Profile updated.' }
}

export async function saveArtworkAction(id: number | null, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const values = Object.fromEntries(['title','slug','year','medium','type','status','description','mediaUrl','externalUrl','sourceUrl','componentKey','altText','dimensions','duration','edition','fileSize','dateCreated','software','hardware','programmingLanguage'].map((key) => [key, text(formData, key)]))
  const parsed = artworkSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the artwork fields.' }
  const duplicate = db.select({ id: artworks.id }).from(artworks).where(id ? and(eq(artworks.slug, parsed.data.slug), ne(artworks.id, id)) : eq(artworks.slug, parsed.data.slug)).get()
  if (duplicate) return { error: 'That slug is already in use.' }
  let mediaPath = parsed.data.mediaUrl || (id ? db.select().from(artworks).where(eq(artworks.id, id)).get()?.mediaPath : null)
  const media = formData.get('media')
  try { if (media instanceof File && media.size) mediaPath = (await storage.upload(media, parsed.data.type === 'video' ? 'video' : 'image')).publicUrl } catch (error) { return { error: (error as Error).message } }
  const { mediaUrl: _mediaUrl, ...clean } = parsed.data
  const record = { ...clean, description: clean.description || null, mediaPath: mediaPath || null, externalUrl: clean.externalUrl || null, sourceUrl: clean.sourceUrl || null, componentKey: clean.componentKey || null, altText: clean.altText || null, dimensions: clean.dimensions || null, duration: clean.duration || null, edition: clean.edition || null, fileSize: clean.fileSize || null, dateCreated: clean.dateCreated || null, software: clean.software || null, hardware: clean.hardware || null, programmingLanguage: clean.programmingLanguage || null, autoplay: formData.has('autoplay'), muted: formData.has('muted'), loop: formData.has('loop'), controls: formData.has('controls'), updatedAt: new Date().toISOString() }
  if (id) db.update(artworks).set(record).where(eq(artworks.id, id)).run()
  else { const max = db.select().from(artworks).all().length; db.insert(artworks).values({ ...record, sortOrder: max, createdAt: new Date().toISOString() }).run() }
  revalidatePath('/'); revalidatePath('/artwork/[slug]', 'page'); redirect('/admin/artworks?saved=1')
}
export async function deleteArtworkAction(id: number) {
  await requireAdmin(); const artwork = db.select().from(artworks).where(eq(artworks.id, id)).get()
  if (artwork?.mediaPath?.startsWith('/media/')) await storage.delete(decodeURIComponent(artwork.mediaPath.split('/').pop()!))
  db.delete(artworks).where(eq(artworks.id, id)).run(); revalidatePath('/'); redirect('/admin/artworks?deleted=1')
}
export async function reorderArtworksAction(ids: number[]) {
  await requireAdmin(); const valid = z.array(z.number().int().positive()).max(500).parse(ids)
  db.transaction((tx) => valid.forEach((id, sortOrder) => tx.update(artworks).set({ sortOrder, updatedAt: new Date().toISOString() }).where(eq(artworks.id, id)).run()))
  revalidatePath('/'); revalidatePath('/admin/artworks')
}
export async function addArtworkMediaAction(artworkId: number, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  if (!db.select({ id: artworks.id }).from(artworks).where(eq(artworks.id, artworkId)).get()) return { error: 'Artwork not found.' }
  const typeResult = z.enum(['image', 'video', 'iframe']).safeParse(text(formData, 'mediaType'))
  if (!typeResult.success) return { error: 'Choose a valid media type.' }
  const type = typeResult.data; let mediaPath = text(formData, 'mediaItemUrl')
  const file = formData.get('mediaItemFile')
  try {
    if (file instanceof File && file.size && type !== 'iframe') mediaPath = (await storage.upload(file, type)).publicUrl
  } catch (error) { return { error: (error as Error).message } }
  const urlResult = z.union([z.string().url(), z.string().startsWith('/')]).safeParse(mediaPath)
  if (!urlResult.success) return { error: type === 'iframe' ? 'Enter a valid iframe URL.' : 'Upload a file or enter a valid media URL.' }
  const count = db.select().from(artworkMedia).where(eq(artworkMedia.artworkId, artworkId)).all().length
  db.insert(artworkMedia).values({ artworkId, type, path: mediaPath, altText: text(formData, 'mediaItemAlt') || null, sortOrder: count, autoplay: formData.has('mediaAutoplay'), muted: formData.has('mediaMuted'), loop: formData.has('mediaLoop'), controls: formData.has('mediaControls'), createdAt: new Date().toISOString() }).run()
  revalidatePath(`/admin/artworks/${artworkId}`); revalidatePath('/artwork/[slug]', 'page'); return { success: 'Media added.' }
}
export async function deleteArtworkMediaAction(id: number) {
  await requireAdmin(); const item = db.select().from(artworkMedia).where(eq(artworkMedia.id, id)).get()
  if (item?.path.startsWith('/media/')) await storage.delete(decodeURIComponent(item.path.split('/').pop()!))
  if (item) { db.delete(artworkMedia).where(eq(artworkMedia.id, id)).run(); revalidatePath(`/admin/artworks/${item.artworkId}`); revalidatePath('/artwork/[slug]', 'page') }
}
export async function reorderArtworkMediaAction(artworkId: number, ids: number[]) {
  await requireAdmin(); const valid = z.array(z.number().int().positive()).max(200).parse(ids)
  db.transaction((tx) => valid.forEach((id, sortOrder) => tx.update(artworkMedia).set({ sortOrder }).where(and(eq(artworkMedia.id, id), eq(artworkMedia.artworkId, artworkId))).run()))
  revalidatePath(`/admin/artworks/${artworkId}`); revalidatePath('/artwork/[slug]', 'page')
}
export async function titleToSlugAction(title: string) { return slugify(title) }
