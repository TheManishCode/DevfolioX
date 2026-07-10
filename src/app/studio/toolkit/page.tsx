/**
 * =============================================================================
 * TOOLKIT PAGE - Tamang-Style Design
 * =============================================================================
 *
 * My Gear & Uses - Showcasing tools, software, and hardware
 *
 * Route: /studio/toolkit
 * =============================================================================
 */

import { getContent } from "@/lib/content"
import toolkitData from "@/data/toolkit.json"
import { ToolkitClient } from "./ToolkitClient"

export default async function ToolkitPage() {
    const toolkit = await getContent("toolkit", toolkitData)
    return <ToolkitClient toolkit={toolkit} />
}
