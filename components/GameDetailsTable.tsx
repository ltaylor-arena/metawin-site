// Game Details Table Component
// Displays game specifications in a styled table

import { Check, X } from 'lucide-react'

interface Category {
  _id: string
  title: string
  slug: string
}

interface GameDetailsTableProps {
  name: string
  provider?: string
  rtp?: number
  paylines?: string
  category?: Category[]
  reels?: number
  volatility?: 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high'
  maxWin?: string
  minBet?: string
  maxBet?: string
  hasBonusFeature?: boolean
  hasFreeSpins?: boolean
  hasAutoplay?: boolean
  releaseDate?: string
}

// Helper to format release date
function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Helper to format volatility display text
function formatVolatility(volatility: string): string {
  const labels: Record<string, string> = {
    'low': 'Low',
    'low-medium': 'Low-Medium',
    'medium': 'Medium',
    'medium-high': 'Medium-High',
    'high': 'High',
  }
  return labels[volatility] || volatility
}

// Boolean indicator component
function BooleanIndicator({ value }: { value: boolean }) {
  return value ? (
    <Check className="w-5 h-5 text-green-500" />
  ) : (
    <X className="w-5 h-5 text-red-500" />
  )
}

export default function GameDetailsTable({
  name,
  provider,
  rtp,
  paylines,
  category,
  reels,
  volatility,
  maxWin,
  minBet,
  maxBet,
  hasBonusFeature,
  hasFreeSpins,
  hasAutoplay,
  releaseDate
}: GameDetailsTableProps) {
  const details = [
    { label: 'Name', value: name },
    { label: 'Provider', value: provider },
    { label: 'RTP', value: rtp ? `${rtp}%` : undefined },
    { label: 'Paylines', value: paylines },
    { label: 'Category', value: category?.map(c => c.title).join(', ') },
    { label: 'Reels', value: reels?.toString() },
    {
      label: 'Volatility',
      value: volatility,
      render: volatility ? (
        <div className="flex items-center gap-2">
          <span>{formatVolatility(volatility)}</span>
          <img
            src={`/images/volatility/volatility-${volatility}.svg`}
            alt={`${formatVolatility(volatility)} volatility`}
            className="h-3 w-auto"
          />
        </div>
      ) : undefined
    },
    { label: 'Max Win', value: maxWin },
    { label: 'Min Bet', value: minBet },
    { label: 'Max Bet', value: maxBet },
    {
      label: 'Bonus Feature',
      value: true,
      render: <BooleanIndicator value={!!hasBonusFeature} />
    },
    {
      label: 'Free Spins',
      value: true,
      render: <BooleanIndicator value={!!hasFreeSpins} />
    },
    {
      label: 'Autoplay',
      value: true,
      render: <BooleanIndicator value={!!hasAutoplay} />
    },
    {
      label: 'Release Date',
      value: releaseDate,
      render: releaseDate ? formatReleaseDate(releaseDate) : undefined
    },
  ].filter(item => item.value || item.render)

  if (details.length === 0) return null

  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-secondary)]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#111111]">
            <th colSpan={2} className="px-4 py-3 text-sm font-semibold text-white text-left">
              Game Details
            </th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => (
            <tr
              key={detail.label}
              className={index % 2 === 0 ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-tertiary)]'}
            >
              <td className="px-4 py-3 text-sm text-[var(--color-text-muted)] font-medium w-1/3">
                {detail.label}
              </td>
              <td className="px-4 py-3 text-sm text-white">
                {detail.render || detail.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
