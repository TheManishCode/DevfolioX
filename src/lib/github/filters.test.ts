import { describe, expect, it } from "vitest"
import {
    filterByCategory,
    filterBySecurityCategory,
    filterBySketchCategory,
    getFeaturedProjects,
    getAvailableCategories,
    getCategoryCounts,
} from "./filters"
import type { PortfolioProject, ProjectCategory } from "./types"

function makeProject(id: number, categories: ProjectCategory[]): PortfolioProject {
    return {
        id,
        name: `project-${id}`,
        description: "",
        githubUrl: `https://github.com/x/project-${id}`,
        stats: { stars: 0, forks: 0, commits: 0, fork: false },
        faces: {
            tech: { mainLanguage: "TypeScript", languages: [], tools: [] },
            demo: null,
            readme: { content: "", url: "" },
        },
        updatedAt: new Date().toISOString(),
        metadata: {
            title: `Project ${id}`,
            categories,
            status: "completed",
            priority: 0,
            type: "project",
            visibility: true,
            tags: [],
        },
    }
}

const projects: PortfolioProject[] = [
    makeProject(1, ["featured", "creations"]),
    makeProject(2, ["security", "secumilate"]),
    makeProject(3, ["sketches"]),
    makeProject(4, ["open-source"]),
]

describe("filterByCategory", () => {
    it("returns only projects containing the exact category", () => {
        expect(filterByCategory(projects, "featured").map(p => p.id)).toEqual([1])
    })

    it("returns an empty array when no project matches", () => {
        expect(filterByCategory(projects, "now")).toEqual([])
    })
})

describe("filterBySecurityCategory", () => {
    it("matches categories via case-insensitive pattern, not just an exact tag", () => {
        const matched = filterBySecurityCategory(projects).map(p => p.id)
        expect(matched).toEqual([2])
    })
})

describe("filterBySketchCategory", () => {
    it("matches sketch-adjacent categories", () => {
        const matched = filterBySketchCategory(projects).map(p => p.id)
        expect(matched).toEqual([3])
    })
})

describe("getFeaturedProjects", () => {
    it("is equivalent to filtering by the 'featured' category", () => {
        expect(getFeaturedProjects(projects)).toEqual(filterByCategory(projects, "featured"))
    })
})

describe("getAvailableCategories", () => {
    it("collects the unique set of categories across all projects", () => {
        const categories = getAvailableCategories(projects)
        expect(new Set(categories)).toEqual(
            new Set(["featured", "creations", "security", "secumilate", "sketches", "open-source"])
        )
    })
})

describe("getCategoryCounts", () => {
    it("counts occurrences per category and zeroes out categories with no matches", () => {
        const counts = getCategoryCounts(projects)
        expect(counts.featured).toBe(1)
        expect(counts.security).toBe(1)
        expect(counts.secumilate).toBe(1)
        expect(counts.now).toBe(0)
    })
})
