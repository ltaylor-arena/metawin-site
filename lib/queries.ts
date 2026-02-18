// Sanity GROQ Queries
import { groq } from 'next-sanity'

// Helper: Resolve internal links in Portable Text markDefs
// This projection resolves document references to URLs
const resolveInternalLinks = `
  markDefs[] {
    ...,
    _type == "link" && linkType == "internal" => {
      "href": select(
        reference->_type == "page" && reference->isHomepage == true => "/casino/",
        reference->_type == "page" => "/casino/" + reference->slug.current + "/",
        reference->_type == "game" => "/casino/games/" + reference->categories[0]->slug.current + "/" + reference->slug.current + "/",
        reference->_type == "category" => "/casino/games/" + reference->slug.current + "/",
        reference->_type == "promotion" => "/casino/promotions/" + reference->slug.current + "/",
        reference->_type == "author" => "/casino/authors/" + reference->slug.current + "/",
        null
      )
    }
  }
`

// Helper: Rich text block with resolved internal links
const richTextWithLinks = `
  ...,
  ${resolveInternalLinks}
`

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
    factChecker-> {
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
      hideKicker,
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
          "desktopImage": desktopImage.asset->url,
          "mobileImage": mobileImage.asset->url,
          eyebrow,
          heading,
          ctaText,
          ctaLink
        }
      },
      
      // Intro section
      _type == "introSection" => {
        heading,
        "text": text[] { ${richTextWithLinks} },
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
        "viewAllHref": select(
          viewAllLink->_type == "page" && viewAllLink->isHomepage == true => "/casino/",
          viewAllLink->_type == "page" => "/casino/" + viewAllLink->slug.current + "/",
          viewAllLink->_type == "category" => "/casino/games/" + viewAllLink->slug.current + "/",
          displayMode == "category" && defined(category) => "/casino/games/" + category->slug.current + "/",
          displayMode == "popular" => "/casino/games/",
          displayMode == "latest" => "/casino/games/",
          null
        ),
        "categorySlug": category->slug.current,
        "games": select(
          displayMode == "category" => *[_type == "game" && references(^.category._ref)] | order(select(count(content) > 0 && isFeatured == true => 0, count(content) > 0 => 1, isFeatured == true => 2, 3), title asc)[0...12] {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          },
          displayMode == "latest" => *[_type == "game"] | order(_createdAt desc)[0...12] {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          },
          displayMode == "popular" => *[_type == "game" && isFeatured == true] | order(select(count(content) > 0 => 0, 1), title asc)[0...12] {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          },
          games[]-> {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          }
        )
      },

      // Tab section
      _type == "tabSection" => {
        tabs[] {
          label,
          "content": content[] { ${richTextWithLinks} }
        }
      },
      
      // Rich text
      _type == "richText" => {
        "content": content[] { ${richTextWithLinks} },
        maxLines
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
          "answer": answer[] { ${richTextWithLinks} }
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
      },

      // Callout
      _type == "callout" => {
        title,
        "content": content[] { ${richTextWithLinks} },
        variant
      },

      // Category Cards
      _type == "categoryCards" => {
        heading,
        "sectionDescription": description,
        cards[] {
          _key,
          "image": image.asset->url,
          title,
          description,
          ctaText,
          ctaLink
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
    h1,
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
    factChecker-> {
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
      hideKicker,
      metaDescription,
      breadcrumbText,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    },
    content[] {
      _type,
      _key,

      // Hero
      _type == "hero" => {
        autoplay,
        autoplaySpeed,
        slides[] {
          "desktopImage": desktopImage.asset->url,
          "mobileImage": mobileImage.asset->url,
          eyebrow,
          heading,
          ctaText,
          ctaLink
        }
      },

      // Intro section
      _type == "introSection" => {
        heading,
        "text": text[] { ${richTextWithLinks} },
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
        "viewAllHref": select(
          viewAllLink->_type == "page" && viewAllLink->isHomepage == true => "/casino/",
          viewAllLink->_type == "page" => "/casino/" + viewAllLink->slug.current + "/",
          viewAllLink->_type == "category" => "/casino/games/" + viewAllLink->slug.current + "/",
          displayMode == "category" && defined(category) => "/casino/games/" + category->slug.current + "/",
          displayMode == "popular" => "/casino/games/",
          displayMode == "latest" => "/casino/games/",
          null
        ),
        "categorySlug": category->slug.current,
        "games": select(
          displayMode == "category" => *[_type == "game" && references(^.category._ref)] | order(select(count(content) > 0 && isFeatured == true => 0, count(content) > 0 => 1, isFeatured == true => 2, 3), title asc)[0...12] {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          },
          displayMode == "latest" => *[_type == "game"] | order(_createdAt desc)[0...12] {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          },
          displayMode == "popular" => *[_type == "game" && isFeatured == true] | order(select(count(content) > 0 => 0, 1), title asc)[0...12] {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          },
          games[]-> {
            _id,
            title,
            "slug": slug.current,
            "categorySlug": categories[0]->slug.current,
            thumbnail,
            externalThumbnailUrl,
            provider,
            rtp,
            volatility,
            isNew,
            isFeatured,
            "hasContent": count(content) > 0
          }
        )
      },

      // Rich text
      _type == "richText" => {
        "content": content[] { ${richTextWithLinks} },
        maxLines
      },

      // CTA Banner
      _type == "ctaBanner" => {
        heading,
        text,
        buttonText,
        buttonLink,
        "backgroundImage": backgroundImage.asset->url
      },

      // FAQ
      _type == "faq" => {
        heading,
        items[] {
          question,
          answer
        }
      },

      // Feature Cards
      _type == "featureCards" => {
        heading,
        cards[] {
          _key,
          title,
          description,
          icon
        }
      },

      // Author's Thoughts
      _type == "gameAuthorThoughts" => {
        "content": content[] { ${richTextWithLinks} }
      },

      // Callout
      _type == "callout" => {
        title,
        "content": content[] { ${richTextWithLinks} },
        variant
      },

      // Category Cards
      _type == "categoryCards" => {
        heading,
        "sectionDescription": description,
        cards[] {
          _key,
          "image": image.asset->url,
          title,
          description,
          ctaText,
          ctaLink
        }
      }
    }
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
          linkType == "category" => "/casino/games/" + categoryLink->slug.current + "/",
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
            linkType == "category" => "/casino/games/" + categoryLink->slug.current + "/",
            linkType == "game" => "/casino/games/" + gameLink->categories[0]->slug.current + "/" + gameLink->slug.current + "/",
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
        externalUrl,
        openInNewTab,
        "internalHref": select(
          internalLink->_type == "page" && internalLink->isHomepage == true => "/casino/",
          internalLink->_type == "page" => "/casino/" + internalLink->slug.current + "/",
          internalLink->_type == "category" => "/casino/games/" + internalLink->slug.current + "/",
          internalLink->_type == "game" => "/casino/games/" + internalLink->categories[0]->slug.current + "/" + internalLink->slug.current + "/",
          null
        )
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
    externalThumbnailUrl,
    "screenshots": screenshots[] {
      asset,
      alt
    },

    // Content Blocks (reorderable middle section)
    content[] {
      _type,
      _key,

      // Quick Summary
      _type == "gameQuickSummary" => {
        "intro": intro[] { ${richTextWithLinks} }
      },

      // Pros and Cons
      _type == "gameProsAndCons" => {
        pros,
        cons
      },

      // Rich Text
      _type == "gameRichText" => {
        tocTitle,
        "content": content[] { ${richTextWithLinks} }
      },

      // Author's Thoughts
      _type == "gameAuthorThoughts" => {
        "content": content[] { ${richTextWithLinks} }
      },

      // Callout
      _type == "callout" => {
        title,
        "content": content[] { ${richTextWithLinks} },
        variant
      },

      // Data Table
      _type == "gameTable" => {
        title,
        "introText": introText[] { ${richTextWithLinks} },
        tableData {
          headers,
          rows[] {
            _key,
            cells
          }
        },
        caption,
        highlightFirstColumn,
        striped
      }
    },

    // FAQ (fixed at bottom)
    faq[] {
      _key,
      question,
      "answer": answer[] { ${richTextWithLinks} }
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
    factChecker-> {
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
      hideKicker,
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
    h1,
    "slug": slug.current,
    description,
    gamesPerPage,
    // Content Blocks (reorderable)
    content[] {
      _type,
      _key,

      // Rich Text
      _type == "gameRichText" => {
        tocTitle,
        "content": content[] { ${richTextWithLinks} }
      },

      // Author's Thoughts
      _type == "gameAuthorThoughts" => {
        "content": content[] { ${richTextWithLinks} }
      },

      // Callout
      _type == "callout" => {
        title,
        "content": content[] { ${richTextWithLinks} },
        variant
      },

      // Data Table
      _type == "gameTable" => {
        title,
        "introText": introText[] { ${richTextWithLinks} },
        tableData {
          headers,
          rows[] {
            _key,
            cells
          }
        },
        caption,
        highlightFirstColumn,
        striped
      }
    },
    faq[] {
      _key,
      question,
      "answer": answer[] { ${richTextWithLinks} }
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
    factChecker-> {
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
      hideKicker,
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

// Get all categories with their recent games for games index page
export const categoriesWithGamesQuery = groq`
  *[_type == "category" && hideFromGamesIndex != true] | order(coalesce(order, 999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    "totalGames": count(*[_type == "game" && references(^._id)]),
    "games": *[_type == "game" && references(^._id)] | order(select(count(content) > 0 && isFeatured == true => 0, count(content) > 0 => 1, isFeatured == true => 2, 3), title asc)[0...18] {
      _id,
      title,
      "slug": slug.current,
      "categorySlug": ^.slug.current,
      thumbnail,
      externalThumbnailUrl,
      provider,
      rtp,
      volatility,
      isNew,
      isFeatured,
      "hasContent": count(content) > 0
    }
  }
`

// Get games by category slug
export const gamesByCategoryQuery = groq`
  *[_type == "game" && $categorySlug in categories[]->slug.current] {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": $categorySlug,
    thumbnail,
    externalThumbnailUrl,
    provider,
    rtp,
    volatility,
    isNew,
    isFeatured,
    "hasContent": count(content) > 0
  } | order(isFeatured desc, title asc)
`

// Get paginated games by category slug with sort options
// Sort options: 'reviews-popular' | 'popular' | 'a-z' | 'z-a' | 'rtp'
const gameFields = `
    _id,
    title,
    "slug": slug.current,
    "categorySlug": $categorySlug,
    thumbnail,
    externalThumbnailUrl,
    provider,
    rtp,
    volatility,
    isNew,
    isFeatured,
    isPopular,
    "hasContent": count(content) > 0
`

// Order clauses for each sort type
// Note: GROQ doesn't support 'desc' after boolean expressions, so we use select() to convert to sortable numbers
// Featured sort priority:
//   0: Has content + featured
//   1: Has content only
//   2: Featured only (no content)
//   3: Everything else (A-Z)
const sortOrders: Record<string, string> = {
  'featured': `order(
    select(
      count(content) > 0 && isFeatured == true => 0,
      count(content) > 0 => 1,
      isFeatured == true => 2,
      3
    ),
    title asc
  )`,
  'a-z': 'order(title asc)',
  'z-a': 'order(title desc)',
  'rtp': 'order(coalesce(rtp, 0) desc, title asc)',
}

export function getGamesByCategoryPaginatedQuery(sort: string = 'a-z'): string {
  const orderClause = sortOrders[sort] || sortOrders['a-z']
  return groq`
    *[_type == "game" && $categorySlug in categories[]->slug.current] | ${orderClause} [$start...$end] {
      ${gameFields}
    }
  `
}

// Legacy query for backwards compatibility (uses a-z sort)
export const gamesByCategoryPaginatedQuery = groq`
  *[_type == "game" && $categorySlug in categories[]->slug.current] | order(title asc) [$start...$end] {
    ${gameFields}
  }
`

// Get total count of games in a category
export const gamesByCategoryCountQuery = groq`
  count(*[_type == "game" && $categorySlug in categories[]->slug.current])
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
// Priority: featured+content > content > featured > rest (by _id for pseudo-random)
export const gamesByProviderQuery = groq`
  *[_type == "game" && provider == $provider && slug.current != $excludeSlug && count(categories) > 0] | order(
    select(
      count(content) > 0 && isFeatured == true => 0,
      count(content) > 0 => 1,
      isFeatured == true => 2,
      3
    ),
    _id asc
  )[0...12] {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    thumbnail,
    externalThumbnailUrl,
    provider,
    rtp,
    volatility,
    "hasContent": count(content) > 0
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
    "content": content[] { ${richTextWithLinks} },
    "termsAndConditions": termsAndConditions[] { ${richTextWithLinks} },
    faq[] {
      _key,
      question,
      "answer": answer[] { ${richTextWithLinks} }
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
    factChecker-> {
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
      hideKicker,
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
    externalThumbnailUrl,
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

// ==================
// AUTHOR QUERIES
// ==================

// Get author by slug
export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    role,
    bio,
    expertise,
    socialLinks,
    yearsInIndustry,
    favouriteGame-> {
      _id,
      title,
      "slug": slug.current,
      "categorySlug": categories[0]->slug.current,
      thumbnail,
      externalThumbnailUrl,
      provider,
      rtp,
      volatility
    },
    favouriteQuote,
    industryResources
  }
`

// Get all authors for sitemap/static generation
export const allAuthorsQuery = groq`
  *[_type == "author"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get content written by an author (pages, games, promotions)
export const contentByAuthorQuery = groq`
{
  "pages": *[_type == "page" && author._ref == $authorId && !isHomepage] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    "thumbnail": content[_type == "hero"][0].slides[0].desktopImage.asset->url
  },
  "games": *[_type == "game" && author._ref == $authorId && count(content) > 0] | order(publishedAt desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    thumbnail,
    externalThumbnailUrl,
    provider,
    publishedAt
  },
  "promotions": *[_type == "promotion" && author._ref == $authorId && isActive == true] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "thumbnail": coalesce(thumbnail.asset->url, heroImage.asset->url)
  }
}`

// Get all authors for index page with article counts, ordered by most articles
export const authorsIndexQuery = groq`
  *[_type == "author"] {
    _id,
    name,
    "slug": slug.current,
    image,
    role,
    bio,
    expertise,
    "articleCount": count(*[
      ((_type == "page" && author._ref == ^._id && !isHomepage) ||
       (_type == "game" && author._ref == ^._id && count(content) > 0) ||
       (_type == "promotion" && author._ref == ^._id && isActive == true))
    ])
  } | order(articleCount desc, name asc)`

// ============================================
// SITEMAP QUERIES
// Only include pages with content to avoid indexing empty pages
// ============================================

// Sitemap: Pages with content
export const sitemapPagesQuery = groq`
  *[_type == "page" && (isHomepage == true || count(content) > 0)] {
    "slug": slug.current,
    isHomepage,
    _updatedAt
  }
`

// Sitemap: Games with content (reviews, not just catalog entries)
export const sitemapGamesQuery = groq`
  *[_type == "game" && count(content) > 0] {
    title,
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    "thumbnail": thumbnail.asset->url,
    externalThumbnailUrl,
    "screenshots": screenshots[].asset->url,
    _updatedAt
  }
`

// Sitemap: Categories with content
export const sitemapCategoriesQuery = groq`
  *[_type == "category" && count(content) > 0] {
    "slug": slug.current,
    _updatedAt
  }
`

// Sitemap: Active promotions with content
export const sitemapPromotionsQuery = groq`
  *[_type == "promotion" && isActive == true && count(content) > 0] {
    title,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    "thumbnail": thumbnail.asset->url,
    _updatedAt
  }
`

// Sitemap: Authors with bio (ensures they have meaningful content)
export const sitemapAuthorsQuery = groq`
  *[_type == "author" && defined(bio)] {
    name,
    "slug": slug.current,
    "image": image.asset->url,
    _updatedAt
  }
`