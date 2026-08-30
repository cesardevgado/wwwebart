import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const timestamps = {
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
}

export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey(),
  artistName: text('artist_name').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  bio: text('bio').notNull().default(''),
  portraitPath: text('portrait_path'),
  ...timestamps,
})

export const socialLinks = sqliteTable('social_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull().default('other'),
  label: text('label').notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
})

export const artworks = sqliteTable('artworks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  year: integer('year').notNull(),
  medium: text('medium').notNull(),
  type: text('type', { enum: ['image', 'video', 'interactive', 'external'] }).notNull(),
  description: text('description'),
  mediaPath: text('media_path'),
  altText: text('alt_text'),
  externalUrl: text('external_url'),
  sourceUrl: text('source_url'),
  componentKey: text('component_key'),
  dimensions: text('dimensions'),
  duration: text('duration'),
  edition: text('edition'),
  fileSize: text('file_size'),
  dateCreated: text('date_created'),
  software: text('software'),
  hardware: text('hardware'),
  programmingLanguage: text('programming_language'),
  autoplay: integer('autoplay', { mode: 'boolean' }).notNull().default(true),
  muted: integer('muted', { mode: 'boolean' }).notNull().default(true),
  loop: integer('loop', { mode: 'boolean' }).notNull().default(true),
  controls: integer('controls', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  ...timestamps,
})

export const artworkMedia = sqliteTable('artwork_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  artworkId: integer('artwork_id').notNull().references(() => artworks.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['image', 'video', 'iframe'] }).notNull(),
  path: text('path').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  autoplay: integer('autoplay', { mode: 'boolean' }).notNull().default(true),
  muted: integer('muted', { mode: 'boolean' }).notNull().default(true),
  loop: integer('loop', { mode: 'boolean' }).notNull().default(true),
  controls: integer('controls', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey(),
  passwordHash: text('password_hash').notNull(),
  updatedAt: text('updated_at').notNull(),
})
