// Header Component
// Mobile header with menu toggle and search

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X, MessageCircle } from 'lucide-react'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] lg:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        
        {/* Logo */}
        <Link href="/casino" className="text-lg font-bold text-white">
          METAWIN
        </Link>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <Link
            href="https://metawin.com/signin"
            className="btn-primary text-sm py-2 px-4"
          >
            Sign In
          </Link>
        </div>
      </div>
      
      {/* Search Bar (Expandable) */}
      {searchOpen && (
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search any game or provider"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-blue)]"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
