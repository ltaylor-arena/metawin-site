// Callout Component
// Attention box with icon, title, and body text

import { PortableText } from '@portabletext/react'
import { AlertCircle, Info, CheckCircle, Lightbulb } from 'lucide-react'

interface CalloutProps {
  title?: string
  content: any[] // Portable Text blocks
  variant?: 'info' | 'warning' | 'success' | 'tip'
}

const variantStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    title: 'text-blue-400',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    title: 'text-yellow-400',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    title: 'text-green-400',
  },
  tip: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    title: 'text-purple-400',
  },
}

const variantIcons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  tip: Lightbulb,
}

export default function Callout({ title, content, variant = 'info' }: CalloutProps) {
  if (!content || content.length === 0) return null

  const styles = variantStyles[variant]
  const Icon = variantIcons[variant]

  return (
    <div className={`rounded-xl border ${styles.bg} ${styles.border} p-4 md:p-5`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <Icon className="w-5 h-5 mt-0.5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold ${styles.title} mb-2`}>
              {title}
            </h4>
          )}
          <div className="prose prose-invert prose-sm max-w-none [&>p]:text-[var(--color-text-secondary)] [&>p]:leading-relaxed [&>p:last-child]:mb-0">
            <PortableText value={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
