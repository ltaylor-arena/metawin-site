// Guides Index Loading Skeleton

export default function GuidesLoading() {
  return (
    <div className="min-h-screen lg:max-w-[67%] animate-pulse">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded" />
      </div>

      {/* Header */}
      <header className="px-4 md:px-6 pt-6 pb-6">
        <div className="h-9 w-52 bg-[var(--color-bg-tertiary)] rounded mb-3" />
        <div className="h-5 w-full max-w-md bg-[var(--color-bg-tertiary)] rounded" />
      </header>

      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6" />

        {/* Category pills */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-[var(--color-bg-tertiary)] rounded-full" />
          ))}
        </div>

        {/* Section heading */}
        <div className="h-7 w-44 bg-[var(--color-bg-tertiary)] rounded mb-6" />

        {/* Guide cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <div className="h-5 w-16 bg-[var(--color-bg-tertiary)] rounded" />
                  <div className="h-5 w-20 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
                <div className="h-5 w-full bg-[var(--color-bg-tertiary)] rounded mb-2" />
                <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded mb-3" />
                <div className="h-3 w-40 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
