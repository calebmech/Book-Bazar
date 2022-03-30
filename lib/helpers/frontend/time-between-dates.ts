type TimePeriod = {
  name: string;
  factor: number;
};

// factor is the number needed to go to next time period
const timePeriods: TimePeriod[] = [
  { name: "second", factor: 60 },
  { name: "minute", factor: 60 },
  { name: "hour", factor: 24 },
  { name: "day", factor: 7 },
  { name: "week", factor: 4 },
];

export function timeSinceDateString(date: Date): string {
  // initial difference in seconds
  let diff = (new Date().getTime() - date.getTime()) / 1000;

  for (const tp of timePeriods) {
    if (diff < tp.factor) {
      return `${Math.round(diff)} ${tp.name}${
        Math.round(diff) > 1 ? "s" : ""
      } ago`;
    } else {
      diff /= tp.factor;
    }
  }

  // After 4 weeks just use the date
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
