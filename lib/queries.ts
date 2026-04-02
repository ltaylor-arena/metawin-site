// Sanity GROQ Queries
import { groq } from 'next-sanity'

// Helper: Resolve internal links in Portable Text markDefs
// This projection resolves document references to URLs
const resolveInternalLinks = `
  markDefs[] {
    ...,
    _type == "link" && linkType == "internal" => {
      "href": select(
        reference->_type == "page" && reference->isHomepage == true => "/hub/",
        reference->_type == "page" => "/hub/" + reference->slug.current + "/",
        reference->_type == "game" => "/hub/games/" + reference->categories[0]->slug.current + "/" + reference->slug.current + "/",
        reference->_type == "category" => "/hub/games/" + reference->slug.current + "/",
        reference->_type == "promotion" => "/hub/promo-code/",
        reference->_type == "author" => "/hub/authors/" + reference->slug.current + "/",
        reference->_type == "guide" => "/hub/guides/" + reference->slug.current + "/",
        reference->_type == "guideCategory" => "/hub/guides/category/" + reference->slug.current + "/",
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
          headingLevel,
          subtitle,
          colorTheme,
          "backgroundImage": backgroundImage.asset->url,
          link
        }
      },

      // Game table
      _type == "gameCarousel" => {
        title,
        headingLevel,
        displayMode,
        "viewAllHref": select(
          viewAllLink->_type == "page" && viewAllLink->isHomepage == true => "/hub/",
          viewAllLink->_type == "page" => "/hub/" + viewAllLink->slug.current + "/",
          viewAllLink->_type == "category" => "/hub/games/" + viewAllLink->slug.current + "/",
          displayMode == "category" && defined(category) => "/hub/games/" + category->slug.current + "/",
          displayMode == "popular" => "/hub/games/",
          displayMode == "latest" => "/hub/games/",
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
          displayMode == "latest" => *[_type == "game"] | order(select(count(content) > 0 && (provider == "MetaWin Studios" || provider == "Gladiator Games") => 0, count(content) > 0 => 1, 2), _createdAt desc)[0...12] {
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
          headingLevel,
          subtitle,
          colorTheme,
          "backgroundImage": backgroundImage.asset->url,
          link
        }
      },

      // Game table
      _type == "gameCarousel" => {
        title,
        headingLevel,
        displayMode,
        "viewAllHref": select(
          viewAllLink->_type == "page" && viewAllLink->isHomepage == true => "/hub/",
          viewAllLink->_type == "page" => "/hub/" + viewAllLink->slug.current + "/",
          viewAllLink->_type == "category" => "/hub/games/" + viewAllLink->slug.current + "/",
          displayMode == "category" && defined(category) => "/hub/games/" + category->slug.current + "/",
          displayMode == "popular" => "/hub/games/",
          displayMode == "latest" => "/hub/games/",
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
          displayMode == "latest" => *[_type == "game"] | order(select(count(content) > 0 && (provider == "MetaWin Studios" || provider == "Gladiator Games") => 0, count(content) > 0 => 1, 2), _createdAt desc)[0...12] {
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
          linkType == "internal" && internalLink->isHomepage == true => "/hub/",
          linkType == "internal" && internalLink->_type == "blogSettings" => "/hub/blog/",
          linkType == "internal" && internalLink->_type == "blogPost" => "/hub/blog/" + internalLink->slug.current + "/",
          linkType == "internal" && internalLink->_type == "guideSettings" => "/hub/guides/",
          linkType == "internal" && internalLink->_type == "guide" => "/hub/guides/" + internalLink->slug.current + "/",
          linkType == "internal" => "/hub/" + internalLink->slug.current + "/",
          linkType == "category" => "/hub/games/" + categoryLink->slug.current + "/",
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
            linkType == "internal" && internalLink->isHomepage == true => "/hub/",
            linkType == "internal" && internalLink->_type == "blogSettings" => "/hub/blog/",
            linkType == "internal" && internalLink->_type == "blogPost" => "/hub/blog/" + internalLink->slug.current + "/",
            linkType == "internal" && internalLink->_type == "guideSettings" => "/hub/guides/",
            linkType == "internal" && internalLink->_type == "guide" => "/hub/guides/" + internalLink->slug.current + "/",
            linkType == "internal" => "/hub/" + internalLink->slug.current + "/",
            linkType == "category" => "/hub/games/" + categoryLink->slug.current + "/",
            linkType == "game" => "/hub/games/" + gameLink->categories[0]->slug.current + "/" + gameLink->slug.current + "/",
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
          internalLink->_type == "page" && internalLink->isHomepage == true => "/hub/",
          internalLink->_type == "page" => "/hub/" + internalLink->slug.current + "/",
          internalLink->_type == "category" => "/hub/games/" + internalLink->slug.current + "/",
          internalLink->_type == "game" => "/hub/games/" + internalLink->categories[0]->slug.current + "/" + internalLink->slug.current + "/",
          internalLink->_type == "blogSettings" => "/hub/blog/",
          internalLink->_type == "blogPost" => "/hub/blog/" + internalLink->slug.current + "/",
          internalLink->_type == "guideSettings" => "/hub/guides/",
          internalLink->_type == "guide" => "/hub/guides/" + internalLink->slug.current + "/",
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

    // Recent Wins
    "recentWins": recentWins[0...10]{
      _key,
      username,
      winUsd,
      currencyCode,
      winnings,
      timestamp
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
// Get all categories with game counts (lightweight, for category grid)
export const categorySummaryQuery = groq`
  *[_type == "category" && hideFromGamesIndex != true] | order(coalesce(order, 999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    "gameCount": count(*[_type == "game" && references(^._id)])
  }
`

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
    "categorySlug": categories[0]->slug.current,
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
  'newest': 'order(_createdAt desc)',
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

// Universal search across all content types
export const searchAllQuery = groq`{
  "games": *[_type == "game" && (title match $searchTerm || provider match $searchTerm) && count(categories) > 0] | order(title asc)[0...8] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "categorySlug": categories[0]->slug.current,
    thumbnail,
    externalThumbnailUrl,
    provider
  },
  "pages": *[_type == "page" && title match $searchTerm && !isHomepage] | order(title asc)[0...4] {
    _id,
    _type,
    title,
    "slug": slug.current
  },
  "blogPosts": *[_type == "blogPost" && title match $searchTerm] | order(publishedAt desc)[0...4] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "heroImage": heroImage.asset->url
  },
  "guides": *[_type == "guide" && title match $searchTerm] | order(coalesce(updatedAt, publishedAt) desc)[0...4] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    difficulty
  },
  "authors": *[_type == "author" && name match $searchTerm] | order(name asc)[0...4] {
    _id,
    _type,
    "title": name,
    "slug": slug.current,
    image
  }
}`

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

// ==================
// BLOG QUERIES
// ==================

// Helper: Blog post card fields (reusable projection)
const blogPostCardFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "heroImage": heroImage.asset->url,
  "heroImageAlt": heroImage.alt,
  publishedAt,
  isFeatured,
  "categories": categories[]-> {
    _id,
    title,
    "slug": slug.current,
    color
  },
  author-> {
    name,
    "slug": slug.current,
    image
  }
`

// Get blog settings (homepage config)
export const blogSettingsQuery = groq`
  *[_type == "blogSettings"][0] {
    heroHeading,
    heroSubtext,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    heroCta,
    "introText": introText[] { ${richTextWithLinks} },
    "featuredPost": featuredPost-> {
      ${blogPostCardFields}
    },
    latestPostsHeading,
    showLatestPosts,
    latestLimit,
    showByCategory,
    categoryPostsLimit,
    navLogo,
    navHomeLabel,
    navHomeUrl,
    "navCategories": navCategories[]-> {
      _id,
      title,
      "slug": slug.current,
      color
    },
    recentPostsLimit,
    navCta,
    seo {
      metaTitle,
      hideKicker,
      metaDescription,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    }
  }
`

// Get blog navigation settings (for blog layout)
export const blogNavigationQuery = groq`
  *[_type == "blogSettings"][0] {
    "navLogo": navLogo.asset->url,
    navHomeLabel,
    navHomeUrl,
    "navCategories": select(
      count(navCategories) > 0 => navCategories[]-> {
        _id,
        title,
        "slug": slug.current,
        color,
        icon
      },
      *[_type == "blogCategory" && showInNav == true] | order(coalesce(order, 999) asc) {
        _id,
        title,
        "slug": slug.current,
        color,
        icon
      }
    ),
    navCta
  }
`

// Get single featured blog post (fallback if not manually selected in settings)
export const featuredBlogPostQuery = groq`
  *[_type == "blogPost" && isFeatured == true] | order(publishedAt desc)[0] {
    ${blogPostCardFields}
  }
`

// Get latest blog posts
export const latestBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc)[0...$limit] {
    ${blogPostCardFields}
  }
`

// Get blog post by slug
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "heroImageCaption": heroImage.caption,
    publishedAt,
    updatedAt,
    isFeatured,
    showToc,
    showAuthorBio,
    "categories": categories[]-> {
      _id,
      title,
      "slug": slug.current,
      color
    },
    "content": content[] {
      ...,
      _type == "block" => { ${richTextWithLinks} },
      _type == "image" => {
        ...,
        "url": asset->url,
        alt,
        caption
      },
      _type == "callout" => {
        title,
        "content": content[] { ${richTextWithLinks} },
        variant
      }
    },
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
    "relatedPosts": relatedPosts[]-> {
      ${blogPostCardFields}
    },
    "relatedGames": relatedGames[]-> {
      _id,
      title,
      "slug": slug.current,
      "categorySlug": categories[0]->slug.current,
      thumbnail,
      externalThumbnailUrl,
      provider,
      rtp
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

// Get blog category by slug
export const blogCategoryBySlugQuery = groq`
  *[_type == "blogCategory" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "introText": introText[] { ${richTextWithLinks} },
    color,
    postsPerPage,
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

// Get blog posts by category (paginated)
export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPost" && $categorySlug in categories[]->slug.current] | order(publishedAt desc)[$start...$end] {
    ${blogPostCardFields}
  }
`

// Get total count of posts in a category
export const blogPostsByCategoryCountQuery = groq`
  count(*[_type == "blogPost" && $categorySlug in categories[]->slug.current])
`

// Get all blog categories for navigation
export const allBlogCategoriesQuery = groq`
  *[_type == "blogCategory" && showInNav == true] | order(coalesce(order, 999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    color,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }
`

// Get all blog posts for sitemap
export const allBlogPostSlugsQuery = groq`
  *[_type == "blogPost"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get all blog categories for sitemap
export const allBlogCategorySlugsQuery = groq`
  *[_type == "blogCategory"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Sitemap: Blog posts with content
export const sitemapBlogPostsQuery = groq`
  *[_type == "blogPost" && count(content) > 0] {
    title,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    _updatedAt
  }
`

// Sitemap: Blog categories
export const sitemapBlogCategoriesQuery = groq`
  *[_type == "blogCategory"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get posts by category for homepage sections
export const blogPostsByCategorySectionQuery = groq`
  *[_type == "blogCategory" && showInNav == true] | order(coalesce(order, 999) asc) {
    _id,
    title,
    "slug": slug.current,
    color,
    "posts": *[_type == "blogPost" && references(^._id)] | order(publishedAt desc)[0...$limit] {
      ${blogPostCardFields}
    }
  }
`

// Add blog posts to author content query
export const blogPostsByAuthorQuery = groq`
  *[_type == "blogPost" && author._ref == $authorId] | order(publishedAt desc)[0...$limit] {
    ${blogPostCardFields}
  }
`

// ==================
// GUIDE QUERIES
// ==================

// Helper: Guide card fields (reusable projection)
const guideCardFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "heroImage": heroImage.asset->url + "?w=640&q=80&auto=format",
  "heroImageAlt": heroImage.alt,
  publishedAt,
  updatedAt,
  difficulty,
  readingTime,
  "categories": categories[]-> {
    _id,
    title,
    "slug": slug.current,
    color
  },
  author-> {
    name,
    "slug": slug.current,
    image
  }
`

// Get guide settings (homepage config)
export const guideSettingsQuery = groq`
  *[_type == "guideSettings"][0] {
    heroHeading,
    heroSubtext,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "introText": introText[] { ${richTextWithLinks} },
    latestGuidesHeading,
    showLatestGuides,
    latestLimit,
    showByCategory,
    categoryGuidesLimit,
    seo {
      metaTitle,
      hideKicker,
      metaDescription,
      canonicalUrl,
      noIndex,
      "ogImage": ogImage.asset->url
    }
  }
`

// Get guide navigation settings (for guides layout)
export const guideNavigationQuery = groq`
  *[_type == "guideSettings"][0] {
    "navLogo": navLogo.asset->url,
    navHomeLabel,
    navHomeUrl,
    "navCategories": select(
      count(navCategories) > 0 => navCategories[]-> {
        _id,
        title,
        "slug": slug.current,
        color,
        icon
      },
      *[_type == "guideCategory" && showInNav == true] | order(coalesce(order, 999) asc) {
        _id,
        title,
        "slug": slug.current,
        color,
        icon
      }
    ),
    navCta
  }
`

// Get latest guides (ordered by updatedAt for evergreen content)
export const latestGuidesQuery = groq`
  *[_type == "guide"] | order(coalesce(updatedAt, publishedAt) desc)[0...$limit] {
    ${guideCardFields}
  }
`

// Get guide by slug
export const guideBySlugQuery = groq`
  *[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "heroImageCaption": heroImage.caption,
    publishedAt,
    updatedAt,
    difficulty,
    readingTime,
    showToc,
    showAuthorBio,
    "categories": categories[]-> {
      _id,
      title,
      "slug": slug.current,
      color
    },
    "content": content[] {
      ...,
      _type == "block" => { ${richTextWithLinks} },
      _type == "image" => {
        ...,
        "url": asset->url,
        alt,
        caption
      },
      _type == "callout" => {
        title,
        "content": content[] { ${richTextWithLinks} },
        variant
      },
      _type == "gameTable" => {
        ...,
      }
    },
    faq[] {
      _key,
      question,
      answer[] { ${richTextWithLinks} }
    },
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
    "relatedGuides": relatedGuides[]-> {
      ${guideCardFields}
    },
    "relatedGames": relatedGames[]-> {
      _id,
      title,
      "slug": slug.current,
      "categorySlug": categories[0]->slug.current,
      thumbnail,
      externalThumbnailUrl,
      provider,
      rtp
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

// Get guide category by slug
export const guideCategoryBySlugQuery = groq`
  *[_type == "guideCategory" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "introText": introText[] { ${richTextWithLinks} },
    color,
    guidesPerPage,
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

// Get guides by category (paginated)
export const guidesByCategoryQuery = groq`
  *[_type == "guide" && $categorySlug in categories[]->slug.current] | order(coalesce(updatedAt, publishedAt) desc)[$start...$end] {
    ${guideCardFields}
  }
`

// Get total count of guides in a category
export const guidesByCategoryCountQuery = groq`
  count(*[_type == "guide" && $categorySlug in categories[]->slug.current])
`

// Get all guide categories for navigation
export const allGuideCategoriesQuery = groq`
  *[_type == "guideCategory" && showInNav == true] | order(coalesce(order, 999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    color,
    "guideCount": count(*[_type == "guide" && references(^._id)])
  }
`

// Get all guide slugs for static generation
export const allGuideSlugsQuery = groq`
  *[_type == "guide"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get all guide category slugs for static generation
export const allGuideCategorySlugsQuery = groq`
  *[_type == "guideCategory"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Sitemap: Guides with content
export const sitemapGuidesQuery = groq`
  *[_type == "guide" && count(content) > 0] {
    title,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    _updatedAt
  }
`

// Sitemap: Guide categories
export const sitemapGuideCategoriesQuery = groq`
  *[_type == "guideCategory"] {
    "slug": slug.current,
    _updatedAt
  }
`

// Get guides by category for homepage sections
export const guidesByCategorySectionQuery = groq`
  *[_type == "guideCategory" && showInNav == true] | order(coalesce(order, 999) asc) {
    _id,
    title,
    "slug": slug.current,
    color,
    "guides": *[_type == "guide" && references(^._id)] | order(coalesce(updatedAt, publishedAt) desc)[0...$limit] {
      ${guideCardFields}
    }
  }
`

// Get guides by author
export const guidesByAuthorQuery = groq`
  *[_type == "guide" && author._ref == $authorId] | order(coalesce(updatedAt, publishedAt) desc)[0...$limit] {
    ${guideCardFields}
  }
`