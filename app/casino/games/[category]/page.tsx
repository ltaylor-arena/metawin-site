import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { categoryBySlugQuery, getGamesByCategoryPaginatedQuery, gamesByCategoryCountQuery, allCategoriesQuery, siteSettingsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import AuthorByline from '@/components/AuthorByline'
import AuthorBio from '@/components/AuthorBio'
import FAQ from '@/components/FAQ'
import Pagination from '@/components/Pagination'
import SortDropdown, { SortOption } from '@/components/SortDropdown'

const DEFAULT_GAMES_PER_PAGE = 24

// Valid sort options
const VALID_SORTS = ['featured', 'a-z', 'z-a', 'rtp'] as const

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

async function getCategory(slug: string) {
  return await client.fetch(categoryBySlugQuery, { slug })
}

async function getGamesByCategory(categorySlug: string, start: number, end: number, sort: string = 'a-z') {
  const query = getGamesByCategoryPaginatedQuery(sort)
  return await client.fetch(query, { categorySlug, start, end })
}

async function getGamesCount(categorySlug: string) {
  return await client.fetch(gamesByCategoryCountQuery, { categorySlug })
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

export async function generateStaticParams() {
  const categories = await client.fetch(allCategoriesQuery)
  return categories.map((category: { slug: string }) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const { page } = await searchParams
  const categoryData = await getCategory(category)

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    }
  }

  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const gamesPerPage = categoryData.gamesPerPage || DEFAULT_GAMES_PER_PAGE
  const totalGames = await getGamesCount(category)
  const totalPages = Math.ceil(totalGames / gamesPerPage)

  const basePath = `/casino/games/${category}/`
  const baseTitle = categoryData.seo?.metaTitle || `${categoryData.title} | MetaWin Casino`
  const baseDescription = categoryData.seo?.metaDescription || `Play the best ${categoryData.title} games at MetaWin Casino.`

  // Build title with page number for pages > 1
  const title = currentPage > 1 ? `${baseTitle} - Page ${currentPage}` : baseTitle

  // Build canonical URL - intentionally excludes sort param to avoid duplicate content
  // All sort variations should point to the same canonical (default sort)
  const canonicalUrl = currentPage === 1 ? basePath : `${basePath}?page=${currentPage}`

  const alternates: Metadata['alternates'] = {
    canonical: canonicalUrl,
  }

  // Build link headers for prev/next (for SEO)
  const otherMeta: Array<{ rel: string; href: string }> = []

  if (currentPage > 1) {
    const prevUrl = currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`
    otherMeta.push({ rel: 'prev', href: prevUrl })
  }

  if (currentPage < totalPages) {
    otherMeta.push({ rel: 'next', href: `${basePath}?page=${currentPage + 1}` })
  }

  return {
    title,
    description: baseDescription,
    alternates,
    robots: { index: true, follow: true },
    other: otherMeta.length > 0 ? Object.fromEntries(otherMeta.map(m => [m.rel, m.href])) : undefined,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const { page, sort } = await searchParams

  const [categoryData, siteSettings] = await Promise.all([
    getCategory(category),
    getSiteSettings()
  ])

  if (!categoryData) {
    notFound()
  }

  // Determine if this is the slots category
  const isSlots = category === 'slots'

  // Validate and set sort option
  const defaultSort = isSlots ? 'featured' : 'a-z'
  const currentSort = (sort && VALID_SORTS.includes(sort as any)) ? sort as SortOption : defaultSort

  // For non-slots categories, don't allow slots-only sort options
  const validSort = (!isSlots && currentSort === 'featured')
    ? 'a-z'
    : currentSort

  // Pagination setup
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const gamesPerPage = categoryData.gamesPerPage || DEFAULT_GAMES_PER_PAGE
  const start = (currentPage - 1) * gamesPerPage
  const end = start + gamesPerPage

  // Fetch games and count in parallel
  const [games, totalGames] = await Promise.all([
    getGamesByCategory(category, start, end, validSort),
    getGamesCount(category)
  ])

  const totalPages = Math.ceil(totalGames / gamesPerPage)
  const signUpUrl = siteSettings?.signUpUrl || 'https://metawin.com/signup'
  const basePath = `/casino/games/${category}/`

  // Redirect to page 1 if page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    notFound()
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Games', href: '/casino/games/' },
    { label: categoryData.seo?.breadcrumbText || categoryData.title },
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
          {categoryData.h1 || categoryData.title}
          {currentPage > 1 && (
            <span className="text-[var(--color-text-muted)] font-normal text-lg md:text-xl ml-2">
              | Page {currentPage}
            </span>
          )}
        </h1>
        {categoryData.showAuthorInfo && categoryData.author && (
          <div className="mt-3 pb-3 border-b border-[var(--color-border)]">
            <AuthorByline
              author={categoryData.author}
              publishedAt={categoryData.publishedAt}
              updatedAt={categoryData.updatedAt}
            />
          </div>
        )}
        {categoryData.description && (
          <p className="text-[var(--color-text-muted)] mt-4">
            {categoryData.description}
          </p>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        {/* Sort Controls */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] py-4 mb-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            {totalGames.toLocaleString()} games
          </p>
          <SortDropdown isSlots={isSlots} currentSort={validSort} />
        </div>

        {/* Games Grid */}
        {games && games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {games.map((game: any) => (
              <div key={game._id} className="group">
                <div className="game-card">
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-bg-secondary)]">
                    {game.thumbnail ? (
                      <Image
                        src={urlFor(game.thumbnail)
                          .width(400)
                          .height(534)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : game.externalThumbnailUrl ? (
                      <Image
                        src={game.externalThumbnailUrl}
                        alt={game.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                        No Image
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {game.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                          NEW
                        </span>
                      )}
                      {game.isFeatured && (
                        <span className="px-2 py-1 bg-[var(--color-accent-blue)] text-white text-xs font-bold rounded">
                          HOT
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay with Action Buttons */}
                    <div className="game-card-overlay flex flex-col items-center justify-center gap-2 px-3">
                      <a
                        href={signUpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-3 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white hover:text-white text-sm font-semibold rounded-lg text-center transition-colors"
                      >
                        Play Now
                      </a>
                      {game.hasContent && (
                        <Link
                          href={`/casino/games/${category}/${game.slug}/`}
                          className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 text-white hover:text-white text-xs font-medium rounded-lg text-center transition-colors backdrop-blur-sm"
                        >
                          Game Info
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="mt-2 px-1">
                    <h3 className="text-sm font-medium text-white truncate">
                      {game.title}
                    </h3>
                    {(game.rtp || game.volatility) && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {game.rtp && (
                          <span className="text-[12px]" style={{ color: 'rgb(0, 234, 105)' }}>
                            RTP {game.rtp}%
                          </span>
                        )}
                        {game.volatility && (
                          <img
                            src={`/images/volatility/volatility-${game.volatility}.svg`}
                            alt={`${game.volatility} volatility`}
                            style={{ height: '8px', width: 'auto' }}
                          />
                        )}
                      </div>
                    )}
                    {game.provider && (
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {game.provider}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No games found in this category.</p>
          </div>
        )}

        {/* Games count */}
        {totalGames > 0 && (
          <p className="text-sm text-[var(--color-text-muted)] text-center mt-6">
            Showing {start + 1}–{Math.min(end, totalGames)} of {totalGames} games
          </p>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
          preserveParams={validSort !== defaultSort ? { sort: validSort } : {}}
        />

        {/* Additional Content - only show on page 1 */}
        {currentPage === 1 && categoryData.additionalContent && categoryData.additionalContent.length > 0 && (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none mt-8">
            <PortableText value={categoryData.additionalContent} components={portableTextComponents} />
          </div>
        )}

        {/* FAQ Section - only show on page 1 */}
        {currentPage === 1 && categoryData.faq && categoryData.faq.length > 0 && (
          <div className="mt-8">
            <FAQ
              heading={`${categoryData.title} FAQ`}
              items={categoryData.faq}
            />
          </div>
        )}

        {/* Author Bio - only show on page 1 */}
        {currentPage === 1 && categoryData.showAuthorInfo && categoryData.author && (
          <div id="author" className="mt-8">
            <AuthorBio author={categoryData.author} />
          </div>
        )}
      </div>
    </div>
  )
}
