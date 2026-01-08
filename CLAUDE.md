# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MetaWin Casino - SEO-optimized content site built with Next.js 16 and Sanity CMS. Designed to be served via CloudFront reverse proxy at `/casino/*`.

## Commands

```bash
npm run dev          # Start Next.js dev server (site at http://localhost:3000/casino, studio at /studio)
npm run build        # Production build
npm run start        # Start production server
npm run sanity       # Run Sanity Studio standalone
```

## Architecture

### Routing Structure
- All public pages live under `/casino/*` (handled by `app/casino/`)
- Sanity Studio is embedded at `/studio` (handled by `app/studio/[[...index]]/`)
- Middleware (`middleware.ts`) processes CloudFront proxy headers on `/casino/*` routes

### Data Flow
1. **Sanity Client** (`lib/sanity.ts`) - Configured client with `sanityFetch()` helper that includes Next.js caching (60s revalidation)
2. **GROQ Queries** (`lib/queries.ts`) - All Sanity queries centralized here
3. **Page Components** fetch data server-side and render content blocks

### Page Builder Pattern
Pages use a modular content block system. The `page` schema has a `content` array that can contain:
- `hero` - Promo carousel slides
- `introSection` - H1 + text
- `gameCarousel` - Game cards (manual selection or dynamic)
- `tabSection` - Tabbed content
- `richText` - Portable Text content
- `ctaBanner` - Call-to-action with background

### Layout Hierarchy
```
app/layout.tsx          # Root: global styles, metadata template
└── app/casino/layout.tsx   # Casino: Sidebar + Header + Footer wrapper
    └── page.tsx            # Individual page content
```

### Sanity Schemas
Located in `sanity/schemas/`. Two types:
- **Documents**: `page`, `game`, `category`, `promo`, `siteSettings`, `navigation`, `footer`
- **Objects** (reusable): `seo`, `hero`, `gameCarousel`

## Key Patterns

### Image Handling
Use `urlFor()` from `lib/sanity.ts` to generate optimized image URLs from Sanity assets.

### Internal Links
Sanity uses references for internal links - they resolve to slugs via GROQ and don't break when slugs change.

### Styling
Tailwind CSS with CSS custom properties defined in `styles/globals.css` for MetaWin brand colors.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```
