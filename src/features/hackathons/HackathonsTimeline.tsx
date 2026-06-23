/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Github, Globe, ExternalLink, Play, FileText, Code } from "lucide-react"
import hackathonsData from "@/data/hackathons.json"

type LinkType = "Code" | "Demo" | "Website" | "DevPost" | "Video" | "Slides" | string

interface HackathonLink {
    type: LinkType
    href: string
}

interface Hackathon {
    title: string
    dates: string
    location: string
    description: string
    image?: string
    links?: HackathonLink[]
}

const hackathons = hackathonsData as Hackathon[]

function linkIcon(type: LinkType) {
    switch (type) {
        case "Code":     return <Github size={11} />
        case "Demo":
        case "Website":  return <Globe size={11} />
        case "DevPost":  return <ExternalLink size={11} />
        case "Video":    return <Play size={11} />
        case "Slides":   return <FileText size={11} />
        default:         return <ExternalLink size={11} />
    }
}

export default function HackathonsTimeline() {
    return (
        <div className="max-w-2xl mx-auto">
            {hackathons.map((hackathon, i) => {
                const isLast = i === hackathons.length - 1
                return (
                    <div key={hackathon.title + hackathon.dates} className="flex gap-5 w-full">

                        {/* Left column: image bubble + connecting line */}
                        <div className="flex flex-col items-center">
                            <div className="relative z-10 shrink-0">
                                {hackathon.image ? (
                                    <img
                                        src={hackathon.image}
                                        alt={hackathon.title}
                                        className="size-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#d5d5da] dark:bg-zinc-900 object-contain p-1 shadow-sm ring-2 ring-zinc-200/60 dark:ring-zinc-700/60 flex-none"
                                    />
                                ) : (
                                    <div className="size-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#d5d5da] dark:bg-zinc-900 shadow-sm ring-2 ring-zinc-200/60 dark:ring-zinc-700/60 flex-none flex items-center justify-center">
                                        <Code size={14} className="text-zinc-400" />
                                    </div>
                                )}
                            </div>
                            {!isLast && (
                                <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 mt-2 mb-0" />
                            )}
                        </div>

                        {/* Right column: content */}
                        <div className={`flex flex-1 flex-col gap-1.5 min-w-0 ${isLast ? "pb-0" : "pb-8"}`}>
                            {hackathon.dates && (
                                <time className="text-[11px] font-mono text-zinc-400">
                                    {hackathon.dates}
                                </time>
                            )}
                            {hackathon.title && (
                                <h3 className="font-incognito text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                                    {hackathon.title}
                                </h3>
                            )}
                            {hackathon.location && (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {hackathon.location}
                                </p>
                            )}
                            {hackathon.description && (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    {hackathon.description}
                                </p>
                            )}
                            {hackathon.links && hackathon.links.length > 0 && (
                                <div className="mt-2 flex flex-row flex-wrap gap-2">
                                    {hackathon.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-[0.1em] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 transition-colors"
                                        >
                                            {linkIcon(link.type)}
                                            {link.type}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}
