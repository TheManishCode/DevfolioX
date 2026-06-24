import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const MESSAGE_MAX_LEN = 200

function sanitize(input: string): string {
    return input
        .trim()
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .slice(0, MESSAGE_MAX_LEN)
}

export async function GET() {
    try {
        const entries = await prisma.guestbookEntry.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                message: true,
                image: true,
                provider: true,
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

    try {
        // Rate limit: 1 entry per 24 hours per email
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recent = await prisma.guestbookEntry.findFirst({
            where: {
                email: token.email,
                createdAt: { gte: oneDayAgo },
            },
        })
        if (recent) {
            return Response.json(
                { error: "You have already signed the guestbook in the last 24 hours" },
                { status: 429 }
            )
        }

        const entry = await prisma.guestbookEntry.create({
            data: {
                name: (token.name as string) || "Anonymous",
                email: token.email,
                message: sanitize(rawMessage),
                image: (token.picture as string) || null,
                provider: (token.provider as string) || "OAuth",
            },
            select: {
                id: true,
                name: true,
                message: true,
                image: true,
                provider: true,
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
