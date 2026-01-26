/**
 * Fix games without categories
 *
 * Usage:
 *   npx tsx scripts/fix-game-categories.ts --category=slots --dry-run
 *   SANITY_WRITE_TOKEN=xxx npx tsx scripts/fix-game-categories.ts --category=crash
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

interface GameWithoutCategory {
  _id: string
  title: string
  metawinId?: number
}

interface Category {
  _id: string
  slug: string
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const categoryArg = args.find(a => a.startsWith('--category='))
  const categorySlug = categoryArg?.split('=')[1]

  if (!categorySlug) {
    console.log(`
Fix Games Without Categories

Usage:
  npx tsx scripts/fix-game-categories.ts --category=<slug> [--dry-run]

Options:
  --category=<slug>  Category slug to assign (required)
                     Available: slots, crash, plinko, blackjack, baccarat,
                     roulette, keno, live-casino, table-games
  --dry-run          Preview changes without updating

Examples:
  npx tsx scripts/fix-game-categories.ts --category=crash --dry-run
  SANITY_WRITE_TOKEN=xxx npx tsx scripts/fix-game-categories.ts --category=slots
`)
    process.exit(0)
  }

  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN required for updates. Use --dry-run to preview.')
    process.exit(1)
  }

  // Find the category
  const categories = await sanityClient.fetch<Category[]>(
    `*[_type == "category"] { _id, "slug": slug.current }`
  )
  const category = categories.find(c => c.slug === categorySlug)

  if (!category) {
    console.error(`ERROR: Category "${categorySlug}" not found.`)
    console.log('Available categories:', categories.map(c => c.slug).join(', '))
    process.exit(1)
  }

  console.log(`\nCategory: ${categorySlug} (${category._id})`)

  // Find games without categories
  const gamesWithoutCategory = await sanityClient.fetch<GameWithoutCategory[]>(
    `*[_type == "game" && (!defined(categories) || length(categories) == 0)] {
      _id,
      title,
      metawinId
    } | order(title asc)`
  )

  console.log(`Found ${gamesWithoutCategory.length} games without categories:\n`)

  if (gamesWithoutCategory.length === 0) {
    console.log('No games need fixing!')
    return
  }

  for (const game of gamesWithoutCategory) {
    const imported = game.metawinId ? ' (imported)' : ''
    console.log(`  - ${game.title}${imported}`)
  }

  if (dryRun) {
    console.log(`\n--- DRY RUN ---`)
    console.log(`Would add category "${categorySlug}" to ${gamesWithoutCategory.length} games.`)
    console.log('Run without --dry-run to apply changes.')
    return
  }

  console.log(`\nUpdating ${gamesWithoutCategory.length} games...`)

  // Batch update
  const BATCH_SIZE = 50
  let updated = 0

  for (let i = 0; i < gamesWithoutCategory.length; i += BATCH_SIZE) {
    const batch = gamesWithoutCategory.slice(i, i + BATCH_SIZE)
    const transaction = sanityClient.transaction()

    for (const game of batch) {
      transaction.patch(game._id, {
        set: {
          categories: [{ _type: 'reference', _ref: category._id, _key: categorySlug }]
        }
      })
    }

    await transaction.commit()
    updated += batch.length
    console.log(`  Updated ${updated}/${gamesWithoutCategory.length}...`)
  }

  console.log(`\nDone! Added category "${categorySlug}" to ${updated} games.`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
