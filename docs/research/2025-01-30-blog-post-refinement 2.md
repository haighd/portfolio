# Blog Post Refinement Research

**Issue:** #22 - Refine sample blog post content
**Date:** 2025-01-30
**Status:** Complete

## Overview

Research conducted to inform refinements for the blog post "Building My Portfolio with Next.js and Velite."

---

## 1. Technical Patterns Worth Highlighting

### Velite Configuration

Location: `velite.config.ts`

- Uses three collections: `projects`, `experiences`, and `blog`
- Blog schema includes:
  - Title (max 100 chars), description (max 200 chars)
  - Auto-calculated reading time (based on ~200 words/minute)
  - Slug, publishedDate, optional updatedDate
  - Tags array and featured boolean
  - MDX body compilation with raw content capture
- Collections output to `.velite` directory

### MDX Content Rendering

Location: `src/components/mdx-content.tsx`

- Custom MDX component system using React's JSX runtime
- 12 customized HTML components with Tailwind styling:
  - Headings (h2, h3, h4) with consistent spacing
  - Links auto-open external URLs in new tabs
  - Code blocks with monospace font and muted background
  - Blockquotes with left border accent

### Type-Safe Content Patterns

Location: `src/lib/content.ts`

- Exported types: `Project`, `Experience`, `BlogPost` derived from Velite
- Helper functions: `getBlogPosts()`, `getFeaturedBlogPosts()`, `getBlogPostBySlug()`, `getRelatedPosts()`
- Related posts use intelligent tag-based scoring with fallback to recent posts

### Dark Mode Implementation

- Uses `next-themes` library with class attribute strategy
- Theme provider in `src/components/theme-provider.tsx`
- Theme toggle in `src/components/theme-toggle.tsx` with hydration handling
- Default: system preference

---

## 2. Code Snippets for Blog Post

### Velite Blog Schema

```typescript
const blog = defineCollection({
  name: "BlogPost",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      description: s.string().max(200),
      slug: s.slug("blog"),
      publishedDate: s.string(),
      updatedDate: s.string().optional(),
      tags: s.array(s.string()).default([]),
      featured: s.boolean().default(false),
      body: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => {
      const { raw, ...rest } = data;
      const words = raw.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));
      return { ...rest, readingTime };
    }),
});
```

### Type-Safe Content Access

```typescript
export type BlogPost = (typeof blog)[number];

export function getBlogPosts() {
  return blog.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}
```

### MDX Component Customization

```typescript
const components = {
  h2: ({ children, ...props }) => (
    <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight first:mt-0" {...props}>
      {children}
    </h2>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-accent underline underline-offset-4 hover:text-accent/80"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
};
```

### Velite Webpack Plugin

```typescript
class VeliteWebpackPlugin {
  static started = false;
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}
```

---

## 3. Projects for Internal Links

| Slug | Title | Featured |
|------|-------|----------|
| `trader` | Autonomous trading system | Yes |
| `golden-paws` | Pet photography platform | Yes |
| `momentum-trader` | Trading project | No |
| `nfl-fantasy` | NFL fantasy project | No |

Link format: `/projects/[slug]`

---

## 4. Content Voice Analysis

### Current Blog Post Voice
- Conversational with rhetorical questions ("Why Build a Portfolio Site?")
- Mix of strategic (why) and technical (what) information
- Friendly tone with forward-looking statements

### Project Voice Patterns
- Direct, technical openers
- Structured sections: Overview → Key Features → Technical Highlights
- Feature benefits in action-oriented language
- Emphasis on production-ready, reliability, and UX

### Experience Voice Patterns
- Bullet-point format with quantifiable metrics
- Action verbs: "Led," "Coached," "Designed," "Implemented"
- Results-oriented with specific outcomes

### Recommendation
Blend the conversational blog tone with more technical depth from project descriptions. Add structured sections and quantifiable details where applicable.

---

## 5. SEO Patterns

### Root Layout Metadata
- Title template: `%s | Dan Haight`
- Keywords: analytics, data science, machine learning, Python, leadership
- OpenGraph with site name, locale, type
- Twitter card: summary_large_image
- Robots: index and follow enabled
- RSS feed link

### Blog Post Dynamic Metadata
- Dynamic meta title and description from content
- OpenGraph with article type
- `publishedTime`, `modifiedTime`, and `tags`
- Custom OG image via `/api/og` endpoint (1200x630)
- `generateStaticParams()` for static generation

### SEO Strengths
- Skip-to-content link
- Proper time elements with dateTime attributes
- Aria labels for icons
- Semantic sections
- Static generation where possible

### SEO Gaps to Address
- Blog post keywords could be more specific
- Could add more internal linking
- Consider structured data (JSON-LD)

---

## 6. Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.6 | Framework with App Router |
| React | 19.2.3 | UI library |
| Velite | 0.3.1 | Content management |
| next-themes | 0.4.6 | Dark mode |
| Tailwind CSS | 4 | Styling |
| @vercel/og | - | Dynamic OG images |

---

## Recommendations for Blog Post

1. **Add code snippets** - Velite config, type-safe content access, MDX components
2. **Expand technical details** - Reading time calculation, related posts algorithm, OG image generation
3. **Add internal links** - Link to `/projects/trader` and `/projects/golden-paws` as examples
4. **Include diagram** - Architecture showing content flow: MDX → Velite → TypeScript types → React
5. **Match voice** - Keep conversational but add structured sections from project style
6. **SEO improvements** - More specific keywords, structured data consideration
