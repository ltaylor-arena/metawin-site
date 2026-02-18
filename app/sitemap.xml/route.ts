// URL Sitemap Generator
// Generates sitemap.xml with all public URLs
// Revalidates via webhook, cached for 24 hours

import { client } from '@/lib/sanity'
import {
  sitemapPagesQuery,
  sitemapGamesQuery,
  sitemapCategoriesQuery,
  sitemapPromotionsQuery,
  sitemapAuthorsQuery,
} from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://metawin.com'

// Sitemap configuration by content type
const SITEMAP_CONFIG = {
  homepage: { changefreq: 'daily', priority: '1.0' },
  gamesIndex: { changefreq: 'daily', priority: '0.9' },
  promotionsIndex: { changefreq: 'daily', priority: '0.8' },
  authorsIndex: { changefreq: 'monthly', priority: '0.5' },
  page: { changefreq: 'weekly', priority: '0.6' },
  category: { changefreq: 'weekly', priority: '0.8' },
  game: { changefreq: 'monthly', priority: '0.6' },
  promotion: { changefreq: 'weekly', priority: '0.7' },
  author: { changefreq: 'monthly', priority: '0.5' },
}

interface SitemapPage {
  slug: string
  isHomepage: boolean
  _updatedAt: string
}

interface SitemapGame {
  title: string
  slug: string
  categorySlug: string
  _updatedAt: string
}

interface SitemapCategory {
  slug: string
  _updatedAt: string
}

interface SitemapPromotion {
  title: string
  slug: string
  _updatedAt: string
}

interface SitemapAuthor {
  name: string
  slug: string
  _updatedAt: string
}

function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0]
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
  // Fetch all content - only revalidates when webhook triggers
  const fetchOptions = {
    next: {
      revalidate: false as const, // Only revalidate via webhook
    },
  }

  const [pages, games, categories, promotions, authors] = await Promise.all([
    client.fetch<SitemapPage[]>(sitemapPagesQuery, {}, fetchOptions),
    client.fetch<SitemapGame[]>(sitemapGamesQuery, {}, fetchOptions),
    client.fetch<SitemapCategory[]>(sitemapCategoriesQuery, {}, fetchOptions),
    client.fetch<SitemapPromotion[]>(sitemapPromotionsQuery, {}, fetchOptions),
    client.fetch<SitemapAuthor[]>(sitemapAuthorsQuery, {}, fetchOptions),
  ])

  const urls: string[] = []

  // Add pages
  for (const page of pages) {
    if (page.isHomepage) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/</loc>
      <lastmod>${formatDate(page._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.homepage.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.homepage.priority}</priority>
    </url>`)
    } else if (page.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/${escapeXml(page.slug)}/</loc>
      <lastmod>${formatDate(page._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.page.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.page.priority}</priority>
    </url>`)
    }
  }

  // Add games index
  const latestGameUpdate = games.length > 0
    ? games.reduce((latest, g) => g._updatedAt > latest ? g._updatedAt : latest, games[0]._updatedAt)
    : new Date().toISOString()

  urls.push(`
    <url>
      <loc>${SITE_URL}/casino/games/</loc>
      <lastmod>${formatDate(latestGameUpdate)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.gamesIndex.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.gamesIndex.priority}</priority>
    </url>`)

  // Add categories
  for (const category of categories) {
    if (category.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/games/${escapeXml(category.slug)}/</loc>
      <lastmod>${formatDate(category._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.category.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.category.priority}</priority>
    </url>`)
    }
  }

  // Add games
  for (const game of games) {
    if (game.slug && game.categorySlug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/games/${escapeXml(game.categorySlug)}/${escapeXml(game.slug)}/</loc>
      <lastmod>${formatDate(game._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.game.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.game.priority}</priority>
    </url>`)
    }
  }

  // Add promotions index
  const latestPromoUpdate = promotions.length > 0
    ? promotions.reduce((latest, p) => p._updatedAt > latest ? p._updatedAt : latest, promotions[0]._updatedAt)
    : new Date().toISOString()

  urls.push(`
    <url>
      <loc>${SITE_URL}/casino/promotions/</loc>
      <lastmod>${formatDate(latestPromoUpdate)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.promotionsIndex.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.promotionsIndex.priority}</priority>
    </url>`)

  // Add promotions
  for (const promo of promotions) {
    if (promo.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/promotions/${escapeXml(promo.slug)}/</loc>
      <lastmod>${formatDate(promo._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.promotion.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.promotion.priority}</priority>
    </url>`)
    }
  }

  // Add authors index
  const latestAuthorUpdate = authors.length > 0
    ? authors.reduce((latest, a) => a._updatedAt > latest ? a._updatedAt : latest, authors[0]._updatedAt)
    : new Date().toISOString()

  urls.push(`
    <url>
      <loc>${SITE_URL}/casino/authors/</loc>
      <lastmod>${formatDate(latestAuthorUpdate)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.authorsIndex.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.authorsIndex.priority}</priority>
    </url>`)

  // Add authors
  for (const author of authors) {
    if (author.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/authors/${escapeXml(author.slug)}/</loc>
      <lastmod>${formatDate(author._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.author.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.author.priority}</priority>
    </url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
