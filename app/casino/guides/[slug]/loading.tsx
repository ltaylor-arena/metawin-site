// Guide Page Loading Skeleton

export default function GuideLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-4 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-4 bg-[var(--color-bg-tertiary)] rounded" />
          <div className="h-4 w-36 bg-[var(--color-bg-tertiary)] rounded" />
        </div>
      </div>

      {/* Header */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <div className="h-9 w-3/4 bg-[var(--color-bg-tertiary)] rounded mb-3" />
        <div className="h-5 w-full max-w-lg bg-[var(--color-bg-tertiary)] rounded mb-4" />
        <div className="h-4 w-56 bg-[var(--color-bg-tertiary)] rounded" />
      </header>

      {/* Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6" />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Article body */}
          <div className="min-w-0 space-y-4">
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-4 w-5/6 bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-7 w-48 bg-[var(--color-bg-tertiary)] rounded mt-8" />
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-4 w-2/3 bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-7 w-56 bg-[var(--color-bg-tertiary)] rounded mt-8" />
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
            <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded" />
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block space-y-6">
            {/* TOC skeleton */}
            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl">
              <div className="h-4 w-32 bg-[var(--color-bg-tertiary)] rounded mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded" />
                ))}
              </div>
            </div>

            {/* Guide info skeleton */}
            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl">
              <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded mb-3" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-[var(--color-bg-tertiary)] rounded" />
                  <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded" />
                  <div className="h-4 w-12 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded" />
                  <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
