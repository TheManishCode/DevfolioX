"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { TerminalLogo } from "@/components/navigation/TerminalLogo"
import { cn } from "@/utils"
import { ChevronDown } from "lucide-react"
import { siteConfig } from "@/config/site"

interface NavItem {
    label: string
    href: string
    children?: { label: string; href: string; description?: string }[]
}

const navigationItems: NavItem[] = [
    {
        label: "Myself",
        href: "/myself",
        children: [
            { label: "Story", href: "/myself/story", description: "My journey and background" },
            { label: "Gallery", href: "/myself/gallery", description: "Photos and moments" },
        ],
    },
    {
        label: "Studio",
        href: "/studio",
        children: [
            { label: "Toolkit", href: "/studio/toolkit", description: "Tools I use daily" },
            { label: "Metrics", href: "/studio/metrics", description: "Stats and analytics" },
            { label: "Colophon", href: "/studio/colophon", description: "How this site was built" },
        ],
    },
    {
        label: "Workspace",
        href: "/workspace",
        children: [
            { label: siteConfig.githubUsername, href: `/workspace/${siteConfig.githubUsername}`, description: "GitHub profile README" },
            { label: "Creations", href: "/workspace/creations", description: "Projects & products" },
            { label: "Open Source", href: "/workspace/oss", description: "OSS contributions" },
            { label: "Secumilate", href: "/workspace/secumilate", description: "Security + Simulate + Accumulate" },
            { label: "Now", href: "/workspace/now", description: "What I'm up to" },
            { label: "Experience", href: "/workspace/experience", description: "Work history" },
            { label: "Sketches", href: "/workspace/sketches", description: "Design explorations" },
        ],
    },
    {
        label: "Ink",
        href: "/ink",
        children: [
            { label: "Articles", href: "/ink/articles", description: "Blog posts & writings" },
            { label: "Research", href: "/ink/research", description: "Deep dives & studies" },
        ],
    },
    {
        label: "Edu",
        href: "/edu",
        children: [
            { label: "Schooling", href: "/edu/schooling", description: "Academic journey" },
            { label: "Courses", href: "/edu/courses", description: "Learning & certifications" },
        ],
    },
    {
        label: "Hobbies",
        href: "/hobbies",
        children: [
            { label: "Anime", href: "/hobbies/anime", description: "Favorite shows & reviews" },
            { label: "Games", href: "/hobbies/games", description: "Gaming interests" },
        ],
    },
    { label: "Guestbook", href: "/guestbook" },
    { label: "Connect", href: "/connect" },
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileOpenDropdown, setMobileOpenDropdown] = useState<number>(-1)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [dropdownPosition, setDropdownPosition] = useState<number>(0)
    // Progressive intent navigation: track last clicked dropdown
    const [lastClickedDropdown, setLastClickedDropdown] = useState<string | null>(null)

    const navRef = useRef<HTMLElement>(null)
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const routePrefetchList = useMemo(() => {
        const routes = new Set<string>()

        navigationItems.forEach((item) => {
            routes.add(item.href)
            item.children?.forEach((child) => routes.add(child.href))
        })

        return Array.from(routes)
    }, [])

    // Close dropdowns on route change
    useEffect(() => {
        setMobileMenuOpen(false)
        setMobileOpenDropdown(-1)
        setActiveDropdown(null)
        setLastClickedDropdown(null)
    }, [pathname])

    useEffect(() => {
        const warmRoutes = () => {
            routePrefetchList
                .filter((href) => href !== pathname)
                .forEach((href) => router.prefetch(href))
        }

        const idleWindow = window as Window & typeof globalThis & {
            requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
            cancelIdleCallback?: (handle: number) => void
        }

        if (idleWindow.requestIdleCallback) {
            const idleId = idleWindow.requestIdleCallback(warmRoutes, { timeout: 2500 })
            return () => idleWindow.cancelIdleCallback?.(idleId)
        }

        const timeoutId = globalThis.setTimeout(warmRoutes, 1200)
        return () => globalThis.clearTimeout(timeoutId)
    }, [pathname, routePrefetchList, router])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleMouseEnterItem = useCallback((label: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        // Calculate position for the dropdown
        const button = buttonRefs.current.get(label)
        const nav = navRef.current
        if (button && nav) {
            const buttonRect = button.getBoundingClientRect()
            const navRect = nav.getBoundingClientRect()
            setDropdownPosition(buttonRect.left - navRect.left + buttonRect.width / 2)
        }

        setActiveDropdown(label)

        // Prefetch all child routes on hover for faster navigation
        const item = navigationItems.find(i => i.label === label)
        if (item?.children) {
            item.children.forEach(child => router.prefetch(child.href))
        }
    }, [router])

    // Progressive intent navigation: click handler
    const handleDropdownClick = useCallback((item: NavItem) => {
        if (activeDropdown === item.label && lastClickedDropdown === item.label) {
            // Second click on same item - navigate to hub page
            router.push(item.href)
            setActiveDropdown(null)
            setLastClickedDropdown(null)
        } else {
            // First click - open dropdown and track
            setLastClickedDropdown(item.label)
            // If not already open, open it
            if (activeDropdown !== item.label) {
                handleMouseEnterItem(item.label)
            }
        }
    }, [activeDropdown, lastClickedDropdown, router, handleMouseEnterItem])

    const handleMouseLeaveNav = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null)
            setLastClickedDropdown(null)
        }, 100)
    }

    const handleMouseEnterDropdown = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href)
    }

    // Get the active dropdown's content
    const activeItem = useMemo(() =>
        navigationItems.find(item => item.label === activeDropdown),
        [activeDropdown]
    )

    return (
        <header className="text-sm py-6 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 z-30 md:mb-28 mb-10">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <TerminalLogo />

                {/* Desktop Navigation */}
                <nav
                    ref={navRef}
                    className="hidden md:flex items-center gap-x-1 relative"
                    onMouseLeave={handleMouseLeaveNav}
                >
                    {navigationItems.map((item) => (
                        item.children ? (
                            <button
                                key={item.label}
                                ref={(el) => {
                                    if (el) buttonRefs.current.set(item.label, el)
                                }}
                                onMouseEnter={() => handleMouseEnterItem(item.label)}
                                onClick={() => handleDropdownClick(item)}
                                className={cn(
                                    "inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                                    "dark:text-white text-zinc-600",
                                    "hover:dark:text-[#33E092] hover:text-zinc-900",
                                    (isActive(item.href) || activeDropdown === item.label) && "dark:text-[#33E092] text-[#5f7f6a]"
                                )}
                            >
                                {item.label}
                                <ChevronDown
                                    className={cn(
                                        "h-3 w-3 transition-transform duration-200 ease-out",
                                        activeDropdown === item.label && "rotate-180"
                                    )}
                                />
                            </button>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                                    "dark:text-white text-zinc-600",
                                    "hover:dark:text-[#33E092] hover:text-zinc-900",
                                    isActive(item.href) && "dark:text-[#33E092] text-zinc-900"
                                )}
                                onMouseEnter={() => {
                                    setActiveDropdown(null)
                                    router.prefetch(item.href)
                                }}
                                onFocus={() => router.prefetch(item.href)}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}

                    {/* SINGLE Dropdown Panel - Only ONE exists in DOM */}
                    <div
                        className={cn(
                            "absolute top-full pt-3 z-50",
                            "transition-all duration-200",
                            activeDropdown && activeItem
                                ? "opacity-100 visible translate-y-0"
                                : "opacity-0 invisible -translate-y-2 pointer-events-none"
                        )}
                        style={{
                            left: dropdownPosition,
                            transform: `translateX(-50%) translateY(${activeDropdown ? '0' : '-8px'})`,
                            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                        onMouseEnter={handleMouseEnterDropdown}
                        onMouseLeave={handleMouseLeaveNav}
                    >
                        {activeItem?.children && (
                            <div
                                key={activeDropdown} // Force re-render for smooth content swap
                                className={cn(
                                    "rounded-xl border dark:border-zinc-800 border-zinc-200/80",
                                    "dark:bg-zinc-900 bg-[#d5d5da]",
                                    "shadow-xl dark:shadow-zinc-950/50 shadow-zinc-300/50",
                                    "py-2 animate-fadeIn",
                                    activeItem.children.length >= 5 ? "min-w-[520px]" :
                                        activeItem.children.length >= 3 ? "min-w-[360px]" : "min-w-[220px]"
                                )}
                            >
                                <ul className={cn(
                                    "grid gap-1 p-2",
                                    activeItem.children.length >= 5 ? "grid-cols-3" :
                                        activeItem.children.length >= 3 ? "grid-cols-2" : "grid-cols-1"
                                )}>
                                    {activeItem.children.map((child) => (
                                        <li key={child.href}>
                                            <Link
                                                href={child.href}
                                                className={cn(
                                                    "block select-none rounded-lg p-3 leading-none no-underline outline-none",
                                                    "transition-colors duration-150",
                                                    "hover:dark:bg-zinc-800 hover:bg-zinc-400/30",
                                                    isActive(child.href) && "dark:bg-zinc-800/50 bg-zinc-400/30 dark:text-[#33E092] text-[#0CCE6B]"
                                                )}
                                                onClick={() => setActiveDropdown(null)}
                                                onMouseEnter={() => router.prefetch(child.href)}
                                                onFocus={() => router.prefetch(child.href)}
                                            >
                                                <div className="text-sm font-medium leading-none mb-1.5 dark:text-white text-zinc-900">
                                                    {child.label}
                                                </div>
                                                {child.description && (
                                                    <p className="line-clamp-2 text-xs leading-snug dark:text-zinc-500 text-zinc-500">
                                                        {child.description}
                                                    </p>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-x-4">
                    {/* Hire Me Button - Expandable Bubble */}
                    <a
                        href="https://pro.fiverr.com/s/6YGaeqA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:inline-flex items-center gap-0 hover:gap-2 p-2 hover:px-3 hover:py-2 rounded-full dark:bg-zinc-800/40 bg-[#d5d5da] border dark:border-zinc-800 border-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-800 transition-all duration-300 ease-out group overflow-hidden"
                        aria-label="Open to Work"
                    >
                        {/* Laptop Icon - Remote/Dev Work */}
                        <svg className="w-[22px] h-[22px] shrink-0 dark:text-[#33E092] text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v9A2.25 2.25 0 0118 15h-12A2.25 2.25 0 013.75 12.75V6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15h16.5l1.5 3a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18l1.5-3z" />
                            {/* Terminal Prompt on screen */}
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5l-2.25-2.25m0 4.5l2.25-2.25m3 0h3" />
                        </svg>

                        {/* Expandable text */}
                        <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 ease-out">
                            Open to Work
                        </span>

                        {/* Arrow - only visible on hover */}
                        <svg className="w-0 h-0 group-hover:w-3 group-hover:h-3 shrink-0 overflow-hidden transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                    <ThemeToggle />

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={cn(
                            "md:hidden relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-300",
                            "dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900/60 bg-zinc-200/70",
                            "dark:text-zinc-300 text-zinc-700 hover:dark:text-[#33E092] hover:text-zinc-900",
                            mobileMenuOpen && "dark:border-[#33E092]/40 border-[#33E092]/60 shadow-[0_0_18px_rgba(51,224,146,0.18)]"
                        )}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className="sr-only">Toggle menu</span>
                        <span className="relative h-4 w-5">
                            <span className={cn(
                                "absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out",
                                mobileMenuOpen && "top-[7px] rotate-45"
                            )} />
                            <span className={cn(
                                "absolute left-0 top-[7px] h-[2px] w-4 rounded-full bg-current transition-all duration-300 ease-out",
                                mobileMenuOpen ? "translate-x-3 opacity-0" : "translate-x-1"
                            )} />
                            <span className={cn(
                                "absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out",
                                mobileMenuOpen && "top-[7px] -rotate-45"
                            )} />
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden mt-4 pb-4 animate-slide-down">
                    {navigationItems.map((item, index) => (
                        <div key={item.label} className="border-b dark:border-zinc-800 border-zinc-200 last:border-0">
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => setMobileOpenDropdown(mobileOpenDropdown === index ? -1 : index)}
                                        className="flex items-center justify-between w-full py-3 font-medium dark:text-zinc-300 text-zinc-700"
                                    >
                                        {item.label}
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-300 ${mobileOpenDropdown === index ? "rotate-180" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-300",
                                            mobileOpenDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <div className="pl-4 pb-2 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={`block py-2 text-sm ${isActive(child.href) ? "text-[#33E092]" : "dark:text-zinc-400 text-zinc-600"}`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`block py-3 font-medium ${isActive(item.href) ? "text-[#33E092]" : "dark:text-zinc-300 text-zinc-700"}`}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Hire Me Link for Mobile */}
                    <a
                        href="https://pro.fiverr.com/s/6YGaeqA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-3 mt-3 pt-3 border-t dark:border-zinc-800 border-zinc-200"
                    >
                        {/* Status indicator */}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full dark:bg-zinc-400 bg-zinc-500 opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 dark:bg-zinc-300 bg-zinc-600" />
                        </span>
                        <span className="text-sm font-medium dark:text-zinc-300 text-zinc-700">Open to Work</span>
                        <svg className="w-4 h-4 dark:text-zinc-500 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </a>
                </nav>
            )}

        </header>
    )
}
