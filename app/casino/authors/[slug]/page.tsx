import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Linkedin, Globe, Quote, Calendar, Newspaper, FileText } from 'lucide-react'
import { client, urlFor } from '@/lib/sanity'
import { authorBySlugQuery, contentByAuthorQuery, allAuthorsQuery } from '@/lib/queries'
import Breadcrumbs from '@/components/Breadcrumbs'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

interface FavouriteGame {
  _id: string
  title: string
  slug: string
  categorySlug: string
  thumbnail?: any
  externalThumbnailUrl?: string
  provider?: string
  rtp?: number
  volatility?: string
}

interface Author {
  _id: string
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
  yearsInIndustry?: number
  favouriteGame?: FavouriteGame
  favouriteQuote?: {
    quote?: string
    attribution?: string
  }
  industryResources?: {
    heading?: string
    events?: string[]
    publications?: string[]
  }
}

interface ContentItem {
  _id: string
  title: string
  slug: string
  categorySlug?: string
  description?: string
  excerpt?: string
  thumbnail?: any
  externalThumbnailUrl?: string
  provider?: string
  publishedAt?: string
}

interface AuthorContent {
  pages: ContentItem[]
  games: ContentItem[]
  promotions: ContentItem[]
}

async function getAuthor(slug: string): Promise<Author | null> {
  return await client.fetch(authorBySlugQuery, { slug })
}

async function getAuthorContent(authorId: string): Promise<AuthorContent> {
  return await client.fetch(contentByAuthorQuery, { authorId })
}

export async function generateStaticParams() {
  const authors = await client.fetch(allAuthorsQuery)
  return authors.map((author: { slug: string }) => ({
    slug: author.slug,
  }))
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    return {
      title: 'Author Not Found',
    }
  }

  const titleParts = [author.name]
  if (author.role) titleParts.push(author.role)
  titleParts.push('MetaWin Casino')

  return {
    title: titleParts.join(' | '),
    description: author.bio || `Read articles and game reviews by ${author.name} at MetaWin.`,
    robots: { index: true, follow: true },
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    notFound()
  }

  const content = await getAuthorContent(author._id)
  const allContent = [
    ...content.pages.map(p => ({ ...p, type: 'page' as const })),
    ...content.games.map(g => ({ ...g, type: 'game' as const })),
    ...content.promotions.map(p => ({ ...p, type: 'promotion' as const })),
  ].sort((a, b) => {
    if (!a.publishedAt || !b.publishedAt) return 0
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  const thumbnailUrl = author.image?.asset
    ? urlFor(author.image).width(400).height(400).quality(90).auto('format').url()
    : null

  const breadcrumbItems = [
    { label: 'Authors', href: '/casino/authors/' },
    { label: author.name },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-b from-[#1a1f2e] to-[var(--color-bg-primary)] py-12 md:py-16">
        <div className="px-4 md:px-6 max-w-5xl mx-auto text-center">
          {/* Author Image */}
          {thumbnailUrl && (
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-[var(--color-accent-blue)]/30">
              <Image
                src={thumbnailUrl}
                alt={author.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Name & Role */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {author.name}
          </h1>
          {author.role && (
            <p className="text-lg md:text-xl text-[var(--color-accent-blue)]">
              {author.role}
            </p>
          )}

          {/* Social Links */}
          {author.socialLinks && (
            <div className="flex justify-center gap-4 mt-4">
              {author.socialLinks.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {author.socialLinks.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {author.socialLinks.website && (
                <a
                  href={author.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
                  aria-label="Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Bio Section */}
        {author.bio && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">About {author.name}</h2>
            <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border)]">
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {author.bio}
              </p>
            </div>
          </section>
        )}

        {/* Expertise Section */}
        {author.expertise && author.expertise.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm border border-[var(--color-border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Stats & Highlights Grid */}
        {(author.yearsInIndustry || author.favouriteGame || allContent.length > 0) && (
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Years in Industry */}
              {author.yearsInIndustry && (
                <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border)] text-center">
                  <Calendar className="w-8 h-8 text-[var(--color-accent-blue)] mx-auto mb-3" />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {author.yearsInIndustry}+
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">Years in the Industry</p>
                </div>
              )}

              {/* Articles Written */}
              {allContent.length > 0 && (
                <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border)] text-center">
                  <FileText className="w-8 h-8 text-[var(--color-accent-green)] mx-auto mb-3" />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {allContent.length}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">Articles Written</p>
                </div>
              )}

              {/* Favourite Game */}
              {author.favouriteGame && (
                <Link
                  href={`/casino/games/${author.favouriteGame.categorySlug}/${author.favouriteGame.slug}/`}
                  className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors group"
                >
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Favourite Game</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] flex-shrink-0">
                      {author.favouriteGame.thumbnail ? (
                        <Image
                          src={urlFor(author.favouriteGame.thumbnail).width(128).height(160).fit('crop').auto('format').url()}
                          alt={author.favouriteGame.title}
                          fill
                          className="object-cover"
                        />
                      ) : author.favouriteGame.externalThumbnailUrl ? (
                        <Image
                          src={author.favouriteGame.externalThumbnailUrl}
                          alt={author.favouriteGame.title}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-white group-hover:text-[var(--color-accent-blue)] transition-colors truncate">
                        {author.favouriteGame.title}
                      </h4>
                      {author.favouriteGame.provider && (
                        <p className="text-sm text-[var(--color-text-muted)]">{author.favouriteGame.provider}</p>
                      )}
                      {author.favouriteGame.rtp && (
                        <p className="text-sm mt-1">
                          <span className="text-[rgb(0,234,105)]">{author.favouriteGame.rtp}% RTP</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Favourite Quote */}
        {author.favouriteQuote?.quote && (
          <section className="mb-8">
            <div className="bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] rounded-xl p-6 md:p-8 border border-[var(--color-border)] relative overflow-hidden">
              <Quote className="absolute top-4 left-4 w-12 h-12 text-[var(--color-accent-blue)]/20" />
              <blockquote className="relative z-10">
                <p className="text-lg md:text-xl text-white italic leading-relaxed pl-8">
                  "{author.favouriteQuote.quote}"
                </p>
                {author.favouriteQuote.attribution && (
                  <footer className="mt-4 pl-8 text-sm text-[var(--color-text-muted)]">
                    — {author.favouriteQuote.attribution}
                  </footer>
                )}
              </blockquote>
            </div>
          </section>
        )}

        {/* Industry Resources */}
        {author.industryResources && (author.industryResources.events?.length || author.industryResources.publications?.length) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {author.industryResources.heading || 'How I Stay Up to Date'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Events */}
              {author.industryResources.events && author.industryResources.events.length > 0 && (
                <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[var(--color-accent-blue)]" />
                    <h3 className="text-base font-semibold text-white">Events & Conferences</h3>
                  </div>
                  <ul className="space-y-2">
                    {author.industryResources.events.map((event, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)]" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Publications */}
              {author.industryResources.publications && author.industryResources.publications.length > 0 && (
                <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Newspaper className="w-5 h-5 text-[var(--color-accent-blue)]" />
                    <h3 className="text-base font-semibold text-white">Publications & News</h3>
                  </div>
                  <ul className="space-y-2">
                    {author.industryResources.publications.map((pub, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)]" />
                        {pub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Latest Content Section */}
        {allContent.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Latest Content by {author.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allContent.map((item) => {
                let href = '#'
                let typeLabel = ''

                if (item.type === 'page') {
                  href = `/casino/${item.slug}/`
                  typeLabel = 'Article'
                } else if (item.type === 'game') {
                  href = `/casino/games/${item.categorySlug}/${item.slug}/`
                  typeLabel = 'Game Review'
                } else if (item.type === 'promotion') {
                  href = `/casino/promotions/${item.slug}/`
                  typeLabel = 'Promotion'
                }

                const itemThumbnail = item.thumbnail
                  ? (typeof item.thumbnail === 'string'
                      ? item.thumbnail
                      : urlFor(item.thumbnail).width(400).height(225).fit('crop').auto('format').url())
                  : item.externalThumbnailUrl

                return (
                  <Link
                    key={item._id}
                    href={href}
                    className="group block bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-[var(--color-bg-tertiary)]">
                      {itemThumbnail ? (
                        <Image
                          src={itemThumbnail}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[var(--color-text-muted)] text-sm">No image</span>
                        </div>
                      )}
                      {/* Type Badge */}
                      <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded bg-[var(--color-accent-blue)] text-white">
                        {typeLabel}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white group-hover:text-[var(--color-accent-blue)] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {(item.description || item.excerpt) && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">
                          {item.description || item.excerpt}
                        </p>
                      )}
                      {item.publishedAt && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                          {formatDate(item.publishedAt)}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* No Content Message */}
        {allContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">
              No published content yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
