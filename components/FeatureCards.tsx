// Feature Cards Component
// "Reasons to Play" style feature highlights

import { Check, Zap, Trophy, Gift, Users, Shield, Star, Clock, Wallet, Lock } from 'lucide-react'

interface Feature {
  icon?: string
  title: string
  description: string
}

interface FeatureCardsProps {
  heading?: string
  features?: Feature[]
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  check: Check,
  zap: Zap,
  trophy: Trophy,
  gift: Gift,
  users: Users,
  shield: Shield,
  star: Star,
  clock: Clock,
  wallet: Wallet,
  lock: Lock,
}

// Default features matching MetaWin's "Reasons to Play"
const defaultFeatures: Feature[] = [
  {
    icon: 'check',
    title: 'Max Payout Guarantee',
    description: 'All games on MetaWin are set to Max Odds for the player. You get the best possible payout on every win.',
  },
  {
    icon: 'zap',
    title: 'Fastest Transactions',
    description: 'Deposits and withdrawals are lightning fast & decentralized when connecting with a Web3 wallet.',
  },
  {
    icon: 'trophy',
    title: 'Massive Blockchain Prizes',
    description: "We are the world's largest prize competition website with Millions in crypto prizes won to date.",
  },
  {
    icon: 'gift',
    title: 'Huge Rewards',
    description: "From cashback and bonuses to surprise drops and VIP perks, MetaWin's reward system is second to none.",
  },
  {
    icon: 'users',
    title: 'Largest Community',
    description: 'MetaWin has the largest and most engaged community in Crypto - period.',
  },
]

export default function FeatureCards({
  heading = 'Reasons to Play at MetaWin',
  features,
  className = ''
}: FeatureCardsProps) {
  const displayFeatures = features && features.length > 0 ? features : defaultFeatures

  return (
    <section className={`py-6 ${className}`}>
      <h2 className="text-lg font-semibold text-white mb-4">
        {heading}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {displayFeatures.map((feature, index) => {
          const Icon = feature.icon ? iconMap[feature.icon] : Check
          
          return (
            <div 
              key={index}
              className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-[var(--color-accent-blue)]" />
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}