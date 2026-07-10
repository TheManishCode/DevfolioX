/**
 * fetch() with a hard timeout. Several external API integrations (LeetCode,
 * MyAnimeList, Duolingo, WakaTime) hang instead of erroring when the upstream
 * is slow, which without a timeout stalls the whole API route.
 */
export async function fetchWithTimeout(
    url: string,
    init: RequestInit = {},
    timeoutMs = 8000
): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}
