"use client"

import { useState, useEffect } from "react"

export function FloatingKanji() {
    const kanjiList = ["愛", "魂", "力", "夢", "心", "光", "闇", "火", "風", "剣", "命", "絆", "希望", "勇気"]

    // Pre-calculated to avoid hydration mismatch
    const kanjiData = [
        { left: 5, top: 10, size: 100, delay: 0, duration: 12, anim: 0 },
        { left: 85, top: 5, size: 80, delay: 2, duration: 15, anim: 1 },
        { left: 15, top: 45, size: 120, delay: 1, duration: 10, anim: 2 },
        { left: 70, top: 30, size: 90, delay: 3, duration: 14, anim: 0 },
        { left: 45, top: 70, size: 110, delay: 0.5, duration: 11, anim: 1 },
        { left: 90, top: 55, size: 85, delay: 2.5, duration: 13, anim: 2 },
        { left: 25, top: 80, size: 95, delay: 1.5, duration: 16, anim: 0 },
        { left: 60, top: 15, size: 105, delay: 4, duration: 12, anim: 1 },
        { left: 10, top: 60, size: 75, delay: 3.5, duration: 14, anim: 2 },
        { left: 75, top: 75, size: 115, delay: 1, duration: 11, anim: 0 },
        { left: 40, top: 25, size: 88, delay: 2, duration: 15, anim: 1 },
        { left: 55, top: 50, size: 92, delay: 0, duration: 13, anim: 2 },
        { left: 30, top: 90, size: 78, delay: 3, duration: 10, anim: 0 },
        { left: 80, top: 85, size: 102, delay: 4.5, duration: 12, anim: 1 },
    ]

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {kanjiList.map((kanji, i) => {
                const data = kanjiData[i]
                return (
                    <div
                        key={i}
                        className={`absolute font-bold select-none floating-kanji-${data.anim}`}
                        style={{
                            left: `${data.left}%`,
                            top: `${data.top}%`,
                            fontSize: `${data.size}px`,
                            opacity: 0.04,
                            color: 'var(--kanji-color)',
                            '--anim-duration': `${data.duration}s`,
                            '--anim-delay': `${data.delay}s`,
                        } as React.CSSProperties & Record<string, string | number>}
                    >
                        {kanji}
                    </div>
                )
            })}
            <style jsx>{`
                :global(:root) {
                    --kanji-color: rgb(113, 113, 122);
                }
                :global(.dark) {
                    --kanji-color: rgb(161, 161, 170);
                }
                .floating-kanji-0 {
                    animation: float-kanji-0 var(--anim-duration) ease-in-out infinite;
                    animation-delay: var(--anim-delay);
                }
                .floating-kanji-1 {
                    animation: float-kanji-1 var(--anim-duration) ease-in-out infinite;
                    animation-delay: var(--anim-delay);
                }
                .floating-kanji-2 {
                    animation: float-kanji-2 var(--anim-duration) ease-in-out infinite;
                    animation-delay: var(--anim-delay);
                }
                @keyframes float-kanji-0 {
                    0%, 100% { transform: translateY(0) translateX(0) rotate(-3deg); }
                    25% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
                    50% { transform: translateY(-10px) translateX(-5px) rotate(-1deg); }
                    75% { transform: translateY(-25px) translateX(5px) rotate(3deg); }
                }
                @keyframes float-kanji-1 {
                    0%, 100% { transform: translateY(0) translateX(0) rotate(2deg); }
                    33% { transform: translateY(-15px) translateX(-10px) rotate(-2deg); }
                    66% { transform: translateY(-30px) translateX(8px) rotate(1deg); }
                }
                @keyframes float-kanji-2 {
                    0%, 100% { transform: translateY(0) translateX(0) rotate(-1deg); }
                    50% { transform: translateY(-20px) translateX(-15px) rotate(3deg); }
                }
            `}</style>
        </div>
    )
}

export function GlitchText({ children, className = "" }: { children: string; className?: string }) {
    return (
        <span className={`glitch-text relative inline-block ${className}`} data-text={children}>
            {children}
            <style jsx>{`
                .glitch-text {
                    position: relative;
                }
                .glitch-text::before,
                .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.8;
                }
                .glitch-text::before {
                    color: #33E092;
                    animation: glitch-1 2s infinite linear alternate-reverse;
                    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
                }
                .glitch-text::after {
                    color: #00ffff;
                    animation: glitch-2 3s infinite linear alternate-reverse;
                    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
                }
                @keyframes glitch-1 {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-2px); }
                    40% { transform: translateX(2px); }
                    60% { transform: translateX(-1px); }
                    80% { transform: translateX(1px); }
                }
                @keyframes glitch-2 {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(2px); }
                    40% { transform: translateX(-2px); }
                    60% { transform: translateX(1px); }
                    80% { transform: translateX(-1px); }
                }
            `}</style>
        </span>
    )
}

export function PowerLevelDisplay({ level, label }: { level: number; label: string }) {
    const [displayLevel, setDisplayLevel] = useState(0)

    useEffect(() => {
        let current = 0
        const increment = level / 50
        const timer = setInterval(() => {
            current += increment
            if (current >= level) {
                setDisplayLevel(level)
                clearInterval(timer)
            } else {
                setDisplayLevel(Math.floor(current))
            }
        }, 30)
        return () => clearInterval(timer)
    }, [level])

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#33E092] via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition" />
            <div className="relative p-6 dark:bg-zinc-900/90 bg-[#d5d5da] backdrop-blur-sm border dark:border-[#33E092]/30 border-zinc-400 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)"
                }} />
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#33E092] animate-pulse" />
                <div className="text-xs text-[#33E092] uppercase tracking-widest mb-2 font-mono">
                    {'>'} SCANNING...
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#33E092] to-purple-400 font-mono">
                    {displayLevel.toLocaleString()}
                </div>
                <div className="text-xs dark:text-zinc-500 text-zinc-600 uppercase tracking-widest mt-2">{label}</div>
            </div>
        </div>
    )
}
