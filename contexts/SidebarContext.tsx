'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggle: () => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleMobile: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// Breakpoint where sidebar should auto-collapse (between lg and xl)
const AUTO_COLLAPSE_MAX = 1280 // xl breakpoint
const AUTO_COLLAPSE_MIN = 1024 // lg breakpoint

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOverride, setUserOverride] = useState(false)

  // Auto-collapse sidebar on mid-size screens (1024-1280px)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      // Only auto-collapse if user hasn't manually toggled
      if (!userOverride) {
        if (width >= AUTO_COLLAPSE_MIN && width < AUTO_COLLAPSE_MAX) {
          setCollapsed(true)
        } else if (width >= AUTO_COLLAPSE_MAX) {
          setCollapsed(false)
        }
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [userOverride])

  const toggle = () => {
    setUserOverride(true) // User has manually toggled
    setCollapsed(prev => !prev)
  }
  const toggleMobile = () => setMobileOpen(prev => !prev)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, mobileOpen, setMobileOpen, toggleMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
