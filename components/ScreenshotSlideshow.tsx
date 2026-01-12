// Screenshot Slideshow Component
// Displays game screenshots in a carousel with thumbnails

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface SanityImageAsset {
  _ref: string
  _type: 'reference'
}

interface Screenshot {
  asset: SanityImageAsset
  alt?: string
}

interface ScreenshotSlideshowProps {
  screenshots: Screenshot[]
  gameTitle: string
}

export default function ScreenshotSlideshow({
  screenshots,
  gameTitle
}: ScreenshotSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!screenshots || screenshots.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  // Generate optimized URLs for main image (1200px wide) and thumbnails (160px wide for 2x retina)
  const getMainImageUrl = (screenshot: Screenshot) =>
    urlFor(screenshot.asset).width(1200).quality(85).auto('format').url()

  const getThumbnailUrl = (screenshot: Screenshot) =>
    urlFor(screenshot.asset).width(160).height(112).quality(60).auto('format').url()

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]">
        <Image
          src={getMainImageUrl(screenshots[activeIndex])}
          alt={screenshots[activeIndex].alt || `${gameTitle} screenshot ${activeIndex + 1}`}
          fill
          className="object-cover"
        />

        {/* Navigation Arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Counter */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 text-white text-xs">
            {activeIndex + 1} / {screenshots.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto p-1">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-[var(--color-accent-blue)] opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={getThumbnailUrl(screenshot)}
                alt={screenshot.alt || `${gameTitle} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
