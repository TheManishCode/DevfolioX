'use client';

import useSWR from 'swr';
import { PageHeader } from "@/components/layout/PageHeader";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
};

const swrConfig = { refreshInterval: 60000, revalidateOnFocus: true, dedupingInterval: 2000 };
const swrConfigFast = { refreshInterval: 30000, revalidateOnFocus: true, dedupingInterval: 2000 };

// =============================================================================
// PRIMITIVES
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
  const spanMap: Record<1 | 2 | 3 | 4, string> = { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4" };
  const mobileMap: Record<1 | 2, string> = { 1: "col-span-1", 2: "col-span-2" };
  return (
    <div className={`relative ${minHeight} p-5 sm:p-6 md:p-8 border-t border-l dark:border-white/10 border-zinc-400 dark:hover:bg-white/[0.02] hover:bg-zinc-400/20 transition-colors duration-500 ${mobileMap[mobileSpan]} ${spanMap[span]} ${className}`}>
      <div className="absolute top-0 left-0 w-[4px] h-[4px] border-t border-l dark:border-white/40 border-zinc-500" />
      <div className="relative z-10 flex flex-col h-full justify-between">{children}</div>
    </div>
  );
}

function CellLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.3em] text-zinc-500 mb-5 sm:mb-6 block">
      {children}
    </span>
  );
}

function StatNumber({ children, size = "lg" }: { children: React.ReactNode; size?: "xl" | "lg" | "md" | "sm" }) {
  const sizes = { xl: "text-5xl sm:text-6xl md:text-8xl", lg: "text-5xl", md: "text-3xl", sm: "text-2xl" };
  return <span className={`${sizes[size]} font-light dark:text-white text-zinc-900 leading-none tracking-tighter`}>{children}</span>;
}

function StatCaption({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-medium">{children}</p>;
}

function BarRow({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="group">
      <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-1 group-hover:dark:text-white group-hover:text-zinc-900 transition-colors">
        <span>{label}</span>
        <span>{sub ?? `${value}%`}</span>
      </div>
      <div className="h-[1px] w-full dark:bg-white/5 bg-zinc-400/30 overflow-hidden">
        <div className="h-full dark:bg-white/30 bg-zinc-600 transition-all duration-1000" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded`} />;
}

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      <span className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-500 font-bold">Live</span>
    </span>
  );
}

function Unavailable({ label }: { label: string }) {
  return <p className="text-[10px] text-zinc-600 italic mt-auto">{label} not configured</p>;
}

// =============================================================================
// PAGE
// =============================================================================
export default function MetricsPage() {
  const { data: githubImpact, isLoading: githubImpactLoading } = useSWR("/api/github?type=impact&username=TheManishCode", fetcher, swrConfig);
  const { data: reposData, isLoading: reposLoading } = useSWR("/api/github?type=repos&username=TheManishCode", fetcher, swrConfig);
  const { data: featuredProjects, isLoading: projectsLoading } = useSWR("/api/projects?type=featured&username=TheManishCode", fetcher, swrConfig);
  const { data: leetcodeData, isLoading: leetcodeLoading } = useSWR("/api/leetcode", fetcher, swrConfig);
  const { data: wakatimeData, isLoading: wakatimeLoading } = useSWR("/api/wakatime", fetcher, swrConfig);
  const { data: spotifyData, isLoading: spotifyLoading } = useSWR("/api/now-playing", fetcher, swrConfigFast);
  const { data: malData, isLoading: malLoading } = useSWR("/api/mal?type=stats", fetcher, swrConfig);
  const { data: duolingoData, isLoading: duolingoLoading } = useSWR("/api/duolingo", fetcher, swrConfig);

  const repos = Array.isArray(reposData) ? reposData : reposData?.repos ?? [];
  const skills: { name: string; percent: number }[] = githubImpact?.skills ?? [];

  // Compute last-active label for GitHub
  const days: number = githubImpact?.daysSinceLastPush ?? 999;
  const lastActiveLabel = days === 0 ? "Active today" : days === 1 ? "Active yesterday" : days < 7 ? `Active ${days}d ago` : days < 999 ? `Last push ${days}d ago` : "—";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 lg:pt-28 pb-20">
        <PageHeader
          badge="Live Dashboard"
          title="System Metrics"
          description="Real-time activity across coding, learning, and creative work — pulled fresh from APIs."
        />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-r border-b dark:border-white/10 border-zinc-400">

          {/* ── ROW 1: WakaTime + LeetCode ── */}
          <GridCell span={3} mobileSpan={2} minHeight="min-h-[260px]">
            <div className="flex justify-between items-start">
              <CellLabel>WakaTime · Coding Activity (Last 7 Days)</CellLabel>
              <LiveDot />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mt-auto">
              <div>
                <StatNumber size="xl">
                  {wakatimeLoading ? "—" : wakatimeData?.totalHoursFormatted ?? "0h 0m"}
                </StatNumber>
                <p className="text-zinc-500 mt-2 font-mono text-[11px] uppercase tracking-widest">
                  Total coding time
                </p>
                {!wakatimeLoading && wakatimeData?.dailyAverageFormatted && (
                  <p className="text-zinc-600 mt-1 font-mono text-[10px]">
                    {wakatimeData.dailyAverageFormatted} / day avg
                  </p>
                )}
              </div>

              <div className="flex-1 w-full max-w-xs space-y-4 pb-2">
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-3">Top languages this week</p>
                {wakatimeLoading ? (
                  <div className="space-y-3"><SkeletonLine /><SkeletonLine /><SkeletonLine /></div>
                ) : wakatimeData?.languages?.length > 0 ? (
                  wakatimeData.languages.slice(0, 3).map((lang: { name: string; percent: number; hours: string }) => (
                    <BarRow key={lang.name} label={lang.name} value={lang.percent} sub={lang.hours} />
                  ))
                ) : (
                  <Unavailable label="WakaTime" />
                )}
              </div>
            </div>
          </GridCell>

          <GridCell span={1} minHeight="min-h-[260px]">
            <CellLabel>LeetCode · Problems Solved</CellLabel>
            {leetcodeLoading ? (
              <div className="space-y-3 mt-auto"><SkeletonLine w="w-24" /><SkeletonLine w="w-full" /><SkeletonLine w="w-20" /></div>
            ) : leetcodeData?.stats ? (
              <div className="mt-auto space-y-5">
                <div>
                  <StatNumber size="lg">{leetcodeData.stats.totalSolved}</StatNumber>
                  <StatCaption>Total solved</StatCaption>
                </div>
                <div className="space-y-2 border-t dark:border-white/5 border-zinc-400/50 pt-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="text-emerald-600 dark:text-emerald-500">Easy</span>
                    <span className="dark:text-white text-zinc-900 font-medium">{leetcodeData.stats.easySolved}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="text-amber-500">Medium</span>
                    <span className="dark:text-white text-zinc-900 font-medium">{leetcodeData.stats.mediumSolved}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="text-red-500">Hard</span>
                    <span className="dark:text-white text-zinc-900 font-medium">{leetcodeData.stats.hardSolved}</span>
                  </div>
                </div>
                {leetcodeData.stats.ranking > 0 && (
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest">
                    Rank #{leetcodeData.stats.ranking.toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <Unavailable label="LeetCode" />
            )}
          </GridCell>

          {/* ── ROW 2: Repos + Projects ── */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[340px]" className="!justify-start">
            <CellLabel>GitHub · Recent Repositories</CellLabel>
            <div className="space-y-5 mt-4">
              {reposLoading ? (
                <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="h-10 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded" />)}</div>
              ) : repos.length > 0 ? (
                repos.slice(0, 8).map((repo: { id?: number; name: string; html_url: string; description?: string; language?: string }) => (
                  <a key={repo.id ?? repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    className="block border-b dark:border-white/5 border-zinc-400/50 pb-3 group/repo">
                    <div className="flex justify-between items-center mb-1 gap-3">
                      <h4 className="text-sm dark:text-white text-zinc-900 font-medium group-hover/repo:text-zinc-600 dark:group-hover/repo:text-[#33E092] transition-colors uppercase tracking-tight truncate">
                        {repo.name?.replace(/-/g, " ")}
                      </h4>
                      <span className="text-[8px] dark:bg-white/10 bg-zinc-400/30 px-2 py-[2px] rounded text-zinc-500 uppercase shrink-0">
                        {repo.language ?? "Code"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 italic font-light tracking-wide">
                      {repo.description ?? "No description"}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 italic">No repositories found</p>
              )}
            </div>
          </GridCell>

          <GridCell span={2} mobileSpan={2} minHeight="min-h-[340px]" className="!justify-start">
            <CellLabel>Projects · Featured Deployments</CellLabel>
            <div className="space-y-5 mt-4">
              {projectsLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-14 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded" />)}</div>
              ) : Array.isArray(featuredProjects) && featuredProjects.length > 0 ? (
                featuredProjects.slice(0, 4).map((p: { id?: string; name: string; description?: string; stack?: string; status?: string; liveUrl?: string; githubUrl?: string }) => (
                  <div key={p.id ?? p.name} className="border-b dark:border-white/5 border-zinc-400/50 pb-4 group">
                    <div className="flex justify-between items-center gap-4">
                      <h4 className="text-sm dark:text-white text-zinc-900 font-medium uppercase tracking-tight truncate group-hover:text-zinc-600 dark:group-hover:text-[#33E092] transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[8px] dark:bg-white/10 bg-zinc-400/30 px-2 py-[2px] rounded text-zinc-500 uppercase tracking-widest shrink-0">
                        {p.status ?? "Deployed"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 italic font-light tracking-wide mt-2">
                      {p.description ?? "—"}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-[0.22em] font-bold truncate">{p.stack ?? ""}</span>
                      <div className="flex gap-4 shrink-0">
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-[#33E092] transition-colors">Live ↗</a>}
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-[#33E092] transition-colors">Code ↗</a>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 italic">No featured projects available</p>
              )}
            </div>
          </GridCell>

          {/* ── ROW 3: GitHub stats + Languages + Spotify + Anime ── */}
          <GridCell span={1} minHeight="min-h-[220px]">
            <CellLabel>GitHub · Account Stats</CellLabel>
            {githubImpactLoading ? (
              <div className="space-y-5 mt-auto"><SkeletonLine w="w-20" /><SkeletonLine w="w-24" /><SkeletonLine w="w-16" /></div>
            ) : githubImpact ? (
              <div className="mt-auto space-y-5">
                <div className="flex justify-between items-end">
                  <div>
                    <StatNumber size="md">{githubImpact.repos ?? 0}</StatNumber>
                    <StatCaption>Repositories</StatCaption>
                  </div>
                  <div className="text-right">
                    <StatNumber size="md">{githubImpact.stars ?? 0}</StatNumber>
                    <StatCaption>Stars earned</StatCaption>
                  </div>
                </div>
                <div className="border-t dark:border-white/5 border-zinc-400/50 pt-3 flex justify-between items-center">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">
                    {githubImpact.followers ?? 0} followers
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{lastActiveLabel}</p>
                </div>
              </div>
            ) : (
              <Unavailable label="GitHub" />
            )}
          </GridCell>

          <GridCell span={1} minHeight="min-h-[220px]">
            <CellLabel>GitHub · Top Languages</CellLabel>
            <div className="mt-auto space-y-5">
              {githubImpactLoading ? (
                <div className="space-y-4"><SkeletonLine w="w-16" /><SkeletonLine w="w-24" /><SkeletonLine w="w-20" /></div>
              ) : skills.length > 0 ? (
                <>
                  {skills.slice(0, 3).map((skill) => (
                    <BarRow key={skill.name} label={skill.name} value={skill.percent} />
                  ))}
                  <div className="border-t dark:border-white/5 border-zinc-400/50 pt-3">
                    <p className="text-[9px] text-zinc-600 uppercase tracking-[0.25em]">By code volume across all repos</p>
                  </div>
                </>
              ) : (
                <Unavailable label="Language data" />
              )}
            </div>
          </GridCell>

          <GridCell span={1} minHeight="min-h-[220px]">
            <div className="flex justify-between items-start">
              <CellLabel>{spotifyData?.isPlaying ? "Spotify · Now Playing" : "Spotify · Last Played"}</CellLabel>
              <svg className="w-5 h-5 text-[#1DB954] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
            <div className="mt-auto">
              {spotifyLoading ? (
                <div className="h-14 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded-lg" />
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold dark:text-white text-zinc-900 tracking-tight mb-1 line-clamp-2">
                    {spotifyData?.title ?? "Nothing playing"}
                  </h3>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] font-medium line-clamp-1">
                    {spotifyData?.artist ?? "Standby"}
                  </p>
                  {spotifyData?.isPlaying && (
                    <div className="mt-2"><LiveDot /></div>
                  )}
                </>
              )}
            </div>
          </GridCell>

          <GridCell span={1} minHeight="min-h-[220px]">
            <CellLabel>MyAnimeList · Watch History</CellLabel>
            {malLoading ? (
              <div className="flex-1 space-y-2 mt-auto"><SkeletonLine w="w-20" /><SkeletonLine w="w-16" /></div>
            ) : malData ? (
              <div className="flex justify-between items-end mt-auto">
                <div>
                  <StatNumber size="lg">{malData.totalWatched ?? 0}</StatNumber>
                  <StatCaption>Titles completed</StatCaption>
                </div>
                <div className="text-right">
                  <StatNumber size="sm">{malData.daysWatched ?? 0}</StatNumber>
                  <StatCaption>Days watched</StatCaption>
                </div>
              </div>
            ) : (
              <Unavailable label="MyAnimeList" />
            )}
          </GridCell>

          {/* ── ROW 4: Static context cells ── */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[160px]">
            <div className="flex items-start justify-between">
              <CellLabel>Education · VTU B.E. (CS)</CellLabel>
              <span className="text-[9px] text-zinc-500 border border-zinc-400/50 dark:border-white/10 px-2 py-0.5 uppercase tracking-wider">2022–2026</span>
            </div>
            <div className="mt-auto">
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Bachelor of Engineering in Computer Science. Core focus: Data Engineering, MLOps, Responsible AI, and NLP.
              </p>
            </div>
          </GridCell>

          <GridCell span={2} mobileSpan={2} minHeight="min-h-[160px]">
            <div className="flex justify-between items-start">
              <CellLabel>Certification · Data Governance</CellLabel>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-500/70 border border-emerald-600/30 dark:border-emerald-500/20 px-2 py-0.5 uppercase tracking-wider">Certified</span>
            </div>
            <div className="mt-auto">
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Synapse professional certification covering data privacy, policy management, and governance frameworks.
              </p>
            </div>
          </GridCell>

          {/* ── ROW 5: Duolingo ── */}
          <GridCell span={4} mobileSpan={2} minHeight="min-h-[200px]">
            <div className="flex justify-between items-start">
              <CellLabel>Duolingo · Language Learning</CellLabel>
              <svg className="w-5 h-5 text-[#58CC02] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-5 mt-auto max-w-lg">
              {duolingoLoading ? (
                <div className="flex-1 space-y-2"><SkeletonLine w="w-24" /><SkeletonLine w="w-16" /></div>
              ) : duolingoData ? (
                <>
                  <div>
                    <StatNumber size="lg">{duolingoData.streak ?? 0}</StatNumber>
                    <StatCaption>Day streak</StatCaption>
                  </div>
                  <div>
                    <StatNumber size="md">{(duolingoData.totalXp ?? 0).toLocaleString()}</StatNumber>
                    <StatCaption>Total XP earned</StatCaption>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-[#58CC02] uppercase leading-none">
                      {duolingoData.currentLanguage ?? "—"}
                    </span>
                    <StatCaption>Studying now</StatCaption>
                  </div>
                </>
              ) : (
                <Unavailable label="Duolingo" />
              )}
            </div>
          </GridCell>

        </div>

        <footer className="mt-14 text-center">
          <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-medium">
            All metrics refresh automatically every 60 seconds
          </p>
        </footer>
      </div>
    </div>
  );
}
