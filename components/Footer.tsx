// Footer Component
// Site footer with links, legal text, and social icons

import Link from 'next/link'
import Image from 'next/image'
import { Twitter, MessageCircle, Send, Instagram, Youtube } from 'lucide-react'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import type { FooterData, FooterColumn } from '@/app/casino/layout'

// Social icon mapping
const socialIcons: Record<string, React.ElementType> = {
  twitter: Twitter,
  discord: MessageCircle,
  telegram: Send,
  instagram: Instagram,
  youtube: Youtube,
}

interface FooterProps {
  data: FooterData | null
}

// Default footer data (fallback when Sanity data unavailable)
const defaultColumns: FooterColumn[] = [
  {
    heading: 'Casino',
    links: [
      { label: 'All Games', url: '/casino/all-games' },
      { label: 'Slots', url: '/casino/slots' },
      { label: 'Live Casino', url: '/casino/live-casino' },
      { label: 'Game Shows', url: '/casino/game-shows' },
      { label: 'Providers', url: '/casino/providers' },
    ],
  },
  {
    heading: 'Promotions',
    links: [
      { label: 'Prizes', url: '/casino/prizes' },
      { label: 'Races', url: '/casino/races' },
      { label: 'VIP Program', url: '/casino/vip' },
      { label: 'Referrals', url: '/casino/referrals' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', url: 'https://help.metawin.com', openInNewTab: true },
      { label: 'Responsible Gaming', url: '/casino/responsible-gaming' },
      { label: 'Terms of Service', url: '/casino/terms' },
      { label: 'Privacy Policy', url: '/casino/privacy' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', url: '/casino/about' },
      { label: 'Blog', url: '/casino/blog' },
      { label: 'Careers', url: '/casino/careers' },
      { label: 'Contact', url: '/casino/contact' },
    ],
  },
]

const defaultSocialLinks = [
  { platform: 'twitter', url: 'https://twitter.com/meta_winners' },
  { platform: 'discord', url: 'https://discord.gg/metawin' },
  { platform: 'telegram', url: 'https://t.me/metawin' },
]

export default function Footer({ data }: FooterProps) {
  const columns = data?.columns ?? defaultColumns
  const socialLinks = data?.socialLinks ?? defaultSocialLinks
  const copyrightText = data?.copyrightText ?? '© {year} MetaWin. All rights reserved.'
  const badges = data?.badges
  const legalText = data?.legalText
  const currentYear = new Date().getFullYear()
  const formattedCopyright = copyrightText.replace('{year}', currentYear.toString())
  
  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {column.heading}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => {
                  const href = link.internalHref || link.url || '#'
                  const isExternal = link.openInNewTab || (link.url?.startsWith('http') && !link.internalHref)
                  return (
                    <li key={linkIndex}>
                      <Link
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div className="border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <Image
                src="/images/metawin-logo-white.svg"
                alt="MetaWin"
                width={120}
                height={24}
                className="h-6 w-auto"
              />
              <p className="text-sm text-[var(--color-text-muted)]">
                {formattedCopyright}
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = socialIcons[social.platform] || MessageCircle
                return (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Crypto Coin Logos */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 xl:gap-10 mt-8 pt-8 border-t border-[var(--color-border)]">
          <Image
            src="/images/bitcoin-logo.svg"
            alt="Bitcoin"
            width={120}
            height={30}
            className="h-auto w-auto"
          />
          <Image
            src="/images/usdcoin-logo.svg"
            alt="USD Coin"
            width={120}
            height={30}
            className="h-auto w-auto"
          />
          <Image
            src="/images/ethereum-logo.svg"
            alt="Ethereum"
            width={120}
            height={30}
            className="h-auto w-auto"
          />
          <Image
            src="/images/solana-logo.svg"
            alt="Solana"
            width={120}
            height={30}
            className="h-auto w-auto"
          />
          <Image
            src="/images/litecoin-logo.svg"
            alt="Litecoin"
            width={120}
            height={30}
            className="h-auto w-auto"
          />
        </div>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-8 border-t border-[var(--color-border)]">
            {badges.map((badge, index) => {
              const badgeImage = (
                <Image
                  src={badge.image}
                  alt={badge.alt}
                  width={80}
                  height={40}
                  className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              )
              return badge.url ? (
                <Link key={index} href={badge.url} target="_blank" rel="noopener noreferrer">
                  {badgeImage}
                </Link>
              ) : (
                <span key={index}>{badgeImage}</span>
              )
            })}
          </div>
        )}

        {/* Legal Text from Sanity */}
        {legalText && Array.isArray(legalText) && legalText.length > 0 && (
          <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
            <div className="text-xs text-[var(--color-text-muted)] leading-relaxed prose prose-invert prose-xs max-w-none">
              <PortableText value={legalText as PortableTextBlock[]} />
            </div>
          </div>
        )}

        {/* Default Legal Disclaimer (shown when no Sanity legal text) */}
        {(!legalText || !Array.isArray(legalText) || legalText.length === 0) && (
          <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              MetaWin is operated by Asobi N.V., a company registered in Curaçao.
              Gambling can be addictive. Please play responsibly. You must be 18+ to use this site.
              MetaWin supports responsible gambling. If you feel you may have a gambling problem,
              please visit <Link href="https://www.gambleaware.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">GambleAware.org</Link> for
              more information and support.
            </p>
          </div>
        )}
      </div>
    </footer>
  )
}
