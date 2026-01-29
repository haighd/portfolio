# Portfolio Project - Claude Code Configuration

## Project Overview

Dan Haight's professional portfolio site showcasing Analytics Leadership experience and technical projects.

**Domain:** danalytics.info
**Repository:** github.com/haighd/portfolio

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS v4 |
| Runtime | Bun |
| Deployment | Railway |
| Language | TypeScript |

---

## Commands

```bash
# Development
bun install          # Install dependencies
bun dev              # Start dev server
bun build            # Production build
bun start            # Start production server

# Quality
bun lint             # Run ESLint
bun format           # Run Prettier
```

---

## Project Structure

```
portfolio/
├── docs/
│   ├── prd/                    # PRD documents
│   └── resume/                 # Resume files
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home (/)
│   │   ├── about/              # About page
│   │   ├── experience/         # Experience timeline
│   │   ├── projects/           # Project showcase
│   │   ├── blog/               # Blog section
│   │   └── contact/            # Contact page
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   └── layout/             # Layout components
│   └── lib/                    # Utilities and helpers
├── public/                     # Static assets
├── CLAUDE.md                   # This file
└── package.json
```

---

## Conventions

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Server Components by default, 'use client' when needed
- Tailwind for styling (no CSS modules)

### Naming
- Components: PascalCase (`ProjectCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Routes: kebab-case (`/projects/[slug]`)

### Git
- Branch from main for features
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- PR workflow per global CLAUDE.md

---

## Key Files

| File | Purpose |
|------|---------|
| `docs/prd/2025-01-29-professional-presence-master.md` | Master PRD |
| `docs/resume/daniel-j-haight-resume-20240805.docx` | Source resume |

---

## Deployment

Railway auto-deploys on merge to main:
- Preview deployments for PRs
- Production at danalytics.info

---

## Performance Targets

- Lighthouse Performance: 90+
- Page Load: <2s
- Core Web Vitals: All green
