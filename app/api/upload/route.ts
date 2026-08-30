import { issueSignedToken, presignUrl } from '@vercel/blob'
import type { HandleUploadPresignedBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth/session'

const contentTypes = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  video: ['video/mp4', 'video/webm'],
} as const

export async function POST(request: Request) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (process.env.STORAGE_DRIVER !== 'vercel-blob') return NextResponse.json({ error: 'Cloud uploads are not configured.' }, { status: 400 })
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return NextResponse.json({ error: 'The Blob store is not connected to this deployment.' }, { status: 503 })

  try {
    const body = await request.json() as HandleUploadPresignedBody
    if (body.type !== 'blob.generate-presigned-url') throw new Error('Invalid upload request.')
    const { pathname, clientPayload } = body.payload
    const kind = clientPayload === 'video' ? 'video' : clientPayload === 'image' ? 'image' : null
    if (!kind) throw new Error('Invalid upload type.')
    const token = await issueSignedToken({
      pathname,
      operations: ['put'],
      allowedContentTypes: [...contentTypes[kind]],
      maximumSizeInBytes: Number(process.env.MAX_UPLOAD_MB ?? 50) * 1024 * 1024,
    })
    const presignedUrlPayload = await presignUrl(token, { operation: 'put', access: 'public', pathname, addRandomSuffix: true })
    return NextResponse.json({ type: body.type, presignedUrlPayload })
  } catch (error) {
    console.error('Blob presigned-upload generation failed:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
