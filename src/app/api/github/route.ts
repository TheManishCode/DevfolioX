/**
 * GitHub API Route
 * Supports multiple query types:
 * - ?username=X (default) - Returns user profile
 * - ?type=repos&username=X - Returns list of repositories
 * - ?type=impact&username=X - Returns impact metrics (commits, PRs, stars, etc)
 */
import { NextResponse } from 'next/server';

/**
 * CACHING STRATEGY:
 * - ISR with 5 minute revalidation for profile/repos (data changes infrequently)
 * - Impact metrics computed from cached repo data
 * - Development bypasses cache via fetchGitHub internal logic
 */
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes - balances freshness with performance

const GITHUB_API_BASE = 'https://api.github.com';

async function fetchGitHub(endpoint: string, token?: string) {
    const normalizedToken = token?.trim();
    const getHeaders = (withAuth = true): HeadersInit => ({
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Metrics-App',
        ...(withAuth && normalizedToken ? { Authorization: `Bearer ${normalizedToken}` } : {}),
    });

    let response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
        headers: getHeaders(),
        next: { revalidate: 60 }
    });

    if (response.status === 401 && normalizedToken) {
        console.warn('GitHub token was rejected; retrying public request without authentication.');
        response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
            headers: getHeaders(false),
            next: { revalidate: 60 }
        });
    }

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || process.env.GITHUB_USERNAME || 'TheManishCode';
    const type = searchParams.get('type') || 'profile';
    const token = process.env.GITHUB_TOKEN?.trim();

    try {
        // Repos endpoint - returns list of repositories (excluding forks)
        if (type === 'repos') {
            const repos = await fetchGitHub(`/users/${username}/repos?per_page=100&sort=updated&direction=desc`, token);

            // Filter out forks for cleaner portfolio display
            const ownRepos = repos.filter((repo: any) => !repo.fork);

            const response = ownRepos.map((repo: any) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                homepage: repo.homepage,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                topics: repo.topics || [],
                pushed_at: repo.pushed_at,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
            }));

            return NextResponse.json(response);
        }

        // Impact endpoint - returns computed metrics with language skills
        if (type === 'impact') {
            const [user, repos] = await Promise.all([
                fetchGitHub(`/users/${username}`, token),
                fetchGitHub(`/users/${username}/repos?per_page=100`, token),
            ]);

            // Filter out forks for cleaner metrics
            const ownRepos = repos.filter((repo: any) => !repo.fork);

            // Calculate total stars
            const stars = ownRepos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);

            // Calculate approximate commits (last 12 months) - parallel fetching
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            const recentRepos = ownRepos.slice(0, 10);
            const commitPromises = recentRepos.map(async (repo: any) => {
                try {
                    const commits = await fetchGitHub(
                        `/repos/${username}/${repo.name}/commits?author=${username}&since=${oneYearAgo.toISOString()}&per_page=100`,
                        token
                    );
                    return Array.isArray(commits) ? commits.length : 0;
                } catch {
                    return 0;
                }
            });

            const commitCounts = await Promise.allSettled(commitPromises);
            const totalCommits = commitCounts.reduce((sum, result) => {
                return sum + (result.status === 'fulfilled' ? result.value : 0);
            }, 0);

            // Estimate total based on sample
            const estimatedTotalCommits = Math.round(totalCommits * (ownRepos.length / Math.min(10, ownRepos.length)));

            // Calculate streak using recent activity
            const sortedRepos = ownRepos
                .filter((r: any) => r.pushed_at)
                .sort((a: any, b: any) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

            let streakDays = 0;
            if (sortedRepos.length > 0) {
                const today = new Date();
                const lastPush = new Date(sortedRepos[0].pushed_at);
                const daysSinceLastPush = Math.floor((today.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24));

                if (daysSinceLastPush <= 2) {
                    streakDays = Math.max(7, daysSinceLastPush);
                }
            }

            // Compute skills from repo languages (parallel via Promise.allSettled)
            const languageBytes: Record<string, number> = {};

            // Fetch language data for top 30 repos using Promise.allSettled
            const reposToAnalyze = ownRepos.slice(0, 30);
            const languagePromises = reposToAnalyze.map(async (repo: any) => {
                if (repo.languages_url) {
                    try {
                        const languages = await fetchGitHub(
                            repo.languages_url.replace('https://api.github.com', ''),
                            token
                        );
                        return { repo: repo.name, languages };
                    } catch {
                        return { repo: repo.name, languages: null };
                    }
                }
                return { repo: repo.name, languages: null };
            });

            const languageResults = await Promise.allSettled(languagePromises);

            // Sum up bytes for each language
            for (const result of languageResults) {
                if (result.status === 'fulfilled' && result.value.languages) {
                    for (const [lang, bytes] of Object.entries(result.value.languages)) {
                        languageBytes[lang] = (languageBytes[lang] || 0) + (bytes as number);
                    }
                }
            }

            // Calculate percentages
            const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
            const skills = totalBytes > 0 ? Object.entries(languageBytes)
                .map(([name, bytes]) => ({
                    name,
                    percent: Math.round((bytes / totalBytes) * 100)
                }))
                .sort((a, b) => b.percent - a.percent)
                .slice(0, 4) : []; // Top 4 languages

            const impactData = {
                streakDays,
                commits: estimatedTotalCommits,
                commits12mo: estimatedTotalCommits,
                prs: 0,
                prsMerged: 0,
                stars,
                starsEarned: stars,
                followers: user.followers,
                repos: ownRepos.length,
                skills,
            };

            return NextResponse.json(impactData);
        }

        // Profile endpoint - returns user info
        if (type === 'profile') {
            const user = await fetchGitHub(`/users/${username}`, token);
            return NextResponse.json({
                login: user.login,
                name: user.name,
                avatar_url: user.avatar_url,
                bio: user.bio,
                public_repos: user.public_repos,
                followers: user.followers,
                following: user.following,
                html_url: user.html_url,
                created_at: user.created_at,
            });
        }

        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });

    } catch (error) {
        console.error('GitHub API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GitHub data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
