/**
 * =============================================================================
 * ENGINEERING EDUCATION — TRANSPARENT ARCHITECTURAL UI
 * Focus: Recruiter-grade clarity, transparency, and technical precision.
 * =============================================================================
 */

import { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, BookOpen, Lightbulb, ArrowUpRight, Hexagon } from "lucide-react"
import { getContent } from "@/lib/content"
import educationData from "@/data/education.json"

export const metadata: Metadata = {
    title: "Engineering Education",
    description: "Structured academic training across computer science, AI, systems, and security.",
}

/* =============================================================================
   PRIMITIVES
============================================================================= */

const Section = ({
    title,
    icon,
    description,
    children,
}: {
    title: string
    icon: React.ReactNode
    description?: string
    children: React.ReactNode
}) => (
    <section className="py-24 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
            <header className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
                        {icon}
                    </div>
                    {title}
                </div>
                {description && (
                    <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium max-w-sm">
                        {description}
                    </p>
                )}
            </header>
            <div className="lg:col-span-8">
                {children}
            </div>
        </div>
    </section>
)

interface Semester {
    semester: number
    themes?: string[]
    subjects?: string[]
}

const SemesterBlock = ({ semester }: { semester: Semester }) => {
    if (!semester.subjects?.length) return null

    return (
        <div className="group relative grid grid-cols-[48px_1fr] gap-6 py-8 border-b border-zinc-100/30 dark:border-zinc-900/30 last:border-none transition-all duration-300">
            {/* Numbering with subtle vertical line */}
            <div className="flex flex-col items-center">
                <span className="text-xl font-mono font-light text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                    {String(semester.semester).padStart(2, "0")}
                </span>
                <div className="w-[1px] h-full bg-gradient-to-b from-zinc-200/50 to-transparent dark:from-zinc-800/50 mt-2" />
            </div>

            <div>
                {(semester.themes?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(semester.themes ?? []).map((theme: string, i: number) => (
                            <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 px-2 py-0.5 rounded-sm backdrop-blur-md">
                                {theme}
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                    {semester.subjects.map((subject: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                            <Hexagon size={8} className="mt-1.5 text-zinc-300 dark:text-zinc-700 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100 transition-colors" />
                            <span className="text-[14px] text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-200 transition-colors">
                                {subject}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* =============================================================================
   PAGE
============================================================================= */

export default async function EngineeringEducationPage() {
    const content = await getContent("education", educationData)
    const { education, supplementaryLearning, academicCapabilities } = content
    if (!education?.degree) return null

    const degree = education.degree
    const semesters = (education.semesters || [])
    const validSemesters = semesters.filter((s: any) => s.subjects?.length)

    return (
        <article className="mx-auto max-w-7xl pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* HERO SECTION */}
            <header className="max-w-4xl mb-32 space-y-6">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
                    <span className="h-[1px] w-8 bg-zinc-300 dark:bg-zinc-700" />
                    Curriculum Overview
                </div>

                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                    Engineering <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-400 dark:from-white dark:via-zinc-400 dark:to-zinc-600">
                        Education
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">
                    Structured academic training across computer science, AI, systems, and security.
                </p>
            </header>

            {/* DEGREE COMPONENT - TRANSPARENT GLASS */}
            <section className="mb-32">
                <div className="relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-16 transition-all duration-500 hover:border-zinc-400 dark:hover:border-zinc-600">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                        <GraduationCap size={120} strokeWidth={0.5} />
                    </div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-end">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                    {degree.title}
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm tracking-tight">
                                    {degree.field}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {degree.focusAreas.map((area: string, i: number) => (
                                    <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase tracking-tighter border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-100 dark:hover:text-zinc-100 transition-all cursor-default">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="lg:text-right space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Institution & Period</p>
                            <p className="text-lg font-medium">{degree.institution}</p>
                            <p className="text-4xl font-mono font-extralight tracking-tighter text-zinc-300 dark:text-zinc-700">
                                {degree.duration}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            {validSemesters.length > 0 && (
                <Section
                    title="Curriculum"
                    icon={<BookOpen size={14} />}
                    description="Eight semesters of structured learning across core CS, AI/ML, systems, and security."
                >
                    <div className="divide-y divide-zinc-100/10 dark:divide-zinc-900/10">
                        {validSemesters.map((s: any) => (
                            <SemesterBlock key={s.semester} semester={s} />
                        ))}
                    </div>
                </Section>
            )}

            {/* CAPABILITIES */}
            {academicCapabilities?.length > 0 && (
                <Section
                    title="Capabilities"
                    icon={<Lightbulb size={14} />}
                    description="Competencies developed through formal coursework and applied learning."
                >
                    <div className="grid md:grid-cols-2 gap-4">
                        {academicCapabilities.map((cap: string, i: number) => (
                            <div key={i} className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
                                <span className="text-[10px] font-mono text-zinc-400 mb-4 block">0{i + 1}</span>
                                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">{cap}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* SUPPLEMENTARY - MINIMAL GLASS CTA */}
            {supplementaryLearning?.nptelCourses?.length > 0 && (
                <section className="mt-12 group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Supplementary Certification</h4>
                        <p className="text-xs text-zinc-500 font-mono">Verified Specialization via NPTEL · {supplementaryLearning.nptelCourses.length} Modules</p>
                    </div>
                    <Link
                        href="/edu/courses"
                        className="group/btn flex items-center gap-3 px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 transition-all duration-300 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                    >
                        <span className="text-xs font-medium tracking-wide">
                            View Certifications
                        </span>
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                </section>
            )}

            {/* FOOTER */}
            <footer className="mt-40 pt-12 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                <Link href="/edu" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    [ Back to index ]
                </Link>
                <div className="flex items-center gap-4 italic opacity-50">
                    <span>VTU 2022_26</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-400" />
                    <span>Academic Ledger</span>
                </div>
            </footer>
        </article>
    )
}