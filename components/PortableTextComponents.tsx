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
  layout?: 'framed' | 'full-width'
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

// Generate URL-friendly ID from heading text (must match extractTocItems logic)
function headingId(children: React.ReactNode): string {
  const text = typeof children === 'string'
    ? children
    : Array.isArray(children)
      ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
      : ''
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 id={headingId(children)}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 id={headingId(children)}>{children}</h3>
    ),
  },
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

      // Full-width layout: no frame, no border, no caption treatment
      if (value.layout === 'full-width') {
        return (
          <figure className="not-prose my-6">
            <Image
              src={imageUrl}
              alt={value.alt || 'Image'}
              width={800}
              height={450}
              sizes="(max-width: 768px) 100vw, 800px"
              className="w-full h-auto rounded-lg"
            />
          </figure>
        )
      }

      // Default framed layout
      return (
        <figure className="not-prose my-6 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <Image
            src={imageUrl}
            alt={value.alt || 'Image'}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, 800px"
            className="w-full h-auto"
          />
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
          {value.title && (
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-5 h-5 flex-shrink-0 ${styles.icon}`} />
              <h4 className={`font-semibold ${styles.title}`}>
                {value.title}
              </h4>
            </div>
          )}
          <div className="flex gap-3">
            {!value.title && (
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
            )}
            <div className="flex-1 min-w-0 prose prose-invert prose-sm max-w-none [&>p]:text-[var(--color-text-secondary)] [&>p]:leading-relaxed [&>p:last-child]:mb-0">
              <PortableText value={value.content} />
            </div>
          </div>
        </div>
      )
    },
  },
}
