// TopHeader Component
// Main site header with logo, search bar, and sign in button
// Matches metawin.com header design

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const { toggleMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-50 bg-[#0d0f13] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors mr-2"
        >
          <Menu className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>

        {/* Logo */}
        <Link href="/casino/" className="flex items-center shrink-0">
          <Image
            src="/images/metawin-logo-white.svg"
            alt="MetaWin"
            width={120}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </Link>

        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any game or provider"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-white text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
            <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>

          {/* Sign In Button */}
          <Link
            href="https://metawin.com/signin"
            className="group relative px-4 py-2 rounded-lg font-semibold text-sm bg-[var(--color-accent-blue)] text-white hover:bg-[var(--color-accent-blue-hover)] hover:text-white transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </Link>

        </div>
      </div>
    </header>
  )
}
