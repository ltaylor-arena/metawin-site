import { Metadata } from 'next'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import {
  guideSettingsQuery,
  latestGuidesQuery,
} from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import GuideCard from '@/components/guides/GuideCard'

interface GuideSettings {
  heroHeading?: string
  heroSubtext?: string
  heroImage?: string
  heroImageAlt?: string
  introText?: any[]
  latestGuidesHeading?: string
  showLatestGuides?: boolean
  latestLimit?: number
  showByCategory?: boolean
  categoryGuidesLimit?: number
  seo?: {
    metaTitle?: string
    hideKicker?: boolean
    metaDescription?: string
  }
}

interface Guide {
  _id: string
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  publishedAt?: string
  updatedAt?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readingTime?: number
  categories?: {
    _id: string
    title: string
    slug: string
    color?: string
  }[]
  author?: {
    name: string
    slug: string
    image?: any
  }
}

async function getGuideSettings(): Promise<GuideSettings | null> {
  return await client.fetch(guideSettingsQuery)
}

async function getLatestGuides(limit: number): Promise<Guide[]> {
  return await client.fetch(latestGuidesQuery, { limit })
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGuideSettings()
  const titleText = settings?.seo?.metaTitle || settings?.heroHeading || 'Guides'

  const description = settings?.seo?.metaDescription || settings?.heroSubtext || 'Player guides, how-tos, and explainers for MetaWin.'

  return {
    title: settings?.seo?.hideKicker ? { absolute: titleText } : titleText,
    description,
    openGraph: {
      title: settings?.seo?.hideKicker ? titleText : undefined,
      description,
    },
  }
}

export default async function GuidesPage() {
  const settings = await getGuideSettings()

  // Get latest guides
  const latestLimit = settings?.latestLimit || 6
  const latestGuides = settings?.showLatestGuides !== false
    ? await getLatestGuides(latestLimit)
    : []

  const breadcrumbItems = [{ label: 'Guides' }]

  return (
    <div className="min-h-screen lg:max-w-[67%]">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <header className="px-4 md:px-6 pt-6 pb-6">
        {settings?.heroImage ? (
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <div className="relative aspect-[3/1] md:aspect-[4/1]">
              <Image
                src={settings.heroImage}
                alt={settings.heroImageAlt || ''}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {settings.heroHeading || 'Player Guides'}
              </h1>
              {settings.heroSubtext && (
                <p className="text-[var(--color-text-muted)] text-sm md:text-base max-w-2xl">
                  {settings.heroSubtext}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {settings?.heroHeading || 'Player Guides'}
            </h1>
            {settings?.heroSubtext && (
              <p className="mt-2 text-[var(--color-text-muted)]">
                {settings.heroSubtext}
              </p>
            )}
          </>
        )}

        {/* Intro Text */}
        {settings?.introText && (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none mt-4">
            <PortableText value={settings.introText} components={portableTextComponents} />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        {/* Recently Added */}
        {latestGuides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              Recently Added
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestGuides.map((guide) => (
                <GuideCard key={guide._id} {...guide} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {latestGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No guides available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
