import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const mime: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm' }
export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const key = (await params).key
  if (path.basename(key) !== key || !mime[path.extname(key).toLowerCase()]) return new NextResponse('Not found', { status: 404 })
  try {
    const body = await fs.readFile(path.join(path.resolve(process.env.UPLOAD_DIR ?? './data/uploads'), key))
    return new NextResponse(body, { headers: { 'Content-Type': mime[path.extname(key).toLowerCase()], 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } })
  } catch { return new NextResponse('Not found', { status: 404 }) }
}
