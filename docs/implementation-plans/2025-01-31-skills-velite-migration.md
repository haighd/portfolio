# Implementation Plan: Migrate Skills to Velite MDX Collection

**Issue:** #51 - Migrate skills data to Velite MDX collection
**Created:** 2025-01-31
**Status:** Implemented

## Overview

Migrate skills from the TypeScript data module (`src/data/skills.ts`) to a Velite MDX collection, matching the pattern used for `experience/` and `projects/`. This enables editing skills without touching code and maintains consistency across all content types.

## Current State

Skills are defined in a TypeScript module:
```
src/data/skills.ts
├── 6 skill categories with 85 skills total
├── Type definitions (Skill, SkillCategory, Proficiency)
├── Sort utilities (sortSkills, proficiencyOrder)
├── UI mappings (proficiencyVariant)
├── certifications array
└── getSkillsSummary() helper for /about page
```

Consumers:
- `src/app/skills/page.tsx` - Main skills page
- `src/app/about/page.tsx` - Skills summary section

## Proposed State

```
src/content/skills/
├── languages/
│   ├── python.mdx
│   ├── sql.mdx
│   └── ... (12 files)
├── frameworks-libraries/
│   └── ... (11 files)
├── data-science-analytics/
│   └── ... (17 files)
├── platforms-infrastructure/
│   └── ... (18 files)
├── tools/
│   └── ... (12 files)
└── leadership-operations/
    └── ... (18 files)
```

---

## Implementation Phases

### Phase 1: Add Velite Collection Definition

**Files to modify:**
- `velite.config.ts`

**Implementation:**

```typescript
const skills = defineCollection({
  name: "Skill",
  pattern: "skills/**/*.mdx",
  schema: s.object({
    name: s.string(),
    category: s.string(),
    categorySlug: s.string(),
    proficiency: s.enum(["expert", "advanced", "intermediate"]),
    order: s.number().default(0),
    body: s.mdx(),
  }),
});

// Update exports
export default defineConfig({
  // ...
  collections: { projects, experiences, now, blog, skills },
});
```

**Acceptance criteria:**
- [x] Skills collection defined in velite.config.ts
- [x] Build passes with empty skills directory

---

### Phase 2: Create Skills Content Directory Structure

**Directories to create:**
```
src/content/skills/
├── languages/
├── frameworks-libraries/
├── data-science-analytics/
├── platforms-infrastructure/
├── tools/
└── leadership-operations/
```

**Acceptance criteria:**
- [x] All 6 category directories exist
- [x] Directory names are URL-friendly slugs

---

### Phase 3: Create Skill MDX Files

**Generate 85 MDX files from current data:**

Example file `src/content/skills/languages/python.mdx`:
```mdx
---
name: Python
category: Languages
categorySlug: languages
proficiency: expert
order: 1
---
```

**Category mapping:**
| Category | Slug | Skills Count |
|----------|------|--------------|
| Languages | languages | 12 |
| Frameworks & Libraries | frameworks-libraries | 11 |
| Data Science & Analytics | data-science-analytics | 17 |
| Platforms & Infrastructure | platforms-infrastructure | 18 |
| Tools | tools | 12 |
| Leadership & Operations | leadership-operations | 18 |

**Order assignment:**
- Within each category, order by proficiency then alphabetically
- Expert skills get lower order numbers (displayed first)

**Acceptance criteria:**
- [x] All 88 skill files created (note: actual count from data was 88, not 85)
- [x] Each file has correct frontmatter
- [x] Velite build succeeds

---

### Phase 4: Update Skills Page to Use Collection

**Files to modify:**
- `src/app/skills/page.tsx`

**Implementation:**

```typescript
import { skills } from "#site/content";
import { Section } from "@/components/layout";
import { Badge } from "@/components/ui";
import { proficiencyLevels, proficiencyVariant, certifications } from "@/data/skills";

// Category display configuration
const categoryOrder = [
  "Languages",
  "Frameworks & Libraries",
  "Data Science & Analytics",
  "Platforms & Infrastructure",
  "Tools",
  "Leadership & Operations",
];

const categoryDescriptions: Record<string, string> = {
  "Languages": "Programming and query languages",
  "Frameworks & Libraries": "Development frameworks and data libraries",
  "Data Science & Analytics": "Machine learning, statistics, and analytics",
  "Platforms & Infrastructure": "Databases, cloud services, and DevOps",
  "Tools": "Software and development environments",
  "Leadership & Operations": "Management, strategy, and process improvement",
};

// Group skills by category
const skillsByCategory = skills.reduce((acc, skill) => {
  if (!acc[skill.category]) {
    acc[skill.category] = [];
  }
  acc[skill.category].push(skill);
  return acc;
}, {} as Record<string, typeof skills>);

// Sort skills within each category by order
Object.values(skillsByCategory).forEach(categorySkills => {
  categorySkills.sort((a, b) => a.order - b.order);
});

// Create ordered categories array
const sortedCategories = categoryOrder
  .filter(cat => skillsByCategory[cat])
  .map(cat => ({
    name: cat,
    description: categoryDescriptions[cat],
    skills: skillsByCategory[cat],
  }));

export default function SkillsPage() {
  return (
    <Section className="pt-24 md:pt-32">
      {/* ... same JSX structure, using sortedCategories ... */}
    </Section>
  );
}
```

**Acceptance criteria:**
- [x] Skills page renders from Velite collection
- [x] Category order preserved
- [x] Proficiency badges display correctly
- [x] Page renders identically to current version

---

### Phase 5: Update Skills Data Module

**Files to modify:**
- `src/data/skills.ts`

**Changes:**
- Remove `skillCategories` array (now in MDX)
- Remove `sortedSkillCategories` export
- Keep: type definitions, `proficiencyLevels`, `proficiencyVariant`, `certifications`, `getSkillsSummary()`

**Implementation:**

```typescript
// src/data/skills.ts - After migration

export const proficiencyLevels = ["expert", "advanced", "intermediate"] as const;
export type Proficiency = (typeof proficiencyLevels)[number];

export type Skill = {
  name: string;
  proficiency: Proficiency;
};

export const proficiencyVariant: Record<Proficiency, "default" | "secondary" | "outline"> = {
  expert: "default",
  advanced: "secondary",
  intermediate: "outline",
};

export type Certification = {
  name: string;
  issuer: string;
  abbreviation: string;
};

export const certifications: Certification[] = [
  // ... keep existing certifications
];

// Skills summary for about page - now derived from Velite at build time
// This will be updated in Phase 6
```

**Acceptance criteria:**
- [x] TypeScript compiles without errors
- [x] Certifications still display correctly
- [x] No unused exports remain

---

### Phase 6: Update About Page Skills Summary

**Files to modify:**
- `src/app/about/page.tsx`

**Changes:**
- Import skills from Velite collection
- Derive summary from collection data OR keep curated list

**Option A: Keep curated summary (recommended)**
Keep `getSkillsSummary()` as explicit curation - the about page shows a subset of skills that best represent the portfolio, not all 85 skills.

**Option B: Derive from collection**
Filter collection by specific skills or categories. More complex, less control.

**Recommendation:** Keep Option A - the about page summary is a deliberate curation, not a comprehensive list.

**Acceptance criteria:**
- [x] About page skills section unchanged visually
- [x] No runtime errors

---

### Phase 7: Cleanup and Testing

**Verification steps:**
1. Run `bun run build` - no errors
2. Visit `/skills` - renders correctly
3. Visit `/about` - skills summary displays
4. Compare screenshots before/after

**Acceptance criteria:**
- [x] Build passes with no errors
- [x] No TypeScript errors
- [x] Page renders identically to current version (manual verification required)
- [x] All 88 skills appear in correct categories
- [x] Proficiency badges work correctly

---

## Files Changed Summary

| File | Action | Description |
|------|--------|-------------|
| `velite.config.ts` | Modify | Add skills collection |
| `src/content/skills/**/*.mdx` | Create | 85 skill content files |
| `src/app/skills/page.tsx` | Modify | Consume Velite collection |
| `src/data/skills.ts` | Modify | Remove skill data, keep utilities |

---

## Migration Script

To generate MDX files from current data, run this one-time script:

```typescript
// scripts/migrate-skills.ts
import { writeFileSync, mkdirSync } from "fs";
import { sortedSkillCategories } from "../src/data/skills";

const slugify = (str: string) =>
  str.toLowerCase().replace(/[&\s]+/g, "-").replace(/[^\w-]/g, "");

for (const category of sortedSkillCategories) {
  const categorySlug = slugify(category.name);
  const dir = `src/content/skills/${categorySlug}`;
  mkdirSync(dir, { recursive: true });

  category.skills.forEach((skill, index) => {
    const skillSlug = slugify(skill.name);
    const content = `---
name: "${skill.name}"
category: "${category.name}"
categorySlug: "${categorySlug}"
proficiency: "${skill.proficiency}"
order: ${index + 1}
---
`;
    writeFileSync(`${dir}/${skillSlug}.mdx`, content);
  });
}

console.log("Migration complete!");
```

Run with: `bun run scripts/migrate-skills.ts`

---

## Rollback Plan

If issues arise:
1. Revert changes to `velite.config.ts`
2. Revert changes to `src/app/skills/page.tsx`
3. Restore `src/data/skills.ts` to previous state
4. Delete `src/content/skills/` directory

---

## Future Considerations

1. **Skill detail pages**: `/skills/[category]/[slug]` with MDX body content
2. **Project cross-linking**: Add `skills` field to project frontmatter
3. **Search/filter**: Client-side filtering leveraging collection data
4. **Certifications migration**: Could also move to MDX if needed
