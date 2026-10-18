import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { readFile } from "node:fs/promises"
import path from "node:path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi"
import articlesData from "@/data/articles.json"

interface Article {
    id: string
    title: string
    slug: string
    description: string
    publishedAt: string
    readingTime: string
    tags: string[]
    featured?: boolean
}

const articles = articlesData.articles as Article[]

// Article bodies live in src/data/articles/<slug>.md, next to the listing data.
async function loadBody(slug: string) {
    if (!/^[a-z0-9-]+$/.test(slug)) return null
    try {
        return await readFile(path.join(process.cwd(), "src/data/articles", `${slug}.md`), "utf8")
    } catch {
        return null
    }
}

export function generateStaticParams() {
    return articles.map((a) => ({ slug: a.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const article = articles.find((a) => a.slug === slug)
    if (!article) return {}
    return {
        title: `${article.title} | Ink`,
        description: article.description,
        openGraph: { title: article.title, description: article.description, type: "article", publishedTime: article.publishedAt },
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = articles.find((a) => a.slug === slug)
    const body = article ? await loadBody(slug) : null
    if (!article || !body) notFound()

    return (
        <main className="max-w-3xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8">
            <Link
                href="/ink/articles"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
                <FiArrowLeft className="w-4 h-4" /> All articles
            </Link>

            <header className="mt-8 mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="font-incognito text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {article.title}
                </h1>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">{article.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        {article.readingTime}
                    </span>
                    {article.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 font-medium bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            <article
                className="text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-5
                    [&_h2]:font-incognito [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-100 [&_h2]:mt-12 [&_h2]:mb-4
                    [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-zinc-400 hover:[&_a]:decoration-zinc-900 dark:hover:[&_a]:decoration-zinc-100
                    [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                    [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-800/70
                    [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_th]:text-left [&_th]:font-semibold [&_th]:py-2 [&_th]:pr-4 [&_th]:border-b [&_th]:border-zinc-300 dark:[&_th]:border-zinc-700
                    [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_td]:border-b [&_td]:border-zinc-200 dark:[&_td]:border-zinc-800"
            >
                <div className="overflow-x-auto [&>*+*]:mt-5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
                </div>
            </article>
        </main>
    )
}
