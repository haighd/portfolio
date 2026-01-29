# Implementation Plan: Portfolio Site

**Created:** 2025-01-29
**Related PRD:** `docs/prd/2025-01-29-professional-presence-master.md`
**Status:** Ready for Implementation

---

## Overview

Build a modern, performant portfolio site for Dan Haight at danalytics.info using Next.js 15, Tailwind CSS v4, and Velite for content management. The site showcases Analytics Leadership positioning with 4-5 featured technical projects.

---

## Current State Analysis

- **Repository:** github.com/haighd/portfolio (initialized, empty except docs)
- **Domain:** danalytics.info (needs to be configured)
- **Content:** Project information exists in separate repos with READMEs
- **Existing patterns:** Dan has established Next.js/Tailwind patterns from NFL Fantasy Playoffs project (shadcn/ui style, `cn()` utility, Drizzle, TanStack Query)

---

## Desired End State

A deployed portfolio site with:
- 7 routes: `/`, `/about`, `/experience`, `/projects`, `/projects/[slug]`, `/blog`, `/contact`
- MDX-based content layer for projects and experience
- 90+ Lighthouse performance score
- Mobile-responsive, WCAG 2.1 AA accessible
- Custom email dan@danalytics.info via FastMail
- Auto-deploy on merge to main via Railway

---

## What We're NOT Doing

- Blog functionality (placeholder page only)
- Contact form with email service (mailto link only)
- Analytics/tracking integration
- CMS admin interface
- Dark mode toggle
- Authentication
- Database

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Latest stable, RSC by default, excellent performance |
| Styling | Tailwind CSS v4 | Native CSS, faster builds, CSS variables first |
| Content | Velite | Type-safe, MDX support, actively maintained |
| Components | shadcn/ui style | Matches Dan's existing patterns, accessible |
| Icons | Lucide React | Consistent with other projects |
| Deployment | Railway | Simple, auto-deploy, good free tier |
| Email | FastMail | Already has account, add second domain |

---

## Implementation Phases

### Phase 1: Project Scaffold

**Objective:** Initialize Next.js project with all tooling configured.

**Tasks:**

1.1. Initialize Next.js 15 with App Router
```bash
cd /Users/danhaight/Documents/Projects/portfolio
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-bun
```

1.2. Configure TypeScript strict mode in `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

1.3. Update `package.json` scripts for bun
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  }
}
```

1.4. Add Prettier config (`.prettierrc`)
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

1.5. Create base directory structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── about/
│   ├── experience/
│   ├── projects/
│   ├── blog/
│   └── contact/
├── components/
│   ├── ui/
│   └── layout/
├── lib/
│   └── utils/
├── content/
│   ├── projects/
│   └── experience/
└── types/
```

**Success Criteria:**
- [ ] `bun dev` starts without errors
- [ ] `bun build` completes successfully
- [ ] TypeScript strict mode enabled
- [ ] ESLint passes with no errors

---

### Phase 2: Design System

**Objective:** Establish visual foundation with CSS variables, typography, and base components.

**Tasks:**

2.1. Configure Tailwind CSS v4 with design tokens in `src/app/globals.css`
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Inter", system-ui, sans-serif;

  /* Colors - minimal, professional palette */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-muted: #737373;
  --color-muted-foreground: #a3a3a3;
  --color-border: #e5e5e5;
  --color-accent: #2563eb;
  --color-accent-foreground: #ffffff;

  /* Spacing */
  --spacing-section: 6rem;
  --spacing-container: 1.5rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

2.2. Install and configure Inter font via `@fontsource`
```bash
bun add @fontsource-variable/inter
```

2.3. Create `cn()` utility at `src/lib/utils/cn.ts`
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

2.4. Install component dependencies
```bash
bun add clsx tailwind-merge class-variance-authority
bun add @radix-ui/react-slot
bun add lucide-react
```

2.5. Create base UI components in `src/components/ui/`:
- `button.tsx` - Primary, secondary, ghost variants
- `card.tsx` - Project cards, experience cards
- `badge.tsx` - Tech stack badges
- `container.tsx` - Max-width wrapper
- `prose.tsx` - MDX content wrapper

2.6. Create layout components in `src/components/layout/`:
- `header.tsx` - Navigation with logo
- `footer.tsx` - Links, copyright
- `section.tsx` - Page section wrapper

**Success Criteria:**
- [ ] Design tokens render correctly in browser
- [ ] Inter font loads without FOUT
- [ ] All UI components render without errors
- [ ] Components use `cn()` for class merging

---

### Phase 3: Content Layer

**Objective:** Set up Velite with schemas for projects and experience data.

**Tasks:**

3.1. Install Velite
```bash
bun add velite -D
```

3.2. Create `velite.config.ts` at project root
```typescript
import { defineConfig, defineCollection, s } from "velite";

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string(),
    slug: s.slug("projects"),
    featured: s.boolean().default(false),
    order: s.number().default(0),
    techStack: s.array(s.string()),
    github: s.string().optional(),
    liveUrl: s.string().optional(),
    image: s.string().optional(),
    body: s.mdx(),
  }),
});

const experiences = defineCollection({
  name: "Experience",
  pattern: "experience/**/*.mdx",
  schema: s.object({
    company: s.string(),
    role: s.string(),
    startDate: s.string(),
    endDate: s.string().optional(),
    location: s.string(),
    order: s.number(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects, experiences },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
```

3.3. Update `next.config.ts` to integrate Velite
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler: any) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}

export default nextConfig;
```

3.4. Add `.velite` to `.gitignore`

3.5. Create content helper at `src/lib/content.ts`
```typescript
import { projects, experiences } from "#site/content";

export function getProjects() {
  return projects.sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects() {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getExperiences() {
  return experiences.sort((a, b) => a.order - b.order);
}
```

3.6. Create project content files in `src/content/projects/`:

**trader.mdx:**
```mdx
---
title: "Trader"
description: "Autonomous algorithmic trading system with predictability-first asset selection and multi-layered risk management"
slug: "trader"
featured: true
order: 1
techStack: ["Python", "FastAPI", "React", "PostgreSQL", "asyncio", "Docker"]
github: "https://github.com/predictive-trader/trader"
---

## Overview

An autonomous trading system that uses statistical forecasting to identify predictable assets, then executes a direction-reversal strategy with strict risk controls.

## Key Features

- **Predictability-First Selection**: ETS forecasting models identify assets with ~55% directional accuracy
- **Inflection Point Trading**: Direction-reversal strategy captures trend changes
- **Multi-Layered Risk Management**: 2% trailing stops, daily loss circuit breakers, position limits
- **Event-Driven Architecture**: Custom asyncio event bus for real-time processing
- **Production Dashboard**: React 19 frontend with real-time updates via FastAPI

## Technical Highlights

- Broker-agnostic design with Alpaca integration for paper/live trading
- PostgreSQL persistence with comprehensive audit logging
- Docker containerization for Railway deployment
- 19 of 20 planned epics complete
```

**golden-paws.mdx:**
```mdx
---
title: "Golden Paws Photography"
description: "Full-stack business application for professional pet photography with booking, galleries, and payment processing"
slug: "golden-paws"
featured: true
order: 2
techStack: ["Astro", "TypeScript", "PostgreSQL", "Drizzle", "Cloudflare R2", "Stripe"]
github: "https://github.com/golden-paws-photography/golden-paws-photography"
liveUrl: "https://goldenpawsphotography.com"
---

## Overview

A complete business platform for a professional pet photography studio, handling everything from booking to delivery.

## Key Features

- **Customer Portal**: Secure photo sharing with automatic account linking
- **Gallery Management**: Event-based galleries with bulk upload/download
- **Booking System**: Package selection, scheduling, gift certificates
- **Payment Processing**: Stripe integration with promo codes
- **Business Analytics**: Reporting with CSV/PDF export

## Technical Highlights

- Astro 5 with TypeScript for type-safe full-stack development
- Better Auth for multi-provider authentication (Email, Google, GitHub)
- Cloudflare R2 storage with automatic thumbnail generation
- 84+ tests with 100% passing rate
```

**nfl-fantasy.mdx:**
```mdx
---
title: "NFL Fantasy Playoffs"
description: "Real-time fantasy football leaderboard with live stats sync and team management"
slug: "nfl-fantasy"
featured: true
order: 3
techStack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Drizzle", "TanStack Query"]
github: "https://github.com/haighd/nfl-fantasy-playoffs-2026"
---

## Overview

A live leaderboard application for a custom fantasy football playoffs league with real-time scoring updates.

## Key Features

- **Live Leaderboard**: Real-time ranked standings with expandable rosters
- **Auto Stats Sync**: Tank01 NFL API integration with 20-minute refresh during games
- **Team Management**: Admin dashboard for members, rosters, eliminations
- **Draft Import**: CSV bulk import for initial roster setup

## Technical Highlights

- Next.js 15 with App Router and React 19
- Smart polling intervals based on game time detection
- Drizzle ORM for type-safe database access
- Deployed on Railway with auto-scaling
```

**momentum-trader.mdx:**
```mdx
---
title: "Momentum Trader"
description: "Multi-strategy swing trading system with backtesting and parameter optimization"
slug: "momentum-trader"
featured: true
order: 4
techStack: ["Python", "PostgreSQL", "Backtrader", "Telegram", "Alpaca API"]
github: "https://github.com/haighd/momentum_trader"
---

## Overview

A systematic swing trading application implementing multiple strategies with comprehensive risk management and notification system.

## Key Features

- **Multiple Strategies**: EMA Crossover, Time-Series Momentum, RSI Mean Reversion
- **Risk Management**: 2% position sizing, ATR trailing stops, 5% daily loss limit
- **Notifications**: Telegram alerts for trades, daily digests, system heartbeat
- **Backtesting**: Historical testing with Sharpe ratio optimization

## Technical Highlights

- Strategy selection based on market regime (trending vs ranging)
- Grid search parameter optimization
- HTTP health server for Railway deployment monitoring
- Complete trade history with PostgreSQL persistence
```

3.7. Create experience content files in `src/content/experience/`:

**merck.mdx:**
```mdx
---
company: "Merck"
role: "Associate Director, Data Science & Analytics"
startDate: "2023"
endDate: null
location: "Remote"
order: 1
---

- Lead analytics initiatives for [specific area]
- Drive data-driven decision making across [teams/functions]
- Implement ML/AI solutions for [business problems]
```

*(Note: Experience content will need Dan's input for accurate details)*

**Success Criteria:**
- [ ] `bun dev` generates `.velite` directory
- [ ] Content types are generated and importable
- [ ] All 4 project MDX files parse without errors
- [ ] `getProjects()` returns sorted array

---

### Phase 4: Core Pages

**Objective:** Implement all main pages with real content.

**Tasks:**

4.1. Update root layout `src/app/layout.tsx`
```typescript
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Dan Haight | Analytics Leader",
    template: "%s | Dan Haight",
  },
  description: "Analytics leader with technical depth in Python, SQL, and ML/AI",
  openGraph: {
    title: "Dan Haight | Analytics Leader",
    description: "Analytics leader with technical depth",
    url: "https://danalytics.info",
    siteName: "Dan Haight",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

4.2. Create Home page `src/app/page.tsx`
- Hero section with name, title, brief intro
- Featured projects grid (3-4 cards)
- CTA to view all projects

4.3. Create About page `src/app/about/page.tsx`
- Professional background narrative
- Key skills/expertise areas
- Personal touch (interests, values)

4.4. Create Experience page `src/app/experience/page.tsx`
- Timeline component with experience entries
- Role details with achievements
- Technology tags per role

4.5. Create Projects index `src/app/projects/page.tsx`
- Grid of all project cards
- Tech stack filters (optional, can defer)

4.6. Create Project detail `src/app/projects/[slug]/page.tsx`
```typescript
import { getProjectBySlug, getProjects } from "@/lib/content";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx-content";

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <div className="flex gap-2">
        {project.techStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
      <MDXContent code={project.body} />
    </article>
  );
}
```

4.7. Create MDX content renderer `src/components/mdx-content.tsx`
```typescript
import * as runtime from "react/jsx-runtime";
import { useMDXComponent } from "velite/mdx";

const components = {
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="mb-4 text-muted" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
  // Add more as needed
};

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code, runtime);
  return <Component components={components} />;
}
```

**Success Criteria:**
- [ ] All routes render without errors
- [ ] Projects display from MDX content
- [ ] Navigation works between all pages
- [ ] Responsive on mobile viewport

---

### Phase 5: Polish Pages

**Objective:** Complete remaining pages and navigation.

**Tasks:**

5.1. Create Blog placeholder `src/app/blog/page.tsx`
```typescript
export default function BlogPage() {
  return (
    <div className="container py-section">
      <h1>Blog</h1>
      <p className="text-muted">Coming soon. Check back for articles on analytics, data science, and leadership.</p>
    </div>
  );
}
```

5.2. Create Contact page `src/app/contact/page.tsx`
- Simple layout with mailto link
- LinkedIn and GitHub links
- Professional headshot (if available)

5.3. Implement Header navigation `src/components/layout/header.tsx`
- Logo/name link to home
- Nav links: About, Experience, Projects, Blog, Contact
- Mobile hamburger menu

5.4. Implement Footer `src/components/layout/footer.tsx`
- Social links (LinkedIn, GitHub)
- Copyright
- Email link

5.5. Add page transitions (subtle)
- Fade in on route change using CSS

5.6. Accessibility audit
- Check color contrast
- Add skip links
- Verify keyboard navigation
- Test with screen reader

5.7. SEO optimization
- Add `robots.txt`
- Add `sitemap.xml` generation
- Verify Open Graph tags
- Add structured data (Person schema)

**Success Criteria:**
- [ ] All 7 routes accessible
- [ ] Mobile navigation works
- [ ] Lighthouse accessibility score 90+
- [ ] No console errors

---

### Phase 6: Deployment

**Objective:** Deploy to Railway with custom domain and email.

**Tasks:**

6.1. Create Railway project
```bash
# Install Railway CLI if needed
bun add -g @railway/cli

# Login and initialize
railway login
railway init
```

6.2. Configure Railway settings
- Set build command: `bun run build`
- Set start command: `bun run start`
- Set Node version: 20.x
- Enable auto-deploy on push to main

6.3. Configure custom domain in Railway
- Add `danalytics.info` as custom domain
- Add `www.danalytics.info` with redirect to apex

6.4. Configure DNS at domain registrar
- Add A record pointing to Railway IP
- Add CNAME for www subdomain
- Verify SSL certificate provisioned

6.5. Configure FastMail for danalytics.info
- Add domain in FastMail settings
- Configure MX records:
  ```
  MX 10 in1-smtp.messagingengine.com
  MX 20 in2-smtp.messagingengine.com
  ```
- Add SPF record: `v=spf1 include:spf.messagingengine.com ~all`
- Add DKIM records (FastMail provides these)
- Create dan@danalytics.info alias

6.6. Update contact email throughout site to dan@danalytics.info

6.7. Verify deployment
- Test all routes on production URL
- Run Lighthouse audit
- Test email delivery

**Success Criteria:**
- [ ] Site accessible at https://danalytics.info
- [ ] SSL certificate valid
- [ ] Auto-deploy works on merge to main
- [ ] dan@danalytics.info receives email
- [ ] Lighthouse performance 90+

---

## File Summary

| File | Purpose |
|------|---------|
| `velite.config.ts` | Content collection schemas |
| `src/app/globals.css` | Design tokens, base styles |
| `src/lib/utils/cn.ts` | Class merging utility |
| `src/lib/content.ts` | Content query helpers |
| `src/components/ui/*` | Base UI components |
| `src/components/layout/*` | Header, Footer, Section |
| `src/components/mdx-content.tsx` | MDX renderer |
| `src/content/projects/*.mdx` | Project content |
| `src/content/experience/*.mdx` | Experience content |
| `src/app/**/page.tsx` | Route pages |

---

## Success Criteria Summary

### Automated Verification
```bash
# Build passes
bun run build

# Lint passes
bun run lint

# Type check passes
bunx tsc --noEmit
```

### Manual Verification
- [ ] All pages render correctly on desktop and mobile
- [ ] Navigation works between all routes
- [ ] Project cards link to detail pages
- [ ] MDX content renders with proper styling
- [ ] Site loads in <2s on 3G throttled connection
- [ ] Lighthouse scores: Performance 90+, Accessibility 90+, SEO 90+
- [ ] Email to dan@danalytics.info delivers successfully

---

## Dependencies to Install

```bash
# Core
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-bun

# Styling & Components
bun add clsx tailwind-merge class-variance-authority
bun add @radix-ui/react-slot
bun add lucide-react
bun add @fontsource-variable/inter

# Content
bun add velite -D

# Dev tools
bun add prettier prettier-plugin-tailwindcss -D
```

---

## Notes

- Experience content will need Dan's input for accurate role descriptions
- Project images can be added later (screenshots, diagrams)
- Blog can be enabled later by adding a `posts` collection to Velite
- Dark mode can be added in a future iteration
