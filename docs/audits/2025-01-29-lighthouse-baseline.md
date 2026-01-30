# Lighthouse Audit Baseline - 2025-01-29

## Summary

All pages exceed the 90+ performance target. Minor issues identified for accessibility and SEO.

## Scores by Page

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Home | 96 | 100 | 100 | 91 |
| About | 98 | 100 | 100 | 100 |
| Experience | 98 | 100 | 100 | 100 |
| Projects | 98 | 98 | 100 | 100 |
| Blog | 98 | 98 | 100 | 100 |
| Contact | 98 | 100 | 100 | 100 |

## Issues Identified

### SEO (Home Page - 91)

**Issue:** Link text "Learn More" is not descriptive
- Location: Hero section link to /about
- Impact: Search engines can't understand link purpose
- Fix: Change to more descriptive text like "Learn more about my experience"

### Accessibility (Projects & Blog Pages - 98)

**Issue:** Heading order skips from H1 to H3
- Location: Project cards and blog post cards use `<h3>` directly
- Impact: Screen readers may find navigation confusing
- Fix: Either add an H2 section header or change cards to use H2

## Core Web Vitals

All pages show good Core Web Vitals:
- LCP (Largest Contentful Paint): Good
- FID/INP (First Input Delay / Interaction to Next Paint): Good
- CLS (Cumulative Layout Shift): Good

## Recommendations

1. Fix heading hierarchy on Projects and Blog pages
2. Improve link text on Home page
3. Both fixes are minor and should bring scores to 100

## Audit Configuration

- Lighthouse version: 13.0.1
- Mode: Navigation (default)
- Device: Mobile simulation
- Network: Simulated slow 4G
