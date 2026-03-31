import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { guideBySlugQuery, allGuideSlugsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import AuthorBio from '@/components/AuthorBio'
import AuthorByline from '@/components/AuthorByline'
import TableOfContents, { TOCItem } from '@/components/TableOfContents'
import GuideCard from '@/components/guides/GuideCard'
import Callout from '@/components/Callout'
import { ArticleStructuredData } from '@/components/StructuredData'

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

interface Guide {
  _id: string
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  heroImageCaption?: string
  publishedAt?: string
  updatedAt?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readingTime?: number
  showToc?: boolean
  showAuthorBio?: boolean
  categories?: {
    _id: string
    title: string
    slug: string
    color?: string
  }[]
  content?: any[]
  author?: {
    name: string
    slug: string
    image?: any
    role?: string
    bio?: string
    expertise?: string[]
    socialLinks?: {
      twitter?: string
      linkedin?: string
      website?: string
    }
  }
  factChecker?: {
    name: string
    slug: string
    image?: any
    role?: string
    bio?: string
    expertise?: string[]
    socialLinks?: {
      twitter?: string
      linkedin?: string
      website?: string
    }
  }
  relatedGuides?: any[]
  relatedGames?: any[]
  seo?: {
    metaTitle?: string
    hideKicker?: boolean
    metaDescription?: string
    breadcrumbText?: string
  }
}

const difficultyConfig = {
  beginner: { label: 'Beginner', color: '#10B981' },
  intermediate: { label: 'Intermediate', color: '#F59E0B' },
  advanced: { label: 'Advanced', color: '#EF4444' },
}

async function getGuide(slug: string): Promise<Guide | null> {
  return await client.fetch(guideBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const guides = await client.fetch(allGuideSlugsQuery)
  return guides.map((guide: { slug: string }) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuide(slug)

  if (!guide) {
    return {
      title: 'Guide Not Found',
    }
  }

  const title = guide.seo?.metaTitle || guide.title
  return {
    title: guide.seo?.hideKicker ? { absolute: title } : title,
    description: guide.seo?.metaDescription || guide.excerpt,
    openGraph: {
      title: guide.seo?.hideKicker ? title : undefined,
      description: guide.seo?.metaDescription || guide.excerpt,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: guide.author ? [guide.author.name] : undefined,
      images: guide.heroImage ? [{ url: guide.heroImage }] : undefined,
    },
  }
}

// Extract H2 and H3 headings from content for TOC
function extractTocItems(content: any[]): TOCItem[] {
  if (!content) return []

  const tocItems: TOCItem[] = []

  content.forEach((block) => {
    if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
      const text = block.children
        ?.map((child: any) => child.text)
        .join('') || ''

      if (text) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        tocItems.push({ id, title: text, level: block.style === 'h3' ? 3 : 2 })
      }
    }
  })

  return tocItems
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = await getGuide(slug)

  if (!guide) {
    notFound()
  }

  // Extract TOC items from content
  const tocItems = guide.showToc !== false ? extractTocItems(guide.content || []) : []

  const difficultyInfo = guide.difficulty ? difficultyConfig[guide.difficulty] : null

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Guides', href: '/casino/guides/' },
    ...(guide.categories && guide.categories.length > 0
      ? [{ label: guide.categories[0].title, href: `/casino/guides/category/${guide.categories[0].slug}/` }]
      : []),
    { label: guide.seo?.breadcrumbText || guide.title },
  ]

  return (
    <div className="min-h-screen">
      <ArticleStructuredData
        title={guide.title}
        description={guide.seo?.metaDescription || guide.excerpt}
        url={`https://metawin.com/casino/guides/${guide.slug}/`}
        image={guide.heroImage}
        publishedAt={guide.publishedAt}
        updatedAt={guide.updatedAt}
        author={guide.author}
      />

      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {guide.title}
        </h1>

        {guide.excerpt && (
          <p className="mt-3 text-lg text-[var(--color-text-muted)]">
            {guide.excerpt}
          </p>
        )}

        {guide.author && (
          <div className="mt-4">
            <AuthorByline
              author={guide.author}
              factChecker={guide.factChecker}
              publishedAt={guide.publishedAt}
              updatedAt={guide.updatedAt}
            />
          </div>
        )}
      </header>

      {/* Mobile TOC */}
      {tocItems.length > 0 && (
        <TableOfContents items={tocItems} variant="mobile" />
      )}

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Left Column - Content */}
          <div className="min-w-0">
            {/* Hero Image (optional for guides) */}
            {guide.heroImage && (
              <figure className="mb-8">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]">
                  <Image
                    src={guide.heroImage}
                    alt={guide.heroImageAlt || guide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {guide.heroImageCaption && (
                  <figcaption className="mt-2 text-sm text-center text-[var(--color-text-muted)]">
                    {guide.heroImageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Article Content */}
            {guide.content && (
              <article className="prose prose-invert prose-sm md:prose-base max-w-none">
                {guide.content.map((block: any, index: number) => {
                  // Handle callout blocks
                  if (block._type === 'callout') {
                    return (
                      <Callout
                        key={block._key || index}
                        title={block.title}
                        content={block.content}
                        variant={block.variant}
                      />
                    )
                  }

                  // Handle inline images
                  if (block._type === 'image' && block.url) {
                    return (
                      <figure key={block._key || index} className="my-8">
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[var(--color-bg-secondary)]">
                          <Image
                            src={block.url}
                            alt={block.alt || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-sm text-center text-[var(--color-text-muted)]">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }

                  // Handle text blocks with PortableText
                  return (
                    <PortableText
                      key={block._key || index}
                      value={[block]}
                      components={portableTextComponents}
                    />
                  )
                })}
              </article>
            )}

            {/* Related Games */}
            {guide.relatedGames && guide.relatedGames.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-white mb-6">Related Games</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {guide.relatedGames.map((game: any) => (
                    <Link
                      key={game._id}
                      href={`/casino/games/${game.categorySlug}/${game.slug}/`}
                      className="group block bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden hover:ring-2 hover:ring-[var(--color-accent-blue)] transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-[var(--color-bg-tertiary)]">
                        {(game.thumbnail || game.externalThumbnailUrl) && (
                          <Image
                            src={game.externalThumbnailUrl || game.thumbnail}
                            alt={game.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white group-hover:text-[var(--color-accent-blue)] transition-colors line-clamp-1">
                          {game.title}
                        </h3>
                        {game.provider && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {game.provider}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Guides */}
            {guide.relatedGuides && guide.relatedGuides.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-white mb-6">Related Guides</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guide.relatedGuides.map((relatedGuide: any) => (
                    <GuideCard key={relatedGuide._id} {...relatedGuide} />
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio */}
            {guide.showAuthorBio !== false && guide.author && (
              <div className="mt-12 pt-8 border-t border-[var(--color-border)] space-y-4">
                <AuthorBio author={guide.author} />
                {guide.factChecker && (
                  <AuthorBio
                    author={guide.factChecker}
                    title="Fact Checked By"
                    id="fact-checker-info"
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            {/* Desktop TOC */}
            {tocItems.length > 0 && (
              <TableOfContents items={tocItems} variant="desktop" />
            )}

            {/* Guide Info Card */}
            <div className="hidden xl:block p-4 bg-[var(--color-bg-secondary)] rounded-xl">
              <h3 className="text-sm font-semibold text-white mb-3">Guide Info</h3>
              <dl className="space-y-2 text-sm">
                {difficultyInfo && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-muted)]">Difficulty</dt>
                    <dd style={{ color: difficultyInfo.color }}>{difficultyInfo.label}</dd>
                  </div>
                )}
                {guide.readingTime && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-muted)]">Reading time</dt>
                    <dd className="text-white">{guide.readingTime} min</dd>
                  </div>
                )}
                {guide.updatedAt && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-muted)]">Last updated</dt>
                    <dd className="text-white">
                      {new Date(guide.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
