# Portfolio Project - Session Memory

**Last Updated**: 2026-01-29 18:28
**Project**: Dan Haight Portfolio Site
**Repository**: https://github.com/haighd/portfolio

---

## Current Status

**Phase**: Phase 5 - Polish Pages
**Active Branch**: `feat/phase-5-polish`
**Current Focus**: Phase 5 polish pages (blog placeholder, contact, navigation, a11y, SEO)

### Completed
- [x] Phase 1: Project Scaffold (Next.js 16, Tailwind v4, TypeScript, Bun)
- [x] Phase 2: Design System (CSS variables, UI components, layout components)
- [x] Phase 3: Content Layer (Velite, MDX schemas, project content)
- [x] Phase 4: Core Pages (PR #2 merged)
- [ ] Phase 5: Polish Pages
- [ ] Phase 6: Deployment

---

## Open PRs

| PR | Branch | Status | Description |
|----|--------|--------|-------------|
| - | - | No open PRs | - |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.6 (App Router, React 19) |
| Styling | Tailwind CSS v4 |
| Content | Velite (MDX) |
| Components | shadcn/ui style (CVA + Radix) |
| Runtime | Bun |
| CI | GitHub Actions (CI Pipeline) |
| Deployment | Railway (planned) |
| Domain | danalytics.info (Cloudflare DNS) |

---

## Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI Pipeline (typecheck, lint, build) |
| `velite.config.ts` | Content collection schemas |
| `src/lib/content.ts` | Content query helpers |
| `src/components/project-card.tsx` | Reusable project card component |
| `src/components/mdx-content.tsx` | MDX renderer |
| `src/app/page.tsx` | Homepage with featured projects |
| `src/app/about/page.tsx` | About page with skills |
| `src/app/experience/page.tsx` | Experience timeline |
| `src/app/projects/page.tsx` | Projects index |
| `src/app/projects/[slug]/page.tsx` | Project detail pages |

---

## Change Log

**2026-01-29 18:34** - Merged PR #2: Phase 4 core pages
- Merge commit: `3d9eada`
- Homepage, projects, about, experience pages complete

**2026-01-29 18:26** - Fixed accessibility issue in project-card
- Added `aria-hidden="true"` to decorative icons
- Commit: `0673a23`

**2026-01-29 18:06** - Addressed 13 Copilot review comments on PR #2
- Fixed title duplication (removed "| Dan Haight" suffix, layout template adds it)
- Removed undefined `prose-custom` and `prose-sm` classes
- Changed experience map key from index to `${company}-${role}`
- Added optional chaining for `techStack` arrays
- Commit: `885d6e4`

**2026-01-29 17:59** - Implemented Phase 4 core pages (PR #2)
- Updated homepage to use `getFeaturedProjects()`
- Created `ProjectCard` component
- Implemented `/projects` index and `/projects/[slug]` detail pages
- Implemented `/about` page with skills grid
- Implemented `/experience` page with timeline layout
- Commit: `4375415`

**2026-01-29 16:13** - Added CI workflow and addressed branch protection (PR #1 merged)
- Created `.github/workflows/ci.yml` with Bun 1.3.0, caching
- Fixed ESLint errors in `mdx-content.tsx` (renamed useMDXComponent)
- Fixed empty interface in `prose.tsx`
- PR #1 merged to main

**2026-01-29 11:00** - Added branch protection rules to repo
- Ruleset: "Protect main branch (Starter)"
- Requires PR, CI Pipeline status check, Copilot review
- Linear history required

---

## Key Decisions

1. **Content Layer**: Velite over Contentlayer (actively maintained, type-safe)
2. **Styling**: Tailwind CSS v4 with CSS variables (native CSS, faster builds)
3. **Components**: shadcn/ui style with CVA + Radix (matches existing patterns)
4. **Font**: Inter Variable via @fontsource (self-hosted, no FOUT)
5. **Email**: FastMail for dan@danalytics.info (existing account, add domain)
6. **Branch Protection**: All changes via PRs, CI must pass, Copilot review enabled
7. **Deployment**: Railway with Cloudflare proxy for caching/DDoS protection

---

## Active Issues

- Experience content files need Dan's real role details (using placeholders)

---

## Next Steps

1. **Phase 5: Polish Pages**
   - Blog placeholder page
   - Contact page with mailto link
   - Navigation polish
   - Accessibility audit
   - SEO (robots.txt, sitemap, structured data)

2. **Phase 6: Deployment**
   - Create Railway project and service
   - Configure auto-deploy from main
   - Add custom domain in Railway
   - Configure Cloudflare DNS (CNAME → Railway)
   - Set Cloudflare SSL mode (Full Strict)
   - FastMail email setup (MX, SPF, DKIM records)

---

## Deployment Access

- **Railway CLI**: Logged in as Dan Haight (djhaight@gmail.com)
- **Railway MCP**: Available (create-project, deploy, generate-domain, etc.)
- **Cloudflare**: DNS manual via dashboard (no MCP)

---

## Commands

```bash
bun dev        # Start dev server (runs velite first)
bun build      # Production build
bun typecheck  # TypeScript check
bun lint       # ESLint
bun format     # Prettier
```
