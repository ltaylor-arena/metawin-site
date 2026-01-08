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
    url: string
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
  url?: string
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
  return sanityFetch<SidebarNavigation | null>({
    query: sidebarNavigationQuery,
    params: { title: 'Main Sidebar' },
    tags: ['navigation'],
  })
}

async function getFooterData(): Promise<FooterData | null> {
  return sanityFetch<FooterData | null>({
    query: footerQuery,
    params: { title: 'Main Footer' },
    tags: ['footer'],
  })
}

export default async function CasinoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [navigation, footer] = await Promise.all([
    getSidebarNavigation(),
    getFooterData(),
  ])

  return (
    <CasinoLayoutClient navigation={navigation} footer={footer}>
      {children}
    </CasinoLayoutClient>
  )
}
