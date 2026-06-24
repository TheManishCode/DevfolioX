import Link from "next/link"
import { siteConfig } from "@/config/site"
import { FiGithub, FiTwitter } from "react-icons/fi"

const quickLinks = [
    { label: "Workspace", href: "/workspace/creations" },
    { label: "Experience", href: "/workspace/experience" },
    { label: "Articles", href: "/ink/articles" },
    { label: "Guestbook", href: "/guestbook" },
    { label: "Connect", href: "/connect" },
]

export function Footer() {
    return (
        <footer className="border-t dark:border-zinc-800 border-zinc-200">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

                    {/* Brand + copyright */}
                    <div className="space-y-1">
                        <p className="font-incognito font-semibold text-sm dark:text-zinc-200 text-zinc-800">
                            {siteConfig.name}
                        </p>
                        <p className="text-xs dark:text-zinc-500 text-zinc-500">
                            © {new Date().getFullYear()} — All rights reserved
                        </p>
                    </div>

                    {/* Quick links */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs dark:text-zinc-500 text-zinc-500 hover:dark:text-zinc-300 hover:text-zinc-700 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social icons */}
                    <div className="flex items-center gap-4">
                        <a
                            href={`https://github.com/${siteConfig.social.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="dark:text-zinc-500 text-zinc-500 hover:dark:text-zinc-300 hover:text-zinc-700 transition-colors"
                        >
                            <FiGithub className="w-4 h-4" />
                        </a>
                        <a
                            href={`https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter / X profile"
                            className="dark:text-zinc-500 text-zinc-500 hover:dark:text-zinc-300 hover:text-zinc-700 transition-colors"
                        >
                            <FiTwitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
