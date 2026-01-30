# Accessibility Audit Baseline - 2025-01-29

## Summary

Lighthouse accessibility scores are excellent (98-100). Two minor issues identified via axe-core (embedded in Lighthouse).

## Scores by Page

| Page | Accessibility Score | Status |
|------|---------------------|--------|
| Home | 100 | Pass |
| About | 100 | Pass |
| Experience | 100 | Pass |
| Projects | 98 | Minor issue |
| Blog | 98 | Minor issue |
| Contact | 100 | Pass |

## Issues Identified

### 1. Heading Order (WCAG 1.3.1 - Level A)

**Pages Affected:** Projects, Blog

**Issue:** Heading elements skip from H1 directly to H3
- Projects page: `<h1>Projects</h1>` → `<h3>` in ProjectCard
- Blog page: `<h1>Blog</h1>` → `<h3>` in BlogPostCard

**Impact:** Moderate - Screen reader users may find navigation confusing

**Fix:** Add H2 section header before card grids on listing pages

### 2. Non-Descriptive Link Text (SEO, also accessibility concern)

**Page Affected:** Home

**Issue:** "Learn More" link text is generic
- Location: Hero section button linking to /about

**Impact:** Low - Screen readers announce "Learn More" without context

**Fix:** Change to "Learn more about my experience" or similar

## Existing Accessibility Features (Verified)

- Skip link present in layout
- ARIA labels on theme toggle and navigation
- `aria-current="page"` for active nav links
- `aria-expanded`/`aria-controls` on mobile menu
- Semantic HTML throughout (`header`, `main`, `footer`, `nav`, `article`, `time`)
- Focus-visible styles defined
- External links have `aria-label` on icon-only links
- `aria-hidden="true"` on decorative icons

## Manual Testing Checklist

- [x] Keyboard navigation works on all interactive elements
- [x] Focus states visible on all interactive elements
- [x] Skip link functional
- [x] Dark mode maintains contrast ratios
- [ ] Heading order sequential (needs fix)
- [x] Images have alt text (N/A - no images yet)
- [x] Form inputs have labels (contact form verified)

## Recommendations

1. Add `<h2>` section headers on Projects and Blog pages
2. Make "Learn More" link text more descriptive
3. Consider adding visible external link indicators (currently icon-only)

## Testing Tools

- Lighthouse 13.0.1 (includes axe-core)
- Manual keyboard navigation testing
