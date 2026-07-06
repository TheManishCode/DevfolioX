import { NextResponse } from 'next/server';
import { getWakaTimeStats, getWakaTimeToday } from '@/lib/wakatime/server';

/**
 * CACHING: 5 minute ISR - WakaTime data updates hourly at most
 */
export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(request: Request) {
    const apiKey = process.env.WAKATIME_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'WakaTime API key not configured' },
            { status: 400 }
        );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';

    try {
        if (type === 'today') {
            const today = await getWakaTimeToday(apiKey);
            if (!today) {
                return NextResponse.json(
                    { error: 'Failed to fetch WakaTime data' },
                    { status: 502 }
                );
            }
            return NextResponse.json(today);
        }

        const stats = await getWakaTimeStats(apiKey);
        if (!stats) {
            return NextResponse.json(
                { error: 'Failed to fetch WakaTime data' },
                { status: 502 }
            );
        }
        return NextResponse.json(stats);
    } catch (error) {
        console.error('WakaTime API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch WakaTime data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
