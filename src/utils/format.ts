/**
 * Converts a snake_case string to Title Case.
 * e.g. "emergency_state_declared" -> "Emergency State Declared"
 */
export function formatLabel(str: string) {
  if (!str) return "";
  // replace any _ with space
  const spaced = str.replace(/_/g, " ");
  const words = spaced.split(" ");
  return words
    .map((word, i) => (i === 0 ? capitalizeFirstLetter(word) : word))
    .join(" ");
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Returns a human-readable relative time string.
 * e.g. "2 hours ago", "3 days ago"
 */
export function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours >= 24) {
    return `${Math.floor(diffHours / 24)}d ago`;
  }
  return `${Math.max(diffHours, 1)}h ago`;
}
