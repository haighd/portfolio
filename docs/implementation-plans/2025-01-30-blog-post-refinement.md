# Implementation Plan: Blog Post Refinement

**Issue:** #22 - Refine sample blog post content
**Date:** 2025-01-30
**Related Research:** docs/research/2025-01-30-blog-post-refinement.md

---

## Overview

Refine the blog post "Building My Portfolio with Next.js and Velite" to include expanded technical details, code snippets, internal links, and improved SEO.

**File to modify:** `src/content/blog/building-my-portfolio.mdx`

---

## Implementation Tasks

### Task 1: Expand Technical Details

Add depth to existing sections by explaining the "how" alongside the "why."

**Changes:**

1. **Next.js section** - Add detail about Server Components benefits (reduced bundle size, simplified data fetching)

2. **Velite section** - Explain:
   - Type-safe content transforms
   - Auto-calculated reading time
   - MDX compilation pipeline

3. **Tailwind section** - Mention v4's CSS-native features briefly

### Task 2: Add Code Snippets

Include three key code snippets demonstrating patterns.

**Snippets to add:**

1. **Velite Blog Schema** (abbreviated)
   ```typescript
   const blog = defineCollection({
     name: "BlogPost",
     pattern: "blog/**/*.mdx",
     schema: s.object({
       title: s.string().max(100),
       slug: s.slug("blog"),
       publishedDate: s.string(),
       tags: s.array(s.string()).default([]),
       body: s.mdx(),
       raw: s.raw(),
     }).transform((data) => {
       // Calculate reading time from raw content
       const words = data.raw.split(/\s+/).filter(Boolean).length;
       return { ...data, readingTime: Math.ceil(words / 200) };
     }),
   });
   ```

2. **Type-Safe Content Access** (brief)
   ```typescript
   export type BlogPost = (typeof blog)[number];

   export function getBlogPosts() {
     return blog.sort((a, b) =>
       new Date(b.publishedDate).getTime() -
       new Date(a.publishedDate).getTime()
     );
   }
   ```

3. **MDX Custom Components** (abbreviated example)
   ```typescript
   const components = {
     a: ({ children, href, ...props }) => (
       <a
         href={href}
         target={href?.startsWith("http") ? "_blank" : undefined}
         rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
         {...props}
       >
         {children}
       </a>
     ),
   };
   ```

### Task 3: Add Architecture Diagram

Create a simple ASCII or Mermaid diagram showing content flow.

**Diagram concept:**
```
MDX Files → Velite → TypeScript Types → React Components → Static HTML
```

Use a simple flow description since complex diagrams may not render in all contexts.

### Task 4: Add Internal Links

Link to projects as concrete examples of what the portfolio showcases.

**Links to add:**
- `/projects/trader` - Example of technical project
- `/projects/golden-paws` - Example of full-stack application
- `/projects` - General projects page reference

**Placement:** In the "Why Build a Portfolio Site?" section or new "What's On Display" section.

### Task 5: Review and Align Voice

Maintain conversational tone while adding structure.

**Guidelines:**
- Keep rhetorical questions for engagement
- Add bullet points for key features (like project descriptions)
- Use action-oriented language for technical benefits
- Avoid overly casual or overly formal language

### Task 6: SEO Improvements

**Changes:**
1. Update frontmatter tags to be more specific:
   ```yaml
   tags: ["nextjs", "react", "velite", "tailwindcss", "typescript", "mdx", "portfolio"]
   ```

2. Ensure description is compelling and includes keywords

3. Add more semantic headings for content structure

---

## Proposed Blog Post Structure

```
---
frontmatter (updated tags)
---

## Why Build a Portfolio Site?
[Keep existing, add link to projects page]

## The Tech Stack

### Next.js 14+ with App Router
[Expand with Server Components benefits]

### Velite for Content Management
[Expand with type-safety details]
[Add Velite schema code snippet]

### Type-Safe Content Layer
[NEW section - show content.ts patterns]
[Add type-safe access code snippet]

### Tailwind CSS v4
[Keep brief, already good]

## Custom MDX Components
[NEW section]
[Add MDX components code snippet]
[Explain link handling, styling consistency]

## Content Architecture
[NEW section]
[Add flow diagram/description]

## Key Features
[Keep existing list, possibly expand]

## Projects on Display
[NEW section]
[Link to trader, golden-paws with brief descriptions]

## What's Next
[Keep existing]
```

---

## Validation Checklist

After implementation, verify:

- [x] All code snippets render correctly in MDX
- [x] Internal links work (`/projects`, `/projects/trader`, `/projects/golden-paws`)
- [x] No build errors with `bun run build`
- [x] Blog post displays correctly in dev server
- [x] Reading time updates appropriately with new content (4 min read)
- [x] Tags appear correctly on blog post page (7 tags)

---

## Files Changed

| File | Change Type |
|------|-------------|
| `src/content/blog/building-my-portfolio.mdx` | Modified |

---

## Estimated Scope

Single file modification with content additions. No code changes to components or configuration required.

---

## Notes

- Screenshots/images deferred - would require creating actual assets
- JSON-LD structured data deferred - would require code changes beyond content
- Focus on content refinement per issue scope
