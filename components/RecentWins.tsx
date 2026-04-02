// Recent Big Wins Component
// Displays latest wins for a game, pulled from Sanity recentWins data

'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'

interface Win {
  _key: string
  username: string
  winUsd: number
  currencyCode: string
  winnings: number
  timestamp: string
}

interface RecentWinsProps {
  wins: Win[]
  gameTitle: string
  thumbnail?: string
}

function obfuscateUsername(name: string): string {
  if (name.length <= 2) return name[0] + '*'
  const start = name.slice(0, 1)
  const end = name.slice(-1)
  const middle = '*'.repeat(name.length - 2)
  return `${start}${middle}${end}`
}

function formatUsd(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`
  }
  return `$${amount.toFixed(0)}`
}

const ROW_HEIGHT = 44 // px per row
const VISIBLE_ROWS = 5
const SCROLL_SPEED = 0.5 // px per frame

export default function RecentWins({ wins, gameTitle, thumbnail }: RecentWinsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || wins.length <= VISIBLE_ROWS) return

    let animationId: number
    let scrollPos = 0
    const totalHeight = el.scrollHeight / 2 // We duplicate the list

    const animate = () => {
      scrollPos += SCROLL_SPEED
      if (scrollPos >= totalHeight) scrollPos = 0
      el.scrollTop = scrollPos
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleEnter = () => cancelAnimationFrame(animationId)
    const handleLeave = () => { animationId = requestAnimationFrame(animate) }

    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      cancelAnimationFrame(animationId)
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [wins])

  if (!wins || wins.length === 0) return null

  const biggestWin = wins.reduce((max, w) => w.winUsd > max.winUsd ? w : max, wins[0])

  // Duplicate wins for seamless infinite scroll
  const displayWins = wins.length > VISIBLE_ROWS ? [...wins, ...wins] : wins

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Recent Big Wins</h3>
      </div>

      {/* Biggest Win Highlight */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <div className="text-xs text-[var(--color-text-muted)] mb-1">Biggest Recent Win</div>
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-yellow-400">{formatUsd(biggestWin.winUsd)}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{obfuscateUsername(biggestWin.username)}</span>
        </div>
      </div>

      {/* Wins List - scrollable */}
      <div
        ref={scrollRef}
        className="overflow-hidden"
        style={{ maxHeight: ROW_HEIGHT * VISIBLE_ROWS }}
      >
        {displayWins.map((win, i) => (
          <div key={`${win._key}-${i}`} className="px-4 flex items-center justify-between" style={{ height: ROW_HEIGHT }}>
            <div className="flex items-center gap-2.5 min-w-0">
              {thumbnail && (
                <div className="relative w-7 h-7 rounded overflow-hidden bg-[var(--color-bg-tertiary)] flex-shrink-0">
                  <Image
                    src={thumbnail}
                    alt={gameTitle}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm text-white truncate">{obfuscateUsername(win.username)}</span>
            </div>
            <span className="text-sm font-semibold text-green-400 flex-shrink-0">{formatUsd(win.winUsd)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
