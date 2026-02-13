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

      // Skip non-navigation clicks
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return
      }

      // Skip pure hash links
      if (href.startsWith('#')) {
        return
      }

      // Skip same-page hash links (full URLs or paths with hash to current page)
      try {
        const url = new URL(href, window.location.origin)
        const currentPath = window.location.pathname

        // If it's a hash link to the current page, skip
        if (url.hash && url.pathname === currentPath) {
          return
        }

        // Skip external links (different origin)
        if (url.origin !== window.location.origin) {
          return
        }
      } catch {
        // If URL parsing fails, skip to be safe
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
  // Track last pathname to detect actual page changes vs hash-only changes
  useEffect(() => {
    let lastPathname = window.location.pathname

    const handlePopState = () => {
      const currentPathname = window.location.pathname

      // Only start progress if the pathname actually changed (not just hash)
      if (currentPathname !== lastPathname) {
        NProgress.start()
        setIsNavigating(true)
      }

      lastPathname = currentPathname
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return null // NProgress injects its own DOM elements
}
