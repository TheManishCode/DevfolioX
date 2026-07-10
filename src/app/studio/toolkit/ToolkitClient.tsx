"use client"

import { useState } from "react"
import Image from "next/image"
import {
    SiNextdotjs,
    SiReact,
    SiTailwindcss,
    SiTypescript,
    SiPython,
    SiGit,
    SiGithub,
    SiVercel,
    SiNetlify,
    SiNotion,
    SiPostman,
    SiFigma,
    SiSpotify,
    SiDiscord,
    SiSlack,
    SiGooglechrome,
    SiDavinciresolve,
    SiCanva,
    SiKalilinux
} from "react-icons/si"
import { FaWindows, FaExternalLinkAlt } from "react-icons/fa"
import { BiLogoVisualStudio } from "react-icons/bi"
import { VscCopilot } from "react-icons/vsc"
import toolkitData from "@/data/toolkit.json"

// =============================================================================
// DATA
// =============================================================================

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    windows: FaWindows, kali: SiKalilinux, vscode: BiLogoVisualStudio,
    chrome: SiGooglechrome, copilot: VscCopilot, notion: SiNotion,
    react: SiReact, nextjs: SiNextdotjs, typescript: SiTypescript,
    tailwind: SiTailwindcss, python: SiPython, git: SiGit,
    github: SiGithub, vercel: SiVercel, netlify: SiNetlify,
    postman: SiPostman, spotify: SiSpotify, figma: SiFigma,
    davinci: SiDavinciresolve, canva: SiCanva, discord: SiDiscord, slack: SiSlack,
}

// =============================================================================
// COMPONENTS
// =============================================================================

// Gear Card - Enhanced with hover effects
function GearCard({ item }: { item: { name: string; description: string; imageUrl: string; tags: string[] } }) {
    const [imageError, setImageError] = useState(false)

    return (
        <div className="group border dark:border-zinc-800 border-zinc-200 rounded-md p-4 flex flex-col items-center transition-all duration-300 hover:border-[#33E092]/50 hover:shadow-[0_0_20px_rgba(51,224,146,0.1)]">
            <div className="relative w-20 h-20 mb-2 transition-transform duration-300 group-hover:scale-110">
                {imageError ? (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                        📦
                    </div>
                ) : (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            <h3 className="text-sm font-semibold dark:text-white text-gray-900 text-center transition-colors duration-300 group-hover:text-zinc-600 dark:group-hover:text-[#33E092]">{item.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{item.description}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
                {item.tags.map((tag, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-[#d5d5da] dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-400 dark:border-zinc-700 rounded transition-transform duration-200 hover:scale-105"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}

// Icon Card - Enhanced with hover effects
function IconCard({ item }: { item: { name: string; description: string; iconKey: string; link: string } }) {
    const Icon = ICON_MAP[item.iconKey]
    if (!Icon) return null

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-24 h-24 border dark:border-zinc-800 border-zinc-200 rounded-md flex flex-col items-center justify-center gap-2 !no-underline hover:!no-underline transition-all duration-300 hover:border-[#33E092]/50 hover:shadow-[0_0_15px_rgba(51,224,146,0.1)]"
        >
            <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:text-zinc-900 dark:group-hover:text-[#33E092] group-hover:scale-110" />
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center transition-colors duration-300 group-hover:text-zinc-900 dark:group-hover:text-[#33E092]">{item.name}</span>
        </a>
    )
}

// Bookmark Card - Enhanced with better hover effects
function BookmarkCard({ item }: { item: { title: string; description: string; url: string } }) {
    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 border dark:border-zinc-800 border-zinc-200 rounded-md !no-underline hover:!no-underline transition-all duration-300 hover:border-[#33E092]/50 hover:shadow-[0_0_25px_rgba(51,224,146,0.15)] hover:-translate-y-1 hover:scale-[1.02]"
        >
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-2">
                <span className="text-xs truncate">{item.url.replace(/https?:\/\//, "").replace(/\/$/, "")}</span>
                <FaExternalLinkAlt className="h-3 w-3 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-zinc-900 dark:group-hover:text-[#33E092]" />
            </div>
            <h3 className="text-sm font-medium dark:text-white text-gray-900 mb-1 no-underline transition-colors duration-300 group-hover:text-zinc-600 dark:group-hover:text-[#33E092]">{item.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
        </a>
    )
}

// =============================================================================
// PAGE
// =============================================================================

export function ToolkitClient({ toolkit }: { toolkit: typeof toolkitData }) {
    return (
        <div className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            {/* Header */}
            <div className="mb-16">
                <h1 className="text-4xl font-bold mb-2 dark:text-white text-gray-900">
                    My Gear & Uses
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    A peek into the tools and technologies I use daily.
                </p>
            </div>

            {/* Setup Box - Profile style like story page */}
            <div className="relative w-full max-w-2xl mb-12 group mx-auto">
                {/* Main Image Container */}
                <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden border dark:border-zinc-800 border-zinc-200 bg-zinc-100 dark:bg-zinc-900 shadow-xl dark:shadow-emerald-900/10 shadow-emerald-500/5">
                    <Image
                        src={toolkit.setupImageUrl}
                        alt="My Gaming Setup"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />

                    {/* Subtle Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />
                </div>

                {/* Decorative Elements - Balanced size */}
                <div className="absolute -bottom-5 -right-5 w-24 h-24 border-[3px] border-[#33E092] rounded-[2rem] -z-10 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5 opacity-80" />
                <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#33E092]/10 rounded-[2rem] -z-10 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5" />
            </div>

            {/* Gear Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Gear</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {toolkit.gear.map((item, i) => (
                        <GearCard key={i} item={item} />
                    ))}
                </div>
            </section>

            {/* System Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">System</h2>
                <div className="flex flex-wrap gap-3">
                    {toolkit.system.map((item, i) => (
                        <IconCard key={i} item={item} />
                    ))}
                </div>
            </section>

            {/* Coding Tools Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Coding Tools</h2>
                <div className="flex flex-wrap gap-3">
                    {toolkit.coding.map((item, i) => (
                        <IconCard key={i} item={item} />
                    ))}
                </div>
            </section>

            {/* Software/Applications Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Software/Applications</h2>
                <div className="flex flex-wrap gap-3">
                    {toolkit.software.map((item, i) => (
                        <IconCard key={i} item={item} />
                    ))}
                </div>
            </section>

            {/* Bookmarks Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Bookmarks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {toolkit.bookmarks.map((item, i) => (
                        <BookmarkCard key={i} item={item} />
                    ))}
                </div>
            </section>


        </div >
    )
}
