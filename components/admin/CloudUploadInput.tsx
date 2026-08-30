'use client'

import { upload } from '@vercel/blob/client'
import { useState } from 'react'

export function CloudUploadInput({ id, label, kind, fieldName }: { id: string; label: string; kind: 'image' | 'video'; fieldName: string }) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const accept = kind === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/gif,image/avif'

  return <div>
    <label className="admin-label" htmlFor={id}>{label}</label>
    <input
      className="admin-input pt-3"
      id={id}
      type="file"
      accept={accept}
      onChange={async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setStatus('Uploading…')
        try {
          const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload', clientPayload: kind })
          setUrl(blob.url)
          setStatus('Upload complete.')
        } catch (error) {
          setUrl('')
          setStatus((error as Error).message || 'Upload failed.')
        }
      }}
    />
    <input type="hidden" name={fieldName} value={url} />
    {status && <p role="status" className="mt-2 text-xs text-black/55">{status}</p>}
  </div>
}
