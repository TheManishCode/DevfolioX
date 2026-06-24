"use client";

import Link from "next/link";
import {
    SiNextdotjs,
    SiReact,
    SiTypescript,
    SiTailwindcss,
    SiVercel,
    SiGithub,
    SiSwiper,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";
import {
    ArrowUpRight,
    Layers,
    Palette,
    Type,
    Coffee,
    Heart,
    Cpu,
    ExternalLink,
} from "lucide-react";

export default function ColophonPage() {
    const techStack = [
        { icon: <SiNextdotjs size={24} />, name: "Next.js 15" },
        { icon: <SiReact size={24} />, name: "React 19" },
        { icon: <SiTypescript size={24} />, name: "TypeScript 5" },
        { icon: <SiTailwindcss size={24} />, name: "Tailwind v4" },
        { icon: <TbBrandFramerMotion size={24} />, name: "Lenis" },
        { icon: <SiSwiper size={24} />, name: "Swiper" },
        { icon: <SiVercel size={24} />, name: "Vercel Edge" },
        { icon: <SiGithub size={24} />, name: "GitHub" },
    ];

    const colors = [
        { hex: "#18181b", name: "Zinc 900", desc: "Primary Background" },
        { hex: "#27272a", name: "Zinc 800", desc: "Surfaces & Cards" },
        { hex: "#71717a", name: "Zinc 500", desc: "Muted Text" },
        { hex: "#fafafa", name: "Zinc 50", desc: "Light Mode" },
    ];

    return (
        <article className="mx-auto max-w-7xl pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">

            {/* Hero */}
            <header className="mb-16 md:mb-24">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
                    /studio/colophon
                </p>

                <h1 className="font-incognito text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6 dark:text-white text-zinc-900">
                    Colophon
                </h1>

                <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-xl leading-relaxed">
                    The technical blueprint behind this portfolio — architecture,
                    design system, and engineering principles.
                </p>
            </header>

            {/* Intro */}
            <section className="mb-16 md:mb-24">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="text-xl font-semibold dark:text-white text-zinc-900 leading-snug mb-2">
                            Built with intention
                        </h2>
                        <p className="text-sm dark:text-zinc-500 text-zinc-500">
                            Every decision serves a purpose.
                        </p>
                    </div>
                    <div className="lg:col-span-8 space-y-4 text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                        <p>
                            This portfolio isn&apos;t just a showcase — it&apos;s a demonstration of how I build.
                            The architecture follows atomic design principles: small, composable units
                            that scale without sacrificing performance.
                        </p>
                        <p>
                            React Server Components handle data fetching at the edge. TypeScript provides
                            end-to-end type safety. Tailwind enables rapid iteration with design consistency.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-16 md:mb-24">
                <div className="flex items-center gap-3 mb-6">
                    <Cpu size={14} className="text-zinc-500" />
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Core Stack
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {techStack.map((tech, i) => (
                        <div
                            key={i}
                            className="group flex flex-col items-center justify-center p-5 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/50 bg-zinc-50 hover:border-zinc-600 dark:hover:border-zinc-600 transition-all hover:-translate-y-0.5"
                        >
                            <div className="dark:text-zinc-400 text-zinc-600 mb-2 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                                {tech.icon}
                            </div>
                            <span className="text-[10px] font-medium dark:text-zinc-500 text-zinc-500 text-center">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Architecture */}
            <section className="mb-16 md:mb-24 p-6 md:p-10 rounded-2xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/30 bg-zinc-50">
                <div className="flex items-center gap-3 mb-8">
                    <Layers size={14} className="text-zinc-500" />
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Architecture
                    </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div>
                        <h4 className="text-lg font-semibold dark:text-white text-zinc-900 mb-6">
                            Performance Metrics
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { metric: "<1s", label: "First Contentful Paint" },
                                { metric: "100%", label: "TypeScript Coverage" },
                                { metric: "30+", label: "Edge Regions" },
                                { metric: "AA", label: "WCAG Compliance" },
                            ].map((item) => (
                                <li key={item.label} className="flex items-baseline gap-4">
                                    <span className="text-xl font-bold font-mono dark:text-zinc-200 text-zinc-800 w-16">{item.metric}</span>
                                    <span className="dark:text-zinc-500 text-zinc-500 text-sm">{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-widest dark:text-zinc-500 text-zinc-500 mb-4">
                            Dependencies
                        </h4>
                        {[
                            { cat: "Auth", val: "NextAuth.js" },
                            { cat: "Data Fetching", val: "SWR" },
                            { cat: "Carousel", val: "Swiper" },
                            { cat: "Icons", val: "Lucide + React Icons" },
                            { cat: "Markdown", val: "React Markdown" },
                            { cat: "Utilities", val: "clsx + tailwind-merge" },
                        ].map((dep) => (
                            <div key={dep.cat} className="flex justify-between items-center py-2.5 border-b dark:border-zinc-800/50 border-zinc-200 last:border-0">
                                <span className="text-sm dark:text-zinc-500 text-zinc-500">{dep.cat}</span>
                                <span className="text-sm font-medium dark:text-zinc-300 text-zinc-700">{dep.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Design System */}
            <section className="mb-16 md:mb-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Colors */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Palette size={14} className="text-zinc-500" />
                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                Palette
                            </h3>
                        </div>

                        <p className="dark:text-zinc-500 text-zinc-500 text-sm leading-relaxed mb-6">
                            Intentionally constrained. Monochromatic with minimal accent usage.
                        </p>

                        <div className="space-y-3">
                            {colors.map((color) => (
                                <div key={color.hex} className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg border dark:border-zinc-700 border-zinc-300 shrink-0"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium dark:text-zinc-300 text-zinc-700 text-sm">{color.name}</span>
                                            <span className="font-mono text-[10px] dark:text-zinc-600 text-zinc-400">{color.hex}</span>
                                        </div>
                                        <span className="text-xs dark:text-zinc-500 text-zinc-500">{color.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Typography */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Type size={14} className="text-zinc-500" />
                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                Typography
                            </h3>
                        </div>

                        <p className="dark:text-zinc-500 text-zinc-500 text-sm leading-relaxed mb-6">
                            Clear hierarchy through restraint. Two primary typefaces.
                        </p>

                        <div className="space-y-5">
                            <div className="pb-5 border-b dark:border-zinc-800 border-zinc-200">
                                <p className="font-incognito text-2xl font-bold tracking-tight dark:text-white text-zinc-900 mb-1">Incognito</p>
                                <p className="text-xs dark:text-zinc-500 text-zinc-500">Display & Headings</p>
                            </div>
                            <div className="pb-5 border-b dark:border-zinc-800 border-zinc-200">
                                <p className="text-xl font-medium dark:text-white text-zinc-900 mb-1">Inter Variable</p>
                                <p className="text-xs dark:text-zinc-500 text-zinc-500">Interface & Body</p>
                            </div>
                            <div>
                                <p className="font-mono text-lg dark:text-white text-zinc-900 mb-1">JetBrains Mono</p>
                                <p className="text-xs dark:text-zinc-500 text-zinc-500">Code & Technical</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Acknowledgments */}
            <section className="mb-16 md:mb-24">
                <div className="flex items-center gap-3 mb-6">
                    <Heart size={14} className="text-zinc-500" />
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Acknowledgments
                    </h3>
                </div>

                <p className="dark:text-zinc-500 text-zinc-500 text-sm mb-6 max-w-lg">
                    Standing on the shoulders of giants. Grateful to these developers
                    for sharing their craft openly.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        {
                            name: "Victor Eke",
                            url: "https://victoreke.com/",
                            role: "Design inspiration",
                            note: "Aesthetic direction, Incognito typography"
                        },
                        {
                            name: "Manish Tamang",
                            url: "https://manishtamang.com/",
                            role: "Structure inspiration",
                            note: "Portfolio organization, documentation concept"
                        },
                    ].map((person) => (
                        <Link
                            key={person.name}
                            href={person.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-5 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/30 bg-zinc-50 hover:border-zinc-600 dark:hover:border-zinc-600 transition-all hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <h4 className="font-semibold dark:text-zinc-200 text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                        {person.name}
                                    </h4>
                                    <p className="text-xs text-zinc-500">{person.role}</p>
                                </div>
                                <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
                            </div>
                            <p className="text-sm dark:text-zinc-500 text-zinc-500">{person.note}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t dark:border-zinc-800 border-zinc-200">
                <div className="flex items-center gap-4 font-mono text-[10px] dark:text-zinc-600 text-zinc-400">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                        <span className="uppercase">Online</span>
                    </div>
                    <span>·</span>
                    <span>v1.0.0</span>
                </div>

                <div className="flex items-center gap-2 text-sm dark:text-zinc-500 text-zinc-500">
                    <Coffee size={12} className="text-zinc-500" />
                    <span>Hunsur, Karnataka</span>
                </div>

                <div className="flex gap-4 font-mono text-[10px] uppercase">
                    <Link href="https://github.com/TheManishCode" target="_blank" rel="noopener noreferrer" className="dark:text-zinc-600 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
                        GitHub <ExternalLink size={10} />
                    </Link>
                    <Link href="https://vercel.com/themanishcode" target="_blank" rel="noopener noreferrer" className="dark:text-zinc-600 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
                        Vercel <ExternalLink size={10} />
                    </Link>
                </div>
            </footer>
        </article>
    );
}
