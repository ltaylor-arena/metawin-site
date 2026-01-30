'use client'

import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import type { SidebarNavigation, FooterData } from './layout'

function MainContent({ children, footer }: { children: React.ReactNode; footer: FooterData | null }) {
  const { collapsed } = useSidebar()

  return (
    <div className={`flex flex-col min-h-screen ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'} transition-all duration-300`}>
      <TopHeader />
      <div className="flex flex-col flex-1 bg-[#1A1D26]">
        <main className="flex-1 w-full lg:max-w-[75%] lg:mx-auto">
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
}: {
  children: React.ReactNode
  navigation: SidebarNavigation | null
  footer: FooterData | null
}) {
  return (
    <SidebarProvider>
      <div className="casino-site min-h-screen">
        <Sidebar navigation={navigation} />
        <MainContent footer={footer}>{children}</MainContent>
        <BackToTop />
      </div>
    </SidebarProvider>
  )
}
