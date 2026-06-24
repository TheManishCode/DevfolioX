import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    if (!token || !token.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: { profileUrl?: string } = {}
    try {
        body = await req.json()
    } catch {
        // body is optional
    }

    try {
        // Avoid duplicate: one per email per 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recent = await prisma.connectionRequest.findFirst({
            where: { email: token.email as string, createdAt: { gte: oneDayAgo } },
        })

        if (!recent) {
            await prisma.connectionRequest.create({
                data: {
                    name: (token.name as string) || "Unknown",
                    email: token.email as string,
                    image: (token.picture as string) || null,
                    provider: (token.provider as string) || "OAuth",
                    profileUrl: body.profileUrl || null,
                },
            })
        }

        // Discord webhook — only fires from the Connect page
        if (process.env.DISCORD_WEBHOOK_URL) {
            await fetch(process.env.DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [{
                        title: "🤝 New Connection Request",
                        color: 3399826,
                        fields: [
                            { name: "Name", value: (token.name as string) || "Unknown", inline: true },
                            { name: "Platform", value: (token.provider as string) || "OAuth", inline: true },
                            { name: "Email", value: (token.email as string) || "N/A", inline: false },
                            { name: "Profile", value: body.profileUrl || "N/A", inline: false },
                        ],
                        thumbnail: token.picture ? { url: token.picture } : undefined,
                        footer: { text: "Via Connect page · Identity verified via OAuth" },
                        timestamp: new Date().toISOString(),
                    }],
                }),
            }).catch(() => {/* webhook failure is non-fatal */})
        }

        return Response.json({ ok: true })
    } catch {
        return Response.json({ error: "Failed to save connection request" }, { status: 503 })
    }
}
