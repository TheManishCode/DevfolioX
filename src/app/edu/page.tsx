import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, GraduationCap, Award } from "lucide-react"

export const metadata: Metadata = {
    title: "Edu",
    description: "Academic journey and credentials.",
}

const sections = [
    {
        num: "01",
        title: "Schooling",
        description: "A chaptered narrative through formal education — from primary school to engineering.",
        href: "/edu/schooling",
        icon: GraduationCap,
        cta: "Read the story",
        meta: "4 chapters",
    },
    {
        num: "02",
        title: "Courses",
        description: "Verified certifications and structured learning from platforms like Coursera and NPTEL.",
        href: "/edu/courses",
        icon: Award,
        cta: "View credentials",
        meta: "10+ certificates",
    },
]

const stats = [
    { value: "16+", label: "Years learning" },
    { value: "CSE-AI", label: "Current track" },
    { value: "2026", label: "Expected grad" },
]

export default function EduPage() {
    return (
        <main className="max-w-[1400px] mx-auto px-6 pb-24 pt-14 sm:px-8 md:px-12 lg:px-16 lg:pt-20">

            <header className="mb-12 pb-10 border-b border-zinc-200 dark:border-zinc-800 animate-slide-up">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Education</span>
                <h1 className="mt-4 font-incognito text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    The architecture of learning.
                </h1>
                <p className="mt-4 text-base dark:text-zinc-400 text-zinc-600 max-w-xl leading-relaxed">
                    Formal academics and continuous self-directed learning — two tracks running in parallel.
                </p>

                <div className="flex items-center gap-10 mt-8">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <div className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-100">{s.value}</div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
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
                            <p className="text-sm dark:text-zinc-500 text-zinc-500 leading-relaxed mb-6">
                                {s.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400">{s.meta}</span>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                    <span>{s.cta}</span>
                                    <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

        </main>
    )
}
