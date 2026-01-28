import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  eyebrow?: string
  heading: string
  ctaText?: string
  ctaLink?: string
}

export default function Hero({
  eyebrow = 'Welcome to MetaWin',
  heading = "The World's Best Crypto Casino & Prize Winning Platform",
  ctaText = 'Sign In',
  ctaLink = 'https://metawin.com/signin'
}: HeroProps) {
  return (
    // Outer wrapper - breaks out of 75% max-width container to go full width
    // On mobile: use negative margins to counteract page padding
    // On lg: expand to 133.33% (100%/75%) and offset by -16.67% to fill available space
    <div className="relative w-[calc(100%+2rem)] -ml-4 md:w-[calc(100%+3rem)] md:-ml-6 lg:w-[133.333%] lg:-ml-[16.667%] overflow-hidden">
      {/* Inner hero with background - full width */}
      {/* Mobile/Tablet: stacked layout, Desktop (lg+): side-by-side layout */}
      <div className="relative w-full h-[420px] lg:h-[320px]">
        {/* Background gradient - different directions for mobile/tablet vs desktop */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 121, 255, 0.4) 0%, #0F1115 50%)'
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background: 'linear-gradient(to right, #0F1115 0%, #0F1115 50%, rgba(0, 121, 255, 0.5) 100%)'
          }}
        />

        {/* Background image - game tiles, aligned right with fade-in from left */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 right-0 h-full w-[80%] translate-x-[30%]"
            style={{
              maskImage: 'linear-gradient(to right, transparent 20%, black 60%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 20%, black 60%)'
            }}
          >
            <Image
              src="/images/header/header-background.png"
              alt=""
              fill
              className="object-cover object-left opacity-[0.13]"
              priority
            />
          </div>
        </div>

        {/* Radial gradient overlay */}
        {/* Mobile/Tablet: top center, Desktop: top left */}
        <div
          className="absolute inset-0 pointer-events-none lg:hidden"
          style={{
            background: 'radial-gradient(ellipse at top center, rgba(0, 121, 255, 0.3) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(0, 121, 255, 0.35) 0%, transparent 60%)'
          }}
        />

        {/* Content container - constrained to match body content width */}
        <div className="relative h-full lg:max-w-[75%] lg:mx-auto">
          {/* Characters group - bottom center on mobile/tablet, right side on desktop */}
          {/* Smaller at lg, larger at xl to prevent overlap */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[5%] xl:right-[10%] h-[230px] lg:h-full w-[368px] lg:w-[380px] xl:w-[480px] pointer-events-none">
            <Image
              src="/images/header/characters-group.png"
              alt=""
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>

          {/* Text content - centered on mobile/tablet, left-aligned on desktop */}
          <div className="relative z-10 h-auto lg:h-full flex flex-col items-center lg:items-start justify-start lg:justify-center pt-8 lg:pt-0 px-6 lg:px-8">
            {/* Eyebrow with verified badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/90 text-sm">{eyebrow}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fill="#fff" d="M8.462 11.538 12.7 7.3l-1.05-1.088L8.462 9.4 6.85 7.825 5.8 8.875z"/>
                <path fill="#1475e1" d="m6.7 16.75-1.425-2.4-2.7-.6.262-2.775L1 8.875l1.838-2.1L2.575 4l2.7-.6L6.7 1l2.55 1.087L11.8 1l1.425 2.4 2.7.6-.263 2.775 1.838 2.1-1.838 2.1.263 2.775-2.7.6-1.425 2.4-2.55-1.088zm1.763-5.213L12.7 7.3l-1.05-1.088L8.463 9.4 6.85 7.825 5.8 8.875z"/>
              </svg>
            </div>

            {/* Main headline */}
            <h1 className="text-white text-[22px] md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-5 text-center lg:text-left max-w-[280px] md:max-w-sm lg:max-w-sm xl:max-w-lg leading-tight">
              {heading}
            </h1>

            {/* CTA Button */}
            {ctaText && (
              <Link
                href={ctaLink || '#'}
                className="group relative w-full max-w-[280px] md:max-w-xs lg:w-fit lg:max-w-none px-8 py-3.5 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-semibold text-white hover:text-white text-center rounded transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">{ctaText}</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </Link>
            )}
          </div>

          {/* MetaWinners NFT link - hidden on mobile/tablet, visible on desktop */}
          <div className="hidden lg:block absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <Link
              href="https://opensea.io/collection/metawinners-1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors"
              style={{ textShadow: '0 0 8px rgba(0, 0, 0, 1), 0 0 16px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.7)' }}
            >
              <span>MetaWinners NFT on</span>
              <Image
                src="/images/opensea-logo.svg"
                alt="OpenSea"
                width={16}
                height={16}
                className="inline-block"
              />
              <span>OpenSea</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
