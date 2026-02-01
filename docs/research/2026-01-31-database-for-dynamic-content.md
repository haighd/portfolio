# Research: Database for Dynamic Content Management

**Issue**: #50
**Date**: 2026-01-31
**Status**: Complete

## Executive Summary

This research evaluates migrating portfolio content from file-based Velite MDX collections to a database solution. Given the existing Railway deployment, **Railway Postgres + Drizzle ORM** is the recommended stack for its simplicity, type safety, and minimal overhead.

---

## Current Architecture

### Content Types Managed

| Content Type | Storage | Files | Schema Complexity |
|--------------|---------|-------|-------------------|
| Projects | Velite MDX | 4 | Medium (case study fields) |
| Experiences | Velite MDX | 5 | Low |
| Skills | Velite MDX | 84 | Low |
| Blog Posts | Velite MDX | 1 | Medium (reading time calc) |
| Now Page | Velite MDX | 1 | Low |
| Certifications | Hardcoded TS | N/A | Low |
| About Skills Summary | Hardcoded TS | N/A | Low |

### Current Data Flow

```
src/content/**/*.mdx
        ↓ (Velite build)
.velite/*.json + index.d.ts
        ↓ (#site/content alias)
src/lib/content.ts (accessor functions)
        ↓
Page components (RSC)
```

### Key Files

- `velite.config.ts` - Defines all 5 content collections
- `src/lib/content.ts` - Content accessor functions
- `src/data/skills.ts` - Hardcoded certifications + skills summary
- `src/components/mdx-content.tsx` - Client-side MDX renderer

---

## Database Options Analysis

### Recommended: Railway Postgres

Since the portfolio is already deployed on Railway, using Railway Postgres provides:

| Benefit | Details |
|---------|---------|
| **Simplified architecture** | Single provider, single billing |
| **Internal networking** | No cross-provider latency |
| **Existing credits** | $5/month Hobby plan credit can cover database |
| **Easy provisioning** | One-click setup from Railway dashboard |

**Estimated Cost**: $0-7/month additional (depending on usage within existing plan)

**Connection Pooling**: Deploy [PgBouncer template](https://railway.com/deploy/postgres-pgbouncer) for serverless compatibility.

### Alternative Considered: Neon

Would be better if:
- Not already on Railway
- Need scale-to-zero (database pauses when inactive)
- Want generous free tier (100 CU-hours/month)

**Verdict**: Unnecessary complexity given existing Railway deployment.

---

## ORM Recommendation: Drizzle

### Why Drizzle over Prisma

| Factor | Drizzle | Prisma 7 |
|--------|---------|----------|
| Bundle size | ~7kb gzipped | ~600kb gzipped |
| Cold start | Negligible | Noticeable |
| Code generation | Not required | Required after schema changes |
| Edge compatibility | Native | Supported (improved in v7) |
| SQL control | Direct, transparent | Abstracted |
| Learning curve | Easier if you know SQL | Easier for ORM beginners |

### Drizzle Setup

```bash
bun add drizzle-orm pg
bun add -D drizzle-kit @types/pg
```

### Schema Example

```typescript
// src/db/schema.ts
import { pgTable, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  slug: text('slug').notNull().unique(),
  featured: boolean('featured').default(false),
  order: integer('order').default(0),
  techStack: text('tech_stack').array(),
  github: text('github'),
  private: boolean('private').default(false),
  liveUrl: text('live_url'),
  image: text('image'),
  // Case study fields
  challenge: text('challenge'),
  approach: text('approach'),
  impact: text('impact'),
  learnings: text('learnings'),
  body: text('body'), // MDX content
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

## Migration Strategy

### Phase 1: Database Setup (Foundation)
1. Provision Railway Postgres instance
2. Deploy PgBouncer for connection pooling
3. Set up Drizzle ORM with schema definitions
4. Create migration scripts
5. Seed database from existing Velite content

### Phase 2: Dual-Read Implementation
1. Create database accessor functions mirroring `src/lib/content.ts`
2. Add feature flag to toggle between Velite and database
3. Update pages to use new accessors
4. Test parity between both sources

### Phase 3: Admin UI (Optional)
1. Create `/admin` routes (protected)
2. Build CRUD forms for each content type
3. Add MDX preview capability
4. Implement authentication (consider Clerk or Auth.js)

### Phase 4: Cutover
1. Remove Velite dependency
2. Delete `src/content/` directory
3. Update build process
4. Remove feature flags

---

## Schema Design

### Core Tables

```sql
-- Projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  tech_stack TEXT[],
  github TEXT,
  private BOOLEAN DEFAULT FALSE,
  live_url TEXT,
  image TEXT,
  challenge TEXT,
  approach TEXT,
  impact TEXT,
  learnings TEXT,
  body TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Experiences
CREATE TABLE experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  location TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  body TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('expert', 'advanced', 'intermediate')),
  "order" INTEGER DEFAULT 0,
  body TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  published_date TIMESTAMP NOT NULL,
  updated_date TIMESTAMP,
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  body TEXT,
  reading_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Now Page (single row)
CREATE TABLE now_content (
  id TEXT PRIMARY KEY DEFAULT 'now',
  title TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  body TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Cost Analysis

### Current (Velite MDX)
- **Hosting**: ~$5/month (Railway Hobby)
- **Database**: $0
- **Total**: ~$5/month

### Proposed (Railway Postgres)
- **Hosting**: ~$5/month (Railway Hobby)
- **Database**: $0-5/month (covered by Hobby credits for light usage)
- **PgBouncer**: ~$1-2/month
- **Total**: ~$5-12/month

### Break-even Consideration
The added cost is justified if:
1. Content updates become frequent (weekly+)
2. Admin UI eliminates need for code deploys
3. API access enables other applications (resume generator, etc.)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Cold start latency | PgBouncer connection pooling |
| Data loss | Railway automatic backups + manual exports |
| Migration bugs | Dual-read phase with feature flag |
| Increased complexity | Phased rollout, can revert to Velite |
| Cost creep | Monitor Railway usage dashboard |

---

## Decision Points for Implementation

1. **Admin UI**: Build custom vs. use existing CMS (Payload, Strapi)?
2. **Authentication**: Clerk, Auth.js, or simple password protection?
3. **MDX handling**: Store raw MDX and compile on read, or pre-compile?
4. **Migration timing**: Big bang vs. gradual table-by-table?

---

## Recommendations

### Immediate Next Steps
1. **Provision Railway Postgres** - Add to existing project
2. **Set up Drizzle** - Schema definitions + migrations
3. **Create seed script** - Export Velite content to database
4. **Build accessor layer** - Mirror existing `src/lib/content.ts` API

### Defer for Later
- Admin UI (can still update via direct SQL or seed scripts initially)
- Authentication (not needed until admin UI)
- Full MDX editor (complex, low ROI initially)

---

## References

- [Railway Postgres Documentation](https://docs.railway.com/guides/postgresql)
- [Railway PgBouncer Template](https://railway.com/deploy/postgres-pgbouncer)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle + Next.js Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon)
- [Current Velite Configuration](../velite.config.ts)
