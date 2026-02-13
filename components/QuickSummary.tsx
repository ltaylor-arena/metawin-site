// Quick Summary Component
// Displays a highlighted summary box with thumbnail and intro text (rich text)

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Zap } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface QuickSummaryProps {
  title: string
  intro: any[] // Portable Text blocks
  thumbnail?: any // Sanity image reference
  externalThumbnailUrl?: string // CDN fallback URL
  isNew?: boolean
}

export default function QuickSummary({
  title,
  intro,
  thumbnail,
  externalThumbnailUrl,
  isNew,
}: QuickSummaryProps) {
  if (!intro || intro.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-5 md:p-6">
      <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-white mb-4">
        <Zap className="w-5 h-5 text-[var(--color-accent-gold)] fill-current" />
        Quick Summary
      </h2>

      <div className="flex gap-4 md:gap-5">
        {/* Thumbnail - use Sanity image or CDN fallback */}
        {(thumbnail || externalThumbnailUrl) && (
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-28">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[var(--color-bg-primary)]">
              <Image
                src={thumbnail
                  ? urlFor(thumbnail)
                      .width(224)
                      .height(300)
                      .fit('crop')
                      .auto('format')
                      .url()
                  : externalThumbnailUrl!
                }
                alt={title}
                fill
                className="object-cover"
              />
              {isNew && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 text-white text-[10px] font-bold rounded bg-green-500">
                  NEW
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 prose prose-invert prose-sm md:prose-base max-w-none [&>p]:text-[var(--color-text-secondary)] [&>p]:leading-relaxed [&>p:last-child]:mb-0">
          <PortableText value={intro} />
        </div>
      </div>
    </div>
  )
}
