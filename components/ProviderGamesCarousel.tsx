'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface Game {
  _id: string
  title: string
  slug: string
  categorySlug: string
  thumbnail: any // Sanity image reference
  provider: string
  rtp?: number
  volatility?: 'low' | 'medium' | 'high'
}

interface ProviderGamesCarouselProps {
  provider: string
  games: Game[]
}

export default function ProviderGamesCarousel({ provider, games }: ProviderGamesCarouselProps) {
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
        {games.map((game) => (
          <Link
            key={game._id}
            href={`/casino/${game.categorySlug}/${game.slug}/`}
            className="w-36 md:w-44 flex-shrink-0 group"
          >
            <div className="game-card">
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={urlFor(game.thumbnail)
                    .width(352)
                    .height(470)
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
          </Link>
        ))}
      </div>
    </section>
  )
}
