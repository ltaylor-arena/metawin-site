'use client'

import { Suspense } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import ScrollToTop from '@/components/ScrollToTop'
import NavigationProgress from '@/components/NavigationProgress'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import type { SidebarNavigation, FooterData, SiteSettings } from './layout'

function MainContent({ children, footer, signUpUrl }: { children: React.ReactNode; footer: FooterData | null; signUpUrl?: string }) {
  const { collapsed } = useSidebar()

  return (
    <div className={`flex flex-col min-h-screen ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'} transition-all duration-300`}>
      <TopHeader signUpUrl={signUpUrl} />
      <div className="flex flex-col flex-1 bg-[#1A1D26]">
        <main className="flex-1 w-full lg:max-w-[90%] lg:mx-auto">
          {children}
        </main>

        <Footer data={footer} />
      </div>
    </div>
  )
}

export default function CasinoLayoutClient({
  children,
  navigation,
  footer,
  siteSettings,
}: {
  children: React.ReactNode
  navigation: SidebarNavigation | null
  footer: FooterData | null
  siteSettings: SiteSettings | null
}) {
  return (
    <SidebarProvider>
      <ScrollToTop />
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <div className="casino-site min-h-screen">
        <Sidebar navigation={navigation} signUpUrl={siteSettings?.signUpUrl} />
        <MainContent footer={footer} signUpUrl={siteSettings?.signUpUrl}>{children}</MainContent>
        <BackToTop />
      </div>
    </SidebarProvider>
  )
}
