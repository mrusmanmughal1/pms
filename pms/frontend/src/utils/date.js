export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  // Example format: Sep 12, 2024
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
