const DAY_IN_MS = 1000 * 60 * 60 * 24;

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getTodayDateKey() {
  return formatDateKey(new Date());
}

export function addDays(dateKey: string, days: number) {
  const nextDate = parseDateKey(dateKey);
  nextDate.setDate(nextDate.getDate() + days);
  return formatDateKey(nextDate);
}

export function getNights(checkIn: string, checkOut: string) {
  const start = parseDateKey(checkIn).getTime();
  const end = parseDateKey(checkOut).getTime();
  return Math.max(0, Math.round((end - start) / DAY_IN_MS));
}

export function isDateInRange(checkIn: string, checkOut: string, dateKey: string) {
  return dateKey >= checkIn && dateKey < checkOut;
}

export function countOverlappingNights(
  checkIn: string,
  checkOut: string,
  rangeStart: string,
  rangeEnd: string,
) {
  const overlapStart = checkIn > rangeStart ? checkIn : rangeStart;
  const overlapEnd = checkOut < rangeEnd ? checkOut : rangeEnd;

  if (overlapStart >= overlapEnd) {
    return 0;
  }

  return getNights(overlapStart, overlapEnd);
}

export function getMonthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1, 12, 0, 0, 0);

  return {
    start: formatDateKey(start),
    end: formatDateKey(end),
    days: Math.round((end.getTime() - start.getTime()) / DAY_IN_MS),
    label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

export function formatStayLabel(checkIn: string, checkOut: string) {
  return `${checkIn} -> ${checkOut}`;
}
