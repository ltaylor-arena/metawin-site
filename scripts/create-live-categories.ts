/**
 * Create Live Game Categories
 *
 * Creates the live game subcategories in Sanity.
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const CATEGORIES_TO_CREATE = [
  { title: 'Live Roulette', slug: 'live-roulette', order: 20 },
  { title: 'Live Baccarat', slug: 'live-baccarat', order: 21 },
  { title: 'Live Blackjack', slug: 'live-blackjack', order: 22 },
  { title: 'Live Gameshows', slug: 'live-gameshows', order: 23 },
]

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  console.log('\n===========================================')
  console.log('Create Live Game Categories')
  console.log('===========================================')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log('===========================================\n')

  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN required.')
    process.exit(1)
  }

  // Check existing categories
  const existing = await sanityClient.fetch<{ slug: string }[]>(
    '*[_type == "category"] { "slug": slug.current }'
  )
  const existingSlugs = new Set(existing.map(c => c.slug))

  const toCreate = CATEGORIES_TO_CREATE.filter(c => !existingSlugs.has(c.slug))

  if (toCreate.length === 0) {
    console.log('All categories already exist!')
    return
  }

  console.log(`Categories to create: ${toCreate.length}`)
  for (const cat of toCreate) {
    console.log(`  - ${cat.title} (${cat.slug})`)
  }

  if (dryRun) {
    console.log('\nRun without --dry-run to create.')
    return
  }

  const transaction = sanityClient.transaction()
  for (const cat of toCreate) {
    transaction.create({
      _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      order: cat.order,
    })
  }

  await transaction.commit()
  console.log('\nCategories created!')
  console.log('\n===========================================\n')
}

main().catch(console.error)
