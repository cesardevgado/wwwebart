import createMDX from '@next/mdx'

const withMDX = createMDX({})

export default withMDX({
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: { formats: ['image/avif', 'image/webp'] },
})
