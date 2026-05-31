import { formatDuration } from "date-fns/formatDuration";
import { intervalToDuration } from "date-fns/intervalToDuration";

export function shortDuration(
  start: Date | number,
  end?: Date | number | null,
): string | null {
  if (!end) return null;
  const str = formatDuration(intervalToDuration({ start, end }));

  return str
    .replace(/ seconds?/g, "s")
    .replace(/ minutes?/g, "m")
    .replace(/ hours?/g, "h")
    .replace(/ days?/g, "d")
    .replace(/ weeks?/g, "w")
    .replace(/ months?/g, "mo")
    .replace(/ years?/g, "y");
}
