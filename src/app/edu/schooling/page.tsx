import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, MapPin, GraduationCap } from "lucide-react"
import { getContent } from "@/lib/content"
import schoolingData from "@/data/schooling.json"

export const metadata: Metadata = {
    title: "Schooling",
    description: "A chaptered schooling timeline from early foundations to computer science engineering.",
}

export default async function SchoolingPage() {
    const content = await getContent("schooling", schoolingData)
    const chapters = content.chapters

    return (
        <main className="max-w-[1400px] mx-auto px-6 pb-24 pt-14 sm:px-8 md:px-12 lg:px-16 lg:pt-20 dark:text-zinc-100 text-zinc-900">

            {/* Header */}
            <header className="mb-16 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Academic origin file</span>
                    <div className="h-px flex-1 max-w-[60px] bg-zinc-300 dark:bg-zinc-700" />
                </div>

                <h1 className="font-incognito text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-zinc-900 dark:text-zinc-100 max-w-3xl">
                    The years that taught me how to learn.
                </h1>

                <p className="mt-5 text-base dark:text-zinc-400 text-zinc-600 max-w-xl leading-relaxed">
                    Not a list of schools — the trail of rooms, routines, and compounding habits that led into computer science and AI.
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-8 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    {content.pageStats.map((s) => (
                        <div key={s.l}>
                            <div className="font-mono text-lg font-semibold">{s.v}</div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mt-0.5">{s.l}</div>
                        </div>
                    ))}
                </div>
            </header>

            {/* Chapter list */}
            <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
                {chapters.map((ch, i) => (
                    <article
                        key={ch.number}
                        className={`group relative grid md:grid-cols-[72px_1fr_220px] gap-x-8 gap-y-4 py-10 border-t transition-colors duration-150 ${
                            i === chapters.length - 1 ? "border-b" : ""
                        } border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 -mx-3 px-3 rounded-lg`}
                    >
                        {/* Left: big chapter number */}
                        <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-0">
                            <span
                                className={`font-mono text-5xl md:text-6xl font-black leading-none select-none transition-colors duration-150 ${
                                    ch.current
                                        ? "text-[#33E092]"
                                        : "text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-300 dark:group-hover:text-zinc-700"
                                }`}
                            >
                                {ch.number}
                            </span>
                            {ch.current && (
                                <span className="md:mt-2 text-[9px] font-mono uppercase tracking-[0.28em] text-[#33E092]">
                                    Current
                                </span>
                            )}
                        </div>

                        {/* Center: main content */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-400">
                                    {ch.status}
                                </span>
                            </div>

                            <h2 className="font-incognito text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                                {ch.institution}
                            </h2>

                            <p className={`mt-1 text-sm font-medium ${ch.current ? "text-[#33E092]" : "dark:text-zinc-400 text-zinc-500"}`}>
                                {ch.program}
                            </p>

                            <p className="mt-4 text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-xl">
                                {ch.story}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-5">
                                {ch.proof.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] font-mono uppercase tracking-[0.14em] border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2 py-1"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: meta */}
                        <aside className="flex md:flex-col md:items-end justify-start md:justify-start gap-4 md:gap-2 text-sm text-zinc-500 md:pt-1">
                            <div className="flex items-center gap-1.5">
                                <CalendarDays size={13} />
                                <span className="font-mono text-xs">{ch.years}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={13} />
                                <span className="font-mono text-xs">{ch.place}</span>
                            </div>

                            {/* Progress bar */}
                            <div className="hidden md:block mt-auto w-full">
                                <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-800 mt-4">
                                    <div
                                        className={`h-[2px] transition-all ${ch.current ? "bg-[#33E092]" : "bg-zinc-400 dark:bg-zinc-600"}`}
                                        style={{ width: `${Number(ch.number) * 22}%` }}
                                    />
                                </div>
                                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                                    ch. {ch.number} / 04
                                </p>
                            </div>
                        </aside>
                    </article>
                ))}
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-slide-up" style={{ animationDelay: "160ms" }}>
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <GraduationCap size={16} className="text-[#33E092] shrink-0" />
                    <span>{content.footerNote}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/edu/courses"
                        className="text-sm border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        Courses
                    </Link>
                    <Link
                        href="/edu/engineering"
                        className="inline-flex items-center gap-1.5 text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-md hover:bg-[#33E092] dark:hover:bg-[#33E092] hover:text-black transition-colors font-medium"
                    >
                        Engineering
                        <ArrowUpRight size={13} />
                    </Link>
                </div>
            </footer>

        </main>
    )
}
