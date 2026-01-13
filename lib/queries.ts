// Sanity GROQ Queries
import { groq } from 'next-sanity'

// Get homepage
export const homepageQuery = groq`
  *[_type == "page" && isHomepage == true][0] {
    _id,
    title,
    "slug": slug.current,
    showAuthorInfo,
    publishedAt,
    updatedAt,
    author-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },
    seo {
      metaTitle,
      metaDescription,
      breadcrumbText,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    },
    organizationSchema,
    content[] {
      _type,
      _key,
      
      // Hero
      _type == "hero" => {
        autoplay,
        autoplaySpeed,
        slides[] {
          heading,
          subheading,
          "image": image.asset->url,
          ctaText,
          ctaLink
        }
      },
      
      // Intro section
      _type == "introSection" => {
        heading,
        text,
        promoCards[] {
          _key,
          title,
          subtitle,
          colorTheme,
          "backgroundImage": backgroundImage.asset->url,
          link
        }
      },
      
      // Game carousel
      _type == "gameCarousel" => {
        title,
        displayMode,
        showWinAmounts,
        cardSize,
        "games": games[]-> {
          _id,
          title,
          "slug": slug.current,
          "categorySlug": categories[0]->slug.current,
          thumbnail,
          provider,
          rtp,
          volatility
        }
      },
      
      // Tab section
      _type == "tabSection" => {
        tabs[] {
          label,
          content
        }
      },
      
      // Rich text
      _type == "richText" => {
        content
      },
      
      // CTA Banner
      _type == "ctaBanner" => {
        heading,
        text,
        buttonText,
        buttonLink,
        "backgroundImage": backgroundImage.asset->url
      },

      // FAQ Section
      _type == "faq" => {
        heading,
        items[] {
          _key,
          question,
          answer
        }
      },

      // Feature Cards
      _type == "featureCards" => {
        heading,
        cards[] {
          _key,
          icon,
          title,
          description
        }
      }
    }
  }
`

// Get page by slug
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "slug": slug.current,
    showAuthorInfo,
    publishedAt,
    updatedAt,
    author-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },
    seo,
    content
  }
`

// Get all pages for sitemap
export const allPagesQuery = groq`
  *[_type == "page"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get navigation
export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    title,
    items[] {
      label,
      icon,
      linkType,
      externalUrl,
      highlight
    }
  }
`

// Get sidebar navigation by title
export const sidebarNavigationQuery = groq`
  *[_type == "navigation" && title == $title][0] {
    title,
    items[] {
      _type,
      // navItem fields
      _type == "navItem" => {
        label,
        icon,
        linkType,
        "href": select(
          linkType == "internal" && internalLink->isHomepage == true => "/casino/",
          linkType == "internal" => "/casino/" + internalLink->slug.current + "/",
          linkType == "category" => "/casino/" + categoryLink->slug.current + "/",
          linkType == "external" => externalUrl
        ),
        highlight
      },
      // navSection fields
      _type == "navSection" => {
        sectionTitle,
        isCollapsible,
        defaultOpen,
        showDivider,
        highlight,
        items[] {
          label,
          icon,
          linkType,
          "href": select(
            linkType == "internal" && internalLink->isHomepage == true => "/casino/",
            linkType == "internal" => "/casino/" + internalLink->slug.current + "/",
            linkType == "category" => "/casino/" + categoryLink->slug.current + "/",
            linkType == "game" => "/casino/" + gameLink->categories[0]->slug.current + "/" + gameLink->slug.current + "/",
            linkType == "external" => externalUrl
          ),
          highlight
        }
      }
    }
  }
`

// Get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    "logo": logo.asset->url,
    logoAlt,
    mainSiteUrl,
    signInUrl,
    signUpUrl
  }
`

// Get footer by title
export const footerQuery = groq`
  *[_type == "footer" && title == $title][0] {
    title,
    columns[] {
      heading,
      links[] {
        label,
        url,
        "internalHref": "/casino/" + internalLink->slug.current + "/",
        openInNewTab
      }
    },
    legalText,
    copyrightText,
    socialLinks[] {
      platform,
      url
    },
    badges[] {
      "image": image.asset->url,
      alt,
      url
    }
  }
`

// Get game by slug
export const gameBySlugQuery = groq`
  *[_type == "game" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    provider,
    "categories": categories[]-> {
      _id,
      title,
      "slug": slug.current
    },
    externalGameUrl,
    isFeatured,
    isNew,

    // Details
    rtp,
    volatility,
    paylines,
    reels,
    maxWin,
    minBet,
    maxBet,
    hasBonusFeature,
    hasFreeSpins,
    hasAutoplay,
    releaseDate,

    // Media
    thumbnail,
    "screenshots": screenshots[] {
      asset,
      alt
    },

    // Content
    quickSummary {
      intro,
      highlights
    },
    description,
    additionalContent,
    faq[] {
      _key,
      question,
      answer
    },

    // Authorship
    showAuthorInfo,
    publishedAt,
    updatedAt,
    author-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },

    // SEO
    seo {
      metaTitle,
      metaDescription,
      breadcrumbText,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    },

    // Structured Data
    gameSchema
  }
`

// Get all games for sitemap/static generation
export const allGamesQuery = groq`
  *[_type == "game"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get category by slug
export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    additionalContent,
    faq[] {
      _key,
      question,
      answer
    },
    showAuthorInfo,
    publishedAt,
    updatedAt,
    author-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },
    seo {
      metaTitle,
      metaDescription,
      breadcrumbText,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    }
  }
`

// Get all categories for sitemap/static generation
export const allCategoriesQuery = groq`
  *[_type == "category"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get games by category slug
export const gamesByCategoryQuery = groq`
  *[_type == "game" && $categorySlug in categories[]->slug.current] {
    _id,
    title,
    "slug": slug.current,
    thumbnail,
    provider,
    rtp,
    volatility,
    isNew,
    isFeatured
  } | order(isFeatured desc, title asc)
`

// Get all games with their category slugs for static generation
export const allGamesWithCategoriesQuery = groq`
  *[_type == "game" && count(categories) > 0] {
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    _updatedAt
  }
`

// Get games by provider (for "More from Provider" carousel)
export const gamesByProviderQuery = groq`
  *[_type == "game" && provider == $provider && slug.current != $excludeSlug && count(categories) > 0] | order(_createdAt desc)[0...6] {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    thumbnail,
    provider,
    rtp,
    volatility
  }
`

// ==================
// PROMOTION QUERIES
// ==================

// Get promotion by slug
export const promotionBySlugQuery = groq`
  *[_type == "promotion" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    "slug": slug.current,
    promotionType,
    flair,
    excerpt,
    externalUrl,
    ctaText,
    startDate,
    endDate,
    isActive,
    isFeatured,

    // Media
    "heroImage": heroImage.asset->url,
    "thumbnail": coalesce(thumbnail.asset->url, heroImage.asset->url),

    // Content
    content,
    termsAndConditions,
    faq[] {
      _key,
      question,
      answer
    },

    // Authorship
    showAuthorInfo,
    publishedAt,
    updatedAt,
    author-> {
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      expertise,
      socialLinks
    },

    // SEO
    seo {
      metaTitle,
      metaDescription,
      breadcrumbText,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    }
  }
`

// Get all active promotions for listing page
export const allPromotionsQuery = groq`
  *[_type == "promotion" && isActive == true] | order(isFeatured desc, startDate desc) {
    _id,
    title,
    "slug": slug.current,
    promotionType,
    flair,
    flairColor,
    excerpt,
    startDate,
    endDate,
    isFeatured,
    "thumbnail": coalesce(thumbnail.asset->url, heroImage.asset->url)
  }
`

// Get promotions by type
export const promotionsByTypeQuery = groq`
  *[_type == "promotion" && promotionType == $type && isActive == true] | order(isFeatured desc, startDate desc) {
    _id,
    title,
    "slug": slug.current,
    promotionType,
    flair,
    excerpt,
    startDate,
    endDate,
    isFeatured,
    "thumbnail": coalesce(thumbnail.asset->url, heroImage.asset->url)
  }
`

// Get related promotions (same type, excluding current)
export const relatedPromotionsQuery = groq`
  *[_type == "promotion" && promotionType == $type && slug.current != $excludeSlug && isActive == true] | order(isFeatured desc, startDate desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    promotionType,
    flair,
    excerpt,
    "thumbnail": coalesce(thumbnail.asset->url, heroImage.asset->url)
  }
`

// Search games by title or provider
export const searchGamesQuery = groq`
  *[_type == "game" && (title match $searchTerm || provider match $searchTerm) && count(categories) > 0] | order(title asc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    thumbnail,
    provider
  }
`

// Get all promotions for sitemap/static generation
export const allPromotionSlugsQuery = groq`
  *[_type == "promotion" && isActive == true] {
    "slug": slug.current,
    _updatedAt
  }
`