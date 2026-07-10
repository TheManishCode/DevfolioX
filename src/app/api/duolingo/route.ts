import { NextResponse } from 'next/server';
import { getDuolingoStats } from '@/lib/duolingo/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// Force dynamic rendering - real-time data
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function GET(request: Request) {
    const { allowed, retryAfterSeconds } = rateLimit(`duolingo:${getClientIp(request)}`, 30, 60_000);
    if (!allowed) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
        );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || process.env.DUOLINGO_USERNAME;

    if (!username) {
        return NextResponse.json(
            { error: 'Duolingo username not configured' },
            { status: 400 }
        );
    }

    try {
        const stats = await getDuolingoStats(username);

        if (!stats) {
            return NextResponse.json(
                { error: 'User not found or API unavailable' },
                { status: 404 }
            );
        }

        // No caching - always fresh data
        return NextResponse.json(stats, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Duolingo API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Duolingo data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
