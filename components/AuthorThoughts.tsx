// Author Thoughts Component
// Displays author's personal thoughts/opinions with quote styling

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
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
  role?: string
}

interface AuthorThoughtsProps {
  author: Author
  content: any[] // Portable Text blocks
}

export default function AuthorThoughts({ author, content }: AuthorThoughtsProps) {
  if (!author || !content || content.length === 0) return null

  // Generate optimized thumbnail URL
  const thumbnailUrl = author.image?.asset
    ? urlFor(author.image).width(96).height(96).quality(80).auto('format').url()
    : null

  return (
    <div className="relative rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] overflow-hidden">
      {/* Large Quote Mark Background */}
      <div
        className="absolute -top-4 left-2 text-[150px] leading-none text-white/[0.06] pointer-events-none select-none z-0"
        aria-hidden="true"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        &#8220;
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 md:p-6">
        {/* Header with Author Info */}
        <div className="flex items-center gap-3 mb-4">
          {/* Author Image */}
          {thumbnailUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)] ring-2 ring-[var(--color-border)]">
                <Image
                  src={thumbnailUrl}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Author Name & Label */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-accent-blue)] font-semibold">
              Author's Thoughts
            </p>
            <p className="text-sm text-white font-medium">{author.name}</p>
          </div>
        </div>

        {/* Quote Content - Italic text */}
        <div className="prose prose-invert prose-sm max-w-none [&>p]:italic [&>p]:text-[var(--color-text-secondary)] [&>p]:leading-relaxed [&>p:last-child]:mb-0">
          <PortableText value={content} />
        </div>
      </div>
    </div>
  )
}
