import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const MESSAGE_MAX_LEN = 200
const TEST_PREFIX = /^\[test\]:/i
const TEST_TTL_MS = 5 * 60 * 1000 // 5 minutes

function sanitize(input: string): string {
    return input
        .trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .slice(0, MESSAGE_MAX_LEN)
}

async function purgeExpiredTestEntries() {
    await prisma.guestbookEntry.deleteMany({
        where: {
            isTest: true,
            expiresAt: { lt: new Date() },
        },
    })
}

export async function GET() {
    try {
        // Clean up any expired test entries on every read
        await purgeExpiredTestEntries()

        const entries = await prisma.guestbookEntry.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                message: true,
                image: true,
                provider: true,
                isTest: true,
                expiresAt: true,
                createdAt: true,
            },
        })
        return Response.json(entries)
    } catch {
        return Response.json(
            { error: "Database unavailable. Please add DATABASE_URL to your environment." },
            { status: 503 }
        )
    }
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    if (!token || !token.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: { message?: string }
    try {
        body = await req.json()
    } catch {
        return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const rawMessage = body.message ?? ""
    if (!rawMessage.trim()) {
        return Response.json({ error: "Message is required" }, { status: 400 })
    }
    if (rawMessage.trim().length > MESSAGE_MAX_LEN) {
        return Response.json({ error: `Message must be under ${MESSAGE_MAX_LEN} characters` }, { status: 400 })
    }

    const isTest = TEST_PREFIX.test(rawMessage.trim())

    try {
        // Rate limit: 1 entry per 24h per email — skip for test entries
        if (!isTest) {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            const recent = await prisma.guestbookEntry.findFirst({
                where: {
                    email: token.email,
                    isTest: false,
                    createdAt: { gte: oneDayAgo },
                },
            })
            if (recent) {
                return Response.json(
                    { error: "You have already signed the guestbook in the last 24 hours" },
                    { status: 429 }
                )
            }
        }

        const expiresAt = isTest ? new Date(Date.now() + TEST_TTL_MS) : null

        const entry = await prisma.guestbookEntry.create({
            data: {
                name: (token.name as string) || "Anonymous",
                email: token.email,
                message: sanitize(rawMessage),
                image: (token.picture as string) || null,
                provider: (token.provider as string) || "OAuth",
                isTest,
                expiresAt,
            },
            select: {
                id: true,
                name: true,
                message: true,
                image: true,
                provider: true,
                isTest: true,
                expiresAt: true,
                createdAt: true,
            },
        })

        return Response.json(entry, { status: 201 })
    } catch {
        return Response.json(
            { error: "Database unavailable. Please add DATABASE_URL to your environment." },
            { status: 503 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    const token = await getToken({ req })
    if (!token || !token.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow users to delete only their own test entries
    try {
        const result = await prisma.guestbookEntry.deleteMany({
            where: {
                email: token.email,
                isTest: true,
            },
        })
        return Response.json({ deleted: result.count })
    } catch {
        return Response.json({ error: "Database unavailable" }, { status: 503 })
    }
}
