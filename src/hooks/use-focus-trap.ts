"use client";

import * as React from "react";

// Base focusable element types
const FOCUSABLE_ELEMENTS = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
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

      const focusableElements = Array.from(
        activeContainer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
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
