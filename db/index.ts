import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import fs from 'node:fs'
import path from 'node:path'
import * as schema from './schema'

const configuredUrl = process.env.TURSO_DATABASE_URL
if (process.env.VERCEL && !configuredUrl) throw new Error('Connect a Turso database before deploying to Vercel.')
const databasePath = path.resolve(process.env.DATABASE_PATH ?? './data/portfolio.db')
if (!configuredUrl) fs.mkdirSync(path.dirname(databasePath), { recursive: true })
const databaseUrl = configuredUrl ?? `file:${databasePath}`
const client = createClient({ url: databaseUrl, authToken: process.env.TURSO_AUTH_TOKEN })

export const db = drizzle(client, { schema })
export { client, databasePath, databaseUrl }
