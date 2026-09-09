'use client'

import { uploadPresigned } from '@vercel/blob/client'
import { useEffect, useRef, useState } from 'react'

export function CloudUploadInput({ id, label, kind, fieldName, onFileChange }: {
  id: string
  label: string
  kind: 'image' | 'video'
  fieldName: string
  onFileChange?: (file: File | null) => void
}) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadRequest = useRef(0)
  const onFileChangeRef = useRef(onFileChange)
  const accept = kind === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/gif,image/avif'

  useEffect(() => {
    onFileChangeRef.current = onFileChange
  }, [onFileChange])

  useEffect(() => {
    const form = inputRef.current?.form
    const reset = () => {
      uploadRequest.current += 1
      setUrl('')
      setStatus('')
      onFileChangeRef.current?.(null)
    }
    form?.addEventListener('reset', reset)
    return () => {
      uploadRequest.current += 1
      form?.removeEventListener('reset', reset)
    }
  }, [])

  return <div>
    <label className="admin-label" htmlFor={id}>{label}</label>
    <input
      className="admin-input pt-3"
      id={id}
      ref={inputRef}
      type="file"
      accept={accept}
      onChange={async (event) => {
        const file = event.target.files?.[0] ?? null
        const request = ++uploadRequest.current
        setUrl('')
        setStatus('')
        onFileChangeRef.current?.(file)
        if (!file) return
        setStatus('Uploading…')
        try {
          const blob = await uploadPresigned(file.name, file, { access: 'public', handleUploadUrl: '/api/upload', clientPayload: kind })
          if (request !== uploadRequest.current) return
          setUrl(blob.url)
          setStatus('Upload complete.')
        } catch (error) {
          if (request !== uploadRequest.current) return
          setUrl('')
          setStatus((error as Error).message || 'Upload failed.')
          onFileChangeRef.current?.(null)
        }
      }}
    />
    <input type="hidden" name={fieldName} value={url} />
    {status && <p role="status" className="mt-2 text-xs text-black/55">{status}</p>}
  </div>
}
