/**
 * =============================================================================
 * LEETCODE API INTEGRATION
 * =============================================================================
 * Fetches LeetCode statistics using leetcode-api-faisalshohag.
 * =============================================================================
 */

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

const LEETCODE_API_BASE = 'https://leetcode-api-faisalshohag.vercel.app';

export interface LeetCodeStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    acceptanceRate: number;
    contributionPoints: number;
    reputation: number;
}

export interface LeetCodeProfile {
    username: string;
    name: string;
    avatar: string;
    ranking: number;
}

type LeetCodeResult = { profile: LeetCodeProfile | null; stats: LeetCodeStats | null };

// Last successful response, served if a fresh fetch fails — a momentary
// upstream hiccup shouldn't flip the dashboard to "unavailable".
let lastGood: LeetCodeResult | null = null;

/**
 * Fetch all LeetCode data for a user. Retries once on failure, then falls
 * back to the last successful response rather than surfacing an error.
 */
export async function getLeetCodeData(username: string): Promise<LeetCodeResult> {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await fetchWithTimeout(`${LEETCODE_API_BASE}/${username}`, {
                next: { revalidate: 3600 },
            });

            if (!response.ok) {
                console.error(`LeetCode API error: ${response.status} (attempt ${attempt + 1})`);
                continue;
            }

            const data = await response.json();

            const result: LeetCodeResult = {
                profile: {
                    username: username,
                    name: data.name || '',
                    avatar: data.avatar || '',
                    ranking: data.ranking || 0,
                },
                stats: {
                    totalSolved: data.totalSolved || 0,
                    easySolved: data.easySolved || 0,
                    mediumSolved: data.mediumSolved || 0,
                    hardSolved: data.hardSolved || 0,
                    ranking: data.ranking || 0,
                    acceptanceRate: parseFloat(data.acceptanceRate) || 0,
                    contributionPoints: data.contributionPoints || 0,
                    reputation: data.reputation || 0,
                },
            };

            lastGood = result;
            return result;
        } catch (error) {
            console.error(`Failed to fetch LeetCode data (attempt ${attempt + 1}):`, error);
        }
    }

    return lastGood ?? { profile: null, stats: null };
}
