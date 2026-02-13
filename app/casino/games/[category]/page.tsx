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
import AuthorThoughts from '@/components/AuthorThoughts'
import Callout from '@/components/Callout'
import GameTable from '@/components/GameTable'
import FAQ from '@/components/FAQ'
import Pagination from '@/components/Pagination'
import SortDropdown, { SortOption } from '@/components/SortDropdown'
import ExpandableText from '@/components/ExpandableText'

const DEFAULT_GAMES_PER_PAGE = 24

// Valid sort options
const VALID_SORTS = ['featured', 'a-z', 'z-a', 'rtp'] as const

interface ContentBlock {
  _type: string
  _key: string
  [key: string]: any
}

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
  const baseTitle = categoryData.seo?.metaTitle || categoryData.title
  const baseDescription = categoryData.seo?.metaDescription || `Play the best ${categoryData.title} games at MetaWin Casino.`

  // Build title with page number for pages > 1
  const titleString = currentPage > 1 ? `${baseTitle} - Page ${currentPage}` : baseTitle
  const title = categoryData.seo?.hideKicker ? { absolute: titleString } : titleString

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

// Content Block Renderer Component
function CategoryContentBlock({
  block,
  author,
}: {
  block: ContentBlock
  author?: any
}) {
  switch (block._type) {
    case 'gameRichText':
      if (!block.content || block.content.length === 0) return null
      return (
        <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
          <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6]">
            <PortableText value={block.content} components={portableTextComponents} />
          </div>
        </div>
      )

    case 'gameAuthorThoughts':
      if (!block.content || block.content.length === 0 || !author) return null
      return (
        <AuthorThoughts
          author={author}
          content={block.content}
        />
      )

    case 'callout':
      if (!block.content || block.content.length === 0) return null
      return (
        <Callout
          title={block.title}
          content={block.content}
          variant={block.variant}
        />
      )

    case 'gameTable':
      if (!block.tableData?.headers || block.tableData.headers.length === 0) return null
      return (
        <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
          {block.introText && block.introText.length > 0 && (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none mb-6 prose-p:text-[0.9rem] prose-p:leading-[1.6]">
              <PortableText value={block.introText} components={portableTextComponents} />
            </div>
          )}
          {block.title && (
            <h3 className="text-lg font-semibold text-white mb-4">{block.title}</h3>
          )}
          <GameTable
            tableData={block.tableData}
            caption={block.caption}
            highlightFirstColumn={block.highlightFirstColumn}
            striped={block.striped}
          />
        </div>
      )

    default:
      return null
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
              factChecker={categoryData.factChecker}
              publishedAt={categoryData.publishedAt}
              updatedAt={categoryData.updatedAt}
            />
          </div>
        )}
        {categoryData.description && (
          <div className="mt-4">
            <ExpandableText text={categoryData.description} maxLinesMobile={2} />
          </div>
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
            {games.map((game: any) => (
              <div key={game._id} className="group overflow-visible">
                <div className="game-card overflow-visible">
                  {/* Thumbnail wrapper - provides space for lift effect */}
                  <div className="relative aspect-[3/4] mb-1.5 overflow-visible">
                    {/* Thumbnail - moves up on hover */}
                    <div className="absolute inset-0 transition-transform duration-200 group-hover:-translate-y-2">
                      <div className="relative w-full h-full overflow-hidden rounded">
                        {game.thumbnail ? (
                          <Image
                            src={urlFor(game.thumbnail)
                              .width(352)
                              .height(470)
                              .fit('crop')
                              .auto('format')
                              .url()}
                            alt={game.title}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
                            className="object-cover"
                          />
                        ) : game.externalThumbnailUrl ? (
                          <Image
                            src={game.externalThumbnailUrl}
                            alt={game.title}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                            <span className="text-[var(--color-text-muted)] text-xs">No image</span>
                          </div>
                        )}

                        {/* Badges */}
                        {game.isNew && (
                          <div className="absolute top-2 left-2">
                            <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                              NEW
                            </span>
                          </div>
                        )}

                        {/* Hover Buttons - slide up from bottom */}
                        <div className="absolute inset-x-0 bottom-0 flex flex-col translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                          <a
                            href={signUpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-black text-white hover:text-white text-xs font-semibold text-center"
                          >
                            Play now
                          </a>
                          {game.hasContent && (
                            <Link
                              href={`/casino/games/${category}/${game.slug}/`}
                              className="w-full py-2 bg-white/20 hover:bg-white/30 text-white hover:text-white text-xs font-semibold text-center transition-colors backdrop-blur-sm"
                            >
                              Game Info
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="px-0.5 text-center">
                    <h3 className="text-xs font-medium text-white truncate">
                      {game.title}
                    </h3>
                    {(game.rtp || game.volatility) && (
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        {game.rtp && (
                          <span className="text-[11px]" style={{ color: 'rgb(0, 234, 105)' }}>
                            {game.rtp}%
                          </span>
                        )}
                        {game.volatility && (
                          <img
                            src={`/images/volatility/volatility-${game.volatility}.svg`}
                            alt={`${game.volatility} volatility`}
                            style={{ height: '7px', width: 'auto' }}
                          />
                        )}
                      </div>
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

        {/* Content Blocks - only show on page 1 */}
        {currentPage === 1 && categoryData.content && categoryData.content.length > 0 && (
          <div className="space-y-6 mt-8">
            {categoryData.content.map((block: ContentBlock) => (
              <CategoryContentBlock
                key={block._key}
                block={block}
                author={categoryData.author}
              />
            ))}
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
          <div className="mt-8 space-y-4">
            <AuthorBio author={categoryData.author} />
            {categoryData.factChecker && (
              <AuthorBio
                author={categoryData.factChecker}
                title="Fact Checked By"
                id="fact-checker-info"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
