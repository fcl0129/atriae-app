import type { SchedulingConfig } from "@/lib/digests/types";

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

function weekdayToIndex(name: string) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: weekdayToIndex(parts.weekday),
  };
}

function toUtcDate(timeZone: string, year: number, month: number, day: number, hour: number, minute: number) {
  const rawUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const zoned = getZonedParts(rawUtc, timeZone);

  const desired = Date.UTC(year, month - 1, day, hour, minute);
  const observed = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute);
  const diffMs = desired - observed;

  return new Date(rawUtc.getTime() + diffMs);
}

function parseHm(hm: string) {
  const [h, m] = hm.split(":").map(Number);
  return { h, m };
}

function dayMatches(config: SchedulingConfig, weekday: number, dayOfMonth: number) {
  if (config.cadence === "daily") return true;
  if (config.cadence === "weekly") return (config.days ?? []).includes(weekday);
  if (config.cadence === "monthly") return (config.dayOfMonth ?? 1) === dayOfMonth;

  const customDays = config.days ?? [];
  if (customDays.length > 0) return customDays.includes(weekday);
  return true;
}

export function computeNextRunAt(config: SchedulingConfig, from = new Date()): Date {
  const { h, m } = parseHm(config.time);
  const startLocal = getZonedParts(from, config.timezone);

  for (let i = 0; i < 370; i += 1) {
    const probeUtc = new Date(Date.UTC(startLocal.year, startLocal.month - 1, startLocal.day + i, h, m));
    const probeLocal = getZonedParts(probeUtc, config.timezone);

    if (!dayMatches(config, probeLocal.weekday, probeLocal.day)) {
      continue;
    }

    if (config.cadence === "custom" && config.intervalDays && i % config.intervalDays !== 0) {
      continue;
    }

    const candidate = toUtcDate(config.timezone, probeLocal.year, probeLocal.month, probeLocal.day, h, m);
    if (candidate > from) {
      return candidate;
    }
  }

  return new Date(from.getTime() + 24 * 60 * 60 * 1000);
}

export function getUpcomingSends(config: SchedulingConfig, count: number, from = new Date()) {
  const runs: Date[] = [];
  let cursor = from;

  for (let i = 0; i < count; i += 1) {
    const next = computeNextRunAt(config, cursor);
    runs.push(next);
    cursor = new Date(next.getTime() + 60 * 1000);
  }

  return runs;
}
