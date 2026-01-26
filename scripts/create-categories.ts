/**
 * Create new game categories in Sanity
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=xxx npx tsx scripts/create-categories.ts
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const newCategories = [
  {
    _type: 'category',
    title: 'Blackjack',
    slug: { _type: 'slug', current: 'blackjack' },
    description: 'Play the best blackjack games at MetaWin Casino.',
    order: 10,
    showInNav: true,
  },
  {
    _type: 'category',
    title: 'Baccarat',
    slug: { _type: 'slug', current: 'baccarat' },
    description: 'Play the best baccarat games at MetaWin Casino.',
    order: 11,
    showInNav: true,
  },
  {
    _type: 'category',
    title: 'Keno',
    slug: { _type: 'slug', current: 'keno' },
    description: 'Play the best keno games at MetaWin Casino.',
    order: 12,
    showInNav: true,
  },
  {
    _type: 'category',
    title: 'Roulette',
    slug: { _type: 'slug', current: 'roulette' },
    description: 'Play the best roulette games at MetaWin Casino.',
    order: 13,
    showInNav: true,
  },
]

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN environment variable is required.')
    process.exit(1)
  }

  // Check which categories already exist
  const existing = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "category"] { "slug": slug.current }`
  )
  const existingSlugs = new Set(existing.map((c) => c.slug))

  console.log('\nExisting categories:', Array.from(existingSlugs).join(', '))

  const toCreate = newCategories.filter((c) => !existingSlugs.has(c.slug.current))

  if (toCreate.length === 0) {
    console.log('\nAll categories already exist. Nothing to create.')
    return
  }

  console.log(`\nCreating ${toCreate.length} new categories...`)

  for (const cat of toCreate) {
    const result = await sanityClient.create(cat)
    console.log(`  ✓ Created "${cat.title}" (${result._id})`)
  }

  console.log('\nDone! New categories created.')
  console.log('You can now edit them in Sanity Studio to add SEO, content, etc.')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
