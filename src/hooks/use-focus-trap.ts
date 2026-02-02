"use client";

import * as React from "react";

// Selector for focusable elements, excluding hidden and aria-hidden elements
const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([hidden]):not([aria-hidden="true"]), ' +
  '[href]:not([hidden]):not([aria-hidden="true"]), ' +
  'input:not([disabled]):not([hidden]):not([aria-hidden="true"]), ' +
  'select:not([disabled]):not([hidden]):not([aria-hidden="true"]), ' +
  'textarea:not([disabled]):not([hidden]):not([aria-hidden="true"]), ' +
  '[tabindex]:not([tabindex="-1"]):not([disabled]):not([hidden]):not([aria-hidden="true"])';

/**
 * Traps focus within a container element when active.
 * Tab/Shift+Tab cycle through focusable elements.
 * Restores focus to the previously focused element when deactivated.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
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

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown);

    // Cleanup: remove listener and restore focus on deactivation or unmount
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    };
  }, [isActive, containerRef]);
}
