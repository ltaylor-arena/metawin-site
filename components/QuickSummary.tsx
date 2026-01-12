// Quick Summary Component
// Displays a highlighted summary box with thumbnail, intro text, and bullet highlights

import Image from 'next/image'
import { Check } from 'lucide-react'

interface QuickSummaryProps {
  title: string
  intro: string
  highlights?: string[]
  thumbnail?: string
  isNew?: boolean
  isFeatured?: boolean
}

export default function QuickSummary({
  title,
  intro,
  highlights,
  thumbnail,
  isNew,
  isFeatured
}: QuickSummaryProps) {
  if (!intro && (!highlights || highlights.length === 0)) {
    return null
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-5 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
        Quick Summary
      </h2>

      <div className="flex gap-4 md:gap-5">
        {/* Thumbnail */}
        {thumbnail && (
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-28">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[var(--color-bg-primary)]">
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
              />
              {(isNew || isFeatured) && (
                <span className={`absolute top-1 left-1 px-1.5 py-0.5 text-white text-[10px] font-bold rounded ${
                  isNew ? 'bg-green-500' : 'bg-[var(--color-accent-blue)]'
                }`}>
                  {isNew ? 'NEW' : 'HOT'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Intro text */}
          {intro && (
            <p className="text-base md:text-lg font-medium text-[var(--color-text-secondary)] leading-relaxed mb-4">
              {intro}
            </p>
          )}

          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <ul className="space-y-2">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-[var(--color-text-secondary)]">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
