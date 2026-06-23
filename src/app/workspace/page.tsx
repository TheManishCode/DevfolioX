import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
    title: "Workspace",
    description: "Projects, experience, open source, and more.",
}

const sections = [
    {
        num: "01",
        title: siteConfig.githubUsername,
        href: `/workspace/${siteConfig.githubUsername}`,
        description: "GitHub profile README, rendered live.",
    },
    {
        num: "02",
        title: "Creations",
        href: "/workspace/creations",
        description: "Curated open source projects and products.",
    },
    {
        num: "03",
        title: "Open Source",
        href: "/workspace/oss",
        description: "Contributions to the open source ecosystem.",
    },
    {
        num: "04",
        title: "Secumilate",
        href: "/workspace/secumilate",
        description: "Security + Simulate + Accumulate. Defensive knowledge base.",
    },
    {
        num: "05",
        title: "Experience",
        href: "/workspace/experience",
        description: "Professional roles and career history.",
    },
    {
        num: "06",
        title: "Now",
        href: "/workspace/now",
        description: "What I'm actively building and focused on.",
    },
    {
        num: "07",
        title: "Sketches",
        href: "/workspace/sketches",
        description: "Experimental ideas and design explorations.",
    },
]

export default function WorkspacePage() {
    return (
        <main className="max-w-[1400px] mx-auto px-6 pb-24 pt-14 sm:px-8 md:px-12 lg:px-16 lg:pt-20">

            <header className="mb-12 pb-10 border-b border-zinc-200 dark:border-zinc-800 animate-slide-up">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Workspace</span>
                <h1 className="mt-4 font-incognito text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Where ideas become builds.
                </h1>
                <p className="mt-4 text-base dark:text-zinc-400 text-zinc-600 max-w-xl leading-relaxed">
                    Projects, contributions, experience, and the work that defines my technical direction.
                </p>
            </header>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 animate-slide-up" style={{ animationDelay: "80ms" }}>
                {sections.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="group flex items-center justify-between py-5 px-2 -mx-2 rounded-lg hover:bg-zinc-100/70 dark:hover:bg-zinc-800/30 transition-colors duration-150"
                    >
                        <div className="flex items-baseline gap-6">
                            <span className="text-[10px] font-mono text-zinc-400 w-5 shrink-0">{s.num}</span>
                            <div>
                                <span className="font-incognito text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#33E092] dark:group-hover:text-[#33E092] transition-colors">
                                    {s.title}
                                </span>
                                <p className="mt-0.5 text-sm dark:text-zinc-500 text-zinc-500">
                                    {s.description}
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight
                            size={15}
                            className="shrink-0 ml-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors"
                        />
                    </Link>
                ))}
            </div>

        </main>
    )
}
