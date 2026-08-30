import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllArtworkRecords, getProfile } from '@/db/queries'
export default function AdminDashboard() {
  const profile = getProfile(); const rows = getAllArtworkRecords()
  return <main><h1 className="text-4xl font-medium tracking-[-.04em]">{profile?.artistName ?? 'Portfolio'}</h1><div className="mt-16 flex items-end justify-between border-b border-[var(--divider)] pb-4"><h2 className="text-xl">Artworks</h2><Link href="/admin/artworks/new" className="inline-flex items-center gap-1 text-sm"><Plus size={15} />Add artwork</Link></div><ul>{rows.map((artwork) => <li key={artwork.id} className="grid grid-cols-[1fr_auto_auto] gap-5 border-b border-[var(--divider)] py-4 text-sm"><span>{artwork.title}</span><span className="capitalize text-black/55">{artwork.status}</span><Link href={`/admin/artworks/${artwork.id}`} className="underline underline-offset-4">Edit</Link></li>)}</ul><Link href="/admin/profile" className="mt-12 inline-block underline underline-offset-4">Edit profile</Link></main>
}
