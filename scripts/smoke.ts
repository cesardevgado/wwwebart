import fs from 'node:fs/promises'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { artworks, siteSettings } from '../db/schema'
import { getProfile, getPublishedArtwork, getPublishedArtworks } from '../db/queries'
import { storage } from '../lib/storage'
import { createSessionToken, verifySessionToken } from '../lib/auth/session'
import bcrypt from 'bcryptjs'
import { adminUsers } from '../db/schema'

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message) }
async function main() {
const now = new Date().toISOString()
const admin = await db.select().from(adminUsers).where(eq(adminUsers.id, 1)).get()
assert(Boolean(admin && bcrypt.compareSync(process.env.ADMIN_PASSWORD ?? '', admin.passwordHash)), 'Admin password hash failed')
const token = createSessionToken()
assert(verifySessionToken(token) && !verifySessionToken(`${token}x`), 'Session signing failed')
const created = await db.insert(artworks).values({ slug: 'smoke-draft', title: 'Smoke Draft', year: 2026, medium: 'Test', type: 'image', sortOrder: 99, status: 'draft', createdAt: now, updatedAt: now }).returning().get()
assert(!await getPublishedArtwork('smoke-draft'), 'Draft was publicly queryable')
await db.update(artworks).set({ status: 'published', sortOrder: -1 }).where(eq(artworks.id, created.id)).run()
assert((await getPublishedArtworks())[0]?.slug === 'smoke-draft', 'Publish or ordering failed')
await db.update(siteSettings).set({ artistName: 'Smoke Artist', bio: 'Updated biography', updatedAt: now }).where(eq(siteSettings.id, 1)).run()
assert((await getProfile())?.artistName === 'Smoke Artist', 'Profile update failed')
const png = new File([Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])], 'test.png', { type: 'image/png' })
const uploaded = await storage.upload(png, 'image')
assert(uploaded.publicUrl.startsWith('/media/'), 'Upload failed')
await storage.delete(uploaded.key)
await db.delete(artworks).where(eq(artworks.id, created.id)).run()
assert(!await db.select().from(artworks).where(eq(artworks.id, created.id)).get(), 'Delete failed')
console.log('CRUD, draft/publish, ordering, profile, and upload smoke tests passed.')
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
