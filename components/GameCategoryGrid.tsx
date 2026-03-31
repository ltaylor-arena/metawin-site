// Game Category Grid Component
// Auto-populated grid of game category tiles with icons and game counts

import Link from 'next/link'
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
  RouletteIcon,
  PlinkoIcon,
  NewReleasesIcon,
  MetawinOriginalsIcon,
} from '@/components/icons/GameIcons'
import { Gamepad2, Dice5, Grid3x3, Bomb, Spade } from 'lucide-react'

interface Category {
  _id: string
  title: string
  slug: string
  gameCount: number
}

interface GameCategoryGridProps {
  heading?: string
  headingLevel?: string
  columns?: number
  maxItems?: number
  categories: Category[]
}

function getCategoryIcon(slug: string) {
  const iconClass = "w-full h-full"

  switch (slug) {
    case 'slots':
      return <SlotsIcon className={iconClass} />
    case 'crash-games':
    case 'crash':
      return <CrashIcon className={iconClass} />
    case 'live-casino':
      return <LiveCasinoIcon className={iconClass} />
    case 'blackjack':
      return <BlackjackIcon className={iconClass} />
    case 'roulette':
      return <RouletteIcon className={iconClass} />
    case 'baccarat':
      return <BaccaratIcon className={iconClass} />
    case 'game-shows':
    case 'gameshows':
      return <GameshowsIcon className={iconClass} />
    case 'fishing':
      return <FishingIcon className={iconClass} />
    case 'plinko':
      return <PlinkoIcon className={iconClass} />
    case 'bonus-buy':
      return <BonusBuyIcon className={iconClass} />
    case 'new-releases':
      return <NewReleasesIcon className={iconClass} />
    case 'originals':
    case 'exclusives':
    case 'metawin-originals':
    case 'metawin-exclusives':
      return <MetawinOriginalsIcon className={iconClass} />
    case 'table-games':
      return <Dice5 className={iconClass} />
    case 'all-games':
      return <AllGamesIcon className={iconClass} />
    case 'keno':
      return <Grid3x3 className={iconClass} />
    case 'mines':
      return <Bomb className={iconClass} />
    case 'poker':
    case 'video-poker':
      return <Spade className={iconClass} />
    case 'dice':
      return <Dice5 className={iconClass} />
    default:
      return <Gamepad2 className={iconClass} />
  }
}

const columnClasses: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
}

export default function GameCategoryGrid({ heading, headingLevel = 'h2', columns = 4, maxItems = 8, categories }: GameCategoryGridProps) {
  if (!categories || categories.length === 0) return null

  const displayCategories = categories.slice(0, maxItems)
  const gridCols = columnClasses[columns] || columnClasses[4]

  const renderHeading = () => {
    if (!heading) return null
    const className = "text-xl md:text-2xl font-bold text-white mb-4"
    switch (headingLevel) {
      case 'h3': return <h3 className={className}>{heading}</h3>
      case 'h4': return <h4 className={className}>{heading}</h4>
      case 'div': return <div className={className}>{heading}</div>
      default: return <h2 className={className}>{heading}</h2>
    }
  }

  return (
    <div>
      {renderHeading()}

      {/* Desktop: Grid */}
      <div className={`hidden sm:grid sm:grid-cols-3 ${gridCols} gap-3`}>
        {displayCategories.map((category) => (
          <Link
            key={category._id}
            href={`/hub/games/${category.slug}/`}
            className="group relative bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl p-3 md:p-4 transition-all duration-200 hover:border-[var(--color-accent-blue)]"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 mb-2 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center p-2 text-[var(--color-accent-blue)] group-hover:text-white transition-colors">
              {getCategoryIcon(category.slug)}
            </div>
            <h3 className="text-sm md:text-base font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors">
              {category.title}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              {category.gameCount} games
            </p>
          </Link>
        ))}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div
        className="flex sm:hidden gap-2.5 overflow-x-auto pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayCategories.map((category) => (
          <Link
            key={category._id}
            href={`/hub/games/${category.slug}/`}
            className="group flex-shrink-0 w-[120px] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl p-3 transition-all duration-200 hover:border-[var(--color-accent-blue)]"
          >
            <div className="w-9 h-9 mb-1.5 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center p-1.5 text-[var(--color-accent-blue)] group-hover:text-white transition-colors">
              {getCategoryIcon(category.slug)}
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors truncate">
              {category.title}
            </h3>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {category.gameCount} games
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
