import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { gameBySlugQuery, allGamesWithCategoriesQuery, gamesByProviderQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import ScreenshotSlideshow from '@/components/ScreenshotSlideshow'
import GameDetailsTable from '@/components/GameDetailsTable'
import QuickSummary from '@/components/QuickSummary'
import AuthorBio from '@/components/AuthorBio'
import AuthorByline from '@/components/AuthorByline'
import FAQ from '@/components/FAQ'
import ProviderGamesCarousel from '@/components/ProviderGamesCarousel'
import { GameStructuredData } from '@/components/StructuredData'

interface GamePageProps {
  params: Promise<{ category: string; slug: string }>
}

async function getGame(slug: string) {
  return await client.fetch(gameBySlugQuery, { slug })
}

async function getGamesByProvider(provider: string, excludeSlug: string) {
  return await client.fetch(gamesByProviderQuery, { provider, excludeSlug })
}

export async function generateStaticParams() {
  const games = await client.fetch(allGamesWithCategoriesQuery)
  return games.map((game: { slug: string; categorySlug: string }) => ({
    category: game.categorySlug,
    slug: game.slug,
  }))
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params
  const game = await getGame(slug)

  if (!game) {
    return {
      title: 'Game Not Found',
    }
  }

  return {
    title: game.seo?.metaTitle || `${game.title} | Play at MetaWin`,
    description: game.seo?.metaDescription || `Play ${game.title} by ${game.provider} at MetaWin. ${game.rtp ? `RTP: ${game.rtp}%` : ''}`,
    robots: { index: false, follow: false },
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { category, slug } = await params
  const game = await getGame(slug)

  if (!game) {
    notFound()
  }

  // Fetch related games from the same provider
  const providerGames = game.provider
    ? await getGamesByProvider(game.provider, slug)
    : []

  // Verify the game belongs to this category
  const gameCategory = game.categories?.find((c: any) => c.slug === category)
  if (!gameCategory && game.categories?.length > 0) {
    // Redirect to the correct category URL would be ideal, but for now 404
    notFound()
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Games', href: '/casino/games/' },
    { label: gameCategory?.title || game.categories?.[0]?.title || 'Category', href: `/casino/games/${category}/` },
    { label: game.seo?.breadcrumbText || game.title },
  ]

  // Construct page URL for structured data
  const pageUrl = `https://metawin.com/casino/games/${category}/${slug}/`

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <GameStructuredData
        schemaData={game.gameSchema}
        gameData={{
          title: game.title,
          slug: game.slug,
          provider: game.provider,
          thumbnail: game.thumbnail,
          rtp: game.rtp,
          volatility: game.volatility,
          description: game.description,
          externalGameUrl: game.externalGameUrl,
          categories: game.categories,
        }}
        pageUrl={pageUrl}
      />

      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <div className="flex flex-col xl:flex-row xl:items-baseline xl:justify-between gap-1 xl:gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {game.title}
          </h1>
          {game.showAuthorInfo && game.author && (
            <AuthorByline
              author={game.author}
              publishedAt={game.publishedAt}
              updatedAt={game.updatedAt}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-4"></div>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Left Column - Media */}
          <div className="space-y-6">
            {/* Thumbnail / Screenshots */}
            {game.screenshots && game.screenshots.length > 0 ? (
              <ScreenshotSlideshow
                screenshots={game.screenshots}
                gameTitle={game.title}
              />
            ) : game.thumbnail ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]">
                <Image
                  src={urlFor(game.thumbnail)
                    .width(1200)
                    .height(675)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={game.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            {/* Play Button */}
            {game.externalGameUrl && (
              <Link
                href={game.externalGameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10">Play {game.title}</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </Link>
            )}

            {/* Quick Summary */}
            {game.quickSummary?.intro && (
              <QuickSummary
                title={game.title}
                intro={game.quickSummary.intro}
                highlights={game.quickSummary.highlights}
                thumbnail={game.thumbnail}
                isNew={game.isNew}
                isFeatured={game.isFeatured}
              />
            )}

            {/* Description */}
            {game.description && (
              <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                <PortableText value={game.description} components={portableTextComponents} />
              </div>
            )}

            {/* Additional Content */}
            {game.additionalContent && (
              <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                <PortableText value={game.additionalContent} components={portableTextComponents} />
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">

            {/* Details Table */}
            <GameDetailsTable
              name={game.title}
              provider={game.provider}
              rtp={game.rtp}
              paylines={game.paylines}
              category={game.categories}
              reels={game.reels}
              volatility={game.volatility}
              maxWin={game.maxWin}
              minBet={game.minBet}
              maxBet={game.maxBet}
              hasBonusFeature={game.hasBonusFeature}
              hasFreeSpins={game.hasFreeSpins}
              hasAutoplay={game.hasAutoplay}
              releaseDate={game.releaseDate}
            />

            {/* Mobile Play Button */}
            {game.externalGameUrl && (
              <Link
                href={game.externalGameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="xl:hidden group relative w-full py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10">Play Now</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </Link>
            )}

          </div>
        </div>

        {/* FAQ Section */}
        {game.faq && game.faq.length > 0 && (
          <div className="mt-7 xl:max-w-[calc(100%-312px)]">
            <FAQ
              heading={`${game.title} FAQ`}
              items={game.faq}
            />
          </div>
        )}

        {/* Author Bio */}
        {game.showAuthorInfo && game.author && (
          <div id="author" className="mt-7 xl:max-w-[calc(100%-312px)]">
            <AuthorBio author={game.author} />
          </div>
        )}

        {/* More from Provider */}
        {providerGames && providerGames.length > 0 && (
          <div className="mt-7 xl:max-w-[calc(100%-312px)]">
            <ProviderGamesCarousel
              provider={game.provider}
              games={providerGames}
            />
          </div>
        )}
      </div>
    </div>
  )
}
