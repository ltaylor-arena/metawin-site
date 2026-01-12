// Author Bio Component
// Displays author information with profile image and bio in sidebar

import Image from 'next/image'
import { Twitter, Linkedin, Globe } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
}

interface SocialLinks {
  twitter?: string
  linkedin?: string
  website?: string
}

interface Author {
  name: string
  slug: string
  image?: SanityImage
  role?: string
  bio?: string
  expertise?: string[]
  socialLinks?: SocialLinks
}

interface AuthorBioProps {
  author: Author
}

export default function AuthorBio({ author }: AuthorBioProps) {
  if (!author) return null

  // Generate optimized thumbnail URL (128px for 2x retina on 64px display)
  const thumbnailUrl = author.image?.asset
    ? urlFor(author.image).width(128).height(128).quality(80).auto('format').url()
    : null

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-[#111111] border-b border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-white">About the Author</h3>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Author Image */}
          {thumbnailUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)]">
                <Image
                  src={thumbnailUrl}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-white">{author.name}</h4>
            {author.role && (
              <p className="text-sm text-[var(--color-accent-blue)]">{author.role}</p>
            )}

            {/* Social Links */}
            {author.socialLinks && (
              <div className="flex gap-2 mt-2">
                {author.socialLinks.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks.linkedin && (
                  <a
                    href={author.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks.website && (
                  <a
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {author.bio && (
          <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {author.bio}
          </p>
        )}

        {/* Expertise Tags */}
        {author.expertise && author.expertise.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {author.expertise.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
