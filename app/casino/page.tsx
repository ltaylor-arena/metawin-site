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

  console.log('Page data:', JSON.stringify(page, null, 2))

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
            const firstSlide = block.slides?.[0]
            if (!firstSlide) return null
            return (
              <section key={block._key} className="px-0 md:px-6 pt-0 md:pt-6">
                <Hero
                  heading={firstSlide.heading}
                  subheading={firstSlide.subheading}
                  image={firstSlide.image ? { url: firstSlide.image, alt: firstSlide.heading } : undefined}
                  ctaText={firstSlide.ctaText}
                  ctaLink={firstSlide.ctaLink}
                />
              </section>
            )
          
          case 'introSection':
            const hasPromoCards = block.promoCards && block.promoCards.length > 0
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div className={`flex flex-col ${hasPromoCards ? 'lg:flex-row lg:gap-8' : ''}`}>
                  {/* Left Column - Text Content */}
                  <div className={hasPromoCards ? 'lg:w-[60%]' : 'max-w-4xl'}>
                    {block.heading && (
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {block.heading}
                      </h1>
                    )}
                    {block.text && (
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                        <PortableText value={block.text} />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Promo Cards */}
                  {hasPromoCards && (
                    <div className="lg:w-[40%] flex flex-col gap-4 mt-6 lg:mt-0">
                      {block.promoCards.map((card: any) => (
                        <PromoCard
                          key={card._key}
                          title={card.title}
                          subtitle={card.subtitle}
                          colorTheme={card.colorTheme}
                          backgroundImage={card.backgroundImage}
                          link={card.link}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )
          
          case 'richText':
            return (
              <section key={block._key} className="px-4 md:px-6 py-8">
                <div className="prose prose-invert prose-sm md:prose-base max-w-4xl">
                  <PortableText value={block.content} />
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

          default:
            console.log('Unknown block type:', block._type)
            return null
        }
      })}
    </div>
  )
}