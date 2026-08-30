import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ArtworkControls } from '@/components/ArtworkControls'
import { ArtworkMetadata } from '@/components/ArtworkMetadata'
import { ArtworkViewer } from '@/components/ArtworkViewer'
import { getArtworkMedia, getProfile, getPublishedArtwork, getPublishedArtworks, getPublishedNeighbors } from '@/db/queries'

export function generateStaticParams() { return getPublishedArtworks().map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const artwork = getPublishedArtwork((await params).slug)
  if (!artwork) return {}
  return { title: artwork.title, description: artwork.description, alternates: { canonical: `/artwork/${artwork.slug}` }, openGraph: { title: artwork.title, description: artwork.description ?? undefined, images: artwork.type === 'image' && artwork.mediaPath ? [artwork.mediaPath] : ['/artworks/liminal-field.png'] } }
}
export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const artwork = getPublishedArtwork((await params).slug)
  if (!artwork) notFound()
  const { previous, next } = getPublishedNeighbors(artwork.slug)
  const profile = getProfile()
  return <main className="page-shell !pt-5">
    <Link href="/" className="mb-4 inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-widest"><ArrowLeft size={15} aria-hidden="true" />Catalog</Link>
    <ArtworkViewer artwork={artwork} media={getArtworkMedia(artwork.id)} />
    <header className="mt-8">
      <p className="m-0 text-xs uppercase tracking-[.12em] text-black/55">{profile?.artistName}</p>
      <h1 className="mt-2 text-[clamp(2rem,5vw,4rem)] font-medium leading-none tracking-[-.05em]">{artwork.title}</h1>
      <p className="mt-3 text-sm">{artwork.year}</p>
      {artwork.description && <p className="mt-8 max-w-2xl text-lg leading-relaxed">{artwork.description}</p>}
    </header>
    <ArtworkMetadata artwork={artwork} />
    <ArtworkControls previous={previous} next={next} />
  </main>
}
