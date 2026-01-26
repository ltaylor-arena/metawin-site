function SkeletonTable() {
  return (
    <div className="flex-1 min-w-0">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded bg-[var(--color-bg-tertiary)] animate-pulse" />
        <div className="h-6 w-24 rounded bg-[var(--color-bg-tertiary)] animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <div className="h-3 w-12 rounded bg-[var(--color-bg-tertiary)] animate-pulse" />
          <div className="flex gap-4">
            <div className="h-3 w-16 rounded bg-[var(--color-bg-tertiary)] animate-pulse hidden sm:block" />
            <div className="h-3 w-10 rounded bg-[var(--color-bg-tertiary)] animate-pulse" />
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] last:border-b-0"
          >
            <div className="flex items-center gap-3">
              {/* Thumbnail skeleton */}
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
                <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[var(--color-bg-tertiary)] animate-pulse" />
              </div>
              {/* Text skeleton */}
              <div className="space-y-1.5">
                <div
                  className="h-4 rounded bg-[var(--color-bg-tertiary)] animate-pulse"
                  style={{ width: `${80 + Math.random() * 60}px` }}
                />
                <div
                  className="h-3 rounded bg-[var(--color-bg-tertiary)] animate-pulse"
                  style={{ width: `${50 + Math.random() * 30}px` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-14 rounded bg-[var(--color-bg-tertiary)] animate-pulse hidden sm:block" />
              <div className="h-6 w-16 rounded-md bg-[var(--color-bg-tertiary)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HotColdSlotsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SkeletonTable />
      <SkeletonTable />
    </div>
  )
}
