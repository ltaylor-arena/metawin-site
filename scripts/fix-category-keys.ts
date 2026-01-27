/**
 * Fix Missing Category Keys
 *
 * Adds missing _key properties to category references in game documents.
 * This fixes the "Missing keys" error in Sanity Studio.
 *
 * Usage:
 *   npx tsx scripts/fix-category-keys.ts --dry-run
 *   npx tsx scripts/fix-category-keys.ts
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

interface CategoryRef {
  _type: 'reference'
  _ref: string
  _key?: string
}

interface GameWithCategories {
  _id: string
  title: string
  categories: CategoryRef[] | null
}

function generateKey(): string {
  return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  console.log('\n===========================================')
  console.log('Fix Missing Category Keys')
  console.log('===========================================')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`)
  console.log('===========================================\n')

  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN required for updates.')
    console.error('Run with --dry-run to preview without a token.')
    process.exit(1)
  }

  // Fetch all games with categories
  console.log('Fetching games with categories...')
  const games = await sanityClient.fetch<GameWithCategories[]>(
    '*[_type == "game" && defined(categories) && length(categories) > 0] { _id, title, categories }'
  )
  console.log(`Found ${games.length} games with categories`)

  // Find games with missing keys
  const gamesToFix: { game: GameWithCategories; fixedCategories: CategoryRef[] }[] = []

  for (const game of games) {
    if (!game.categories) continue

    const hasMissingKeys = game.categories.some(cat => !cat._key)
    if (hasMissingKeys) {
      const fixedCategories = game.categories.map(cat => ({
        ...cat,
        _key: cat._key || generateKey(),
      }))
      gamesToFix.push({ game, fixedCategories })
    }
  }

  console.log(`Games with missing keys: ${gamesToFix.length}`)

  if (gamesToFix.length === 0) {
    console.log('\nNo games need fixing!')
    return
  }

  if (dryRun) {
    console.log('\n--- DRY RUN PREVIEW ---')
    console.log(`Would fix ${gamesToFix.length} games`)
    console.log('\nSample games to fix:')
    for (const { game } of gamesToFix.slice(0, 10)) {
      console.log(`  - ${game.title}`)
    }
    if (gamesToFix.length > 10) {
      console.log(`  ... and ${gamesToFix.length - 10} more`)
    }
    console.log('\nRun without --dry-run to apply fixes.')
  } else {
    console.log('\nApplying fixes...')

    const BATCH_SIZE = 50
    let fixed = 0

    for (let i = 0; i < gamesToFix.length; i += BATCH_SIZE) {
      const batch = gamesToFix.slice(i, i + BATCH_SIZE)
      const transaction = sanityClient.transaction()

      for (const { game, fixedCategories } of batch) {
        transaction.patch(game._id, { set: { categories: fixedCategories } })
      }

      await transaction.commit()
      fixed += batch.length
      console.log(`  Fixed ${fixed}/${gamesToFix.length}...`)
    }

    console.log(`\nSuccessfully fixed ${fixed} games!`)
  }

  console.log('\n===========================================\n')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
