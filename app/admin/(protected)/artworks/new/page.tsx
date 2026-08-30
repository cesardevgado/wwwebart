import { ArtworkForm } from '@/components/admin/ArtworkForm'
import { interactiveComponentKeys } from '@/lib/interactive-registry'
export default function NewArtworkPage() { return <main><p className="text-xs uppercase tracking-[.12em] text-black/50">Artworks</p><h1 className="mt-2 text-4xl font-medium tracking-[-.04em]">Add artwork</h1><p className="mt-4 text-sm text-black/55">New works begin as drafts unless you choose Published.</p><ArtworkForm componentKeys={[...interactiveComponentKeys]} cloudUploads={process.env.STORAGE_DRIVER === 'vercel-blob'} /></main> }
