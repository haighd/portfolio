# Professional Presence Master PRD

**Document ID:** PRD-MASTER
**Created:** 2025-01-29
**Author:** Dan Haight
**Status:** Active

---

## 1. Problem Statement

Dan Haight's current professional presence is disjointed—resume, LinkedIn, and online portfolio exist as separate, inconsistent artifacts rather than a cohesive professional narrative. This fragmentation undermines his positioning for Analytics Leadership roles by:

- Failing to communicate a unified personal brand
- Missing opportunities to showcase technical depth alongside strategic impact
- Lacking an owned platform that demonstrates hands-on technical capability
- Presenting outdated information (missing recent Merck role)

---

## 2. Target Audience

### Primary: Recruiters & Hiring Managers
- Evaluating candidates for Director/VP Analytics roles
- Looking for evidence of both leadership and technical credibility
- Spending 6-10 seconds on initial resume scan
- Using ATS systems that filter on keywords and formatting

### Secondary: Professional Network
- Peers who may refer opportunities
- Industry connections evaluating expertise
- Potential collaborators or clients

---

## 3. Solution Overview

Create a unified professional presence across three interconnected deliverables:

| Component | Purpose | Key Outcome |
|-----------|---------|-------------|
| **Resume** | ATS-optimized document targeting Analytics Leadership | Pass screening, secure interviews |
| **Portfolio Site** | Technical showcase demonstrating hands-on capability | Differentiate from non-technical leaders |
| **LinkedIn Profile** | Network visibility and professional branding | Inbound opportunities, social proof |

All three components will share:
- Consistent narrative and positioning
- Aligned messaging around Analytics Leadership
- Complementary content (resume summarizes, portfolio expands, LinkedIn connects)

---

## 4. Component PRDs

| ID | Component | Scope | Status |
|----|-----------|-------|--------|
| PRD-001 | Resume Optimization | ATS compatibility, role targeting, Merck role addition | Planned |
| PRD-002 | Portfolio Site | Next.js site at danalytics.info | Planned |
| PRD-003 | LinkedIn Profile | Headline, About, Experience, Featured sections | Planned |

### PRD-001: Resume Optimization

**Objective:** Transform existing resume into ATS-optimized document targeting Analytics Leadership roles.

**Scope:**
- Add Merck Associate Director role (current)
- Optimize keywords for Analytics/Data Science leadership positions
- Ensure ATS-compatible formatting
- Quantify achievements with metrics
- Tailor summary for Director/VP positioning

**Success Criteria:**
- 85%+ ATS compatibility score (tested via JobScan or similar)
- Clear progression narrative from IC to Leadership
- All roles include quantified impact statements

---

### PRD-002: Portfolio Site

**Objective:** Build a modern, performant portfolio site that showcases technical depth and leadership experience.

**Technical Architecture:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4
- **Deployment:** Railway (auto-deploy on merge to main)
- **Domain:** danalytics.info
- **Repository:** github.com/haighd/portfolio (public)

**Site Structure:**
```
/                   # Hero + intro
/about              # Background, journey, values
/experience         # Timeline of roles
/projects           # Featured work showcase
/projects/[slug]    # Individual project pages
/blog               # Writing section
/contact            # Contact form/links
```

**Featured Projects:**
1. **Trader** - Autonomous algorithmic trading system (Python, ML)
2. **Golden Paws Photography** - Full-stack business application (Astro)
3. **NFL Fantasy Playoffs** - Real-time leaderboard application (Next.js)
4. **R Projects** - Data analytics and visualization work (evaluate for inclusion)

**Technical Requirements:**
- 90+ Lighthouse performance score
- <2s page load time
- Mobile-responsive design
- SEO optimized
- Accessible (WCAG 2.1 AA)

---

### PRD-003: LinkedIn Profile

**Objective:** Optimize LinkedIn profile for visibility and inbound opportunities.

**Scope:**
- **Headline:** Compelling positioning statement
- **About:** Narrative connecting technical depth to leadership impact
- **Experience:** Aligned with resume, expanded for context
- **Featured:** Links to portfolio, key projects, publications
- **Skills:** Curated for Analytics Leadership targeting

**Success Criteria:**
- Profile strength: "All-Star"
- Social Selling Index (SSI): 70+
- Consistent branding with resume and portfolio

---

## 5. Technical Architecture

### Stack Decision Rationale

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Framework | Next.js 14+ | App Router, RSC, excellent DX, industry standard |
| Styling | Tailwind CSS v4 | Rapid iteration, design system flexibility |
| Runtime | Bun | Faster installs, modern tooling |
| Deployment | Railway | Simple setup, auto-deploy, good free tier |
| Domain | danalytics.info | Professional, memorable, available |

### Repository Structure
```
portfolio/
├── docs/
│   ├── prd/                    # PRD documents
│   └── resume/                 # Resume files
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   └── lib/                    # Utilities and helpers
├── public/                     # Static assets
├── CLAUDE.md                   # Project configuration
├── package.json
└── tailwind.config.ts
```

---

## 6. Success Metrics

### Resume (PRD-001)
| Metric | Target | Measurement |
|--------|--------|-------------|
| ATS Compatibility | 85%+ | JobScan score |
| Keyword Alignment | Match job postings | Manual review |
| Interview Rate | Increase from baseline | Track applications |

### Portfolio Site (PRD-002)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | 90+ | Lighthouse audit |
| Page Load Time | <2s | WebPageTest |
| Mobile Usability | 100 | Lighthouse audit |
| Accessibility | WCAG 2.1 AA | axe DevTools |

### LinkedIn (PRD-003)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Profile Strength | All-Star | LinkedIn dashboard |
| SSI Score | 70+ | LinkedIn SSI tool |
| Profile Views | 2x baseline | LinkedIn analytics |

---

## 7. Timeline & Phases

### Phase 1: Foundation (Current)
- [x] Create master PRD
- [x] Set up project structure
- [ ] Initialize GitHub repository

### Phase 2: Portfolio Site
- [ ] Scaffold Next.js application
- [ ] Implement core pages
- [ ] Add project showcases
- [ ] Deploy to Railway
- [ ] Connect custom domain

### Phase 3: Resume Optimization
- [ ] Analyze current resume
- [ ] Add Merck role
- [ ] Optimize for ATS
- [ ] Test compatibility

### Phase 4: LinkedIn Optimization
- [ ] Update headline and about
- [ ] Align experience sections
- [ ] Add featured content
- [ ] Optimize skills

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep on portfolio features | Delays launch | MVP first, iterate |
| ATS optimization breaks formatting | Resume rejected | Test across multiple ATS |
| Domain/hosting issues | Site unavailable | Railway has good uptime, DNS backup plan |

---

## 9. References

- Source resume: `docs/resume/daniel-j-haight-resume-20240805.docx`
- Portfolio repository: github.com/haighd/portfolio
- Domain: danalytics.info

---

## 10. Appendix: Brand Guidelines

### Voice & Tone
- Professional but approachable
- Technical credibility without jargon overload
- Leadership mindset with hands-on capability
- Results-oriented with quantified impact

### Key Messaging Pillars
1. **Analytics Leadership** - Strategic vision translated to measurable outcomes
2. **Technical Depth** - Hands-on capability in Python, SQL, ML/AI
3. **Cross-functional Impact** - Bridging technical and business stakeholders
4. **Continuous Learning** - Staying current with modern tools and practices
