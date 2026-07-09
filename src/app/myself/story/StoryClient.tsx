"use client"

import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import aboutData from "@/data/about.json"

export function StoryClient({ about }: { about: typeof aboutData }) {
    const [imageFailed, setImageFailed] = useState(false)

    return (
        // Optimized for real-life: 7xl provides the best balance between width and readability
        <main className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 relative">

            {/* Standard Background Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-40 right-20 w-64 h-64 bg-[#33E092]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            {/* Layout: Text Left (8/12), Image Right (4/12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                {/* TEXT CONTENT */}
                <section className="lg:col-span-8 order-2 lg:order-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[#33E092] text-xs font-bold tracking-[0.2em] uppercase">About Me</span>
                        <div className="h-px w-16 bg-gradient-to-r from-[#33E092] to-transparent" />
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl italic font-normal leading-tight dark:text-white text-zinc-900 mb-5">
                        I&apos;m {about.name}. I live in {about.location}, {about.locationTagline}.
                    </h1>

                    <div className="space-y-4 dark:text-zinc-400 text-zinc-600 leading-relaxed text-[15px]">
                        {about.bio.map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Original Anime-Style Quote Box */}
                    <div className="relative overflow-hidden mt-8 lg:py-6 lg:pl-6 pr-12 p-4 border dark:border-zinc-800 border-zinc-200 rounded-md">
                        <svg className="w-20 h-20 absolute -top-6 -right-4 -rotate-12 dark:text-zinc-800 text-zinc-200 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                        </svg>
                        <div className="relative z-10 flex flex-col gap-4">
                            <p className="font-incognito text-base dark:text-zinc-300 text-zinc-700 leading-relaxed italic">
                                "{about.quotes[0]}"
                            </p>
                            <p className="font-incognito text-base dark:text-zinc-300 text-zinc-700 leading-relaxed italic">
                                "{about.quotes[1]}"
                            </p>
                        </div>
                    </div>
                </section>

                {/* IMAGE & LINKS: Original size, Sticky scroll enabled for better UX */}
                <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-32">
                    <div className="max-w-xs mx-auto lg:ml-auto">
                        <div className="relative mb-6">
                            <div className="aspect-square rounded-2xl overflow-hidden border dark:border-zinc-800 border-zinc-200">
                                {imageFailed ? (
                                    <div className="w-full h-full flex items-center justify-center text-6xl dark:bg-zinc-900 bg-[#d5d5da] dark:text-zinc-700 text-zinc-400">👤</div>
                                ) : (
                                    <Image
                                        src={about.profileImageUrl}
                                        alt={about.name}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover brightness-50"
                                        onError={() => setImageFailed(true)}
                                    />
                                )}
                            </div>
                            {/* Original Cube Decoration */}
                            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-2 border-[#33E092] rounded-2xl -z-10" />
                            <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#33E092]/20 rounded-xl -z-10" />
                        </div>

                        {/* Resume and Email Row */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Link
                                    href={about.resumeUrl}
                                    target="_blank"
                                    className="flex items-center gap-2 dark:text-white text-zinc-900 font-medium hover:underline text-[15px]"
                                >
                                    View Résumé
                                    <svg className="w-3.5 h-3.5 dark:text-zinc-500 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </Link>
                                <a
                                    href={about.resumeUrl}
                                    download
                                    className="w-8 h-8 rounded-lg bg-[#33E092] flex items-center justify-center hover:bg-[#2bc97f] transition-colors"
                                >
                                    <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </a>
                            </div>

                            <a
                                href={`mailto:${about.email}`}
                                className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600 hover:dark:text-white hover:text-zinc-900 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {about.email}
                            </a>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Practical Footer Navigation */}
            <footer className="mt-20 pt-8 border-t dark:border-zinc-800/50 border-zinc-200">
                <Link
                    href="/myself"
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-[#33E092] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Myself
                </Link>
            </footer>
        </main>
    )
}
