import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { homepageQuery, siteSettingsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import Hero from '@/components/Hero'
import GameCarousel from '@/components/GameCarousel'
import FeatureCards from '@/components/FeatureCards'
import Tabs from '@/components/Tabs'
import FAQ from '@/components/FAQ'
import PromoCard from '@/components/PromoCard'
import HotColdSlots from '@/components/HotColdSlots'
import Callout from '@/components/Callout'
import CategoryCards from '@/components/CategoryCards'
import { OrganizationStructuredData } from '@/components/StructuredData'

async function getHomepage() {
  return await client.fetch(homepageQuery)
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage()
  
  return {
    title: page?.seo?.metaTitle || "The World's Best Crypto Casino",
    description: page?.seo?.metaDescription || "Play thousands of casino games with instant crypto withdrawals.",
    robots: { index: false, follow: false },
  }
}

export default async function CasinoHomePage() {
  const [page, siteSettings] = await Promise.all([
    getHomepage(),
    getSiteSettings()
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
                />
              </section>
            )
          
          case 'introSection':
            const hasPromoCards = block.promoCards && block.promoCards.length > 0
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div className={`bg-[#0F1115] rounded-lg p-4 md:p-6 flex flex-col ${hasPromoCards ? 'lg:flex-row lg:gap-8' : ''}`}>
                  {/* Left Column - Text Content */}
                  <div className={hasPromoCards ? 'lg:w-[65%]' : 'max-w-4xl'}>
                    {block.heading && (
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {block.heading}
                      </h2>
                    )}
                    {block.text && (
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6] prose-h2:mt-[1em] prose-h2:mb-[0.5em]">
                        <PortableText value={block.text} />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Compact Promo Cards (stacked vertically) */}
                  {hasPromoCards && (
                    <div className="lg:w-[35%] flex flex-col gap-3 mt-6 lg:mt-0">
                      {block.promoCards.map((card: any) => {
                        const gradientColors: Record<string, string> = {
                          blue: 'from-blue-600/80',
                          orange: 'from-orange-500/80',
                          purple: 'from-purple-600/80',
                          green: 'from-emerald-600/80',
                          pink: 'from-pink-500/80',
                        }
                        const gradient = gradientColors[card.colorTheme] || gradientColors.blue

                        return (
                          <a
                            key={card._key}
                            href={card.link}
                            className="relative block w-full aspect-[16/9] rounded-md overflow-hidden group"
                          >
                            {/* Card Image */}
                            {card.backgroundImage && (
                              <img
                                src={card.backgroundImage}
                                alt={card.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            )}
                            {/* Gradient overlay - bottom left corner */}
                            <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} via-transparent to-transparent`} />
                            {/* Title & subtitle overlay */}
                            <div className="absolute bottom-2 left-2 right-2">
                              <h4 className="text-white text-base font-semibold drop-shadow-lg">
                                {card.title}
                              </h4>
                              {card.subtitle && (
                                <p className="text-white/80 text-xs drop-shadow-lg mt-0.5 line-clamp-2">
                                  {card.subtitle}
                                </p>
                              )}
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>
            )
          
          case 'richText':
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6] prose-h2:mt-[1em] prose-h2:mb-[0.5em]">
                    <PortableText value={block.content} />
                  </div>
                </div>
              </section>
            )
          
          case 'gameCarousel':
            return (
              <GameCarousel
                key={block._key}
                title={block.title}
                games={block.games || []}
                showWinAmounts={block.showWinAmounts}
                cardSize={block.cardSize}
                viewAllHref={block.viewAllHref}
                signUpUrl={siteSettings?.signUpUrl}
              />
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

          default:
            console.log('Unknown block type:', block._type)
            return null
        }
      })}
    </div>
  )
}