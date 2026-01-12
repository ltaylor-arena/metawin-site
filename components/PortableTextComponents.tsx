// Custom PortableText components for rendering rich text content
// Includes support for images with captions

import Image from 'next/image'
import { PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'

interface ImageValue {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset?._ref) {
        return null
      }

      const imageUrl = urlFor(value.asset).width(800).quality(85).auto('format').url()

      return (
        <figure className="not-prose my-6 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={value.alt || 'Image'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="px-4 py-3 text-sm text-[var(--color-text-muted)] text-center italic bg-[var(--color-bg-tertiary)]">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}
