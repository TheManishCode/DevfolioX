import { Metadata } from "next"
import { PageHeader } from "@/components/layout/PageHeader"
import { PageSubtitle } from "@/components/ui/Typography"
import Link from "next/link"
import { FiClock, FiCalendar, FiArrowRight, FiBookOpen } from "react-icons/fi"
import { getContent } from "@/lib/content"
import articlesData from "@/data/articles.json"

export const metadata: Metadata = {
    title: "Articles | Ink",
    description: "Thoughts, tutorials, and insights on development, design, and technology.",
}

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

function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={`/ink/articles/${article.slug}`}
            className="group block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
        >
            {/* Featured badge */}
            {article.featured && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 rounded-full mb-3">
                    Featured
                </span>
            )}

            {/* Title */}
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 font-incognito mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                {article.title}
            </h3>

            {/* Description */}
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {article.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        {article.readingTime}
                    </span>
                </div>
                <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    {article.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs font-medium bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </Link>
    )
}

function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FiBookOpen className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="font-incognito text-2xl font-semibold dark:text-zinc-300 text-zinc-600 mb-2">
                Coming Soon
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Articles and tutorials are being written. Check back soon for thoughts on development, design, and technology.
            </p>
        </div>
    )
}

export default async function ArticlesPage() {
    const content = await getContent("articles", articlesData)
    const articles = content.articles as Article[]

    return (
        <main className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            <PageHeader
                title="Articles"
                description="Thoughts, tutorials, and insights on development, design, and technology."
            />

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <ComingSoon />
            )}
        </main>
    )
}
