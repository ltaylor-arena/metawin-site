import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { pageBySlugQuery, categoriesWithGamesQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import GameCarousel from '@/components/GameCarousel'
import AuthorByline from '@/components/AuthorByline'
import AuthorBio from '@/components/AuthorBio'
import FAQ from '@/components/FAQ'

async function getPage() {
  return await client.fetch(pageBySlugQuery, { slug: 'games' })
}

async function getCategoriesWithGames() {
  return await client.fetch(categoriesWithGamesQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()

  return {
    title: page?.seo?.metaTitle || 'All Games',
    description: page?.seo?.metaDescription || 'Browse all casino games at MetaWin. Slots, table games, crash games, and more.',
    robots: { index: false, follow: false },
  }
}

interface Category {
  _id: string
  title: string
  slug: string
  games: Array<{
    _id: string
    title: string
    slug: string
    categorySlug: string
    thumbnail: any
    provider?: string
    rtp?: number
    volatility?: 'low' | 'medium' | 'high'
  }>
}

export default async function GamesIndexPage() {
  const [page, categories] = await Promise.all([
    getPage(),
    getCategoriesWithGames()
  ])

  // Filter out categories with no games
  const categoriesWithGames: Category[] = categories.filter((cat: Category) => cat.games && cat.games.length > 0)

  const breadcrumbItems = [
    { label: page?.seo?.breadcrumbText || 'All Games' },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <div className="flex flex-col xl:flex-row xl:items-baseline xl:justify-between gap-1 xl:gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {page?.title || 'All Games'}
          </h1>
          {page?.showAuthorInfo && page?.author && (
            <AuthorByline
              author={page.author}
              publishedAt={page.publishedAt}
              updatedAt={page.updatedAt}
            />
          )}
        </div>
        {page?.description && (
          <p className="text-[var(--color-text-muted)] mt-2 max-w-3xl">
            {page.description}
          </p>
        )}
      </header>

      {/* Category Carousels */}
      <div className="pb-8">
        {categoriesWithGames.map((category) => (
          <GameCarousel
            key={category._id}
            title={category.title}
            games={category.games}
            viewAllHref={`/casino/games/${category.slug}/`}
            cardSize="medium"
          />
        ))}

        {categoriesWithGames.length === 0 && (
          <div className="px-4 md:px-6 py-12 text-center">
            <p className="text-[var(--color-text-muted)]">No games found.</p>
          </div>
        )}
      </div>

      {/* Additional Content from Sanity */}
      {page?.content && page.content.length > 0 && (
        <div className="px-4 md:px-6 pb-8">
          <div className="prose prose-invert prose-sm md:prose-base max-w-none">
            <PortableText value={page.content} components={portableTextComponents} />
          </div>
        </div>
      )}

      {/* Author Bio */}
      {page?.showAuthorInfo && page?.author && (
        <div id="author" className="px-4 md:px-6 pb-8">
          <AuthorBio author={page.author} />
        </div>
      )}
    </div>
  )
}
