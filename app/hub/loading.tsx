// Casino Homepage Loading Skeleton
// Matches: promo carousel, intro text with category grid, game table, feature cards

export default function CasinoLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Intro section: promo card carousel + heading + text */}
      <section className="px-4 md:px-6 py-8">
        <div className="bg-[#0F1115] rounded-lg p-4 md:p-6 flex flex-col lg:flex-row lg:gap-8">
          {/* Promo card carousel skeleton */}
          <div className="lg:w-[35%] order-first lg:order-last mb-6 lg:mb-0 flex flex-col gap-3">
            <div className="aspect-[16/9] bg-[var(--color-bg-tertiary)] rounded-md" />
            <div className="aspect-[16/9] bg-[var(--color-bg-tertiary)] rounded-md hidden lg:block" />
            <div className="aspect-[16/9] bg-[var(--color-bg-tertiary)] rounded-md hidden lg:block" />
          </div>

          {/* Text content skeleton */}
          <div className="lg:w-[65%] order-last lg:order-first">
            <div className="h-8 w-3/4 bg-[var(--color-bg-tertiary)] rounded mb-4" />
            <div className="h-6 w-48 bg-[var(--color-bg-tertiary)] rounded mb-3" />
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded" />
            </div>

            {/* Category grid skeleton */}
            <div className="h-6 w-40 bg-[var(--color-bg-tertiary)] rounded mb-3" />
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-3">
                  <div className="w-10 h-10 bg-[var(--color-bg-tertiary)] rounded-lg mb-2" />
                  <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded mb-1" />
                  <div className="h-3 w-12 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
              ))}
            </div>
            <div className="flex sm:hidden gap-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[120px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-3">
                  <div className="w-9 h-9 bg-[var(--color-bg-tertiary)] rounded-lg mb-1.5" />
                  <div className="h-3 w-14 bg-[var(--color-bg-tertiary)] rounded mb-1" />
                  <div className="h-2.5 w-10 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
              ))}
            </div>

            {/* More text lines */}
            <div className="space-y-2 mt-6">
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
              <div className="h-4 w-2/3 bg-[var(--color-bg-tertiary)] rounded" />
            </div>
          </div>
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

      {/* Game table skeleton */}
      <section className="px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-36 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-5 w-20 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
          <div className="bg-[var(--color-bg-tertiary)] px-4 py-3 flex items-center gap-4">
            <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded hidden sm:block" />
            <div className="h-4 w-12 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-16 bg-[var(--color-bg-secondary)] rounded ml-auto" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`px-4 py-3 flex items-center gap-4 border-t border-[var(--color-border)] ${
                i % 2 === 1 ? 'bg-[var(--color-bg-secondary)]' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[var(--color-bg-tertiary)] rounded flex-shrink-0" />
                <div className="h-4 w-32 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
              <div className="h-4 w-12 bg-[var(--color-bg-tertiary)] rounded" />
              <div className="flex gap-2 ml-auto">
                <div className="h-7 w-14 bg-[var(--color-bg-tertiary)] rounded" />
                <div className="h-7 w-12 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
