import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { categoriesWithGamesQuery } from '@/lib/queries'
import Breadcrumbs from '@/components/Breadcrumbs'
import GameCarousel from '@/components/GameCarousel'

async function getCategoriesWithGames() {
  return await client.fetch(categoriesWithGamesQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Games',
    description: 'Browse all casino games at MetaWin. Slots, table games, crash games, and more.',
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
  const categories: Category[] = await getCategoriesWithGames()

  // Filter out categories with no games
  const categoriesWithGames = categories.filter(cat => cat.games && cat.games.length > 0)

  const breadcrumbItems = [
    { label: 'All Games' },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          All Games
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2 max-w-3xl">
          Browse our complete collection of casino games across all categories.
        </p>
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
    </div>
  )
}
