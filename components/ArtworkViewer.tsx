import Image from 'next/image'
import type { InferSelectModel } from 'drizzle-orm'
import type { artworkMedia, artworks } from '@/db/schema'
import { InteractiveArtwork } from './InteractiveArtwork'

type Artwork = InferSelectModel<typeof artworks>
type MediaItem = InferSelectModel<typeof artworkMedia>

export function ArtworkViewer({ artwork, media = [] }: { artwork: Artwork; media?: MediaItem[] }) {
  const frame = 'relative flex h-[min(78dvh,820px)] min-h-[480px] w-full items-center justify-center overflow-hidden bg-[#e9e7df]'
  const ordered: Array<{ id: string | number; type: 'image'|'video'|'iframe'; path: string; altText?: string|null; autoplay?: boolean; muted?: boolean; loop?: boolean; controls?: boolean }> = []
  if (artwork.type === 'image' && artwork.mediaPath) ordered.push({ id: 'primary', type: 'image', path: artwork.mediaPath, altText: artwork.altText })
  if (artwork.type === 'video' && artwork.mediaPath) ordered.push({ id: 'primary', type: 'video', path: artwork.mediaPath, autoplay: artwork.autoplay, muted: artwork.muted, loop: artwork.loop, controls: artwork.controls })
  if (artwork.type === 'interactive' && artwork.externalUrl) ordered.push({ id: 'primary', type: 'iframe', path: artwork.externalUrl })
  ordered.push(...media.map((item) => ({ id: item.id, type: item.type, path: item.path, altText: item.altText, autoplay: item.autoplay, muted: item.muted, loop: item.loop, controls: item.controls })))
  return <div className="space-y-5">{ordered.map((item,index) => {
    if (item.type === 'image') return <div key={item.id} className={frame}><Image src={item.path} alt={item.altText || `${artwork.title}, image ${index + 1}`} fill priority={index === 0} sizes="(max-width: 840px) 100vw, 800px" unoptimized={item.path.startsWith('/media/') || item.path.startsWith('http')} className="object-contain" /></div>
    if (item.type === 'video') return <div key={item.id} className={frame}><video src={item.path} autoPlay={item.autoplay} muted={item.muted} loop={item.loop} controls={item.controls} playsInline className="h-full w-full object-contain"><p>Your browser does not support HTML video.</p></video></div>
    return <div key={item.id} className={frame}><iframe src={item.path} title={`${artwork.title}, interactive media ${index + 1}`} className="h-full w-full border-0" loading="lazy" sandbox="allow-scripts" /></div>
  })}{ordered.length === 0 && artwork.type === 'interactive' && artwork.componentKey && <div className={frame}><InteractiveArtwork variant={artwork.componentKey} title={artwork.title} /></div>}{ordered.length === 0 && artwork.type === 'external' && artwork.externalUrl && <div className={`${frame} flex-col gap-5 p-10 text-center`}><p>This work is presented on an external site.</p><a className="border border-black px-5 py-3 text-sm" href={artwork.externalUrl} target="_blank" rel="noreferrer">Open artwork ↗</a></div>}{ordered.length === 0 && artwork.type !== 'interactive' && artwork.type !== 'external' && <div className={`${frame} p-8 text-center text-sm text-black/55`}>Media unavailable</div>}</div>
}
