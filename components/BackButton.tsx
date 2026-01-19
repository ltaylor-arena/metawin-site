// Back Button Component
// Client component for navigating back in browser history

'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-white mt-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Go back to previous page
    </button>
  )
}
