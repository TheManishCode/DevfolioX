import { Metadata } from "next"
import { PageHeader } from "@/components/layout/PageHeader"
import Link from "next/link"
import { FiFileText, FiExternalLink, FiCalendar, FiBookmark } from "react-icons/fi"
import { getContent } from "@/lib/content"
import researchData from "@/data/research.json"

export const metadata: Metadata = {
    title: "Research | Ink",
    description: "Academic papers, publications, and research studies exploring technology and innovation.",
}

interface ResearchPaper {
    id: string
    title: string
    abstract: string
    publishedAt: string
    journal?: string
    doi?: string
    tags: string[]
    status: "published" | "in-progress" | "preprint"
    authors?: string[]
    pdfUrl?: string
}

function StatusBadge({ status }: { status: ResearchPaper["status"] }) {
    const styles = {
        "published": "bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300",
        "in-progress": "bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700",
        "preprint": "bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400",
    }

    const labels = {
        "published": "Published",
        "in-progress": "In Progress",
        "preprint": "Preprint",
    }

    return (
        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
            {labels[status]}
        </span>
    )
}

function PaperCard({ paper }: { paper: ResearchPaper }) {
    return (
        <article className="group p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <StatusBadge status={paper.status} />
                {paper.doi && (
                    <Link
                        href={paper.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        <FiExternalLink className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 font-incognito mb-2 leading-snug">
                {paper.title}
            </h3>

            {/* Authors */}
            {paper.authors && paper.authors.length > 0 && (
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-2">
                    {paper.authors.join(", ")}
                </p>
            )}

            {/* Abstract */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                {paper.abstract}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500 mb-4">
                <span className="flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5" />
                    {new Date(paper.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
                {paper.journal && (
                    <span className="flex items-center gap-1.5">
                        <FiBookmark className="w-3.5 h-3.5" />
                        {paper.journal}
                    </span>
                )}
            </div>

            {/* Tags */}
            {paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    {paper.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs font-medium bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* PDF Link */}
            {paper.pdfUrl && (
                <Link
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <FiFileText className="w-4 h-4" />
                    View PDF
                </Link>
            )}
        </article>
    )
}

function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FiFileText className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="font-incognito text-2xl font-semibold dark:text-zinc-300 text-zinc-600 mb-2">
                Coming Soon
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Research papers and publications are being prepared. Academic work exploring technology, AI, and security will appear here.
            </p>
        </div>
    )
}

export default async function ResearchPage() {
    const content = await getContent("research", researchData)
    const papers = content.papers as ResearchPaper[]

    return (
        <main className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            <PageHeader
                title="Research"
                description="Academic papers, publications, and studies exploring technology, AI, and security."
            />

            {papers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                    {papers.map((paper) => (
                        <PaperCard key={paper.id} paper={paper} />
                    ))}
                </div>
            ) : (
                <ComingSoon />
            )}
        </main>
    )
}
