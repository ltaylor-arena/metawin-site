// Pros and Cons Component
// Displays pros and cons in a two-column layout with styled boxes

import { Check, X } from 'lucide-react'

interface ProsAndConsProps {
  title: string
  pros?: string[]
  cons?: string[]
}

export default function ProsAndCons({
  title,
  pros,
  cons
}: ProsAndConsProps) {
  const hasPros = pros && pros.length > 0
  const hasCons = cons && cons.length > 0

  if (!hasPros && !hasCons) {
    return null
  }

  return (
    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <div className="bg-[#111111] px-4 py-3">
        <h2 className="text-sm font-semibold text-white">
          {title} Pros and Cons
        </h2>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Pros Column */}
        <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-green-500">Pros</h3>
          </div>
          {hasPros ? (
            <ul className="space-y-2">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {pro}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] italic">No pros listed</p>
          )}
        </div>

        {/* Cons Column */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-red-500">Cons</h3>
          </div>
          {hasCons ? (
            <ul className="space-y-2">
              {cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {con}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] italic">No cons listed</p>
          )}
        </div>
      </div>
    </div>
  )
}
