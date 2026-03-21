/**
 * Map a popularity score to a card height in pixels.
 * More popular movies get taller cards.
 */
export function popularityToHeight(popularity: number): number {
  const minHeight = 180;
  const maxHeight = 340;
  // Typical popularity ranges from 10 to 500+
  const clamped = Math.max(10, Math.min(popularity, 500));
  const normalized = (clamped - 10) / (500 - 10);
  return Math.round(minHeight + normalized * (maxHeight - minHeight));
}

/**
 * Format a number as currency (e.g., $1.2B, $340M, $12K)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

/**
 * Format runtime in hours and minutes
 */
export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Get month name from number (1-12)
 */
export function getMonthName(month: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return months[month - 1] || "";
}

/**
 * Get days in a month for a given year
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Get the day of week for the first of a month (0 = Sunday)
 */
export function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay();
}
