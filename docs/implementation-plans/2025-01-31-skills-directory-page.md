# Implementation Plan: Skills Directory Page

**Issue:** #43 - Add skills directory page
**Created:** 2025-01-31
**Status:** Complete

## Overview

Create a searchable skills/tech stack directory page at `/skills` that showcases technical expertise organized by category, with proficiency levels and cross-links to relevant projects.

## Research Summary

### Existing Assets
- **Skills data** exists in `src/app/about/page.tsx:14-29` as hardcoded object with 4 categories
- **Page patterns** established in `/blog`, `/projects`, `/experience`
- **Navigation** defined in `src/components/layout/header.tsx:11-18`
- **UI components** available: `Section`, `Container`, `Badge`, `Card`
- **No proficiency levels** currently exist in codebase

### Key Decisions
1. **Data approach**: Start with hardcoded data (like about page), extractable to Velite later
2. **Proficiency levels**: Add as part of this implementation (expert/advanced/intermediate)
3. **Project linking**: Manual for now; add `skills` field to project frontmatter in future iteration

---

## Implementation Phases

### Phase 1: Create Skills Page Route

**Files to create:**
- `src/app/skills/page.tsx`

**Implementation:**

```tsx
// src/app/skills/page.tsx
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

type Skill = {
  name: string;
  proficiency: "expert" | "advanced" | "intermediate";
};

type SkillCategory = {
  name: string;
  description: string;
  skills: Skill[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Languages & Tools",
    description: "Core programming languages and development tools",
    skills: [
      { name: "Python", proficiency: "expert" },
      { name: "SQL", proficiency: "expert" },
      { name: "TypeScript", proficiency: "advanced" },
      { name: "React", proficiency: "advanced" },
      { name: "FastAPI", proficiency: "advanced" },
    ],
  },
  {
    name: "Data & ML",
    description: "Machine learning, analytics, and data engineering",
    skills: [
      { name: "Machine Learning", proficiency: "expert" },
      { name: "Statistical Modeling", proficiency: "expert" },
      { name: "Data Engineering", proficiency: "expert" },
      { name: "ETL Pipelines", proficiency: "advanced" },
    ],
  },
  {
    name: "Platforms",
    description: "Infrastructure, databases, and cloud services",
    skills: [
      { name: "PostgreSQL", proficiency: "expert" },
      { name: "Docker", proficiency: "advanced" },
      { name: "AWS", proficiency: "advanced" },
      { name: "Railway", proficiency: "intermediate" },
    ],
  },
  {
    name: "Leadership",
    description: "Team management and strategic capabilities",
    skills: [
      { name: "Team Management", proficiency: "expert" },
      { name: "Strategy Development", proficiency: "expert" },
      { name: "Stakeholder Communication", proficiency: "expert" },
      { name: "Mentorship", proficiency: "advanced" },
    ],
  },
];

export default function SkillsPage() {
  return (
    <Section className="pt-24 md:pt-32">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Skills
          <span className="mt-2 block h-1 w-16 rounded-full bg-foreground/20" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Technical expertise across data, engineering, and leadership.
        </p>
      </div>

      {/* Skill categories grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {skillCategories.map((category) => (
          <div key={category.name} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={
                    skill.proficiency === "expert"
                      ? "default"
                      : skill.proficiency === "advanced"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
        <span>Proficiency:</span>
        <Badge variant="default">Expert</Badge>
        <Badge variant="secondary">Advanced</Badge>
        <Badge variant="outline">Intermediate</Badge>
      </div>
    </Section>
  );
}
```

**Acceptance criteria:**
- [x] Page renders at `/skills`
- [x] Skills organized by 4 categories
- [x] Proficiency levels indicated via badge variants

---

### Phase 2: Add Navigation Link

**Files to modify:**
- `src/components/layout/header.tsx`

**Changes:**

```diff
const navigation = [
  { name: "About", href: "/about" },
  { name: "Now", href: "/now" },
  { name: "Experience", href: "/experience" },
+ { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];
```

**Acceptance criteria:**
- [x] Skills link appears in header navigation
- [x] Link works on both desktop and mobile menus

---

### Phase 3: Mobile Responsiveness & Polish

**Verify:**
- [x] Category cards stack properly on mobile (single column)
- [x] Badge wrapping works correctly
- [x] Legend is readable on small screens
- [x] Page title and description scale appropriately

**Optional enhancements** (defer to future issue):
- Search/filter functionality
- Project cross-linking
- Velite collection migration
- Individual skill detail pages

---

## Files Changed Summary

| File | Action | Description |
|------|--------|-------------|
| `src/app/skills/page.tsx` | Create | New skills directory page |
| `src/components/layout/header.tsx` | Modify | Add Skills nav link |

---

## Testing Checklist

- [x] Page loads at `/skills` without errors
- [x] All 4 categories display with skills
- [x] Badge variants correctly indicate proficiency
- [x] Navigation link works from any page
- [x] Mobile responsive (test at 375px, 768px, 1024px)
- [x] No TypeScript errors
- [x] No console warnings

---

## Future Iterations

1. **Project cross-linking**: Add `skills` field to project frontmatter, display "Used in" links on skills page
2. **Velite collection**: Migrate skills data to MDX collection for easier editing
3. **Search/filter**: Add client-side filtering by category or proficiency
4. **Skill detail pages**: `/skills/[slug]` with full description and related projects
