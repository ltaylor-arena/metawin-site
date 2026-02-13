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

        {/* Games grid skeleton */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4] bg-[var(--color-bg-tertiary)] rounded mb-1.5" />
              <div className="h-3 w-full bg-[var(--color-bg-tertiary)] rounded mx-auto" />
              <div className="h-2 w-12 bg-[var(--color-bg-tertiary)] rounded mx-auto mt-1" />
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 bg-[var(--color-bg-tertiary)] rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
