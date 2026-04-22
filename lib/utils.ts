const FILL_THRESHOLDS = [
  { min: 100, cls: "text-green-600 font-medium" },
  { min: 90,  cls: "text-green-500"             },
  { min: 70,  cls: "text-ink-muted"             },
  { min: 50,  cls: "text-amber-500"             },
  { min: 0,   cls: "text-red-500 font-medium"   },
];

const COUNT_THRESHOLDS = [
  { min: 0.2,  cls: "text-red-500"   },
  { min: 0.05, cls: "text-amber-500" },
  { min: 0,    cls: "text-amber-400" },
];

const COUNT_BADGE_THRESHOLDS = [
  { min: 0.2,  cls: "border-red-200 bg-red-50"     },
  { min: 0.05, cls: "border-amber-200 bg-amber-50" },
  { min: 0,    cls: "border-amber-100 bg-amber-50/60" },
];

const COL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function fmt(n: number): string {
  return n.toLocaleString();
}

export function pct(r: number): string {
  if (r >= 1) return "100%";
  if (r <= 0) return "0%";
  return `${(r * 100).toFixed(1)}%`;
}

export function fillColor(p: number): string {
  return FILL_THRESHOLDS.find((t) => p >= t.min)!.cls;
}

export function countColor(count: number, total: number): string {
  if (total === 0) return "text-ink-muted";
  const r = count / total;
  return COUNT_THRESHOLDS.find((t) => r >= t.min)!.cls;
}

export function countBadgeColor(count: number, total: number): string {
  if (total === 0) return "border-border bg-border/60";
  const r = count / total;
  return COUNT_BADGE_THRESHOLDS.find((t) => r >= t.min)!.cls;
}

export function colLetter(i: number): string {
  let r = ""; let n = i;
  do { r = COL_LETTERS[n % 26] + r; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return r;
}

export function isDiff(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

export function getBoolOptions(t: (k: string) => string) {
  return [
    { value: "true",  label: t("yes") },
    { value: "false", label: t("no") },
  ];
}
