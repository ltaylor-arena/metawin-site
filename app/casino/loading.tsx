// Casino Homepage Loading Skeleton
// Shows placeholder UI while homepage data loads

export default function CasinoLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[280px] md:h-[340px] bg-[var(--color-bg-tertiary)] mx-4 md:mx-6 mt-4 rounded-xl" />

      {/* Intro section with promo cards skeleton */}
      <section className="px-4 md:px-6 py-8">
        <div className="bg-[#0F1115] rounded-lg p-4 md:p-6 flex flex-col lg:flex-row lg:gap-8">
          {/* Promo card skeleton - first on mobile */}
          <div className="lg:w-[35%] flex flex-col gap-3 order-first lg:order-last mb-6 lg:mb-0">
            <div className="aspect-[16/9] bg-[var(--color-bg-tertiary)] rounded-md" />
            <div className="aspect-[16/9] bg-[var(--color-bg-tertiary)] rounded-md hidden lg:block" />
            <div className="aspect-[16/9] bg-[var(--color-bg-tertiary)] rounded-md hidden lg:block" />
          </div>

          {/* Text content skeleton */}
          <div className="lg:w-[65%] order-last lg:order-first">
            <div className="h-8 w-64 bg-[var(--color-bg-tertiary)] rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Game table skeleton */}
      <section className="px-4 md:px-6 py-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-48 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-5 w-24 bg-[var(--color-bg-tertiary)] rounded" />
        </div>

        {/* Table skeleton */}
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
          {Array.from({ length: 8 }).map((_, i) => (
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
              {/* Action buttons */}
              <div className="flex gap-2 ml-auto">
                <div className="h-7 w-14 bg-[var(--color-bg-tertiary)] rounded" />
                <div className="h-7 w-12 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards skeleton */}
      <section className="px-4 md:px-6 py-8">
        <div className="h-7 w-48 bg-[var(--color-bg-tertiary)] rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
              <div className="w-10 h-10 bg-[var(--color-bg-tertiary)] rounded-lg mb-3" />
              <div className="h-5 w-24 bg-[var(--color-bg-tertiary)] rounded mb-2" />
              <div className="h-3 w-full bg-[var(--color-bg-tertiary)] rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
