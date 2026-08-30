import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { StorageAdapter, StoredFile } from './types'

const rules = {
  image: { mime: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'], ext: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'] },
  video: { mime: ['video/mp4', 'video/webm'], ext: ['.mp4', '.webm'] },
}
export class LocalStorageAdapter implements StorageAdapter {
  private directory = path.resolve(process.env.UPLOAD_DIR ?? './data/uploads')
  async upload(file: File, kind: 'image' | 'video'): Promise<StoredFile> {
    const extension = path.extname(file.name).toLowerCase(); const allowed = rules[kind]
    const max = Number(process.env.MAX_UPLOAD_MB ?? 50) * 1024 * 1024
    if (!allowed.mime.includes(file.type) || !allowed.ext.includes(extension)) throw new Error(`Unsupported ${kind} file type.`)
    if (file.size > max) throw new Error(`File must be smaller than ${process.env.MAX_UPLOAD_MB ?? 50} MB.`)
    const key = `${kind}-${randomUUID()}${extension}`
    await fs.mkdir(this.directory, { recursive: true })
    await fs.writeFile(path.join(this.directory, key), Buffer.from(await file.arrayBuffer()), { flag: 'wx' })
    return { key, publicUrl: this.getPublicUrl(key), bytes: file.size }
  }
  async delete(key: string) {
    if (path.basename(key) !== key) throw new Error('Invalid storage key.')
    try { await fs.unlink(path.join(this.directory, key)) } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
  }
  getPublicUrl(key: string) { return `/media/${encodeURIComponent(key)}` }
}
