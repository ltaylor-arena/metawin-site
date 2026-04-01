// Guide Card Component
// Wiki-style card for guide listings — emphasizes topic, difficulty, and freshness over imagery

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

interface GuideCardProps {
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  publishedAt?: string
  updatedAt?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readingTime?: number
  categories?: Category[]
  author?: Author
  variant?: 'default' | 'compact'
}

const difficultyConfig = {
  beginner: { label: 'Beginner', color: '#10B981' },
  intermediate: { label: 'Intermediate', color: '#F59E0B' },
  advanced: { label: 'Advanced', color: '#EF4444' },
}

export default function GuideCard({
  title,
  slug,
  excerpt,
  heroImage,
  heroImageAlt,
  publishedAt,
  updatedAt,
  difficulty,
  readingTime,
  categories,
  author,
  variant = 'default',
}: GuideCardProps) {
  const displayDate = updatedAt || publishedAt
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null
  const isUpdated = updatedAt && publishedAt && updatedAt !== publishedAt

  const difficultyInfo = difficulty ? difficultyConfig[difficulty] : null

  // Compact variant — small horizontal card for sidebars
  if (variant === 'compact') {
    return (
      <Link
        href={`/hub/guides/${slug}/`}
        className="group flex gap-4 items-start"
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white group-hover:text-[var(--color-accent-blue)] transition-colors line-clamp-2 mb-1">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            {difficultyInfo && (
              <span style={{ color: difficultyInfo.color }}>{difficultyInfo.label}</span>
            )}
            {readingTime && <span>{readingTime} min read</span>}
          </div>
        </div>
      </Link>
    )
  }

  // Default variant — wiki-style card
  return (
    <Link
      href={`/hub/guides/${slug}/`}
      className="group block bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--color-accent-blue)] transition-all"
    >
      {/* Optional Image — smaller aspect ratio than blog */}
      {heroImage && (
        <div className="relative aspect-[16/9] bg-[var(--color-bg-tertiary)]">
          <Image
            src={heroImage}
            alt={heroImageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Top row: difficulty + categories */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {difficultyInfo && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded"
              style={{
                backgroundColor: `${difficultyInfo.color}20`,
                color: difficultyInfo.color,
              }}
            >
              {difficultyInfo.label}
            </span>
          )}
          {categories && categories.slice(0, 2).map((cat) => (
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

        <h3 className="text-base font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors mb-2 line-clamp-2">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          {readingTime && <span>{readingTime} min read</span>}
          {readingTime && formattedDate && <span>·</span>}
          {formattedDate && (
            <time dateTime={displayDate}>
              {isUpdated ? 'Updated ' : ''}{formattedDate}
            </time>
          )}
          {author && (
            <>
              <span>·</span>
              <span>{author.name}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
