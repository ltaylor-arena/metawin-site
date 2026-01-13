import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { categoryBySlugQuery, gamesByCategoryQuery, allCategoriesQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import AuthorByline from '@/components/AuthorByline'
import AuthorBio from '@/components/AuthorBio'
import FAQ from '@/components/FAQ'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

async function getCategory(slug: string) {
  return await client.fetch(categoryBySlugQuery, { slug })
}

async function getGamesByCategory(categorySlug: string) {
  return await client.fetch(gamesByCategoryQuery, { categorySlug })
}

export async function generateStaticParams() {
  const categories = await client.fetch(allCategoriesQuery)
  return categories.map((category: { slug: string }) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getCategory(category)

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: categoryData.seo?.metaTitle || `${categoryData.title} | MetaWin Casino`,
    description: categoryData.seo?.metaDescription || `Play the best ${categoryData.title} games at MetaWin Casino.`,
    robots: { index: false, follow: false },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryData = await getCategory(category)

  if (!categoryData) {
    notFound()
  }

  const games = await getGamesByCategory(category)

  // Build breadcrumb items
  const breadcrumbItems = [
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
        <div className="flex flex-col xl:flex-row xl:items-baseline xl:justify-between gap-1 xl:gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {categoryData.title}
          </h1>
          {categoryData.showAuthorInfo && categoryData.author && (
            <AuthorByline
              author={categoryData.author}
              publishedAt={categoryData.publishedAt}
              updatedAt={categoryData.updatedAt}
            />
          )}
        </div>
        {categoryData.description && (
          <p className="text-[var(--color-text-muted)] mt-2 max-w-3xl">
            {categoryData.description}
          </p>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        {/* Games Grid */}
        {games && games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {games.map((game: any) => (
              <Link
                key={game._id}
                href={`/casino/games/${category}/${game.slug}/`}
                className="group"
              >
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

                    {/* Hover Overlay */}
                    <div className="game-card-overlay flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No games found in this category.</p>
          </div>
        )}

        {/* Additional Content */}
        {categoryData.additionalContent && categoryData.additionalContent.length > 0 && (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none mt-8">
            <PortableText value={categoryData.additionalContent} components={portableTextComponents} />
          </div>
        )}

        {/* FAQ Section */}
        {categoryData.faq && categoryData.faq.length > 0 && (
          <div className="mt-8">
            <FAQ
              heading={`${categoryData.title} FAQ`}
              items={categoryData.faq}
            />
          </div>
        )}

        {/* Author Bio */}
        {categoryData.showAuthorInfo && categoryData.author && (
          <div id="author" className="mt-8">
            <AuthorBio author={categoryData.author} />
          </div>
        )}
      </div>
    </div>
  )
}
