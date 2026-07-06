/**
 * =============================================================================
 * WAKATIME API INTEGRATION
 * =============================================================================
 * Fetches coding activity statistics from WakaTime.
 * Requires API key from wakatime.com/settings/api-key
 * =============================================================================
 */

const WAKATIME_API_BASE = 'https://wakatime.com/api/v1';

export interface WakaTimeStats {
    totalSeconds: number;
    totalHoursFormatted: string;
    dailyAverage: number;
    dailyAverageFormatted: string;
    languages: { name: string; percent: number; hours: string; color: string }[];
    editors: { name: string; percent: number; hours: string }[];
    projects: { name: string; percent: number; hours: string }[];
    bestDay: { date: string; totalSeconds: number };
}

// Language colors for WakaTime
const WAKATIME_LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3776ab',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    CSS: '#563d7c',
    HTML: '#e34c26',
    JSON: '#292929',
    Markdown: '#083fa1',
    YAML: '#cb171e',
    Bash: '#89e051',
    SQL: '#e38c00',
    Docker: '#384d54',
};

/**
 * Format seconds to human readable string
 */
function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Get WakaTime stats for the last 7 days
 */
export async function getWakaTimeStats(apiKey: string): Promise<WakaTimeStats | null> {
    try {
        // WakaTime's API only accepts HTTP Basic Auth with the base64-encoded
        // key, regardless of key format/prefix.
        const authHeader = `Basic ${Buffer.from(apiKey).toString('base64')}`;

        const response = await fetch(`${WAKATIME_API_BASE}/users/current/stats/last_7_days`, {
            headers: {
                'Authorization': authHeader,
            },
            cache: 'no-store' // Disable cache for fresh data
        });

        if (!response.ok) {
            console.error(`WakaTime API error: ${response.status}`);
            return null;
        }

        const { data } = await response.json();

        return {
            totalSeconds: data.total_seconds || 0,
            totalHoursFormatted: formatTime(data.total_seconds || 0),
            dailyAverage: data.daily_average || 0,
            dailyAverageFormatted: formatTime(data.daily_average || 0),
            languages: (data.languages || []).slice(0, 6).map((lang: { name: string; percent: number; total_seconds: number }) => ({
                name: lang.name,
                percent: Math.round(lang.percent * 10) / 10,
                hours: formatTime(lang.total_seconds),
                color: WAKATIME_LANGUAGE_COLORS[lang.name] || '#6b7280',
            })),
            editors: (data.editors || []).slice(0, 4).map((editor: { name: string; percent: number; total_seconds: number }) => ({
                name: editor.name,
                percent: Math.round(editor.percent * 10) / 10,
                hours: formatTime(editor.total_seconds),
            })),
            projects: (data.projects || []).slice(0, 5).map((project: { name: string; percent: number; total_seconds: number }) => ({
                name: project.name,
                percent: Math.round(project.percent * 10) / 10,
                hours: formatTime(project.total_seconds),
            })),
            bestDay: data.best_day ? {
                date: data.best_day.date,
                totalSeconds: data.best_day.total_seconds,
            } : { date: '', totalSeconds: 0 },
        };
    } catch (error) {
        console.error('Failed to fetch WakaTime stats:', error);
        return null;
    }
}

/**
 * Get today's coding activity
 */
export async function getWakaTimeToday(apiKey: string): Promise<{ totalSeconds: number; formatted: string } | null> {
    try {
        const authHeader = `Basic ${Buffer.from(apiKey).toString('base64')}`;
        const today = new Date().toISOString().split('T')[0];

        const response = await fetch(`${WAKATIME_API_BASE}/users/current/summaries?start=${today}&end=${today}`, {
            headers: {
                'Authorization': authHeader,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        const { data } = await response.json();
        const totalSeconds = data[0]?.grand_total?.total_seconds || 0;

        return {
            totalSeconds,
            formatted: formatTime(totalSeconds),
        };
    } catch (error) {
        console.error('Failed to fetch WakaTime today:', error);
        return null;
    }
}
