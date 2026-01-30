# Portfolio Project - Session Memory

**Last Updated**: 2026-01-29 23:15
**Project**: Dan Haight Portfolio Site
**Repository**: https://github.com/haighd/portfolio

---

## Current Status

**Phase**: Content Complete
**Active Branch**: `main`
**Current Focus**: LinkedIn MCP server operational - ready for profile updates

### Completed
- [x] Phase 1: Project Scaffold (Next.js 16, Tailwind v4, TypeScript, Bun)
- [x] Phase 2: Design System (CSS variables, UI components, layout components)
- [x] Phase 3: Content Layer (Velite, MDX schemas, project content)
- [x] Phase 4: Core Pages (PR #2 merged)
- [x] Phase 5: Polish Pages (PR #3 merged)
- [x] Phase 6: Deployment (Railway + Cloudflare)
- [x] Phase 7: Content Updates (PRs #4, #5, #6 merged)

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
| Deployment | Railway (auto-deploy from main) |
| CDN/DNS | Cloudflare |
| Domain | danalytics.info |
| Email | FastMail (dan@danalytics.info) |

---

## Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI Pipeline (typecheck, lint, build) |
| `velite.config.ts` | Content collection schemas |
| `src/lib/content.ts` | Content query helpers |
| `src/content/experience/*.mdx` | Experience timeline content (5 roles) |
| `docs/resume/daniel-j-haight-resume-2025.md` | Updated resume (markdown) |
| `CLAUDE.md` | Project config with LinkedIn URL |

---

## Change Log

**2026-01-29 22:40** - Merged PR #6: Updated 2025 resume
- Added `docs/resume/daniel-j-haight-resume-2025.md`
- Director role with 2025 accomplishments
- ASQ Six Sigma cert corrected (exp. Jun 2028)
- Added ACRP-CP and Merck Sigma Green Belt certs
- FY20 savings phrasing fixed per Copilot review

**2026-01-29 22:15** - Merged PR #5: Director promotion and 2025 accomplishments
- Added `merck.mdx` (Director, Data Science - Nov 2024)
- Added `merck-assoc-director.mdx` (May 2023 - Nov 2024)
- Updated order numbers for all experience files
- Experience timeline now shows 5 roles

**2026-01-29 21:30** - Merged PR #4: Experience content and LinkedIn URL fix
- Updated all experience MDX files with real content
- Fixed LinkedIn URL: `danhaight` → `djhaight` in footer, blog, contact
- Deleted placeholder `previous-role.mdx`

**2026-01-29 23:15** - LinkedIn MCP server fully operational
- Updated `~/.claude/mcp-configs/unified.json` with LinkedIn entry
- Verified server discovery: `discover_servers(query: "linkedin")` ✓
- Verified tool loading: `get_server_tools("linkedin")` ✓ (6 tools available)
- Tested `get_person_profile("djhaight")` - successfully retrieved profile data
- Available tools: get_person_profile, get_company_profile, get_company_posts, get_job_details, search_jobs, close_session

**2026-01-29 21:45** - Added LinkedIn MCP server to proxy
- Session created at `~/.linkedin-mcp/session.json`
- Server config added to `~/.claude/mcp-configs/servers.json`
- Registry entry added to `~/.claude/mcp-configs/registry.json`

**2026-01-29 21:20** - Added LinkedIn URL to CLAUDE.md
- `linkedin.com/in/djhaight` added to Project Overview

**2026-01-29 19:10** - Phase 6 Deployment complete
- Railway project created and deployed
- Custom domain: danalytics.info
- Cloudflare DNS configured (CNAME, MX, SPF, DKIM, DMARC)
- FastMail email setup for dan@danalytics.info

---

## Key Decisions

1. **Content Layer**: Velite over Contentlayer (actively maintained, type-safe)
2. **Styling**: Tailwind CSS v4 with CSS variables (native CSS, faster builds)
3. **Components**: shadcn/ui style with CVA + Radix (matches existing patterns)
4. **Font**: Inter Variable via @fontsource (self-hosted, no FOUT)
5. **Email**: FastMail for dan@danalytics.info (existing account, add domain)
6. **Branch Protection**: All changes via PRs, CI must pass, Copilot review enabled
7. **Deployment**: Railway with Cloudflare proxy for caching/DDoS protection
8. **LinkedIn MCP**: Using stickerdaniel/linkedin-mcp-server for profile data access

---

## Active Issues

- None - portfolio content complete

---

## Next Steps

1. **LinkedIn Profile Updates** (manual)
   - Update headline to Director title (currently not showing latest)
   - Update About section with latest accomplishments
   - Add danalytics.info portfolio to Featured section
   - Review and update job descriptions on work history

2. **Portfolio Enhancements** (optional)
   - Analytics integration (Plausible/Umami)
   - Dark mode toggle
   - Blog with MDX content
   - LinkedIn sync automation (using MCP tools)

---

## Deployment

- **Live URL**: https://danalytics.info
- **Railway URL**: https://portfolio-production-318e9.up.railway.app
- **Railway Project**: https://railway.com/project/4388c04f-046e-49bb-9813-ac3d1067d008
- **Auto-deploy**: Enabled from `main` branch
- **Email**: dan@danalytics.info (FastMail)

---

## Experience Timeline

| Order | Company | Role | Dates |
|-------|---------|------|-------|
| 1 | Merck & Co. | Director, Data Science | Nov 2024 - Present |
| 2 | Merck & Co. | Associate Director, Data Science | May 2023 - Nov 2024 |
| 3 | BD | Associate Director, Supply Chain Analytics | Nov 2020 - May 2023 |
| 4 | BD | Senior Manager, Transportation CI | Nov 2019 - Nov 2020 |
| 5 | UnitedHealth Group | Assoc. Director, Business Transformation | Jul 2018 - Nov 2019 |

---

## Commands

```bash
bun dev        # Start dev server (runs velite first)
bun build      # Production build
bun typecheck  # TypeScript check
bun lint       # ESLint
bun format     # Prettier
```
