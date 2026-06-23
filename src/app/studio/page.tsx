import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Wrench, BarChart3, Layers } from "lucide-react"

export const metadata: Metadata = {
    title: "Studio",
    description: "Tools, metrics, and the technical decisions behind this site.",
}

const sections = [
    {
        num: "01",
        title: "Toolkit",
        description: "The software, hardware, and services that power my daily workflow.",
        href: "/studio/toolkit",
        icon: Wrench,
        cta: "View toolkit",
    },
    {
        num: "02",
        title: "Metrics",
        description: "GitHub activity, coding stats, and development analytics over time.",
        href: "/studio/metrics",
        icon: BarChart3,
        cta: "View metrics",
    },
    {
        num: "03",
        title: "Colophon",
        description: "The technical stack, framework choices, and design system behind this site.",
        href: "/studio/colophon",
        icon: Layers,
        cta: "View colophon",
    },
]

export default function StudioPage() {
    return (
        <main className="max-w-[1400px] mx-auto px-6 pb-24 pt-14 sm:px-8 md:px-12 lg:px-16 lg:pt-20">

            <header className="mb-12 pb-10 border-b border-zinc-200 dark:border-zinc-800 animate-slide-up">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Studio</span>
                <h1 className="mt-4 font-incognito text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    The Workshop.
                </h1>
                <p className="mt-4 text-base dark:text-zinc-400 text-zinc-600 max-w-xl leading-relaxed">
                    A look inside my development environment — tools I use, metrics I track, and how this site is built.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
                {sections.map((s) => {
                    const Icon = s.icon
                    return (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="group relative block rounded-xl border border-zinc-200 dark:border-zinc-800 p-7 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">{s.num}</span>
                                <Icon size={15} className="text-zinc-400" />
                            </div>
                            <h3 className="font-incognito text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                {s.title}
                            </h3>
                            <p className="text-sm dark:text-zinc-500 text-zinc-500 leading-relaxed mb-8">
                                {s.description}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                <span>{s.cta}</span>
                                <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </Link>
                    )
                })}
            </div>

        </main>
    )
}
