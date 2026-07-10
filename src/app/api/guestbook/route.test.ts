import { beforeEach, describe, expect, it, vi } from "vitest"
import type { NextRequest } from "next/server"

vi.mock("@/lib/prisma", () => ({
    prisma: {
        guestbookEntry: {
            deleteMany: vi.fn(),
            findMany: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    },
}))

vi.mock("next-auth/jwt", () => ({
    getToken: vi.fn(),
}))

import { GET, POST, DELETE } from "./route"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"

const mockedGetToken = vi.mocked(getToken)
const mockedPrisma = vi.mocked(prisma, true)

function makeRequest(body: unknown): NextRequest {
    return {
        json: async () => body,
    } as unknown as NextRequest
}

describe("GET /api/guestbook", () => {
    beforeEach(() => vi.clearAllMocks())

    it("purges expired test entries then returns all entries", async () => {
        mockedPrisma.guestbookEntry.findMany.mockResolvedValue([{ id: "1" }] as never)

        const res = await GET()

        expect(mockedPrisma.guestbookEntry.deleteMany).toHaveBeenCalledWith({
            where: { isTest: true, expiresAt: { lt: expect.any(Date) } },
        })
        expect(res.status).toBe(200)
    })

    it("returns 503 when the database is unavailable", async () => {
        mockedPrisma.guestbookEntry.deleteMany.mockRejectedValue(new Error("no connection"))

        const res = await GET()

        expect(res.status).toBe(503)
    })
})

describe("POST /api/guestbook", () => {
    beforeEach(() => vi.clearAllMocks())

    it("rejects unauthenticated requests", async () => {
        mockedGetToken.mockResolvedValue(null)

        const res = await POST(makeRequest({ message: "hi" }))

        expect(res.status).toBe(401)
        expect(mockedPrisma.guestbookEntry.create).not.toHaveBeenCalled()
    })

    it("rejects an empty message", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)

        const res = await POST(makeRequest({ message: "   " }))

        expect(res.status).toBe(400)
    })

    it("rejects a message over the length cap", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)

        const res = await POST(makeRequest({ message: "x".repeat(201) }))

        expect(res.status).toBe(400)
    })

    it("blocks a second non-test post within 24 hours", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)
        mockedPrisma.guestbookEntry.findFirst.mockResolvedValue({ id: "existing" } as never)

        const res = await POST(makeRequest({ message: "hello again" }))

        expect(res.status).toBe(429)
        expect(mockedPrisma.guestbookEntry.create).not.toHaveBeenCalled()
    })

    it("creates an entry with the message HTML-escaped, & before < / >", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com", name: "A", provider: "github" } as never)
        mockedPrisma.guestbookEntry.findFirst.mockResolvedValue(null)
        mockedPrisma.guestbookEntry.create.mockResolvedValue({ id: "new" } as never)

        const res = await POST(makeRequest({ message: "<b>hi & bye</b>" }))

        expect(res.status).toBe(201)
        const createArgs = mockedPrisma.guestbookEntry.create.mock.calls[0][0] as {
            data: { message: string }
        }
        expect(createArgs.data.message).toBe("&lt;b&gt;hi &amp; bye&lt;/b&gt;")
    })

    it("skips the 24h rate limit for [test]: prefixed messages", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)
        mockedPrisma.guestbookEntry.create.mockResolvedValue({ id: "new" } as never)

        const res = await POST(makeRequest({ message: "[test]: ping" }))

        expect(mockedPrisma.guestbookEntry.findFirst).not.toHaveBeenCalled()
        expect(res.status).toBe(201)
    })
})

describe("DELETE /api/guestbook", () => {
    beforeEach(() => vi.clearAllMocks())

    it("rejects unauthenticated requests", async () => {
        mockedGetToken.mockResolvedValue(null)

        const res = await DELETE(makeRequest({}))

        expect(res.status).toBe(401)
    })

    it("deletes only the caller's own test entries", async () => {
        mockedGetToken.mockResolvedValue({ email: "a@b.com" } as never)
        mockedPrisma.guestbookEntry.deleteMany.mockResolvedValue({ count: 2 } as never)

        const res = await DELETE(makeRequest({}))
        const body = await res.json()

        expect(mockedPrisma.guestbookEntry.deleteMany).toHaveBeenCalledWith({
            where: { email: "a@b.com", isTest: true },
        })
        expect(body).toEqual({ deleted: 2 })
    })
})
