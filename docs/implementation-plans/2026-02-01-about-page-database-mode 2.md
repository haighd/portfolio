# Implementation Plan: About Page Database Mode

**Issue**: #58 - Update About page content for database mode
**Date**: 2026-02-01
**Effort**: Low
**Status**: Ready for implementation

## Overview

Migrate the About page from hardcoded static content to use the database content abstraction layer, following the same singleton pattern as the Now page.

## Current State

The About page (`src/app/about/page.tsx`) has:
- Hardcoded bio paragraphs (lines 28-50)
- Hardcoded current role info (Associate Director at Merck)
- Hardcoded location (Remote)
- Hardcoded focus areas (ML/AI, Analytics, Leadership)
- Dynamic skills via `getSkillsSummary()` (this already works)
- Static "Let's Connect" section

## Target State

About page pulls structured content from database when `DATABASE_CONTENT_ENABLED=true`, matching the Now page pattern.

## Implementation Steps

### Phase 1: Database Schema

**File**: `src/db/schema.ts`

Add `aboutContent` table (singleton pattern like `nowContent`):

```typescript
export const aboutContent = pgTable("about_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  currentRole: text("current_role").notNull(),
  currentCompany: text("current_company").notNull(),
  location: text("location").notNull(),
  focusAreas: text("focus_areas").array().notNull(),
  body: text("body").notNull(),  // MDX bio content
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

Add type exports.

### Phase 2: Database Accessor

**File**: `src/lib/db-content.ts`

Add type and accessor function:

```typescript
export type About = Omit<DbAboutContent, "createdAt" | "updatedAt">;

export const getAboutContent = unstable_cache(
  async (): Promise<About | undefined> => {
    const result = await getDb().select().from(aboutContent).limit(1);
    return result[0];
  },
  ["db-about-content"],
  { revalidate: CACHE_REVALIDATE }
);
```

### Phase 3: Content Router

**File**: `src/lib/content.ts`

Add type and router function:

```typescript
export type About = {
  id?: string;
  title: string;
  description: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  focusAreas: string[];
  body: string;
};

export async function getAboutContent(): Promise<About | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getAboutContent();
  }
  // No Velite fallback needed - About page works without it
  return undefined;
}
```

### Phase 4: Create MDX Content

**File**: `src/content/about/index.mdx`

Create Velite source file:

```mdx
---
title: "About Me"
description: "Analytics leader with hands-on technical depth in Python, SQL, and ML/AI."
currentRole: "Associate Director, Data Science & Analytics"
currentCompany: "Merck"
location: "Remote"
focusAreas:
  - "ML/AI"
  - "Analytics"
  - "Leadership"
---

I'm an analytics leader who believes the best data work happens when strategic thinking meets technical execution.

With experience spanning data science, machine learning, and analytics leadership, I bring a unique perspective that combines hands-on technical capability with the ability to translate complex insights into business impact.

Currently, I lead analytics initiatives at Merck, where I develop ML/AI solutions for business process optimization and partner with cross-functional teams to drive data-informed decision making.

Outside of work, I build side projects that let me explore new technologies and stay sharp on the technical side. From algorithmic trading systems to full-stack web applications, these projects keep me connected to the craft of building software.
```

### Phase 5: Update Velite Config

**File**: `velite.config.ts`

Add About collection definition (similar to Now):

```typescript
const about = defineCollection({
  name: "About",
  pattern: "about/index.mdx",
  single: true,
  schema: s.object({
    title: s.string(),
    description: s.string(),
    currentRole: s.string(),
    currentCompany: s.string(),
    location: s.string(),
    focusAreas: s.array(s.string()),
    body: s.mdx(),
  }),
});
```

Export in collections.

### Phase 6: Update Seed Script

**File**: `scripts/seed-database.ts`

Add About seeding (singleton pattern like Now):

```typescript
interface VeliteAbout {
  title: string;
  description: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  focusAreas: string[];
  body: string;
}

// Read about data
const aboutData = readVeliteJson<VeliteAbout[]>("about.json");

// Seed about content (singleton)
console.log(`Seeding about content...`);
await db.delete(schema.aboutContent);
const aboutItem = aboutData[0];
if (aboutItem) {
  await db.insert(schema.aboutContent).values({
    title: aboutItem.title,
    description: aboutItem.description,
    currentRole: aboutItem.currentRole,
    currentCompany: aboutItem.currentCompany,
    location: aboutItem.location,
    focusAreas: aboutItem.focusAreas,
    body: aboutItem.body,
  });
}
console.log("  About content seeded successfully");
```

### Phase 7: Update About Page

**File**: `src/app/about/page.tsx`

Make async and use content abstraction:

```typescript
import { getAboutContent } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";

export default async function AboutPage() {
  const about = await getAboutContent();
  const skills = getSkillsSummary();

  // Use about?.field with fallbacks for non-database mode
  const title = about?.title ?? "About Me";
  const currentRole = about?.currentRole ?? "Associate Director, Data Science & Analytics";
  // ... etc

  return (
    <>
      {/* Bio section uses MDXContent if available */}
      {about?.body ? (
        <MDXContent code={about.body} />
      ) : (
        /* Existing hardcoded JSX as fallback */
      )}
    </>
  );
}
```

### Phase 8: Generate Migration

Run Drizzle to generate migration:

```bash
bun run db:generate
```

### Phase 9: Test

1. Build Velite: `bun run build:velite`
2. Run migration: `bun run db:migrate`
3. Seed database: `bun run db:seed`
4. Test locally with `DATABASE_CONTENT_ENABLED=true`
5. Verify About page renders correctly

## Files Modified

| File | Change |
|------|--------|
| `src/db/schema.ts` | Add `aboutContent` table |
| `src/lib/db-content.ts` | Add `getAboutContent` function |
| `src/lib/content.ts` | Add `About` type and router |
| `src/content/about/index.mdx` | New MDX content file |
| `velite.config.ts` | Add About collection |
| `scripts/seed-database.ts` | Add About seeding |
| `src/app/about/page.tsx` | Make async, use content layer |

## Acceptance Criteria

- [x] About page renders correctly with `DATABASE_CONTENT_ENABLED=false` (Velite)
- [ ] About page renders correctly with `DATABASE_CONTENT_ENABLED=true` (Database)
- [x] Content matches current hardcoded values
- [x] Skills section continues to work
- [x] No TypeScript errors
- [ ] Build succeeds (blocked by pre-existing blog date issue on main)

## Notes

- Following exact pattern from Now page implementation
- Singleton pattern (delete + insert) for seeding
- MDX body field for bio paragraphs allows future rich content
- Metadata fields (role, company, location, focusAreas) are structured for easy updates
