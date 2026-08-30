import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ArtworkOrder } from '@/components/admin/ArtworkOrder'
import { getAllArtworkRecords } from '@/db/queries'
export default async function AdminArtworksPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const message = (await searchParams).saved ? 'Artwork saved.' : (await searchParams).deleted ? 'Artwork deleted.' : null
  return <main><div className="flex items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[.12em] text-black/50">Collection</p><h1 className="mt-2 text-4xl font-medium tracking-[-.04em]">Artworks</h1></div><Link href="/admin/artworks/new" className="admin-button"><Plus size={16} />Add artwork</Link></div>{message && <p role="status" className="mt-8 border border-green-700 p-3 text-sm text-green-800">{message}</p>}<p className="mt-10 max-w-xl text-sm leading-relaxed text-black/60">Drag rows to curate the public sequence, or use the arrow buttons. Drafts remain visible here but never appear on the public site.</p><ArtworkOrder initialRows={(await getAllArtworkRecords()).map(({id,title,year,status}) => ({id,title,year,status}))} /></main>
}
