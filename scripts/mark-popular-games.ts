/**
 * Mark Popular Games Script
 *
 * Fetches popular games from MetaWin API and marks them as isPopular=true in Sanity.
 * This helps with sorting games by popularity.
 *
 * Usage:
 *   npx tsx scripts/mark-popular-games.ts --dry-run    # Preview changes
 *   npx tsx scripts/mark-popular-games.ts              # Apply changes
 */

import { createClient } from '@sanity/client'

const API_BASE = 'https://api.prod.platform.mwapp.io'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

interface ApiGame {
  id: number
  name: string
  slug: string
}

interface RawApiResponse {
  items: Array<{ game: ApiGame }>
  totalCount: number
}

async function fetchPopularGamesFromAPI(): Promise<Set<number>> {
  const popularIds = new Set<number>()
  let skip = 0
  const take = 100

  console.log('Fetching popular games from API...')

  while (true) {
    const response = await fetch(
      `${API_BASE}/game/collection/popular?skip=${skip}&take=${take}`,
      {
        headers: {
          'Accept': 'application/json',
          'Origin': 'https://metawin.com',
          'Referer': 'https://metawin.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: RawApiResponse = await response.json()
    const games = data.items?.map(item => item.game) || []

    for (const game of games) {
      popularIds.add(game.id)
    }

    process.stdout.write(`  Fetched ${popularIds.size}/${data.totalCount}...\r`)

    if (games.length < take || popularIds.size >= data.totalCount) {
      break
    }

    skip += take
    await new Promise(r => setTimeout(r, 100))
  }

  console.log(`\n  Found ${popularIds.size} popular games in API`)
  return popularIds
}

interface SanityGame {
  _id: string
  title: string
  metawinId: number | null
  isPopular: boolean | null
}

async function fetchSanityGames(): Promise<SanityGame[]> {
  console.log('Fetching games from Sanity...')
  const games = await sanityClient.fetch<SanityGame[]>(
    `*[_type == "game"] { _id, title, metawinId, isPopular }`
  )
  console.log(`  Found ${games.length} games in Sanity`)
  return games
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  console.log('\n===========================================')
  console.log('Mark Popular Games')
  console.log('===========================================')
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE UPDATE'}`)
  console.log('===========================================\n')

  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN required for updates.')
    console.error('Run with --dry-run to preview without a token.')
    process.exit(1)
  }

  // Fetch data
  const [popularIds, sanityGames] = await Promise.all([
    fetchPopularGamesFromAPI(),
    fetchSanityGames(),
  ])

  // Find games that need updating
  const toMarkPopular: SanityGame[] = []
  const toUnmarkPopular: SanityGame[] = []

  for (const game of sanityGames) {
    if (!game.metawinId) continue

    const shouldBePopular = popularIds.has(game.metawinId)
    const isCurrentlyPopular = game.isPopular === true

    if (shouldBePopular && !isCurrentlyPopular) {
      toMarkPopular.push(game)
    } else if (!shouldBePopular && isCurrentlyPopular) {
      toUnmarkPopular.push(game)
    }
  }

  console.log(`\nGames to mark as popular: ${toMarkPopular.length}`)
  console.log(`Games to unmark as popular: ${toUnmarkPopular.length}`)

  if (toMarkPopular.length === 0 && toUnmarkPopular.length === 0) {
    console.log('\nNo changes needed!')
    return
  }

  if (dryRun) {
    console.log('\n--- DRY RUN PREVIEW ---')

    if (toMarkPopular.length > 0) {
      console.log('\nWould mark as popular:')
      for (const game of toMarkPopular.slice(0, 20)) {
        console.log(`  + ${game.title}`)
      }
      if (toMarkPopular.length > 20) {
        console.log(`  ... and ${toMarkPopular.length - 20} more`)
      }
    }

    if (toUnmarkPopular.length > 0) {
      console.log('\nWould unmark as popular:')
      for (const game of toUnmarkPopular.slice(0, 10)) {
        console.log(`  - ${game.title}`)
      }
      if (toUnmarkPopular.length > 10) {
        console.log(`  ... and ${toUnmarkPopular.length - 10} more`)
      }
    }

    console.log('\nRun without --dry-run to apply changes.')
  } else {
    console.log('\nApplying changes...')

    // Batch updates
    const BATCH_SIZE = 50
    let updated = 0

    // Mark as popular
    for (let i = 0; i < toMarkPopular.length; i += BATCH_SIZE) {
      const batch = toMarkPopular.slice(i, i + BATCH_SIZE)
      const transaction = sanityClient.transaction()

      for (const game of batch) {
        transaction.patch(game._id, { set: { isPopular: true } })
      }

      await transaction.commit()
      updated += batch.length
      console.log(`  Marked ${updated}/${toMarkPopular.length} as popular...`)
    }

    // Unmark as popular
    updated = 0
    for (let i = 0; i < toUnmarkPopular.length; i += BATCH_SIZE) {
      const batch = toUnmarkPopular.slice(i, i + BATCH_SIZE)
      const transaction = sanityClient.transaction()

      for (const game of batch) {
        transaction.patch(game._id, { set: { isPopular: false } })
      }

      await transaction.commit()
      updated += batch.length
      console.log(`  Unmarked ${updated}/${toUnmarkPopular.length} as popular...`)
    }

    console.log('\nDone!')
  }

  console.log('\n===========================================\n')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
