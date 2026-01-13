// Game Carousel Component
// Horizontal scrolling game cards with navigation

'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface Game {
  title: string
  slug: string
  categorySlug?: string
  thumbnail: any // Sanity image reference
  provider?: string
  rtp?: number
  volatility?: 'low' | 'medium' | 'high'
  winAmount?: string
  winner?: string
}

interface GameCarouselProps {
  title: string
  games: Game[]
  showWinAmounts?: boolean
  cardSize?: 'small' | 'medium' | 'large'
  viewAllHref?: string
  badge?: 'Live' | '24h' | 'New' | 'Hot'
}

export default function GameCarousel({
  title,
  games,
  showWinAmounts = false,
  cardSize = 'medium',
  viewAllHref,
  badge,
}: GameCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  const cardWidths = {
    small: 'w-32 md:w-36',
    medium: 'w-36 md:w-44',
    large: 'w-44 md:w-56',
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
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        
        <div className="flex items-center gap-3">
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
          
          {/* View All Link */}
          {viewAllHref && (
            <Link 
              href={viewAllHref}
              className="text-sm text-[var(--color-accent-blue)] hover:underline"
            >
              View All
            </Link>
          )}
          
          {/* Navigation Arrows */}
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
        </div>
      </div>
      
      {/* Carousel */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-6 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game, index) => (
          <Link
            key={index}
            href={`/casino/${game.categorySlug || 'games'}/${game.slug}/`}
            className={`${cardWidths[cardSize]} flex-shrink-0 group`}
          >
            <div className="game-card">
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={urlFor(game.thumbnail)
                    .width(imageSizes[cardSize].width)
                    .height(imageSizes[cardSize].height)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="game-card-overlay flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
              </div>
              
              {/* Game Info */}
              <div className="mt-2 px-1">
                <h3 className="text-sm font-medium text-white truncate">
                  {game.title}
                </h3>

                {/* RTP & Volatility - always show when available */}
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

                {/* Win Amount Display */}
                {showWinAmounts && game.winAmount && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {game.winner}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-accent-green)]">
                      {game.winAmount}
                    </span>
                  </div>
                )}

                {/* Provider */}
                {!showWinAmounts && game.provider && (
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {game.provider}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
