# Implementation Plan: Blog Tag Archive Pages

**Issue:** #40
**Priority:** Medium | **Effort:** Low
**Date:** 2025-01-30

## Overview

Add static archive pages for each blog tag to improve SEO and content discoverability. Tags on blog posts will link to their respective archive pages, and the blog listing will include a tag cloud/list.

## Current State

- Tags exist in blog schema (`velite.config.ts`) as `s.array(s.string())`
- `getBlogPosts()` returns sorted posts in `src/lib/content.ts`
- Blog post page (`/blog/[slug]/page.tsx`) displays tags as non-clickable badges
- Blog listing page (`/blog/page.tsx`) shows posts in a grid, no tag filtering

## Implementation

### Phase 1: Content Utilities

**File:** `src/lib/content.ts`

Add two helper functions:

```typescript
export function getAllBlogTags(): string[] {
  const tags = new Set<string>();
  blog.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blog
    .filter((post) => post.tags?.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
}
```

### Phase 2: Tag Archive Page

**File:** `src/app/blog/tags/[tag]/page.tsx`

Create dynamic route with:
- `generateStaticParams()` - pre-generate all tag pages
- `generateMetadata()` - SEO metadata for each tag
- Page component showing filtered posts using `BlogPostCard`

Structure:
```
/blog/tags/[tag]/page.tsx
```

Key elements:
- Back link to `/blog`
- Heading: "Posts tagged '{tag}'"
- Post count
- Grid of `BlogPostCard` components
- Fallback if no posts found

### Phase 3: Update Tag Links

**Files to update:**

1. `src/components/blog-post-card.tsx` - Make tags clickable
2. `src/app/blog/[slug]/page.tsx` - Make tags clickable on post page

Change:
```tsx
<Badge key={tag} variant="secondary">{tag}</Badge>
```

To:
```tsx
<Link href={`/blog/tags/${encodeURIComponent(tag)}`}>
  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
    {tag}
  </Badge>
</Link>
```

### Phase 4: Tag Cloud on Blog Page

**File:** `src/app/blog/page.tsx`

Add a tag section below the header:

```tsx
import { getAllBlogTags } from "@/lib/content";

// In component:
const allTags = getAllBlogTags();

// Render between header and posts grid:
{allTags.length > 0 && (
  <div className="mb-8 flex flex-wrap gap-2">
    {allTags.map((tag) => (
      <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}`}>
        <Badge variant="outline" className="hover:bg-accent cursor-pointer">
          {tag}
        </Badge>
      </Link>
    ))}
  </div>
)}
```

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/blog/tags/[tag]/page.tsx` | Tag archive page |

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/content.ts` | Add `getAllBlogTags()`, `getPostsByTag()` |
| `src/components/blog-post-card.tsx` | Make tag badges clickable links |
| `src/app/blog/[slug]/page.tsx` | Make tag badges clickable links |
| `src/app/blog/page.tsx` | Add tag cloud section |

## Acceptance Criteria

- [ ] Tag pages render at `/blog/tags/{tag}`
- [ ] Tags on blog post pages link to archive pages
- [ ] Tags on blog cards link to archive pages
- [ ] Tag cloud visible on blog listing page
- [ ] Proper metadata for SEO on tag pages
- [ ] Static generation via `generateStaticParams`
- [ ] Build passes without errors
- [ ] All existing functionality preserved

## Testing

1. `bun run build` - Verify static generation works
2. `bun run dev` - Manual testing:
   - Navigate to `/blog` - verify tag cloud appears
   - Click a tag - verify archive page loads
   - Click tag on blog post page - verify navigation
   - Verify SEO metadata in page source

## Notes

- URL encoding used for tags with special characters
- Empty tag pages handled gracefully with "No posts found" message
- Existing `BlogPostCard` component reused for consistency
