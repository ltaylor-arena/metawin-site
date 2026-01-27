'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { searchGamesQuery } from '@/lib/queries'

interface SearchResult {
  _id: string
  title: string
  slug: string
  categorySlug: string
  thumbnail?: any // Sanity image reference
  externalThumbnailUrl?: string // CDN URL fallback
  provider?: string
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
        const searchResults = await client.fetch(searchGamesQuery, {
          searchTerm: `${query}*`,
        })
        setResults(searchResults)
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
              placeholder="Search games or providers..."
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
                {results.map((game) => (
                  <Link
                    key={game._id}
                    href={`/casino/games/${game.categorySlug}/${game.slug}/`}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] flex-shrink-0">
                      {game.thumbnail ? (
                        <Image
                          src={urlFor(game.thumbnail)
                            .width(96)
                            .height(128)
                            .fit('crop')
                            .auto('format')
                            .url()}
                          alt={game.title}
                          fill
                          className="object-cover"
                        />
                      ) : game.externalThumbnailUrl ? (
                        <Image
                          src={game.externalThumbnailUrl}
                          alt={game.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {game.title}
                      </h4>
                      {game.provider && (
                        <p className="text-sm text-[var(--color-text-muted)] truncate">
                          {game.provider}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="py-12 text-center text-[var(--color-text-muted)]">
                No games found for "{query}"
              </div>
            ) : (
              <div className="py-12 text-center text-[var(--color-text-muted)]">
                Start typing to search games...
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
