'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface Game {
  _id: string
  title: string
  slug: string
  categorySlug: string
  thumbnail?: any // Sanity image reference
  externalThumbnailUrl?: string // CDN URL fallback (for imported games)
  provider: string
  rtp?: number
  volatility?: 'low' | 'medium' | 'high'
  hasContent?: boolean
}

interface ProviderGamesCarouselProps {
  provider: string
  games: Game[]
  signUpUrl?: string
}

export default function ProviderGamesCarousel({ provider, games, signUpUrl = 'https://metawin.com/signup' }: ProviderGamesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [games])

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return

    const scrollAmount = containerRef.current.clientWidth * 0.75
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!games || games.length === 0) return null

  return (
    <section className="py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          More from {provider}
        </h2>

        {/* Navigation Arrows */}
        {games.length > 3 && (
          <div className="hidden md:flex gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`
                p-2 rounded-lg transition-colors
                ${canScrollLeft
                  ? 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] cursor-not-allowed'
                }
              `}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`
                p-2 rounded-lg transition-colors
                ${canScrollRight
                  ? 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] cursor-not-allowed'
                }
              `}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game) => {
          const gamePageUrl = `/casino/games/${game.categorySlug}/${game.slug}/`

          // Determine image source: Sanity asset or external URL
          const thumbnailSrc = game.thumbnail
            ? urlFor(game.thumbnail)
                .width(352)
                .height(470)
                .fit('crop')
                .auto('format')
                .url()
            : game.externalThumbnailUrl

          return (
            <div
              key={game._id}
              className="w-36 md:w-44 flex-shrink-0 group"
            >
              <div className="game-card">
                {/* Thumbnail */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  {thumbnailSrc ? (
                    <Image
                      src={thumbnailSrc}
                      alt={game.title}
                      fill
                      sizes="(max-width: 768px) 144px, 176px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                      <span className="text-[var(--color-text-muted)] text-xs">No image</span>
                    </div>
                  )}

                  {/* Hover Overlay with Action Buttons */}
                  <div className="game-card-overlay flex flex-col items-center justify-center gap-2 px-3">
                    <a
                      href={signUpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-3 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white hover:text-white text-sm font-semibold rounded-lg text-center transition-colors"
                    >
                      Play Now
                    </a>
                    {game.hasContent && (
                      <Link
                        href={gamePageUrl}
                        className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 text-white hover:text-white text-xs font-medium rounded-lg text-center transition-colors backdrop-blur-sm"
                      >
                        Game Info
                      </Link>
                    )}
                  </div>
                </div>

                {/* Game Info */}
                <div className="mt-2 px-1">
                  <h3 className="text-sm font-medium text-white truncate">
                    {game.title}
                  </h3>

                  {/* RTP & Volatility */}
                  {(game.rtp || game.volatility) && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {game.rtp && (
                        <span className="text-[12px]" style={{ color: 'rgb(0, 234, 105)' }}>
                          RTP {game.rtp}%
                        </span>
                      )}
                      {game.volatility && (
                        <img
                          src={`/images/volatility/volatility-${game.volatility}.svg`}
                          alt={`${game.volatility} volatility`}
                          style={{ height: '8px', width: 'auto' }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
