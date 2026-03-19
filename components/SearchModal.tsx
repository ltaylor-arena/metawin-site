'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { searchAllQuery } from '@/lib/queries'

interface SearchResult {
  _id: string
  _type: string
  title: string
  slug: string
  categorySlug?: string
  thumbnail?: any
  externalThumbnailUrl?: string
  heroImage?: string
  image?: any
  provider?: string
  difficulty?: string
}

interface SearchResults {
  games: SearchResult[]
  pages: SearchResult[]
  blogPosts: SearchResult[]
  guides: SearchResult[]
  authors: SearchResult[]
}

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  game: { label: 'Game', color: '#3B82F6', bg: '#3B82F620' },
  page: { label: 'Page', color: '#8B5CF6', bg: '#8B5CF620' },
  blogPost: { label: 'Blog', color: '#F59E0B', bg: '#F59E0B20' },
  guide: { label: 'Guide', color: '#10B981', bg: '#10B98120' },
  author: { label: 'Author', color: '#EC4899', bg: '#EC489920' },
}

function getResultUrl(result: SearchResult): string {
  switch (result._type) {
    case 'game':
      return `/casino/games/${result.categorySlug}/${result.slug}/`
    case 'page':
      return `/casino/${result.slug}/`
    case 'blogPost':
      return `/casino/blog/${result.slug}/`
    case 'guide':
      return `/casino/guides/${result.slug}/`
    case 'author':
      return `/casino/authors/${result.slug}/`
    default:
      return '#'
  }
}

function getResultSubtext(result: SearchResult): string | null {
  if (result._type === 'game' && result.provider) return result.provider
  if (result._type === 'guide' && result.difficulty) {
    return result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)
  }
  return null
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data: SearchResults = await client.fetch(searchAllQuery, {
          searchTerm: `${query}*`,
        })
        // Flatten all results into a single list, interleaving types
        const all: SearchResult[] = [
          ...data.games,
          ...data.blogPosts,
          ...data.guides,
          ...data.pages,
          ...data.authors,
        ]
        setResults(all)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Reset state when closing
  const handleClose = () => {
    setQuery('')
    setResults([])
    onClose()
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="relative border-b border-[var(--color-border)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games, guides, articles..."
              className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder:text-[var(--color-text-muted)] focus:outline-none text-lg"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--color-text-muted)]" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[var(--color-accent-blue)] animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => {
                  const config = typeConfig[result._type] || typeConfig.page
                  const subtext = getResultSubtext(result)
                  const thumbnailUrl = result.thumbnail
                    ? urlFor(result.thumbnail).width(96).height(128).fit('crop').auto('format').url()
                    : result.externalThumbnailUrl || result.heroImage || (result.image ? urlFor(result.image).width(96).height(128).fit('crop').auto('format').url() : null)

                  return (
                    <Link
                      key={result._id}
                      href={getResultUrl(result)}
                      onClick={handleClose}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] flex-shrink-0">
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={result.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs font-bold"
                            style={{ color: config.color, backgroundColor: config.bg }}
                          >
                            {config.label[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white truncate">
                            {result.title}
                          </h4>
                          <span
                            className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded"
                            style={{ color: config.color, backgroundColor: config.bg }}
                          >
                            {config.label}
                          </span>
                        </div>
                        {subtext && (
                          <p className="text-sm text-[var(--color-text-muted)] truncate">
                            {subtext}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : query.trim() ? (
              <div className="py-12 text-center text-[var(--color-text-muted)]">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="py-12 text-center text-[var(--color-text-muted)]">
                Search games, guides, blog posts, and more...
              </div>
            )}
          </div>
        </div>

        {/* Close hint */}
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          Press <kbd className="px-2 py-1 bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border)]">ESC</kbd> to close
        </p>
      </div>
    </div>,
    document.body
  )
}
