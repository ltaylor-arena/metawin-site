// PromoCard Component
// Promotional card with background image, title and link

'use client'

import Link from 'next/link'
import Image from 'next/image'

interface PromoCardProps {
  title: string
  subtitle?: string
  colorTheme?: 'blue' | 'orange' | 'purple' | 'green' | 'pink'
  backgroundImage: string
  link: string
}

// Color theme gradients - from left side fading to transparent
const colorGradients: Record<string, string> = {
  blue: 'from-blue-600/90 via-blue-600/50 to-transparent',
  orange: 'from-orange-500/90 via-orange-500/50 to-transparent',
  purple: 'from-purple-600/90 via-purple-600/50 to-transparent',
  green: 'from-emerald-600/90 via-emerald-600/50 to-transparent',
  pink: 'from-pink-500/90 via-pink-500/50 to-transparent',
}

// Glow colors for hover effect
const glowColors: Record<string, string> = {
  blue: 'group-hover:shadow-blue-500/30',
  orange: 'group-hover:shadow-orange-500/30',
  purple: 'group-hover:shadow-purple-500/30',
  green: 'group-hover:shadow-emerald-500/30',
  pink: 'group-hover:shadow-pink-500/30',
}

export default function PromoCard({
  title,
  subtitle,
  colorTheme = 'blue',
  backgroundImage,
  link
}: PromoCardProps) {
  const gradient = colorGradients[colorTheme] || colorGradients.blue
  const glow = glowColors[colorTheme] || glowColors.blue

  return (
    <Link
      href={link}
      className={`relative block w-full aspect-[2/1] rounded-xl overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-2xl ${glow}`}
    >
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Color Gradient Overlay - from left */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} transition-opacity duration-300`} />

      {/* Hover brightening overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

      {/* Content - Left aligned */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
        <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg tracking-wide">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm md:text-base text-white mt-2 max-w-[70%] leading-relaxed drop-shadow-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/20 transition-colors duration-300" />
    </Link>
  )
}
