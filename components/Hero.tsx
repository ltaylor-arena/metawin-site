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
    <div className="relative w-full overflow-hidden rounded-lg md:h-[298px] bg-[#000107]">
      {/* Background Image - only visible on md+ */}
      {image?.url && image.url.length > 0 && (
        <div className="hidden md:block absolute inset-0">
          <Image
            src={image.url}
            alt={image.alt || heading}
            fill
            className="object-cover object-right"
            priority
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000107] via-[#000107]/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center md:items-start p-5 md:py-6 md:px-10 min-h-[200px] md:min-h-full md:h-full">
        <h2 className="text-white text-center md:text-left text-2xl md:text-[32px] font-bold mb-5 md:w-[520px] md:leading-[44px]">
          {heading}
        </h2>

        {subheading && (
          <p className="text-white/80 text-center md:text-left text-sm md:text-base mb-5 max-w-md">
            {subheading}
          </p>
        )}

        {ctaText && (
          <Link
            href={ctaLink || '#'}
            className="group relative w-full md:w-[266px] max-w-[266px] py-4 px-8 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-bold text-white hover:text-white text-center rounded transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">{ctaText}</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </Link>
        )}
      </div>
    </div>
  )
}
