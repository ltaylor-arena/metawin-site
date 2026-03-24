import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { allPromotionsQuery, siteSettingsQuery } from '@/lib/queries'
import Breadcrumbs from '@/components/Breadcrumbs'
import FAQ from '@/components/FAQ'

interface Promotion {
  _id: string
  title: string
  slug: string
  promotionType: string
  flair?: string
  flairColor?: 'blue' | 'green' | 'red' | 'yellow'
  excerpt?: string
  startDate?: string
  endDate?: string
  isFeatured: boolean
  thumbnail?: string
}

async function getPromotions(): Promise<Promotion[]> {
  return await client.fetch(allPromotionsQuery)
}

async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MetaWin Promo Code 2026 - Latest Bonus Codes & Offers',
    description: 'Get the latest MetaWin promo codes and bonus offers. Find exclusive promotional codes, welcome bonuses, and special offers for new and existing players.',
    robots: { index: true, follow: true },
    openGraph: {
      title: 'MetaWin Promo Code 2026 - Latest Bonus Codes & Offers',
      description: 'Get the latest MetaWin promo codes and bonus offers. Find exclusive promotional codes, welcome bonuses, and special offers for new and existing players.',
    },
  }
}

// Helper to format promotion type for display
function formatPromotionType(type: string): string {
  const types: Record<string, string> = {
    'competitions': 'Competition',
    'casino': 'Casino Bonus',
    'live-games': 'Live Games',
    'sports': 'Sports',
  }
  return types[type] || type
}

// Helper to get flair color classes
function getFlairColorClasses(color?: string): string {
  switch (color) {
    case 'green':
      return 'bg-emerald-500 text-white'
    case 'red':
      return 'bg-red-500 text-white'
    case 'yellow':
      return 'bg-amber-400 text-black'
    case 'blue':
    default:
      return 'bg-[var(--color-accent-blue)] text-white'
  }
}

// Helper to create a simple portable text block from a string
function createPortableTextBlock(text: string) {
  return [
    {
      _type: 'block' as const,
      _key: Math.random().toString(36).slice(2),
      style: 'normal' as const,
      children: [
        {
          _type: 'span' as const,
          _key: Math.random().toString(36).slice(2),
          text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ]
}

// FAQ items for promo code page
const promoCodeFAQ = [
  {
    _key: 'faq-1',
    question: 'Does MetaWin have a promo code?',
    answer: createPortableTextBlock('MetaWin offers various promotions and bonuses to players. Check the current offers section above for the latest available promotions. New players can take advantage of welcome bonuses, while existing players can participate in ongoing competitions and special events.'),
  },
  {
    _key: 'faq-2',
    question: 'How do I use a MetaWin promo code?',
    answer: createPortableTextBlock('To use a MetaWin promotional offer, simply sign up or log in to your MetaWin account and navigate to the promotions section. Most offers are automatically applied when you meet the eligibility criteria. Some promotions may require opting in through the promotions page.'),
  },
  {
    _key: 'faq-3',
    question: 'What bonuses does MetaWin offer?',
    answer: createPortableTextBlock('MetaWin offers a variety of bonuses including welcome bonuses for new players, cashback offers, free spins promotions, competition entries, and VIP rewards. The specific offers available may vary, so check the current promotions regularly for the latest deals.'),
  },
  {
    _key: 'faq-4',
    question: 'Are MetaWin promo codes legitimate?',
    answer: createPortableTextBlock('Yes, all promotional offers listed on the official MetaWin platform are legitimate. Always ensure you are using the official MetaWin website (metawin.com) to avoid scams. MetaWin is a licensed and regulated crypto casino with transparent terms and conditions for all promotions.'),
  },
]

export default async function PromoCodePage() {
  const [promotions, siteSettings] = await Promise.all([
    getPromotions(),
    getSiteSettings()
  ])

  const signUpUrl = siteSettings?.signUpUrl || 'https://metawin.com/signup'

  const breadcrumbItems = [
    { label: 'Promo Code' },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <header className="px-4 md:px-6 pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          MetaWin Promo Code 2026
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)] max-w-3xl">
          Looking for a MetaWin promo code? Find all the latest promotional offers, bonus codes, and exclusive deals available at MetaWin Casino. Our promotions are updated regularly to bring you the best value.
        </p>
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-8">
        <div className="border-t border-[var(--color-border)] mb-6"></div>

        {/* Current Offers Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Current MetaWin Promotions
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            Below are the active promotional offers available at MetaWin. Click on any promotion to learn more about the terms and how to participate.
          </p>

          {promotions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-tertiary)]">
                    <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)]">
                      Promotion
                    </th>
                    <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)] hidden sm:table-cell">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-white font-semibold border-b border-[var(--color-border)] hidden md:table-cell">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-white font-semibold border-b border-[var(--color-border)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion, index) => (
                    <tr
                      key={promotion._id}
                      className={`
                        border-b border-[var(--color-border)] last:border-b-0
                        ${index % 2 === 1 ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-primary)]'}
                        hover:bg-[var(--color-bg-tertiary)] transition-colors
                      `}
                    >
                      {/* Promotion Name with Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          {promotion.thumbnail && (
                            <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0 hidden sm:block">
                              <Image
                                src={promotion.thumbnail}
                                alt={promotion.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-medium text-white">
                              {promotion.title}
                            </span>
                            {promotion.flair && (
                              <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold rounded ${getFlairColorClasses(promotion.flairColor)}`}>
                                {promotion.flair}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden sm:table-cell">
                        {formatPromotionType(promotion.promotionType)}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                        <span className="line-clamp-2">{promotion.excerpt || '-'}</span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        <a
                          href={signUpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)] text-white text-xs font-semibold rounded transition-colors"
                        >
                          Claim
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--color-bg-secondary)] rounded-lg">
              <p className="text-[var(--color-text-muted)]">No promotions available at the moment. Check back soon!</p>
            </div>
          )}
        </section>

        {/* How to Use Section */}
        <section className="mb-10">
          <div className="bg-[#0F1115] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Use MetaWin Promo Codes
            </h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <ol className="text-[var(--color-text-secondary)] space-y-3">
                <li>
                  <strong className="text-white">Create an Account</strong> - Sign up at MetaWin using the button above or visit metawin.com directly.
                </li>
                <li>
                  <strong className="text-white">Verify Your Account</strong> - Complete any required verification steps to unlock full access to promotions.
                </li>
                <li>
                  <strong className="text-white">Check Available Promotions</strong> - Navigate to the promotions section in your account dashboard.
                </li>
                <li>
                  <strong className="text-white">Opt In</strong> - Some promotions require you to opt in before participating. Click the relevant button to activate the offer.
                </li>
                <li>
                  <strong className="text-white">Meet Requirements</strong> - Follow the specific terms and conditions for each promotion to qualify for rewards.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* About MetaWin Section */}
        <section className="mb-10">
          <div className="bg-[#0F1115] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              About MetaWin Casino
            </h2>
            <div className="prose prose-invert prose-sm max-w-none text-[var(--color-text-secondary)]">
              <p>
                MetaWin is a leading crypto casino and competition platform offering thousands of casino games, sports betting, and exclusive prize competitions. Known for instant crypto withdrawals and a vibrant community, MetaWin provides a premium gaming experience with provably fair games and transparent odds.
              </p>
              <p className="mt-3">
                With a focus on cryptocurrency payments including Bitcoin, Ethereum, and other popular tokens, MetaWin offers fast, secure transactions and generous promotional offers for both new and existing players.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQ
            heading="MetaWin Promo Code FAQ"
            items={promoCodeFAQ}
          />
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] rounded-2xl p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Play?
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Join MetaWin today and take advantage of our latest promotional offers.
            </p>
            <a
              href={signUpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-[var(--color-bg-primary)] font-bold rounded-lg hover:bg-white/90 transition-colors"
            >
              Sign Up Now
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
