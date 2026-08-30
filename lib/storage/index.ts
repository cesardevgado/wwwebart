import { LocalStorageAdapter } from './local'
import { VercelBlobStorageAdapter } from './vercel-blob'

if (process.env.VERCEL && process.env.STORAGE_DRIVER !== 'vercel-blob') {
  throw new Error('Set STORAGE_DRIVER=vercel-blob and connect a Blob store before deploying to Vercel.')
}

export const storage = process.env.STORAGE_DRIVER === 'vercel-blob'
  ? new VercelBlobStorageAdapter()
  : new LocalStorageAdapter()
