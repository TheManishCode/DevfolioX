/**
 * Root Layout
 * 
 * Application shell that wraps all pages. Provides:
 * - Global CSS and font configuration
 * - Theme system (light/dark mode)
 * - Session context for auth features (guestbook)
 * - Smooth scroll behavior
 * - Persistent navigation and footer
 * 
 * @remarks
 * Uses Next.js Metadata API for SEO. Page-level metadata uses the template
 * format: "[Page Title] | Manish P"
 */

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/ui/ThemeProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AnimatedFavicon } from "@/components/ui/AnimatedFavicon"
import { SmoothScroll } from "@/components/layout/SmoothScroll"
import { incognito } from "@/assets/fonts/font"
import { siteConfig } from "@/config/site"
import { SideUsername } from "@/components/decorative/SideUsername"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import { SessionProvider } from "@/components/providers/SessionProvider"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.name} | ${siteConfig.title}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
        title: `${siteConfig.name} | ${siteConfig.title}`,
        siteName: siteConfig.openGraph.siteName,
        locale: siteConfig.openGraph.locale,
        type: siteConfig.openGraph.type,
        description: siteConfig.description,
    },
    twitter: {
        card: "summary_large_image",
        creator: siteConfig.social.twitter,
    },
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${inter.className} ${incognito.variable} dark:bg-zinc-900 bg-[#d5d5da] dark:text-zinc-100 text-zinc-800`}
            >
                <SpeedInsights />
                <Analytics />
                {/* Skip to content link for keyboard navigation */}
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white focus:rounded-md">
                    Skip to main content
                </a>
                <SessionProvider>
                    <ThemeProvider>
                        <SmoothScroll>
                            <AnimatedFavicon />
                            <SideUsername />
                            <Navbar />
                            {children}
                            <Footer />
                        </SmoothScroll>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
