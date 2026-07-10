# manishp.dev

A personal portfolio and digital garden built with Next.js App Router, React, TypeScript, and Tailwind CSS. It brings together project work, education, experience, writing, hobbies, live coding/activity integrations, and social connection flows.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.1-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## Features

- Responsive personal portfolio and digital garden pages
- Dark/light theme support
- GitHub profile, repository, contribution, and project metadata integrations
- MyAnimeList anime watchlist and stats
- Epic/static gaming library plus optional Steam API route
- WakaTime, LeetCode, Duolingo, and WeatherAPI integrations
- NextAuth-based GitHub and LinkedIn sign-in flow
- Interactive anime and workspace UI sections

## Quick Start

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run type-check
npm run build
npm run lint
```

## Project Structure

```text
src/
  app/         Next.js App Router pages, layouts, and API routes
  assets/      Local fonts
  components/  Shared layout, navigation, provider, decorative, and UI components
  config/      Site and link configuration
  data/        Static JSON/TS content
  features/    Domain-specific UI sections
  lib/         Server helpers and external service clients
  styles/      Global stylesheets
  types/       Shared types
  utils/       Shared utilities
```

See `docs/PROJECT_CONTEXT.md` for the maintained architecture, API, environment, security, and technical debt inventory.

## Environment Variables

Create `.env.local` in the project root. Keep it private and never commit live credentials.

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GITHUB_ID=
GITHUB_SECRET=
GITHUB_USERNAME=
NEXT_PUBLIC_GITHUB_USERNAME=
GITHUB_TOKEN=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
DISCORD_WEBHOOK_URL=

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

MAL_CLIENT_ID=
MAL_USERNAME=

WAKATIME_API_KEY=
LEETCODE_USERNAME=
DUOLINGO_USERNAME=

NEXT_PUBLIC_WEATHERAPI_KEY=
NEXT_PUBLIC_WEATHERAPI_CITY=

STEAM_API_KEY=
STEAM_ID=
```

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 15.4.6 App Router |
| Runtime UI | React 18.3.1 |
| Language | TypeScript |
| Styling | Tailwind CSS 4.3.1 |
| Auth | NextAuth.js 4 |
| Data fetching | Native fetch, SWR |
| Icons | Lucide React, React Icons |
| Markdown | react-markdown, remark-gfm |
| Motion/UX | Lenis, Swiper |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run the configured lint command |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run type-check` | Run TypeScript without emitting files |
| `npm run enrich:certs` | Enrich certificate data |

## Security Notes

- `.env.local` contains secrets and must remain local.
- Review `docs/PROJECT_CONTEXT.md` before changing API, auth, deployment, or environment behavior.
- Public API routes should be checked for validation, allowlists, rate limiting, and sanitized errors before expansion.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
