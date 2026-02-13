// Casino Homepage Loading Skeleton
// Shows placeholder UI while homepage data loads

export default function CasinoLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[280px] md:h-[340px] bg-[var(--color-bg-tertiary)] mx-4 md:mx-6 mt-4 rounded-xl" />

      {/* Game carousel skeleton */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="py-4">
          <div className="flex items-center justify-between mt-2 mb-4 px-4 md:px-6">
            <div className="h-6 w-40 bg-[var(--color-bg-tertiary)] rounded" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-[var(--color-bg-tertiary)] rounded-full" />
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 px-4 md:px-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-32 md:w-36 flex-shrink-0">
                <div className="aspect-[3/4] bg-[var(--color-bg-tertiary)] rounded mb-1.5" />
                <div className="h-3 w-full bg-[var(--color-bg-tertiary)] rounded" />
                <div className="h-2 w-12 bg-[var(--color-bg-tertiary)] rounded mx-auto mt-1" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
