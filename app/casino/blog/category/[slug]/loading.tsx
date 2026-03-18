// Blog Category Loading Skeleton

export default function BlogCategoryLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-4 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
      </div>

      {/* Header */}
      <header className="px-4 md:px-6 pt-6 pb-6">
        <div className="h-9 w-48 bg-[var(--color-bg-tertiary)] rounded mb-3" />
        <div className="h-5 w-full max-w-md bg-[var(--color-bg-tertiary)] rounded" />
      </header>

      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6" />

        {/* Category pills */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-[var(--color-bg-tertiary)] rounded-full" />
          ))}
        </div>

        {/* Results info */}
        <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded mb-6" />

        {/* Post cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden">
              <div className="aspect-[16/10] bg-[var(--color-bg-tertiary)]" />
              <div className="p-4">
                <div className="h-3 w-16 bg-[var(--color-bg-tertiary)] rounded mb-2" />
                <div className="h-5 w-full bg-[var(--color-bg-tertiary)] rounded mb-2" />
                <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded mb-3" />
                <div className="h-3 w-32 bg-[var(--color-bg-tertiary)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
