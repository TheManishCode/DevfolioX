"use client"

import { useState } from "react"
import { PortfolioProject } from "@/lib/github/types"
import { CardViewport } from "./card/CardViewport"
import { FaceSlider } from "./card/FaceSlider"
import { FaceTech } from "./card/faces/FaceTech"
import { FaceDemoPlaceholder } from "./card/faces/FaceDemoPlaceholder"
import { FaceDescription } from "./card/faces/FaceDescription"
import { Github, Star } from "lucide-react"

interface ProjectCardProps {
    project: PortfolioProject
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [activeFace, setActiveFace] = useState(0)

    // Navigation handlers
    const handleDotClick = (index: number) => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setActiveFace(index)
    }

    return (
        <article
            className="group relative flex flex-col gap-4 p-0 rounded-2xl transition-transform duration-300 hover:-translate-y-1"
        >
            <div className="flex items-center justify-between px-1">
                <h3 className="font-incognito font-semibold text-xl text-zinc-800 dark:text-zinc-100 truncate pr-4">
                    {project.name}
                </h3>
                <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
                    aria-label="View on GitHub"
                >
                    <Github size={20} />
                </a>
            </div>

            <CardViewport>
                <FaceSlider activeFace={activeFace} mode="mini">
                    <FaceDemoPlaceholder />
                    <FaceDescription description={project.description} />
                    <FaceTech
                        tech={project.faces.tech}
                        techStack={project.metadata.techStack}
                    />
                </FaceSlider>
            </CardViewport>

            {/* Footer / Navigation */}
            <div className="flex items-center justify-between px-1 h-6">
                {/* Stats (Left) */}
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <Star size={12} className="mb-[1px]" />
                        <span>{project.stats.stars}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>{new Date(project.updatedAt).getFullYear()}</span>
                    </div>
                </div>

                {/* Navigation Dots (Center-ish / Right) */}
                <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <button
                            key={i}
                            onClick={handleDotClick(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeFace === i
                                ? "bg-zinc-800 dark:bg-zinc-200 scale-110"
                                : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                                }`}
                            aria-label={`View card face ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </article>
    )
}
