// Navigation Progress Bar Component
// Shows a thin progress bar at the top during page navigation

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  speed: 300,
  trickleSpeed: 150,
})

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // When pathname or search params change, navigation is complete
    if (isNavigating) {
      NProgress.done()
      setIsNavigating(false)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    // Intercept clicks on links to start progress
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Skip external links, hash links, and non-navigation clicks
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return
      }

      // Start progress for internal navigation
      NProgress.start()
      setIsNavigating(true)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      NProgress.start()
      setIsNavigating(true)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return null // NProgress injects its own DOM elements
}
