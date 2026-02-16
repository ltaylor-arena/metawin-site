// Table of Contents Component
// Sticky under header on mobile, sticky in sidebar on desktop

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, List } from 'lucide-react'

export interface TOCItem {
  id: string
  title: string
}

interface TableOfContentsProps {
  items: TOCItem[]
  title?: string
  variant: 'mobile' | 'desktop'
}

export default function TableOfContents({
  items,
  title = 'Contents',
  variant
}: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  // Track active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
      }
    )

    // Observe all TOC target elements
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Close mobile menu FIRST so scroll calculation is based on collapsed height
      setIsExpanded(false)
      setActiveId(id)

      // Delay must exceed the CSS transition duration (200ms) to ensure
      // the dropdown is fully collapsed before scroll position is calculated
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 250)
    }
  }

  if (!items || items.length === 0) {
    return null
  }

  // Mobile: Sticky collapsible bar
  if (variant === 'mobile') {
    return (
      <div className="xl:hidden sticky top-[57px] z-30 bg-[#1A1D26] px-4 md:px-6 pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-white"
          aria-expanded={isExpanded}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <List className="w-4 h-4" />
            {title}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expandable dropdown */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-[400px] mt-2' : 'max-h-0'
          }`}
        >
          <nav className="rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2">
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      activeId === item.id
                        ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
                        : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-hover)]'
                    }`}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    )
  }

  // Desktop: Sticky sidebar panel
  return (
    <div className="hidden xl:block sticky top-20">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-[#111111] border-b border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <List className="w-4 h-4" />
            {title}
          </h3>
        </div>

        {/* Nav links */}
        <nav className="p-3">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeId === item.id
                      ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] font-medium'
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
