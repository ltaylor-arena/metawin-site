// Image Sitemap Generator
// Generates sitemap-images.xml with all public images
// Revalidates via webhook, cached for 24 hours

import { client } from '@/lib/sanity'
import {
  sitemapGamesQuery,
  sitemapPromotionsQuery,
  sitemapAuthorsQuery,
} from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://metawin.com'

interface SitemapGame {
  title: string
  slug: string
  categorySlug: string
  thumbnail: string | null
  externalThumbnailUrl: string | null
  screenshots: string[] | null
  _updatedAt: string
}

interface SitemapPromotion {
  title: string
  slug: string
  heroImage: string | null
  thumbnail: string | null
  _updatedAt: string
}

interface SitemapAuthor {
  name: string
  slug: string
  image: string | null
  _updatedAt: string
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  // Fetch all content with images - only revalidates when webhook triggers
  const fetchOptions = {
    next: {
      revalidate: false as const, // Only revalidate via webhook
    },
  }

  const [games, promotions, authors] = await Promise.all([
    client.fetch<SitemapGame[]>(sitemapGamesQuery, {}, fetchOptions),
    client.fetch<SitemapPromotion[]>(sitemapPromotionsQuery, {}, fetchOptions),
    client.fetch<SitemapAuthor[]>(sitemapAuthorsQuery, {}, fetchOptions),
  ])

  const urls: string[] = []

  // Add games with images
  for (const game of games) {
    if (!game.slug || !game.categorySlug) continue

    const images: string[] = []

    // Add thumbnail
    const thumbnailUrl = game.thumbnail || game.externalThumbnailUrl
    if (thumbnailUrl) {
      images.push(`
      <image:image>
        <image:loc>${escapeXml(thumbnailUrl)}</image:loc>
        <image:title>${escapeXml(game.title)} - Thumbnail</image:title>
      </image:image>`)
    }

    // Add screenshots
    if (game.screenshots && game.screenshots.length > 0) {
      for (let i = 0; i < game.screenshots.length; i++) {
        const screenshot = game.screenshots[i]
        if (screenshot) {
          images.push(`
      <image:image>
        <image:loc>${escapeXml(screenshot)}</image:loc>
        <image:title>${escapeXml(game.title)} - Screenshot ${i + 1}</image:title>
      </image:image>`)
        }
      }
    }

    if (images.length > 0) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/games/${escapeXml(game.categorySlug)}/${escapeXml(game.slug)}/</loc>${images.join('')}
    </url>`)
    }
  }

  // Add promotions with images
  for (const promo of promotions) {
    if (!promo.slug) continue

    const images: string[] = []

    if (promo.heroImage) {
      images.push(`
      <image:image>
        <image:loc>${escapeXml(promo.heroImage)}</image:loc>
        <image:title>${escapeXml(promo.title)} - Hero</image:title>
      </image:image>`)
    }

    if (promo.thumbnail && promo.thumbnail !== promo.heroImage) {
      images.push(`
      <image:image>
        <image:loc>${escapeXml(promo.thumbnail)}</image:loc>
        <image:title>${escapeXml(promo.title)} - Thumbnail</image:title>
      </image:image>`)
    }

    if (images.length > 0) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/promotions/${escapeXml(promo.slug)}/</loc>${images.join('')}
    </url>`)
    }
  }

  // Add authors with images
  for (const author of authors) {
    if (!author.slug || !author.image) continue

    urls.push(`
    <url>
      <loc>${SITE_URL}/casino/authors/${escapeXml(author.slug)}/</loc>
      <image:image>
        <image:loc>${escapeXml(author.image)}</image:loc>
        <image:title>${escapeXml(author.name)} - Profile Photo</image:title>
      </image:image>
    </url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
