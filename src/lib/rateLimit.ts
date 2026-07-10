/**
 * Lightweight in-memory rate limiter for public read-only API proxy routes.
 * Best-effort per server instance — on serverless deploys with multiple
 * instances/cold starts this doesn't share state, but it still meaningfully
 * caps abuse against a single hot instance without adding external infra.
 */

const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
    key: string,
    limit: number,
    windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || now > bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, retryAfterSeconds: 0 }
    }

    if (bucket.count >= limit) {
        return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
    }

    bucket.count++
    return { allowed: true, retryAfterSeconds: 0 }
}

export function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) return forwardedFor.split(",")[0].trim()
    return request.headers.get("x-real-ip") ?? "unknown"
}
