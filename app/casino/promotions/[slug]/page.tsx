import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { promotionBySlugQuery, allPromotionSlugsQuery, relatedPromotionsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import AuthorBio from '@/components/AuthorBio'
import AuthorByline from '@/components/AuthorByline'
import FAQ from '@/components/FAQ'

interface PromotionPageProps {
  params: Promise<{ slug: string }>
}

async function getPromotion(slug: string) {
  return await client.fetch(promotionBySlugQuery, { slug })
}

async function getRelatedPromotions(type: string, excludeSlug: string) {
  return await client.fetch(relatedPromotionsQuery, { type, excludeSlug })
}

export async function generateStaticParams() {
  const promotions = await client.fetch(allPromotionSlugsQuery)
  return promotions.map((promo: { slug: string }) => ({
    slug: promo.slug,
  }))
}

export async function generateMetadata({ params }: PromotionPageProps): Promise<Metadata> {
  const { slug } = await params
  const promotion = await getPromotion(slug)

  if (!promotion) {
    return {
      title: 'Promotion Not Found',
    }
  }

  return {
    title: promotion.seo?.metaTitle || `${promotion.title} | MetaWin Casino`,
    description: promotion.seo?.metaDescription || promotion.excerpt,
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

export default async function PromotionPage({ params }: PromotionPageProps) {
  const { slug } = await params
  const promotion = await getPromotion(slug)

  if (!promotion) {
    notFound()
  }

  // Fetch related promotions of the same type
  const relatedPromotions = promotion.promotionType
    ? await getRelatedPromotions(promotion.promotionType, slug)
    : []

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Promotions', href: '/casino/promotions/' },
    { label: promotion.seo?.breadcrumbText || promotion.title },
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {promotion.title}
            </h1>
            {promotion.flair && (
              <span className="px-2 py-1 text-xs font-semibold bg-[var(--color-accent-blue)] text-white rounded">
                {promotion.flair}
              </span>
            )}
          </div>
          {promotion.showAuthorInfo && promotion.author && (
            <AuthorByline
              author={promotion.author}
              publishedAt={promotion.publishedAt}
              updatedAt={promotion.updatedAt}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-4"></div>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Hero Image - wider aspect ratio for promo banners */}
            {promotion.heroImage && (
              <div className="relative aspect-[2.5/1] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]">
                <Image
                  src={promotion.heroImage}
                  alt={promotion.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* CTA Button */}
            {promotion.externalUrl && (
              <Link
                href={promotion.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10">{promotion.ctaText || 'Enter Now'}</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </Link>
            )}

            {/* Main Content */}
            {promotion.content && (
              <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                <PortableText value={promotion.content} components={portableTextComponents} />
              </div>
            )}

            {/* Terms and Conditions */}
            {promotion.termsAndConditions && (
              <div className="mt-8 p-6 bg-[var(--color-bg-secondary)] rounded-xl">
                <h2 className="text-lg font-bold text-white mb-4">Terms and Conditions</h2>
                <div className="prose prose-invert prose-sm max-w-none text-[var(--color-text-muted)]">
                  <PortableText value={promotion.termsAndConditions} components={portableTextComponents} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Related Promotions */}
          <div className="space-y-6">
            {/* Promotion Type Badge */}
            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Promotion Type</div>
              <div className="font-semibold text-white">
                {formatPromotionType(promotion.promotionType)}
              </div>
            </div>

            {/* Related Promotions */}
            {relatedPromotions && relatedPromotions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  More {formatPromotionType(promotion.promotionType)}
                </h3>
                <div className="space-y-3">
                  {relatedPromotions.map((related: any) => (
                    <Link
                      key={related._id}
                      href={`/casino/promotions/${related.slug}/`}
                      className="block group"
                    >
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] mb-2">
                        {related.thumbnail && (
                          <Image
                            src={related.thumbnail}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {related.flair && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold bg-[var(--color-accent-blue)] text-white rounded">
                            {related.flair}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white group-hover:text-[var(--color-accent-blue)] transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile CTA */}
            {promotion.externalUrl && (
              <Link
                href={promotion.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="xl:hidden group relative w-full py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10">{promotion.ctaText || 'Enter Now'}</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </Link>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {promotion.faq && promotion.faq.length > 0 && (
          <div className="mt-7 xl:max-w-[calc(100%-312px)]">
            <FAQ
              heading={`${promotion.title} FAQ`}
              items={promotion.faq}
            />
          </div>
        )}

        {/* Author Bio */}
        {promotion.showAuthorInfo && promotion.author && (
          <div id="author" className="mt-7 xl:max-w-[calc(100%-312px)]">
            <AuthorBio author={promotion.author} />
          </div>
        )}
      </div>
    </div>
  )
}
