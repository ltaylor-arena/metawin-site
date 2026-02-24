import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { blogPostBySlugQuery, allBlogPostSlugsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import Breadcrumbs from '@/components/Breadcrumbs'
import AuthorBio from '@/components/AuthorBio'
import AuthorByline from '@/components/AuthorByline'
import TableOfContents, { TOCItem } from '@/components/TableOfContents'
import PostCard from '@/components/blog/PostCard'
import Callout from '@/components/Callout'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  heroImageAlt?: string
  heroImageCaption?: string
  publishedAt?: string
  updatedAt?: string
  isFeatured?: boolean
  showToc?: boolean
  showAuthorBio?: boolean
  categories?: {
    _id: string
    title: string
    slug: string
    color?: string
  }[]
  content?: any[]
  author?: {
    name: string
    slug: string
    image?: any
    role?: string
    bio?: string
    expertise?: string[]
    socialLinks?: {
      twitter?: string
      linkedin?: string
      website?: string
    }
  }
  factChecker?: {
    name: string
    slug: string
    image?: any
    role?: string
    bio?: string
    expertise?: string[]
    socialLinks?: {
      twitter?: string
      linkedin?: string
      website?: string
    }
  }
  relatedPosts?: any[]
  relatedGames?: any[]
  seo?: {
    metaTitle?: string
    hideKicker?: boolean
    metaDescription?: string
    breadcrumbText?: string
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return await client.fetch(blogPostBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const posts = await client.fetch(allBlogPostSlugsQuery)
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.seo?.metaTitle || post.title
  return {
    title: post.seo?.hideKicker ? { absolute: title } : title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      images: post.heroImage ? [{ url: post.heroImage }] : undefined,
    },
  }
}

// Extract H2 headings from content for TOC
function extractTocItems(content: any[]): TOCItem[] {
  if (!content) return []

  const tocItems: TOCItem[] = []

  content.forEach((block) => {
    if (block._type === 'block' && block.style === 'h2') {
      const text = block.children
        ?.map((child: any) => child.text)
        .join('') || ''

      if (text) {
        // Create URL-friendly ID from heading text
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        tocItems.push({ id, title: text })
      }
    }
  })

  return tocItems
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Extract TOC items from content
  const tocItems = post.showToc !== false ? extractTocItems(post.content || []) : []

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Blog', href: '/casino/blog/' },
    ...(post.categories && post.categories.length > 0
      ? [{ label: post.categories[0].title, href: `/casino/blog/category/${post.categories[0].slug}/` }]
      : []),
    { label: post.seo?.breadcrumbText || post.title },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/casino/blog/category/${cat.slug}/`}
                className="px-2.5 py-1 text-xs font-medium rounded hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: cat.color ? `${cat.color}20` : 'var(--color-bg-tertiary)',
                  color: cat.color || 'var(--color-text-secondary)',
                }}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-3 text-lg text-[var(--color-text-muted)]">
            {post.excerpt}
          </p>
        )}

        {post.author && (
          <div className="mt-4">
            <AuthorByline
              author={post.author}
              factChecker={post.factChecker}
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
            />
          </div>
        )}
      </header>

      {/* Mobile TOC */}
      {tocItems.length > 0 && (
        <TableOfContents items={tocItems} variant="mobile" />
      )}

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          {/* Left Column - Content */}
          <div className="min-w-0">
            {/* Hero Image */}
            {post.heroImage && (
              <figure className="mb-8">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]">
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {post.heroImageCaption && (
                  <figcaption className="mt-2 text-sm text-center text-[var(--color-text-muted)]">
                    {post.heroImageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Article Content */}
            {post.content && (
              <article className="prose prose-invert prose-sm md:prose-base max-w-none">
                {post.content.map((block: any, index: number) => {
                  // Handle callout blocks
                  if (block._type === 'callout') {
                    return (
                      <Callout
                        key={block._key || index}
                        title={block.title}
                        content={block.content}
                        variant={block.variant}
                      />
                    )
                  }

                  // Handle inline images
                  if (block._type === 'image' && block.url) {
                    return (
                      <figure key={block._key || index} className="my-8">
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[var(--color-bg-secondary)]">
                          <Image
                            src={block.url}
                            alt={block.alt || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-sm text-center text-[var(--color-text-muted)]">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }

                  // Handle text blocks with PortableText
                  return (
                    <PortableText
                      key={block._key || index}
                      value={[block]}
                      components={portableTextComponents}
                    />
                  )
                })}
              </article>
            )}

            {/* Related Games */}
            {post.relatedGames && post.relatedGames.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-white mb-6">Related Games</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {post.relatedGames.map((game: any) => (
                    <Link
                      key={game._id}
                      href={`/casino/games/${game.categorySlug}/${game.slug}/`}
                      className="group block bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden hover:ring-2 hover:ring-[var(--color-accent-blue)] transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-[var(--color-bg-tertiary)]">
                        {(game.thumbnail || game.externalThumbnailUrl) && (
                          <Image
                            src={game.externalThumbnailUrl || game.thumbnail}
                            alt={game.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white group-hover:text-[var(--color-accent-blue)] transition-colors line-clamp-1">
                          {game.title}
                        </h3>
                        {game.provider && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {game.provider}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {post.relatedPosts.map((relatedPost: any) => (
                    <PostCard key={relatedPost._id} {...relatedPost} />
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio */}
            {post.showAuthorBio !== false && post.author && (
              <div className="mt-12 pt-8 border-t border-[var(--color-border)] space-y-4">
                <AuthorBio author={post.author} />
                {post.factChecker && (
                  <AuthorBio
                    author={post.factChecker}
                    title="Fact Checked By"
                    id="fact-checker-info"
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            {/* Desktop TOC */}
            {tocItems.length > 0 && (
              <TableOfContents items={tocItems} variant="desktop" />
            )}

            {/* Share buttons placeholder */}
            <div className="hidden xl:block p-4 bg-[var(--color-bg-secondary)] rounded-xl">
              <h3 className="text-sm font-semibold text-white mb-3">Share</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
                  <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
                  <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
                  </svg>
                </button>
                <button className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
                  <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
