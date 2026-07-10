import { getCompletedAnime, getWatchingAnime, getAnimeStats } from '@/lib/mal/server';
import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * MAL API Route - Force dynamic rendering for real-time data
 */
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function GET(request: Request) {
    const { allowed, retryAfterSeconds } = rateLimit(`mal:${getClientIp(request)}`, 30, 60_000);
    if (!allowed) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
        );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'completed';

    const clientId = process.env.MAL_CLIENT_ID;
    const username = process.env.MAL_USERNAME;

    if (!clientId || !username) {
        console.error('MAL credentials missing - clientId:', !!clientId, 'username:', !!username);
        return NextResponse.json(
            { error: 'MAL credentials not configured' },
            { status: 500 }
        );
    }

    try {
        let data;
        if (type === 'watching') {
            data = await getWatchingAnime(username, clientId);
        } else if (type === 'stats') {
            data = await getAnimeStats(username, clientId);
        } else {
            data = await getCompletedAnime(username, clientId);
        }

        // No caching - always fresh data
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('MAL API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch anime data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
