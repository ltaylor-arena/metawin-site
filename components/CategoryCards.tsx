// Category Cards Component
// Large promotional cards with images and CTAs
// Desktop: 3-column grid, Mobile: horizontal scroll

'use client'

import Image from 'next/image'
import Link from 'next/link'

interface CategoryCard {
  _key: string
  image?: string
  title: string
  description?: string
  ctaText: string
  ctaLink: string
}

interface CategoryCardsProps {
  heading?: string
  description?: string
  cards: CategoryCard[]
}

function Card({ card }: { card: CategoryCard }) {
  const isExternal = card.ctaLink?.startsWith('http')

  return (
    <div className="flex flex-col gap-2">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 280px, 400px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#080d14]">
            <span className="text-[var(--color-text-muted)] text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Description text - optional */}
      {card.description && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {card.description}
        </p>
      )}

      {/* CTA Button */}
      <Link
        href={card.ctaLink}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="block w-full py-3 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white hover:text-white font-semibold text-center rounded-lg transition-colors"
      >
        {card.ctaText}
      </Link>
    </div>
  )
}

export default function CategoryCards({ heading, description, cards }: CategoryCardsProps) {
  if (!cards || cards.length === 0) return null

  return (
    <section className="py-6 px-4 md:px-6">
      {/* Header */}
      {(heading || description) && (
        <div className="mb-4">
          {heading && (
            <h2 className="text-xl md:text-2xl font-bold text-white">{heading}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
      )}

      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card._key} card={card} />
        ))}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div
        className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cards.map((card) => (
          <div key={card._key} className="w-[280px] flex-shrink-0">
            <Card card={card} />
          </div>
        ))}
      </div>
    </section>
  )
}
