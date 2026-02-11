// Expandable Rich Text Component
// Displays rich text content with a "Read More" toggle for long content

'use client'

import { useState, useRef, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { Plus, Minus } from 'lucide-react'
import { portableTextComponents } from './PortableTextComponents'

interface ExpandableRichTextProps {
  content: any
  maxLines?: number
  className?: string
}

export default function ExpandableRichText({
  content,
  maxLines = 6,
  className = ''
}: ExpandableRichTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Calculate line height and check if content exceeds maxLines
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 24
      const maxHeight = lineHeight * maxLines
      const actualHeight = contentRef.current.scrollHeight
      setNeedsExpansion(actualHeight > maxHeight + 20) // 20px buffer
    }
  }, [content, maxLines])

  const collapsedStyle = {
    maxHeight: isExpanded ? 'none' : `${maxLines * 1.6}em`,
    overflow: 'hidden' as const,
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-[0.9rem] prose-p:leading-[1.6] transition-all duration-300 ${className}`}
        style={needsExpansion ? collapsedStyle : undefined}
      >
        <PortableText value={content} components={portableTextComponents} />
      </div>

      {/* Gradient Overlay - only show when collapsed and needs expansion */}
      {needsExpansion && !isExpanded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F1115] to-transparent pointer-events-none"
        />
      )}

      {/* Read More / Read Less Button */}
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative z-10 mt-4 flex items-center gap-2 text-sm font-medium text-[var(--color-accent-blue)] hover:text-white transition-colors"
        >
          {isExpanded ? (
            <>
              <Minus className="w-4 h-4" />
              <span>Read Less</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Read More</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
