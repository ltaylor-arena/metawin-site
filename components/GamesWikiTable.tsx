import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface Game {
  _id: string
  title: string
  slug: string
  categorySlug: string
  thumbnail?: any
  externalThumbnailUrl?: string
  provider?: string
  rtp?: number
  volatility?: 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high'
  hasContent?: boolean
  isNew?: boolean
}

// Categories where volatility doesn't apply (live tables, card games, etc.)
const HIDE_VOLATILITY_CATEGORIES = new Set([
  'blackjack',
  'baccarat',
  'roulette',
  'live-casino',
  'live-blackjack',
  'live-baccarat',
  'live-roulette',
  'live-gameshows',
  'table-games',
])

interface GamesWikiTableProps {
  games: Game[]
  categorySlug?: string
  signUpUrl?: string
  hideVolatility?: boolean
}

const volatilityLabels: Record<string, string> = {
  'low': 'Low',
  'low-medium': 'Low-Med',
  'medium': 'Medium',
  'medium-high': 'Med-High',
  'high': 'High',
}

export default function GamesWikiTable({ games, categorySlug, signUpUrl = 'https://metawin.com/signup', hideVolatility }: GamesWikiTableProps) {
  const showVolatility = hideVolatility !== undefined
    ? !hideVolatility
    : !HIDE_VOLATILITY_CATEGORIES.has(categorySlug || '')
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">No games found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-bg-tertiary)]">
            <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)]">
              Game
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)] hidden sm:table-cell">
              Provider
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)] hidden md:table-cell">
              Category
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)]">
              RTP
            </th>
            {showVolatility && (
              <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)] hidden md:table-cell">
                Volatility
              </th>
            )}
            <th className="px-4 py-3 text-right text-white font-semibold border-b border-[var(--color-border)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => {
            const gameUrl = `/casino/games/${categorySlug || game.categorySlug}/${game.slug}/`

            return (
              <tr
                key={game._id}
                className={`
                  border-b border-[var(--color-border)] last:border-b-0
                  ${index % 2 === 1 ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-primary)]'}
                  hover:bg-[var(--color-bg-tertiary)] transition-colors
                `}
              >
                {/* Game Name with Thumbnail */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      {game.thumbnail ? (
                        <Image
                          src={urlFor(game.thumbnail)
                            .width(80)
                            .height(80)
                            .fit('crop')
                            .auto('format')
                            .url()}
                          alt={game.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : game.externalThumbnailUrl ? (
                        <Image
                          src={game.externalThumbnailUrl}
                          alt={game.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                          <span className="text-[var(--color-text-muted)] text-[8px]">N/A</span>
                        </div>
                      )}
                    </div>
                    {/* Title and badges */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {game.hasContent ? (
                          <Link
                            href={gameUrl}
                            className="font-medium text-white hover:text-[var(--color-accent-blue)] transition-colors truncate"
                          >
                            {game.title}
                          </Link>
                        ) : (
                          <span className="font-medium text-white truncate">{game.title}</span>
                        )}
                        {game.isNew && (
                          <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded flex-shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      {/* Provider on mobile */}
                      {game.provider && (
                        <span className="text-xs text-[var(--color-text-muted)] sm:hidden">
                          {game.provider}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Provider */}
                <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden sm:table-cell">
                  {game.provider || '-'}
                </td>

                {/* Category */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {(categorySlug || game.categorySlug) ? (
                    <Link
                      href={`/casino/games/${categorySlug || game.categorySlug}/`}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] transition-colors capitalize"
                    >
                      {(categorySlug || game.categorySlug)?.replace(/-/g, ' ')}
                    </Link>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">-</span>
                  )}
                </td>

                {/* RTP */}
                <td className="px-4 py-3">
                  {game.rtp ? (
                    <span style={{ color: 'rgb(0, 234, 105)' }} className="font-medium">
                      {game.rtp}%
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">-</span>
                  )}
                </td>

                {/* Volatility */}
                {showVolatility && (
                  <td className="px-4 py-3 hidden md:table-cell">
                    {game.volatility ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={`/images/volatility/volatility-${game.volatility}.svg`}
                          alt={`${game.volatility} volatility`}
                          style={{ height: '10px', width: 'auto' }}
                        />
                        <span className="text-[var(--color-text-secondary)] text-xs">
                          {volatilityLabels[game.volatility] || game.volatility}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </td>
                )}

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {game.hasContent && (
                      <Link
                        href={gameUrl}
                        className="px-3 py-1.5 bg-[#6b7280] hover:bg-[#9ca3af] text-white text-xs font-semibold rounded transition-colors"
                      >
                        <span className="hidden sm:inline">Game Info</span>
                        <span className="sm:hidden">Info</span>
                      </Link>
                    )}
                    <a
                      href={signUpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white text-xs font-semibold rounded transition-colors"
                    >
                      Play
                    </a>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
