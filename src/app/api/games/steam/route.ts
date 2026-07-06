import { NextRequest, NextResponse } from "next/server"

interface SteamOwnedGame {
  appid: number
  name: string
  playtime_forever: number
  playtime_2weeks?: number
  img_icon_url: string
  img_logo_url: string
  has_community_visible_stats: boolean
}

interface SteamRecentGame {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  img_logo_url: string
}

interface SteamGameItem {
  id: string
  appid: number
  title: string
  image: string | null
  playtimeHours: number
}

interface StatsData {
  totalHours: number
  totalGames: number
  achievementsUnlocked: number
  level: number
}

interface ApiResponse {
  stats: StatsData
  playingNow: SteamGameItem[]
  favoriteGames: SteamGameItem[]
  platforms: Array<{ name: string; count: number }>
}

async function getSteamUserStats(steamId: string, apiKey: string): Promise<{ level: number; achievements: number }> {
  try {
    // Get player level
    const levelRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?steamid=${steamId}&key=${apiKey}`
    )
    const levelData = await levelRes.json()
    const level = levelData.response?.player_level || 0

    // Get achievements is harder without app context, return 0 as placeholder
    // To properly count achievements, we'd need to iterate through all apps
    // For now, return estimated based on heuristics
    return { level, achievements: 0 }
  } catch (error) {
    console.error("[Steam] Error fetching user stats:", error)
    return { level: 0, achievements: 0 }
  }
}

async function getSteamGameInfo(appId: number): Promise<{ genres: string[] | null; year: number | null }> {
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=en`)
    const data = await res.json()

    if (!data[appId]?.success || !data[appId]?.data) {
      return { genres: null, year: null }
    }

    const gameData = data[appId].data
    const genres = gameData.genres?.map((g: any) => g.description) || []
    const year = gameData.release_date?.date
      ? parseInt(gameData.release_date.date.split(" ").pop() || "2020")
      : 2020

    return { genres: genres.slice(0, 3), year }
  } catch (error) {
    console.error(`[Steam] Error fetching app ${appId}:`, error)
    return { genres: null, year: null }
  }
}

function getImageUrl(game: SteamOwnedGame | SteamRecentGame): string | null {
  // Try logo first (wider), fall back to icon
  if (game.img_logo_url) {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
  }
  if (game.img_icon_url) {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
  }
  return null
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.STEAM_API_KEY
  const steamId = process.env.STEAM_ID

  if (!apiKey || !steamId) {
    return NextResponse.json(
      {
        error: "Missing STEAM_API_KEY or STEAM_ID environment variables",
        stats: { totalGames: 0, hoursPlayed: 0, achievementsUnlocked: 0, level: 0 },
        playingNow: [],
        favoriteGames: [],
        platforms: [{ name: "Steam", count: 0 }],
      },
      { status: 400 }
    )
  }

  try {
    // Fetch owned games
    const ownedRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=${steamId}&key=${apiKey}&include_appinfo=true&include_played_free_games=true`
    )
    const ownedData = await ownedRes.json()

    if (!ownedData.response?.games) {
      return NextResponse.json(
        {
          stats: { totalGames: 0, totalHours: 0, achievementsUnlocked: 0, level: 0 },
          playingNow: [],
          favoriteGames: [],
          platforms: [{ name: "Steam", count: 0 }],
        },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
      )
    }

    const allGames: SteamOwnedGame[] = ownedData.response.games

    // Fetch recently played games and user stats — independent of each other
    const [recentRes, { level, achievements }] = await Promise.all([
      fetch(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?steamid=${steamId}&key=${apiKey}&count=10`
      ),
      getSteamUserStats(steamId, apiKey),
    ])
    const recentData = await recentRes.json()
    const recentGames: SteamRecentGame[] = recentData.response?.games || []

    // Calculate stats
    const totalGames = allGames.length
    const totalHours = Math.round(
      allGames.reduce((sum, game) => sum + (game.playtime_forever || 0), 0) / 60
    )

    // Build favorite games (top by playtime) - top 20
    const favoriteGames: SteamGameItem[] = allGames
      .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
      .slice(0, 20)
      .map((game) => ({
        id: `steam-${game.appid}`,
        appid: game.appid,
        title: game.name,
        image: getImageUrl(game),
        playtimeHours: Math.round((game.playtime_forever || 0) / 60),
      }))

    // Build playing now (recently played)
    const playingNow: SteamGameItem[] = recentGames.slice(0, 5).map((game) => ({
      id: `steam-${game.appid}`,
      appid: game.appid,
      title: game.name,
      image: getImageUrl(game),
      playtimeHours: Math.round((game.playtime_forever || 0) / 60),
    }))

    // Platform breakdown
    const platforms = [{ name: "Steam", count: totalGames }]

    const response: ApiResponse = {
      stats: {
        totalHours,
        totalGames,
        achievementsUnlocked: achievements,
        level,
      },
      playingNow,
      favoriteGames,
      platforms,
    }

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    })
  } catch (error) {
    console.error("[Steam API] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Steam data",
        stats: { totalGames: 0, totalHours: 0, achievementsUnlocked: 0, level: 0 },
        playingNow: [],
        favoriteGames: [],
        platforms: [{ name: "Steam", count: 0 }],
      },
      { status: 500 }
    )
  }
}
