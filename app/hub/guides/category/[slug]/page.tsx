import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import {
  guideCategoryBySlugQuery,
  guidesByCategoryQuery,
  guidesByCategoryCountQuery,
  allGuideCategorySlugsQuery,
  allGuideCategoriesQuery,
} from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import Pagination from '@/components/Pagination'
import GuideCard from '@/components/guides/GuideCard'

interface GuideCategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

interface GuideCategory {
  _id: string
  title: string
  slug: string
  description?: string
  heroImage?: string
  heroImageAlt?: string
  introText?: any[]
  color?: string
  guidesPerPage?: number
  seo?: {
    metaTitle?: string
    hideKicker?: boolean
    metaDescription?: string
    breadcrumbText?: string
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

interface Category {
  _id: string
  title: string
  slug: string
  color?: string
  guideCount?: number
}

async function getCategory(slug: string): Promise<GuideCategory | null> {
  return await client.fetch(guideCategoryBySlugQuery, { slug })
}

async function getGuides(
  categorySlug: string,
  start: number,
  end: number
): Promise<Guide[]> {
  return await client.fetch(guidesByCategoryQuery, {
    categorySlug,
    start,
    end,
  })
}

async function getGuideCount(categorySlug: string): Promise<number> {
  return await client.fetch(guidesByCategoryCountQuery, { categorySlug })
}

async function getAllCategories(): Promise<Category[]> {
  return await client.fetch(allGuideCategoriesQuery)
}

export async function generateStaticParams() {
  const categories = await client.fetch(allGuideCategorySlugsQuery)
  return categories.map((cat: { slug: string }) => ({
    slug: cat.slug,
  }))
}

export async function generateMetadata({
  params,
}: GuideCategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const title = category.seo?.metaTitle || `${category.title} Guides`
  const description = category.seo?.metaDescription || category.description || `Browse all ${category.title.toLowerCase()} guides and how-tos.`

  return {
    title: category.seo?.hideKicker ? { absolute: title } : title,
    description,
    openGraph: {
      title: category.seo?.hideKicker ? title : undefined,
      description,
    },
  }
}

export default async function GuideCategoryPage({
  params,
  searchParams,
}: GuideCategoryPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams

  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  // Pagination
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1
  const guidesPerPage = category.guidesPerPage || 12
  const start = (currentPage - 1) * guidesPerPage
  const end = start + guidesPerPage

  // Fetch data
  const [guides, totalGuides, allCategories] = await Promise.all([
    getGuides(slug, start, end),
    getGuideCount(slug),
    getAllCategories(),
  ])

  const totalPages = Math.ceil(totalGuides / guidesPerPage)

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Guides', href: '/hub/guides/' },
    { label: category.seo?.breadcrumbText || category.title },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <header className="px-4 md:px-6 pt-6 pb-6">
        {category.heroImage ? (
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <div className="relative aspect-[3/1] md:aspect-[4/1]">
              <Image
                src={category.heroImage}
                alt={category.heroImageAlt || category.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                {category.title}
              </h1>
              {category.description && (
                <p className="mt-2 text-[var(--color-text-muted)] max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {category.title}
            </h1>
            {category.description && (
              <p className="mt-2 text-[var(--color-text-muted)]">
                {category.description}
              </p>
            )}
          </>
        )}

        {/* Intro Text */}
        {category.introText && (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none mt-4">
            <PortableText
              value={category.introText}
              components={portableTextComponents}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        {/* Category Pills */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/hub/guides/"
              className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              All
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat._id}
                href={`/hub/guides/category/${cat.slug}/`}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  cat.slug === slug
                    ? 'bg-[var(--color-accent-blue)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
                }`}
              >
                {cat.title}
                {cat.guideCount !== undefined && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({cat.guideCount})
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Results info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--color-text-muted)]">
            {totalGuides} {totalGuides === 1 ? 'guide' : 'guides'}
            {currentPage > 1 && ` · Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {/* Guides Grid */}
        {guides.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide._id} {...guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">
              No guides found in this category.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/hub/guides/category/${slug}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
