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
  sitemapBlogPostsQuery,
  sitemapBlogCategoriesQuery,
  sitemapGuidesQuery,
  sitemapGuideCategoriesQuery,
} from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://metawin.com'

// Sitemap configuration by content type
const SITEMAP_CONFIG = {
  homepage: { changefreq: 'daily', priority: '1.0' },
  gamesIndex: { changefreq: 'daily', priority: '0.9' },
  promotionsIndex: { changefreq: 'daily', priority: '0.8' },
  authorsIndex: { changefreq: 'monthly', priority: '0.5' },
  blogIndex: { changefreq: 'daily', priority: '0.8' },
  page: { changefreq: 'weekly', priority: '0.6' },
  category: { changefreq: 'weekly', priority: '0.8' },
  game: { changefreq: 'monthly', priority: '0.6' },
  promotion: { changefreq: 'weekly', priority: '0.7' },
  author: { changefreq: 'monthly', priority: '0.5' },
  blogPost: { changefreq: 'weekly', priority: '0.7' },
  blogCategory: { changefreq: 'weekly', priority: '0.6' },
  guidesIndex: { changefreq: 'weekly', priority: '0.8' },
  guide: { changefreq: 'monthly', priority: '0.7' },
  guideCategory: { changefreq: 'weekly', priority: '0.6' },
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

interface SitemapBlogPost {
  title: string
  slug: string
  _updatedAt: string
}

interface SitemapBlogCategory {
  slug: string
  _updatedAt: string
}

interface SitemapGuide {
  title: string
  slug: string
  _updatedAt: string
}

interface SitemapGuideCategory {
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

  const [pages, games, categories, promotions, authors, blogPosts, blogCategories, guides, guideCategories] = await Promise.all([
    client.fetch<SitemapPage[]>(sitemapPagesQuery, {}, fetchOptions),
    client.fetch<SitemapGame[]>(sitemapGamesQuery, {}, fetchOptions),
    client.fetch<SitemapCategory[]>(sitemapCategoriesQuery, {}, fetchOptions),
    client.fetch<SitemapPromotion[]>(sitemapPromotionsQuery, {}, fetchOptions),
    client.fetch<SitemapAuthor[]>(sitemapAuthorsQuery, {}, fetchOptions),
    client.fetch<SitemapBlogPost[]>(sitemapBlogPostsQuery, {}, fetchOptions),
    client.fetch<SitemapBlogCategory[]>(sitemapBlogCategoriesQuery, {}, fetchOptions),
    client.fetch<SitemapGuide[]>(sitemapGuidesQuery, {}, fetchOptions),
    client.fetch<SitemapGuideCategory[]>(sitemapGuideCategoriesQuery, {}, fetchOptions),
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

  // Add promo code page (consolidated promotions)
  const latestPromoUpdate = promotions.length > 0
    ? promotions.reduce((latest, p) => p._updatedAt > latest ? p._updatedAt : latest, promotions[0]._updatedAt)
    : new Date().toISOString()

  urls.push(`
    <url>
      <loc>${SITE_URL}/casino/promo-code/</loc>
      <lastmod>${formatDate(latestPromoUpdate)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.promotionsIndex.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.promotionsIndex.priority}</priority>
    </url>`)

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

  // Add blog index
  const latestBlogUpdate = blogPosts.length > 0
    ? blogPosts.reduce((latest, p) => p._updatedAt > latest ? p._updatedAt : latest, blogPosts[0]._updatedAt)
    : new Date().toISOString()

  urls.push(`
    <url>
      <loc>${SITE_URL}/casino/blog/</loc>
      <lastmod>${formatDate(latestBlogUpdate)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.blogIndex.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.blogIndex.priority}</priority>
    </url>`)

  // Add blog categories
  for (const blogCat of blogCategories) {
    if (blogCat.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/blog/category/${escapeXml(blogCat.slug)}/</loc>
      <lastmod>${formatDate(blogCat._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.blogCategory.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.blogCategory.priority}</priority>
    </url>`)
    }
  }

  // Add blog posts
  for (const post of blogPosts) {
    if (post.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/blog/${escapeXml(post.slug)}/</loc>
      <lastmod>${formatDate(post._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.blogPost.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.blogPost.priority}</priority>
    </url>`)
    }
  }

  // Add guides index
  const latestGuideUpdate = guides.length > 0
    ? guides.reduce((latest, g) => g._updatedAt > latest ? g._updatedAt : latest, guides[0]._updatedAt)
    : new Date().toISOString()

  urls.push(`
    <url>
      <loc>${SITE_URL}/casino/guides/</loc>
      <lastmod>${formatDate(latestGuideUpdate)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.guidesIndex.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.guidesIndex.priority}</priority>
    </url>`)

  // Add guide categories
  for (const guideCat of guideCategories) {
    if (guideCat.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/guides/category/${escapeXml(guideCat.slug)}/</loc>
      <lastmod>${formatDate(guideCat._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.guideCategory.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.guideCategory.priority}</priority>
    </url>`)
    }
  }

  // Add guides
  for (const guide of guides) {
    if (guide.slug) {
      urls.push(`
    <url>
      <loc>${SITE_URL}/casino/guides/${escapeXml(guide.slug)}/</loc>
      <lastmod>${formatDate(guide._updatedAt)}</lastmod>
      <changefreq>${SITEMAP_CONFIG.guide.changefreq}</changefreq>
      <priority>${SITEMAP_CONFIG.guide.priority}</priority>
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
