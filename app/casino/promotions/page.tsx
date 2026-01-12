import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { allPromotionsQuery, pageBySlugQuery, promotionsByTypeQuery } from '@/lib/queries'
import Breadcrumbs from '@/components/Breadcrumbs'

interface PageData {
  _id: string
  title: string
  description?: string
  slug: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    breadcrumbText?: string
  }
}

interface Promotion {
  _id: string
  title: string
  slug: string
  promotionType: string
  flair?: string
  flairColor?: 'blue' | 'green' | 'red' | 'yellow'
  excerpt?: string
  startDate?: string
  endDate?: string
  isFeatured: boolean
  thumbnail?: string
}

interface PromotionsPageProps {
  searchParams: Promise<{ type?: string }>
}

// Helper to get flair color classes
function getFlairColorClasses(color?: string, hasFlair?: boolean): string {
  if (!hasFlair) {
    // Default outline style for promotion type (no flair)
    return 'border border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-transparent'
  }
  switch (color) {
    case 'green':
      return 'bg-emerald-500 text-white'
    case 'red':
      return 'bg-red-500 text-white'
    case 'yellow':
      return 'bg-amber-400 text-black'
    case 'blue':
    default:
      return 'bg-[var(--color-accent-blue)] text-white'
  }
}

async function getPageData(): Promise<PageData | null> {
  return await client.fetch(pageBySlugQuery, { slug: 'promotions' })
}

async function getPromotions(type?: string): Promise<Promotion[]> {
  if (type) {
    return await client.fetch(promotionsByTypeQuery, { type })
  }
  return await client.fetch(allPromotionsQuery)
}

async function getAllPromotionTypes(): Promise<string[]> {
  const allPromos = await client.fetch<Promotion[]>(allPromotionsQuery)
  const types = allPromos.map((p) => p.promotionType).filter(Boolean)
  return [...new Set(types)] as string[]
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData()

  return {
    title: page?.seo?.metaTitle || page?.title || 'Promotions | MetaWin Casino',
    description: page?.seo?.metaDescription || 'Discover the latest promotions, competitions, and exclusive offers at MetaWin Casino.',
  }
}

// Helper to format promotion type for display
function formatPromotionType(type: string): string {
  const types: Record<string, string> = {
    'competitions': 'Competitions',
    'casino': 'Casino',
    'live-games': 'Live Games',
    'sports': 'Sports',
  }
  return types[type] || type
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function PromotionsPage({ searchParams }: PromotionsPageProps) {
  const { type: activeType } = await searchParams

  const [page, promotions, allTypes] = await Promise.all([
    getPageData(),
    getPromotions(activeType),
    getAllPromotionTypes(),
  ])

  const breadcrumbItems = [
    { label: page?.seo?.breadcrumbText || page?.title || 'Promotions' },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {page?.title || 'Promotions'}
        </h1>
        {(page?.description || !page) && (
          <p className="mt-2 text-[var(--color-text-muted)]">
            {page?.description || 'Discover the latest offers, competitions, and exclusive promotions'}
          </p>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        {/* Filter Pills */}
        {allTypes.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/casino/promotions/"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                !activeType
                  ? 'bg-[var(--color-accent-blue)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              All
            </Link>
            {allTypes.map((type) => (
              <Link
                key={type}
                href={`/casino/promotions/?type=${type}`}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeType === type
                    ? 'bg-[var(--color-accent-blue)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
                }`}
              >
                {formatPromotionType(type)}
              </Link>
            ))}
          </div>
        )}

        {/* Promotions Grid - 2 columns on desktop like SPA */}
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {promotions.map((promotion) => (
              <Link
                key={promotion._id}
                href={`/casino/promotions/${promotion.slug}/`}
                className="group block bg-[var(--color-bg-secondary)] rounded-2xl p-4 hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                {/* Thumbnail - wider aspect ratio for promo banners */}
                <div className="relative aspect-[2.5/1] rounded-xl overflow-hidden bg-[var(--color-bg-tertiary)]">
                  {promotion.thumbnail && (
                    <Image
                      src={promotion.thumbnail}
                      alt={promotion.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-4">
                  {/* Date and Tag row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {promotion.startDate && formatDate(promotion.startDate)}
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getFlairColorClasses(promotion.flairColor, !!promotion.flair)}`}>
                      {promotion.flair || formatPromotionType(promotion.promotionType)}
                    </span>
                  </div>

                  {/* Excerpt */}
                  {promotion.excerpt && (
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
                      {promotion.excerpt}
                    </p>
                  )}

                  {/* Read more link */}
                  <span className="text-sm font-medium text-[var(--color-accent-blue)] group-hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No promotions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
