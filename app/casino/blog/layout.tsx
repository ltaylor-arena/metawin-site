import { sanityFetch } from '@/lib/sanity'
import { blogNavigationQuery, footerQuery, siteSettingsQuery } from '@/lib/queries'
import CasinoLayoutClient from '../CasinoLayoutClient'
import type { SidebarNavigation, NavItem, NavSection, FooterData, SiteSettings } from '../layout'

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

async function getBlogNavigation(): Promise<BlogNavigation | null> {
  try {
    return await sanityFetch<BlogNavigation | null>({
      query: blogNavigationQuery,
      tags: ['blogSettings', 'blogCategory'],
    })
  } catch (error) {
    console.error('[BlogLayout] Failed to fetch blog navigation:', error)
    return null
  }
}

async function getFooterData(): Promise<FooterData | null> {
  try {
    return await sanityFetch<FooterData | null>({
      query: footerQuery,
      params: { title: 'Main Footer' },
      tags: ['footer'],
    })
  } catch (error) {
    console.error('[BlogLayout] Failed to fetch footer:', error)
    return null
  }
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ['siteSettings'],
    })
  } catch (error) {
    console.error('[BlogLayout] Failed to fetch site settings:', error)
    return null
  }
}

// Transform blog navigation into sidebar navigation format
function transformToSidebarNav(blogNav: BlogNavigation | null): SidebarNavigation {
  const items: (NavItem | NavSection)[] = []

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
    highlight: 'new',
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

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [blogNav, footer, siteSettings] = await Promise.all([
    getBlogNavigation(),
    getFooterData(),
    getSiteSettings(),
  ])

  const navigation = transformToSidebarNav(blogNav)

  return (
    <CasinoLayoutClient navigation={navigation} footer={footer} siteSettings={siteSettings}>
      {children}
    </CasinoLayoutClient>
  )
}
