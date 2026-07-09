"use client"

import { useState, useEffect } from "react"
import { BiSolidQuoteRight } from "react-icons/bi"
import animeData from "@/data/anime.json"

export function TypewriterQuote() {
    const quotes = animeData.favorites.filter(a => a.quote).map(a => ({ quote: a.quote!, title: a.title }))
    const [currentIndex, setCurrentIndex] = useState(0)
    const [displayText, setDisplayText] = useState("")
    const [isTyping, setIsTyping] = useState(true)

    useEffect(() => {
        if (quotes.length === 0) return
        const currentQuote = quotes[currentIndex].quote

        if (isTyping) {
            if (displayText.length < currentQuote.length) {
                const timer = setTimeout(() => {
                    setDisplayText(currentQuote.slice(0, displayText.length + 1))
                }, 35)
                return () => clearTimeout(timer)
            } else {
                const timer = setTimeout(() => setIsTyping(false), 3500)
                return () => clearTimeout(timer)
            }
        } else {
            setDisplayText("")
            setCurrentIndex((prev) => (prev + 1) % quotes.length)
            setIsTyping(true)
        }
    }, [displayText, isTyping, currentIndex, quotes])

    if (quotes.length === 0) return null

    return (
        <div className="relative py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden tracking-tight text-lg lg:py-6 lg:pl-6 pr-12 p-4 border dark:border-zinc-800 border-zinc-200 rounded-md">
                    <BiSolidQuoteRight
                        className="text-7xl absolute -top-7 -right-5 -rotate-12 dark:text-zinc-800 text-zinc-200"
                        aria-hidden="true"
                    />
                    <p className="text-base md:text-lg dark:text-zinc-300 text-zinc-700 leading-relaxed">
                        {displayText}<span className="animate-pulse text-[#33E092]">|</span>
                    </p>
                    <p className="text-sm dark:text-zinc-500 text-zinc-500 mt-3 flex items-center gap-2">
                        <span className="text-orange-400">⚡</span>
                        <span>— {quotes[currentIndex].title}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
