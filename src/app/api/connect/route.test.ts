import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { NextRequest } from "next/server"

vi.mock("@/lib/prisma", () => ({
    prisma: {
        connectionRequest: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    },
}))

vi.mock("next-auth/jwt", () => ({
    getToken: vi.fn(),
}))

import { POST } from "./route"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"

const mockedGetToken = vi.mocked(getToken)
const mockedPrisma = vi.mocked(prisma, true)

function makeRequest(): NextRequest {
    return {} as unknown as NextRequest
}

describe("POST /api/connect", () => {
    const originalWebhook = process.env.DISCORD_WEBHOOK_URL

    beforeEach(() => {
        vi.clearAllMocks()
        delete process.env.DISCORD_WEBHOOK_URL
    })

    afterEach(() => {
        process.env.DISCORD_WEBHOOK_URL = originalWebhook
    })

    it("rejects unauthenticated requests", async () => {
        mockedGetToken.mockResolvedValue(null)

        const res = await POST(makeRequest())

        expect(res.status).toBe(401)
        expect(mockedPrisma.connectionRequest.create).not.toHaveBeenCalled()
    })

    it("creates a connection request for a first-time sign-in today", async () => {
        mockedGetToken.mockResolvedValue({
            email: "a@b.com",
            name: "A",
            provider: "github",
            picture: null,
        } as never)
        mockedPrisma.connectionRequest.findFirst.mockResolvedValue(null)

        const res = await POST(makeRequest())
        const body = await res.json()

        expect(mockedPrisma.connectionRequest.create).toHaveBeenCalledWith({
            data: { name: "A", email: "a@b.com", image: null, provider: "github" },
        })
        expect(body).toEqual({ ok: true })
    })

    it("does not duplicate a connection request within 24 hours", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)
        mockedPrisma.connectionRequest.findFirst.mockResolvedValue({ id: "existing" } as never)

        const res = await POST(makeRequest())

        expect(mockedPrisma.connectionRequest.create).not.toHaveBeenCalled()
        expect(res.status).toBe(200)
    })

    it("returns 503 when the database write fails", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)
        mockedPrisma.connectionRequest.findFirst.mockRejectedValue(new Error("no connection"))

        const res = await POST(makeRequest())

        expect(res.status).toBe(503)
    })
})
