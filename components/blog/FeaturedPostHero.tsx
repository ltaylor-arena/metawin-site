// Featured Post Hero Component
// Large featured article display for blog homepage

import Image from 'next/image'
import Link from 'next/link'

interface Author {
  name: string
  slug: string
  image?: any
}

interface Category {
  _id: string
  title: string
  slug: string
  color?: string
}

interface FeaturedPostHeroProps {
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  publishedAt?: string
  categories?: Category[]
  author?: Author
}

export default function FeaturedPostHero({
  title,
  slug,
  excerpt,
  heroImage,
  heroImageAlt,
  publishedAt,
  categories,
  author,
}: FeaturedPostHeroProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  // Estimate read time (rough: 200 words per minute, assume ~150 words from excerpt or default)
  const readTime = '6 min read'

  return (
    <Link
      href={`/casino/blog/${slug}/`}
      className="group block mb-12 p-4 md:p-6 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
    >
      {/* Large Hero Image */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-[var(--color-bg-tertiary)] mb-6">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={heroImageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        {/* Category Tags */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded"
                style={{
                  backgroundColor: cat.color ? `${cat.color}20` : 'var(--color-bg-tertiary)',
                  color: cat.color || 'var(--color-text-secondary)',
                }}
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors mb-4 leading-tight">
          {title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-base md:text-lg text-[var(--color-text-muted)] mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Meta: Author, Read Time, Date */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          {author && (
            <span className="font-medium text-[var(--color-text-secondary)]">
              {author.name}
            </span>
          )}
          {author && <span className="text-[var(--color-text-muted)]">·</span>}
          <span>{readTime}</span>
          {formattedDate && (
            <>
              <span className="text-[var(--color-text-muted)]">·</span>
              <time dateTime={publishedAt}>{formattedDate}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
