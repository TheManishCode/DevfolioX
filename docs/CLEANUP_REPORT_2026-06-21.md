# Deep Cleanup Report - 2026-06-21

## Scope

Performed a safe deep-clean pass focused on reducing visible project clutter, removing dead source files, validating package/lock consistency, and preserving app behavior.

## Files And Folders Removed

- `.env`: duplicate local secret file. `.env.local` remains ignored for local runtime use, and `.env.example` remains as the safe template.
- `.claude/`: local tool state, now ignored via `.gitignore`.
- `tsconfig.tsbuildinfo`: generated TypeScript cache, already ignored by `*.tsbuildinfo`.
- `src/features/anime/AnimeCard.tsx`: no imports or references found.
- `src/features/anime/GenreUniverse.tsx`: no imports or references found.
- `src/features/experience/ExperienceSkeleton.tsx`: no imports or references found.
- `src/features/experience/`: empty folder after removing the unused skeleton.
- `src/features/workspace/ProjectGridSkeleton.tsx`: no imports or references found.
- `src/features/workspace/card/faces/FaceReadme.tsx`: no imports or references found.
- Local extraneous npm optional folders under `node_modules`: `@emnapi/*`, `@napi-rs/wasm-runtime`, and `@tybys/wasm-util`.

## Dependencies Removed

- `@vercel/analytics`: declared in `package.json` but not imported. `@vercel/speed-insights` remains because `SpeedInsights` is used in `src/app/layout.tsx`.

## Dependency And Lockfile Audit

- Package manager remains npm.
- Only root `package.json` and `package-lock.json` exist.
- No Yarn, pnpm, or Bun lockfiles were found.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `npm ls --depth=0`: clean after removing leftover optional extraneous folders.

## Runtime Fix Applied

- `src/lib/github/api.ts`: trims `GITHUB_TOKEN`, omits blank authorization headers, and retries public GitHub requests without auth when GitHub returns `401 Unauthorized`.
- `src/app/api/github/route.ts`: applies the same invalid-token fallback for the public `/api/github` route.
- Impact: `/workspace/secumilate` and related public GitHub-backed portfolio pages no longer fail just because a local token is expired, revoked, or pasted with whitespace.
- Remaining action: rotate or remove the rejected local `GITHUB_TOKEN` in `.env.local` to restore authenticated GitHub rate limits.

## Reference Checks

Confirmed no remaining references to:

- `AnimeCard`
- `GenreUniverse`
- `ExperienceSkeleton`
- `ProjectGridSkeleton`
- `FaceReadme`
- `@vercel/analytics`

## Verification Results

- `npm run typecheck`: passed.
- `npm run lint`: passed with no warnings/errors. `next lint` still reports deprecation for future Next versions.
- `npm run build`: passed and generated 33 static pages. Network-restricted external fetches emitted `EACCES` warnings after build output, but the build completed successfully.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `npm run dev`: started successfully and returned `200 OK` from `http://localhost:3000/`.
- `npm run dev -- -p 3010`: started successfully and returned `200 OK` from `http://localhost:3010/workspace/secumilate` after the GitHub token fallback fix.

## Remaining Cleanliness Notes

- `.env.local` remains ignored and contains live-looking local secrets; rotate if exposed.
- `.next/` and `node_modules/` are ignored generated/dependency folders and remain outside the source tree.
- No test script exists yet.
- Public API routes still lack explicit rate limiting.
