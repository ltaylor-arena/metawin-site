/**
 * Export MetaWin Game Catalog
 *
 * Fetches all games from the API and exports them with their collections.
 * Useful for finding which collection contains specific games.
 *
 * Usage:
 *   npx tsx scripts/export-game-catalog.ts                              # Fetch from API, show summary
 *   npx tsx scripts/export-game-catalog.ts --output=game-catalog.json   # Export full catalog to JSON
 *   npx tsx scripts/export-game-catalog.ts --search=keno                # Search API results
 *   npx tsx scripts/export-game-catalog.ts --from-file=game-catalog.json --search=keno  # Search local file (no API calls)
 */

const API_BASE = 'https://api.prod.platform.mwapp.io'

interface Collection {
  id: number
  name: string
  slug: string
}

interface GameItem {
  id: number
  name: string
  slug: string
  type: string
  provider: string
  studio?: {
    name: string
    displayName: string
  }
}

interface CollectionResponse {
  collection: Collection
  items: Array<{ game: GameItem }>
  totalCount: number
}

const COLLECTIONS_TO_FETCH = [
  'all',
  'all-slots',
  'crash',
  'plinkos',
  'blackjack',
  'baccarat',
  'roulette',
  'table-games',
  'live-casino',
  'live-dealer',
  'live-gameshows',
  'originals',
  'fishing',
  'bonus-buy',
]

async function fetchCollection(slug: string): Promise<{ collection: string; games: GameItem[]; total: number }> {
  const allGames: GameItem[] = []
  let skip = 0
  const take = 100
  let totalCount = 0

  while (true) {
    const response = await fetch(
      `${API_BASE}/game/collection/${slug}?skip=${skip}&take=${take}`,
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
      console.error(`  Failed to fetch ${slug}: ${response.status}`)
      break
    }

    const data: CollectionResponse = await response.json()
    totalCount = data.totalCount || 0
    const games = data.items?.map(item => item.game) || []
    allGames.push(...games)

    if (games.length < take || allGames.length >= totalCount) {
      break
    }

    skip += take
    // Small delay between pagination requests
    await new Promise(r => setTimeout(r, 100))
  }

  return {
    collection: slug,
    games: allGames,
    total: totalCount,
  }
}

async function main() {
  const args = process.argv.slice(2)
  const searchArg = args.find(a => a.startsWith('--search='))
  const outputArg = args.find(a => a.startsWith('--output='))
  const fromFileArg = args.find(a => a.startsWith('--from-file='))
  const searchTerm = searchArg?.split('=')[1]?.toLowerCase()
  const outputFile = outputArg?.split('=')[1]
  const fromFile = fromFileArg?.split('=')[1]

  console.log('\n===========================================')
  console.log('MetaWin Game Catalog Export')
  console.log('===========================================\n')

  let gameList: Array<{
    id: number
    name: string
    slug: string
    type: string
    provider: string
    collections: string[]
  }> = []

  // If reading from existing file
  if (fromFile) {
    const fs = await import('fs')
    if (!fs.existsSync(fromFile)) {
      console.error(`File not found: ${fromFile}`)
      process.exit(1)
    }
    console.log(`Reading from ${fromFile}...\n`)
    gameList = JSON.parse(fs.readFileSync(fromFile, 'utf-8'))
    console.log(`Loaded ${gameList.length} games from file\n`)
  } else {
    // Fetch all collections from API
    const allGames = new Map<number, { game: GameItem; collections: string[] }>()

    for (const slug of COLLECTIONS_TO_FETCH) {
      process.stdout.write(`Fetching ${slug}...`)
      const { games, total } = await fetchCollection(slug)
      console.log(` ${games.length} games (${total} total)`)

      for (const game of games) {
        const existing = allGames.get(game.id)
        if (existing) {
          existing.collections.push(slug)
        } else {
          allGames.set(game.id, { game, collections: [slug] })
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200))
    }

    console.log(`\nTotal unique games: ${allGames.size}\n`)

    // Convert to array
    gameList = Array.from(allGames.values()).map(({ game, collections }) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      type: game.type,
      provider: game.studio?.displayName || game.provider,
      collections: collections.sort(),
    }))
  }

  // Filter by search term if provided
  if (searchTerm) {
    gameList = gameList.filter(g =>
      g.name.toLowerCase().includes(searchTerm) ||
      g.type?.toLowerCase().includes(searchTerm) ||
      g.provider?.toLowerCase().includes(searchTerm) ||
      g.collections.some(c => c.toLowerCase().includes(searchTerm))
    )
    console.log(`Found ${gameList.length} games matching "${searchTerm}":\n`)
  }

  // Sort by name
  gameList.sort((a, b) => a.name.localeCompare(b.name))

  // Output to file if requested
  if (outputFile) {
    const fs = await import('fs')
    fs.writeFileSync(outputFile, JSON.stringify(gameList, null, 2))
    console.log(`Exported ${gameList.length} games to ${outputFile}`)
  } else {
    // Print to console
    if (searchTerm) {
      // Detailed view for search results
      for (const game of gameList) {
        console.log(`${game.name}`)
        console.log(`  ID: ${game.id} | Type: ${game.type} | Provider: ${game.provider}`)
        console.log(`  Collections: ${game.collections.join(', ')}`)
        console.log()
      }
    } else {
      // Summary view
      console.log('Use --search=<term> to find specific games')
      console.log('Use --output=<file.json> to export full catalog\n')

      // Show collection summary
      const collectionCounts: Record<string, number> = {}
      for (const game of gameList) {
        for (const c of game.collections) {
          collectionCounts[c] = (collectionCounts[c] || 0) + 1
        }
      }

      console.log('Games per collection:')
      for (const [slug, count] of Object.entries(collectionCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${slug}: ${count}`)
      }
    }
  }

  console.log('\n===========================================\n')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
