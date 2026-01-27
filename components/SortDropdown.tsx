'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export type SortOption =
  | 'featured'         // Games with reviews/content first, then A-Z
  | 'a-z'              // Alphabetical A-Z
  | 'z-a'              // Alphabetical Z-A
  | 'rtp'              // Highest RTP first

interface SortDropdownProps {
  isSlots?: boolean
  currentSort?: SortOption
}

const SLOTS_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'a-z', label: 'A - Z' },
  { value: 'z-a', label: 'Z - A' },
  { value: 'rtp', label: 'Highest RTP' },
]

const DEFAULT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'a-z', label: 'A - Z' },
  { value: 'z-a', label: 'Z - A' },
  { value: 'rtp', label: 'Highest RTP' },
]

export default function SortDropdown({ isSlots = false, currentSort }: SortDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const options = isSlots ? SLOTS_OPTIONS : DEFAULT_OPTIONS
  const defaultSort = isSlots ? 'featured' : 'a-z'
  const activeSort = currentSort || (searchParams.get('sort') as SortOption) || defaultSort

  const activeLabel = options.find(opt => opt.value === activeSort)?.label || options[0].label

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: SortOption) => {
    setIsOpen(false)

    const params = new URLSearchParams(searchParams.toString())

    // Reset to page 1 when changing sort
    params.delete('page')

    // Set or remove sort param
    if (value === defaultSort) {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-sm text-white transition-colors"
      >
        <span className="text-[var(--color-text-muted)]">Sort:</span>
        <span>{activeLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                activeSort === option.value
                  ? 'bg-[var(--color-accent-blue)] text-white'
                  : 'text-white hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
