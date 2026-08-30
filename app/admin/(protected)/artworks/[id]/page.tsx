import { notFound } from 'next/navigation'
import { ArtworkForm } from '@/components/admin/ArtworkForm'
import { DeleteArtwork } from '@/components/admin/DeleteArtwork'
import { ArtworkMediaManager } from '@/components/admin/ArtworkMediaManager'
import { getArtworkById, getArtworkMedia } from '@/db/queries'
import { interactiveComponentKeys } from '@/lib/interactive-registry'
export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) { const artwork = getArtworkById(Number((await params).id)); if (!artwork) notFound(); const media = getArtworkMedia(artwork.id); return <main><p className="text-xs uppercase tracking-[.12em] text-black/50">Edit artwork</p><h1 className="mt-2 text-4xl font-medium tracking-[-.04em]">{artwork.title}</h1><ArtworkForm artwork={artwork} componentKeys={[...interactiveComponentKeys]} /><ArtworkMediaManager artworkId={artwork.id} initialItems={media.map(({id,type,path,altText}) => ({id,type,path,altText}))} /><DeleteArtwork id={artwork.id} title={artwork.title} /></main> }
