import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    if (!token || !token.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const name = (token.name as string) || "Unknown"
    const email = token.email as string
    const provider = (token.provider as string) || "OAuth"
    const image = (token.picture as string) || null

    try {
        // One request per email per 24h to avoid duplicate pings
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recent = await prisma.connectionRequest.findFirst({
            where: { email, createdAt: { gte: oneDayAgo } },
        })

        if (!recent) {
            await prisma.connectionRequest.create({
                data: { name, email, image, provider },
            })
        }

        // Discord webhook — scoped to Connect page only
        if (process.env.DISCORD_WEBHOOK_URL) {
            await fetch(process.env.DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [{
                        title: "🤝 New Connection Request",
                        color: 3399826,
                        fields: [
                            { name: "Name", value: name, inline: true },
                            { name: "Platform", value: provider, inline: true },
                            { name: "Email", value: email, inline: false },
                        ],
                        thumbnail: image ? { url: image } : undefined,
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
