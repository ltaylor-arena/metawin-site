import '../styles/globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s | MetaWin Casino',
    default: 'MetaWin Casino',
  },
  description: "The World's Best Crypto Casino & Prize Winning Platform",
  openGraph: {
    siteName: 'MetaWin Casino',
    type: 'website',
    description: "The World's Best Crypto Casino & Prize Winning Platform",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="min-h-screen bg-[var(--color-bg-primary)] font-sans">
        {children}
      </body>
    </html>
  )
}