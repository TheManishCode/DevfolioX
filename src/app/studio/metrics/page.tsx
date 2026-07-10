'use client';

import useSWR from 'swr';
import { PageHeader } from "@/components/layout/PageHeader";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data && typeof data === 'object' && 'error' in data) return null;
  return data;
};

const swrConfig = { refreshInterval: 60000, revalidateOnFocus: true, dedupingInterval: 2000 };

// =============================================================================
// PRIMITIVES
// =============================================================================

/**
 * Grid cell — pass `href` to make the entire box a clickable link to a profile.
 * Inner links still work: content is z-10, the overlay anchor is z-0.
 */
function GridCell({
  children, span = 1, mobileSpan = 1, minHeight = "min-h-[220px]", className = "", href,
}: {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  mobileSpan?: 1 | 2;
  minHeight?: string;
  className?: string;
  href?: string;
}) {
  const spanMap: Record<1 | 2 | 3 | 4, string> = {
    1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4",
  };
  const mobileMap: Record<1 | 2, string> = { 1: "col-span-1", 2: "col-span-2" };

  return (
    <div className={`relative ${minHeight} p-5 sm:p-6 md:p-8 border-t border-l dark:border-white/10 border-zinc-400 transition-colors duration-300 ${href ? "cursor-pointer group/cell dark:hover:bg-white/[0.04] hover:bg-zinc-400/25" : "dark:hover:bg-white/[0.02] hover:bg-zinc-400/15"} ${mobileMap[mobileSpan]} ${spanMap[span]} ${className}`}>

      {/* Overlay anchor — fills whole cell, sits beneath all content */}
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="absolute inset-0 z-0"
          aria-label="Open profile" />
      )}

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-[4px] h-[4px] border-t border-l dark:border-white/40 border-zinc-500 z-10 pointer-events-none" />

      {/* ↗ hint — appears top-right on hover */}
      {href && (
        <span className="absolute top-4 right-4 z-10 text-[10px] text-zinc-600 dark:text-zinc-500 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none select-none">
          ↗
        </span>
      )}

      {/* All cell content — above the overlay so inner links work normally */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
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

/** Small footer attribution — tells users exactly where to verify the data */
function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-[0.25em] font-mono flex items-center gap-1 w-fit relative z-20">
      ↗ {label}
    </a>
  );
}

function StatNumber({ children, size = "lg" }: { children: React.ReactNode; size?: "xl" | "lg" | "md" | "sm" }) {
  const sizes = { xl: "text-5xl sm:text-6xl md:text-8xl", lg: "text-5xl", md: "text-3xl", sm: "text-2xl" };
  return (
    <span className={`${sizes[size]} font-light dark:text-white text-zinc-900 leading-none tracking-tighter`}>
      {children}
    </span>
  );
}

function StatCaption({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-medium">{children}</p>;
}

function BarRow({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="group/bar">
      <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-1 group-hover/bar:dark:text-white group-hover/bar:text-zinc-900 transition-colors">
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
    <span className="inline-flex items-center gap-1.5 pointer-events-none">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      <span className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-500 font-bold">Live</span>
    </span>
  );
}

function ApiUnavailable({ service }: { service: string }) {
  return (
    <p className="text-[10px] text-zinc-600 italic mt-auto">{service} data unavailable right now</p>
  );
}

// =============================================================================
// PAGE
// =============================================================================
export default function MetricsPage() {
  const { data: githubImpact,    isLoading: githubImpactLoading } = useSWR("/api/github?type=impact&username=TheManishCode", fetcher, swrConfig);
  const { data: reposData,       isLoading: reposLoading }        = useSWR("/api/github?type=repos&username=TheManishCode",  fetcher, swrConfig);
  const { data: featuredProjects,isLoading: projectsLoading }     = useSWR("/api/projects?type=featured",                   fetcher, swrConfig);
  const { data: leetcodeData,    isLoading: leetcodeLoading }     = useSWR("/api/leetcode",                                 fetcher, swrConfig);
  const { data: wakatimeData,    isLoading: wakatimeLoading }     = useSWR("/api/wakatime",                                 fetcher, swrConfig);
  const { data: malData,         isLoading: malLoading }          = useSWR("/api/mal?type=stats",                           fetcher, swrConfig);
  const { data: duolingoData,    isLoading: duolingoLoading }     = useSWR("/api/duolingo",                                 fetcher, swrConfig);

  const repos  = Array.isArray(reposData) ? reposData : [];
  const skills: { name: string; percent: number }[] = githubImpact?.skills ?? [];
  const days   = githubImpact?.daysSinceLastPush ?? 999;
  const lastActiveLabel =
    days === 0 ? "Active today" :
    days === 1 ? "Active yesterday" :
    days < 7   ? `Active ${days}d ago` :
    days < 999 ? `Last push ${days}d ago` : "—";

  // 5000001 is LeetCode's sentinel for "unranked" — suppress it
  const lcRanking: number = leetcodeData?.stats?.ranking ?? 0;
  const lcRankDisplay = lcRanking > 0 && lcRanking < 1_000_000
    ? `Rank #${lcRanking.toLocaleString()}`
    : null;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 lg:pt-28 pb-20">
        <PageHeader
          badge="Live Dashboard"
          title="System Metrics"
          description="Real-time activity across coding, learning, and creative work — pulled fresh from external APIs."
        />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-r border-b dark:border-white/10 border-zinc-400">

          {/* ── WAKATIME ─────────────────────────────────────────────────────── */}
          <GridCell span={3} mobileSpan={2} minHeight="min-h-[280px]"
            href="https://wakatime.com/@TheManishCode">

            <div className="flex justify-between items-start">
              <CellLabel>WakaTime · Coding Activity (Last 7 Days)</CellLabel>
              <LiveDot />
            </div>

            {wakatimeLoading ? (
              <div className="space-y-3"><SkeletonLine /><SkeletonLine w="w-2/3" /></div>
            ) : wakatimeData ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mt-auto">
                <div>
                  <StatNumber size="xl">{wakatimeData.totalHoursFormatted}</StatNumber>
                  <p className="text-zinc-500 mt-2 font-mono text-[11px] uppercase tracking-widest">Total coding time</p>
                  {wakatimeData.dailyAverageFormatted && (
                    <p className="text-zinc-600 mt-1 font-mono text-[10px]">{wakatimeData.dailyAverageFormatted} / day avg</p>
                  )}
                </div>
                <div className="flex-1 w-full max-w-xs space-y-4 pb-2">
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-3">Languages this week</p>
                  {wakatimeData.languages?.slice(0, 3).map((lang: { name: string; percent: number; hours: string }) => (
                    <BarRow key={lang.name} label={lang.name} value={lang.percent} sub={lang.hours} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-auto space-y-3">
                <p className="text-4xl font-light dark:text-zinc-700 text-zinc-400">—</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">No coding activity tracked yet</p>
                <p className="text-[9px] text-zinc-600 italic">Install the WakaTime plugin in your editor to start tracking</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://wakatime.com/@TheManishCode" label="wakatime.com/@TheManishCode" />
            </div>
          </GridCell>

          {/* ── LEETCODE ─────────────────────────────────────────────────────── */}
          <GridCell span={1} minHeight="min-h-[280px]"
            href="https://leetcode.com/u/rixscx">

            <CellLabel>LeetCode · Problems Solved</CellLabel>

            {leetcodeLoading ? (
              <div className="space-y-3 mt-auto">
                <SkeletonLine w="w-24" /><SkeletonLine /><SkeletonLine w="w-20" />
              </div>
            ) : leetcodeData?.stats ? (
              <div className="mt-auto space-y-5">
                <div>
                  <StatNumber size="lg">{leetcodeData.stats.totalSolved}</StatNumber>
                  <StatCaption>Total solved</StatCaption>
                </div>
                <div className="space-y-2.5 border-t dark:border-white/5 border-zinc-400/50 pt-4">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-emerald-600 dark:text-emerald-500 font-bold">Easy</span>
                    <span className="dark:text-white text-zinc-900 font-semibold">{leetcodeData.stats.easySolved}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-amber-500 font-bold">Medium</span>
                    <span className="dark:text-white text-zinc-900 font-semibold">{leetcodeData.stats.mediumSolved}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-red-500 font-bold">Hard</span>
                    <span className="dark:text-white text-zinc-900 font-semibold">{leetcodeData.stats.hardSolved}</span>
                  </div>
                </div>
                {lcRankDisplay && (
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{lcRankDisplay}</p>
                )}
              </div>
            ) : (
              <ApiUnavailable service="LeetCode" />
            )}

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://leetcode.com/u/rixscx" label="leetcode.com/u/rixscx" />
            </div>
          </GridCell>

          {/* ── RECENT REPOS ─────────────────────────────────────────────────── */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[360px]" className="!justify-start"
            href="https://github.com/TheManishCode?tab=repositories">

            <CellLabel>GitHub · Recent Repositories</CellLabel>

            <div className="space-y-5 mt-4 flex-1">
              {reposLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded" />)}
                </div>
              ) : repos.length > 0 ? (
                repos.slice(0, 8).map((repo: { id?: number; name: string; html_url: string; description?: string | null; language?: string | null }) => (
                  <a key={repo.id ?? repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    className="relative z-20 block border-b dark:border-white/5 border-zinc-400/50 pb-3 group/repo">
                    <div className="flex justify-between items-center mb-1 gap-3">
                      <h4 className="text-sm dark:text-white text-zinc-900 font-medium group-hover/repo:dark:text-[#33E092] group-hover/repo:text-zinc-600 transition-colors uppercase tracking-tight truncate">
                        {repo.name?.replace(/-/g, " ")}
                      </h4>
                      {repo.language && (
                        <span className="text-[8px] dark:bg-white/10 bg-zinc-400/30 px-2 py-[2px] rounded text-zinc-500 uppercase shrink-0">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 italic font-light tracking-wide">
                      {repo.description ?? "No description"}
                    </p>
                  </a>
                ))
              ) : (
                <ApiUnavailable service="GitHub repos" />
              )}
            </div>

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://github.com/TheManishCode?tab=repositories" label="github.com/TheManishCode — sorted by last push" />
            </div>
          </GridCell>

          {/* ── FEATURED PROJECTS ────────────────────────────────────────────── */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[360px]" className="!justify-start"
            href="https://github.com/TheManishCode">

            <CellLabel>Projects · Featured Deployments</CellLabel>

            <div className="space-y-5 mt-4 flex-1">
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-14 w-full animate-pulse dark:bg-white/5 bg-zinc-400/30 rounded" />)}
                </div>
              ) : Array.isArray(featuredProjects) && featuredProjects.length > 0 ? (
                featuredProjects.slice(0, 4).map((p: {
                  id?: string; name: string; description?: string | null;
                  stack?: string | null; status?: string | null;
                  liveUrl?: string | null; githubUrl?: string | null;
                }) => (
                  <div key={p.id ?? p.name} className="border-b dark:border-white/5 border-zinc-400/50 pb-4">
                    <div className="flex justify-between items-center gap-4">
                      <h4 className="text-sm dark:text-white text-zinc-900 font-medium uppercase tracking-tight truncate">
                        {p.name}
                      </h4>
                      <span className={`text-[8px] px-2 py-[2px] rounded uppercase tracking-widest shrink-0 border ${
                        p.status === "COMPLETED"
                          ? "border-emerald-600/30 text-emerald-600 dark:text-emerald-500 dark:border-emerald-500/20"
                          : "dark:bg-white/10 bg-zinc-400/30 border-transparent text-zinc-500"
                      }`}>
                        {p.status ?? "Active"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 italic font-light tracking-wide mt-2">
                      {p.description ?? "—"}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-[0.22em] font-bold">{p.stack ?? ""}</span>
                      <div className="flex gap-4">
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="relative z-20 text-[10px] uppercase tracking-widest text-zinc-500 hover:dark:text-[#33E092] hover:text-zinc-900 transition-colors">
                            Live ↗
                          </a>
                        )}
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="relative z-20 text-[10px] uppercase tracking-widest text-zinc-500 hover:dark:text-[#33E092] hover:text-zinc-900 transition-colors">
                            Code ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <ApiUnavailable service="Projects" />
              )}
            </div>

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://github.com/TheManishCode" label="github.com/TheManishCode" />
            </div>
          </GridCell>

          {/* ── GITHUB ACCOUNT ───────────────────────────────────────────────── */}
          <GridCell span={1} minHeight="min-h-[240px]"
            href="https://github.com/TheManishCode">

            <CellLabel>GitHub · Account Stats</CellLabel>

            {githubImpactLoading ? (
              <div className="space-y-5 mt-auto">
                <SkeletonLine w="w-20" /><SkeletonLine w="w-24" /><SkeletonLine w="w-16" />
              </div>
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
                <div className="space-y-1 border-t dark:border-white/5 border-zinc-400/50 pt-3">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">{githubImpact.followers ?? 0} followers</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">{githubImpact.commits ?? 0} commits (est.)</p>
                  <p className="text-[9px] text-zinc-600 italic uppercase tracking-widest">{lastActiveLabel}</p>
                </div>
              </div>
            ) : (
              <ApiUnavailable service="GitHub" />
            )}

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://github.com/TheManishCode" label="github.com/TheManishCode" />
            </div>
          </GridCell>

          {/* ── GITHUB LANGUAGES ─────────────────────────────────────────────── */}
          <GridCell span={1} minHeight="min-h-[240px]"
            href="https://github.com/TheManishCode?tab=repositories">

            <CellLabel>GitHub · Top Languages</CellLabel>

            <div className="mt-auto space-y-5">
              {githubImpactLoading ? (
                <div className="space-y-4">
                  <SkeletonLine w="w-16" /><SkeletonLine w="w-24" /><SkeletonLine w="w-20" />
                </div>
              ) : skills.length > 0 ? (
                skills.slice(0, 4).map((s) => (
                  <BarRow key={s.name} label={s.name} value={s.percent} />
                ))
              ) : (
                <ApiUnavailable service="Language data" />
              )}
            </div>

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://github.com/TheManishCode?tab=repositories" label="calculated from repo byte counts" />
            </div>
          </GridCell>

          {/* ── MAL ──────────────────────────────────────────────────────────── */}
          <GridCell span={1} minHeight="min-h-[240px]"
            href="https://myanimelist.net/profile/reizoku">

            <CellLabel>MyAnimeList · Watch Stats</CellLabel>

            {malLoading ? (
              <div className="space-y-2 mt-auto"><SkeletonLine w="w-20" /><SkeletonLine w="w-16" /></div>
            ) : malData ? (
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <StatNumber size="lg">{malData.totalWatched ?? 0}</StatNumber>
                    <StatCaption>Titles completed</StatCaption>
                  </div>
                  <div className="text-right">
                    <StatNumber size="sm">{malData.daysWatched ?? 0}</StatNumber>
                    <StatCaption>Days watched</StatCaption>
                  </div>
                </div>
                <div className="space-y-1 border-t dark:border-white/5 border-zinc-400/50 pt-3">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">{malData.episodesWatched ?? 0} episodes total</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">Mean score: {malData.meanScore ?? "—"} / 10</p>
                  {(malData.watching ?? 0) > 0 && (
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">{malData.watching} currently watching</p>
                  )}
                </div>
              </div>
            ) : (
              <ApiUnavailable service="MyAnimeList" />
            )}

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://myanimelist.net/profile/reizoku" label="myanimelist.net/profile/reizoku" />
            </div>
          </GridCell>

          {/* ── EDUCATION ────────────────────────────────────────────────────── */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[160px]">
            <div className="flex items-start justify-between">
              <CellLabel>Education · VTU B.E. Computer Science</CellLabel>
              <span className="text-[9px] text-zinc-500 border border-zinc-400/50 dark:border-white/10 px-2 py-0.5 uppercase tracking-wider shrink-0">2022–2026</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed mt-auto">
              Bachelor of Engineering — Visvesvaraya Technological University. Focus: Data Engineering, MLOps, Responsible AI, NLP.
            </p>
          </GridCell>

          {/* ── CERTIFICATION ────────────────────────────────────────────────── */}
          <GridCell span={2} mobileSpan={2} minHeight="min-h-[160px]">
            <div className="flex justify-between items-start">
              <CellLabel>Certification · Data Governance</CellLabel>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-500/70 border border-emerald-600/30 dark:border-emerald-500/20 px-2 py-0.5 uppercase tracking-wider shrink-0">Certified</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed mt-auto">
              Synapse professional certification — data privacy, policy management, and governance frameworks.
            </p>
          </GridCell>

          {/* ── DUOLINGO ─────────────────────────────────────────────────────── */}
          <GridCell span={4} mobileSpan={2} minHeight="min-h-[200px]"
            href="https://www.duolingo.com/profile/ManishP158369">

            <div className="flex justify-between items-start">
              <CellLabel>Duolingo · Language Learning Progress</CellLabel>
              <svg className="w-5 h-5 text-[#58CC02] shrink-0 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>

            {duolingoLoading ? (
              <div className="flex gap-12 mt-auto"><SkeletonLine w="w-24" /><SkeletonLine w="w-16" /></div>
            ) : duolingoData ? (
              <div className="flex flex-wrap justify-between items-end gap-5 mt-auto max-w-lg">
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
              </div>
            ) : (
              <div className="mt-auto">
                <p className="text-[10px] text-zinc-500 italic">Duolingo public API is currently unavailable for this account.</p>
                <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-widest">Profile: ManishP158369</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t dark:border-white/5 border-zinc-400/30">
              <SourceLink href="https://www.duolingo.com/profile/ManishP158369" label="duolingo.com/profile/ManishP158369" />
            </div>
          </GridCell>

        </div>

        <footer className="mt-14 text-center">
          <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-medium">
            All metrics auto-refresh every 60s · Pulled live from external APIs
          </p>
        </footer>
      </div>
    </div>
  );
}
