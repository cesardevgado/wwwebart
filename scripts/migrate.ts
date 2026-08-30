import './load-env'
import fs from 'node:fs'
import path from 'node:path'
import { client } from '../db'

const directory = path.resolve('./db/migrations')
async function main() {
  for (const file of fs.readdirSync(directory).filter((name) => name.endsWith('.sql')).sort()) {
    await client.executeMultiple(fs.readFileSync(path.join(directory, file), 'utf8'))
    console.log(`Applied ${file}`)
  }
  client.close()
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
