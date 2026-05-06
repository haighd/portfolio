# Implementation Plan: Project Case Study Format

**Created**: 2025-01-31
**Related Issue**: #44
**Status**: Draft

## Overview

Enhance project pages with structured case study sections that demonstrate business impact and problem-solving approach, not just technical implementation. Uses schema-driven frontmatter fields for type safety and consistent visual hierarchy.

## Current State Analysis

### Schema (`velite.config.ts:3-19`)
```typescript
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
    private: s.boolean().default(false),
    liveUrl: s.string().optional(),
    image: s.string().optional(),
    body: s.mdx(),
  }),
});
```

### Template (`src/app/projects/[slug]/page.tsx`)
- Simple header with title, description, tech stack, links
- Single `<MDXContent code={project.body} />` for all content
- No structured sections or visual hierarchy for case studies

### Content Structure
- Free-form MDX with manual h2/h3 headings
- Mix of business context and technical details
- No consistent case study format

## Desired End State

1. **Schema** supports optional case study fields with type safety
2. **Template** renders case study sections with distinct visual hierarchy when present
3. **Content** for Trader and Golden Paws projects includes full case study sections
4. **Backward compatible** - existing projects without case study fields render normally

## What We're NOT Doing

- Creating a separate `case-studies` collection (over-engineering)
- Adding metrics as structured objects (keep as markdown for flexibility)
- Changing the projects list page or card components
- Adding images/media to case study sections (future enhancement)

## Implementation Approach

Schema-driven with optional frontmatter fields. Case study sections render above the technical MDX body when present, creating a clear narrative flow:

```
[Header: Title, Description, Tech Stack, Links]
[Case Study Sections: Challenge → Approach → Impact → Learnings]
[Technical Content: Existing MDX body]
```

---

## Phase 1: Schema Extension

### Files to Modify
- `velite.config.ts`

### Changes

Add optional case study fields to the project schema:

```typescript
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
    private: s.boolean().default(false),
    liveUrl: s.string().optional(),
    image: s.string().optional(),
    // Case study fields (all optional for backward compatibility)
    challenge: s.string().optional(),   // Business problem / context
    approach: s.string().optional(),    // Solution strategy
    impact: s.string().optional(),      // Results with metrics
    learnings: s.string().optional(),   // Key takeaways
    body: s.mdx(),
  }),
});
```

### Success Criteria
- [ ] `bun run build` completes without errors
- [ ] TypeScript types are generated correctly (check `.velite/index.d.ts`)
- [ ] Existing projects still render (no regressions)

---

## Phase 2: Case Study Component

### Files to Create
- `src/components/case-study-section.tsx`

### Implementation

Create a reusable component for rendering case study sections:

```typescript
interface CaseStudySectionProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export function CaseStudySection({ title, content, icon }: CaseStudySectionProps) {
  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
        {icon}
        {title}
      </h2>
      <p className="text-muted-foreground leading-7">{content}</p>
    </div>
  );
}
```

### Visual Hierarchy
- Use subtle background or left border to distinguish from technical content
- Icons for each section type (optional, using Lucide)
- Consistent spacing and typography

### Success Criteria
- [ ] Component renders with proper styling
- [ ] Handles missing/undefined content gracefully
- [ ] Matches existing design system (colors, typography)

---

## Phase 3: Template Integration

### Files to Modify
- `src/app/projects/[slug]/page.tsx`

### Changes

Add case study sections between header and MDX body:

```tsx
import { Target, Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import { CaseStudySection } from "@/components/case-study-section";

// In the component, after </header> and before <article>:

{(project.challenge || project.approach || project.impact || project.learnings) && (
  <div className="mb-12 space-y-6 rounded-lg border border-border bg-muted/30 p-6">
    <h2 className="text-2xl font-semibold tracking-tight">Case Study</h2>

    {project.challenge && (
      <CaseStudySection
        title="The Challenge"
        content={project.challenge}
        icon={<Target className="h-5 w-5 text-accent" />}
      />
    )}

    {project.approach && (
      <CaseStudySection
        title="The Approach"
        content={project.approach}
        icon={<Lightbulb className="h-5 w-5 text-accent" />}
      />
    )}

    {project.impact && (
      <CaseStudySection
        title="Impact & Results"
        content={project.impact}
        icon={<TrendingUp className="h-5 w-5 text-accent" />}
      />
    )}

    {project.learnings && (
      <CaseStudySection
        title="Key Learnings"
        content={project.learnings}
        icon={<BookOpen className="h-5 w-5 text-accent" />}
      />
    )}
  </div>
)}

<article>
  <MDXContent code={project.body} />
</article>
```

### Success Criteria
- [ ] Case study sections render when fields are present
- [ ] No case study section renders when all fields are missing (backward compat)
- [ ] Visual hierarchy is clear (case study vs technical content)
- [ ] Responsive on mobile

---

## Phase 4: Content Updates

### Files to Modify
- `src/content/projects/trader.mdx`
- `src/content/projects/golden-paws.mdx`

### Trader Case Study Content

```yaml
challenge: "Building a trading system that could identify genuinely predictable assets in noisy financial markets, then execute trades autonomously while managing risk across multiple positions and market conditions."

approach: "Developed a predictability-first methodology using ETS forecasting models to score assets by directional accuracy before trading. Implemented a direction-reversal strategy that captures inflection points rather than chasing trends, with multi-layered risk controls including trailing stops and circuit breakers."

impact: "System identifies assets with ~55% directional accuracy (vs 50% random baseline). Runs autonomously 24/5 with zero manual intervention. Event-driven architecture processes market data in real-time. 19 of 20 planned epics completed with comprehensive test coverage."

learnings: "Statistical edge matters more than complex strategies - simple approaches with genuine predictability outperform sophisticated models on random data. Building broker-agnostic from day one enabled seamless paper-to-live transitions. Event-driven architecture proved essential for real-time responsiveness."
```

### Golden Paws Case Study Content

```yaml
challenge: "A professional pet photography studio needed a complete business platform to replace manual processes for booking, photo delivery, and customer management - while providing a premium experience that matched the quality of their photography."

approach: "Built a full-stack application with customer-first design: secure gallery sharing with automatic account linking, event-based photo organization with bulk operations, and integrated booking with Stripe payments. Focused on reliability with 84+ tests and type-safe development."

impact: "Reduced photo delivery time from days to hours with instant gallery notifications. Eliminated manual account management through automatic customer linking. 3-5x faster bulk uploads with parallel processing. 100% test pass rate ensures production reliability."

learnings: "Customer experience details matter enormously - automatic account linking removed friction that would have caused support requests. Investing in bulk operations (upload, download, watermarking) paid off immediately for the photographer's workflow. Building authentication right the first time avoided security technical debt."
```

### Success Criteria
- [ ] Both projects have all 4 case study fields populated
- [ ] Content demonstrates business acumen (not just technical details)
- [ ] Metrics included where quantifiable
- [ ] MDX body still contains technical deep-dive content

---

## Phase 5: Testing & Polish

### Manual Verification
- [ ] Visit `/projects/trader` - case study sections render with correct styling
- [ ] Visit `/projects/golden-paws` - case study sections render with correct styling
- [ ] Visit `/projects/momentum-trader` - no case study section (backward compat)
- [ ] Check mobile responsiveness on all project pages
- [ ] Verify visual hierarchy: Case Study → Technical Content flow is clear

### Automated Verification
```bash
# Build succeeds
bun run build

# Type check passes
bun run typecheck

# Lint passes
bun run lint

# Dev server runs
bun run dev
```

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `velite.config.ts` | Modify | Add 4 optional case study fields |
| `src/components/case-study-section.tsx` | Create | New component for section rendering |
| `src/app/projects/[slug]/page.tsx` | Modify | Integrate case study sections |
| `src/content/projects/trader.mdx` | Modify | Add case study frontmatter |
| `src/content/projects/golden-paws.mdx` | Modify | Add case study frontmatter |

## Rollback Plan

If issues arise:
1. Remove case study fields from MDX files (content reverts)
2. Remove case study rendering from template
3. Remove schema fields from velite.config.ts
4. Delete case-study-section.tsx component

All changes are additive and optional fields ensure backward compatibility.

## Future Enhancements (Out of Scope)

- Add case study sections to project cards on list page
- Support markdown formatting within case study fields
- Add optional hero image for case studies
- Create dedicated `/case-studies` route
