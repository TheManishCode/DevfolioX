import { NextResponse } from 'next/server';
import { getLeetCodeData } from '@/lib/leetcode/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * CACHING: 10 minute ISR - LeetCode stats change slowly
 */
export const dynamic = 'force-dynamic';
export const revalidate = 600;

export async function GET(request: Request) {
    const { allowed, retryAfterSeconds } = rateLimit(`leetcode:${getClientIp(request)}`, 30, 60_000);
    if (!allowed) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
        );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || process.env.LEETCODE_USERNAME;

    if (!username) {
        return NextResponse.json(
            { error: 'LeetCode username not configured' },
            { status: 400 }
        );
    }

    try {
        const data = await getLeetCodeData(username);
        if (!data.profile && !data.stats) {
            return NextResponse.json(
                { error: 'Failed to fetch LeetCode data' },
                { status: 502 }
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('LeetCode API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch LeetCode data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
