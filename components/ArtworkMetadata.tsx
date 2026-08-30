import { ArrowUpRight } from 'lucide-react'
import type { InferSelectModel } from 'drizzle-orm'
import type { artworks } from '@/db/schema'

type Artwork = InferSelectModel<typeof artworks>
export function ArtworkMetadata({ artwork }: { artwork: Artwork }) {
  const rows = [
    ['Medium', artwork.medium], ['Dimensions', artwork.dimensions], ['Duration', artwork.duration],
    ['Edition', artwork.edition], ['Date created', artwork.dateCreated ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(`${artwork.dateCreated}T12:00:00`)) : undefined],
    ['File size', artwork.fileSize], ['Software', artwork.software], ['Hardware', artwork.hardware], ['Language', artwork.programmingLanguage],
  ].filter((row): row is [string, string] => Boolean(row[1]))
  const links = [['View source', artwork.sourceUrl], ['View artwork', artwork.externalUrl]].filter((row): row is [string, string] => Boolean(row[1]))
  return <dl className="mt-14 border-t border-[var(--divider)] text-sm">
    {rows.map(([label, value]) => <div key={label} className="grid grid-cols-[120px_1fr] gap-5 border-b border-[var(--divider)] py-3.5 sm:grid-cols-[180px_1fr]"><dt className="text-[11px] uppercase tracking-[.1em] text-black/55">{label}</dt><dd className="m-0 text-right sm:text-left">{value}</dd></div>)}
    {links.map(([label, url]) => <div key={label} className="grid grid-cols-[120px_1fr] gap-5 border-b border-[var(--divider)] py-3.5 sm:grid-cols-[180px_1fr]"><dt className="text-[11px] uppercase tracking-[.1em] text-black/55">{label}</dt><dd className="m-0 text-right sm:text-left"><a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4">Open <ArrowUpRight size={13} aria-hidden="true" /></a></dd></div>)}
  </dl>
}
