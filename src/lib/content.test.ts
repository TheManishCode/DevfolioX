import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getContent } from "./content"

const ORIGINAL_ENV = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

describe("getContent", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL = ORIGINAL_ENV
    })

    it("returns the fallback when R2 is not configured", async () => {
        delete process.env.NEXT_PUBLIC_R2_PUBLIC_URL
        const fallback = { hello: "world" }
        await expect(getContent("hero", fallback)).resolves.toEqual(fallback)
    })

    it("returns the fallback when the R2 fetch fails", async () => {
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL = "https://cdn.example.com"
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")))
        const fallback = { hello: "world" }
        await expect(getContent("hero", fallback)).resolves.toEqual(fallback)
    })

    it("returns the fallback when R2 responds with a non-ok status", async () => {
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL = "https://cdn.example.com"
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
        const fallback = { hello: "world" }
        await expect(getContent("hero", fallback)).resolves.toEqual(fallback)
    })

    it("returns the R2 payload when the fetch succeeds", async () => {
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL = "https://cdn.example.com"
        const remoteData = { hello: "from-r2" }
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => remoteData }))
        await expect(getContent("hero", { hello: "world" })).resolves.toEqual(remoteData)
    })
})
