# MetaWin Casino - Sanity + Next.js

SEO-optimized content site for MetaWin, designed to be served via CloudFront reverse proxy at `/casino/*`.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Sanity

Copy the environment file and add your Sanity credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Run Development Server

```bash
npm run dev
```

Visit:
- **Site**: http://localhost:3000/casino
- **Sanity Studio**: http://localhost:3000/studio (if configured)

## Project Structure

```
├── app/
│   ├── casino/              # Main casino routes
│   │   ├── page.tsx         # Homepage (/casino)
│   │   └── [slug]/          # Dynamic pages
│   └── layout.tsx           # Root layout
├── components/
│   ├── Sidebar.tsx          # Collapsible navigation
│   ├── Header.tsx           # Mobile header
│   ├── Footer.tsx           # Site footer
│   ├── HeroCarousel.tsx     # Promo carousel
│   ├── GameCarousel.tsx     # Game cards carousel
│   ├── Tabs.tsx             # Tab interface
│   ├── FeatureCards.tsx     # Feature highlights
│   └── Breadcrumbs.tsx      # SEO breadcrumbs
├── lib/
│   ├── sanity.ts            # Sanity client config
│   └── queries.ts           # GROQ queries
├── sanity/
│   └── schemas/             # Content schemas
│       ├── page.ts          # Page builder
│       ├── game.ts          # Game entries
│       ├── category.ts      # Game categories
│       ├── promo.ts         # Promotions
│       ├── navigation.ts    # Sidebar nav
│       ├── footer.ts        # Footer config
│       ├── seo.ts           # SEO fields
│       └── ...
└── styles/
    └── globals.css          # Global styles + MetaWin theme
```

## Sanity Schemas

### Documents
- **Page** - Flexible page builder with modular content blocks
- **Game** - Individual game entries with metadata
- **Category** - Game categories (Slots, Live Casino, etc.)
- **Promo** - Promotional content
- **Navigation** - Sidebar menu configuration
- **Footer** - Footer links and content
- **Site Settings** - Global configuration

### Content Blocks (Page Builder)
- Hero/Promo Carousel
- Intro Section (H1 + text)
- Game Carousel (manual or dynamic)
- Tab Section
- Rich Text
- CTA Banner

## SEO Configuration

Each page has configurable SEO fields:
- Meta Title
- Meta Description
- Breadcrumb Text
- Canonical URL
- No Index toggle
- OG Image

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

Your site will be available at `your-project.vercel.app`

### CloudFront Integration

Follow the CloudFront implementation guide to:
1. Set up the distribution with two origins
2. Configure `/casino/*` behavior to point to Vercel
3. Add `X-Forwarded-Host: metawin.com` header

## Cache Invalidation

When content is updated in Sanity, invalidate CloudFront cache:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/casino/*"
```

Or set up a Sanity webhook to automate this.

## Internal Linking

Sanity handles internal links via references:

```javascript
// Schema field
{
  name: 'internalLink',
  type: 'reference',
  to: [{ type: 'page' }, { type: 'game' }]
}

// GROQ query resolves to slug
"link": internalLink->{ "slug": slug.current }
```

Links don't break when slugs change - the reference stays intact.

## Adding New Pages

1. Create content in Sanity Studio
2. Set the slug (e.g., "slots" becomes `/casino/slots`)
3. Configure SEO fields
4. Add content blocks
5. Publish

## Customization

### Colors
Edit CSS variables in `styles/globals.css`:

```css
:root {
  --color-accent-blue: #3b82f6;
  --color-bg-primary: #0d0f13;
  /* ... */
}
```

### Components
All components are in `/components` and use Tailwind + CSS variables for styling.

## License

Proprietary - MetaWin
