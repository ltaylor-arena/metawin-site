// Category Page Loading Skeleton
// Shows placeholder UI while category page data loads

export default function CategoryLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="px-4 md:px-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-4 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
      </div>

      {/* Header skeleton */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <div className="h-9 w-64 bg-[var(--color-bg-tertiary)] rounded mb-4" />
        <div className="h-5 w-full max-w-2xl bg-[var(--color-bg-tertiary)] rounded" />
      </header>

      {/* Sort controls skeleton */}
      <div className="px-4 md:px-6 pb-8">
        <div className="flex items-center justify-between border-t border-[var(--color-border)] py-4 mb-4">
          <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-8 w-32 bg-[var(--color-bg-tertiary)] rounded" />
        </div>

        {/* Games table skeleton */}
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
          {/* Table header */}
          <div className="bg-[var(--color-bg-tertiary)] px-4 py-3 flex items-center gap-4">
            <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded hidden sm:block" />
            <div className="h-4 w-12 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded hidden md:block" />
            <div className="h-4 w-16 bg-[var(--color-bg-secondary)] rounded ml-auto" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`px-4 py-3 flex items-center gap-4 border-t border-[var(--color-border)] ${
                i % 2 === 1 ? 'bg-[var(--color-bg-secondary)]' : ''
              }`}
            >
              {/* Game name with thumbnail */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[var(--color-bg-tertiary)] rounded flex-shrink-0" />
                <div className="h-4 w-32 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
              {/* Provider */}
              <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded hidden sm:block" />
              {/* RTP */}
              <div className="h-4 w-12 bg-[var(--color-bg-tertiary)] rounded" />
              {/* Volatility */}
              <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded hidden md:block" />
              {/* Action button */}
              <div className="h-7 w-14 bg-[var(--color-bg-tertiary)] rounded ml-auto" />
            </div>
          ))}
        </div>

        {/* Games count skeleton */}
        <div className="flex justify-center mt-6">
          <div className="h-4 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 bg-[var(--color-bg-tertiary)] rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
