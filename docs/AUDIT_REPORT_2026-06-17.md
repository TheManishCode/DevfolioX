# Repository Audit Report - 2026-06-17

## Scope

Performed a repository-wide audit and safe cleanup focused on structure, dependencies, framework compatibility, security, build stability, and documentation accuracy. Business logic, UI behavior, API shapes, and data model were preserved.

## Issues Found

- README and `project.json` stack metadata were stale relative to the working tree.
- Tailwind content globs did not point at the actual `src` source tree.
- `next.config.mjs` ignored TypeScript build errors.
- NextAuth debug logging was always enabled.
- `/api/snake` accepted arbitrary URLs and behaved as an SSRF/open proxy.
- `structure.txt` was a generated full tree dump and not source code.
- `marked` was listed as a dependency but not imported.
- `autoprefixer` was listed but not used by the Tailwind 4 PostCSS setup.
- `tsconfig.tsbuildinfo` had stale references to generated `.next/types`.
- `next lint` works but is deprecated before Next 16.
- No automated test script exists.
- `.env.local` contains live-looking secrets.

## Dependency Findings

- Package manager: npm is the correct and only package manager found.
- Lockfiles: only `package-lock.json` exists.
- Duplicate lockfiles: none found.
- Nested package manifests outside generated/dependency trees: none found.
- Deprecated tooling: `next lint` is deprecated.
- Unused dependencies removed: `marked`, `autoprefixer`.
- `depcheck` false positives: `@tailwindcss/postcss`, `postcss`, `tailwindcss`, and React type packages are config/tooling driven and should remain.

## Security Findings

- Critical advisories for the previous `next` and `swiper` versions were addressed by bounded same-major updates.
- Remaining audit advisories were cleared with npm `overrides` for transitive `postcss@8.5.15` and `uuid@11.1.1`.
- `/api/snake` was hardened to HTTPS and allowlisted hosts.
- NextAuth debug output was restricted to development.
- TypeScript build errors now fail production builds.
- `.env.local` should be treated as sensitive and rotated if exposed.

## Changes Made

- Updated `README.md` to match Next 15, React 18, Tailwind 4, current scripts, and current dependencies.
- Updated `project.json` stack metadata.
- Updated `package.json` scripts with `typecheck` alias.
- Updated `next`, `eslint-config-next`, `swiper`, and `next-auth`.
- Added npm `overrides` for patched transitive `postcss` and `uuid`.
- Removed unused `marked` and `autoprefixer`.
- Updated Tailwind content globs to scan `src/app`, `src/components`, `src/features`, `src/lib`, `src/config`, and `src/styles`.
- Changed `typescript.ignoreBuildErrors` to `false`.
- Gated NextAuth debug logging to development.
- Restricted `/api/snake` URL fetching to trusted HTTPS hosts.
- Removed stale/generated files.
- Added `docs/PROJECT_CONTEXT.md`.
- Added this audit report.

## Files Removed

- `structure.txt`
- `tsconfig.tsbuildinfo`

## Dependencies Removed

- `autoprefixer`
- `marked`

## Dependencies Updated

- `next`: `15.4.6` to `^15.5.19`
- `eslint-config-next`: `15.4.6` to `^15.5.19`
- `swiper`: `^12.0.3` to `^12.2.0`
- `next-auth`: `^4.24.13` to `^4.24.14`
- `postcss`: pinned/overridden to `8.5.15`
- `uuid`: transitive override to `11.1.1`

## Final Repository Structure

```text
.
  docs/
    AUDIT_REPORT_2026-06-17.md
    PROJECT_CONTEXT.md
  public/
  scripts/
    enrich-certificates.ts
    get-spotify-token.ts
  src/
    app/
    assets/
    components/
    config/
    data/
    features/
    lib/
    styles/
    types/
    utils/
  .eslintrc.json
  .gitignore
  CONTRIBUTING.md
  LICENSE
  README.md
  next-env.d.ts
  next.config.mjs
  package-lock.json
  package.json
  postcss.config.mjs
  project.json
  tailwind.config.js
  tsconfig.json
```

Generated/ignored folders such as `.next` and `node_modules` are intentionally excluded from this tree.

## Verification Results

- `npm install`: completed through package install/uninstall operations and lockfile updates.
- `npm run lint`: passed with no ESLint warnings or errors. Note: `next lint` is deprecated.
- `npm run typecheck`: passed when run sequentially. Parallel execution with `next build` can race on generated `.next/types`.
- `npm run build`: passed, compiled successfully, generated 33 static pages.
- `npm run dev`: started and returned `200 OK` from `http://localhost:3000/`.
- `npm run test`: failed because no `test` script exists.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.

## Remaining Work

- Add a real test runner and `test` script.
- Migrate from `next lint` to ESLint CLI before Next 16.
- Add CI for install, lint, typecheck, build, audit, and tests. Run typecheck and build sequentially because both touch generated Next/TypeScript artifacts.
- Rotate local secrets if `.env.local` was ever exposed.
- Add rate limiting and more sanitized error responses to public API routes.
- Decide whether `STEAM_ENABLED` should be wired into code or removed from env docs.
