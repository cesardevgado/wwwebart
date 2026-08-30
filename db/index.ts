import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import * as schema from './schema'

const databasePath = path.resolve(process.env.DATABASE_PATH ?? './data/portfolio.db')
fs.mkdirSync(path.dirname(databasePath), { recursive: true })
const sqlite = new Database(databasePath)
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })
export { databasePath, sqlite }
