import { getContent } from "@/lib/content"
import aboutData from "@/data/about.json"
import { StoryClient } from "./StoryClient"

export default async function StoryPage() {
    const about = await getContent("about", aboutData)
    return <StoryClient about={about} />
}
