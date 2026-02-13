// Custom PortableText components for rendering rich text content
// Includes support for images with captions, callouts, and smart links

import Image from 'next/image'
import Link from 'next/link'
import { PortableTextComponents, PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import { AlertCircle, Info, CheckCircle, Lightbulb } from 'lucide-react'

interface ImageValue {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

interface CalloutValue {
  _type: 'callout'
  title?: string
  content?: any[]
  variant?: 'info' | 'warning' | 'success' | 'tip'
}

interface LinkValue {
  _type: 'link'
  linkType?: 'internal' | 'external'
  href?: string // For external links and resolved internal links
  nofollow?: boolean // External links only
  openInNewTab?: boolean // External links only
}

const calloutStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    title: 'text-blue-400',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    title: 'text-yellow-400',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    title: 'text-green-400',
  },
  tip: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    title: 'text-purple-400',
  },
}

const calloutIcons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  tip: Lightbulb,
}

export const portableTextComponents: PortableTextComponents = {
  marks: {
    // Custom link annotation handler
    link: ({ value, children }: { value?: LinkValue; children: React.ReactNode }) => {
      if (!value?.href) {
        return <>{children}</>
      }

      const isExternal = value.linkType === 'external'

      if (isExternal) {
        // External link with optional nofollow and new tab
        const relValues: string[] = []
        if (value.nofollow) relValues.push('nofollow')
        if (value.openInNewTab) relValues.push('noopener', 'noreferrer')

        return (
          <a
            href={value.href}
            target={value.openInNewTab ? '_blank' : undefined}
            rel={relValues.length > 0 ? relValues.join(' ') : undefined}
            className="text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue-hover)] underline"
          >
            {children}
          </a>
        )
      }

      // Internal link - use Next.js Link
      return (
        <Link
          href={value.href}
          className="text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue-hover)] underline"
        >
          {children}
        </Link>
      )
    },
  },
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
    callout: ({ value }: { value: CalloutValue }) => {
      if (!value?.content || value.content.length === 0) return null

      const variant = value.variant || 'info'
      const styles = calloutStyles[variant]
      const Icon = calloutIcons[variant]

      return (
        <div className={`not-prose my-6 rounded-xl border ${styles.bg} ${styles.border} p-4 md:p-5`}>
          <div className="flex gap-3">
            <div className={`flex-shrink-0 ${styles.icon}`}>
              <Icon className="w-5 h-5 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              {value.title && (
                <h4 className={`font-semibold ${styles.title} mb-2`}>
                  {value.title}
                </h4>
              )}
              <div className="prose prose-invert prose-sm max-w-none [&>p]:text-[var(--color-text-secondary)] [&>p]:leading-relaxed [&>p:last-child]:mb-0">
                <PortableText value={value.content} />
              </div>
            </div>
          </div>
        </div>
      )
    },
  },
}
