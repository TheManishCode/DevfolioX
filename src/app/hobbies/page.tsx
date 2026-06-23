import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
    title: "Hobbies",
    description: "Anime, games, and interests beyond code.",
}

const sections = [
    {
        num: "01",
        title: "Anime",
        description: "Narrative-driven shows that inform how I think about storytelling, system design, and character-driven experiences.",
        href: "/hobbies/anime",
        cta: "Explore anime",
        tags: ["Narrative", "World-building", "Character arcs"],
    },
    {
        num: "02",
        title: "Games",
        description: "Strategy, optimization, and fast decision-making — games sharpen the same instincts I use when writing systems and solving problems.",
        href: "/hobbies/games",
        cta: "Explore games",
        tags: ["Strategy", "Optimization", "Systems"],
    },
]

export default function HobbiesPage() {
    return (
        <main className="max-w-[1400px] mx-auto px-6 pb-24 pt-14 sm:px-8 md:px-12 lg:px-16 lg:pt-20">

            <header className="mb-12 pb-10 border-b border-zinc-200 dark:border-zinc-800 animate-slide-up">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Hobbies</span>
                <h1 className="mt-4 font-incognito text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Beyond the code.
                </h1>
                <p className="mt-4 text-base dark:text-zinc-400 text-zinc-600 max-w-xl leading-relaxed">
                    The things outside of work that shape how I think, design, and build.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
                {sections.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="group relative block rounded-xl border border-zinc-200 dark:border-zinc-800 p-7 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200"
                    >
                        <div className="mb-8">
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">{s.num}</span>
                        </div>
                        <h3 className="font-incognito text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                            {s.title}
                        </h3>
                        <p className="text-sm dark:text-zinc-500 text-zinc-500 leading-relaxed mb-8">
                            {s.description}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1.5">
                                {s.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] font-mono uppercase tracking-[0.14em] border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2 py-1 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors shrink-0 ml-4">
                                <span>{s.cta}</span>
                                <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </main>
    )
}
