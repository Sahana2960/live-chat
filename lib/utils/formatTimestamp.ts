export function formatTimestamp(value: number | string | Date): string {
  const d = typeof value === "number" ? new Date(value) : typeof value === "string" ? new Date(value) : value;
  const now = new Date();

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const sameYear = d.getFullYear() === now.getFullYear();

  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  if (sameYear) {
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
