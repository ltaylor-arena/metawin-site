'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PortableText, PortableTextBlock } from '@portabletext/react'

interface FAQItem {
  _key: string
  question: string
  answer: PortableTextBlock[]
}

interface FAQProps {
  heading?: string
  items: FAQItem[]
}

// Convert Portable Text to plain text for JSON-LD
function portableTextToPlain(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return block.children.map((child: any) => child.text || '').join('')
    })
    .join('\n\n')
}

export default function FAQ({ heading = 'Frequently Asked Questions', items }: FAQProps) {
  // First item open by default
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    if (items?.[0]?._key) {
      initial[items[0]._key] = true
    }
    return initial
  })

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!items || items.length === 0) return null

  // Generate JSON-LD structured data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: portableTextToPlain(item.answer)
      }
    }))
  }

  return (
    <section className="py-5">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Section Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
        {heading}
      </h2>

      {/* FAQ Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openItems[item._key] ?? false

          return (
            <div
              key={item._key}
              className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item._key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                <span className="text-sm md:text-base font-medium text-white pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer Content */}
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pt-1 text-sm md:text-base text-[var(--color-text-secondary)] prose prose-invert prose-sm max-w-none">
                  <PortableText value={item.answer} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
