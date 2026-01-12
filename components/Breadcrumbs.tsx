// Breadcrumbs Component
// SEO-friendly breadcrumb navigation with structured data

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Build structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://metawin.com${item.href}` : undefined,
    })),
  }
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Visible Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center gap-1 text-sm ${className}`}
      >
        <ol className="flex items-center gap-1">
          {/* Home */}
          <li>
            <Link 
              href="/casino/"
              className="flex items-center text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {/* Separator after home */}
          <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
          
          {/* Breadcrumb Items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--color-text-secondary)]">
                  {item.label}
                </span>
              )}
              
              {/* Separator (except for last item) */}
              {index < items.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}