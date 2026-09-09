'use client'

import { Code2, ImageOff, Video } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type MediaPreviewProps = {
  src: string
  type: 'image' | 'video' | 'iframe'
  alt?: string | null
  compact?: boolean
}

export function MediaPreview(props: MediaPreviewProps) {
  return <Preview key={`${props.type}:${props.src}`} {...props} />
}

function Preview({ src, type, alt, compact = false }: MediaPreviewProps) {
  const [failed, setFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewSeekAttempted = useRef(false)
  const positionVideoPreview = useCallback((video: HTMLVideoElement) => {
    if (previewSeekAttempted.current || video.currentTime !== 0 || video.readyState < 1) return
    previewSeekAttempted.current = true
    try {
      video.currentTime = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(0.1, video.duration / 2) : 0.1
    } catch {
      // Some streams cannot seek; keep their native paused preview.
    }
  }, [])

  useEffect(() => {
    const image = imageRef.current
    const video = videoRef.current
    if ((image?.complete && image.naturalWidth === 0) || video?.error) {
      setFailed(true)
    } else if (video) {
      // Loading may finish before hydration attaches the media event handlers.
      positionVideoPreview(video)
    }
  }, [positionVideoPreview])

  const frameClass = `relative flex shrink-0 items-center justify-center overflow-hidden border border-[var(--divider)] bg-black/[.03] ${compact ? 'h-16 w-20 max-sm:w-16' : 'h-40 w-64 max-w-full'}`
  const unavailable = !src || failed

  return <div className={frameClass}>
    {type === 'iframe' || unavailable ? <div className={`flex flex-col items-center gap-1 px-2 text-center text-black/50 ${compact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
      {type === 'iframe' ? <Code2 size={compact ? 18 : 24} aria-hidden="true" /> : <ImageOff size={compact ? 18 : 24} aria-hidden="true" />}
      <span>{type === 'iframe' ? 'Iframe' : src ? 'Preview unavailable' : 'No preview'}</span>
    </div> : type === 'image' ? <img
      ref={imageRef}
      src={src}
      alt={alt || 'Image preview'}
      className="h-full w-full object-contain"
      draggable={false}
      onError={() => setFailed(true)}
    /> : <>
      <video
        ref={videoRef}
        src={src}
        aria-label={alt || 'Video preview'}
        className={`h-full w-full object-contain${compact ? ' pointer-events-none' : ''}`}
        draggable={false}
        muted
        playsInline
        preload="metadata"
        controls={!compact}
        onLoadedMetadata={(event) => positionVideoPreview(event.currentTarget)}
        onError={() => setFailed(true)}
      />
      {compact && <span className="pointer-events-none absolute bottom-1 right-1 rounded-sm bg-black/65 p-0.5 text-white"><Video size={12} aria-hidden="true" /></span>}
    </>}
  </div>
}
