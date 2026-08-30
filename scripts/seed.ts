import './load-env'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { adminUsers, artworkMedia, artworks, siteSettings, socialLinks } from '../db/schema'

const password = process.env.ADMIN_PASSWORD
if (!password || password.length < 10) throw new Error('Set ADMIN_PASSWORD to at least 10 characters before seeding.')
const now = new Date().toISOString()
db.insert(siteSettings).values({ id: 1, artistName: 'Mara Voss', subtitle: 'Computational studies in light, time, and memory', bio: 'Mara Voss is a fictional multidisciplinary artist working with code, moving image, and installation. Her practice considers how digital systems shape memory: what gets preserved, what dissolves, and what returns in altered form.\n\nWorking between the browser and the exhibition space, Voss creates quiet computational environments that unfold over time.', portraitPath: '/images/artist-portrait.png', createdAt: now, updatedAt: now }).onConflictDoNothing().run()
db.insert(adminUsers).values({ id: 1, passwordHash: bcrypt.hashSync(password, 12), updatedAt: now }).onConflictDoUpdate({ target: adminUsers.id, set: { passwordHash: bcrypt.hashSync(password, 12), updatedAt: now } }).run()

if (db.select().from(socialLinks).all().length === 0) db.insert(socialLinks).values([
  { platform: 'website', label: 'Website', url: 'https://example.com', sortOrder: 0, enabled: true },
  { platform: 'github', label: 'GitHub', url: 'https://github.com/example', sortOrder: 1, enabled: true },
  { platform: 'email', label: 'Email', url: 'mailto:studio@example.com', sortOrder: 2, enabled: true },
]).run()
if (db.select().from(artworks).all().length === 0) db.insert(artworks).values([
  { slug: 'liminal-field', title: 'Liminal Field', year: 2026, medium: 'Generative image, Archival pigment', type: 'image', mediaPath: '/artworks/liminal-field.png', altText: 'Overlapping cobalt and vermilion fields crossed by fine black orbital lines', description: 'A study of proximity: bodies of color orbit, meet, and resist resolution.', dimensions: '1536 × 1024 px', edition: 'Open edition', software: 'Custom diffusion workflow', sortOrder: 0, status: 'published', createdAt: now, updatedAt: now },
  { slug: 'soft-archive', title: 'Soft Archive', year: 2025, medium: 'Projection, Spatial installation', type: 'image', mediaPath: '/artworks/soft-archive.png', altText: 'A visitor faces a wide amber particle projection in a dark gallery', description: 'Installation documentation from a room-scale work where particles continuously assemble and disperse.', dimensions: 'Variable', duration: 'Continuous', software: 'TouchDesigner, GLSL', hardware: '2 × laser projectors', sortOrder: 1, status: 'published', createdAt: now, updatedAt: now },
  { slug: 'orbital-memory', title: 'Orbital Memory', year: 2025, medium: 'Canvas, JavaScript', type: 'interactive', componentKey: 'orbit', description: 'A browser-native constellation that rewrites its path with every frame.', dimensions: 'Responsive', duration: 'Infinite', programmingLanguage: 'TypeScript, Canvas API', sortOrder: 2, status: 'published', createdAt: now, updatedAt: now },
  { slug: 'red-shift', title: 'Red Shift', year: 2024, medium: 'WebGL, Generative animation', type: 'interactive', componentKey: 'signal', description: 'A signal translated into an unstable choreography of light.', sortOrder: 3, status: 'draft', createdAt: now, updatedAt: now },
  { slug: 'echo-chamber', title: 'Echo Chamber', year: 2024, medium: 'HTML, CSS animation', type: 'interactive', externalUrl: '/works/echo-chamber.html', description: 'Concentric frequencies gather into a field that expands beyond the screen.', sortOrder: 4, status: 'published', createdAt: now, updatedAt: now },
  { slug: 'tidal-loop', title: 'Tidal Loop', year: 2023, medium: 'Digital video, Color, silent', type: 'video', mediaPath: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', description: 'A video-ready catalog entry demonstrating native playback.', duration: '00:30, loop', sortOrder: 5, status: 'published', createdAt: now, updatedAt: now },
]).run()
const liminalField = db.select().from(artworks).where(eq(artworks.slug, 'liminal-field')).get()
if (liminalField && db.select().from(artworkMedia).where(eq(artworkMedia.artworkId, liminalField.id)).all().length === 0) {
  db.insert(artworkMedia).values([
    { artworkId: liminalField.id, type: 'image', path: '/artworks/soft-archive.png', altText: 'An amber particle field projected across two adjoining gallery walls', sortOrder: 0, createdAt: now },
    { artworkId: liminalField.id, type: 'video', path: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', sortOrder: 1, autoplay: true, muted: true, loop: true, controls: true, createdAt: now },
  ]).run()
}
console.log('Database seeded. The ADMIN_PASSWORD value is now the login password.')
