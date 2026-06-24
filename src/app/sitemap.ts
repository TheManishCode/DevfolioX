import { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
    const base = siteConfig.url

    const staticRoutes = [
        { url: base, priority: 1.0, changeFrequency: "weekly" as const },
        { url: `${base}/myself/story`, priority: 0.8, changeFrequency: "monthly" as const },
        { url: `${base}/myself/gallery`, priority: 0.6, changeFrequency: "monthly" as const },
        { url: `${base}/studio/toolkit`, priority: 0.6, changeFrequency: "monthly" as const },
        { url: `${base}/studio/metrics`, priority: 0.7, changeFrequency: "daily" as const },
        { url: `${base}/studio/colophon`, priority: 0.5, changeFrequency: "monthly" as const },
        { url: `${base}/workspace/TheManishCode`, priority: 0.8, changeFrequency: "weekly" as const },
        { url: `${base}/workspace/creations`, priority: 0.9, changeFrequency: "weekly" as const },
        { url: `${base}/workspace/oss`, priority: 0.8, changeFrequency: "weekly" as const },
        { url: `${base}/workspace/now`, priority: 0.9, changeFrequency: "weekly" as const },
        { url: `${base}/workspace/experience`, priority: 0.8, changeFrequency: "monthly" as const },
        { url: `${base}/workspace/sketches`, priority: 0.7, changeFrequency: "weekly" as const },
        { url: `${base}/workspace/secumilate`, priority: 0.7, changeFrequency: "weekly" as const },
        { url: `${base}/ink/articles`, priority: 0.8, changeFrequency: "weekly" as const },
        { url: `${base}/ink/research`, priority: 0.7, changeFrequency: "monthly" as const },
        { url: `${base}/edu/schooling`, priority: 0.6, changeFrequency: "yearly" as const },
        { url: `${base}/edu/courses`, priority: 0.6, changeFrequency: "monthly" as const },
        { url: `${base}/hobbies/anime`, priority: 0.5, changeFrequency: "weekly" as const },
        { url: `${base}/hobbies/games`, priority: 0.5, changeFrequency: "weekly" as const },
        { url: `${base}/guestbook`, priority: 0.7, changeFrequency: "daily" as const },
        { url: `${base}/connect`, priority: 0.8, changeFrequency: "monthly" as const },
    ]

    return staticRoutes.map((route) => ({
        url: route.url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))
}
