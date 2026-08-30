const deploymentUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://example.com'

export const siteConfig = {
  artistName: 'Mara Voss',
  subtitle: 'Computational studies in light, time, and memory',
  siteTitle: 'Mara Voss — Selected Works',
  description: 'The digital exhibition catalog of artist Mara Voss.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? deploymentUrl,
  font: 'Arial, Helvetica, sans-serif',
  backgroundColor: '#f4f3ef',
  textColor: '#11110f',
  dividerColor: '#cbc9c1',
  navHeight: '72px',
  links: {
    website: 'https://example.com',
    github: 'https://github.com/example',
    instagram: 'https://instagram.com',
    email: 'studio@example.com',
  },
} as const
