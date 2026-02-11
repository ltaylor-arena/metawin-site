// TopHeader Component
// Main site header with logo and sign in button
// Block element with solid background - content flows below

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

interface TopHeaderProps {
  signUpUrl?: string
}

export default function TopHeader({ signUpUrl = 'https://metawin.com/' }: TopHeaderProps) {
  const { toggleMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-40 h-[62px] bg-[#0F1115] border-b lg:border-l border-[var(--color-border)]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sign In Button */}
          <Link
            href={signUpUrl}
            className="group relative px-6 py-2 rounded font-semibold text-sm bg-[var(--color-accent-blue)] text-white hover:bg-[var(--color-accent-blue-hover)] hover:text-white transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </Link>
        </div>
      </div>
    </header>
  )
}
