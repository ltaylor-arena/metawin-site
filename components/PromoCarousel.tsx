// Promo Cards Carousel
// Auto-playing carousel on mobile, stacked column on desktop

'use client'

import { useState, useEffect, useCallback } from 'react'

interface PromoCard {
  _key: string
  title: string
  headingLevel?: string
  subtitle?: string
  colorTheme?: string
  backgroundImage?: string
  link?: string
}

interface PromoCarouselProps {
  cards: PromoCard[]
  autoplaySpeed?: number
}

const gradientColors: Record<string, string> = {
  blue: 'from-blue-600/80',
  orange: 'from-orange-500/80',
  purple: 'from-purple-600/80',
  green: 'from-emerald-600/80',
  pink: 'from-pink-500/80',
}

function CardContent({ card }: { card: PromoCard }) {
  const gradient = gradientColors[card.colorTheme || 'blue'] || gradientColors.blue

  return (
    <>
      {card.backgroundImage && (
        <img
          src={card.backgroundImage}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} via-transparent to-transparent`} />
      <div className="absolute bottom-2 left-2 right-2">
        {card.headingLevel === 'h2' ? (
          <h2 className="text-white text-base font-semibold drop-shadow-lg">{card.title}</h2>
        ) : card.headingLevel === 'h3' ? (
          <h3 className="text-white text-base font-semibold drop-shadow-lg">{card.title}</h3>
        ) : card.headingLevel === 'h4' ? (
          <h4 className="text-white text-base font-semibold drop-shadow-lg">{card.title}</h4>
        ) : (
          <span className="block text-white text-base font-semibold drop-shadow-lg">{card.title}</span>
        )}
        {card.subtitle && (
          <p className="text-white/80 text-xs drop-shadow-lg mt-0.5 line-clamp-2">
            {card.subtitle}
          </p>
        )}
      </div>
    </>
  )
}

export default function PromoCarousel({ cards, autoplaySpeed = 4000 }: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % cards.length)
  }, [cards.length])

  // Autoplay
  useEffect(() => {
    if (cards.length <= 1) return
    const timer = setInterval(next, autoplaySpeed)
    return () => clearInterval(timer)
  }, [next, autoplaySpeed, cards.length])

  if (!cards || cards.length === 0) return null

  return (
    <>
      {/* Mobile: Carousel */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-md">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {cards.map((card) => (
              <a
                key={card._key}
                href={card.link}
                className="relative block w-full flex-shrink-0 aspect-[16/9] rounded-md overflow-hidden group"
              >
                <CardContent card={card} />
              </a>
            ))}
          </div>
        </div>

        {/* Dots */}
        {cards.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? 'bg-white w-4'
                    : 'bg-white/30'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Stacked column */}
      <div className="hidden lg:flex flex-col gap-3">
        {cards.map((card) => (
          <a
            key={card._key}
            href={card.link}
            className="relative block w-full aspect-[16/9] rounded-md overflow-hidden group"
          >
            <CardContent card={card} />
          </a>
        ))}
      </div>
    </>
  )
}
