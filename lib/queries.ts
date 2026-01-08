// Sanity GROQ Queries
import { groq } from 'next-sanity'

// Get homepage
export const homepageQuery = groq`
  *[_type == "page" && isHomepage == true][0] {
    _id,
    title,
    "slug": slug.current,
    seo {
      metaTitle,
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
        text
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
          "thumbnail": thumbnail.asset->url,
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
      }
    }
  }
`

// Get page by slug
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
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
          linkType == "internal" => "/casino/" + internalLink->slug.current,
          linkType == "category" => "/casino/" + categoryLink->slug.current,
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
          url,
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
        "internalHref": "/casino/" + internalLink->slug.current,
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