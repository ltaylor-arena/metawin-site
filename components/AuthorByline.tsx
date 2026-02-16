// Author Byline Component
// Displays author name, thumbnail, and publication dates inline with page header

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, RefreshCw, ChevronDown } from 'lucide-react'
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
  factChecker?: Author
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

export default function AuthorByline({ author, factChecker, publishedAt, updatedAt }: AuthorBylineProps) {
  const [showDates, setShowDates] = useState(false)

  if (!author) return null

  // Generate optimized thumbnail URL (80px for 2x retina on 24px display)
  const authorThumbnailUrl = author.image?.asset
    ? urlFor(author.image).width(80).height(80).quality(80).auto('format').url()
    : null

  const factCheckerThumbnailUrl = factChecker?.image?.asset
    ? urlFor(factChecker.image).width(80).height(80).quality(80).auto('format').url()
    : null

  const hasDates = publishedAt || updatedAt

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-[var(--color-text-muted)]">
      {/* Author & Fact Checker */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Author */}
        <div className="flex items-center gap-2">
          <span>Written by</span>
          <a href="#author-info" className="flex items-center gap-2 hover:text-white transition-colors">
            {authorThumbnailUrl && (
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)]">
                <Image
                  src={authorThumbnailUrl}
                  alt={author.name}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-medium text-white hover:text-[var(--color-accent-blue)] transition-colors">{author.name}</span>
          </a>
        </div>

        {/* Fact Checker */}
        {factChecker && (
          <div className="flex items-center gap-2">
            <span>Fact checked by</span>
            <a href="#fact-checker-info" className="flex items-center gap-2 hover:text-white transition-colors">
              {factCheckerThumbnailUrl && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)]">
                  <Image
                    src={factCheckerThumbnailUrl}
                    alt={factChecker.name}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium text-white hover:text-[var(--color-accent-blue)] transition-colors">{factChecker.name}</span>
            </a>
          </div>
        )}

        {/* Mobile date toggle button - only shows on mobile when dates exist */}
        {hasDates && (
          <button
            onClick={() => setShowDates(!showDates)}
            className="md:hidden flex items-center gap-1 text-[var(--color-text-muted)] hover:text-white transition-colors"
            aria-expanded={showDates}
            aria-label={showDates ? 'Hide publication dates' : 'Show publication dates'}
          >
            <Calendar className="w-3.5 h-3.5" />
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showDates ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Dates - Desktop: always visible, Mobile: collapsible */}
      {hasDates && (
        <>
          {/* Desktop dates - always visible */}
          <div className="hidden md:flex items-center gap-4">
            {publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>First Published: {formatDate(publishedAt)}</span>
              </div>
            )}
            {updatedAt && (
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Last Updated: {formatDate(updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Mobile dates - collapsible */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-200 ${
              showDates ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-1.5 pt-1">
              {publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>First Published: {formatDate(publishedAt)}</span>
                </div>
              )}
              {updatedAt && (
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Last Updated: {formatDate(updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
