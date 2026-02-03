import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export function formatSmartTime(dateString) {
  if (!dateString) return "";
  const now = dayjs();
  const date = dayjs(dateString);

  if (date.isSame(now, "day")) {
    const diffInSeconds = now.diff(date, "second");
    if (diffInSeconds < 60) {
      return `${Math.max(0, diffInSeconds)}s`;
    }
    
    const diffInHours = now.diff(date, "hour");
    if (diffInHours < 1) {
      const minutes = Math.max(0, now.diff(date, "minute"));
      return `${minutes}m`;
    }
    return `${diffInHours}h`;
  }

  if (date.isSame(now.subtract(1, "day"), "day")) {
    return "Hier";
  }

  return date.format("D MMM");
}

export function formatFullDate(dateString) {
  if (!dateString) return "";
  return dayjs(dateString).format("D MMMM YYYY");
}
export function formatTime(dateString) {
  if (!dateString) return "";
  return dayjs(dateString).format("HH:mm");
}
