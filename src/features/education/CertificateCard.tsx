"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { X, ExternalLink, Clock, BarChart3, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react"

interface EnrichedData {
    level?: string
    duration?: string
    outcomes?: string[]
    skills?: string[]
}

interface Certificate {
    id: string
    title: string
    image: string
    issuer: string
    platform: string
    year: string
    verifyUrl: string
    enriched?: EnrichedData
}

export function CertificateCard({ cert }: { cert: Certificate }) {
    const [activeFace, setActiveFace] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const imageSrc = /^https?:\/\//.test(cert.image) ? cert.image : `/certificates/${cert.image}`
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isModalOpen) return

        const trigger = triggerRef.current
        closeButtonRef.current?.focus()

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false)
        }
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            trigger?.focus()
        }
    }, [isModalOpen])

    if (!cert.image || !cert.verifyUrl) return null

    const goNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveFace(1)
    }

    const goPrev = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveFace(0)
    }

    return (
        <>
            {/* Card */}
            <article className="group flex flex-col h-full">
                {/* Header Row - Title + Platform */}
                <div className="flex items-center justify-between mb-3 px-0.5">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {cert.platform}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{cert.year}</span>
                </div>

                {/* Card Viewport */}
                <div
                    ref={triggerRef}
                    role="button"
                    tabIndex={0}
                    aria-label={`Expand ${cert.title} certificate`}
                    className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 cursor-pointer hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1"
                    onClick={() => setIsModalOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            setIsModalOpen(true)
                        }
                    }}
                >
                    {/* Face Slider */}
                    <div
                        className="flex w-full h-full"
                        style={{
                            transform: `translateX(-${activeFace * 100}%)`,
                            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                    >
                        {/* Face 1: Certificate Image */}
                        <div className="w-full h-full flex-shrink-0 relative p-6">
                            <Image
                                src={imageSrc}
                                alt={cert.title}
                                fill
                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>

                        {/* Face 2: Details */}
                        <div className="w-full h-full flex-shrink-0 p-5 flex flex-col bg-zinc-50 dark:bg-zinc-900/95">
                            {/* Verified Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <BadgeCheck size={14} className="text-zinc-500" />
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Verified Credential</span>
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {cert.enriched?.level && (
                                    <span className="flex items-center gap-1 px-2 py-1 text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded">
                                        <BarChart3 size={10} />
                                        {cert.enriched.level}
                                    </span>
                                )}
                                {cert.enriched?.duration && (
                                    <span className="flex items-center gap-1 px-2 py-1 text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded">
                                        <Clock size={10} />
                                        {cert.enriched.duration}
                                    </span>
                                )}
                            </div>

                            {/* Skills */}
                            {cert.enriched?.skills && cert.enriched.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {cert.enriched.skills.slice(0, 5).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Issued by {cert.issuer}
                                </p>
                            )}

                            <p className="text-[10px] text-zinc-400 mt-auto">Click to expand</p>
                        </div>
                    </div>
                </div>

                {/* Title + Navigation Row - BELOW the card */}
                <div className="pt-4 px-0.5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 line-clamp-2 mb-2 leading-snug">
                        {cert.title}
                    </h3>

                    {/* Navigation Controls - Clear and Accessible */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate pr-2">
                            {cert.issuer}
                        </p>

                        {/* Arrow Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={goPrev}
                                disabled={activeFace === 0}
                                className={`p-1.5 rounded-md transition-all ${activeFace === 0
                                        ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                    }`}
                                aria-label="Show certificate image"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {/* Dots indicator */}
                            <div className="flex items-center gap-1 px-1">
                                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeFace === 0 ? "bg-zinc-800 dark:bg-zinc-200" : "bg-zinc-300 dark:bg-zinc-700"}`} />
                                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeFace === 1 ? "bg-zinc-800 dark:bg-zinc-200" : "bg-zinc-300 dark:bg-zinc-700"}`} />
                            </div>

                            <button
                                onClick={goNext}
                                disabled={activeFace === 1}
                                className={`p-1.5 rounded-md transition-all ${activeFace === 1
                                        ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                    }`}
                                aria-label="Show certificate details"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="certificate-modal-title"
                        className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between p-5 border-b border-zinc-800">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <p id="certificate-modal-title" className="font-semibold text-zinc-100">{cert.title}</p>
                                    <BadgeCheck size={16} className="text-zinc-500" />
                                </div>
                                <p className="text-sm text-zinc-400 mt-1">{cert.issuer}</p>
                                <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500 flex-wrap">
                                    <span className="px-2 py-0.5 bg-zinc-800 rounded">{cert.platform}</span>
                                    <span>{cert.year}</span>
                                </div>
                            </div>
                            <button
                                ref={closeButtonRef}
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close certificate details"
                                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                <X size={18} className="text-zinc-400" />
                            </button>
                        </div>

                        <div className="relative bg-zinc-100 p-6 h-[60vh]">
                            <Image
                                src={imageSrc}
                                alt={cert.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 896px"
                                className="object-contain"
                            />
                        </div>

                        {cert.enriched?.skills && cert.enriched.skills.length > 0 && (
                            <div className="p-5 border-t border-zinc-800">
                                <div className="flex flex-wrap gap-2">
                                    {cert.enriched.skills.map((skill, i) => (
                                        <span key={i} className="px-2.5 py-1 text-xs bg-zinc-800 text-zinc-300 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-5 border-t border-zinc-800 flex justify-end">
                            <a
                                href={cert.verifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors"
                            >
                                Verify Certificate
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
