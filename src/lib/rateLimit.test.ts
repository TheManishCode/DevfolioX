import { describe, expect, it } from "vitest"
import { rateLimit } from "./rateLimit"

describe("rateLimit", () => {
    it("allows requests under the limit", () => {
        const key = `test-${Math.random()}`
        for (let i = 0; i < 3; i++) {
            expect(rateLimit(key, 3, 60_000).allowed).toBe(true)
        }
    })

    it("blocks requests once the limit is exceeded", () => {
        const key = `test-${Math.random()}`
        rateLimit(key, 2, 60_000)
        rateLimit(key, 2, 60_000)
        const result = rateLimit(key, 2, 60_000)
        expect(result.allowed).toBe(false)
        expect(result.retryAfterSeconds).toBeGreaterThan(0)
    })

    it("tracks separate keys independently", () => {
        const keyA = `test-a-${Math.random()}`
        const keyB = `test-b-${Math.random()}`
        rateLimit(keyA, 1, 60_000)
        expect(rateLimit(keyA, 1, 60_000).allowed).toBe(false)
        expect(rateLimit(keyB, 1, 60_000).allowed).toBe(true)
    })
})
