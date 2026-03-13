'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface ContentAccordionProps {
  id: string
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function ContentAccordion({
  id,
  title,
  children,
  defaultOpen = false
}: ContentAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section
      id={id}
      className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)] scroll-mt-24"
    >
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-bg-hover)] transition-colors"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <span className="text-base md:text-lg font-semibold text-white pr-4">
          {title}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        id={`${id}-content`}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 pt-1">
          {children}
        </div>
      </div>
    </section>
  )
}
