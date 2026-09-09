'use client'

import { useEffect, useRef, useState } from 'react'
import { CloudUploadInput } from './CloudUploadInput'
import { MediaPreview } from './MediaPreview'

type Props = {
  type: 'image' | 'video'
  cloudUploads: boolean
  fileId: string
  fileName: string
  uploadedFieldName: string
  urlId: string
  urlName: string
  uploadLabel: string
  defaultUrl?: string
  alt?: string | null
}

export function MediaUploadFields({ type, cloudUploads, fileId, fileName, uploadedFieldName, urlId, urlName, uploadLabel, defaultUrl = '', alt }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const [mediaUrl, setMediaUrl] = useState(defaultUrl)
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    if (!file) { setFileUrl(''); return }
    const url = URL.createObjectURL(file)
    setFileUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    const form = container.current?.closest('form')
    const reset = () => { setFile(null); setMediaUrl(defaultUrl) }
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  }, [defaultUrl])

  const previewUrl = fileUrl || mediaUrl.trim() || defaultUrl

  return <div ref={container} className={`grid grid-cols-1 gap-5 ${previewUrl ? 'sm:grid-cols-[16rem_minmax(0,1fr)]' : ''}`}>
    {previewUrl && <div><p className="admin-label">Media preview</p><MediaPreview src={previewUrl} type={type} alt={alt} /></div>}
    <div className="min-w-0 space-y-4">
      {cloudUploads ? <CloudUploadInput id={fileId} label={uploadLabel} kind={type} fieldName={uploadedFieldName} onFileChange={setFile} /> : <div>
        <label className="admin-label" htmlFor={fileId}>{uploadLabel}</label>
        <input className="admin-input pt-3" id={fileId} name={fileName} type="file" accept={type === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/gif,image/avif'} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </div>}
      <div><label className="admin-label" htmlFor={urlId}>Or media URL</label><input className="admin-input" id={urlId} name={urlName} defaultValue={defaultUrl} placeholder="https://…" onChange={(event) => setMediaUrl(event.target.value)} /></div>
    </div>
  </div>
}
