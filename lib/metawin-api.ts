// MetaWin Platform API Client
// Fetches live game data including real-time RTP figures

const API_BASE = 'https://api.prod.platform.mwapp.io'

export interface MetaWinGame {
  id: number
  name: string
  type: string
  provider: string
  thumbnail: string
  slug: string
  volatility: number
  rtp: number
  liveRTP: number | null
  recentRTP: number | null
  studio: {
    name: string
    displayName: string
  }
}

interface GamesCollectionResponse {
  games: MetaWinGame[]
  total: number
}

// Raw API response structure
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

/**
 * Fetch games from a MetaWin collection
 * @param collection - Collection slug (e.g., 'popular', 'slots', 'new')
 * @param take - Number of games to fetch (default 50)
 * @param skip - Number of games to skip for pagination (default 0)
 * @param revalidate - Cache revalidation time in seconds (default 300 = 5 minutes)
 */
export async function fetchGamesCollection(
  collection: string = 'popular',
  take: number = 50,
  skip: number = 0,
  revalidate: number = 300
): Promise<GamesCollectionResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/game/collection/${collection}?skip=${skip}&take=${take}`,
      {
        next: { revalidate },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Origin': 'https://metawin.com',
          'Referer': 'https://metawin.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
        },
      }
    )

    if (!response.ok) {
      console.error(`MetaWin API error: ${response.status} ${response.statusText}`)
      return { games: [], total: 0 }
    }

    const data: RawApiResponse = await response.json()

    // Extract games from the items array
    const games = data.items?.map((item) => item.game) || []

    return {
      games,
      total: data.totalCount || 0,
    }
  } catch (error) {
    console.error('Failed to fetch MetaWin games:', error)
    return { games: [], total: 0 }
  }
}

export interface HotColdGame {
  id: number
  name: string
  slug: string
  thumbnail: string
  provider: string
  providerSlug: string
  baseRtp: number
  recentRtp: number
  rtpDifference: number // Positive = hot, Negative = cold
}

/**
 * Get hot and cold slots based on RTP difference
 * Hot = recentRTP > baseRTP (paying above expected)
 * Cold = recentRTP < baseRTP (paying below expected)
 *
 * Cold games are matched to hot magnitudes for visual balance.
 *
 * @param limit - Max games per category (default 7)
 * @param revalidate - Cache time in seconds (default 300)
 */
export async function getHotColdSlots(
  limit: number = 7,
  revalidate: number = 300
): Promise<{ hot: HotColdGame[]; cold: HotColdGame[] }> {
  // Fetch from 'all' collection for variety across game types (cached for 5 min)
  const { games } = await fetchGamesCollection('all', 300, 0, revalidate)

  // Filter and transform games that have both RTP values
  const gamesWithRtp = games
    .filter((game): game is MetaWinGame & { rtp: number; recentRTP: number } =>
      game.rtp != null &&
      game.recentRTP != null &&
      game.rtp > 0 &&
      game.recentRTP > 0
    )
    .map((game) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      thumbnail: game.thumbnail,
      provider: game.studio?.displayName || game.provider,
      providerSlug: game.studio?.name || game.provider.toLowerCase(),
      baseRtp: game.rtp,
      recentRtp: game.recentRTP,
      rtpDifference: Number((game.recentRTP - game.rtp).toFixed(2)),
    }))

  // Filter out extreme outliers and require minimum difference to be meaningful
  const MAX_DIFFERENCE = 20
  const MIN_DIFFERENCE = 0.5 // Filter out near-zero differences

  // Get hot games (positive difference, sorted highest first)
  const hotGames = gamesWithRtp
    .filter((g) => g.rtpDifference >= MIN_DIFFERENCE && g.rtpDifference <= MAX_DIFFERENCE)
    .sort((a, b) => b.rtpDifference - a.rtpDifference)
    .slice(0, limit)

  // Get all cold games (negative difference)
  const allColdGames = gamesWithRtp
    .filter((g) => g.rtpDifference <= -MIN_DIFFERENCE && g.rtpDifference >= -MAX_DIFFERENCE)

  // Match cold games to hot magnitudes for visual balance
  // For each hot game's magnitude, find the closest cold game
  const coldGames: HotColdGame[] = []
  const usedColdIds = new Set<number>()

  for (const hotGame of hotGames) {
    const targetMagnitude = -hotGame.rtpDifference // e.g., +14 -> look for -14

    // Find closest cold game to this magnitude that hasn't been used
    let bestMatch: HotColdGame | null = null
    let bestDistance = Infinity

    for (const coldGame of allColdGames) {
      if (usedColdIds.has(coldGame.id)) continue

      const distance = Math.abs(coldGame.rtpDifference - targetMagnitude)
      if (distance < bestDistance) {
        bestDistance = distance
        bestMatch = coldGame
      }
    }

    if (bestMatch) {
      coldGames.push(bestMatch)
      usedColdIds.add(bestMatch.id)
    }
  }

  // Sort cold games by magnitude for consistent display
  coldGames.sort((a, b) => a.rtpDifference - b.rtpDifference)

  // Ensure same count
  const balancedCount = Math.min(hotGames.length, coldGames.length, limit)

  return {
    hot: hotGames.slice(0, balancedCount),
    cold: coldGames.slice(0, balancedCount),
  }
}
