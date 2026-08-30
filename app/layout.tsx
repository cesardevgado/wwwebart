import type { Metadata } from 'next'
import { BottomNav } from '@/components/BottomNav'
import { siteConfig } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: siteConfig.siteTitle, template: `%s — ${siteConfig.artistName}` },
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: { title: siteConfig.siteTitle, description: siteConfig.description, type: 'website', images: ['/artworks/liminal-field.png'] },
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
