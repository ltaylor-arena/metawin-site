import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { client, urlFor } from '@/lib/sanity'
import { authorsIndexQuery } from '@/lib/queries'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Author {
  _id: string
  name: string
  slug: string
  image?: any
  role?: string
  bio?: string
  expertise?: string[]
  articleCount: number
}

async function getAuthors(): Promise<Author[]> {
  return await client.fetch(authorsIndexQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Authors | MetaWin',
    description: 'Meet the expert writers and reviewers behind MetaWin\'s casino game reviews and guides.',
    robots: { index: true, follow: true },
  }
}

export default async function AuthorsIndexPage() {
  const authors = await getAuthors()

  const breadcrumbItems = [
    { label: 'Authors' },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          Our Authors
        </h1>
        <p className="text-[var(--color-text-muted)] mt-3 max-w-2xl">
          Meet the expert writers and reviewers who create our casino game reviews, guides, and industry insights.
        </p>
      </header>

      {/* Authors Grid */}
      <div className="px-4 md:px-6 pb-12">
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => {
              const thumbnailUrl = author.image?.asset
                ? urlFor(author.image).width(200).height(200).quality(90).auto('format').url()
                : null

              return (
                <Link
                  key={author._id}
                  href={`/casino/authors/${author.slug}/`}
                  className="group block bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors"
                >
                  <div className="p-6">
                    {/* Author Header */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)] ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-accent-blue)] transition-colors">
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={author.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xl font-bold">
                            {author.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Name & Role */}
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-accent-blue)] transition-colors truncate">
                          {author.name}
                        </h2>
                        {author.role && (
                          <p className="text-sm text-[var(--color-accent-blue)] truncate">
                            {author.role}
                          </p>
                        )}
                        {/* Article Count Badge */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-sm text-[var(--color-text-muted)]">
                            {author.articleCount} {author.articleCount === 1 ? 'article' : 'articles'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {author.bio && (
                      <p className="text-sm text-[var(--color-text-secondary)] mt-4 line-clamp-2">
                        {author.bio}
                      </p>
                    )}

                    {/* Expertise Tags */}
                    {author.expertise && author.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {author.expertise.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                        {author.expertise.length > 3 && (
                          <span className="px-2 py-1 text-xs text-[var(--color-text-muted)]">
                            +{author.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">
              No authors found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
