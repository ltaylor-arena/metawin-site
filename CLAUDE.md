# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MetaWin Casino - SEO-optimized content site built with Next.js 16 and Sanity CMS. Designed to be served via CloudFront reverse proxy at `/hub/*`.

## Commands

```bash
npm run dev          # Start Next.js dev server (site at http://localhost:3000/hub, studio at /studio)
npm run build        # Production build
npm run start        # Start production server
npm run sanity       # Run Sanity Studio standalone
```

### Game Import Scripts (in `scripts/`, gitignored)

```bash
npx tsx scripts/import-games.ts --collection=all-slots --dry-run     # Preview import
npx tsx scripts/import-games.ts --collection=blackjack --limit=500   # Live import (needs SANITY_WRITE_TOKEN)
npx tsx scripts/update-game-data.ts --collection=blackjack --dry-run # Sync volatility/RTP from API
```

Collections: `popular`, `all-slots`, `crash`, `plinkos`, `blackjack`, `baccarat`, `roulette`, `table-games`, `live-casino`, `originals`. Games from MetaWin Studios and Gladiator Games are auto-featured on import.

## Architecture

### Routing Structure
- All public pages live under `/hub/*` (handled by `app/hub/`)
- Sanity Studio is embedded at `/studio` (handled by `app/studio/[[...index]]/`)
- Middleware (`middleware.ts`) processes CloudFront proxy headers on `/hub/*` routes

### Content Sections
- `/hub/` - Homepage (page builder)
- `/hub/games/` - Games index with category tiles
- `/hub/games/[category]/` - Category page with game table
- `/hub/games/[category]/[slug]/` - Individual game page (ISR, no static generation)
- `/hub/blog/` - Blog (time-sensitive, promotional content)
- `/hub/guides/` - Guides (evergreen, wiki-style educational content)
- `/hub/authors/[slug]/` - Author profiles
- `/hub/promo-code/` - Promotions

### Data Flow
1. **Sanity Client** (`lib/sanity.ts`) - Configured client with `sanityFetch()` helper that includes Next.js caching (60s revalidation)
2. **GROQ Queries** (`lib/queries.ts`) - All Sanity queries centralized here
3. **Page Components** fetch data server-side and render content blocks

### Page Builder Pattern
Pages use a modular content block system. The `page` schema has a `content` array that can contain:
- `hero` - Promo carousel slides
- `introSection` - H1 + text (supports embedded `gameCategoryGrid` blocks within rich text)
- `gameCarousel` - Game table (manual selection or dynamic by category/popular/latest)
- `gameCategoryGrid` - Auto-populated category tiles with icons and game counts
- `categoryCards` - Large promo cards with images and CTAs
- `tabSection` - Tabbed content
- `richText` - Portable Text content
- `ctaBanner` - Call-to-action with background
- `faq` - Accordion FAQ section
- `featureCards` - Feature highlight cards
- `callout` - Info/warning/success/tip boxes
- `hotColdSlots` - Live RTP tracker

### Layout
```
app/layout.tsx              # Root: global styles, metadata template
└── app/hub/layout.tsx   # Casino: single unified sidebar nav + header + footer
    └── page.tsx            # Individual page content
```

The sidebar navigation is consistent across all sections (games, blog, guides). It's driven by a single "Main Sidebar" navigation document in Sanity. Blog and guide links use `blogSettings` and `guideSettings` document references to link to their respective root pages.

### Sanity Schemas
Located in `sanity/schemas/`. Key types:
- **Documents**: `page`, `game`, `category`, `author`, `promotion`, `siteSettings`, `navigation`, `footer`, `blogPost`, `blogCategory`, `blogSettings`, `guide`, `guideCategory`, `guideSettings`
- **Objects** (reusable): `seo`, `hero`, `gameCarousel`, `gameCategoryGrid`, `faq`, `featureCards`, `promoCard`, `callout`, `categoryCards`
- **Game content blocks**: `gameQuickSummary`, `gameProsAndCons`, `gameRichText`, `gameAuthorThoughts`, `gameTable`

### Icon System
Custom SVG icons in `components/icons/GameIcons.tsx` plus Lucide React icons. Both the `Sidebar.tsx` component and `sanity/components/IconPicker.tsx` maintain matching icon maps — keep them in sync when adding new icons.

## Key Patterns

### Game URLs
Games always link to their **primary category** (first in the categories array): `/hub/games/{primaryCategory}/{slug}/`. The `categorySlug` in GROQ projections uses `categories[0]->slug.current`, not the current page's category. This prevents duplicate URLs for games in multiple categories.

### Image Handling
Use `urlFor()` from `lib/sanity.ts` to generate optimized image URLs from Sanity assets. External game thumbnails use `externalThumbnailUrl` from the MetaWin CDN.

### Internal Links
Sanity uses references for internal links in rich text — they resolve to slugs via GROQ (`resolveInternalLinks` helper) and don't break when slugs change. Supported reference types: `page`, `game`, `category`, `promotion`, `author`, `blogPost`, `blogCategory`, `guide`, `guideCategory`.

### Table of Contents
Blog posts and guides auto-generate TOC from H2 and H3 headings. The `PortableTextComponents.tsx` adds matching `id` attributes to rendered headings. H3s render indented in the TOC.

### Search
Universal search (`searchAllQuery`) covers games, pages, blog posts, guides, and authors. Results show color-coded type badges. Component: `components/SearchModal.tsx`.

### Volatility Column
The `GamesWikiTable` auto-hides the volatility column for categories where it's irrelevant (blackjack, baccarat, roulette, live casino, table games). Controlled by `HIDE_VOLATILITY_CATEGORIES` set in the component.

### Loading Skeletons
Each route segment has its own `loading.tsx` that matches the actual page layout. This prevents parent skeletons from showing for child routes.

### Mobile Patterns
- `GameCategoryGrid`: horizontal scroll on mobile, grid on desktop
- `PromoCarousel`: auto-playing carousel on mobile, stacked column on desktop
- `CategoryCards`: horizontal scroll on mobile, 3-column grid on desktop

### Styling
Tailwind CSS with CSS custom properties defined in `styles/globals.css` for MetaWin brand colors.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```

For game imports (scripts only):
```
SANITY_WRITE_TOKEN=<token>
```

## Deployment

Deployed on Vercel. Game pages use ISR (no `generateStaticParams`) to stay under the 80MB serverless function output limit with 3,800+ games.
