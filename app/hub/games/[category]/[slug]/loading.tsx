// Game Page Loading Skeleton
// Shows placeholder UI while game page data loads

export default function GameLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="px-4 md:px-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-4 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-12 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-4 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-32 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
      </div>

      {/* Header skeleton */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <div className="h-10 w-72 bg-[var(--color-bg-tertiary)] rounded mb-3" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[var(--color-bg-tertiary)] rounded-full" />
          <div className="h-4 w-32 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
      </header>

      {/* Main content skeleton */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-4" />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Screenshot/thumbnail skeleton */}
            <div className="aspect-video bg-[var(--color-bg-tertiary)] rounded-xl" />

            {/* Play button skeleton */}
            <div className="h-14 bg-[var(--color-bg-tertiary)] rounded-lg" />

            {/* Quick summary skeleton */}
            <div className="bg-[#0F1115] rounded-xl p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-[var(--color-bg-tertiary)] rounded" />
                <div className="h-6 w-32 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
              <div className="flex gap-4 md:gap-5">
                <div className="w-20 sm:w-24 md:w-28 aspect-[3/4] bg-[var(--color-bg-tertiary)] rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
                  <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
                  <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
              </div>
            </div>

            {/* Content block skeleton */}
            <div className="bg-[#0F1115] rounded-lg p-4 md:p-6 space-y-4">
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-5/6 bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-2/3 bg-[var(--color-bg-tertiary)] rounded" />
            </div>
          </div>

          {/* Right column - sidebar skeleton */}
          <div className="hidden xl:block space-y-4">
            <div className="bg-[#0F1115] rounded-xl p-4 space-y-4">
              <div className="h-5 w-24 bg-[var(--color-bg-tertiary)] rounded" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded" />
                    <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
