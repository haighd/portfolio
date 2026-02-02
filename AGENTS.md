# Portfolio Site - Agent Instructions

Personal portfolio site built with Next.js 16, React 19, and Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime**: Bun (use `bun` instead of npm/yarn)
- **Styling**: Tailwind CSS v4
- **Content**: Velite (MDX collections) + PostgreSQL (Drizzle ORM)
- **Search**: Pagefind (static search indexing)
- **Components**: Radix UI primitives, Lucide icons

## Commands

```bash
bun run dev        # Start dev server (Velite + Next.js Turbopack)
bun run build      # Build: Velite → Next.js → Pagefind
bun run typecheck  # TypeScript validation
bun run lint       # ESLint
bun run format     # Prettier
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components (layout/, ui/, search/)
├── content/       # MDX content collections (blog, projects, etc.)
├── data/          # Static data modules (skills)
├── db/            # Drizzle schema and migrations
├── hooks/         # Custom React hooks
└── lib/           # Utilities and content abstraction layer
    ├── content.ts    # Content router (Velite/DB abstraction)
    ├── db-content.ts # Database content accessors
    └── utils/        # Shared utilities
```

## Content System

Hybrid content system with fallback chain:
1. **Database** (PostgreSQL via Drizzle) - dynamic content
2. **Velite MDX** - static content collections
3. **Hardcoded fallbacks** - sensible defaults

Content types: `blog`, `projects`, `experience`, `skills`, `about`, `now`, `uses`

Access via `src/lib/content.ts` abstraction layer.

## Deployment

- **Platform**: Railway (auto-deployed)
- **Trigger**: PR merges to `main` branch
- **Database**: Railway-hosted PostgreSQL

No manual deployment steps required - merging a PR triggers automatic deployment.

## Key Conventions

- **No AI attribution** in code, commits, or files
- **Pagefind meta**: Use `data-pagefind-meta="type:blog|project|page"` on content articles
- **Components**: Prefer composition with Radix primitives
- **Styling**: Tailwind classes, use `cn()` utility for conditional classes
- **Database**: Run `bun run db:push` after schema changes

## Verification

After changes:
1. `bun run typecheck` - no TS errors
2. `bun run lint` - no lint errors
3. `bun run build` - successful build with Pagefind indexing
4. Manual test in browser if UI changes
