// Author Byline Component
// Displays author name, thumbnail, and publication dates inline with page header

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, RefreshCw } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
}

interface Author {
  name: string
  slug: string
  image?: SanityImage
}

interface AuthorBylineProps {
  author: Author
  publishedAt?: string
  updatedAt?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AuthorByline({ author, publishedAt, updatedAt }: AuthorBylineProps) {
  if (!author) return null

  // Generate optimized thumbnail URL (80px for 2x retina on 24px display)
  const thumbnailUrl = author.image?.asset
    ? urlFor(author.image).width(80).height(80).quality(80).auto('format').url()
    : null

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-[var(--color-text-muted)]">
      {/* Author */}
      <div className="flex items-center gap-2">
        <span>Written by</span>
        <Link href={`/casino/authors/${author.slug}/`} className="flex items-center gap-2 hover:text-white transition-colors">
          {thumbnailUrl && (
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)]">
              <Image
                src={thumbnailUrl}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium text-white hover:text-[var(--color-accent-blue)] transition-colors">{author.name}</span>
        </Link>
      </div>

      {/* Dates */}
      {(publishedAt || updatedAt) && (
        <div className="flex items-center gap-4">
          {publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(publishedAt)}</span>
            </div>
          )}
          {updatedAt && (
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Updated {formatDate(updatedAt)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
