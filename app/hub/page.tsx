import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { homepageQuery, siteSettingsQuery, categorySummaryQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import Hero from '@/components/Hero'
import FeatureCards from '@/components/FeatureCards'
import Tabs from '@/components/Tabs'
import FAQ from '@/components/FAQ'
import PromoCard from '@/components/PromoCard'
import PromoCarousel from '@/components/PromoCarousel'
import HotColdSlots from '@/components/HotColdSlots'
import Callout from '@/components/Callout'
import CategoryCards from '@/components/CategoryCards'
import GameCategoryGrid from '@/components/GameCategoryGrid'
import ExpandableRichText from '@/components/ExpandableRichText'
import { OrganizationStructuredData } from '@/components/StructuredData'
import GamesWikiTable from '@/components/GamesWikiTable'
import Link from 'next/link'

async function getHomepage() {
  return await client.fetch(homepageQuery)
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage()
  const title = page?.seo?.metaTitle || "The World's Best Crypto Casino"

  const description = page?.seo?.metaDescription || "Play thousands of casino games with instant crypto withdrawals."

  return {
    title: page?.seo?.hideKicker ? { absolute: title } : title,
    description,

    openGraph: {
      title: page?.seo?.hideKicker ? title : undefined,
      description,
      images: page?.seo?.ogImage ? [{ url: page.seo.ogImage }] : undefined,
    },
  }
}

export default async function CasinoHomePage() {
  const [page, siteSettings, gameCategories] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    client.fetch(categorySummaryQuery),
  ])

  if (!page) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl text-white mb-4">No homepage found</h1>
        <p className="text-[var(--color-text-muted)]">
          Create a Page in Sanity Studio and check "Is Homepage?"
        </p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <OrganizationStructuredData data={page.organizationSchema} />

      {page.content?.map((block: any) => {
        switch (block._type) {
          case 'hero':
            return (
              <section key={block._key} className="sm:pt-4">
                <Hero
                  slides={block.slides}
                  autoplay={block.autoplay}
                  autoplaySpeed={block.autoplaySpeed}
                  signUpUrl={siteSettings?.signUpUrl}
                />
              </section>
            )
          
          case 'introSection':
            const hasPromoCards = block.promoCards && block.promoCards.length > 0
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div className={`bg-[#0F1115] rounded-lg p-4 md:p-6 flex flex-col ${hasPromoCards ? 'lg:flex-row lg:gap-8' : ''}`}>
                  {/* Promo Cards - Carousel on mobile, stacked on desktop */}
                  {hasPromoCards && (
                    <div className="lg:w-[35%] order-first lg:order-last mb-6 lg:mb-0">
                      <PromoCarousel cards={block.promoCards} />
                    </div>
                  )}

                  {/* Text Content - Second on mobile, left column on desktop */}
                  <div className={hasPromoCards ? 'lg:w-[65%] order-last lg:order-first' : 'max-w-4xl'}>
                    {block.heading && (
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {block.heading}
                      </h1>
                    )}
                    {block.text && (() => {
                      // Split text blocks around gameCategoryGrid insertions
                      const chunks: { type: 'text' | 'grid'; content?: any[]; grid?: any }[] = []
                      let currentText: any[] = []

                      for (const item of block.text) {
                        if (item._type === 'gameCategoryGrid') {
                          if (currentText.length > 0) {
                            chunks.push({ type: 'text', content: currentText })
                            currentText = []
                          }
                          chunks.push({ type: 'grid', grid: item })
                        } else {
                          currentText.push(item)
                        }
                      }
                      if (currentText.length > 0) {
                        chunks.push({ type: 'text', content: currentText })
                      }

                      // If no grids, render as before
                      if (chunks.length === 1 && chunks[0].type === 'text') {
                        return (
                          <ExpandableRichText
                            content={block.text}
                            maxLines={4}
                            mobileOnly={true}
                          />
                        )
                      }

                      return chunks.map((chunk, i) => {
                        if (chunk.type === 'grid') {
                          return (
                            <div key={chunk.grid._key || `grid-${i}`} className="my-6">
                              <GameCategoryGrid
                                heading={chunk.grid.heading}
                                headingLevel={chunk.grid.headingLevel}
                                columns={chunk.grid.columns}
                                maxItems={chunk.grid.maxItems}
                                categories={gameCategories}
                              />
                            </div>
                          )
                        }
                        return (
                          <ExpandableRichText
                            key={`text-${i}`}
                            content={chunk.content}
                            maxLines={i === 0 ? 4 : 6}
                            mobileOnly={true}
                          />
                        )
                      })
                    })()}
                  </div>
                </div>
              </section>
            )
          
          case 'richText':
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
                  <ExpandableRichText
                    content={block.content}
                    maxLines={block.maxLines || 6}
                  />
                </div>
              </section>
            )
          
          case 'gameCarousel':
            if (!block.games || block.games.length === 0) return null
            const renderTableHeading = (title: string, level: string) => {
              const className = "text-xl md:text-2xl font-bold text-white"
              switch (level) {
                case 'h3': return <h3 className={className}>{title}</h3>
                case 'h4': return <h4 className={className}>{title}</h4>
                case 'div': return <div className={className}>{title}</div>
                default: return <h2 className={className}>{title}</h2>
              }
            }
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                {/* Section Header */}
                {(block.title || block.viewAllHref) && (
                  <div className="flex items-center justify-between mb-4">
                    {block.title && renderTableHeading(block.title, block.headingLevel)}
                    {block.viewAllHref && (
                      <Link
                        href={block.viewAllHref}
                        className="text-sm text-[var(--color-accent-blue)] hover:text-white transition-colors"
                      >
                        View all →
                      </Link>
                    )}
                  </div>
                )}
                {/* Games Table */}
                <GamesWikiTable
                  games={block.games}
                  categorySlug={block.categorySlug}
                  signUpUrl={siteSettings?.signUpUrl}
                />
              </section>
            )
          
          case 'ctaBanner':
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div 
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] p-6 md:p-10"
                  style={block.backgroundImage ? {
                    backgroundImage: `url(${block.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                >
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                      {block.heading}
                    </h2>
                    {block.text && (
                      <p className="text-white/80 mb-6 max-w-md">{block.text}</p>
                    )}
                    {block.buttonText && (
                      <a 
                        href={block.buttonLink || '#'}
                        className="inline-block px-6 py-3 bg-white text-[var(--color-bg-primary)] font-semibold rounded-lg hover:bg-white/90 transition-colors"
                      >
                        {block.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )
          
          case 'faq':
            return (
              <section key={block._key} className="px-4 md:px-6">
                <FAQ heading={block.heading} items={block.items} />
              </section>
            )

          case 'featureCards':
            return (
              <section key={block._key} className="px-4 md:px-6">
                <FeatureCards
                  heading={block.heading}
                  features={block.cards}
                />
              </section>
            )

          case 'hotColdSlots':
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <HotColdSlots
                  heading={block.heading}
                  hotTitle={block.hotTitle}
                  coldTitle={block.coldTitle}
                  limit={block.limit || 5}
                  signUpUrl={siteSettings?.signUpUrl}
                />
              </section>
            )

          case 'callout':
            if (!block.content) return null
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
                <Callout
                  title={block.title}
                  content={block.content}
                  variant={block.variant}
                />
              </section>
            )

          case 'categoryCards':
            return (
              <CategoryCards
                key={block._key}
                heading={block.heading}
                description={block.sectionDescription}
                cards={block.cards || []}
              />
            )

          case 'gameCategoryGrid':
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
                <GameCategoryGrid
                  heading={block.heading}
                  headingLevel={block.headingLevel}
                  columns={block.columns}
                  maxItems={block.maxItems}
                  categories={gameCategories}
                />
              </section>
            )

          default:
            console.log('Unknown block type:', block._type)
            return null
        }
      })}
    </div>
  )
}