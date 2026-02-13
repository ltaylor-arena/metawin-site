import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { categoriesWithGamesQuery, siteSettingsQuery } from '@/lib/queries'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import GameCarousel from '@/components/GameCarousel'
import AuthorByline from '@/components/AuthorByline'
import AuthorBio from '@/components/AuthorBio'
import AuthorThoughts from '@/components/AuthorThoughts'
import Callout from '@/components/Callout'
import FAQ from '@/components/FAQ'
import FeatureCards from '@/components/FeatureCards'
import PromoCard from '@/components/PromoCard'
import ExpandableRichText from '@/components/ExpandableRichText'
import ExpandableText from '@/components/ExpandableText'

// Custom query for games page with full content block expansion
const gamesPageQuery = groq`
  *[_type == "page" && slug.current == "games"][0] {
    _id,
    title,
    h1,
    description,
    "slug": slug.current,
    showAuthorInfo,
    publishedAt,
    updatedAt,
    author-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },
    factChecker-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },
    seo {
      metaTitle,
      metaDescription,
      breadcrumbText,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    },
    content[] {
      _type,
      _key,

      // Rich text
      _type == "richText" => {
        content,
        maxLines
      },

      // FAQ Section
      _type == "faq" => {
        heading,
        items[] {
          _key,
          question,
          answer
        }
      },

      // Feature Cards
      _type == "featureCards" => {
        heading,
        cards[] {
          _key,
          icon,
          title,
          description
        }
      },

      // Intro section
      _type == "introSection" => {
        heading,
        text,
        promoCards[] {
          _key,
          title,
          subtitle,
          colorTheme,
          "backgroundImage": backgroundImage.asset->url,
          link
        }
      },

      // CTA Banner
      _type == "ctaBanner" => {
        heading,
        text,
        buttonText,
        buttonLink,
        "backgroundImage": backgroundImage.asset->url
      },

      // Author's Thoughts
      _type == "gameAuthorThoughts" => {
        content
      },

      // Callout
      _type == "callout" => {
        title,
        content,
        variant
      }
    }
  }
`

async function getPage() {
  return await client.fetch(gamesPageQuery)
}

async function getCategoriesWithGames() {
  return await client.fetch(categoriesWithGamesQuery)
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  const title = page?.seo?.metaTitle || 'All Games'

  return {
    title: page?.seo?.hideKicker ? { absolute: title } : title,
    description: page?.seo?.metaDescription || 'Browse all casino games at MetaWin. Slots, table games, crash games, and more.',
    robots: { index: false, follow: false },
  }
}

interface Category {
  _id: string
  title: string
  slug: string
  totalGames: number
  games: Array<{
    _id: string
    title: string
    slug: string
    categorySlug: string
    thumbnail?: any
    externalThumbnailUrl?: string
    provider?: string
    rtp?: number
    volatility?: 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high'
    hasContent?: boolean
  }>
}

export default async function GamesIndexPage() {
  const [page, categories, siteSettings] = await Promise.all([
    getPage(),
    getCategoriesWithGames(),
    getSiteSettings()
  ])

  // Filter out categories with no games
  const categoriesWithGames: Category[] = categories.filter((cat: Category) => cat.games && cat.games.length > 0)

  const breadcrumbItems = [
    { label: page?.seo?.breadcrumbText || 'All Games' },
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
          {page?.h1 || page?.title || 'All Games'}
        </h1>
        {page?.showAuthorInfo && page?.author && (
          <div className="mt-3 pb-3 border-b border-[var(--color-border)]">
            <AuthorByline
              author={page.author}
              factChecker={page.factChecker}
              publishedAt={page.publishedAt}
              updatedAt={page.updatedAt}
            />
          </div>
        )}
        {page?.description && (
          <div className="mt-4 pb-4 border-b border-[var(--color-border)]">
            <ExpandableText text={page.description} maxLinesMobile={2} />
          </div>
        )}
      </header>

      {/* Category Carousels */}
      <div className="pb-4">
        {categoriesWithGames.map((category) => (
          <GameCarousel
            key={category._id}
            title={category.title}
            games={category.games}
            viewAllHref={`/casino/games/${category.slug}/`}
            totalGames={category.totalGames}
            cardSize="medium"
            signUpUrl={siteSettings?.signUpUrl}
          />
        ))}

        {categoriesWithGames.length === 0 && (
          <div className="px-4 md:px-6 py-12 text-center">
            <p className="text-[var(--color-text-muted)]">No games found.</p>
          </div>
        )}
      </div>

      {/* Content Blocks from Sanity */}
      {page?.content?.map((block: any) => {
        switch (block._type) {
          case 'richText':
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
                <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
                  <ExpandableRichText
                    content={block.content}
                    maxLines={block.maxLines || 6}
                  />
                </div>
              </section>
            )

          case 'introSection':
            const hasPromoCards = block.promoCards && block.promoCards.length > 0
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
                <div className={`flex flex-col ${hasPromoCards ? 'lg:flex-row lg:gap-8' : ''}`}>
                  <div className={hasPromoCards ? 'lg:w-[60%]' : 'max-w-4xl'}>
                    {block.heading && (
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
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

          case 'ctaBanner':
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
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
              <section key={block._key} className="px-4 md:px-6 py-6">
                <FAQ heading={block.heading} items={block.items} />
              </section>
            )

          case 'featureCards':
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
                <FeatureCards
                  heading={block.heading}
                  features={block.cards}
                />
              </section>
            )

          case 'gameAuthorThoughts':
            if (!page?.author || !block.content) return null
            return (
              <section key={block._key} className="px-4 md:px-6 py-6">
                <AuthorThoughts
                  author={page.author}
                  content={block.content}
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

          default:
            console.log('Unknown block type:', block._type)
            return null
        }
      })}

      {/* Author Bio */}
      {page?.showAuthorInfo && page?.author && (
        <div className="px-4 md:px-6 py-6 space-y-4">
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
  )
}
