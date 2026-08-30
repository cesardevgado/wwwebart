import { ArtworkList } from '@/components/ArtworkList'
import { getProfile, getPublishedArtworks } from '@/db/queries'

export default function HomePage() {
  const profile = getProfile()
  return (
    <main className="page-shell">
      <header>
        <h1 className="display-title">{profile?.artistName ?? 'Artist Name'}</h1>
        <p className="eyebrow">{profile?.subtitle}</p>
      </header>
      <ArtworkList artworks={getPublishedArtworks()} />
    </main>
  )
}
