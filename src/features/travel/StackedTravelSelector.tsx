"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import travelsData from "@/data/travels.json"

interface Travel {
    name: string
    region: string
    year: string
    href: string
}

const TRAVELS = travelsData.travels as Travel[]

// ─── Layout constants ────────────────────────────────────────────────────────
const PILL_H = 44          // card height in px
const PEEK_SHIFT = 7       // px each card peeks below the one above (collapsed)
const PEEK_VISIBLE = 2     // how many peek cards show under the top card
const EXPANDED_GAP = 54    // center-to-center distance between expanded cards (PILL_H + 10px gap)

export default function StackedTravelSelector() {
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const close = useCallback(() => setOpen(false), [])

    // Close on click outside
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open, close])

    // Close on Escape
    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [open, close])

    // Container height only needs to fit the collapsed stack —
    // expanded cards float upward via overflow:visible
    const peekCount = Math.min(TRAVELS.length - 1, PEEK_VISIBLE)
    const collapsedH = PILL_H + peekCount * PEEK_SHIFT

    return (
        <div
            ref={rootRef}
            className="relative inline-block"
            style={{ width: 224, height: collapsedH, overflow: "visible" }}
        >
            {TRAVELS.map((travel, i) => {
                const isLatest = i === 0
                // Collapsed: only the top card + PEEK_VISIBLE decorative strips
                const isPeek = !open && i > 0 && i <= PEEK_VISIBLE
                if (!open && i > PEEK_VISIBLE) return null

                /* ── Transform ── */
                let ty: number, sc: number, zi: number, transition: string

                if (open) {
                    // Expand upward: newest (i=0) stays as anchor at bottom,
                    // older destinations float up above it
                    ty = -(i * EXPANDED_GAP)
                    sc = 1
                    zi = TRAVELS.length + 10 - i
                    // Stagger open: lower cards animate first (they travel less distance)
                    transition = `transform 0.46s cubic-bezier(0.34,1.56,0.64,1) ${i * 35}ms,
                                  opacity 0.28s ease ${i * 25}ms`
                } else {
                    // Collapsed: each card shifts down by PEEK_SHIFT so its bottom
                    // peeks out below the card above it — pure depth illusion
                    ty = i * PEEK_SHIFT
                    sc = 1 - i * 0.016   // very subtle scale reduction per layer
                    zi = TRAVELS.length + 10 - i   // newest always on top
                    // Collapse: no stagger, all snap back simultaneously
                    transition = "transform 0.3s cubic-bezier(0.25,1,0.5,1), opacity 0.22s ease"
                }

                return (
                    <div
                        key={travel.name}
                        className="absolute inset-x-0"
                        style={{
                            height: PILL_H,
                            top: 0,
                            transform: `translateY(${ty}px) scale(${sc})`,
                            zIndex: zi,
                            // Peek cards are purely decorative — zero interaction
                            pointerEvents: isPeek ? "none" : "auto",
                            transition,
                            willChange: "transform",
                        }}
                    >
                        {/* ── Decorative peek strip (collapsed only) ── */}
                        {isPeek && (
                            <PeekStrip depth={i} />
                        )}

                        {/* ── Top card collapsed: click to expand ── */}
                        {!open && isLatest && (
                            <TravelCard
                                travel={travel}
                                isLatest
                                as="button"
                                onClick={() => setOpen(true)}
                                aria-expanded={false}
                                aria-label={`Travels — ${travel.name}, ${travel.region}. Click to see all.`}
                            />
                        )}

                        {/* ── All cards expanded: click to navigate ── */}
                        {open && (
                            <TravelCard
                                travel={travel}
                                isLatest={isLatest}
                                as="link"
                                href={travel.href}
                                onClick={close}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ─── Card shell ───────────────────────────────────────────────────────────────

const CARD_CLASS = [
    "flex items-center gap-2.5 w-full h-full px-3.5 rounded-full border",
    "bg-[#d5d5da] dark:bg-zinc-900",
    "border-zinc-200 dark:border-zinc-800",
    "shadow-[0_1px_2px_rgba(0,0,0,0.07),0_1px_1px_rgba(0,0,0,0.04)]",
    "dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
    "hover:border-zinc-300 dark:hover:border-zinc-700",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#33E092]/50 focus-visible:ring-offset-1",
].join(" ")

type CardProps = {
    travel: Travel
    isLatest: boolean
} & (
    | { as: "button"; onClick: () => void; "aria-expanded": boolean; "aria-label": string; href?: never }
    | { as: "link"; href: string; onClick: () => void; "aria-expanded"?: never; "aria-label"?: never }
)

function TravelCard({ travel, isLatest, as, href, onClick, ...rest }: CardProps) {
    const inner = (
        <>
            <MapPin
                size={11}
                strokeWidth={2}
                className="shrink-0 text-zinc-400 dark:text-zinc-500"
            />
            <div className="flex flex-col flex-1 min-w-0 justify-center" style={{ gap: 2 }}>
                <span className="font-incognito text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none truncate">
                    {travel.name}
                </span>
                <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 leading-none truncate">
                    {travel.region}
                </span>
            </div>
            {isLatest
                ? <NewBadge />
                : <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0 tabular-nums">{travel.year}</span>
            }
        </>
    )

    if (as === "link") {
        return (
            <Link href={href!} onClick={onClick} className={`${CARD_CLASS} cursor-pointer`}>
                {inner}
            </Link>
        )
    }

    return (
        <button onClick={onClick} className={`${CARD_CLASS} cursor-pointer`} {...rest}>
            {inner}
        </button>
    )
}

// ─── Decorative depth strip ───────────────────────────────────────────────────
// Only the bottom PEEK_SHIFT px of this card is visible below the card above it.
// Purely visual — conveys stack depth, no interactivity.
function PeekStrip({ depth }: { depth: number }) {
    return (
        <div
            aria-hidden="true"
            className="w-full h-full rounded-full border bg-[#d5d5da] dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            // Deeper cards have very slightly muted borders
            style={{ opacity: depth === 1 ? 0.9 : 0.7 }}
        />
    )
}

// ─── "New" badge ─────────────────────────────────────────────────────────────
// Signals the most recently visited destination — adapted from the pill-badge
// pattern in the design reference, themed to the site's accent green.
function NewBadge() {
    return (
        <span
            aria-label="Most recent"
            className="shrink-0 inline-flex items-center px-2 py-[3px] rounded-full
                text-[8px] font-mono font-bold uppercase tracking-wider leading-none
                bg-[#33E092]/12 text-emerald-600 border border-[#33E092]/25
                dark:bg-[#33E092]/10 dark:text-[#33E092] dark:border-[#33E092]/20"
        >
            New
        </span>
    )
}
