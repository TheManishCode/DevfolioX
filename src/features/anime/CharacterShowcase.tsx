"use client"

import type { CSSProperties } from "react"

interface Character {
    name: string
    anime: string
    role: string
    image: string
    color: string
    imagePosition?: string
}

type PolaroidVars = CSSProperties & {
    "--polaroid-rotate": string
    "--polaroid-offset": string
    "--caption-rotate": string
}

const BEST_CHARACTERS: Character[] = [
    { name: "Monkey D. Luffy", anime: "One Piece", role: "Most Wanted", image: "https://cdn.myanimelist.net/images/characters/9/310307.jpg", color: "#EF4444" },
    { name: "Yami Sukehiro", anime: "Black Clover", role: "Captain Goals", image: "https://cdn.manishp.dev/characters/yami.png", color: "#7C3AED", imagePosition: "center center" },
    { name: "Benimaru Shinmon", anime: "Fire Force", role: "Strongest", image: "https://cdn.myanimelist.net/images/characters/5/397594.jpg", color: "#F59E0B" },
    { name: "Makima", anime: "Chainsaw Man", role: "Best Villain", image: "https://cdn.myanimelist.net/images/characters/4/489561.jpg", color: "#EF4444" },
    { name: "Buggy", anime: "One Piece", role: "The Clown", image: "https://cdn.myanimelist.net/images/characters/6/69112.jpg", color: "#3B82F6" },
]

const polaroidStyles = [
    { rotate: -6, translateY: 0 },
    { rotate: 4, translateY: 20 },
    { rotate: -3, translateY: -10 },
    { rotate: 7, translateY: 15 },
    { rotate: -5, translateY: 5 },
]

const tapeColors = ['#f5e6a3', '#c4e3cb', '#f5d0d0', '#d0e8f5', '#e8d0f5']

export function CharacterShowcase() {
    return (
        <section className="px-6 py-20 relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-sm text-zinc-500 mb-2">📌 pinned to my wall</p>
                    <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-zinc-900">
                        My Favorite Characters
                    </h2>
                </div>

                <div className="grid grid-cols-2 min-[460px]:grid-cols-3 md:flex md:flex-wrap justify-center gap-x-4 gap-y-10 md:gap-4 lg:gap-2">
                    {BEST_CHARACTERS.map((char, i) => {
                        const style = polaroidStyles[i % polaroidStyles.length]
                        const tapeColor = tapeColors[i % tapeColors.length]

                        return (
                            <div
                                key={char.name}
                                className="relative group justify-self-center transition-all duration-300 hover:z-20 hover:scale-105 md:[transform:rotate(var(--polaroid-rotate))_translateY(var(--polaroid-offset))]"
                                style={{
                                    "--polaroid-rotate": `${style.rotate}deg`,
                                    "--polaroid-offset": `${style.translateY}px`,
                                    "--caption-rotate": `${-style.rotate}deg`,
                                } as PolaroidVars}
                            >
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 z-10 opacity-80"
                                    style={{
                                        background: `linear-gradient(180deg, ${tapeColor} 0%, ${tapeColor}dd 100%)`,
                                        transform: `rotate(${-style.rotate * 0.3}deg)`,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    }}
                                />

                                <div
                                    className="relative bg-white p-2.5 md:p-3 pb-14 md:pb-16 shadow-xl transition-shadow duration-300 group-hover:shadow-2xl"
                                    style={{
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 8px 40px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <div
                                        className="w-32 h-40 md:w-40 md:h-48 overflow-hidden flex items-center justify-center"
                                        style={{ backgroundColor: char.color + '20' }}
                                    >
                                        <img
                                            src={char.image}
                                            alt={char.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            style={{ objectPosition: char.imagePosition || 'center center' }}
                                        />
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3 min-w-0">
                                        <p
                                            className="text-sm md:text-lg font-medium text-zinc-800 mb-0.5 truncate"
                                            style={{ fontFamily: 'Georgia, serif' }}
                                            title={char.name}
                                        >
                                            {char.name}
                                        </p>
                                        <span
                                            className="inline-block px-2 py-0.5 text-xs font-bold text-white rounded"
                                            style={{ backgroundColor: char.color }}
                                        >
                                            {char.role}
                                        </span>
                                    </div>
                                </div>

                                <p
                                    className="text-center text-sm text-zinc-500 mt-2 italic md:[transform:rotate(var(--caption-rotate))]"
                                    style={{
                                        fontFamily: 'Georgia, serif',
                                    }}
                                >
                                    {char.anime}
                                </p>
                            </div>
                        )
                    })}
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-zinc-500 italic">
                        ✨ these characters live rent-free in my head ✨
                    </p>
                </div>
            </div>
        </section>
    )
}
