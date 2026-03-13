import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { gameBySlugQuery, allGamesWithCategoriesQuery, siteSettingsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import ContentAccordion from '@/components/ContentAccordion'
import QuickSummary from '@/components/QuickSummary'
import ProsAndCons from '@/components/ProsAndCons'
import GameTable from '@/components/GameTable'
import GameDetailsTable from '@/components/GameDetailsTable'
import FAQ from '@/components/FAQ'
import { GameStructuredData } from '@/components/StructuredData'

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
    return { title: 'Game Not Found' }
  }

  const title = game.seo?.metaTitle || game.title
  return {
    title: game.seo?.hideKicker ? { absolute: title } : title,
    description: game.seo?.metaDescription || `Play ${game.title} by ${game.provider} at MetaWin.`,
    robots: { index: false, follow: false },
  }
}

// Helper to extract first H2 heading from Portable Text content
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

// Content Block Renderer
function AccordionContentBlock({
  block,
  game,
}: {
  block: ContentBlock
  game: any
}) {
  switch (block._type) {
    // Quick Summary is rendered separately (always visible, not in accordion)
    case 'gameQuickSummary':
      return null

    // Author Thoughts - hidden in hybrid template
    case 'gameAuthorThoughts':
      return null

    case 'gameProsAndCons':
      if ((!block.pros || block.pros.length === 0) && (!block.cons || block.cons.length === 0)) return null
      return (
        <ContentAccordion id="pros-and-cons" title="Pros & Cons">
          <ProsAndCons
            title={game.title}
            pros={block.pros}
            cons={block.cons}
          />
        </ContentAccordion>
      )

    case 'gameRichText':
      if (!block.content || block.content.length === 0) return null
      const headingTitle = extractFirstH2(block.content)
      const richTextTitle = block.tocTitle || headingTitle || 'Overview'
      return (
        <ContentAccordion id={`section-${block._key}`} title={richTextTitle}>
          <div className="prose prose-invert prose-sm max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6]">
            <PortableText value={block.content} components={portableTextComponents} />
          </div>
        </ContentAccordion>
      )

    case 'gameTable':
      if (!block.tableData?.headers || block.tableData.headers.length === 0) return null
      let tableTitle = null
      if (block.introText) tableTitle = extractFirstH2(block.introText)
      if (!tableTitle) tableTitle = block.title
      if (!tableTitle && block.tableData.headers[0]) tableTitle = block.tableData.headers[0]
      tableTitle = tableTitle || 'Data Table'
      return (
        <ContentAccordion id={`table-${block._key}`} title={tableTitle}>
          {block.introText && block.introText.length > 0 && (
            <div className="prose prose-invert prose-sm max-w-none mb-4 prose-p:text-[0.9rem] prose-p:leading-[1.6]">
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
        </ContentAccordion>
      )

    default:
      return null
  }
}

export default async function HybridGamePage({ params }: GamePageProps) {
  const { category, slug } = await params
  const [game, siteSettings] = await Promise.all([
    getGame(slug),
    getSiteSettings()
  ])

  if (!game) {
    notFound()
  }

  const signUpUrl = siteSettings?.signUpUrl || 'https://metawin.com/signup'

  // Verify the game belongs to this category
  const gameCategory = game.categories?.find((c: any) => c.slug === category)
  if (!gameCategory && game.categories?.length > 0) {
    notFound()
  }

  // Construct page URL for structured data
  const pageUrl = `https://metawin.com/casino/games/${category}/${slug}/`

  // Get content blocks
  const contentBlocks: ContentBlock[] = game.content || []

  // Extract Quick Summary (rendered separately, always visible)
  const quickSummaryBlock = contentBlocks.find((b) => b._type === 'gameQuickSummary')

  return (
    <div className="min-h-screen bg-[#1A1D26]">
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

      {/* ============================================
          PLACEHOLDER SECTION: Live Site Game Elements
          These images represent the actual game UI
          that will be rendered by the live platform
          ============================================ */}

      <div className="max-w-6xl mx-auto">
        {/* Game Area Placeholder */}
        <div className="relative w-full">
          <Image
            src="/images/placeholders/placeholder-game-area.png"
            alt="Game Area - This will be the actual game interface"
            width={1095}
            height={618}
            className="w-full h-auto"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm bg-black/70 px-4 py-2 rounded">
              Placeholder: Actual game interface renders here
            </span>
          </div>
        </div>

        {/* Game Title Bar Placeholder */}
        <div className="relative w-full mt-0">
          <Image
            src="/images/placeholders/placeholder-game-title.png"
            alt="Game Title Bar"
            width={1095}
            height={85}
            className="w-full h-auto"
          />
        </div>

        {/* More Games Carousel Placeholder */}
        <div className="relative w-full mt-6">
          <Image
            src="/images/placeholders/placeholder-more-games.png"
            alt="More Games Carousel"
            width={1095}
            height={140}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Leaderboards Placeholder */}
        <div className="relative w-full mt-6">
          <Image
            src="/images/placeholders/placeholder-leaderboards.png"
            alt="Leaderboards & Races"
            width={1095}
            height={350}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>

      {/* ============================================
          SEO CONTENT SECTION: Accordion-based content
          This is the new SEO-friendly content that
          appears below the game elements
          ============================================ */}

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-8">
        {/* Divider */}
        <div className="border-t border-[var(--color-border)] my-6" />

        {/* Section Header */}
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          About {game.title}
        </h2>

        {/* Two Column Layout: Content (75%) + Game Details (25%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left Column - Content */}
          <div className="space-y-4">
            {/* Quick Summary - Always visible (not in accordion) */}
            {quickSummaryBlock && quickSummaryBlock.intro?.length > 0 && (
              <div id="quick-summary">
                <QuickSummary
                  title={game.title}
                  intro={quickSummaryBlock.intro}
                  thumbnail={game.thumbnail}
                  externalThumbnailUrl={game.externalThumbnailUrl}
                  isNew={game.isNew}
                />
              </div>
            )}

            {/* Content Blocks (accordions + standalone elements) */}
            <div className="space-y-3">
              {contentBlocks.map((block) => (
                <AccordionContentBlock
                  key={block._key}
                  block={block}
                  game={game}
                />
              ))}

              {/* FAQ Section in Accordion */}
              {game.faq && game.faq.length > 0 && (
                <ContentAccordion id="faq" title={`${game.title} FAQ`}>
                  <FAQ
                    items={game.faq}
                  />
                </ContentAccordion>
              )}
            </div>
          </div>

          {/* Right Column - Game Details (sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
