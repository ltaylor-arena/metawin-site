// Expandable Text Component
// Displays plain text with a "Read More" toggle for long content on mobile

'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'

interface ExpandableTextProps {
  text: string
  maxLinesMobile?: number
  className?: string
}

export default function ExpandableText({
  text,
  maxLinesMobile = 2,
  className = ''
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Check if content exceeds maxLines on mobile
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        // Only check on mobile/small screens (< 768px)
        const isMobile = window.innerWidth < 768
        if (!isMobile) {
          setNeedsExpansion(false)
          return
        }

        const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight) || 24
        const maxHeight = lineHeight * maxLinesMobile
        const actualHeight = textRef.current.scrollHeight
        setNeedsExpansion(actualHeight > maxHeight + 8) // small buffer
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text, maxLinesMobile])

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={`text-[var(--color-text-muted)] transition-all duration-300 ${className}`}
        style={needsExpansion && !isExpanded ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLinesMobile,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } : undefined}
      >
        {text}
      </p>

      {/* Read More / Read Less Button - only on mobile when needed */}
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-blue)] hover:text-white transition-colors md:hidden"
        >
          {isExpanded ? (
            <>
              <Minus className="w-3.5 h-3.5" />
              <span>Read Less</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Read More</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
