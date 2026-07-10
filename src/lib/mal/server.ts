/**
 * MyAnimeList API Integration
 * Uses MAL API v2 with Client ID authentication
 */

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

// Types for MAL API responses
export interface MALAnime {
    id: number;
    title: string;
    main_picture?: {
        medium: string;
        large: string;
    };
    alternative_titles?: {
        synonyms?: string[];
        en?: string;
        ja?: string;
    };
    start_date?: string;
    end_date?: string;
    mean?: number;
    status?: string;
    genres?: { id: number; name: string }[];
    num_episodes?: number;
    studios?: { id: number; name: string }[];
    my_list_status?: {
        status: string;
        score: number;
        num_episodes_watched: number;
        is_rewatching: boolean;
        updated_at: string;
    };
}

export interface MALAnimeListResponse {
    data: {
        node: MALAnime;
        list_status: {
            status: string;
            score: number;
            num_episodes_watched: number;
            is_rewatching: boolean;
            updated_at: string;
        };
    }[];
    paging?: {
        next?: string;
    };
}

// Transformed anime type for our components
export interface TransformedAnime {
    id: number;
    title: string;
    title_jp?: string;
    image: string;
    rating: number;
    status: string;
    genres: string[];
    year: number;
    studio: string;
    episodes: number;
    episodesWatched: number;
    malUrl: string;
}

const MAL_API_BASE = 'https://api.myanimelist.net/v2';

// Last successful response per status, served if a fresh fetch fails — a
// momentary upstream hiccup shouldn't flip the dashboard to empty lists.
const lastGoodByStatus = new Map<string, MALAnimeListResponse>();

/**
 * Fetch anime list from MAL API. Retries once on failure, then falls back
 * to the last successful response for that status rather than throwing.
 */
async function fetchMALAnimeList(
    username: string,
    clientId: string,
    status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch',
    limit: number = 100
): Promise<MALAnimeListResponse> {
    const fields = 'id,title,main_picture,alternative_titles,start_date,mean,status,genres,num_episodes,studios,list_status';
    const url = `${MAL_API_BASE}/users/${username}/animelist?status=${status}&limit=${limit}&fields=${fields}`;

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await fetchWithTimeout(url, {
                headers: { 'X-MAL-CLIENT-ID': clientId },
                cache: 'no-store', // Disable caching to always get fresh data
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`MAL API error response (attempt ${attempt + 1}):`, errorText);
                continue;
            }

            const data: MALAnimeListResponse = await response.json();
            lastGoodByStatus.set(status, data);
            return data;
        } catch (error) {
            console.error(`Failed to fetch MAL animelist (attempt ${attempt + 1}):`, error);
        }
    }

    return lastGoodByStatus.get(status) ?? { data: [] };
}

/**
 * Transform MAL anime data to our component format
 */
function transformAnime(data: MALAnimeListResponse['data'][0]): TransformedAnime {
    const anime = data.node;
    const listStatus = data.list_status;

    return {
        id: anime.id,
        title: anime.title,
        title_jp: anime.alternative_titles?.ja,
        image: anime.main_picture?.large || anime.main_picture?.medium || '',
        rating: listStatus.score || anime.mean || 0,
        status: listStatus.status === 'completed' ? 'Completed' :
            listStatus.status === 'watching' ? 'Watching' :
                listStatus.status,
        genres: anime.genres?.map(g => g.name) || [],
        year: anime.start_date ? parseInt(anime.start_date.split('-')[0]) : 0,
        studio: anime.studios?.[0]?.name || 'Unknown',
        episodes: anime.num_episodes || 0,
        episodesWatched: listStatus.num_episodes_watched,
        malUrl: `https://myanimelist.net/anime/${anime.id}`,
    };
}

/**
 * Get completed anime list
 */
export async function getCompletedAnime(username: string, clientId: string): Promise<TransformedAnime[]> {
    try {
        const response = await fetchMALAnimeList(username, clientId, 'completed', 300);
        return response.data.map(transformAnime);
    } catch (error) {
        console.error('Failed to fetch completed anime:', error);
        return [];
    }
}

/**
 * Get currently watching anime list
 */
export async function getWatchingAnime(username: string, clientId: string): Promise<TransformedAnime[]> {
    try {
        const response = await fetchMALAnimeList(username, clientId, 'watching', 50);
        return response.data.map(transformAnime);
    } catch (error) {
        console.error('Failed to fetch watching anime:', error);
        return [];
    }
}

// User stats interface
export interface MALUserStats {
    totalWatched: number;
    episodesWatched: number;
    daysWatched: number;
    meanScore: number;
    watching: number;
    planToWatch: number;
}

/**
 * Get user anime statistics by calculating from anime lists
 */
export async function getAnimeStats(username: string, clientId: string): Promise<MALUserStats> {
    try {
        // Fetch completed anime to calculate stats
        const completedResponse = await fetchMALAnimeList(username, clientId, 'completed', 300);
        const watchingResponse = await fetchMALAnimeList(username, clientId, 'watching', 50);

        // Calculate stats
        const completedAnime = completedResponse.data || [];
        const watchingAnime = watchingResponse.data || [];

        let totalEpisodes = 0;
        let totalScore = 0;
        let scoredCount = 0;

        // Calculate from completed
        for (const item of completedAnime) {
            totalEpisodes += item.list_status.num_episodes_watched;
            if (item.list_status.score > 0) {
                totalScore += item.list_status.score;
                scoredCount++;
            }
        }

        // Add watching episodes  
        for (const item of watchingAnime) {
            totalEpisodes += item.list_status.num_episodes_watched;
            if (item.list_status.score > 0) {
                totalScore += item.list_status.score;
                scoredCount++;
            }
        }

        // Average episode is ~24 minutes = 0.016667 days
        const daysWatched = Math.round((totalEpisodes * 24 / 60 / 24) * 10) / 10;
        const meanScore = scoredCount > 0 ? Math.round((totalScore / scoredCount) * 10) / 10 : 0;

        return {
            totalWatched: completedAnime.length,
            episodesWatched: totalEpisodes,
            daysWatched,
            meanScore,
            watching: watchingAnime.length,
            planToWatch: 0 // Could fetch separately if needed
        };
    } catch (error) {
        console.error('Failed to fetch anime stats:', error);
        return {
            totalWatched: 0,
            episodesWatched: 0,
            daysWatched: 0,
            meanScore: 0,
            watching: 0,
            planToWatch: 0
        };
    }
}
