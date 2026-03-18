// Games Index Page Loading Skeleton
// Shows placeholder UI while games page data loads

export default function GamesIndexLoading() {
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
        <div className="h-9 w-48 bg-[var(--color-bg-tertiary)] rounded mb-4" />
        <div className="h-5 w-full max-w-xl bg-[var(--color-bg-tertiary)] rounded" />
      </header>

      {/* Category Cards Grid skeleton */}
      <div className="px-4 md:px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4 md:p-6"
            >
              {/* Icon skeleton */}
              <div className="w-12 h-12 md:w-14 md:h-14 mb-3 rounded-lg bg-[var(--color-bg-tertiary)]" />

              {/* Title skeleton */}
              <div className="h-5 w-24 bg-[var(--color-bg-tertiary)] rounded mb-2" />

              {/* Count skeleton */}
              <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
