import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export function formatMessageTimestamp(date: Date): string {
  return format(date, "h:mm a");
}

export function formatDayDivider(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatShortDate(date: Date): string {
  return format(date, "MMM d");
}

export function formatFullDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
