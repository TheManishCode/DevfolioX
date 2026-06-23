"use client"

import { useEffect, useState } from "react"

const GITHUB_USERNAME = "TheManishCode"

interface ContributionDay {
    date: string
    count: number
    level: number
}

const GitHubContributions = () => {
    const [allContributions, setAllContributions] = useState<ContributionDay[]>([])
    const [yearlyTotals, setYearlyTotals] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState<string>("")

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    useEffect(() => {
        const fetchContributions = async () => {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`
                )

                if (!res.ok) throw new Error("Failed to fetch")

                const data = await res.json()

                if (data.contributions) {
                    setAllContributions(data.contributions)
                }

                if (data.total) {
                    setYearlyTotals(data.total)
                    const years = Object.keys(data.total).sort((a, b) => Number(b) - Number(a))
                    if (years.length > 0) setSelectedYear(years[0])
                }
            } catch (err) {
                console.error("Error:", err)
                setError("Failed to load")
            } finally {
                setLoading(false)
            }
        }

        fetchContributions()
    }, [])

    const getContributionColor = (level: number) => {
        const colors = [
            "dark:bg-zinc-800 bg-zinc-200",
            "bg-[#0e4429]",
            "bg-[#006d32]",
            "bg-[#26a641]",
            "bg-[#39d353]",
        ]
        return colors[level] || colors[0]
    }

    // Get contributions for selected year
    const yearContributions = allContributions.filter(d => d.date.startsWith(selectedYear))

    // Group into weeks (7 days each)
    const getWeeks = () => {
        const weeks: (ContributionDay | null)[][] = []
        if (yearContributions.length === 0) return weeks

        let currentWeek: (ContributionDay | null)[] = []

        // Pad start of first week
        const firstDay = new Date(yearContributions[0]?.date)
        const startPadding = firstDay.getDay()
        for (let i = 0; i < startPadding; i++) {
            currentWeek.push(null)
        }

        yearContributions.forEach((day) => {
            currentWeek.push(day)
            if (currentWeek.length === 7) {
                weeks.push(currentWeek)
                currentWeek = []
            }
        })

        if (currentWeek.length > 0) {
            weeks.push(currentWeek)
        }

        return weeks
    }

    const weeks = getWeeks()
    const availableYears = Object.keys(yearlyTotals).sort((a, b) => Number(b) - Number(a))
    const yearTotal = yearlyTotals[selectedYear] || 0
    const grandTotal = Object.values(yearlyTotals).reduce((a, b) => a + b, 0)
    const weekColumnCount = Math.max(weeks.length, 1)

    return (
        <div className="w-full mt-16 animate-slide-up delay-300">
            <h2 className="text-xl font-semibold dark:text-white text-zinc-900 mb-6">
                Contribution Graph
            </h2>

            <div className="dark:bg-zinc-900/50 bg-[#d5d5da] rounded-xl p-4 sm:p-6 border dark:border-zinc-800 border-zinc-400 overflow-hidden">
                {/* Year tabs on top */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {availableYears.map((year) => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            aria-label={`View contributions for ${year}`}
                            aria-pressed={selectedYear === year}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedYear === year
                                ? "bg-[#33E092] text-zinc-900"
                                : "dark:bg-zinc-800 bg-zinc-400/50 dark:text-zinc-400 text-zinc-600 hover:dark:bg-zinc-700"
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>

                {/* Month labels - full width */}
                <div className="grid grid-cols-12 mb-2 text-[10px] sm:text-xs dark:text-zinc-500 text-zinc-600">
                    {months.map((m) => (
                        <span key={m} className="text-center">{m}</span>
                    ))}
                </div>

                {/* Grid - stretched to full width */}
                {loading ? (
                    <div className="h-[88px] flex items-center justify-center text-zinc-500">Loading...</div>
                ) : error ? (
                    <div className="h-[88px] flex items-center justify-center text-red-500">{error}</div>
                ) : (
                    <div
                        className="grid w-full gap-[2px]"
                        style={{ gridTemplateColumns: `repeat(${weekColumnCount}, minmax(0, 1fr))` }}
                    >
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col items-center gap-[2px]">
                                {[0, 1, 2, 3, 4, 5, 6].map((di) => {
                                    const day = week[di]
                                    return (
                                        <div
                                            key={di}
                                            className={`aspect-square w-full max-w-[10px] rounded-[2px] ${day ? getContributionColor(day.level) : "bg-transparent"
                                                }`}
                                            title={day ? `${day.count} on ${day.date}` : ""}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm">
                    <span className="dark:text-zinc-400 text-zinc-600">
                        <span className="text-[#33E092] font-medium">{yearTotal.toLocaleString()}</span> in {selectedYear}
                        <span className="mx-2 opacity-50">/</span>
                        {grandTotal.toLocaleString()} total
                    </span>
                    <div className="flex items-center gap-1 text-xs dark:text-zinc-500 text-zinc-600">
                        <span>Less</span>
                        {[0, 1, 2, 3, 4].map((l) => (
                            <div key={l} className={`w-[10px] h-[10px] rounded-sm ${getContributionColor(l)}`} />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black dark:text-[#33E092] hover:underline"
                >
                    View full profile on GitHub -&gt;
                </a>
            </div>
        </div>
    )
}

export default GitHubContributions
