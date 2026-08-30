import './load-env'
import fs from 'node:fs'
import path from 'node:path'
import { sqlite } from '../db'

const directory = path.resolve('./db/migrations')
for (const file of fs.readdirSync(directory).filter((name) => name.endsWith('.sql')).sort()) {
  sqlite.exec(fs.readFileSync(path.join(directory, file), 'utf8'))
  console.log(`Applied ${file}`)
}
