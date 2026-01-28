// Game Carousel Component
// Horizontal scrolling game cards with navigation

'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface Game {
  title: string
  slug: string
  categorySlug?: string
  thumbnail?: any // Sanity image reference
  externalThumbnailUrl?: string // CDN URL fallback (for imported games)
  provider?: string
  rtp?: number
  volatility?: 'low' | 'medium' | 'high'
  winAmount?: string
  winner?: string
  hasContent?: boolean
  isNew?: boolean
  isFeatured?: boolean
}

interface GameCarouselProps {
  title: string
  games: Game[]
  showWinAmounts?: boolean
  cardSize?: 'small' | 'medium' | 'large'
  viewAllHref?: string
  totalGames?: number
  showSeeMore?: boolean
  badge?: 'Live' | '24h' | 'New' | 'Hot'
  signUpUrl?: string
}

export default function GameCarousel({
  title,
  games,
  showWinAmounts = false,
  cardSize = 'medium',
  viewAllHref,
  totalGames,
  showSeeMore = true,
  badge,
  signUpUrl = 'https://metawin.com/signup',
}: GameCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  const cardWidths = {
    small: 'w-28 md:w-32',
    medium: 'w-32 md:w-36',
    large: 'w-36 md:w-44',
  }

  // Image sizes for each card size (2x for retina)
  const imageSizes = {
    small: { width: 288, height: 384 },
    medium: { width: 352, height: 470 },
    large: { width: 448, height: 598 },
  }
  
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
  }, [])
  
  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    
    const scrollAmount = containerRef.current.clientWidth * 0.75
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }
  
  return (
    <section className="py-4 overflow-x-clip overflow-y-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-4 md:px-6">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>

        <div className="flex items-center gap-2">
          {/* Badge */}
          {badge && (
            <div className="flex items-center gap-2 text-sm">
              {badge === 'Live' && (
                <>
                  <span className="text-[var(--color-text-muted)]">Live</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </>
              )}
              {badge === '24h' && (
                <span className="px-2 py-1 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs">
                  24h
                </span>
              )}
            </div>
          )}

          {/* View All Button */}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="px-3 py-1.5 rounded-full bg-[#1a1d23] hover:bg-[#252830] text-[var(--color-text-secondary)] hover:text-white text-xs font-medium transition-colors"
            >
              View All
            </Link>
          )}

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-0.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-1 transition-opacity"
              aria-label="Scroll left"
            >
              <img
                src={canScrollLeft ? "/images/svg/left-arrow-active.svg" : "/images/svg/left-arrow.svg"}
                alt=""
                className="w-[18px] h-[18px]"
              />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-1 transition-opacity"
              aria-label="Scroll right"
            >
              <img
                src={canScrollRight ? "/images/svg/right-arrow.svg" : "/images/svg/right-arrow-default.svg"}
                alt=""
                className="w-[18px] h-[18px]"
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Carousel Container */}
      <div className="relative">
        {/* Carousel */}
        <div
          ref={containerRef}
          onScroll={checkScroll}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-6 pt-4 pb-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            clipPath: 'inset(-20px 0 0 0)',
          }}
        >
        {games.map((game, index) => {
          const gamePageUrl = `/casino/games/${game.categorySlug || 'slots'}/${game.slug}/`

          // Determine image source: Sanity asset or external URL
          const thumbnailSrc = game.thumbnail
            ? urlFor(game.thumbnail)
                .width(imageSizes[cardSize].width)
                .height(imageSizes[cardSize].height)
                .fit('crop')
                .auto('format')
                .url()
            : game.externalThumbnailUrl

          return (
            <div
              key={index}
              className={`${cardWidths[cardSize]} flex-shrink-0 group overflow-visible`}
            >
              <div className="game-card overflow-visible">
                {/* Thumbnail wrapper - provides space for lift effect */}
                <div className="relative aspect-[3/4] mb-1.5 overflow-visible">
                  {/* Thumbnail - moves up on hover */}
                  <div className="absolute inset-0 transition-transform duration-200 group-hover:-translate-y-3">
                    <div className="relative w-full h-full overflow-hidden rounded">
                      {thumbnailSrc ? (
                        <Image
                          src={thumbnailSrc}
                          alt={game.title}
                          fill
                          sizes="(max-width: 768px) 128px, 144px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                          <span className="text-[var(--color-text-muted)] text-xs">No image</span>
                        </div>
                      )}

                      {/* Badges */}
                      {(game.isNew || game.isFeatured) && (
                        <div className="absolute top-2 left-2 flex gap-1">
                          {game.isNew && (
                            <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                              NEW
                            </span>
                          )}
                          {game.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-[var(--color-accent-blue)] text-white text-[10px] font-bold rounded">
                              HOT
                            </span>
                          )}
                        </div>
                      )}

                      {/* Hover Buttons - slide up from bottom */}
                      <div className="absolute inset-x-0 bottom-0 flex flex-col translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <a
                          href={signUpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-black text-white hover:text-white text-xs font-semibold text-center"
                        >
                          Play now
                        </a>
                        {game.hasContent && (
                          <Link
                            href={gamePageUrl}
                            className="w-full py-2 bg-white/20 hover:bg-white/30 text-white hover:text-white text-xs font-semibold text-center transition-colors backdrop-blur-sm"
                          >
                            Game Info
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div className="px-0.5 text-center">
                  <h3 className="text-xs font-medium text-white truncate">
                    {game.title}
                  </h3>

                  {/* RTP & Volatility - always show when available */}
                  {(game.rtp || game.volatility) && (
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      {game.rtp && (
                        <span className="text-[11px]" style={{ color: 'rgb(0, 234, 105)' }}>
                          {game.rtp}%
                        </span>
                      )}
                      {game.volatility && (
                        <img
                          src={`/images/volatility/volatility-${game.volatility}.svg`}
                          alt={`${game.volatility} volatility`}
                          style={{ height: '7px', width: 'auto' }}
                        />
                      )}
                    </div>
                  )}

                  {/* Win Amount Display */}
                  {showWinAmounts && game.winAmount && (
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {game.winner}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--color-accent-green)]">
                        {game.winAmount}
                      </span>
                    </div>
                  )}

                  {/* Provider */}
                  {!showWinAmounts && game.provider && (
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                      {game.provider}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* See More Card */}
        {showSeeMore && viewAllHref && (
          <Link
            href={viewAllHref}
            className={`${cardWidths[cardSize]} flex-shrink-0 group`}
          >
            <div
              className="relative aspect-[3/4] overflow-hidden rounded flex items-center justify-center"
              style={{
                backgroundColor: '#080d14',
                backgroundImage: 'url(/images/see-more-pattern.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* See More Text */}
              <span className="relative z-10 text-white font-semibold text-sm group-hover:scale-105 transition-transform">
                See More
              </span>
            </div>
          </Link>
        )}
        </div>

        {/* Right fade gradient - appears when more content to scroll */}
        <div
          className={`absolute right-0 top-0 bottom-1 w-40 pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(26, 29, 38, 0.4) 40%, rgba(26, 29, 38, 0.8) 70%, #1A1D26 100%)',
          }}
        />
      </div>
    </section>
  )
}
