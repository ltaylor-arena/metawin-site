import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getHotColdSlots, HotColdGame } from '@/lib/metawin-api'
import HotColdSlotsSkeleton from './HotColdSlotsSkeleton'

interface SlotTableProps {
  title: string
  games: HotColdGame[]
  type: 'hot' | 'cold'
  signUpUrl?: string
}

function SlotTable({ title, games, type, signUpUrl }: SlotTableProps) {
  const isHot = type === 'hot'
  const icon = isHot ? (
    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
    </svg>
  )

  if (games.length === 0) {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 text-center">
          <p className="text-[var(--color-text-muted)]">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">
                Game
              </th>
              <th className="text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                Base RTP
              </th>
              <th className="text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">
                {isHot ? 'Hot' : 'Cold'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {games.map((game, index) => (
              <tr
                key={game.id}
                className="hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={signUpUrl || `https://metawin.com/casino/slots/${game.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)]">
                        <Image
                          src={game.thumbnail}
                          alt={game.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="absolute -top-1 -left-1 w-5 h-5 bg-[var(--color-bg-primary)] rounded-full flex items-center justify-center text-xs font-bold text-white border border-[var(--color-border)]">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-[var(--color-accent-blue)] transition-colors">
                        {game.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {game.provider}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {game.baseRtp.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-semibold ${
                      isHot
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {isHot ? '+' : ''}
                    {Math.round(game.rtpDifference)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function HotColdSlotsContent({
  hotTitle = 'Hot Slots',
  coldTitle = 'Cold Slots',
  limit = 10,
  signUpUrl,
}: {
  hotTitle?: string
  coldTitle?: string
  limit?: number
  signUpUrl?: string
}) {
  const { hot, cold } = await getHotColdSlots(limit)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SlotTable title={hotTitle} games={hot} type="hot" signUpUrl={signUpUrl} />
      <SlotTable title={coldTitle} games={cold} type="cold" signUpUrl={signUpUrl} />
    </div>
  )
}

export interface HotColdSlotsProps {
  heading?: string
  hotTitle?: string
  coldTitle?: string
  limit?: number
  signUpUrl?: string
}

export default function HotColdSlots({
  heading = 'Live RTP Tracker',
  hotTitle = 'Hot Games',
  coldTitle = 'Cold Games',
  limit = 10,
  signUpUrl,
}: HotColdSlotsProps) {
  return (
    <div>
      {heading && (
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{heading}</h2>
      )}
      <Suspense fallback={<HotColdSlotsSkeleton />}>
        <HotColdSlotsContent
          hotTitle={hotTitle}
          coldTitle={coldTitle}
          limit={limit}
          signUpUrl={signUpUrl}
        />
      </Suspense>
    </div>
  )
}
