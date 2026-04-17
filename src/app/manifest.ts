import type { MetadataRoute } from 'next'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: 'Olive Buzz',
    description: APP_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f0e8',
    theme_color: '#808b47',
    orientation: 'portrait-primary',
    categories: ['education', 'social', 'news'],
    lang: 'en',
    icons: [
      {
        src: '/olive-buzz-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/olive-buzz-logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
  }
}
