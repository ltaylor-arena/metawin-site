// Structured Data Component
// Renders JSON-LD schema.org markup for SEO

import { urlFor } from '@/lib/sanity'

interface OrganizationSchemaData {
  enabled?: boolean
  name?: string
  legalName?: string
  url?: string
  logo?: any
  description?: string
  foundingDate?: string
  sameAs?: Array<{ platform: string; url: string }>
  contactPoint?: {
    contactType?: string
    email?: string
    url?: string
    availableLanguage?: string[]
  }
}

interface GameSchemaData {
  enabled?: boolean
  schemaType?: 'VideoGame' | 'SoftwareApplication'
  nameOverride?: string
  descriptionOverride?: string
  genre?: string[]
  gamePlatform?: string[]
  applicationCategory?: string
  operatingSystem?: string
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
  }
  aggregateRating?: {
    enabled?: boolean
    ratingValue?: number
    bestRating?: number
    ratingCount?: number
  }
  author?: {
    nameOverride?: string
    url?: string
  }
}

interface GameData {
  title: string
  slug: string
  provider?: string
  thumbnail?: any
  rtp?: number
  volatility?: string
  description?: any
  externalGameUrl?: string
  categories?: Array<{ title: string; slug: string }>
}

// Organization Schema JSON-LD
export function OrganizationStructuredData({ data }: { data?: OrganizationSchemaData }) {
  if (!data?.enabled || !data.name || !data.url) {
    return null
  }

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
  }

  if (data.legalName) {
    jsonLd.legalName = data.legalName
  }

  if (data.logo) {
    jsonLd.logo = urlFor(data.logo).width(600).height(600).url()
  }

  if (data.description) {
    jsonLd.description = data.description
  }

  if (data.foundingDate) {
    jsonLd.foundingDate = data.foundingDate
  }

  if (data.sameAs && data.sameAs.length > 0) {
    jsonLd.sameAs = data.sameAs.map((profile) => profile.url)
  }

  if (data.contactPoint?.contactType) {
    jsonLd.contactPoint = {
      '@type': 'ContactPoint',
      contactType: data.contactPoint.contactType,
    }
    if (data.contactPoint.email) {
      jsonLd.contactPoint.email = data.contactPoint.email
    }
    if (data.contactPoint.url) {
      jsonLd.contactPoint.url = data.contactPoint.url
    }
    if (data.contactPoint.availableLanguage?.length) {
      jsonLd.contactPoint.availableLanguage = data.contactPoint.availableLanguage
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Game Schema JSON-LD
export function GameStructuredData({
  schemaData,
  gameData,
  pageUrl,
}: {
  schemaData?: GameSchemaData
  gameData: GameData
  pageUrl: string
}) {
  // Default to enabled if schemaData doesn't exist (auto-generate)
  const enabled = schemaData?.enabled !== false

  if (!enabled) {
    return null
  }

  const schemaType = schemaData?.schemaType || 'VideoGame'

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: schemaData?.nameOverride || gameData.title,
    url: pageUrl,
  }

  // Description
  if (schemaData?.descriptionOverride) {
    jsonLd.description = schemaData.descriptionOverride
  } else if (gameData.description) {
    // Extract plain text from portable text (simplified)
    const plainText = gameData.description
      ?.filter((block: any) => block._type === 'block')
      ?.map((block: any) => block.children?.map((child: any) => child.text).join(''))
      ?.join(' ')
      ?.substring(0, 300)
    if (plainText) {
      jsonLd.description = plainText
    }
  }

  // Image
  if (gameData.thumbnail) {
    jsonLd.image = urlFor(gameData.thumbnail).width(800).height(600).url()
  }

  // Genre
  if (schemaData?.genre?.length) {
    jsonLd.genre = schemaData.genre
  } else if (gameData.categories?.length) {
    jsonLd.genre = gameData.categories.map((cat) => cat.title)
  }

  // Platform
  if (schemaData?.gamePlatform?.length) {
    jsonLd.gamePlatform = schemaData.gamePlatform
  } else {
    jsonLd.gamePlatform = ['Web Browser']
  }

  // Application category (for SoftwareApplication)
  if (schemaType === 'SoftwareApplication') {
    jsonLd.applicationCategory = schemaData?.applicationCategory || 'GameApplication'
  }

  // Operating system
  if (schemaData?.operatingSystem) {
    jsonLd.operatingSystem = schemaData.operatingSystem
  }

  // Author/Provider
  const providerName = schemaData?.author?.nameOverride || gameData.provider
  if (providerName) {
    jsonLd.author = {
      '@type': 'Organization',
      name: providerName,
    }
    if (schemaData?.author?.url) {
      jsonLd.author.url = schemaData.author.url
    }
  }

  // Offers
  if (schemaData?.offers || true) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: schemaData?.offers?.price || '0',
      priceCurrency: schemaData?.offers?.priceCurrency || 'USD',
      availability: schemaData?.offers?.availability || 'https://schema.org/OnlineOnly',
    }
    if (gameData.externalGameUrl) {
      jsonLd.offers.url = gameData.externalGameUrl
    }
  }

  // Aggregate Rating
  if (schemaData?.aggregateRating?.enabled && schemaData.aggregateRating.ratingValue) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: schemaData.aggregateRating.ratingValue,
      bestRating: schemaData.aggregateRating.bestRating || 5,
    }
    if (schemaData.aggregateRating.ratingCount) {
      jsonLd.aggregateRating.ratingCount = schemaData.aggregateRating.ratingCount
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
