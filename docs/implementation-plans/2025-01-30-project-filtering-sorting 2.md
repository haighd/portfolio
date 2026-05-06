# Implementation Plan: Project Filtering and Sorting

**Issue:** #41
**Priority:** Medium | **Effort:** Low
**Date:** 2025-01-30

## Overview

Add client-side filtering and sorting controls to the projects grid. Users can filter by technology (multi-select) and sort by featured/alphabetical/default order.

## Current State

- Projects page (`/projects/page.tsx`) is a Server Component
- `getProjects()` returns projects sorted by `order` field
- 4 projects exist with `techStack` arrays
- `ProjectCard` component displays tech badges

## Implementation

### Phase 1: Add Content Utility

**File:** `src/lib/content.ts`

Add function to get all unique tech stack items:

```typescript
export function getAllProjectTechStack(): string[] {
  const tech = new Set<string>();
  projects.forEach((p) => p.techStack?.forEach((t) => tech.add(t)));
  return Array.from(tech).sort();
}
```

### Phase 2: Create Projects Filter Component

**File:** `src/components/projects-filter.tsx` (new)

Create a client component with:
- Tech stack filter (multi-select badges)
- Sort dropdown (Featured, A-Z, Default)
- Clear filters button
- Mobile-responsive layout

```typescript
"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import { Badge, Button } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { X } from "lucide-react";

interface ProjectsFilterProps {
  projects: Project[];
  allTech: string[];
}

type SortOption = "default" | "featured" | "alphabetical";

export function ProjectsFilter({ projects, allTech }: ProjectsFilterProps) {
  const [selectedTech, setSelectedTech] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Filter logic
  const filtered = projects.filter((p) => {
    if (selectedTech.size === 0) return true;
    return p.techStack?.some((t) => selectedTech.has(t));
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return a.order - b.order;
    }
  });

  const toggleTech = (tech: string) => {
    const next = new Set(selectedTech);
    if (next.has(tech)) next.delete(tech);
    else next.add(tech);
    setSelectedTech(next);
  };

  const clearFilters = () => {
    setSelectedTech(new Set());
    setSortBy("default");
  };

  const hasFilters = selectedTech.size > 0 || sortBy !== "default";

  return (
    <>
      {/* Filter controls */}
      <div className="mb-8 space-y-4">
        {/* Tech filter */}
        <div className="flex flex-wrap gap-2">
          {allTech.map((tech) => (
            <Badge
              key={tech}
              variant={selectedTech.has(tech) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleTech(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Sort & Clear */}
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm"
          >
            <option value="default">Default order</option>
            <option value="featured">Featured first</option>
            <option value="alphabetical">A-Z</option>
          </select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No projects match the selected filters.
        </p>
      )}
    </>
  );
}
```

### Phase 3: Update Projects Page

**File:** `src/app/projects/page.tsx`

Keep as Server Component, pass data to client filter component:

```typescript
import type { Metadata } from "next";
import { Section } from "@/components/layout";
import { ProjectsFilter } from "@/components/projects-filter";
import { getProjects, getAllProjectTechStack } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Technical projects demonstrating hands-on capability in Python, ML/AI, and data engineering.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const allTech = getAllProjectTechStack();

  return (
    <Section className="pt-24 md:pt-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Technical projects demonstrating hands-on capability in Python, ML/AI,
          and data engineering.
        </p>
      </div>

      <h2 className="sr-only">All Projects</h2>
      <ProjectsFilter projects={projects} allTech={allTech} />
    </Section>
  );
}
```

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/projects-filter.tsx` | Client-side filter/sort component |

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/content.ts` | Add `getAllProjectTechStack()` |
| `src/app/projects/page.tsx` | Use `ProjectsFilter` component |

## Acceptance Criteria

- [ ] Filter UI renders above project grid
- [ ] Can filter projects by technology (multi-select)
- [ ] Can sort projects by different criteria
- [ ] Filters work client-side (no page reload)
- [ ] Clear/reset filters option
- [ ] Works on mobile
- [ ] Build passes without errors

## Testing

1. `bun run build` - Verify build passes
2. `bun run dev` - Manual testing:
   - Click tech badges to filter
   - Verify multi-select works
   - Change sort order
   - Clear filters
   - Test on mobile viewport
