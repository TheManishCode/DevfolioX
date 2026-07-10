import { afterEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "./route"

let ipCounter = 0
function nextIp(): string {
    ipCounter += 1
    return `10.0.0.${ipCounter}`
}

function makeRequest(url: string | null, ip = nextIp()): NextRequest {
    const target = new URL("http://localhost/api/snake")
    if (url !== null) target.searchParams.set("url", url)
    return new NextRequest(target, { headers: { "x-forwarded-for": ip } })
}

describe("GET /api/snake", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("rejects a missing url parameter", async () => {
        const res = await GET(makeRequest(null))
        expect(res.status).toBe(400)
    })

    it("rejects an unparsable url", async () => {
        const res = await GET(makeRequest("not-a-url"))
        expect(res.status).toBe(400)
    })

    it("rejects a host outside the allowlist", async () => {
        const res = await GET(makeRequest("https://evil.example.com/x.svg"))
        expect(res.status).toBe(400)
    })

    it("rejects a non-https protocol even for an allowlisted host", async () => {
        const res = await GET(makeRequest("http://raw.githubusercontent.com/x.svg"))
        expect(res.status).toBe(400)
    })

    it("fetches and transparentizes an allowlisted svg", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                headers: { get: () => "image/svg+xml" },
                text: async () => '<rect class="background" fill="#0D1117"/><rect fill="#0D1117"/>',
            })
        )

        const res = await GET(makeRequest("https://raw.githubusercontent.com/x/y/graph.svg"))
        const body = await res.text()

        expect(res.status).toBe(200)
        expect(body).not.toContain("#0D1117")
        expect(body).not.toContain('class="background"')
    })

    it("enforces per-IP rate limiting", async () => {
        const ip = nextIp()
        for (let i = 0; i < 30; i++) {
            const res = await GET(makeRequest(null, ip))
            expect(res.status).toBe(400)
        }
        const blocked = await GET(makeRequest(null, ip))
        expect(blocked.status).toBe(429)
        expect(blocked.headers.get("Retry-After")).toBeTruthy()
    })
})
