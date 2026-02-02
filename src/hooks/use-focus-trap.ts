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
  // offsetParent is null for display:none elements (except for body/html)
  if (element.offsetParent === null && element.tagName !== "BODY") {
    return false;
  }
  const style = getComputedStyle(element);
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
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements.at(0);
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      const currentActive = getActiveHTMLElement();

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (currentActive === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (currentActive === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    /**
     * Handles focus escaping the container (e.g., programmatic focus changes).
     * Brings focus back to the first focusable element if it escapes.
     */
    function handleFocusIn(e: FocusEvent) {
      const activeContainer = containerRef.current;
      if (!activeContainer) return;

      const target = e.target as HTMLElement;
      // If focus moved outside the container, bring it back
      if (!activeContainer.contains(target)) {
        const focusableElements = getFocusableElements(activeContainer);
        const firstFocusable = focusableElements[0];
        if (firstFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    // Listen on document for focus escaping the container
    document.addEventListener("focusin", handleFocusIn);

    // Cleanup: remove listeners and restore focus on deactivation or unmount
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      // Only restore focus if element is still in the DOM
      if (canFocus(previousActiveElement.current)) {
        previousActiveElement.current.focus();
      }
      previousActiveElement.current = null;
    };
  }, [isActive, containerRef]);
}
