# Implementation Plan: Search Dialog Focus Trap

**Issue:** #66 - Add focus trap to search dialog
**Status:** Implemented
**Effort:** Low
**Priority:** Medium

## Overview

Add a focus trap to the search dialog to improve keyboard accessibility. When the dialog is open, Tab/Shift+Tab should cycle through focusable elements within the dialog rather than escaping to the page behind it.

## Current State

The search dialog (`src/components/search/search-dialog.tsx`) already has:
- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`)
- Escape key handling to close
- Arrow key navigation for results
- Focus automatically moves to input on open

Missing:
- Focus trap to prevent Tab from leaving the dialog
- Focus restoration to trigger element on close

## Implementation Approach

### Option A: Custom Focus Trap (Recommended)

Implement a lightweight custom focus trap hook. This avoids adding a dependency for a simple use case.

**Pros:**
- No new dependency
- Full control over behavior
- Small code footprint (~30 lines)

**Cons:**
- Must handle edge cases ourselves

### Option B: focus-trap-react Package

Use the established `focus-trap-react` package.

**Pros:**
- Battle-tested, handles edge cases
- Well-maintained

**Cons:**
- Adds a dependency for a single use case
- May be overkill for this simple dialog

**Decision:** Option A - Custom implementation is sufficient for this use case.

## Implementation Steps

### Phase 1: Create Focus Trap Hook

Create a reusable `useFocusTrap` hook:

```typescript
// src/hooks/use-focus-trap.ts
function useFocusTrap(containerRef: RefObject<HTMLElement>, isActive: boolean)
```

The hook will:
1. Query all focusable elements within the container
2. On Tab, move to next focusable element (wrap to first at end)
3. On Shift+Tab, move to previous (wrap to last at start)
4. Store the previously focused element when activated
5. Restore focus when deactivated

Focusable elements selector:
```typescript
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
```

### Phase 2: Integrate with SearchDialog

1. Add a ref to the dialog container div
2. Apply `useFocusTrap(dialogRef, open)`
3. Store trigger element ref for focus restoration

### Phase 3: Testing

- Tab cycles through: input → close button → results → input
- Shift+Tab cycles in reverse
- Focus returns to trigger element (search button) on close
- Works with dynamic result list

## Acceptance Criteria Mapping

| Criteria | Implementation |
|----------|----------------|
| Focus trapped within dialog when open | `useFocusTrap` hook intercepts Tab/Shift+Tab |
| Tab cycles through focusable elements | Wrap-around logic in hook |
| Focus returns to trigger on close | Store/restore `document.activeElement` |

## Files to Modify

1. **Create:** `src/hooks/use-focus-trap.ts` - New hook
2. **Modify:** `src/components/search/search-dialog.tsx` - Integrate hook

## Estimated Changes

- ~40 lines new code (hook)
- ~10 lines modifications to dialog

## Rollback Plan

Remove the hook import and ref from SearchDialog. No other components depend on this change.
