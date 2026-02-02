"use client";

import * as React from "react";

// Base focusable element types (excluding tabindex=-1 which removes from tab order)
const FOCUSABLE_ELEMENTS = [
  'button:not([disabled]):not([tabindex="-1"])',
  '[href]:not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
];

// Common exclusions for hidden elements
const HIDDEN_EXCLUSIONS = ':not([hidden]):not([aria-hidden="true"])';

// Build the complete selector by applying exclusions to each element type
const FOCUSABLE_SELECTOR = FOCUSABLE_ELEMENTS.map(
  (el) => el + HIDDEN_EXCLUSIONS
).join(", ");

/**
 * Safely gets the currently focused element if it's an HTMLElement.
 */
function getActiveHTMLElement(): HTMLElement | null {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    return active;
  }
  return null;
}

/**
 * Checks if an element is still attached to the DOM and focusable.
 */
function canFocus(element: HTMLElement | null): element is HTMLElement {
  return element !== null && element.isConnected && typeof element.focus === "function";
}

/**
 * Checks if an element is visually visible (not display:none or visibility:hidden).
 */
function isVisible(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  // Check computed style directly - handles all cases including position:fixed
  return style.visibility !== "hidden" && style.display !== "none";
}

/**
 * Gets all focusable elements within a container that are actually visible.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  // Filter out elements that are visually hidden with CSS
  return elements.filter(isVisible);
}

/**
 * Traps focus within a container element when active.
 * Tab/Shift+Tab cycle through focusable elements.
 * Restores focus to the previously focused element when deactivated.
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
  isActive: boolean
) {
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Store the currently focused element (only if it's an HTMLElement)
    previousActiveElement.current = getActiveHTMLElement();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const activeContainer = containerRef.current;
      if (!activeContainer) return;

      const focusableElements = getFocusableElements(activeContainer);
      if (focusableElements.length === 0) {
        // No focusable elements - prevent Tab from escaping
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements.at(0);
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      const currentActive = getActiveHTMLElement();
      const isInFocusableList = !!currentActive && focusableElements.includes(currentActive);

      if (e.shiftKey) {
        // Shift+Tab: wrap to last if on first, or go to last if not in list
        if (currentActive === firstElement || !isInFocusableList) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: wrap to first if on last, or go to first if not in list
        if (currentActive === lastElement || !isInFocusableList) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown);

    // Cleanup: remove listener and restore focus on deactivation or unmount
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Only restore focus if element is still in the DOM
      if (canFocus(previousActiveElement.current)) {
        previousActiveElement.current.focus();
      }
      previousActiveElement.current = null;
    };
  }, [isActive, containerRef]);
}
