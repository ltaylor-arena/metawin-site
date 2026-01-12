// Header Component
// Mobile header with menu toggle and search

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import SearchModal from './SearchModal'

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
        <Link href="/casino/" className="text-lg font-bold text-white">
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
      
      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
