export type ArtworkType = 'image' | 'video' | 'interactive' | 'iframe'

export type Artwork = {
  title: string
  slug: string
  year: number
  medium: string[]
  type: ArtworkType
  src?: string
  poster?: string
  component?: string
  description?: string
  alt?: string
  dimensions?: string
  duration?: string
  edition?: string
  dateCreated?: string
  software?: string
  hardware?: string
  programmingLanguage?: string
  sourceUrl?: string
  externalUrl?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  order: number
  content: string
}
