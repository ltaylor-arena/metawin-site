'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  Flame,
  Star,
  Gamepad2,
  Tv,
  Video,
  Sparkles,
  Zap,
  Fish,
  TrendingUp,
  Spade,
  Dice5,
  CircleDot,
  LayoutGrid,
  Users,
  ChevronDown,
  ChevronLeft,
  Gift,
  Coins,
  Crown,
  Search,
  CircleX,
  LucideIcon
} from 'lucide-react'
import type { SidebarNavigation, NavItem, NavSection } from '@/app/casino/layout'

const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  star: Star,
  'gamepad-2': Gamepad2,
  tv: Tv,
  'circle-x': CircleX,
  video: Video,
  sparkles: Sparkles,
  zap: Zap,
  fish: Fish,
  'trending-up': TrendingUp,
  spade: Spade,
  'dice-5': Dice5,
  'circle-dot': CircleDot,
  'layout-grid': LayoutGrid,
  users: Users,
  gift: Gift,
  coins: Coins,
  crown: Crown,
  search: Search,
}

interface SidebarProps {
  navigation: SidebarNavigation | null
}

function HighlightBadge({ highlight }: { highlight?: string }) {
  if (!highlight || highlight === 'none') return null

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${
      highlight === 'new' ? 'bg-green-500/20 text-green-400' :
      highlight === 'hot' ? 'bg-red-500/20 text-red-400' :
      'bg-yellow-500/20 text-yellow-400'
    }`}>
      {highlight.toUpperCase()}
    </span>
  )
}

export default function Sidebar({ navigation }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar()

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || LayoutGrid
    return <IconComponent className="w-5 h-5" />
  }

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }))
  }

  const isSectionOpen = (section: NavSection) => {
    if (openSections[section.sectionTitle] !== undefined) {
      return openSections[section.sectionTitle]
    }
    return section.defaultOpen
  }

  const renderNavItem = (item: NavItem, index: number) => (
    <li key={index}>
      <Link
        href={item.href || '#'}
        className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-hover)] transition-colors`}
        title={collapsed ? item.label : undefined}
      >
        {getIcon(item.icon)}
        {!collapsed && (
          <span className="text-sm flex items-center gap-2">
            {item.label}
            <HighlightBadge highlight={item.highlight} />
          </span>
        )}
      </Link>
    </li>
  )

  const renderNavSection = (section: NavSection, index: number) => (
    <li key={index} className={section.showDivider ? 'mt-4 pt-4 border-t border-[var(--color-border)]' : ''}>
      {section.isCollapsible ? (
        <>
          <button
            onClick={() => toggleSection(section.sectionTitle)}
            className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} w-full px-3 py-2 text-[var(--color-text-muted)] hover:text-white transition-colors`}
          >
            {!collapsed && (
              <span className="text-sm font-medium flex items-center gap-2">
                {section.sectionTitle}
                <HighlightBadge highlight={section.highlight} />
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isSectionOpen(section) ? 'rotate-180' : ''}`} />
          </button>

          {isSectionOpen(section) && (
            <ul className="mt-1 space-y-1">
              {section.items?.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={item.url || '#'}
                    className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-hover)] transition-colors`}
                    title={collapsed ? item.label : undefined}
                  >
                    {getIcon(item.icon)}
                    {!collapsed && (
                      <span className="text-sm flex items-center gap-2">
                        {item.label}
                        <HighlightBadge highlight={item.highlight} />
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          {!collapsed && (
            <div className="px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
              {section.sectionTitle}
              <HighlightBadge highlight={section.highlight} />
            </div>
          )}
          <ul className="space-y-1">
            {section.items?.map((item, itemIndex) => (
              <li key={itemIndex}>
                <Link
                  href={item.url || '#'}
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-hover)] transition-colors`}
                  title={collapsed ? item.label : undefined}
                >
                  {getIcon(item.icon)}
                  {!collapsed && (
                    <span className="text-sm flex items-center gap-2">
                      {item.label}
                      <HighlightBadge highlight={item.highlight} />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-56px)] z-40
        ${collapsed ? 'w-[72px]' : 'w-[240px]'} bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]
        flex flex-col
        transition-all duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Floating Collapse Toggle - positioned outside sidebar on the right */}
        <button
          onClick={toggle}
          className="hidden lg:flex absolute -right-3 top-3 w-6 h-6 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors z-50"
        >
          <ChevronLeft className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation?.items?.map((item, index) => {
              if (item._type === 'navSection') {
                return renderNavSection(item as NavSection, index)
              }
              return renderNavItem(item as NavItem, index)
            })}
          </ul>
        </nav>

      </aside>
    </>
  )
}
