import { GitHubRepo, ProjectModel, ProjectMetadata, PortfolioProject, ProjectCategory } from "./types"

// =============================================================================
// CONFIGURATION
// =============================================================================

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "TheManishCode"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN?.trim()

/**
 * ISR CACHE BEHAVIOR:
 * - Production: Uses Next.js ISR with revalidate intervals
 * - Development: Bypasses cache for immediate metadata updates
 * 
 * This ensures:
 * - Dev: Changes to project.json are reflected immediately
 * - Prod: Stable cached responses with hourly revalidation
 */
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

/**
 * Get fetch options with appropriate caching based on environment
 * @param revalidateSeconds - ISR revalidation interval for production
 */
function getFetchOptions(revalidateSeconds: number): RequestInit {
    if (IS_DEVELOPMENT) {
        // Development: Always fetch fresh data for immediate feedback
        return { cache: 'no-store' }
    }
    // Production: Use ISR caching
    return { next: { revalidate: revalidateSeconds } }
}

/**
 * Fetch timeout wrapper to prevent hanging requests
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default 10s)
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = 10000
): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        })
        return response
    } finally {
        clearTimeout(timeoutId)
    }
}

function getGitHubHeaders(accept: string = "application/vnd.github.v3+json", withAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
        Accept: accept,
        "User-Agent": "Portfolio-App",
    }

    if (withAuth && GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`
    }

    return headers
}

function withoutAuthorization(headers: RequestInit["headers"]): HeadersInit {
    const nextHeaders = new Headers(headers)
    nextHeaders.delete("Authorization")
    return nextHeaders
}

async function fetchGitHubWithAuthFallback(
    url: string,
    options: RequestInit,
    timeoutMs?: number
): Promise<Response> {
    const response = await fetchWithTimeout(url, options, timeoutMs)

    if (response.status !== 401 || !GITHUB_TOKEN) {
        return response
    }

    console.warn("GitHub token was rejected; retrying public request without authentication.")
    const { headers: _headers, ...retryOptions } = options

    return fetchWithTimeout(
        url,
        {
            ...retryOptions,
            headers: withoutAuthorization(options.headers),
        },
        timeoutMs
    )
}

/**
 * Execute async tasks with controlled concurrency to prevent rate limiting
 * Uses Promise.allSettled in batches for safe parallel execution
 * @param items - Array of items to process
 * @param fn - Async function to apply to each item
 * @param batchSize - Maximum concurrent operations per batch (default 10)
 */
async function batchedPromiseAll<T, R>(
    items: T[],
    fn: (item: T) => Promise<R>,
    batchSize: number = 10
): Promise<R[]> {
    const results: R[] = []

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize)
        const batchResults = await Promise.allSettled(batch.map(fn))

        for (const result of batchResults) {
            if (result.status === 'fulfilled') {
                results.push(result.value)
            }
        }
    }

    return results
}

/**
 * Fetch the user's GitHub profile README content
 * The profile README is stored in a repo with the same name as the username
 * @returns Raw markdown content of the profile README or null if not found
 */
export async function fetchProfileReadme(): Promise<string | null> {
    try {
        const res = await fetchGitHubWithAuthFallback(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}/readme`,
            {
                ...getFetchOptions(3600), // 1 hour ISR
                headers: getGitHubHeaders("application/vnd.github.v3.raw"),
            }
        )

        if (!res.ok) {
            console.error("Failed to fetch profile README:", res.statusText)
            return null
        }

        return await res.text()
    } catch (error) {
        console.error("Error fetching profile README:", error)
        return null
    }
}

export async function fetchProjects(): Promise<ProjectModel[]> {
    try {
        const res = await fetchGitHubWithAuthFallback(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=100`,
            {
                ...getFetchOptions(3600), // 1 hour ISR in production
                headers: getGitHubHeaders(),
            }
        )

        if (!res.ok) {
            console.error("Failed to fetch GitHub repos:", res.statusText)
            return []
        }

        const repos: GitHubRepo[] = await res.json()

        const relevantRepos = repos.filter(repo => !repo.fork)
        const projects = await Promise.all(relevantRepos.map(normalizeProject))

        return projects
    } catch (error) {
        // Gracefully handle GitHub outages - return empty array, don't crash
        console.error("Error fetching projects:", error)
        return []
    }
}

async function fetchRepoLanguages(repoName: string): Promise<string[]> {
    try {
        const res = await fetchGitHubWithAuthFallback(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`,
            { ...getFetchOptions(86400), headers: getGitHubHeaders() } // 24 hour cache - languages rarely change
        )
        if (!res.ok) return []
        const data = await res.json()
        // Return top 4 languages by size
        return Object.keys(data).slice(0, 4)
    } catch (e) {
        // Gracefully handle errors - return empty array
        return []
    }
}



async function normalizeProject(repo: GitHubRepo): Promise<ProjectModel> {
    // Fetch real languages from the repo
    const realLanguages = await fetchRepoLanguages(repo.name)

    const techStack = {
        mainLanguage: repo.language || "Markdown",
        languages: realLanguages.length > 0 ? realLanguages : (repo.language ? [repo.language] : []),
        tools: repo.topics || [], // Topics are still valid "tools"
    }

    // Fetch README content for preview
    const readmeContent = await fetchReadmeContent(repo.name, repo.default_branch)

    return {
        id: repo.id,
        name: repo.name.replace(/-/g, " ").replace(/_/g, " "),
        description: repo.description || "No description provided.",
        githubUrl: repo.html_url,
        stats: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            commits: 0,
            fork: repo.fork
        },
        faces: {
            tech: techStack,
            demo: null,
            readme: {
                content: readmeContent,
                url: `${repo.html_url}/blob/${repo.default_branch}/README.md`
            }
        },
        updatedAt: repo.updated_at,
    }
}

// Extract README fetching to separate function
async function fetchReadmeContent(repoName: string, defaultBranch: string): Promise<string> {
    try {
        const readmeRes = await fetchWithTimeout(
            `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${defaultBranch}/README.md`,
            getFetchOptions(86400) // 24 hour cache - READMEs rarely change
        )
        if (!readmeRes.ok) return ""

        const text = await readmeRes.text()
        // Aggressive cleanup: Remove HTML tags, comments, and images
        const cleanedText = text
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/<[^>]*>/g, '') // Remove ALL HTML tags
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove Markdown images
            .replace(/\[.*?\]\(.*?\)/g, '$1') // Convert links to plain text
            .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
            .trim()

        // Take a reasonable chunk for preview
        return cleanedText.split('\n').slice(0, 15).join('\n')
    } catch (e) {
        // Gracefully handle errors - return empty string
        return ""
    }
}

// =============================================================================
// Portfolio Project System (project.json metadata)
// =============================================================================

/** Valid categories that can appear in project.json */
const VALID_CATEGORIES: ProjectCategory[] = ['creations', 'now', 'sketches', 'open-source', 'featured', 'security', 'secumilate']

/** Valid status values that can appear in project.json */
const VALID_STATUSES = ['in-progress', 'completed', 'ongoing'] as const

/** 
 * Category aliases for normalization
 * Maps common variations to canonical category names
 * This allows content authors flexibility in naming
 */
const CATEGORY_ALIASES: Record<string, ProjectCategory> = {
    'oss': 'open-source',
    'opensource': 'open-source',
    'open_source': 'open-source',
    'creation': 'creations',
    'sketch': 'sketches',
    'feature': 'featured',
    // Security-related aliases all map to 'secumilate' (the portfolio's security page)
    'secure': 'secumilate',
    'securities': 'secumilate',
    'cybersec': 'secumilate',
    'cybersecurity': 'secumilate',
    'infosec': 'secumilate',
}

/**
 * Status aliases for normalization
 * Maps common variations to canonical status values
 */
const STATUS_ALIASES: Record<string, typeof VALID_STATUSES[number]> = {
    'inprogress': 'in-progress',
    'in_progress': 'in-progress',
    'wip': 'in-progress',
    'done': 'completed',
    'complete': 'completed',
    'finished': 'completed',
    'active': 'ongoing',
    'maintained': 'ongoing',
}

/**
 * Type aliases for normalization
 */
const TYPE_ALIASES: Record<string, 'project' | 'experiment' | 'collection'> = {
    'repo': 'project',
    'app': 'project',
    'library': 'project',
    'lib': 'project',
    'poc': 'experiment',
    'demo': 'experiment',
    'prototype': 'experiment',
    'bundle': 'collection',
    'monorepo': 'collection',
}

// =============================================================================
// NORMALIZATION (Step 1 - Never Rejects)
// =============================================================================

/**
 * Normalize a single category value
 * Handles casing and aliases - returns null if unrecognized
 */
function normalizeCategory(raw: unknown): ProjectCategory | null {
    if (typeof raw !== 'string') return null
    const lower = raw.toLowerCase().trim()

    // Check direct match first
    if (VALID_CATEGORIES.includes(lower as ProjectCategory)) {
        return lower as ProjectCategory
    }

    // Check aliases
    if (CATEGORY_ALIASES[lower]) {
        return CATEGORY_ALIASES[lower]
    }

    return null
}

/**
 * Normalize status value
 * Handles casing and aliases - returns default if unrecognized
 */
function normalizeStatus(raw: unknown): typeof VALID_STATUSES[number] {
    if (typeof raw !== 'string') return 'ongoing' // safe default
    const lower = raw.toLowerCase().trim()

    // Check direct match
    if (VALID_STATUSES.includes(lower as typeof VALID_STATUSES[number])) {
        return lower as typeof VALID_STATUSES[number]
    }

    // Check aliases
    if (STATUS_ALIASES[lower]) {
        return STATUS_ALIASES[lower]
    }

    return 'ongoing' // safe default
}

/**
 * Normalize type value
 * Handles casing and aliases - returns default if unrecognized
 */
function normalizeType(raw: unknown): 'project' | 'experiment' | 'collection' {
    if (typeof raw !== 'string') return 'project' // safe default
    const lower = raw.toLowerCase().trim()

    if (['project', 'experiment', 'collection'].includes(lower)) {
        return lower as 'project' | 'experiment' | 'collection'
    }

    if (TYPE_ALIASES[lower]) {
        return TYPE_ALIASES[lower]
    }

    return 'project' // safe default
}

/**
 * Normalize raw metadata from project.json
 * 
 * PURPOSE: Transform varied content formats into a consistent shape.
 * This function NEVER rejects - it coerces and defaults gracefully.
 * 
 * CONTENT TOLERANCE:
 * - Casing variations are normalized (e.g., "Completed" -> "completed")
 * - Aliases are resolved (e.g., "oss" -> "open-source")
 * - Missing optional fields get safe defaults
 * - Invalid array entries are silently removed
 * 
 * @param raw - Raw parsed JSON from project.json
 * @param repoName - Repository name (for logging)
 * @returns Normalized metadata object (may have empty categories)
 */
function normalizeMetadata(raw: unknown, repoName: string): Partial<ProjectMetadata> & { _normalized: true } {
    if (!raw || typeof raw !== 'object') {
        if (IS_DEVELOPMENT) console.warn(`[${repoName}] Metadata is not an object`)
        return { _normalized: true } as any
    }

    const m = raw as Record<string, unknown>

    // Normalize categories - filter out unrecognized entries silently
    let categories: ProjectCategory[] = []
    if (Array.isArray(m.categories)) {
        categories = m.categories
            .map(normalizeCategory)
            .filter((c): c is ProjectCategory => c !== null)
    }

    // Normalize tags - ensure array of strings
    let tags: string[] = []
    if (Array.isArray(m.tags)) {
        tags = m.tags.filter((t): t is string => typeof t === 'string')
    }

    // Normalize techStack - ensure array of strings if present
    let techStack: string[] | undefined
    if (Array.isArray(m.techStack)) {
        techStack = m.techStack.filter((t): t is string => typeof t === 'string')
    }

    // Log normalization info in dev (not warnings, just info)
    if (IS_DEVELOPMENT && categories.length > 0) {
        console.log(`[${repoName}] Normalized: ${categories.length} categories, status=${normalizeStatus(m.status)}`)
    }

    return {
        _normalized: true,
        title: typeof m.title === 'string' ? m.title.trim() : undefined,
        description: typeof m.description === 'string' ? m.description.trim() : undefined,
        categories,
        status: normalizeStatus(m.status),
        priority: typeof m.priority === 'number' ? m.priority : 50, // default mid-priority
        type: normalizeType(m.type),
        visibility: typeof m.visibility === 'boolean' ? m.visibility : true, // default visible
        tags,
        techStack,
    } as any
}

// =============================================================================
// VALIDATION (Step 2 - Minimal Rejection)
// =============================================================================

/**
 * Check if normalized metadata is renderable
 * 
 * PURPOSE: Determine if a project should be displayed.
 * This function only rejects for CRITICAL issues:
 * - visibility explicitly set to false
 * - missing title (can't display unnamed project)
 * - no valid categories (nowhere to show it)
 * 
 * PHILOSOPHY: Validation protects the app, not punishes content.
 * Everything else passes through with warnings in dev.
 * 
 * @param normalized - Output from normalizeMetadata
 * @param repoName - Repository name (for logging)
 * @returns true if project should render, false if it should be skipped
 */
function isRenderableMetadata(
    normalized: Partial<ProjectMetadata> & { _normalized: true },
    repoName: string
): normalized is ProjectMetadata & { _normalized: true } {
    // CRITICAL: visibility explicitly false = do not render
    if (normalized.visibility === false) {
        if (IS_DEVELOPMENT) console.log(`[${repoName}] Skipped: visibility=false`)
        return false
    }

    // CRITICAL: must have a title to display
    if (!normalized.title || normalized.title.trim() === '') {
        if (IS_DEVELOPMENT) console.warn(`[${repoName}] Skipped: missing title`)
        return false
    }

    // CRITICAL: must have at least one category (where to show it?)
    if (!normalized.categories || normalized.categories.length === 0) {
        if (IS_DEVELOPMENT) console.warn(`[${repoName}] Skipped: no valid categories`)
        return false
    }

    // Everything else is acceptable - render the project
    return true
}

/**
 * Process raw metadata through normalize → validate pipeline
 * 
 * This is the ONLY entry point for metadata processing.
 * 
 * PIPELINE:
 * 1. normalizeMetadata() - coerce to consistent shape (never rejects)
 * 2. isRenderableMetadata() - check minimal requirements (rarely rejects)
 * 
 * @param raw - Raw parsed JSON from project.json
 * @param repoName - Repository name (for logging)
 * @returns Valid ProjectMetadata or null if not renderable
 */
function processMetadata(raw: unknown, repoName: string): ProjectMetadata | null {
    const normalized = normalizeMetadata(raw, repoName)

    if (!isRenderableMetadata(normalized, repoName)) {
        return null
    }

    // Strip internal marker and return clean metadata
    const { _normalized, ...metadata } = normalized as any
    return metadata as ProjectMetadata
}

/**
 * Fetch project.json metadata from a repository
 * Returns null if file doesn't exist or is not renderable
 * 
 * BRANCH RESOLUTION (FUTURE-SAFE):
 * 1. Uses repo.default_branch first (from GitHub API)
 * 2. Falls back to 'main'
 * 3. Falls back to 'master'
 * 4. Silently skips on 404 - no error surfaced to UI
 * 
 * PROCESSING PIPELINE:
 * 1. Fetch raw JSON
 * 2. normalizeMetadata() - coerce to consistent shape
 * 3. isRenderableMetadata() - check minimal requirements
 */
async function fetchProjectMetadata(repoName: string, defaultBranch: string): Promise<ProjectMetadata | null> {
    // Build branch list: default_branch first, then fallbacks (deduplicated)
    const branches = [defaultBranch, 'main', 'master'].filter(
        (branch, index, arr) => arr.indexOf(branch) === index // Remove duplicates
    )

    for (const branch of branches) {
        try {
            const res = await fetchWithTimeout(
                `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/project.json`,
                getFetchOptions(3600), // 1 hour ISR in production, no-cache in dev
                5000 // 5 second timeout for metadata fetch
            )

            if (!res.ok) continue

            const rawMetadata = await res.json()

            // Process through normalize → validate pipeline
            const processedMetadata = processMetadata(rawMetadata, repoName)

            if (processedMetadata) {
                return processedMetadata
            }
            // If processing failed, continue to next branch (unlikely to help, but safe)
        } catch {
            // Silently continue to next branch on error
            continue
        }
    }

    // No valid metadata found - project will be skipped
    return null
}

/**
 * Fetch all portfolio projects with metadata
 * Only returns projects that have valid project.json and visibility: true
 * 
 * DATA FLOW:
 * 1. Fetch repos from GitHub API (with ISR caching)
 * 2. Filter out forks
 * 3. Fetch project.json metadata for each repo (batched parallel)
 * 4. Normalize metadata (handle casing, aliases, defaults)
 * 5. Validate renderability (title required, categories required, visibility check)
 * 6. Merge GitHub data with metadata (metadata is source of truth)
 * 7. Sort by priority
 * 
 * METADATA PROCESSING:
 * - Uses normalize → validate pipeline (content-tolerant)
 * - Casing variations are handled automatically
 * - Missing optional fields get safe defaults
 * - Only truly invalid content is rejected
 * 
 * IMPORTANT:
 * - Categories come ONLY from project.metadata.categories
 * - Status comes ONLY from project.metadata.status
 */
export async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
    try {
        const res = await fetchGitHubWithAuthFallback(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=100`,
            {
                ...getFetchOptions(3600), // 1 hour ISR in production
                headers: getGitHubHeaders(),
            }
        )

        if (!res.ok) {
            console.error("Failed to fetch GitHub repos:", res.statusText)
            return []
        }

        const repos: GitHubRepo[] = await res.json()
        const nonForkRepos = repos.filter(repo => !repo.fork)

        // Fetch metadata for repos with controlled concurrency to prevent rate limiting
        // Uses batches of 10 parallel requests to balance speed and API limits
        const projectsWithMetadata = await batchedPromiseAll(
            nonForkRepos,
            async (repo): Promise<PortfolioProject | null> => {
                // Fetch and validate metadata
                const metadata = await fetchProjectMetadata(repo.name, repo.default_branch)

                // Skip if no valid metadata or visibility is false
                // This is NOT a fallback - no metadata = no project displayed
                if (!metadata || !metadata.visibility) {
                    return null
                }

                // Normalize project data from GitHub
                const projectModel = await normalizeProject(repo)

                // Merge GitHub data with validated metadata
                // CRITICAL: metadata is the source of truth for categories and status
                return {
                    ...projectModel,
                    // ALWAYS use repo name as title (ignore project.json title)
                    name: projectModel.name,
                    // Use metadata description if provided, otherwise use GitHub description
                    description: metadata.description || projectModel.description,
                    // Metadata is authoritative - no inference from GitHub fields
                    metadata,
                }
            },
            10 // Process 10 repos at a time
        )

        // Filter out nulls and sort by priority (ascending - lower priority = higher rank)
        const validProjects = projectsWithMetadata
            .filter((p): p is PortfolioProject => p !== null)
            .sort((a, b) => a.metadata.priority - b.metadata.priority)

        return validProjects
    } catch (error) {
        // Gracefully handle GitHub outages - return empty array, don't crash
        // In production, ISR will serve stale cached data
        console.error("Error fetching portfolio projects:", error)
        return []
    }
}

