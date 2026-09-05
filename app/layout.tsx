import type { Metadata } from 'next'
import { BottomNav } from '@/components/BottomNav'
import { siteConfig } from '@/config/site'
import { getProfile } from '@/db/queries'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  const artistName = profile?.artistName ?? siteConfig.artistName
  const siteTitle = `${artistName} — Selected Works`
  const description = profile?.subtitle || `The digital exhibition catalog of artist ${artistName}.`

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: { default: siteTitle, template: `%s — ${artistName}` },
    description,
    alternates: { canonical: '/' },
    openGraph: { title: siteTitle, description, type: 'website', images: ['/artworks/liminal-field.png'] },
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = {
    '--background': siteConfig.backgroundColor,
    '--foreground': siteConfig.textColor,
    '--divider': siteConfig.dividerColor,
    '--nav-height': siteConfig.navHeight,
    '--font-sans': siteConfig.font,
  } as React.CSSProperties
  return <html lang="en" style={theme}><body>{children}<BottomNav /></body></html>
}
