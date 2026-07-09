"use client"

import animeData from "@/data/anime.json"
import Pokedex3D from "./Pokedex3D"

export function CurrentlyWatchingSection() {
    return (
        <section className="px-6 py-20 mt-12 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-red-500 to-[#33E092] rounded-full" />
                    <h2 className="text-3xl font-bold dark:text-white text-zinc-900">Currently Watching</h2>
                    <span className="text-2xl">📺</span>
                </div>
                <Pokedex3D watchlist={animeData.watchingNow} />
            </div>
        </section>
    )
}
