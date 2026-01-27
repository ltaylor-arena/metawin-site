/**
 * Remove Table Games Category
 *
 * Recategorizes games from table-games to appropriate categories,
 * then deletes the table-games category.
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

// Map game metawinIds to their new category slugs
const GAME_RECATEGORIZATION: Record<number, string> = {
  4754: 'roulette',      // Auto-Roulette VIP
  1977: 'blackjack',     // Blackjack X 1 - Azure
  1978: 'blackjack',     // Blackjack X 2 - Azure
  1979: 'blackjack',     // Blackjack X 3 - Azure
  1980: 'blackjack',     // Blackjack X 4 - Ruby
  1981: 'blackjack',     // Blackjack X 5 - Ruby
  4488: 'live-gameshows', // First Person Dream Catcher
  4492: 'live-casino',   // First Person Super Sic Bo
  4493: 'poker',         // First Person Video Poker
  495: 'roulette',       // French Roulette
  500: 'blackjack',      // Multihand Blackjack
  65: 'roulette',        // Roulette
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  console.log('\n===========================================')
  console.log('Remove Table Games Category')
  console.log('===========================================')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log('===========================================\n')

  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN required.')
    process.exit(1)
  }

  // Get all categories
  const categories = await sanityClient.fetch<{ _id: string; slug: string; title: string }[]>(
    `*[_type == "category"] { _id, "slug": slug.current, title }`
  )
  const categoryMap = new Map(categories.map(c => [c.slug, c._id]))

  const tableGamesCatId = categoryMap.get('table-games')
  if (!tableGamesCatId) {
    console.log('table-games category not found!')
    return
  }

  console.log('Found table-games category:', tableGamesCatId)

  // Get games in table-games category
  const games = await sanityClient.fetch<{ _id: string; title: string; metawinId: number; categories: { _ref: string; _key: string }[] }[]>(
    `*[_type == "game" && references($catId)] { _id, title, metawinId, categories }`,
    { catId: tableGamesCatId }
  )

  console.log(`Found ${games.length} games to recategorize\n`)

  // Plan the changes
  const changes: { game: typeof games[0]; newCatSlug: string; newCatId: string }[] = []

  for (const game of games) {
    const newCatSlug = GAME_RECATEGORIZATION[game.metawinId]
    if (!newCatSlug) {
      console.log(`  WARNING: No mapping for ${game.title} (ID: ${game.metawinId})`)
      continue
    }

    const newCatId = categoryMap.get(newCatSlug)
    if (!newCatId) {
      console.log(`  WARNING: Category ${newCatSlug} not found for ${game.title}`)
      continue
    }

    changes.push({ game, newCatSlug, newCatId })
    console.log(`  ${game.title} → ${newCatSlug}`)
  }

  if (dryRun) {
    console.log('\n--- DRY RUN ---')
    console.log(`Would recategorize ${changes.length} games`)
    console.log('Would delete table-games category')
    console.log('\nRun without --dry-run to apply.')
    return
  }

  // Apply changes
  console.log('\nApplying changes...')

  const transaction = sanityClient.transaction()

  for (const { game, newCatId } of changes) {
    // Replace table-games category with new category
    const newCategories = game.categories
      .filter(c => c._ref !== tableGamesCatId)
      .concat([{ _type: 'reference', _ref: newCatId, _key: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` }])

    transaction.patch(game._id, { set: { categories: newCategories } })
  }

  // Delete the table-games category
  transaction.delete(tableGamesCatId)

  await transaction.commit()

  console.log(`\nRecategorized ${changes.length} games`)
  console.log('Deleted table-games category')
  console.log('\n===========================================\n')
}

main().catch(console.error)
