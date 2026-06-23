"use client"

import { useState } from "react"
import { FaPlay, FaYoutube, FaVolumeUp } from "react-icons/fa"

const BEST_OPENINGS = [
    { name: "Unravel", anime: "Tokyo Ghoul", artist: "TK from Ling Tosite Sigure", youtubeId: "QKXi08chD2E" },
    { name: "Gurenge", anime: "Demon Slayer", artist: "LiSA", youtubeId: "pmanD_s7G3U" },
    { name: "KICK BACK", anime: "Chainsaw Man", artist: "Kenshi Yonezu", youtubeId: "dFlDRhvM4L0" },
    { name: "Kaikai Kitan", anime: "Jujutsu Kaisen", artist: "Eve", youtubeId: "1tk1pqwrOys" },
    { name: "Again", anime: "FMA Brotherhood", artist: "YUI", youtubeId: "elyXcwunIYA" },
    { name: "Shinzou wo Sasageyo", anime: "Attack on Titan", artist: "Linked Horizon", youtubeId: "LKP-vZvjbh8" },
]

export function OPPlaylist() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [currentTrack, setCurrentTrack] = useState<typeof BEST_OPENINGS[0] | null>(null)

    return (
        <section className="px-6 py-20 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                    <div>
                        <h2 className="text-3xl font-bold dark:text-white text-zinc-900">
                            Legendary <span className="text-red-500">Openings</span>
                        </h2>
                        <p className="text-zinc-500 text-sm">The OPs that hit different 🔥</p>
                    </div>
                </div>

                {currentTrack && (
                    <div className="mb-6 rounded-xl overflow-hidden border dark:border-zinc-800 border-zinc-200">
                        <div className="aspect-video w-full">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?rel=0`}
                                title={`${currentTrack.name} opening`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                        <div className="p-4 dark:bg-zinc-900 bg-[#d5d5da]">
                            <h3 className="text-lg font-bold dark:text-white text-zinc-900">{currentTrack.name}</h3>
                            <p className="text-sm text-zinc-500">{currentTrack.artist} • {currentTrack.anime}</p>
                        </div>
                    </div>
                )}

                <div className="rounded-xl overflow-hidden border dark:border-zinc-800 border-zinc-400 dark:bg-zinc-900/50 bg-[#d5d5da]">
                    <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_1fr_auto] gap-4 px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider border-b dark:border-zinc-800 border-zinc-200">
                        <div className="text-center">#</div>
                        <div>Title</div>
                        <div className="hidden md:block">Anime</div>
                        <div className="w-20 text-right">
                            <FaYoutube className="w-4 h-4 inline text-red-500" />
                        </div>
                    </div>

                    <div>
                        {BEST_OPENINGS.map((op, i) => (
                            <button
                                key={op.name}
                                onClick={() => setCurrentTrack(op)}
                                className="w-full grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_1fr_auto] gap-4 px-4 py-3 items-center transition-all duration-200 group text-left"
                                style={{
                                    backgroundColor: currentTrack?.youtubeId === op.youtubeId ? 'rgba(239, 68, 68, 0.15)' : hoveredIndex === i ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                }}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="text-center">
                                    {currentTrack?.youtubeId === op.youtubeId ? (
                                        <FaVolumeUp className="w-3 h-3 text-red-500 mx-auto animate-pulse" />
                                    ) : hoveredIndex === i ? (
                                        <FaPlay className="w-3 h-3 text-red-500 mx-auto" />
                                    ) : (
                                        <span className="text-zinc-500 font-medium">{i + 1}</span>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h3 className={`font-semibold truncate transition-colors ${currentTrack?.youtubeId === op.youtubeId || hoveredIndex === i ? 'text-red-500' : 'dark:text-white text-zinc-900'}`}>
                                        {op.name}
                                    </h3>
                                    <p className="text-sm text-zinc-500 truncate">{op.artist}</p>
                                </div>

                                <div className="hidden md:block">
                                    <span className="text-sm text-zinc-500 truncate">{op.anime}</span>
                                </div>

                                <div className="w-20 text-right">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${currentTrack?.youtubeId === op.youtubeId
                                        ? 'bg-red-500 text-white'
                                        : hoveredIndex === i
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        <FaPlay className="w-2 h-2" />
                                        {currentTrack?.youtubeId === op.youtubeId ? 'Playing' : 'Watch'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-sm text-zinc-500 mt-6 italic">
                    🎵 Click to watch • These OPs live rent-free in my head
                </p>
            </div>
        </section>
    )
}
