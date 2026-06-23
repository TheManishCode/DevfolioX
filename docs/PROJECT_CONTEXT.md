# Project Context

Last updated: 2026-06-23

## Project Purpose

DevfolioX is a personal portfolio and digital garden for Manish P. It presents profile content, education, experience, projects, hobbies, writing, studio/toolkit pages, GitHub metrics, anime data, gaming data, coding activity, and social connection flows.

## Architecture Overview

- Framework: Next.js 15 App Router application in `src/app`.
- Runtime UI: React 18.
- Language: TypeScript with strict compiler settings.
- Styling: Tailwind CSS 4 via `@tailwindcss/postcss`, global CSS, and local fonts.
- Data model: Mostly static JSON/TS data under `src/data`, enriched by Next.js API routes that proxy or normalize external service data.
- Runtime APIs: Next.js route handlers under `src/app/api`.
- Auth: NextAuth.js v4 with GitHub and custom LinkedIn OAuth providers.
- Persistence: No database, ORM, migrations, or schema found. Guestbook/connect behavior currently depends on OAuth/session state and Discord webhook notifications.

## Repository Structure

- `.next/`: generated Next.js build/dev output, ignored.
- `docs/`: maintained architecture context and audit reports.
- `node_modules/`: root npm dependency install, ignored.
- `public/`: static images, audio, certificate images, resume PDF, game covers, anime banners, Pokedex SVG/media.
- `scripts/`: local maintenance/enrichment scripts.
- `src/app/`: App Router pages, layouts, and API routes.
- `src/assets/`: local font files and font config.
- `src/components/`: shared layout, navigation, provider, decorative, and UI components.
- `src/config/`: site and link configuration.
- `src/data/`: static portfolio, anime, game, certificate, education, research, article, and experience data.
- `src/features/`: domain-specific UI for anime, education, experience, GitHub, social, and workspace.
- `src/lib/`: external service clients and server-side helpers.
- `src/styles/`: global stylesheet.
- `src/types/`: shared types.
- `src/utils/`: shared utilities.

## Folder Map

- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth handler.
- `src/app/api/duolingo/route.ts`: Duolingo stats proxy.
- `src/app/api/experience/route.ts`: experience JSON wrapper.
- `src/app/api/games/route.ts`: Epic/static gaming data response.
- `src/app/api/games/steam/route.ts`: Steam Web API proxy.
- `src/app/api/github/route.ts`: GitHub profile/repo/impact endpoint.
- `src/app/api/leetcode/route.ts`: LeetCode stats proxy.
- `src/app/api/mal/route.ts`: MyAnimeList endpoint.
- `src/app/api/now-playing/route.ts`: Spotify now-playing endpoint.
- `src/app/api/projects/route.ts`: portfolio project metadata endpoint.
- `src/app/api/snake/route.ts`: allowlisted HTTPS image/SVG proxy and SVG color modifier.
- `src/app/api/spotify-callback/route.ts`: Spotify OAuth callback helper.
- `src/app/api/wakatime/route.ts`: WakaTime stats endpoint.

## File Inventory

Major root files:

- `package.json`: single root npm manifest.
- `package-lock.json`: single root npm lockfile.
- `next.config.mjs`: Next config, security headers, remote image host allowlist, TypeScript build enforcement.
- `tsconfig.json`: strict TypeScript config using `@/*` paths and Next-managed JSX mode.
- `tailwind.config.js`: Tailwind theme/content config targeting `src`.
- `postcss.config.mjs`: Tailwind 4 PostCSS plugin config.
- `.eslintrc.json`: Next core web vitals lint config.
- `.env.local`: local environment file. Contains live-looking secrets; keep untracked and rotate if exposed.
- `README.md`: current setup and stack overview.
- `CONTRIBUTING.md`, `LICENSE`, `project.json`: contribution, license, and project metadata.

## Package Inventory

Root package: `manishp-portfolio@1.0.0`.

Runtime dependencies:

- `next@^15.5.19`
- `react@18.3.1`
- `react-dom@18.3.1`
- `next-auth@^4.24.14`
- `next-themes@^0.4.6`
- `@vercel/speed-insights@^2.0.0`
- `clsx@^2.1.1`
- `lenis@^1.3.17`
- `lucide-react@^0.454.0`
- `react-icons@^5.5.0`
- `react-markdown@^10.1.0`
- `remark-gfm@^4.0.1`
- `swiper@^12.2.0`
- `swr@^2.3.8`
- `tailwind-merge@^3.3.1`

Development dependencies:

- `@tailwindcss/postcss@^4.3.1`
- `typescript@^5.4.5`
- `@types/node@^20`
- `@types/react@^18`
- `@types/react-dom@^18`
- `eslint@^8.57.0`
- `eslint-config-next@^15.5.19`
- `postcss@8.5.15` with npm override for transitive consumers
- `tailwindcss@^4.3.1`

Removed during 2026-06-17 cleanup:

- `autoprefixer`: unused with the current Tailwind 4 PostCSS config.
- `marked`: unused by source code.
- `@vercel/analytics`: unused after confirming only `@vercel/speed-insights` is imported in the layout.
- Transitive `postcss` and `uuid` advisories are handled through npm `overrides`.

## Environment Variables Inventory

Observed in `.env.local` and/or source code:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `NEXT_PUBLIC_WEATHERAPI_KEY`
- `NEXT_PUBLIC_WEATHERAPI_CITY`
- `MAL_CLIENT_ID`
- `MAL_USERNAME`
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `DISCORD_WEBHOOK_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GITHUB_USERNAME`
- `NEXT_PUBLIC_GITHUB_USERNAME`
- `GITHUB_TOKEN`
- `LEETCODE_USERNAME`
- `WAKATIME_API_KEY`
- `DUOLINGO_USERNAME`
- `STEAM_API_KEY`
- `STEAM_ID`
- `STEAM_ENABLED`
- `NODE_ENV`

Notes:

- `STEAM_API_KEY` and `STEAM_ID` are used by `src/app/api/games/steam/route.ts` but were not present in the scanned `.env.local`.
- `STEAM_ENABLED` exists in `.env.local` but no source usage was found.
- `NEXT_PUBLIC_WEATHERAPI_KEY` is intentionally public by prefix and used client-side in `NavigationIcons`.
- `.env.local` contains live-looking secrets/tokens. Rotate any credential that has been committed, shared, or exposed in logs.

## API Inventory

- `GET/POST /api/auth/[...nextauth]`: NextAuth GitHub and LinkedIn OAuth.
- `GET /api/duolingo?username=`: returns Duolingo stats.
- `GET /api/experience`: returns experience data from shared library.
- `GET /api/games`: returns Epic/static gaming data from `src/data/epic-library.json`.
- `GET /api/games/steam`: returns Steam owned/recent games and stats.
- `GET /api/github?type=profile|repos|impact&username=`: returns GitHub user, repository, or derived impact metrics.
- `GET /api/leetcode?username=`: returns LeetCode stats.
- `GET /api/mal?type=completed|watching|stats`: returns MAL anime data.
- `GET /api/now-playing`: returns Spotify now-playing status.
- `GET /api/projects?type=featured|creations|now|sketches|open-source|all`: returns portfolio project metadata.
- `GET /api/snake?url=`: fetches allowlisted HTTPS image/SVG URLs and rewrites selected SVG background colors.
- `GET /api/spotify-callback`: exchanges Spotify OAuth code for tokens.
- `GET /api/wakatime?type=stats|today`: returns WakaTime activity data.

GitHub API notes:

- GitHub requests trim `GITHUB_TOKEN` before use and omit the `Authorization` header when the token is blank.
- Shared GitHub fetch helpers retry public requests without authorization when GitHub returns `401 Unauthorized`, preventing stale or revoked local tokens from breaking public portfolio pages such as `/workspace/secumilate`.

## Database Architecture

No database client, schema, migrations, ORM, or local database configuration was found.

## Authentication Architecture

- NextAuth.js v4 route handler in `src/app/api/auth/[...nextauth]/route.ts`.
- Providers:
  - GitHub OAuth using `GITHUB_ID` and `GITHUB_SECRET`.
  - Custom LinkedIn OAuth/OIDC using `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`.
- Custom sign-in callback posts connection details to `DISCORD_WEBHOOK_URL` when configured.
- Session callback preserves profile image from JWT token.
- Debug logging is gated to development only.

## Session Architecture

- `src/components/providers/SessionProvider.tsx` wraps `next-auth/react` `SessionProvider`.
- Root layout wraps all pages with session, theme, smooth scroll, nav, and footer providers/components.
- No custom session store was found; NextAuth defaults are in use unless configured externally by environment.

## Upload Architecture

No upload handling, storage adapter, multipart parser, or object storage integration was found.

## AI Integrations

No OpenAI, AI SDK, model provider, vector database, or agent integration was found.

## Automation Integrations

- Discord webhook notification on OAuth sign-in.
- Certificate enrichment script: `npm run enrich:certs`.
- Spotify token helper script: `scripts/get-spotify-token.ts`.
- Runtime data integrations call GitHub, Spotify, MAL, WakaTime, Duolingo, LeetCode, Steam, and WeatherAPI.

## Email Integrations

No email provider, SMTP, Resend, or transactional email integration was found.

## Deployment Architecture

- Next.js application suitable for Vercel or Node hosting.
- `next.config.mjs` configures global security headers and image settings.
- No `vercel.json`, Dockerfile, CI workflow, or explicit deployment config was found.

## Security Architecture

Configured:

- Global CSP, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` in `next.config.mjs`.
- `poweredByHeader: false`.
- CSP restricts image, media, frame, and connection origins.
- TypeScript build errors now fail production builds.
- `/api/snake` now requires HTTPS and an allowlisted image host.

Security findings:

- High: `.env.local` contains live-looking secrets and tokens. Rotate any credentials that may have been committed, shared, or logged.
- Transitive `postcss` and `uuid` advisories are patched through npm `overrides`; `npm audit --audit-level=moderate` now reports zero vulnerabilities.
- Low: An invalid or expired `GITHUB_TOKEN` can still reduce GitHub API rate limits after fallback because public unauthenticated requests use lower limits. Update or remove the local token if GitHub data appears stale or incomplete.
- Medium: CSP still uses `'unsafe-inline'` and `'unsafe-eval'` for scripts. Tighten for production if possible.
- Medium: Multiple public API routes accept query parameters and call third-party services without rate limiting.
- Low: Several API routes return raw error details in JSON responses. Consider sanitized public errors plus server logging.

## Build System

Scripts:

- `npm run dev`: `next dev`
- `npm run build`: `next build`
- `npm run start`: `next start`
- `npm run lint`: `next lint`
- `npm run typecheck`: `tsc --noEmit`
- `npm run type-check`: `tsc --noEmit`
- `npm run enrich:certs`: `tsx scripts/enrich-certificates.ts`

Verification on 2026-06-17:

- `npm install`: completed through bounded package installs/uninstalls and lockfile updates.
- `npm run lint`: passed with no warnings/errors; `next lint` reports deprecation for Next 16.
- `npm run typecheck`: passed after removing stale `tsconfig.tsbuildinfo`.
- `npm run build`: passed; 33 static pages generated.
- `npm run dev`: app responded `200 OK` at `http://localhost:3000/`.
- `npm run test`: unavailable because no `test` script exists.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.

Verification on 2026-06-21:

- `npm run typecheck`: passed.
- `npm run lint`: passed with no warnings/errors; `next lint` reports deprecation for Next 16.
- `npm run build`: passed; 33 static pages generated. Network-restricted external fetches emitted `EACCES` warnings after successful build output.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `npm run dev -- -p 3010`: `/workspace/secumilate` responded `200 OK`.

## Dependency Inventory

The repository currently uses npm only: one root `package.json`, one root `package-lock.json`, and one root `node_modules`. No Yarn, pnpm, Bun, nested app manifests, or duplicate lockfiles were found outside generated/build dependency trees.

## Workspace Relationships

This is a single-package repository, not a multi-workspace monorepo. Shared tooling is centralized at the root.

## Technical Debt

- `next lint` is deprecated and should eventually migrate to ESLint CLI before Next 16.
- `src/features/github/GitHubContributions.tsx` hardcodes the GitHub username instead of using shared config/env.
- API handlers rely heavily on `any` for external payloads.
- No automated test suite was found.
- No CI/CD workflow was found.
- `STEAM_ENABLED` exists in env but is not used in source.

## Known Issues

- Missing `STEAM_API_KEY` and `STEAM_ID` despite the Steam API route requiring them.
- `.env.local` contains live-looking secrets.
- Local `GITHUB_TOKEN` may be invalid or expired; public GitHub requests now fall back without auth on `401 Unauthorized`, but token rotation is still recommended.
- Public API routes do not have explicit rate limiting.

## Open Tasks

- Rotate exposed local secrets if they were ever shared outside the machine.
- Add a test script and focused tests for API route normalization/security boundaries.
- Migrate linting from `next lint` to ESLint CLI before Next 16.
- Decide whether to keep or remove `STEAM_ENABLED`.
- Add basic CI with typecheck, lint, build, and audit.
- Consider typed external API response schemas to reduce `any`.
- Consider production CSP hardening and API rate limiting.

## Changelog

- 2026-06-21: Improved phone-width layouts for project cards, GitHub contribution graph, Studio metrics, anime character cards, and the 3D Pokedex without changing desktop breakpoints; later tightened the Pokedex intermediate and narrow-phone scale/position rules so the opened right panel stays inside screenshot-width viewports.
- 2026-06-21: Refined 3D Pokedex button interactions so pressed blue/white/black controls stay anchored instead of translating into the device, with pointer release/cancel handling for steadier clicks.
- 2026-06-21: Reworked narrow 3D Pokedex open-state framing so the restored right panel angle fits centered in 390px-class viewports without cropping.
- 2026-06-21: Preserved the anime 3D Pokedex close/reopen controls; the folded mobile pose now uses a centered upright transform instead of the broken flat slab angle.
- 2026-06-22: Restored Pokedex close behavior with a polished closed mobile pose and suppressed extension-injected body hydration warnings.
- 2026-06-22: Rebuilt `/edu/schooling` as a static server-rendered academic ledger page and added navbar route warming/prefetching to reduce perceived page-transition delay.
- 2026-06-23: Added a shared static hub-page system and rebuilt `/hobbies`, `/edu`, `/ink`, `/workspace`, `/studio`, and `/myself` as uniform dashboard fronts; then restrained the styling back to the site's zinc/emerald theme and fixed mobile text/card overlap.
- 2026-06-21: Added an explicit mobile viewport export and root/body horizontal clipping to prevent phone browsers from shrinking the site around wide children.
- 2026-06-21: Added a themed animated mobile hamburger button and marked the root smooth-scroll behavior for Next's scroll warning.
- 2026-06-21: Switched anime YouTube embeds to no-cookie, non-autoplay embeds with iframe titles to reduce app-triggered console noise.
- 2026-06-21: Removed duplicate `.env`, local `.claude/` state, stale generated `tsconfig.tsbuildinfo`, and npm optional extraneous folders from the local tree.
- 2026-06-21: Removed unused components `AnimeCard`, `GenreUniverse`, `ExperienceSkeleton`, `ProjectGridSkeleton`, and `FaceReadme`.
- 2026-06-21: Removed unused `@vercel/analytics`; kept `@vercel/speed-insights` because it is used in `src/app/layout.tsx`.
- 2026-06-21: Added `.claude/` to `.gitignore`.
- 2026-06-21: Verified `npm run typecheck`, `npm run lint`, `npm run build`, `npm audit --audit-level=moderate`, and dev-server `200 OK`.
- 2026-06-21: Added GitHub API fallback for stale or rejected `GITHUB_TOKEN` values so public repo reads retry without authorization after `401 Unauthorized`.
- 2026-06-21: Verified `/workspace/secumilate` on a local dev server after the GitHub fallback; route returned `200 OK`.
- 2026-06-17: Created living repository context from baseline scan.
- 2026-06-17: Corrected README and `project.json` to match current Next 15, React 18, Tailwind 4 stack.
- 2026-06-17: Added `typecheck` script alias while preserving `type-check`.
- 2026-06-17: Updated Next to `^15.5.19`, `eslint-config-next` to `^15.5.19`, Swiper to `^12.2.0`, and NextAuth to `^4.24.14`.
- 2026-06-17: Removed unused `autoprefixer` and `marked`.
- 2026-06-17: Added npm overrides for transitive `postcss@8.5.15` and `uuid@11.1.1`, clearing npm audit.
- 2026-06-17: Removed generated `structure.txt`.
- 2026-06-17: Aligned Tailwind content paths to `src`.
- 2026-06-17: Enforced TypeScript errors during builds.
- 2026-06-17: Gated NextAuth debug logging to development.
- 2026-06-17: Restricted `/api/snake` to HTTPS allowlisted image hosts.

## Recent Modifications

- `src/features/workspace/ProjectCard.tsx`: project Stack face is now the third/last card face.
- `src/features/github/GitHubContributions.tsx`: contribution graph cells now scale within narrow containers and footer content wraps on phones.
- `src/app/studio/metrics/page.tsx`: phone layout now uses a two-column metrics grid with wide panels spanning both columns and tighter responsive text.
- `src/components/layout/Navbar.tsx`: mobile menu toggle now morphs between hamburger and close states with site-themed styling.
- `src/features/anime/Pokedex3D.css`: mobile and intermediate-width Pokedex camera/scale constraints prevent the opened 3D model from overwhelming or clipping inside narrow screens.
- `src/features/anime/Pokedex3D.tsx` and `src/features/anime/Pokedex3D.css`: Pokedex button pressed states are visual-only and use pointer handlers to avoid jumpy 3D transform side effects.
- `src/features/anime/Pokedex3D.css`: narrow open-state transforms keep the full 3D Pokedex centered and prevent the right panel from stretching or clipping.
- `src/features/anime/Pokedex3D.tsx`: Currently Watching Pokedex starts closed, opens on click, can close, and reopens by clicking the closed model.
- `src/app/layout.tsx`: body also uses `suppressHydrationWarning` to avoid dev overlay noise from browser extensions injecting body attributes.
- `src/app/edu/schooling/page.tsx`: static server component with the redesigned schooling timeline, no mount-state animation or client hydration.
- `src/components/layout/HubPage.tsx`: shared static dashboard shell for top-level section hubs with restrained zinc/emerald styling, wrap-safe mobile columns, stat deck, route tiles, and footer CTA.
- `src/app/hobbies/page.tsx`, `src/app/edu/page.tsx`, `src/app/ink/page.tsx`, `src/app/workspace/page.tsx`, `src/app/studio/page.tsx`, and `src/app/myself/page.tsx`: rebuilt as visually unified hub pages while preserving their existing child-route destinations.
- `src/components/layout/Navbar.tsx`: warms common routes during idle time and on hover/focus to make navigation feel faster after initial load.
- `src/features/anime/CharacterShowcase.tsx`: phone layout now uses an unrotated grid to prevent polaroid/name overlap.
- `src/features/anime/OPPlaylist.tsx` and `src/features/anime/HallOfFame.tsx`: YouTube embeds now use `youtube-nocookie.com`, omit autoplay, and include titles.
- `src/app/layout.tsx`: added `data-scroll-behavior="smooth"` on `<html>`.
- `src/styles/globals.css`: root and body now clip horizontal overflow so wide children cannot shrink the mobile viewport.
- `README.md`: refreshed stack, scripts, env, and dependency documentation.
- `project.json`: updated stack metadata.
- `package.json` and `package-lock.json`: dependency/security cleanup and script alignment.
- `tailwind.config.js`: content globs now target the actual `src` tree.
- `next.config.mjs`: TypeScript build errors are no longer ignored.
- `tsconfig.json` and `next-env.d.ts`: Next-managed TypeScript updates.
- `src/app/api/auth/[...nextauth]/route.ts`: debug logging is development-only.
- `src/app/api/snake/route.ts`: SSRF/open-proxy hardening.
- `src/app/api/github/route.ts`: trims `GITHUB_TOKEN` and retries rejected public GitHub API calls without authorization.
- `src/lib/github/api.ts`: central GitHub fetch helpers now preserve Accept headers while retrying `401 Unauthorized` public requests without auth.
- `src/features/anime/AnimeCard.tsx`: removed unused component.
- `src/features/anime/GenreUniverse.tsx`: removed unused component.
- `src/features/experience/ExperienceSkeleton.tsx`: removed unused component and empty folder.
- `src/features/workspace/ProjectGridSkeleton.tsx`: removed unused component.
- `src/features/workspace/card/faces/FaceReadme.tsx`: removed unused component.
- `.gitignore`: added `.claude/` local tool-state ignore.
