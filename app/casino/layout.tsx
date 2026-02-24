import { headers } from 'next/headers'
import { sanityFetch } from '@/lib/sanity'
import { sidebarNavigationQuery, footerQuery, siteSettingsQuery, blogNavigationQuery } from '@/lib/queries'
import CasinoLayoutClient from './CasinoLayoutClient'

// Sidebar types
export interface NavItem {
  _type: 'navItem'
  label: string
  icon: string
  href: string
  highlight?: string
}

export interface NavSection {
  _type: 'navSection'
  sectionTitle: string
  isCollapsible: boolean
  defaultOpen: boolean
  showDivider: boolean
  highlight?: string
  items: {
    label: string
    icon: string
    href: string
    highlight?: string
  }[]
}

export type NavElement = NavItem | NavSection

export interface SidebarNavigation {
  title: string
  items: NavElement[]
}

// Footer types
export interface FooterLink {
  label: string
  externalUrl?: string
  internalHref?: string
  openInNewTab?: boolean
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export interface FooterSocialLink {
  platform: string
  url: string
}

export interface FooterBadge {
  image: string
  alt: string
  url?: string
}

export interface FooterData {
  title: string
  columns: FooterColumn[]
  legalText?: unknown[]
  copyrightText?: string
  socialLinks?: FooterSocialLink[]
  badges?: FooterBadge[]
}

interface BlogCategory {
  _id: string
  title: string
  slug: string
  color?: string
  icon?: string
}

interface BlogNavigation {
  navLogo?: string
  navHomeLabel?: string
  navHomeUrl?: string
  navCategories?: BlogCategory[]
  navCta?: {
    text?: string
    link?: string
    secondaryText?: string
    secondaryLink?: string
  }
}

// Transform blog navigation into sidebar navigation format
function transformBlogToSidebarNav(blogNav: BlogNavigation | null): SidebarNavigation {
  const items: NavElement[] = []

  // Add home link
  items.push({
    _type: 'navItem',
    label: blogNav?.navHomeLabel || 'Home',
    icon: 'house',
    href: blogNav?.navHomeUrl || '/casino/',
  })

  // Add blog home link
  items.push({
    _type: 'navItem',
    label: 'Blog',
    icon: 'sparkles',
    href: '/casino/blog/',
  })

  // Add categories as a section
  if (blogNav?.navCategories && blogNav.navCategories.length > 0) {
    const categoryItems = blogNav.navCategories.map((cat) => ({
      label: cat.title,
      icon: cat.icon || 'star',
      href: `/casino/blog/category/${cat.slug}/`,
    }))

    items.push({
      _type: 'navSection',
      sectionTitle: 'Categories',
      isCollapsible: true,
      defaultOpen: true,
      showDivider: true,
      items: categoryItems,
    })
  }

  return {
    title: 'Blog Sidebar',
    items,
  }
}

async function getSidebarNavigation(isBlogSection: boolean): Promise<SidebarNavigation | null> {
  const start = Date.now()

  if (isBlogSection) {
    console.log('[Layout] Fetching blog navigation...')
    try {
      const blogNav = await sanityFetch<BlogNavigation | null>({
        query: blogNavigationQuery,
        tags: ['blogSettings', 'blogCategory'],
      })
      console.log(`[Layout] Blog navigation fetched in ${Date.now() - start}ms`)
      return transformBlogToSidebarNav(blogNav)
    } catch (error) {
      console.error(`[Layout] Blog navigation FAILED after ${Date.now() - start}ms:`, error)
      return null
    }
  }

  console.log('[Layout] Fetching sidebar navigation...')
  try {
    const result = await sanityFetch<SidebarNavigation | null>({
      query: sidebarNavigationQuery,
      params: { title: 'Main Sidebar' },
      tags: ['navigation'],
    })
    console.log(`[Layout] Sidebar navigation fetched in ${Date.now() - start}ms`)
    return result
  } catch (error) {
    console.error(`[Layout] Sidebar navigation FAILED after ${Date.now() - start}ms:`, error)
    return null
  }
}

async function getFooterData(): Promise<FooterData | null> {
  const start = Date.now()
  console.log('[Layout] Fetching footer data...')
  try {
    const result = await sanityFetch<FooterData | null>({
      query: footerQuery,
      params: { title: 'Main Footer' },
      tags: ['footer'],
    })
    console.log(`[Layout] Footer data fetched in ${Date.now() - start}ms`)
    return result
  } catch (error) {
    console.error(`[Layout] Footer data FAILED after ${Date.now() - start}ms:`, error)
    return null
  }
}

export interface SiteSettings {
  siteName?: string
  logo?: string
  logoAlt?: string
  mainSiteUrl?: string
  signInUrl?: string
  signUpUrl?: string
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  const start = Date.now()
  console.log('[Layout] Fetching site settings...')
  try {
    const result = await sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ['siteSettings'],
    })
    console.log(`[Layout] Site settings fetched in ${Date.now() - start}ms`)
    return result
  } catch (error) {
    console.error(`[Layout] Site settings FAILED after ${Date.now() - start}ms:`, error)
    return null
  }
}

export default async function CasinoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const layoutStart = Date.now()
  console.log('[Layout] CasinoLayout render started')

  // Detect if we're in the blog section by checking the URL
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const referer = headersList.get('referer') || ''
  const isBlogSection = pathname.includes('/blog') || referer.includes('/casino/blog')

  const [navigation, footer, siteSettings] = await Promise.all([
    getSidebarNavigation(isBlogSection),
    getFooterData(),
    getSiteSettings(),
  ])

  console.log(`[Layout] CasinoLayout data fetched in ${Date.now() - layoutStart}ms total`)

  return (
    <CasinoLayoutClient navigation={navigation} footer={footer} siteSettings={siteSettings}>
      {children}
    </CasinoLayoutClient>
  )
}
