/**
 * =============================================================================
 * DUOLINGO API INTEGRATION
 * =============================================================================
 * Fetches Duolingo learning statistics using the public user endpoint.
 * Uses server-side fetch to bypass CORS restrictions.
 * =============================================================================
 */

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

export interface DuolingoStats {
    username: string;
    streak: number;
    totalXp: number;
    currentLanguage: string;
    languages: { name: string; level: number; xp: number }[];
    dailyGoal: number;
    streakExtendedToday: boolean;
}

// Last successful response, served if every fetch attempt fails — a
// momentary upstream hiccup shouldn't flip the dashboard to "unavailable".
let lastGoodStats: DuolingoStats | null = null;

/**
 * Fetch Duolingo user stats from the public API
 * Server-side only - bypasses CORS issues in production
 */
export async function getDuolingoStats(username: string): Promise<DuolingoStats | null> {
    try {
        // Primary endpoint - direct user lookup
        const primaryUrl = `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(username)}`;

        const response = await fetchWithTimeout(primaryUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Cache-Control': 'no-cache',
            },
            // Disable Next.js caching to ensure fresh data and avoid stale responses
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Duolingo API error: ${response.status} ${response.statusText}`);

            // Try fallback endpoint format
            return await tryFallbackEndpoint(username);
        }

        const data = await response.json();
        const user = data.users?.[0];

        if (!user) {
            console.error('Duolingo: No user data in response');
            return await tryFallbackEndpoint(username);
        }

        const stats = parseUserData(user, username);
        lastGoodStats = stats;
        return stats;
    } catch (error) {
        console.error('Failed to fetch Duolingo stats:', error);
        return await tryFallbackEndpoint(username);
    }
}

/**
 * Fallback endpoint using the direct user ID lookup
 */
async function tryFallbackEndpoint(username: string): Promise<DuolingoStats | null> {
    try {
        // Alternative: Try the profile endpoint
        const fallbackUrl = `https://www.duolingo.com/users/${encodeURIComponent(username)}`;

        const response = await fetchWithTimeout(fallbackUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Duolingo fallback API error: ${response.status}`);
            return lastGoodStats;
        }

        const user = await response.json();
        const stats = parseUserData(user, username);
        lastGoodStats = stats;
        return stats;
    } catch (error) {
        console.error('Duolingo fallback failed:', error);
        return lastGoodStats;
    }
}

/**
 * Parse user data from Duolingo API response
 */
function parseUserData(user: any, username: string): DuolingoStats {
    // Extract language courses
    const languages = (user.courses || []).map((course: {
        title: string;
        learningLanguage?: string;
        level?: number;
        crowns?: number;
        xp: number;
    }) => ({
        name: course.title || course.learningLanguage || 'Unknown',
        level: course.level || course.crowns || 0,
        xp: course.xp || 0,
    }));

    // Get current streak
    const streak = user.streak || 
                   user.streakData?.currentStreak?.length || 
                   user.site_streak || 
                   0;

    // Get total XP
    const totalXp = user.totalXp || 
                    user.xp || 
                    languages.reduce((sum: number, l: { xp: number }) => sum + l.xp, 0);

    // Get current language being learned
    const currentLanguage = user.currentCourse?.title || 
                           user.learningLanguage ||
                           user.currentCourse?.learningLanguage ||
                           languages[0]?.name || 
                           '';

    // Check if streak was extended today
    const today = new Date().toISOString().split('T')[0];
    const streakExtendedToday = user.streakData?.currentStreak?.endDate === today ||
                                user.streakExtendedToday ||
                                false;

    return {
        username: user.username || username,
        streak,
        totalXp,
        currentLanguage,
        languages,
        dailyGoal: user.xpGoal || user.dailyGoal || 10,
        streakExtendedToday,
    };
}
