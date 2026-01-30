'use client'

import { useState, useEffect, ComponentType, SVGProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Gem,
  Rocket,
  Triangle,
  Club,
  Target,
  Grid3x3,
  Wand2,
  Trophy,
  Percent,
  Wallet,
  CreditCard,
  BadgeDollarSign,
  Ticket,
  PartyPopper,
  Medal,
  Swords,
  Bomb,
  Cherry,
  Clover,
  Heart,
  Diamond,
  Joystick,
  Monitor,
  LucideIcon
} from 'lucide-react'
import {
  HomeIcon,
  SlotsIcon,
  CrashIcon,
  AllGamesIcon,
  BaccaratIcon,
  BlackjackIcon,
  BonusBuyIcon,
  FishingIcon,
  GameshowsIcon,
  LiveCasinoIcon,
  MetawinOriginalsIcon,
  ProvidersIcon,
  RouletteIcon,
  PlinkoIcon,
  ZeroHouseEdgeIcon,
  PromotionsIcon,
  NewReleasesIcon,
  MetawinnersNftIcon,
} from '@/components/icons/GameIcons'
import type { SidebarNavigation, NavItem, NavSection } from '@/app/casino/layout'
import SearchModal from './SearchModal'

// Type for icon components (both Lucide and custom SVG icons)
type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>

const iconMap: Record<string, IconComponent> = {
  // Navigation icons
  house: HomeIcon,
  flame: Flame,
  star: Star,
  sparkles: Sparkles,
  crown: Crown,
  gift: Gift,
  trophy: Trophy,
  search: Search,

  // MetaWin custom game category icons
  'slots': SlotsIcon,
  'crash': CrashIcon,
  'all-games': AllGamesIcon,
  'baccarat': BaccaratIcon,
  'blackjack': BlackjackIcon,
  'bonus-buy': BonusBuyIcon,
  'fishing': FishingIcon,
  'gameshows': GameshowsIcon,
  'live-casino': LiveCasinoIcon,
  'metawin-originals': MetawinOriginalsIcon,
  'providers': ProvidersIcon,
  'roulette': RouletteIcon,
  'plinko': PlinkoIcon,
  'zero-house-edge': ZeroHouseEdgeIcon,
  'promotions': PromotionsIcon,
  'new-releases': NewReleasesIcon,
  'metawinners-nft': MetawinnersNftIcon,

  // Lucide game category icons (fallbacks)
  gem: Gem,
  rocket: Rocket,
  triangle: Triangle,
  spade: Spade,
  club: Club,
  target: Target,
  'grid-3x3': Grid3x3,
  'dice-5': Dice5,
  'wand-2': Wand2,
  tv: Tv,
  fish: Fish,
  'gamepad-2': Gamepad2,
  joystick: Joystick,
  monitor: Monitor,

  // Card suits
  heart: Heart,
  diamond: Diamond,

  // Slot symbols
  cherry: Cherry,
  clover: Clover,

  // Promo/Feature icons
  zap: Zap,
  'trending-up': TrendingUp,
  coins: Coins,
  wallet: Wallet,
  'credit-card': CreditCard,
  'badge-dollar-sign': BadgeDollarSign,
  ticket: Ticket,
  percent: Percent,
  'party-popper': PartyPopper,
  medal: Medal,

  // Action/misc icons
  users: Users,
  swords: Swords,
  bomb: Bomb,
  video: Video,
  'circle-dot': CircleDot,
  'circle-x': CircleX,
  'layout-grid': LayoutGrid,
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
  const [searchOpen, setSearchOpen] = useState(false)
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar()
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

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
    <li key={index} className={`${section.showDivider ? 'mt-4 pt-4' : ''} ${section.isCollapsible ? 'pb-4 mb-2' : ''}`}>
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
        fixed top-0 left-0 h-screen z-40
        ${collapsed ? 'w-[72px]' : 'w-[260px]'} bg-[#0F1115]
        flex flex-col
        transition-all duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Top Section - aligns with header height */}
        <div className="h-[62px] flex items-center border-b border-[var(--color-border)]">
          {!collapsed ? (
            <div className="px-4 w-full">
              <div className="flex gap-2">
                <Link
                  href="/games/"
                  className="flex-1 text-center py-2 px-3 rounded-md text-xs font-medium text-[var(--color-text-secondary)] hover:text-white active:text-white bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  Casino
                </Link>
                <Link
                  href="/prizes/"
                  className="flex-1 text-center py-2 px-3 rounded-md text-xs font-medium text-[var(--color-text-secondary)] hover:text-white active:text-white bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  Prizes
                </Link>
                <Link
                  href="/sports/"
                  className="flex-1 text-center py-2 px-3 rounded-md text-xs font-medium text-[var(--color-text-secondary)] hover:text-white active:text-white bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  Sports
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-[var(--color-text-muted)] text-xs">MW</span>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="p-3">
          <button
            onClick={() => setSearchOpen(true)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg bg-[#1A1D26] border border-[#252831] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-accent-blue)] transition-colors`}
            title={collapsed ? 'Search games' : undefined}
          >
            <Search className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Search games...</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)]" />

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

        {/* Bottom Section - Deposit, Socials, Collapse */}
        <div className="p-3 border-t border-[var(--color-border)]">
          {/* Deposit Button */}
          <a
            href="https://metawin.com/deposit"
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-3 rounded-lg bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white hover:text-white font-semibold text-center transition-colors ${collapsed ? 'px-2 text-xs' : ''}`}
          >
            {collapsed ? '$' : 'Deposit'}
          </a>

          {/* Social Icons */}
          {!collapsed && (
            <div className="flex items-center justify-center gap-4 mt-3">
              <a href="https://discord.gg/metawin" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://twitter.com/meta_winners" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://t.me/metawin" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          )}

          {/* Collapse Toggle */}
          <div className={`hidden lg:flex mt-3 ${collapsed ? 'justify-center' : 'justify-end'}`}>
            <button
              onClick={toggle}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1D26] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      </aside>
    </>
  )
}
