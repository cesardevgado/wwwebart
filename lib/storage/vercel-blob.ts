import { del, put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import type { StorageAdapter, StoredFile } from './types'

const rules = {
  image: { mime: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'], ext: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'] },
  video: { mime: ['video/mp4', 'video/webm'], ext: ['.mp4', '.webm'] },
}

export class VercelBlobStorageAdapter implements StorageAdapter {
  async upload(file: File, kind: 'image' | 'video'): Promise<StoredFile> {
    const extension = path.extname(file.name).toLowerCase()
    const allowed = rules[kind]
    const max = Number(process.env.MAX_UPLOAD_MB ?? 3) * 1024 * 1024
    if (!allowed.mime.includes(file.type) || !allowed.ext.includes(extension)) throw new Error(`Unsupported ${kind} file type.`)
    if (file.size > max) throw new Error(`File must be smaller than ${process.env.MAX_UPLOAD_MB ?? 3} MB. Use an external media URL for larger files.`)
    const blob = await put(`wwwebart/${kind}-${randomUUID()}${extension}`, file, { access: 'public', addRandomSuffix: false })
    return { key: blob.pathname, publicUrl: blob.url, bytes: file.size }
  }

  async delete(resource: string) { if (this.owns(resource)) await del(resource) }
  getPublicUrl(key: string) { return key }
  owns(resource: string) { return /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(resource) }
}
