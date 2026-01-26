/**
 * Delete imported games (those with metawinId set)
 * This removes duplicates created during import when games already existed
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=xxx npx tsx scripts/delete-imported-games.ts
 */

import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN environment variable is required.')
    process.exit(1)
  }

  // Find all games with metawinId (these are imported games)
  const importedGames = await sanityClient.fetch<{ _id: string; title: string; metawinId: number }[]>(
    `*[_type == "game" && defined(metawinId)] { _id, title, metawinId }`
  )

  console.log(`\nFound ${importedGames.length} imported games (with metawinId):\n`)

  if (importedGames.length === 0) {
    console.log('No imported games to delete.')
    return
  }

  for (const game of importedGames) {
    console.log(`  - ${game.title} (metawinId: ${game.metawinId})`)
  }

  console.log(`\nDeleting ${importedGames.length} games...`)

  // Delete in batches
  const BATCH_SIZE = 50
  let deleted = 0

  for (let i = 0; i < importedGames.length; i += BATCH_SIZE) {
    const batch = importedGames.slice(i, i + BATCH_SIZE)
    const transaction = sanityClient.transaction()

    for (const game of batch) {
      transaction.delete(game._id)
    }

    await transaction.commit()
    deleted += batch.length
    console.log(`  Deleted ${deleted}/${importedGames.length}...`)
  }

  console.log(`\nDone! Deleted ${deleted} imported games.`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
