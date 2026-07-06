# DevfolioX — Improvement Plan
### Performance, Code Quality, Security, Efficiency, Testing, Accessibility

This plan is built from an actual read-through of the codebase (not assumptions). Every item below names the real file and the real reason. Nothing here touches business logic, API response shapes, or visual design — the goal is to make what's already there faster, safer, and provably correct, not to redesign it.

---

## 0. Guardrails (non-negotiable)

- No change to a component's public props, an API route's request/response shape, or the data model.
- Every change ships behind `npm run lint && npm run typecheck && npm run build` passing, same as your own audit report's verification steps.
- Changes land in small, independently-revertable commits — one concern per commit, so a regression is a one-line `git revert`, not a hunt.
- Anything touching auth, the DB, or the CSP gets a manual smoke test (sign in, post a guestbook entry, delete a test entry) before merge.

---

## 1. Problem Statement Alignment

DevfolioX's job is to be a fast, credible, accessible first impression for recruiters and visitors — a personal dev portfolio. Every fix below is filtered through that lens: does it make the site load faster for a first-time visitor, make the code easier for *you* (or a contributor) to trust and extend, or make the site usable by someone on a screen reader / slow connection? Items that don't serve one of those three are left out on purpose (e.g. no rewrite for rewrite's sake).

---

## 2. Performance / Efficiency

| # | Issue | File(s) | Fix | Risk |
|---|---|---|---|---|
| 2.1 | Homepage awaits two independent data calls sequentially | `src/app/page.tsx` | `Promise.all([fetchPortfolioProjects(), getExperienceData()])` | None — same data, half the wait on a cache miss |
| 2.2 | `next-auth` `SessionProvider` wraps every route, including the homepage, forcing its client bundle + a `/api/auth/session` call on pages that never touch auth | `src/app/layout.tsx` | Scope it to the subtree that needs it (`/guestbook`) via a route group layout (`src/app/(auth)/layout.tsx`) instead of the root layout | Low — purely a wrapper relocation, same session behavior where it's used |
| 2.3 | `next/font/local` preloads all 4 `incognito` weight files as render-blocking `<link rel="preload">` regardless of what's visible above the fold | `src/assets/fonts/font.ts` | Split into per-weight `localFont` calls and set `preload: false` on the 3 weights not used in the hero; keep `preload: true` only on the one the `h1` actually uses | Low — font-display:swap already prevents invisible text either way |
| 2.4 | Below-the-fold client components (`GitHubContributions`, `HackathonsTimeline`, `TechStacks`) ship and hydrate immediately even though they're off-screen on load | `src/app/page.tsx` | Load via `next/dynamic` with a lightweight skeleton fallback; keep `ssr: true` for the ones that render meaningful static content, `false` only for GitHubContributions since it's 100% client-fetched anyway | Medium — verify no layout shift from the fallback (CLS is currently 0, keep it that way) |
| 2.5 | `swiper` is a listed dependency with zero imports anywhere in `src` | `package.json` | Remove it | None — dead weight, confirmed unused via `grep -rl swiper src` |
| 2.6 | Raw `<img>` used broadly instead of `next/image` (`@next/next/no-img-element` is explicitly disabled in `.eslintrc.json`) | ~15 files across `src/features/*`, `src/app/*` | Migrate the ones serving raster photos from your own `public/` (gallery, certificates) to `next/image` for automatic resizing/lazy-loading; leave hotlinked third-party CDN images and inline SVG icons as `<img>`/`<svg>` since those don't benefit and some CDNs may not tolerate the optimizer | Medium — needs `remotePatterns` review per image, do this file-by-file, not in bulk |

**Suggested order:** 2.1 → 2.5 → 2.3 → 2.2 → 2.4 → 2.6 (cheapest, safest first).

---

## 3. Code Quality

- **Remove now-dead config drift**: your own `AUDIT_REPORT_2026-06-17.md` already caught and fixed most of this (stale README, Tailwind globs, `ignoreBuildErrors`). Nothing new found here beyond the `swiper` dependency in 2.5.
- **`next lint` is deprecated pre-Next 16** (already flagged in your audit's "Remaining Work"). Migrate to the ESLint CLI now while it's a mechanical change, rather than under time pressure at the Next 16 upgrade.
- **Extract the two sequential `await`s in `page.tsx` into a single typed loader function** (e.g. `getHomePageData()` returning `{ projects, experiences }`) so the parallelization in 2.1 is enforced by the function's shape, not just convention — harder to accidentally re-introduce a sequential await later.
- **No test script exists** (`npm run test` fails — also already noted in your audit). Addressed in section 5.

---

## 4. Security

Your `AUDIT_REPORT_2026-06-17.md` already closed the big ones (SSRF in `/api/snake`, NextAuth debug logging, TS build errors silently ignored). Reviewing what's shipped now:

- `src/app/api/guestbook/route.ts` is in solid shape: auth-gated writes, input length capping, `<`/`>` escaping, and a 24h per-email rate limit. One gap worth closing: the `sanitize()` function escapes `<`/`>` but not `&`, which can let a crafted message re-open an entity sequence (e.g. `&lt;` typed literally becomes ambiguous once escaped again). Recommend escaping `&` first, before `<`/`>`.
- `.env.local` containing live-looking secrets was already flagged in your audit as needing rotation if ever exposed — confirm that's been done; it's easy for this kind of item to get flagged and then forgotten.
- CSP in `next.config.mjs` is already reasonably tight (explicit `img-src`/`connect-src` allowlists, `frame-ancestors 'none'`, HSTS). No changes needed there.
- Once `SessionProvider` is scoped down (2.2), audit routes that call `getToken()` (guestbook `POST`/`DELETE`) still work identically — `getToken` reads the JWT from the request, not from React context, so this is safe, but verify with a manual sign-in test.

---

## 5. Testing

Currently zero automated tests exist (`npm run test` has no script — confirmed, and already flagged in your own audit). Recommended minimum viable suite, in priority order:

1. **Set up Vitest** (fast, works natively with the existing TS/ESM setup, no Babel config needed) + React Testing Library for components.
2. **Pure-logic unit tests first** — highest value per line of test code, zero flakiness:
   - `src/lib/github/filters.ts` (`filterByCategory`)
   - `src/lib/github/stats.ts`
   - `src/lib/experience.ts`
3. **API route tests** — mock `prisma` and `getToken`, assert status codes and shape for `src/app/api/guestbook/route.ts`: unauthenticated POST → 401, over-length message → 400, second post within 24h → 429.
4. **One accessibility smoke test** using `@testing-library/jest-dom` + `axe-core` (`jest-axe` or `vitest-axe`) run against the homepage render, to catch regressions automatically rather than relying on manual review each time.
5. Wire `npm run test` into the `package.json` scripts your audit already recommended adding.

This is intentionally scoped small — a few dozen fast tests that catch the actual failure modes above beat a large suite nobody maintains.

---

## 6. Accessibility

Current state is better than average for a portfolio site: a skip-to-content link exists in `layout.tsx`, most `<img>` tags already carry meaningful `alt` text (23 occurrences checked, decorative icons correctly use `alt=""`), and `eslint-config-next` bundles `jsx-a11y` rules, which are running today via `next/core-web-vitals`.

Remaining gaps found:

- **Carousel dots have `aria-label` but no `aria-pressed`/`aria-current` state** (`src/features/workspace/ProjectCard.tsx`) — a screen reader announces "View card face 2" but never which face is currently active. Add `aria-current={activeFace === i}`.
- **`FaceSlider` (`src/features/workspace/card/FaceSlider.tsx`) has no keyboard path** — the only way to change faces is clicking a dot; there's no arrow-key or focus-based navigation, and the sliding content itself isn't in a `role="tabpanel"`/`role="tablist"` relationship. Since this is decorative-only content (project description/tech/demo), the minimum fix is ensuring the dots are reachable via `Tab` and operable via `Enter`/`Space` (native `<button>` already gives you this for free — just needs the `aria-current` above to make it legible).
- **Verify heading hierarchy** across `page.tsx`: it currently jumps from `h1` (hero) to `h2` ("I like building things") past two `<SectionTitle>` components ("Featured", "Work Experience") whose heading level isn't visible in the file — worth confirming `SectionTitle` renders as `h2`, not a styled `div`, so screen reader users can navigate by heading level correctly.
- **Color contrast**: nothing flagged in code (Tailwind zinc/emerald palette used throughout reads as safely within WCAG AA in both themes), but worth a one-time automated pass with the `jest-axe` test in section 5 rather than manual eyeballing.

None of these require visual/design changes — they're all attribute-level additions.

---

## 7. Sequencing & Verification

Recommended rollout, each step independently shippable:

1. `2.1` Promise.all fix → `npm run build` → done
2. `2.5` remove `swiper` → `npm install` → `npm audit` → done
3. `4` guestbook `&` escaping fix → manual guestbook post test → done
4. `6` accessibility attribute additions → done
5. `2.3` font preload tuning → visually confirm hero renders identically in both themes → done
6. `2.2` SessionProvider scoping → manual sign-in + guestbook post/delete test → done
7. `5` testing setup + initial suite → `npm run test` passes in CI
8. `2.4` dynamic imports for below-fold sections → re-check Speed Insights after a week of traffic
9. `2.6` `next/image` migration, file by file

After each step, run the same verification your own audit used: `npm install`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit --audit-level=moderate`.

---

## 8. Ready-to-use execution prompt

If you want to hand this off to an agent (Claude Code or otherwise) to implement step by step:

> Implement the DevfolioX Improvement Plan (`DEVFOLIOX_IMPROVEMENT_PLAN.md`) one numbered item at a time, in the order listed in Section 7. For each item: make only the described change, run `npm run lint && npm run typecheck && npm run build`, and stop for manual confirmation before moving to the next item if the change touches auth, the database, or `next.config.mjs`. Do not change component props, API response shapes, or visual design. Do not batch multiple items into one commit.

Let me know which items you'd like me to start on now — I'd suggest beginning with 2.1, 2.5, and the guestbook `&` escaping fix, since those are zero-risk and immediately verifiable.
