/**
 * Home Page
 *
 * Landing page: hero, featured projects, work experience preview,
 * hackathons, GitHub contributions, tech stacks. Uses ISR (1 hour).
 *
 * Data flow:
 * - Projects fetched from GitHub API via fetchPortfolioProjects()
 * - Featured projects filtered by 'now' category
 * - Experience data from lib/experience
 * - Hackathons driven by src/data/hackathons.json
 */

import Link from "next/link"
import TechStacks from "@/components/decorative/TechStacks"
import GitHubContributions from "@/features/github/GitHubContributions"
import SocialLinks from "@/features/social/SocialLinks"
import HeroVisual from "@/components/decorative/HeroVisual"
import NavigationIcons from "@/components/navigation/NavigationIcons"
import { SectionTitle } from "@/components/ui/Typography"
import { fetchPortfolioProjects } from "@/lib/github/api"
import { filterByCategory } from "@/lib/github/filters"
import { ProjectGrid } from "@/features/workspace/ProjectGrid"
import { FiExternalLink, FiCalendar, FiMapPin } from "react-icons/fi"
import { getExperienceData, Experience } from "@/lib/experience"
import HackathonsTimeline from "@/features/hackathons/HackathonsTimeline"

export const revalidate = 3600



export default async function HomePage() {
    const allProjects = await fetchPortfolioProjects()
    const nowProjects = filterByCategory(allProjects, 'now')
    const experienceData = await getExperienceData()
    const experiences: Experience[] = experienceData.experiences || []

    return (
        <>
            {/* Main content container */}
            <main id="main-content" className="max-w-[1400px] mx-auto pt-20 lg:pt-28 px-6 sm:px-8 md:px-12 lg:px-16">

                {/* ── 1. Hero ── */}
                <section className="mb-16 relative">
                    <div className="lg:max-w-4xl animate-slide-up relative z-10">

                        <h1 className="font-incognito font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight">
                            Software developer, technical writer & open-source maintainer
                        </h1>

                        <p className="text-base dark:text-zinc-400 text-zinc-600 leading-relaxed">
                            Designing performant systems with C++ and Python, while crafting seamless frontends using React and Tailwind CSS. Focused on the future of Cloud Native and Open Source.
                        </p>

                        <SocialLinks />
                    </div>

                    <HeroVisual />
                </section>

                {/* ── 2. Featured Projects ── */}
                <section className="mt-12 animate-slide-up delay-100">
                    <div className="flex items-center justify-between mb-4">
                        <SectionTitle>Featured</SectionTitle>
                        <Link
                            href="/workspace/now"
                            className="text-black dark:text-[#33E092] hover:underline text-sm"
                        >
                            View all →
                        </Link>
                    </div>
                </section>
            </main>

            {/* Featured cards - wider container */}
            <div className="max-w-[1400px] mx-auto lg:ml-[calc((100vw-80rem)/2)] px-6 sm:px-8 md:px-12 lg:px-16">
                {nowProjects.length > 0 ? (
                    <ProjectGrid projects={nowProjects} />
                ) : (
                    <p className="font-incognito text-xl font-semibold tracking-tight dark:text-zinc-500 text-zinc-400">
                        Coming Soon
                    </p>
                )}
            </div>

            {/* ── 3. Work Experience ── */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
                <section className="mt-20 animate-slide-up delay-100">
                    <div className="flex items-center justify-between mb-4">
                        <SectionTitle>Work Experience</SectionTitle>
                        <Link
                            href="/workspace/experience"
                            className="text-black dark:text-[#33E092] hover:underline text-sm"
                        >
                            View all →
                        </Link>
                    </div>
                </section>
            </div>

            {/* Work Experience cards - wider container aligned with 7xl boundaries */}
            <div className="max-w-[1400px] mx-auto lg:ml-[calc((100vw-80rem)/2)] px-6 sm:px-8 md:px-12 lg:px-16">
                {experiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {experiences.slice(0, 3).map((exp) => (
                            <div key={exp.id} className="group relative bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 h-[280px] flex flex-col">
                                {exp.current && (
                                    <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                                        Current
                                    </span>
                                )}
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 font-incognito mb-1 pr-16">
                                    {exp.role}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                                    {exp.companyUrl ? (
                                        <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                            {exp.company} <FiExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span>{exp.company}</span>
                                    )}
                                    <span className="text-zinc-400">•</span>
                                    <span className="text-xs">{exp.type}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-auto">
                                    {exp.period && (
                                        <span className="flex items-center gap-1">
                                            <FiCalendar className="w-3 h-3" />
                                            {exp.period}
                                        </span>
                                    )}
                                    {exp.location && (
                                        <span className="flex items-center gap-1">
                                            <FiMapPin className="w-3 h-3" />
                                            {exp.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="font-incognito text-xl font-semibold tracking-tight dark:text-zinc-500 text-zinc-400">
                        Coming Soon
                    </p>
                )}
            </div>

            {/* Continue main content */}
            <div className="max-w-[1400px] mx-auto pb-20 px-6 sm:px-8 md:px-12 lg:px-16">

                {/* ── 4. Hackathons ── */}
                <section className="mt-20 mb-20 animate-slide-up delay-300">

                    {/* Centered label with flanking lines */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 px-1">Hackathons</span>
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                    </div>

                    {/* Heading + description — centered */}
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="font-incognito text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            I like building things
                        </h2>
                        <p className="mt-4 text-base dark:text-zinc-400 text-zinc-600 leading-relaxed">
                            I love competing — there's something about a deadline and a blank slate that brings out my best work.
                            Hackathons push me to move fast, think under pressure, and build things I wouldn't attempt otherwise.
                            Every one has taught me something the classroom couldn't.
                        </p>
                    </div>

                    {/* Timeline — driven by src/data/hackathons.json */}
                    <HackathonsTimeline />

                </section>

                {/* ── 5. GitHub Contributions ── */}
                <div className="mt-4">
                    <GitHubContributions />
                </div>

                {/* ── 6. Tech Stacks ── */}
                <div className="mt-20">
                    <TechStacks />
                </div>

                <NavigationIcons />
            </div>
        </>
    )
}
