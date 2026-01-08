import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  heading: string
  subheading?: string
  image?: {
    url: string
    alt?: string
  }
  ctaText?: string
  ctaLink?: string
}

export default function Hero({
  heading,
  subheading,
  image,
  ctaText,
  ctaLink
}: HeroProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className="relative aspect-[10/3] md:aspect-[30/7] w-full">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || heading}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)]" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight">
              {heading}
            </h2>

            {subheading && (
              <p className="text-sm md:text-lg text-[var(--color-text-secondary)] mb-4 md:mb-6 max-w-lg">
                {subheading}
              </p>
            )}

            {ctaText && (
              <Link
                href={ctaLink || '#'}
                className="btn-primary inline-block text-sm md:text-base"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
