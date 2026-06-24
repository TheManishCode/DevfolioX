"use client"

import { useState, useEffect, useRef } from "react"
import { signIn, useSession } from "next-auth/react"

// Social Links
const socialLinks = [
    {
        name: "GitHub",
        handle: "@TheManishCode",
        url: "https://github.com/TheManishCode",
        icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>),
        description: "Source code & contributions"
    },
    {
        name: "LinkedIn",
        handle: "ManishP",
        url: "https://www.linkedin.com/in/rixscx",
        icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>),
        description: "Professional networking"
    },
    {
        name: "Email",
        handle: "manishp.dev@gmail.com",
        url: "mailto:manishp.dev@gmail.com",
        icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
        description: "Direct communication"
    },
    {
        name: "Calendar",
        handle: "Book a meeting",
        url: "https://cal.com/manishp.dev",
        icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
        description: "Schedule a call"
    },
    {
        name: "Twitter / X",
        handle: "@manishp_dev",
        url: "https://twitter.com/manishp_dev",
        icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>),
        description: "Updates & thoughts"
    }
]

export default function ConnectPage() {
    const { data: session } = useSession()
    const [currentTime, setCurrentTime] = useState("")
    const [activeStep, setActiveStep] = useState<"initial" | "processing" | "completed">("initial")
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
    const notifiedRef = useRef(false)

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", hour12: true }))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    // Handle OAuth callback - detect success, fire connection request
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get("status") === "success") {
            setActiveStep("completed")
            window.history.replaceState({}, "", window.location.pathname)
        }
        if (params.get("error")) {
            window.history.replaceState({}, "", window.location.pathname)
        }
    }, [])

    // After auth completes and session is available, notify via /api/connect
    useEffect(() => {
        if (activeStep === "completed" && session?.user && !notifiedRef.current) {
            notifiedRef.current = true
            fetch("/api/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            }).catch(() => {/* non-fatal */})
        }
    }, [activeStep, session])

    const triggerAuth = (provider: string) => {
        setSelectedProvider(provider)
        setActiveStep("processing")
        signIn(provider.toLowerCase(), {
            callbackUrl: window.location.origin + "/connect?status=success",
        })
    }

    return (
        <main className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            {/* Header */}
            <section className="mb-16 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
                        </span>
                        <span className="text-sm dark:text-zinc-400 text-zinc-500 uppercase tracking-widest font-medium text-[11px]">Available</span>
                    </div>
                    <span className="dark:text-zinc-600 text-zinc-300">•</span>
                    <span className="text-sm font-mono dark:text-zinc-500 text-zinc-400">IST {currentTime}</span>
                </div>

                <h1 className="font-incognito font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight text-black dark:text-white">
                    Get in <span className="dark:text-zinc-400 text-zinc-600">Touch</span>
                </h1>

                <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-2xl leading-relaxed">
                    Interested in working together? Reach out through any of the channels below or authenticate to send a verified connection request.
                </p>
            </section>

            <div className="grid lg:grid-cols-3 gap-12 mb-32">
                {/* Directory Section */}
                <div className="lg:col-span-2">
                    <h2 className="font-incognito text-xl font-semibold dark:text-white text-zinc-900 mb-6">Directory</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {socialLinks.map((link, index) => (
                            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="group p-5 rounded-lg border dark:border-zinc-800 border-zinc-400 dark:bg-zinc-900/10 bg-[#d5d5da] hover:border-zinc-500 dark:hover:border-zinc-600 transition-all animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-lg dark:bg-zinc-800 bg-[#d5d5da] dark:text-zinc-400 text-zinc-600 group-hover:dark:text-white group-hover:text-zinc-900 transition-colors">{link.icon}</div>
                                    <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} /></svg>
                                </div>
                                <h3 className="font-incognito font-semibold dark:text-white text-zinc-900 mb-1">{link.name}</h3>
                                <p className="dark:text-zinc-400 text-zinc-500 font-mono text-sm">{link.handle}</p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Handshake Component */}
                <div className="lg:col-span-1">
                    <h2 className="font-incognito text-xl font-semibold dark:text-white text-zinc-900 mb-6">Handshake</h2>

                    <div className="relative min-h-[280px] p-6 rounded-xl border dark:border-zinc-800/50 border-zinc-200/50 overflow-hidden animate-slide-up">

                        {activeStep === "initial" && (
                            <div className="space-y-6">
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    Select an identity provider to initiate a verified connection. Your profile details will be sent for review.
                                </p>
                                <div className="grid gap-3">
                                    {/* LinkedIn OAuth Button */}
                                    <button
                                        onClick={() => triggerAuth("LinkedIn")}
                                        aria-label="Connect via LinkedIn"
                                        className="group flex items-center gap-3 px-4 py-3.5 rounded-lg border dark:border-zinc-800 border-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-600 hover:bg-zinc-400/30 dark:hover:bg-zinc-900/50 transition-all text-sm font-medium"
                                    >
                                        <div className="p-1.5 rounded-md bg-[#0A66C2]/10">
                                            <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                        <span className="flex-1 text-left dark:text-white text-zinc-900">Connect via LinkedIn</span>
                                        <svg className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} /></svg>
                                    </button>

                                    {/* GitHub OAuth Button */}
                                    <button
                                        onClick={() => triggerAuth("GitHub")}
                                        aria-label="Verify via GitHub"
                                        className="group flex items-center gap-3 px-4 py-3.5 rounded-lg border dark:border-zinc-800 border-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-600 hover:bg-zinc-400/30 dark:hover:bg-zinc-900/50 transition-all text-sm font-medium"
                                    >
                                        <div className="p-1.5 rounded-md bg-[#d5d5da] dark:bg-zinc-800">
                                            <svg className="w-4 h-4 dark:text-white text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </div>
                                        <span className="flex-1 text-left dark:text-white text-zinc-900">Verify via GitHub</span>
                                        <svg className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeStep === "processing" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-transparent backdrop-blur-md transition-all duration-500">
                                <div className="relative">
                                    {/* Pulse Waves */}
                                    <div className="absolute inset-0 rounded-full animate-ping bg-zinc-400/20 dark:bg-zinc-500/20 duration-1000" />
                                    <div className="absolute inset-0 rounded-full animate-ping bg-zinc-400/10 dark:bg-zinc-500/10 duration-1000 delay-300" />

                                    {/* Central Icon */}
                                    <div className="relative w-16 h-16 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-[#d5d5da] dark:bg-black flex items-center justify-center shadow-xl">
                                        <svg className="w-6 h-6 text-zinc-800 dark:text-zinc-200 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.578-4.18M7 9h1m-1-4h1m4-4H7m4 4h1" />
                                        </svg>
                                    </div>

                                    {/* Scanning Ring */}
                                    <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] animate-spin-slow text-zinc-800 dark:text-zinc-200" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="40 100" strokeLinecap="round" />
                                    </svg>
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Verifying Identity</h3>
                                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1 justify-center">
                                        Connecting to <span className="uppercase">{selectedProvider}</span>
                                        <span className="flex gap-0.5">
                                            <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce delay-0" />
                                            <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce delay-100" />
                                            <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce delay-200" />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeStep === "completed" && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95">
                                <div className="p-4 rounded-lg bg-[#d5d5da] dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-800">
                                    <h4 className="dark:text-white text-zinc-900 text-sm font-bold flex items-center gap-2">
                                        <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} /></svg>
                                        Connection Sent
                                    </h4>
                                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                        Your identity has been verified. I&apos;ll review and respond shortly via {selectedProvider}.
                                    </p>
                                </div>
                                <button onClick={() => setActiveStep("initial")} className="w-full py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors border dark:border-zinc-800 border-zinc-200 rounded-lg hover:border-zinc-500 dark:hover:border-zinc-600">
                                    Send Another
                                </button>
                            </div>
                        )}

                        {/* Subtle grid pattern */}
                        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(currentColor 0.5px, transparent 0.5px)`, backgroundSize: '16px 16px' }} />
                    </div>
                </div>
            </div>

            {/* Support Section */}
            <section className="mb-32 animate-slide-up">
                <h2 className="font-incognito text-xl font-semibold dark:text-white text-zinc-900 mb-6">Support</h2>
                <div className="p-6 rounded-xl border dark:border-zinc-800/50 border-zinc-200/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="p-3 rounded-xl bg-[#FFDD00]/10 border border-[#FFDD00]/20">
                            {/* Official Buy Me a Coffee Logo */}
                            <svg className="w-10 h-10" viewBox="0 0 884 1279" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M791.109 297.518L790.231 297.002L788.201 296.383C789.018 297.072 790.04 297.472 791.109 297.518Z" fill="#0D0C22" />
                                <path d="M803.896 388.891L802.916 389.166L803.896 388.891Z" fill="#0D0C22" />
                                <path d="M791.484 297.377C791.359 297.361 791.237 297.332 791.118 297.29C791.111 297.371 791.111 297.453 791.118 297.534C791.252 297.516 791.379 297.466 791.484 297.377Z" fill="#0D0C22" />
                                <path d="M791.113 297.529H791.244V297.447L791.113 297.529Z" fill="#0D0C22" />
                                <path d="M803.111 388.726L804.591 387.883L805.142 387.573L805.641 387.04C804.702 387.444 803.846 388.016 803.111 388.726Z" fill="#0D0C22" />
                                <path d="M793.669 299.515L792.223 298.138L791.243 297.605C791.77 298.535 792.641 299.221 793.669 299.515Z" fill="#0D0C22" />
                                <path d="M430.019 1186.18C428.864 1186.68 427.852 1187.46 427.076 1188.45L427.988 1187.87C428.608 1187.3 429.485 1186.56 430.019 1186.18Z" fill="#0D0C22" />
                                <path d="M641.187 1144.63C641.187 1143.33 640.551 1143.57 640.705 1148.21C640.705 1147.84 640.86 1147.46 640.929 1147.1C641.015 1146.27 641.084 1145.46 641.187 1144.63Z" fill="#0D0C22" />
                                <path d="M619.284 1186.18C618.129 1186.68 617.118 1187.46 616.342 1188.45L617.254 1187.87C617.873 1187.3 618.751 1186.56 619.284 1186.18Z" fill="#0D0C22" />
                                <path d="M281.304 1196.06C280.427 1195.3 279.354 1194.8 278.207 1194.61C279.136 1195.06 280.065 1195.51 280.684 1195.85L281.304 1196.06Z" fill="#0D0C22" />
                                <path d="M247.841 1164.01C247.704 1162.66 247.288 1161.35 246.619 1160.16C247.093 1161.39 247.489 1162.66 247.806 1163.94L247.841 1164.01Z" fill="#0D0C22" />
                                <path d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z" fill="#FFDD00" />
                                <path d="M78.6885 386.132L79.4799 386.872L79.9962 387.182C79.5765 386.792 79.1344 386.428 78.6885 386.132Z" fill="#0D0C22" />
                                <path d="M879.567 341.849L872.53 306.352C866.215 274.503 851.882 244.409 819.19 232.898C808.711 229.215 796.821 227.633 788.786 220.01C780.751 212.388 778.376 200.55 776.518 189.572C773.076 169.423 769.842 149.257 766.314 129.143C763.269 111.85 760.86 92.4243 752.928 76.56C742.604 55.2584 721.182 42.8009 699.88 34.559C688.965 30.4844 677.826 27.0375 666.517 24.2352C613.297 10.1947 557.342 5.03277 502.591 2.09047C436.875 -1.53577 370.983 -0.443234 305.422 5.35968C256.625 9.79894 205.229 15.1674 158.858 32.0469C141.91 38.224 124.445 45.6399 111.558 58.7341C95.7448 74.8221 90.5829 99.7026 102.128 119.765C110.336 133.552 124.324 144.647 138.888 151.811C163.814 164.041 191.424 169.967 218.761 176.271C235.017 179.894 251.475 182.637 268.057 185.66C286.201 189.058 304.847 192.061 322.345 196.983C374.076 211.178 382.129 227.208 383.204 227.208C387.891 227.208 396.662 207.894 413.889 192.32C431.86 176.053 456.455 161.028 489.109 149.876C495.857 147.68 502.605 145.625 509.353 143.678C526.509 138.77 543.858 134.634 561.327 131.297C578.883 127.894 596.69 126.093 614.573 126.035C691.674 123.93 752.54 168.321 767.365 242.913C770.394 257.323 776.869 294.456 778.595 309.093C779.835 319.734 782.751 330.116 787.275 339.857C791.555 349.103 798.634 356.674 807.424 361.648C813.044 364.702 819.089 366.969 825.37 368.389C837.063 371.102 849.114 372.2 861.128 371.655C873.71 371.038 886.574 367.683 897.197 360.577C899.814 358.803 902.197 356.691 904.311 354.283C916.018 341.049 912.267 319.462 910.478 302.249C906.941 268.232 901.376 234.263 892.544 201.206C886.048 176.652 877.466 152.378 863.086 131.263C854.34 118.48 843.479 106.873 831.257 96.7368C813.62 81.9657 793.501 70.3915 771.839 62.5709C758.916 57.6684 744.759 54.2634 731.262 50.4395C720.816 47.4694 710.257 44.9098 699.703 42.235C655.133 31.4164 609.109 24.6007 562.835 22.1233C495.248 18.6215 427.044 21.6095 360.324 32.2914C319.027 39.0219 278.385 49.3803 239.203 63.2114C219.234 70.1987 198.815 78.1783 180.799 89.2125C163.233 100.39 147.685 114.428 134.838 130.645C121.991 146.861 118.663 163.56 118.732 183.439C118.826 212.633 130.915 239.15 144.582 264.294C150.025 274.127 156.473 283.313 163.85 291.705C169.709 298.616 176.893 304.167 181.482 312.131C186.478 320.803 184.025 331.104 183.249 340.74C182.179 355.012 182.659 369.577 184.948 383.906C190.91 420.818 206.357 455.623 231.461 483.116C234.217 486.14 237.007 489.164 240.107 491.879C255.222 505.279 277.2 507.772 295.414 513.609C337.693 527.472 378.741 544.381 418.334 564.165C437.503 573.762 456.916 583.042 477.391 590.02C514.979 602.953 548.478 580.93 577.753 559.886C634.669 518.792 681.126 466.212 718.971 408.281C722.556 403.087 725.966 397.771 729.26 392.391C729.96 391.218 730.66 390.028 731.36 388.855C739.576 374.939 746.949 360.48 754.377 346.108L755.327 344.263C758.098 338.883 760.938 333.503 763.552 327.982C768.928 316.655 773.931 305.167 778.547 293.46C785.547 275.886 791.658 257.887 797.547 239.888C799.047 235.27 802.449 226.138 804.156 221.852C804.379 221.285 806.889 215.143 808.479 214.039C809.398 213.388 810.532 213.109 811.649 213.259C812.766 213.409 813.791 213.977 814.525 214.853C816.056 216.648 817.138 218.791 817.681 221.092C820.988 234.229 824.243 247.366 827.447 260.503C828.515 264.878 829.549 269.27 830.617 273.645C834.061 287.779 837.505 301.896 841.364 315.891C843.432 323.425 845.759 330.846 848.258 338.285C849.49 341.888 850.722 345.508 851.954 349.128C856.617 362.558 862.339 375.842 871.063 386.811C879.787 397.78 892.308 406.192 905.728 407.846C907.228 408.025 908.757 408.125 910.217 408.125C929.127 408.125 944.637 393.787 954.127 378.574C967.367 357.46 973.037 332.873 971.437 308.39C970.837 299.485 969.237 290.699 966.637 282.168C964.052 273.6 960.372 265.384 955.669 257.692C948.227 245.342 938.202 234.717 926.293 226.468C918.887 221.282 910.952 216.853 902.616 213.243C898.346 211.386 893.97 209.8 889.519 208.493C883.133 206.646 876.469 205.823 869.787 206.054C864.659 206.317 859.654 207.72 854.953 209.768C850.252 211.816 845.845 214.487 841.795 217.72C825.78 230.29 817.217 250.735 814.075 270.256C812.615 279.345 812.08 288.568 812.373 297.783C812.545 304.002 812.958 310.204 813.613 316.379C814.268 322.554 815.127 328.678 816.281 334.732C818.589 346.839 821.883 358.703 826.128 370.216C827.705 374.497 829.454 378.716 831.375 382.872C837.195 395.547 844.79 407.242 854.007 417.558C864.011 428.739 875.797 438.133 888.887 445.385C894.877 448.724 901.144 451.566 907.622 453.878C913.792 456.072 920.17 457.612 926.651 458.471C939.893 460.219 954.251 459.148 964.471 450.547C972.107 444.277 976.807 435.135 978.837 425.614C980.867 416.093 980.677 406.244 979.187 396.55C976.207 377.162 968.867 358.568 958.707 341.711C956.507 337.934 954.187 334.232 951.807 330.609C950.807 329.105 949.807 327.601 948.737 326.113C947.017 323.668 945.297 321.206 943.527 318.795C941.757 316.384 940.027 313.94 938.237 311.545C933.817 305.643 929.267 299.836 924.657 294.108C913.707 280.483 902.167 267.379 890.707 254.171C881.567 243.625 872.517 232.96 863.907 221.956C860.717 217.945 857.557 213.839 854.627 209.57C851.647 205.234 848.897 200.745 846.387 196.118C843.797 191.358 841.447 186.456 839.347 181.431C837.197 176.271 835.297 170.998 833.657 165.622C830.377 154.871 828.037 143.774 826.207 132.592C824.107 119.767 822.757 106.805 821.607 93.8606C820.667 82.8768 819.847 71.8593 819.207 60.8418C818.987 57.3064 818.767 53.771 818.567 50.2355C818.407 47.4435 818.197 44.6515 818.017 41.8594C817.867 39.5798 817.717 37.3001 817.547 35.0205C817.387 32.7408 817.207 30.4612 817.027 28.1815C816.707 23.6559 816.367 19.1303 815.947 14.5709C815.877 13.8299 815.807 13.0889 815.727 12.3479C814.787 3.35306 807.347 -2.41588 798.297 1.01347C789.247 4.44283 782.417 14.6889 782.617 24.0579C782.617 24.3859 782.617 24.7139 782.617 25.0419C782.887 32.4885 783.277 39.9351 783.727 47.3817C784.177 54.8283 784.697 62.2749 785.307 69.7215C786.567 84.6484 788.047 99.5753 790.187 114.365C791.257 121.76 792.527 129.121 794.027 136.413C795.527 143.705 797.257 150.929 799.247 158.052C803.247 172.296 808.467 186.127 815.047 199.341C825.517 220.447 839.547 240.006 853.717 259.047C855.888 261.974 858.107 264.866 860.297 267.793C868.317 278.326 876.167 289.013 883.497 300.08C897.067 320.598 909.377 342.109 918.137 365.006C919.227 367.849 920.317 370.709 921.337 373.586C923.617 379.871 925.487 386.307 926.937 392.854C928.227 398.668 929.167 404.554 929.757 410.481C930.107 413.995 930.237 417.509 930.317 421.023C930.347 424.537 930.247 428.085 929.757 431.565C929.517 433.305 929.187 435.062 928.617 436.733C928.047 438.403 927.237 440.022 926.107 441.434C924.137 443.858 921.277 445.528 918.177 446.21C915.077 446.892 911.817 446.598 908.887 445.442C902.787 443.063 897.587 438.851 893.037 434.247C888.487 429.644 884.447 424.614 880.557 419.516C880.187 419.018 879.827 418.52 879.467 418.022L879.567 341.849Z" fill="#0D0C22" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-incognito font-semibold dark:text-white text-zinc-900 mb-1">Buy Me a Coffee</h3>
                            <p className="text-sm text-zinc-500 mb-4">If you find my work valuable, consider supporting me to fuel more open-source contributions.</p>
                            <a
                                href="https://buymeacoffee.com/manishp.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFDD00] text-[#0D0C22] font-semibold text-sm hover:bg-[#FFDD00]/90 transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.663-6.66.989-9.993l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z" />
                                </svg>
                                Buy me a coffee
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}