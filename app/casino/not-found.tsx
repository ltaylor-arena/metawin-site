// 404 Not Found Page
// Displayed when a page doesn't exist within the /casino section

import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Metadata } from 'next'
import BackButton from '@/components/BackButton'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="text-[120px] md:text-[160px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none">
          404
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-white -mt-4 mb-3">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/casino/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white font-semibold rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <Link
            href="/casino/games/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-white font-medium rounded-lg transition-colors border border-[var(--color-border)]"
          >
            <Search className="w-4 h-4" />
            Browse Games
          </Link>
        </div>

        {/* Back Link */}
        <BackButton />
      </div>
    </div>
  )
}
