'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroSlide {
  desktopImage?: string
  mobileImage?: string
  eyebrow?: string
  heading?: string
  ctaText?: string
  ctaLink?: string
}

interface HeroProps {
  slides?: HeroSlide[]
  autoplay?: boolean
  autoplaySpeed?: number
  signUpUrl?: string
}

// Default fallback images
const DEFAULT_DESKTOP_IMAGE = '/images/header/single-header-bg-desktop.png'
const DEFAULT_MOBILE_IMAGE = '/images/header/single-header-mob.png'

export default function Hero({
  slides,
  autoplay = true,
  autoplaySpeed = 5000,
  signUpUrl = 'https://metawin.com/',
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Normalize slides to always be an array
  const normalizedSlides = slides || []

  // Handle autoplay
  useEffect(() => {
    if (!autoplay || normalizedSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % normalizedSlides.length)
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [autoplay, autoplaySpeed, normalizedSlides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // If no slides, show fallback with default images
  if (normalizedSlides.length === 0) {
    return (
      <div className="relative md:mx-6 md:rounded-xl overflow-hidden h-[200px] sm:h-[220px] xl:h-[280px]">
        {/* Desktop Background */}
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src={DEFAULT_DESKTOP_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right"
            priority
          />
        </div>
        {/* Mobile Background */}
        <div className="absolute inset-0 sm:hidden">
          <Image
            src={DEFAULT_MOBILE_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/70 via-[#0F1115]/50 to-[#0F1115]/70 sm:bg-gradient-to-r sm:from-[#0F1115]/95 sm:via-[#0F1115]/70 sm:to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center sm:items-start px-6 md:px-10 max-w-xl lg:max-w-2xl mx-auto sm:mx-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-3">
            <span className="text-white/90 text-xs sm:text-sm">Welcome to MetaWin</span>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="sm:w-[18px] sm:h-[18px]">
              <path fill="#fff" d="M8.462 11.538 12.7 7.3l-1.05-1.088L8.462 9.4 6.85 7.825 5.8 8.875z"/>
              <path fill="#1475e1" d="m6.7 16.75-1.425-2.4-2.7-.6.262-2.775L1 8.875l1.838-2.1L2.575 4l2.7-.6L6.7 1l2.55 1.087L11.8 1l1.425 2.4 2.7.6-.263 2.775 1.838 2.1-1.838 2.1.263 2.775-2.7.6-1.425 2.4-2.55-1.088zm1.763-5.213L12.7 7.3l-1.05-1.088L8.463 9.4 6.85 7.825 5.8 8.875z"/>
            </svg>
          </div>
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 max-w-md sm:max-w-lg leading-tight text-center sm:text-left">
            The World&apos;s Best Crypto Casino & Prize Winning Platform
          </h1>
          <Link
            href={signUpUrl}
            className="w-fit px-6 sm:px-8 py-2.5 sm:py-3.5 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-semibold text-sm sm:text-base text-white hover:text-white text-center rounded transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const slide = normalizedSlides[currentSlide]
  const desktopImage = slide.desktopImage || DEFAULT_DESKTOP_IMAGE
  const mobileImage = slide.mobileImage || DEFAULT_MOBILE_IMAGE

  return (
    <div className="relative md:mx-6">
      {/* Hero Container - Compact heights */}
      <div className="relative md:rounded-xl overflow-hidden h-[200px] sm:h-[220px] xl:h-[280px]">
        {/* Background Image - Desktop/Tablet (640px+) */}
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src={desktopImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Background Image - Mobile portrait only (<640px) */}
        <div className="absolute inset-0 sm:hidden">
          <Image
            src={mobileImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Dark overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/70 via-[#0F1115]/50 to-[#0F1115]/70 sm:bg-gradient-to-r sm:from-[#0F1115]/95 sm:via-[#0F1115]/70 sm:to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center sm:items-start px-6 md:px-10 max-w-xl lg:max-w-2xl mx-auto sm:mx-0">
          {/* Eyebrow with verified badge */}
          {slide.eyebrow && (
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-3">
              <span className="text-white/90 text-xs sm:text-sm">{slide.eyebrow}</span>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="sm:w-[18px] sm:h-[18px]">
                <path fill="#fff" d="M8.462 11.538 12.7 7.3l-1.05-1.088L8.462 9.4 6.85 7.825 5.8 8.875z"/>
                <path fill="#1475e1" d="m6.7 16.75-1.425-2.4-2.7-.6.262-2.775L1 8.875l1.838-2.1L2.575 4l2.7-.6L6.7 1l2.55 1.087L11.8 1l1.425 2.4 2.7.6-.263 2.775 1.838 2.1-1.838 2.1.263 2.775-2.7.6-1.425 2.4-2.55-1.088zm1.763-5.213L12.7 7.3l-1.05-1.088L8.463 9.4 6.85 7.825 5.8 8.875z"/>
              </svg>
            </div>
          )}

          {/* Main headline - H1 for first slide only (SEO) */}
          {currentSlide === 0 ? (
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-center sm:text-left">
              {slide.heading}
            </h1>
          ) : (
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-center sm:text-left">
              {slide.heading}
            </h2>
          )}

          {/* CTA Button */}
          {slide.ctaText && (
            <Link
              href={slide.ctaLink || signUpUrl}
              className="group relative w-fit px-6 sm:px-8 py-2.5 sm:py-3.5 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] font-semibold text-sm sm:text-base text-white hover:text-white text-center rounded transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">{slide.ctaText}</span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </Link>
          )}
        </div>

        {/* Slide Indicators */}
        {normalizedSlides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {normalizedSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-4 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
