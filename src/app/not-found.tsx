import Link from "next/link"

export default function NotFound() {
    return (
        <main className="max-w-3xl mx-auto pt-32 lg:pt-40 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 text-center">
            <p className="font-mono text-sm text-[#33E092] tracking-widest mb-4">404</p>
            <h1 className="font-incognito text-4xl md:text-5xl font-semibold tracking-tight dark:text-white text-zinc-900 mb-4">
                This page doesn&apos;t exist.
            </h1>
            <p className="text-base dark:text-zinc-400 text-zinc-600 leading-relaxed mb-10">
                The link might be broken, or the page may have moved.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-[#33E092] dark:hover:bg-[#33E092] hover:text-black transition-colors"
            >
                Back to home
            </Link>
        </main>
    )
}
