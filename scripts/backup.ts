import './load-env'
import fs from 'node:fs/promises'
import path from 'node:path'

async function main() {
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const destination = path.resolve('backups', stamp)
if (process.env.TURSO_DATABASE_URL || process.env.STORAGE_DRIVER === 'vercel-blob') {
  throw new Error('npm run backup is for local installations. Use Turso backups and the Vercel Blob dashboard for a cloud deployment.')
}
await fs.mkdir(destination, { recursive: true })
await fs.copyFile(path.resolve(process.env.DATABASE_PATH ?? './data/portfolio.db'), path.join(destination, 'portfolio.db'))
await fs.cp(path.resolve(process.env.UPLOAD_DIR ?? './data/uploads'), path.join(destination, 'uploads'), { recursive: true })
console.log(`Backup created at ${destination}`)
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
