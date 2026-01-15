import { sanityFetch } from '@/lib/sanity'
import { sidebarNavigationQuery, footerQuery } from '@/lib/queries'
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

async function getSidebarNavigation(): Promise<SidebarNavigation | null> {
  const start = Date.now()
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

export default async function CasinoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const layoutStart = Date.now()
  console.log('[Layout] CasinoLayout render started')

  const [navigation, footer] = await Promise.all([
    getSidebarNavigation(),
    getFooterData(),
  ])

  console.log(`[Layout] CasinoLayout data fetched in ${Date.now() - layoutStart}ms total`)

  return (
    <CasinoLayoutClient navigation={navigation} footer={footer}>
      {children}
    </CasinoLayoutClient>
  )
}
