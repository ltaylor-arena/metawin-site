import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import {
  blogSettingsQuery,
  featuredBlogPostsQuery,
  latestBlogPostsQuery,
  allBlogCategoriesQuery,
  blogPostsByCategorySectionQuery,
} from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import PostCard from '@/components/blog/PostCard'

interface BlogSettings {
  heroHeading?: string
  heroSubtext?: string
  heroImage?: string
  heroImageAlt?: string
  heroCta?: {
    text?: string
    link?: string
  }
  introText?: any[]
  featuredPostsHeading?: string
  featuredPosts?: BlogPost[]
  featuredLimit?: number
  latestPostsHeading?: string
  showLatestPosts?: boolean
  latestLimit?: number
  showByCategory?: boolean
  categoryPostsLimit?: number
  seo?: {
    metaTitle?: string
    hideKicker?: boolean
    metaDescription?: string
  }
}

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  publishedAt?: string
  isFeatured?: boolean
  categories?: Category[]
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
  postCount?: number
  posts?: BlogPost[]
}

async function getBlogSettings(): Promise<BlogSettings | null> {
  return await client.fetch(blogSettingsQuery)
}

async function getFeaturedPosts(limit: number): Promise<BlogPost[]> {
  return await client.fetch(featuredBlogPostsQuery, { limit })
}

async function getLatestPosts(limit: number): Promise<BlogPost[]> {
  return await client.fetch(latestBlogPostsQuery, { limit })
}

async function getCategories(): Promise<Category[]> {
  return await client.fetch(allBlogCategoriesQuery)
}

async function getCategorySections(limit: number): Promise<Category[]> {
  return await client.fetch(blogPostsByCategorySectionQuery, { limit })
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBlogSettings()
  const titleText = settings?.seo?.metaTitle || settings?.heroHeading || 'Blog'

  return {
    title: settings?.seo?.hideKicker ? { absolute: titleText } : titleText,
    description: settings?.seo?.metaDescription || settings?.heroSubtext || 'Read the latest articles, guides, and news.',
  }
}

export default async function BlogPage() {
  const settings = await getBlogSettings()

  // Get featured posts - either from manual selection or auto-select
  const featuredLimit = settings?.featuredLimit || 3
  const featuredPosts = settings?.featuredPosts?.length
    ? settings.featuredPosts.slice(0, featuredLimit)
    : await getFeaturedPosts(featuredLimit)

  // Get latest posts
  const latestLimit = settings?.latestLimit || 6
  const latestPosts = settings?.showLatestPosts !== false
    ? await getLatestPosts(latestLimit)
    : []

  // Get categories with posts if enabled
  const categoryPostsLimit = settings?.categoryPostsLimit || 4
  const categorySections = settings?.showByCategory
    ? await getCategorySections(categoryPostsLimit)
    : []

  // Get all categories for filter pills
  const categories = await getCategories()

  const breadcrumbItems = [{ label: 'Blog' }]

  return (
    <div className="min-h-screen">
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
                {settings.heroHeading || 'Blog'}
              </h1>
              {settings.heroSubtext && (
                <p className="text-[var(--color-text-muted)] text-sm md:text-base max-w-2xl">
                  {settings.heroSubtext}
                </p>
              )}
              {settings.heroCta?.text && settings.heroCta?.link && (
                <Link
                  href={settings.heroCta.link}
                  className="inline-block mt-4 px-6 py-2 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white font-medium rounded-lg transition-colors"
                >
                  {settings.heroCta.text}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {settings?.heroHeading || 'Blog'}
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

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/casino/blog/"
              className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-accent-blue)] text-white"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/casino/blog/category/${cat.slug}/`}
                className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                style={cat.color ? { borderColor: cat.color, borderWidth: 1 } : undefined}
              >
                {cat.title}
                {cat.postCount !== undefined && (
                  <span className="ml-1.5 text-xs opacity-60">({cat.postCount})</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              {settings?.featuredPostsHeading || 'Featured Articles'}
            </h2>
            <div className="grid gap-6">
              {/* First featured post - large */}
              <PostCard {...featuredPosts[0]} variant="featured" />

              {/* Rest - grid */}
              {featuredPosts.length > 1 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPosts.slice(1).map((post) => (
                    <PostCard key={post._id} {...post} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              {settings?.latestPostsHeading || 'Latest Articles'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <PostCard key={post._id} {...post} />
              ))}
            </div>
          </section>
        )}

        {/* Posts by Category */}
        {categorySections.length > 0 && categorySections.map((category) => (
          category.posts && category.posts.length > 0 && (
            <section key={category._id} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {category.title}
                </h2>
                <Link
                  href={`/casino/blog/category/${category.slug}/`}
                  className="text-sm font-medium text-[var(--color-accent-blue)] hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.posts.map((post) => (
                  <PostCard key={post._id} {...post} />
                ))}
              </div>
            </section>
          )
        ))}

        {/* Empty State */}
        {featuredPosts.length === 0 && latestPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
