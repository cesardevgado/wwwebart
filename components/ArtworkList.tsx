import Link from 'next/link'
import type { InferSelectModel } from 'drizzle-orm'
import type { artworks } from '@/db/schema'

type Artwork = InferSelectModel<typeof artworks>
export function ArtworkList({ artworks }: { artworks: Artwork[] }) {
  return (
    <ol className="mt-20 border-t border-[var(--divider)]" aria-label="Artwork archive">
      {artworks.map((artwork) => (
        <li key={artwork.slug} className="border-b border-[var(--divider)]">
          <Link href={`/artwork/${artwork.slug}`} className="group grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-4 text-[15px] leading-snug sm:grid-cols-[minmax(0,1.5fr)_minmax(140px,1fr)_auto]">
            <span className="font-medium group-hover:underline group-hover:underline-offset-4">{artwork.title}</span>
            <span className="hidden text-black/60 sm:block">{artwork.medium}</span>
            <span className="text-black/60">{artwork.year}</span>
            <span className="col-span-2 -mt-3 text-xs text-black/55 sm:hidden">{artwork.medium}</span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
