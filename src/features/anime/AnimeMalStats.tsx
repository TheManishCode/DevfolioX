"use client"

import { useState, useEffect } from "react"
import animeData from "@/data/anime.json"
import { StatCard } from "./StatCard"

export function AnimeMalStats() {
    const [stats, setStats] = useState({
        totalWatched: animeData.stats.totalWatched,
        episodesWatched: animeData.stats.episodesWatched,
        daysWatched: animeData.stats.daysWatched,
        meanScore: animeData.stats.meanScore
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/mal?type=stats')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setStats({
                        totalWatched: data.totalWatched || animeData.stats.totalWatched,
                        episodesWatched: data.episodesWatched || animeData.stats.episodesWatched,
                        daysWatched: data.daysWatched || animeData.stats.daysWatched,
                        meanScore: data.meanScore || animeData.stats.meanScore
                    })
                }
            })
            .catch(err => console.error('Failed to fetch MAL stats:', err))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
            <StatCard
                value={isLoading ? '...' : stats.totalWatched}
                label="COMPLETED"
                color="from-[#33E092] to-emerald-500"
            />
            <StatCard
                value={isLoading ? '...' : stats.episodesWatched.toLocaleString()}
                label="EPISODES"
                color="from-purple-500 to-blue-500"
            />
            <StatCard
                value={isLoading ? '...' : `${stats.daysWatched}d`}
                label="WATCH TIME"
                color="from-blue-500 to-cyan-500"
            />
            <StatCard
                value={isLoading ? '...' : stats.meanScore}
                label="AVG SCORE"
                color="from-yellow-500 to-orange-500"
            />
        </div>
    )
}
