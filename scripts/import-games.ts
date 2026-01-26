/**
 * MetaWin Games Import Script
 *
 * Imports games from MetaWin API into Sanity CMS as placeholder entries.
 *
 * Usage:
 *   npx tsx scripts/import-games.ts --collection=popular --limit=50 --dry-run
 *   npx tsx scripts/import-games.ts --collection=slots --limit=100
 *   npx tsx scripts/import-games.ts --help
 *
 * Options:
 *   --collection  API collection to import from (default: popular)
 *   --limit       Max games to import (default: 250)
 *   --dry-run     Preview import without creating documents
 *   --help        Show help
 */

import { createClient } from '@sanity/client'

// ============================================================================
// Configuration
// ============================================================================

const API_BASE = 'https://api.prod.platform.mwapp.io'

const sanityClient = createClient({
  projectId: 'e5ats5ga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Required for mutations
})

// Map API collection names to Sanity category slugs
// This is the PRIMARY mapping - use collection-based imports for best results
// Run: curl "https://api.prod.platform.mwapp.io/game/collection?skip=0&take=100" to see all collections
const COLLECTION_TO_CATEGORY_SLUG: Record<string, string> = {
  // Slots - API uses 'all-slots'
  'all-slots': 'slots',

  // Crash games
  'crash': 'crash',

  // Plinko - API uses 'plinkos' (plural)
  'plinkos': 'plinko',

  // Table games - individual categories
  'blackjack': 'blackjack',
  'baccarat': 'baccarat',
  'roulette': 'roulette',
  'table-games': 'table-games',

  // Live casino
  'live-casino': 'live-casino',
  'live-dealer': 'live-casino',
  'live-gameshows': 'live-casino',

  // MetaWin Originals - map to crash (mini games)
  'originals': 'crash',
}

// Fallback: Map API game types to Sanity category slugs
// Used when importing from mixed collections like 'popular' or 'new'
const TYPE_TO_CATEGORY_SLUG: Record<string, string> = {
  // Slots
  'slot': 'slots',
  'slots': 'slots',

  // Table games - each has its own category
  'blackjack': 'blackjack',
  'baccarat': 'baccarat',
  'roulette': 'roulette',
  'keno': 'keno',
  'table': 'table-games',
  'table-game': 'table-games',
  'tablegame': 'table-games',

  // Crash games
  'crash': 'crash',
  'crashgame': 'crash',

  // Plinko
  'plinko': 'plinko',

  // Mini games / Originals - map to crash as fallback
  'minigame': 'crash',
  'mini-game': 'crash',
  'original': 'crash',
  'originals': 'crash',

  // Live casino
  'live': 'live-casino',
  'live-casino': 'live-casino',
  'livecasino': 'live-casino',
}

// Map volatility number (1-5) to string
function mapVolatility(vol: number | null | undefined): string | undefined {
  if (vol == null) return undefined
  if (vol <= 2) return 'low'
  if (vol <= 3) return 'medium'
  return 'high'
}

// ============================================================================
// API Types
// ============================================================================

interface MetaWinGame {
  id: number
  name: string
  type: string
  provider: string
  thumbnail: string
  slug: string
  volatility: number | null
  rtp: number | null
  studio: {
    name: string
    displayName: string
  } | null
}

interface RawApiResponse {
  collection: {
    id: number
    name: string
    slug: string
  }
  items: Array<{
    collectionId: number
    gameId: number
    game: MetaWinGame
  }>
  count: number
  totalCount: number
}

// ============================================================================
// API Functions
// ============================================================================

async function fetchGamesFromAPI(
  collection: string,
  take: number,
  skip: number = 0
): Promise<{ games: MetaWinGame[]; total: number }> {
  const response = await fetch(
    `${API_BASE}/game/collection/${collection}?skip=${skip}&take=${take}`,
    {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://metawin.com',
        'Referer': 'https://metawin.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data: RawApiResponse = await response.json()
  const games = data.items?.map((item) => item.game) || []

  return { games, total: data.totalCount || 0 }
}

// ============================================================================
// Sanity Functions
// ============================================================================

interface SanityCategory {
  _id: string
  slug: string
}

async function fetchExistingCategories(): Promise<Map<string, string>> {
  const categories = await sanityClient.fetch<SanityCategory[]>(
    `*[_type == "category"] { _id, "slug": slug.current }`
  )

  const map = new Map<string, string>()
  for (const cat of categories) {
    map.set(cat.slug, cat._id)
  }
  return map
}

interface ExistingGame {
  metawinId?: number
  slug: string
}

async function fetchExistingGames(): Promise<{ ids: Set<number>; slugs: Set<string> }> {
  const games = await sanityClient.fetch<ExistingGame[]>(
    `*[_type == "game"] { metawinId, "slug": slug.current }`
  )
  return {
    ids: new Set(games.filter((g) => g.metawinId).map((g) => g.metawinId!)),
    slugs: new Set(games.map((g) => g.slug)),
  }
}

function createGameDocument(
  game: MetaWinGame,
  categoryId: string | undefined,
  collection: string
): { _type: string; [key: string]: unknown } {
  const doc: { _type: string; [key: string]: unknown } = {
    _type: 'game',
    title: game.name,
    metawinId: game.id,
    slug: { _type: 'slug', current: game.slug },
    provider: game.studio?.displayName || game.provider,
    externalThumbnailUrl: game.thumbnail,
    externalGameUrl: `https://metawin.com/casino/slots/${game.slug}`,
    rtp: game.rtp,
    volatility: mapVolatility(game.volatility),
    isFeatured: false,
    isNew: false,
  }

  if (categoryId) {
    doc.categories = [{ _type: 'reference', _ref: categoryId }]
  }

  return doc
}

// ============================================================================
// Main Import Function
// ============================================================================

async function importGames(options: {
  collection: string
  limit: number
  dryRun: boolean
}) {
  const { collection, limit, dryRun } = options

  console.log('\n===========================================')
  console.log('MetaWin Games Import')
  console.log('===========================================')
  console.log(`Collection: ${collection}`)
  console.log(`Limit: ${limit}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE IMPORT'}`)
  console.log('===========================================\n')

  // Check for write token
  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) {
    console.error('ERROR: SANITY_WRITE_TOKEN environment variable is required for imports.')
    console.error('Create a token at: https://www.sanity.io/manage/project/e5ats5ga/api#tokens')
    console.error('\nRun with --dry-run to preview without a token.')
    process.exit(1)
  }

  // Step 1: Fetch existing data from Sanity
  console.log('Fetching existing Sanity data...')
  const [categories, existingGames] = await Promise.all([
    fetchExistingCategories(),
    fetchExistingGames(),
  ])
  console.log(`  Found ${categories.size} categories`)
  console.log(`  Found ${existingGames.ids.size} games with metawinId`)
  console.log(`  Found ${existingGames.slugs.size} total game slugs`)

  // Step 2: Fetch games from MetaWin API
  console.log(`\nFetching games from MetaWin API (collection: ${collection})...`)
  const { games, total } = await fetchGamesFromAPI(collection, limit)
  console.log(`  Fetched ${games.length} games (${total} total in collection)`)

  // Step 3: Filter out existing games (by metawinId OR slug)
  const newGames = games.filter((g) => {
    const hasExistingId = existingGames.ids.has(g.id)
    const hasExistingSlug = existingGames.slugs.has(g.slug)
    return !hasExistingId && !hasExistingSlug
  })
  const skippedById = games.filter((g) => existingGames.ids.has(g.id)).length
  const skippedBySlug = games.filter((g) => !existingGames.ids.has(g.id) && existingGames.slugs.has(g.slug)).length
  console.log(`  ${newGames.length} new games to import`)
  console.log(`  Skipped: ${skippedById} by metawinId, ${skippedBySlug} by slug`)

  if (newGames.length === 0) {
    console.log('\nNo new games to import. Done!')
    return
  }

  // Step 4: Map games to Sanity documents
  console.log('\nPreparing documents...')
  const documents: Array<{ _type: string; [key: string]: unknown }> = []
  const unmappedTypes = new Set<string>()

  // Check if collection has a direct category mapping
  const collectionCategorySlug = COLLECTION_TO_CATEGORY_SLUG[collection.toLowerCase()]
  const collectionCategoryId = collectionCategorySlug ? categories.get(collectionCategorySlug) : undefined

  if (collectionCategoryId) {
    console.log(`  Using collection-based category: ${collectionCategorySlug}`)
  } else {
    console.log(`  No collection mapping for "${collection}", falling back to game type mapping`)
  }

  for (const game of newGames) {
    // Use collection category if available, otherwise fall back to type-based mapping
    let categoryId = collectionCategoryId

    if (!categoryId) {
      const categorySlug = TYPE_TO_CATEGORY_SLUG[game.type?.toLowerCase()]
      categoryId = categorySlug ? categories.get(categorySlug) : undefined

      if (game.type && !categorySlug) {
        unmappedTypes.add(game.type)
      }
    }

    documents.push(createGameDocument(game, categoryId, collection))
  }

  if (unmappedTypes.size > 0) {
    console.log(`\n  WARNING: Unmapped game types found: ${Array.from(unmappedTypes).join(', ')}`)
    console.log('  These games will be imported without a category.')
    console.log('  Consider adding mappings to TYPE_TO_CATEGORY_SLUG in the script.\n')
  }

  // Step 5: Preview or import
  if (dryRun) {
    console.log('\n--- DRY RUN PREVIEW ---')
    console.log(`Would import ${documents.length} games:\n`)

    for (const doc of documents.slice(0, 10)) {
      const catInfo = doc.categories
        ? `[${(doc.categories as Array<{_ref: string}>)[0]._ref}]`
        : '[no category]'
      console.log(`  - ${doc.title} (${doc.provider}) ${catInfo}`)
    }

    if (documents.length > 10) {
      console.log(`  ... and ${documents.length - 10} more`)
    }

    console.log('\nRun without --dry-run to import these games.')
  } else {
    console.log(`\nImporting ${documents.length} games...`)

    // Use transactions for batch import
    const BATCH_SIZE = 50
    let imported = 0

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE)
      const transaction = sanityClient.transaction()

      for (const doc of batch) {
        transaction.create(doc)
      }

      await transaction.commit()
      imported += batch.length
      console.log(`  Imported ${imported}/${documents.length}...`)
    }

    console.log(`\nSuccessfully imported ${imported} games!`)
  }

  console.log('\n===========================================')
  console.log('Import complete!')
  console.log('===========================================\n')
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs(): { collection: string; limit: number; dryRun: boolean } {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
MetaWin Games Import Script

Imports games from MetaWin API into Sanity CMS as placeholder entries.
Games that already exist (by metawinId) are skipped automatically.

Usage:
  npx tsx scripts/import-games.ts [options]

Options:
  --collection=<name>  API collection to import from (default: popular)
                       Available: popular, all-slots, crash, plinkos, blackjack,
                       baccarat, roulette, table-games, live-casino, originals, new
  --limit=<number>     Max games to import (default: 250)
  --dry-run            Preview import without creating documents
  --help               Show this help

Environment:
  SANITY_WRITE_TOKEN   Required for imports (not needed for --dry-run)
                       Create at: https://www.sanity.io/manage

Examples:
  # Preview popular games
  npx tsx scripts/import-games.ts --dry-run

  # Import 50 popular games
  SANITY_WRITE_TOKEN=xxx npx tsx scripts/import-games.ts --collection=popular --limit=50

  # Import slots
  SANITY_WRITE_TOKEN=xxx npx tsx scripts/import-games.ts --collection=slots --limit=100
`)
    process.exit(0)
  }

  let collection = 'popular'
  let limit = 250
  let dryRun = false

  for (const arg of args) {
    if (arg.startsWith('--collection=')) {
      collection = arg.split('=')[1]
    } else if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.split('=')[1], 10)
    } else if (arg === '--dry-run') {
      dryRun = true
    }
  }

  return { collection, limit, dryRun }
}

// Run
const options = parseArgs()
importGames(options).catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
