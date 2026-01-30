/**
 * Format a date string for display.
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options (defaults to full date)
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    ...options,
    timeZone: "UTC",
  });
}

/**
 * Format a date string with short month (e.g., "Jan 30, 2026")
 */
export function formatDateShort(dateString: string): string {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
