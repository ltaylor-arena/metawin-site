import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { gameBySlugQuery, allGamesWithCategoriesQuery, gamesByProviderQuery, siteSettingsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import ScreenshotSlideshow from '@/components/ScreenshotSlideshow'
import GameDetailsTable from '@/components/GameDetailsTable'
import QuickSummary from '@/components/QuickSummary'
import ProsAndCons from '@/components/ProsAndCons'
import AuthorThoughts from '@/components/AuthorThoughts'
import Callout from '@/components/Callout'
import GameTable from '@/components/GameTable'
import AuthorBio from '@/components/AuthorBio'
import AuthorByline from '@/components/AuthorByline'
import FAQ from '@/components/FAQ'
import ProviderGamesCarousel from '@/components/ProviderGamesCarousel'
import { GameStructuredData } from '@/components/StructuredData'
import TableOfContents, { TOCItem } from '@/components/TableOfContents'

interface GamePageProps {
  params: Promise<{ category: string; slug: string }>
}

interface ContentBlock {
  _type: string
  _key: string
  [key: string]: any
}

async function getGame(slug: string) {
  return await client.fetch(gameBySlugQuery, { slug })
}

async function getGamesByProvider(provider: string, excludeSlug: string) {
  return await client.fetch(gamesByProviderQuery, { provider, excludeSlug })
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
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

  const title = game.seo?.metaTitle || game.title
  return {
    title: game.seo?.hideKicker ? { absolute: title } : title,
    description: game.seo?.metaDescription || `Play ${game.title} by ${game.provider} at MetaWin. ${game.rtp ? `RTP: ${game.rtp}%` : ''}`,
    robots: { index: false, follow: false },
  }
}

// Helper to extract first H2 heading from Portable Text content
// Only H2s are used as section titles - H3s are subheadings
function extractFirstH2(content: any[]): string | null {
  if (!content || !Array.isArray(content)) return null

  for (const block of content) {
    if (block._type === 'block' && block.style === 'h2' && block.children) {
      const text = block.children.map((child: any) => child.text || '').join('')
      if (text.trim()) return text.trim()
    }
  }

  return null
}

// Helper to generate TOC items from content blocks
function buildTOCItems(contentBlocks: ContentBlock[], game: any): TOCItem[] {
  const items: TOCItem[] = []

  contentBlocks.forEach((block) => {
    switch (block._type) {
      case 'gameQuickSummary':
        if (block.intro && block.intro.length > 0) {
          items.push({ id: 'quick-summary', title: 'Quick Summary' })
        }
        break
      case 'gameProsAndCons':
        if ((block.pros && block.pros.length > 0) || (block.cons && block.cons.length > 0)) {
          items.push({ id: 'pros-and-cons', title: 'Pros & Cons' })
        }
        break
      case 'gameRichText':
        if (block.content && block.content.length > 0) {
          // Priority: tocTitle > first H2 in content > fallback "Overview"
          const headingTitle = extractFirstH2(block.content)
          const title = block.tocTitle || headingTitle || 'Overview'
          items.push({ id: `section-${block._key}`, title })
        }
        break
      case 'callout':
        // Skip callouts from TOC
        break
      case 'gameTable':
        if (block.tableData?.headers && block.tableData.headers.length > 0) {
          // Priority: heading from introText > explicit title > first table header > "Data Table"
          // (introText heading is the main section title, table title is a subtitle)
          let title = null
          if (block.introText) {
            title = extractFirstH2(block.introText)
          }
          if (!title) {
            title = block.title
          }
          if (!title && block.tableData.headers[0]) {
            title = block.tableData.headers[0]
          }
          title = title || 'Data Table'
          items.push({ id: `table-${block._key}`, title })
        }
        break
      // Exclude gameAuthorThoughts from TOC
    }
  })

  return items
}

// Content Block Renderer Component (for reorderable middle section)
function GameContentBlock({
  block,
  game,
}: {
  block: ContentBlock
  game: any
}) {
  switch (block._type) {
    case 'gameQuickSummary':
      if (!block.intro || block.intro.length === 0) return null
      return (
        <section id="quick-summary" className="scroll-mt-48 xl:scroll-mt-28">
          <QuickSummary
            title={game.title}
            intro={block.intro}
            thumbnail={game.thumbnail}
            externalThumbnailUrl={game.externalThumbnailUrl}
            isNew={game.isNew}
          />
        </section>
      )

    case 'gameProsAndCons':
      if ((!block.pros || block.pros.length === 0) && (!block.cons || block.cons.length === 0)) return null
      return (
        <section id="pros-and-cons" className="scroll-mt-48 xl:scroll-mt-28">
          <ProsAndCons
            title={game.title}
            pros={block.pros}
            cons={block.cons}
          />
        </section>
      )

    case 'gameRichText':
      if (!block.content || block.content.length === 0) return null
      return (
        <section id={`section-${block._key}`} className="scroll-mt-48 xl:scroll-mt-28">
          <div className="bg-[#0F1115] rounded-lg p-4 md:p-6">
            <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6]">
              <PortableText value={block.content} components={portableTextComponents} />
            </div>
          </div>
        </section>
      )

    case 'gameAuthorThoughts':
      if (!block.content || block.content.length === 0 || !game.author) return null
      return (
        <AuthorThoughts
          author={game.author}
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
        <section id={`table-${block._key}`} className="scroll-mt-48 xl:scroll-mt-28">
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
        </section>
      )

    default:
      return null
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { category, slug } = await params
  const [game, siteSettings] = await Promise.all([
    getGame(slug),
    getSiteSettings()
  ])

  if (!game) {
    notFound()
  }

  // Fetch related games from the same provider
  const providerGames = game.provider
    ? await getGamesByProvider(game.provider, slug)
    : []

  const signUpUrl = siteSettings?.signUpUrl || 'https://metawin.com/signup'

  // Verify the game belongs to this category
  const gameCategory = game.categories?.find((c: any) => c.slug === category)
  if (!gameCategory && game.categories?.length > 0) {
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

  // Get content blocks (reorderable middle section)
  const contentBlocks: ContentBlock[] = game.content || []

  // Build TOC items from content blocks + fixed sections
  const tocItems: TOCItem[] = buildTOCItems(contentBlocks, game)

  // Add FAQ to TOC if present
  if (game.faq && game.faq.length > 0) {
    tocItems.push({ id: 'faq', title: 'FAQ' })
  }

  // Add Author Bio to TOC if present
  if (game.showAuthorInfo && game.author) {
    tocItems.push({ id: 'author-info', title: 'About the Author' })
  }

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
          description: game.content?.find((b: ContentBlock) => b._type === 'gameRichText')?.content,
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
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {game.title}
        </h1>
        {game.showAuthorInfo && game.author && (
          <div className="mt-3">
            <AuthorByline
              author={game.author}
              factChecker={game.factChecker}
              publishedAt={game.publishedAt}
              updatedAt={game.updatedAt}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="pb-8">
        {/* Mobile Table of Contents - Sticky under header */}
        {tocItems.length > 1 && (
          <TableOfContents items={tocItems} variant="mobile" />
        )}

        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* FIXED: Screenshots / Thumbnail (always at top) */}
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

            {/* FIXED: Play Button (always after screenshots) */}
            <a
              href={signUpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Play {game.title}</span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </a>

            {/* REORDERABLE: Content Blocks (Quick Summary, Pros/Cons, Rich Text) */}
            {contentBlocks.map((block) => (
              <GameContentBlock
                key={block._key}
                block={block}
                game={game}
              />
            ))}
          </div>

          {/* Right Column - Sidebar */}
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

            {/* Desktop Table of Contents - Sticky after details */}
            {tocItems.length > 1 && (
              <TableOfContents items={tocItems} variant="desktop" />
            )}

            {/* Mobile Play Button */}
            <a
              href={signUpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="xl:hidden group relative w-full py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Play Now</span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </a>
          </div>
        </div>

        {/* FIXED BOTTOM SECTIONS (in order: FAQ, Author Bio, Provider Games) */}

        {/* FAQ Section */}
        {game.faq && game.faq.length > 0 && (
          <section id="faq" className="mt-7 xl:max-w-[calc(100%-312px)] scroll-mt-48 xl:scroll-mt-28">
            <FAQ
              heading={`${game.title} FAQ`}
              items={game.faq}
            />
          </section>
        )}

        {/* Author Bio */}
        {game.showAuthorInfo && game.author && (
          <div className="mt-7 xl:max-w-[calc(100%-312px)] space-y-4">
            <AuthorBio author={game.author} />
            {game.factChecker && (
              <AuthorBio
                author={game.factChecker}
                title="Fact Checked By"
                id="fact-checker-info"
              />
            )}
          </div>
        )}

        {/* More from Provider */}
        {providerGames && providerGames.length > 0 && (
          <div className="mt-7 xl:max-w-[calc(100%-312px)]">
            <ProviderGamesCarousel
              provider={game.provider}
              games={providerGames}
              signUpUrl={signUpUrl}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
