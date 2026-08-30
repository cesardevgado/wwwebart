import './load-env'
import fs from 'node:fs/promises'
import path from 'node:path'

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const destination = path.resolve('backups', stamp)
await fs.mkdir(destination, { recursive: true })
await fs.copyFile(path.resolve(process.env.DATABASE_PATH ?? './data/portfolio.db'), path.join(destination, 'portfolio.db'))
await fs.cp(path.resolve(process.env.UPLOAD_DIR ?? './data/uploads'), path.join(destination, 'uploads'), { recursive: true })
console.log(`Backup created at ${destination}`)
