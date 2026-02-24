// Blog Post Card Component
// Used in blog listings and carousels

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

interface PostCardProps {
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  publishedAt?: string
  categories?: Category[]
  author?: Author
  isFeatured?: boolean
  variant?: 'default' | 'featured' | 'compact'
}

export default function PostCard({
  title,
  slug,
  excerpt,
  heroImage,
  heroImageAlt,
  publishedAt,
  categories,
  author,
  isFeatured,
  variant = 'default',
}: PostCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  // Featured variant - larger horizontal card
  if (variant === 'featured') {
    return (
      <Link
        href={`/casino/blog/${slug}/`}
        className="group block bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--color-accent-blue)] transition-all"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[16/10] md:aspect-auto bg-[var(--color-bg-tertiary)]">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={heroImageAlt || title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            )}
            {isFeatured && (
              <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-[var(--color-accent-gold)] text-black rounded">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 md:p-6 flex flex-col justify-center">
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat._id}
                    className="px-2 py-0.5 text-xs font-medium rounded"
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

            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors mb-3 line-clamp-2">
              {title}
            </h3>

            {excerpt && (
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
                {excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
              {author && <span>{author.name}</span>}
              {author && formattedDate && <span>·</span>}
              {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Compact variant - small horizontal card
  if (variant === 'compact') {
    return (
      <Link
        href={`/casino/blog/${slug}/`}
        className="group flex gap-4 items-start"
      >
        {/* Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={heroImageAlt || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white group-hover:text-[var(--color-accent-blue)] transition-colors line-clamp-2 mb-1">
            {title}
          </h4>
          {formattedDate && (
            <time className="text-xs text-[var(--color-text-muted)]" dateTime={publishedAt}>
              {formattedDate}
            </time>
          )}
        </div>
      </Link>
    )
  }

  // Default variant - vertical card
  return (
    <Link
      href={`/casino/blog/${slug}/`}
      className="group block bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--color-accent-blue)] transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-[var(--color-bg-tertiary)]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={heroImageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        {isFeatured && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-[var(--color-accent-gold)] text-black rounded">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat._id}
                className="px-2 py-0.5 text-xs font-medium rounded"
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

        <h3 className="text-base font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors mb-2 line-clamp-2">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          {author && <span>{author.name}</span>}
          {author && formattedDate && <span>·</span>}
          {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
        </div>
      </div>
    </Link>
  )
}
