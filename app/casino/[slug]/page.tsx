import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { pageBySlugQuery, siteSettingsQuery } from '@/lib/queries'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import Hero from '@/components/Hero'
import GameCarousel from '@/components/GameCarousel'
import FeatureCards from '@/components/FeatureCards'
import FAQ from '@/components/FAQ'
import PromoCard from '@/components/PromoCard'
import AuthorBio from '@/components/AuthorBio'
import AuthorByline from '@/components/AuthorByline'
import AuthorThoughts from '@/components/AuthorThoughts'
import Callout from '@/components/Callout'
import CategoryCards from '@/components/CategoryCards'
import ExpandableRichText from '@/components/ExpandableRichText'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Query for all non-homepage pages (for static generation)
const allPageSlugsQuery = groq`
  *[_type == "page" && isHomepage != true && defined(slug.current)] {
    "slug": slug.current
  }
`

async function getPage(slug: string) {
  return await client.fetch(pageBySlugQuery, { slug })
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

export async function generateStaticParams() {
  const pages = await client.fetch(allPageSlugsQuery)
  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  const title = page.seo?.metaTitle || page.title
  return {
    title: page.seo?.hideKicker ? { absolute: title } : title,
    description: page.seo?.metaDescription || page.description,
    robots: { index: false, follow: false },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const [page, siteSettings] = await Promise.all([
    getPage(slug),
    getSiteSettings()
  ])

  if (!page) {
    notFound()
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: page.seo?.breadcrumbText || page.title },
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
          {page.h1 || page.title}
        </h1>
        {page.showAuthorInfo && page.author && (
          <div className="mt-3 pb-3 border-b border-[var(--color-border)]">
            <AuthorByline
              author={page.author}
              factChecker={page.factChecker}
              publishedAt={page.publishedAt}
              updatedAt={page.updatedAt}
            />
          </div>
        )}
        {page.description && (
          <p className="mt-4 text-[var(--color-text-muted)]">
            {page.description}
          </p>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        {/* Content Blocks */}
        {page.content?.map((block: any) => {
          switch (block._type) {
            case 'hero':
              return (
                <section key={block._key} className="mb-8 -mx-4 md:-mx-6 pt-4">
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
                <section key={block._key} className="mb-8">
                  <div className={`flex flex-col ${hasPromoCards ? 'lg:flex-row lg:gap-8' : ''}`}>
                    <div className={hasPromoCards ? 'lg:w-[60%]' : 'max-w-4xl'}>
                      {block.heading && (
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                          {block.heading}
                        </h2>
                      )}
                      {block.text && (
                        <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6]">
                          <PortableText value={block.text} components={portableTextComponents} />
                        </div>
                      )}
                    </div>
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
                <section key={block._key} className="mb-8">
                  <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
                    <ExpandableRichText
                      content={block.content}
                      maxLines={block.maxLines || 6}
                    />
                  </div>
                </section>
              )

            case 'gameCarousel':
              return (
                <section key={block._key} className="mb-8 -mx-4 md:-mx-6">
                  <GameCarousel
                    title={block.title}
                    games={block.games || []}
                    showWinAmounts={block.showWinAmounts}
                    cardSize={block.cardSize}
                    viewAllHref={block.viewAllHref}
                    signUpUrl={siteSettings?.signUpUrl}
                  />
                </section>
              )

            case 'ctaBanner':
              return (
                <section key={block._key} className="mb-8">
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
                <section key={block._key} className="mb-8">
                  <FAQ heading={block.heading} items={block.items} />
                </section>
              )

            case 'featureCards':
              return (
                <section key={block._key} className="mb-8">
                  <FeatureCards
                    heading={block.heading}
                    features={block.cards}
                  />
                </section>
              )

            case 'gameAuthorThoughts':
              if (!page.author || !block.content) return null
              return (
                <section key={block._key} className="mb-8 max-w-4xl">
                  <AuthorThoughts
                    author={page.author}
                    content={block.content}
                  />
                </section>
              )

            case 'callout':
              return (
                <section key={block._key} className="mb-8 max-w-4xl">
                  <Callout
                    title={block.title}
                    content={block.content}
                    variant={block.variant}
                  />
                </section>
              )

            case 'categoryCards':
              return (
                <section key={block._key} className="mb-8 -mx-4 md:-mx-6">
                  <CategoryCards
                    heading={block.heading}
                    description={block.sectionDescription}
                    cards={block.cards || []}
                  />
                </section>
              )

            default:
              console.log('Unknown block type:', block._type)
              return null
          }
        })}

        {/* Author Bio */}
        {page.showAuthorInfo && page.author && (
          <div className="mt-8 max-w-4xl space-y-4">
            <AuthorBio author={page.author} />
            {page.factChecker && (
              <AuthorBio
                author={page.factChecker}
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
