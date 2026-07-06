"use client"

import { useState, useEffect, useCallback } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { SessionProvider } from "@/components/providers/SessionProvider"

interface GuestbookEntry {
    id: number
    name: string
    message: string
    image?: string | null
    provider: string
    isTest: boolean
    createdAt: string
}

const UserAvatar = ({ src, name, className = "w-10 h-10" }: { src?: string | null; name: string; className?: string }) => {
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        setImgError(false)
    }, [src])

    const getInitials = (n: string) =>
        n.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)

    if (!src || imgError) {
        return (
            <div className={`${className} rounded-full bg-[#d5d5da] dark:bg-zinc-800 flex items-center justify-center flex-shrink-0`}>
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{getInitials(name)}</span>
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={name}
            className={`${className} rounded-full flex-shrink-0 object-cover`}
            onError={() => setImgError(true)}
        />
    )
}

export default function GuestbookPage() {
    return (
        <SessionProvider>
            <GuestbookPageContent />
        </SessionProvider>
    )
}

function GuestbookPageContent() {
    const { data: session, status } = useSession()
    const [entries, setEntries] = useState<GuestbookEntry[]>([])
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    const fetchEntries = useCallback(async () => {
        try {
            const res = await fetch("/api/guestbook")
            if (!res.ok) throw new Error("Failed to load entries")
            const data = await res.json()
            // Only show real (non-test) entries to visitors
            setEntries(data.filter((e: GuestbookEntry) => !e.isTest))
        } catch {
            setError("Couldn't load entries. The database may not be configured yet.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEntries()
    }, [fetchEntries])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user || !message.trim()) return

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message.trim() }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Something went wrong")
                return
            }

            // Don't show test entries in the list
            if (!data.isTest) {
                setEntries((prev) => [data, ...prev])
            }
            setMessage("")
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch {
            setError("Failed to submit. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return (
        <main className="max-w-3xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            {/* Header */}
            <section className="mb-12 animate-slide-up">
                <h1 className="font-incognito font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight text-black dark:text-white">
                    Guestbook
                </h1>
                <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-2xl leading-relaxed">
                    Sign in to leave a message. Let me know you stopped by!
                </p>
            </section>

            {/* Sign Form or Login */}
            <section className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="p-6 rounded-xl border dark:border-zinc-800/50 border-zinc-200/50">
                    {status === "loading" ? (
                        <div className="flex items-center justify-center py-8">
                            <svg className="w-6 h-6 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : session ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={session.user?.image} name={session.user?.name || "?"} />
                                    <div>
                                        <p className="text-sm font-medium dark:text-white text-zinc-900">{session.user?.name}</p>
                                        <p className="text-xs text-zinc-500">{session.user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <textarea
                                        id="guestbook-message"
                                        aria-label="Guestbook message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                                        placeholder="Leave a message..."
                                        rows={3}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border dark:border-zinc-800 border-zinc-400 bg-[#d5d5da] dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors text-sm resize-none"
                                    />
                                    <p className="text-xs text-zinc-400 mt-1 text-right">{message.length}/200</p>
                                </div>

                                {error && (
                                    <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
                                )}

                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !message.trim()}
                                        className="px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Signing...
                                            </>
                                        ) : (
                                            "Sign Guestbook"
                                        )}
                                    </button>

                                    {showSuccess && (
                                        <span className="text-sm text-zinc-500 flex items-center gap-1.5 animate-in fade-in">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Signed!
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-zinc-500 mb-6">Sign in with your account to leave a message</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={() => signIn("github")}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border dark:border-zinc-800 border-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all text-sm font-medium dark:text-white text-zinc-900"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    Sign in with GitHub
                                </button>
                                <button
                                    onClick={() => signIn("linkedin")}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border dark:border-zinc-800 border-zinc-200 hover:border-[#0A66C2] dark:hover:border-[#0A66C2] transition-all text-sm font-medium dark:text-white text-zinc-900"
                                >
                                    <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    Sign in with LinkedIn
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Entries */}
            <section className="mb-32">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl border dark:border-zinc-800/30 border-zinc-200/30 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error && entries.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center py-8">{error}</p>
                ) : entries.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-medium text-zinc-500">
                                {entries.length} {entries.length === 1 ? "signature" : "signatures"}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {entries.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="flex gap-4 p-4 rounded-xl border dark:border-zinc-800/30 border-zinc-200/30 animate-slide-up"
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <UserAvatar src={entry.image} name={entry.name} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-zinc-900 dark:text-white">{entry.name}</span>
                                            <span className="text-xs text-zinc-400">•</span>
                                            <span className="text-xs text-zinc-400">{formatDate(entry.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{entry.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d5d5da] dark:bg-zinc-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <p className="text-zinc-500 text-sm">No signatures yet. Be the first to sign!</p>
                    </div>
                )}
            </section>
        </main>
    )
}
