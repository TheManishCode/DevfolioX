'use client';

import useSWR from 'swr';
import { PageHeader } from "@/components/layout/PageHeader";

// =============================================================================
// FETCHER
// =============================================================================
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`Failed to fetch: ${url} (${res.status})`);
    return null;
  }
  return res.json();
};

// =============================================================================
// SWR CONFIGS
// =============================================================================
const swrConfig = {
  refreshInterval: 60000,
  revalidateOnFocus: true,
  dedupingInterval: 2000,
};

const swrConfigFast = {
  refreshInterval: 30000,
  revalidateOnFocus: true,
  dedupingInterval: 2000,
};

// =============================================================================
// UI PRIMITIVES (UNCHANGED THEME)
// =============================================================================
function GridCell({
  children,
  span = 1,
  mobileSpan = 1,
  minHeight = "min-h-[220px]",
  className = "",
}: {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  mobileSpan?: 1 | 2;
  minHeight?: string;
  className?: string;
}) {
  const spanClasses: Record<1 | 2 | 3 | 4, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  };
  const mobileSpanClasses: Record<1 | 2, string> = {
    1: "col-span-1",
    2: "col-span-2",
  };

  return (
    <div
      className={`
        relative ${minHeight} p-5 sm:p-6 md:p-8 border-t border-l dark:border-white/10 border-zinc-400
        dark:hover:bg-white/[0.02] hover:bg-zinc-400/20 transition-colors duration-500
        ${mobileSpanClasses[mobileSpan]} ${spanClasses[span]} ${className}
      `}
    >
      <div className="absolute top-0 left-0 w-[4px] h-[4px] border-t border-l dark:border-white/40 border-zinc-500" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
    </div>
  );
}

function MetricLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.3em] text-zinc-500 mb-5 sm:mb-6 block">
      {children}
    </span>
  );
}

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded`} />;
}

// =============================================================================
// MAIN
// =============================================================================
export default function MetricsPage() {
  const { data: githubProfile, isLoading: githubProfileLoading } =
    useSWR("/api/github?username=TheManishCode", fetcher, swrConfig);

  const { data: reposData, isLoading: reposLoading } = useSWR(
    "/api/github?type=repos&username=TheManishCode",
    fetcher,
    swrConfig
  );

  const { data: githubImpact, isLoading: githubImpactLoading } = useSWR(
    "/api/github?type=impact&username=TheManishCode",
    fetcher,
    swrConfig
  );

  const { data: featuredProjects, isLoading: projectsLoading } = useSWR(
    "/api/projects?type=featured&username=TheManishCode",
    fetcher,
    swrConfig
  );

  const { data: leetcodeData, isLoading: leetcodeLoading } = useSWR(
    "/api/leetcode",
    fetcher,
    swrConfig
  );

  const { data: wakatimeData, isLoading: wakatimeLoading } = useSWR(
    "/api/wakatime",
    fetcher,
    swrConfig
  );

  const { data: spotifyData, isLoading: spotifyLoading } = useSWR(
    "/api/now-playing",
    fetcher,
    swrConfigFast
  );

  const { data: malData, isLoading: malLoading } = useSWR(
    "/api/mal?type=stats",
    fetcher,
    swrConfig
  );

  const { data: duolingoData, isLoading: duolingoLoading } = useSWR(
    "/api/duolingo",
    fetcher,
    swrConfig
  );

  const repos = Array.isArray(reposData) ? reposData : reposData?.repos || [];
  const skills = githubImpact?.skills || [];

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 lg:pt-28 pb-20 bg-transparent">
        <PageHeader
          badge="Recruiter Terminal v5.0"
          title="System Metrics"
          description="Live performance indices, specialized competencies, and automated telemetry."
        />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-r border-b dark:border-white/10 border-zinc-400">

          {/* ROW 1 */}
          <GridCell span={3} mobileSpan={2} minHeight="min-h-[240px]">
            <MetricLabel>Coding Activity / 7 Days</MetricLabel>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mt-auto">
              <div>
                <h2 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter dark:text-white text-zinc-900">
                  {wakatimeLoading ? "..." : wakatimeData?.totalHoursFormatted || "0h 0m"}
                </h2>
                <p className="text-zinc-500 mt-2 font-mono text-[11px] uppercase tracking-widest">
                  Active Development Focus
                </p>
              </div>

              <div className="flex-1 w-full max-w-xs space-y-4 pb-2">
                {wakatimeLoading ? (
                  <div className="space-y-3">
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine />
                  </div>
                ) : wakatimeData?.languages?.length > 0 ? (
                  wakatimeData.languages.slice(0, 3).map((lang: any) => (
                    <div key={lang.name} className="group">
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-1 group-hover:dark:text-white group-hover:text-zinc-900 transition-colors">
                        <span>{lang.name}</span>
                        <span>{lang.percent}%</span>
                      </div>
                      <div className="h-[1px] w-full dark:bg-white/5 bg-zinc-400/30 overflow-hidden">
                        <div
                          className="h-full dark:bg-white/30 bg-zinc-600 transition-all duration-1000"
                          style={{ width: `${lang.percent}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-zinc-600 italic">No language data available</p>
                )}
              </div>
            </div>
          </GridCell>

          <GridCell span={1} minHeight="min-h-[240px]">
            <MetricLabel>Logic Benchmarks</MetricLabel>
            <div className="mt-auto">
              <span className="text-5xl font-light dark:text-white text-zinc-900 leading-none">
                {leetcodeLoading ? "..." : leetcodeData?.stats?.totalSolved || 0}
              </span>
              <p className="text-zinc-500 text-[11px] uppercase tracking-widest mt-4">
                Problems Solved
              </p>
            </div>
          </GridCell>

          {/* ROW 2 (TALL LISTS) */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[340px]" className="!justify-start">
            <MetricLabel>Development Roadmap</MetricLabel>

            <div className="space-y-5 mt-4">
              {reposLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-10 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded" />
                  ))}
                </div>
              ) : repos.length > 0 ? (
                repos.slice(0, 8).map((repo: any) => (
                  <a
                    key={repo.id ?? repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b dark:border-white/5 border-zinc-400/50 pb-3 group/repo"
                  >
                    <div className="flex justify-between items-start sm:items-center mb-1 gap-3">
                      <h4 className="text-sm dark:text-white text-zinc-900 font-medium group-hover/repo:text-zinc-600 dark:group-hover/repo:text-[#33E092] transition-colors uppercase tracking-tight truncate">
                        {repo.name?.replace(/-/g, " ")}
                      </h4>
                      <span className="text-[8px] dark:bg-white/10 bg-zinc-400/30 px-2 py-[2px] rounded text-zinc-500 uppercase shrink-0">
                        {repo.language || "Code"}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-500 line-clamp-1 italic font-light tracking-wide">
                      {repo.description || "Architecture development and system optimization."}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 italic">No repository data available.</p>
              )}
            </div>
          </GridCell>

          <GridCell span={2} mobileSpan={2} minHeight="min-h-[340px]" className="!justify-start">
            <MetricLabel>Featured Deployments</MetricLabel>

            <div className="space-y-5 mt-4">
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded" />
                  ))}
                </div>
              ) : Array.isArray(featuredProjects) && featuredProjects.length > 0 ? (
                featuredProjects.slice(0, 4).map((p: any) => (
                  <div key={p.id ?? p.name} className="border-b dark:border-white/5 border-zinc-400/50 pb-4 group">
                    <div className="flex justify-between items-start sm:items-center gap-4">
                      <h4 className="text-sm dark:text-white text-zinc-900 font-medium uppercase tracking-tight truncate group-hover:text-zinc-600 dark:group-hover:text-[#33E092] transition-colors">
                        {p.name}
                      </h4>

                      <span className="text-[8px] dark:bg-white/10 bg-zinc-400/30 px-2 py-[2px] rounded text-zinc-500 uppercase tracking-widest shrink-0">
                        {p.status || "DEPLOYED"}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-500 line-clamp-2 italic font-light tracking-wide mt-2">
                      {p.description || "Production-grade system module deployed successfully."}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-[0.22em] font-bold truncate">
                        {p.stack || "Code"}
                      </span>

                      <div className="flex gap-4 shrink-0">
                        {p.liveUrl ? (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-[#33E092] transition-colors"
                          >
                            Live
                          </a>
                        ) : null}

                        {p.githubUrl ? (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-[#33E092] transition-colors"
                          >
                            Code
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 italic">No featured deployments available.</p>
              )}
            </div>
          </GridCell>

          {/* ROW 3 (COMPACT STATS - NO EMPTY SPACE) */}
          <GridCell span={1} minHeight="min-h-[220px]">
            <MetricLabel>GitHub Impact</MetricLabel>

            {githubImpactLoading ? (
              <div className="space-y-5 mt-auto">
                <SkeletonLine w="w-20" />
                <SkeletonLine w="w-24" />
                <SkeletonLine w="w-16" />
              </div>
            ) : githubImpact ? (
              <div className="mt-auto space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-3xl font-light dark:text-white text-zinc-900 leading-none">
                      {githubImpact.streakDays ?? 0}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.22em] text-zinc-600 font-bold mt-2">
                      Streak (days)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-light dark:text-white text-zinc-900 leading-none">
                      {githubImpact.stars ?? 0}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.22em] text-zinc-600 font-bold mt-2">
                      Stars
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-white/5 border-zinc-400/50 pt-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">
                    {githubProfileLoading ? "..." : `@${githubProfile?.login || "standby"}`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-600 italic mt-auto">Impact unavailable</p>
            )}
          </GridCell>

          <GridCell span={1} minHeight="min-h-[220px]">
            <MetricLabel>Stack Proficiency</MetricLabel>

            <div className="mt-auto space-y-6">
              {githubImpactLoading ? (
                <div className="space-y-4">
                  <SkeletonLine w="w-16" />
                  <SkeletonLine w="w-24" />
                </div>
              ) : skills.length > 0 ? (
                skills.slice(0, 2).map((skill: any) => (
                  <div key={skill.name}>
                    <div className="flex justify-between gap-2 text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                      <span className="truncate">{skill.name}</span>
                      <span>{skill.percent}%</span>
                    </div>
                    <div className="h-[1px] w-full dark:bg-white/5 bg-zinc-400/30 overflow-hidden">
                      <div className="h-full dark:bg-white/20 bg-zinc-600" style={{ width: `${skill.percent}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 italic">
                  No telemetry available
                </p>
              )}

              <div className="border-t dark:border-white/5 border-zinc-400/50 pt-4">
                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">
                  Auto derived
                </p>
              </div>
            </div>
          </GridCell>

          <GridCell span={1} minHeight="min-h-[220px]">
            <div className="flex justify-between items-start">
              <MetricLabel>{spotifyData?.isPlaying ? "Active Stream" : "Last Session"}</MetricLabel>

              <svg
                className="w-6 h-6 text-[#1DB954] hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>

            <div className="mt-auto">
              {spotifyLoading ? (
                <div className="h-14 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded-lg" />
              ) : (
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white text-zinc-900 tracking-tight mb-1 line-clamp-1">
                    {spotifyData?.title || "Silence"}
                  </h3>
                  <p className="text-[10px] sm:text-[13px] text-zinc-500 uppercase tracking-[0.14em] sm:tracking-[0.2em] font-medium line-clamp-1">
                    {spotifyData?.artist || "Standby"}
                  </p>
                </div>
              )}
            </div>
          </GridCell>

          <GridCell span={1} minHeight="min-h-[220px]">
            <MetricLabel>Entertainment History</MetricLabel>

            <div className="flex justify-between items-end mt-auto">
              {malLoading ? (
                <div className="flex-1 space-y-2">
                  <SkeletonLine w="w-20" />
                  <SkeletonLine w="w-16" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-5xl font-light dark:text-white text-zinc-900 leading-none tracking-tighter">
                      {malData?.totalWatched || 0}
                    </span>
                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest mt-3 font-bold">
                      Titles
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-light text-zinc-500 leading-none">
                      {malData?.daysWatched || 0}
                    </span>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-2">
                      Days Total
                    </p>
                  </div>
                </>
              )}
            </div>
          </GridCell>

          {/* ROW 4 - Technical Competency (Split into 2 boxes) */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[180px]">
            <MetricLabel>Academic Focus (VTU)</MetricLabel>
            <div className="mt-auto">
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                Core focus: Data Engineering, MLOps, Responsible AI, and NLP.
              </p>
            </div>
          </GridCell>

          <GridCell span={2} mobileSpan={2} minHeight="min-h-[180px]">
            <div className="flex justify-between items-start">
              <MetricLabel>Data Governance</MetricLabel>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-500/50 border border-emerald-600/30 dark:border-emerald-500/20 px-2 py-0.5 uppercase tracking-wider">
                Certified
              </span>
            </div>
            <div className="mt-auto">
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Synapse professional certification in data privacy and policy management.
              </p>
            </div>
          </GridCell>

          {/* ROW 5 - Language Learning (Full width) */}
          <GridCell span={4} mobileSpan={2} minHeight="min-h-[200px]">
            <div className="flex justify-between items-start">
              <MetricLabel>Language Learning</MetricLabel>
              <svg
                className="w-6 h-6 text-[#58CC02] hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>

            <div className="flex flex-wrap justify-between items-end gap-5 mt-auto max-w-md">
              {duolingoLoading ? (
                <div className="flex-1 space-y-2">
                  <SkeletonLine w="w-24" />
                  <SkeletonLine w="w-16" />
                </div>
              ) : duolingoData ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-5xl font-light dark:text-white text-zinc-900 leading-none tracking-tighter">
                      {duolingoData.streak || 0}
                    </span>
                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest mt-3 font-bold">
                      Day Streak
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-light text-zinc-500 leading-none">
                      {duolingoData.totalXp || 0}
                    </span>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-2">
                      Total XP
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-lg font-medium text-[#58CC02] leading-none uppercase">
                      {duolingoData.currentLanguage || "—"}
                    </span>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-2">
                      Current
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-zinc-600 italic">Duolingo not connected</p>
              )}
            </div>
          </GridCell>

        </div>

        <footer className="mt-14 text-center">
          <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-medium">
            AVAILABLE FOR PROFESSIONAL HIRE 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
