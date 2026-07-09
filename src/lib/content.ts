/**
 * Loads JSON content from the R2 public bucket (NEXT_PUBLIC_R2_PUBLIC_URL/data/<name>.json)
 * when configured, falling back to the locally bundled copy if R2 is unset,
 * unreachable, or missing that file. Lets each data file be edited via R2
 * without a redeploy, while keeping the repo copy as the safety net.
 */
export async function getContent<T>(name: string, fallback: T): Promise<T> {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    if (!base) return fallback

    try {
        const res = await fetch(`${base}/data/${name}.json`, { next: { revalidate: 3600 } })
        if (!res.ok) return fallback
        return (await res.json()) as T
    } catch {
        return fallback
    }
}
