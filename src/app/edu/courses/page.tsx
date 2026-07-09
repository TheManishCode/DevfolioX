import { Metadata } from "next"
import {
    GraduationCap,
    Award,
    Layers,
    BookOpen,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react"
import certificatesData from "@/data/certificates.json"
import enrichedData from "@/data/certificates.enriched.json"
import coursesData from "@/data/courses.json"
import { CertificateCard } from "@/features/education/CertificateCard"
import { getContent } from "@/lib/content"

export const metadata: Metadata = {
    title: "Learning & Certifications",
    description:
        "Formal education, professional certifications, and continuous learning.",
}

/* =============================================================================
   TYPES
============================================================================= */

interface BaseCertificate {
    id: string
    title: string
    image: string
    issuer: string
    platform: string
    year: string
    verifyUrl: string
}

interface EnrichedData {
    level?: string
    duration?: string
    outcomes?: string[]
    skills?: string[]
}

/* =============================================================================
   HELPER FUNCTIONS
============================================================================= */

/**
 * Merge base certificates with enriched data
 */
function getCertificatesWithEnrichment(certificates: typeof certificatesData) {
    const enriched = enrichedData as Record<string, EnrichedData>

    return (certificates.certificates as BaseCertificate[])
        .filter(cert =>
            cert.image &&
            cert.image.trim() !== "" &&
            cert.verifyUrl &&
            cert.verifyUrl.trim() !== ""
        )
        .map(cert => ({
            ...cert,
            enriched: enriched[cert.id] || undefined
        }))
}

/* =============================================================================
   UI PRIMITIVES
============================================================================= */

const Section = ({
    title,
    icon,
    description,
    children,
}: {
    title: string
    icon: React.ReactNode
    description?: string
    children: React.ReactNode
}) => (
    <section className="py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
                {icon}
                {title}
            </div>
            {description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {description}
                </p>
            )}
        </div>
        {children}
    </section>
)

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent p-6">
        {children}
    </div>
)

/* =============================================================================
   PAGE
============================================================================= */

export default async function LearningPage() {
    const [certificatesData_, coursesData_] = await Promise.all([
        getContent("certificates", certificatesData),
        getContent("courses", coursesData),
    ])

    const certificates = getCertificatesWithEnrichment(certificatesData_)

    const SNAPSHOT = [
        coursesData_.snapshot[0],
        { label: "Certifications Earned", value: String(certificatesData_.certificates.length) + "+" },
        ...coursesData_.snapshot.slice(1),
    ]
    const EDUCATION = coursesData_.education
    const DOMAINS = coursesData_.domains
    const COURSEWORK = coursesData_.coursework

    return (
        <article className="mx-auto max-w-7xl pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 text-zinc-900 dark:text-zinc-200">
            {/* HERO */}
            <header className="max-w-3xl mb-28">
                <h1 className="text-6xl font-semibold tracking-tight mb-6">
                    Learning & Credentials
                </h1>
                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                    A structured, verifiable record of formal education, professional
                    certifications, and continuous technical development.
                </p>
            </header>

            {/* SNAPSHOT */}
            <section className="mb-32">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-zinc-200 dark:border-zinc-800">
                    {SNAPSHOT.map((item) => (
                        <div
                            key={item.label}
                            className="p-8 text-center bg-transparent"
                        >
                            <div className="text-4xl font-light">{item.value}</div>
                            <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CERTIFICATES - Data Driven */}
            {certificates.length > 0 && (
                <Section
                    title="Professional Certifications"
                    icon={<Award size={14} />}
                    description="Industry-recognized credentials validating applied knowledge."
                >
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <CertificateCard key={cert.id} cert={cert} />
                        ))}
                    </div>
                </Section>
            )}

            {/* DOMAINS */}
            <Section
                title="Capability Domains"
                icon={<Layers size={14} />}
                description="Core technical areas developed through structured learning and applied practice."
            >
                <div className="grid sm:grid-cols-3 gap-8">
                    {DOMAINS.map((domain) => (
                        <Card key={domain.title}>
                            <h3 className="font-medium mb-4">{domain.title}</h3>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                {domain.skills.map((skill) => (
                                    <li key={skill} className="flex items-start gap-2">
                                        <CheckCircle2 size={14} className="mt-0.5 text-zinc-400" />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* EDUCATION */}
            <Section
                title="Formal Education"
                icon={<GraduationCap size={14} />}
                description="Academic foundation in computer science and engineering."
            >
                {EDUCATION.map((edu) => (
                    <Card key={edu.degree}>
                        <h3 className="text-lg font-medium">{edu.degree}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {edu.field} · {edu.institution}
                        </p>
                        <p className="mt-3 text-xs font-mono text-zinc-400">
                            {edu.period}
                        </p>
                        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
                            {edu.focus}
                        </p>
                    </Card>
                ))}
            </Section>

            {/* COURSEWORK */}
            <Section
                title="Academic Coursework"
                icon={<BookOpen size={14} />}
                description="Core subjects forming the theoretical and practical foundation."
            >
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {COURSEWORK.map((course) => (
                        <div
                            key={course}
                            className="px-5 py-4 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                            {course}
                        </div>
                    ))}
                </div>
            </Section>

            {/* FOOTER */}
            <footer className="pt-20 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-zinc-400">
                <span>LAST_UPDATED: 2026.01</span>
                <span className="flex items-center gap-2">
                    <ShieldCheck size={12} />
                    Credentials verifiable upon request
                </span>
            </footer>
        </article>
    )
}
