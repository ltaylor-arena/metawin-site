'use client'

import { useCallback, useState, ComponentType, SVGProps } from 'react'
import { set, unset, StringInputProps } from 'sanity'
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
  Gift,
  Coins,
  Crown,
  Search,
  CircleX,
  House,
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
  type LucideIcon,
} from 'lucide-react'
import {
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
} from '../../components/icons/GameIcons'

// Type for any icon component
type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>

// Available icons - keep in sync with frontend iconMap in Sidebar.tsx
const AVAILABLE_ICONS: { name: string; icon: IconComponent; label: string; isCustom?: boolean }[] = [
  // MetaWin custom game category icons (shown first)
  { name: 'slots', icon: SlotsIcon, label: 'Slots', isCustom: true },
  { name: 'crash', icon: CrashIcon, label: 'Crash', isCustom: true },
  { name: 'all-games', icon: AllGamesIcon, label: 'All Games', isCustom: true },
  { name: 'baccarat', icon: BaccaratIcon, label: 'Baccarat', isCustom: true },
  { name: 'blackjack', icon: BlackjackIcon, label: 'Blackjack', isCustom: true },
  { name: 'bonus-buy', icon: BonusBuyIcon, label: 'Bonus Buy', isCustom: true },
  { name: 'fishing', icon: FishingIcon, label: 'Fishing', isCustom: true },
  { name: 'gameshows', icon: GameshowsIcon, label: 'Gameshows', isCustom: true },
  { name: 'live-casino', icon: LiveCasinoIcon, label: 'Live Casino', isCustom: true },
  { name: 'metawin-originals', icon: MetawinOriginalsIcon, label: 'MW Originals', isCustom: true },
  { name: 'providers', icon: ProvidersIcon, label: 'Providers', isCustom: true },
  { name: 'roulette', icon: RouletteIcon, label: 'Roulette', isCustom: true },
  { name: 'plinko', icon: PlinkoIcon, label: 'Plinko', isCustom: true },
  { name: 'zero-house-edge', icon: ZeroHouseEdgeIcon, label: '0% House Edge', isCustom: true },
  { name: 'promotions', icon: PromotionsIcon, label: 'Promotions', isCustom: true },
  { name: 'new-releases', icon: NewReleasesIcon, label: 'New Releases', isCustom: true },
  { name: 'metawinners-nft', icon: MetawinnersNftIcon, label: 'MW NFT', isCustom: true },

  // Navigation icons
  { name: 'house', icon: House, label: 'Home' },
  { name: 'flame', icon: Flame, label: 'Hot/Fire' },
  { name: 'star', icon: Star, label: 'Featured' },
  { name: 'sparkles', icon: Sparkles, label: 'New' },
  { name: 'crown', icon: Crown, label: 'VIP' },
  { name: 'gift', icon: Gift, label: 'Bonus' },
  { name: 'trophy', icon: Trophy, label: 'Winners' },
  { name: 'search', icon: Search, label: 'Search' },

  // Lucide game category icons (fallbacks)
  { name: 'gem', icon: Gem, label: 'Slots (alt)' },
  { name: 'rocket', icon: Rocket, label: 'Crash (alt)' },
  { name: 'triangle', icon: Triangle, label: 'Plinko' },
  { name: 'spade', icon: Spade, label: 'Blackjack (alt)' },
  { name: 'club', icon: Club, label: 'Baccarat (alt)' },
  { name: 'target', icon: Target, label: 'Roulette (alt)' },
  { name: 'grid-3x3', icon: Grid3x3, label: 'Keno' },
  { name: 'dice-5', icon: Dice5, label: 'Dice' },
  { name: 'wand-2', icon: Wand2, label: 'Originals (alt)' },
  { name: 'tv', icon: Tv, label: 'Live (alt)' },
  { name: 'fish', icon: Fish, label: 'Fishing (alt)' },
  { name: 'gamepad-2', icon: Gamepad2, label: 'Games' },
  { name: 'joystick', icon: Joystick, label: 'Arcade' },
  { name: 'monitor', icon: Monitor, label: 'Virtual' },

  // Card suits
  { name: 'heart', icon: Heart, label: 'Heart' },
  { name: 'diamond', icon: Diamond, label: 'Diamond' },

  // Slot symbols
  { name: 'cherry', icon: Cherry, label: 'Cherry' },
  { name: 'clover', icon: Clover, label: 'Lucky' },

  // Promo/Feature icons
  { name: 'zap', icon: Zap, label: 'Lightning' },
  { name: 'trending-up', icon: TrendingUp, label: 'Trending' },
  { name: 'coins', icon: Coins, label: 'Coins' },
  { name: 'wallet', icon: Wallet, label: 'Wallet' },
  { name: 'credit-card', icon: CreditCard, label: 'Payment' },
  { name: 'badge-dollar-sign', icon: BadgeDollarSign, label: 'Cashback' },
  { name: 'ticket', icon: Ticket, label: 'Tickets' },
  { name: 'percent', icon: Percent, label: 'Bonus %' },
  { name: 'party-popper', icon: PartyPopper, label: 'Celebrate' },
  { name: 'medal', icon: Medal, label: 'Rewards' },

  // Action/misc icons
  { name: 'users', icon: Users, label: 'Community' },
  { name: 'swords', icon: Swords, label: 'Battle' },
  { name: 'bomb', icon: Bomb, label: 'Explosive' },
  { name: 'video', icon: Video, label: 'Video' },
  { name: 'circle-dot', icon: CircleDot, label: 'Wheel' },
  { name: 'circle-x', icon: CircleX, label: 'Close' },
  { name: 'layout-grid', icon: LayoutGrid, label: 'Grid' },
]

export function IconPicker(props: StringInputProps) {
  const { value, onChange } = props
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelect = useCallback(
    (iconName: string) => {
      onChange(iconName ? set(iconName) : unset())
      setIsOpen(false)
      setSearchTerm('')
    },
    [onChange]
  )

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  const filteredIcons = AVAILABLE_ICONS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedIcon = AVAILABLE_ICONS.find((item) => item.name === value)
  const SelectedIconComponent = selectedIcon?.icon

  return (
    <div style={{ position: 'relative' }}>
      {/* Selected icon display / trigger button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            border: '1px solid var(--card-border-color, #e0e0e0)',
            borderRadius: '4px',
            background: 'var(--card-bg-color, #fff)',
            cursor: 'pointer',
            minWidth: '160px',
            fontSize: '14px',
          }}
        >
          {SelectedIconComponent ? (
            <>
              {selectedIcon.isCustom ? (
                <SelectedIconComponent width={18} height={18} />
              ) : (
                <SelectedIconComponent size={18} />
              )}
              <span>{selectedIcon.label}</span>
              <span style={{ color: '#666', fontSize: '12px' }}>({value})</span>
            </>
          ) : (
            <span style={{ color: '#666' }}>Select an icon...</span>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '8px',
              border: '1px solid var(--card-border-color, #e0e0e0)',
              borderRadius: '4px',
              background: 'var(--card-bg-color, #fff)',
              cursor: 'pointer',
              color: '#666',
              fontSize: '12px',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown picker */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            padding: '12px',
            border: '1px solid var(--card-border-color, #e0e0e0)',
            borderRadius: '6px',
            background: 'var(--card-bg-color, #fff)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '380px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {/* Search input */}
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--card-border-color, #e0e0e0)',
              borderRadius: '4px',
              marginBottom: '12px',
              fontSize: '14px',
            }}
          />

          {/* Icons grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
            }}
          >
            {filteredIcons.map((item) => {
              const IconComponent = item.icon
              const isSelected = value === item.name
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSelect(item.name)}
                  title={`${item.label} (${item.name})`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 4px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid transparent',
                    borderRadius: '4px',
                    background: isSelected ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {item.isCustom ? (
                    <IconComponent width={20} height={20} />
                  ) : (
                    <IconComponent size={20} />
                  )}
                  <span
                    style={{
                      fontSize: '9px',
                      marginTop: '2px',
                      color: '#666',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No icons found
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
          onClick={() => {
            setIsOpen(false)
            setSearchTerm('')
          }}
        />
      )}
    </div>
  )
}
