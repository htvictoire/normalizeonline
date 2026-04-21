import type { ColumnType } from "@/lib/types/normalize";

export const TYPE_COLOR: Record<ColumnType, { circle: string; badge: string }> = {
  string:     { circle: "bg-zinc-200 text-zinc-600",     badge: "bg-zinc-100 text-zinc-500" },
  boolean:    { circle: "bg-green-200 text-green-800",   badge: "bg-green-100 text-green-700" },
  integer:    { circle: "bg-blue-200 text-blue-800",     badge: "bg-blue-100 text-blue-700" },
  decimal:    { circle: "bg-blue-200 text-blue-800",     badge: "bg-blue-100 text-blue-700" },
  signed:     { circle: "bg-blue-200 text-blue-800",     badge: "bg-blue-100 text-blue-700" },
  currency:   { circle: "bg-indigo-200 text-indigo-800", badge: "bg-indigo-100 text-indigo-700" },
  percentage: { circle: "bg-cyan-200 text-cyan-800",     badge: "bg-cyan-100 text-cyan-700" },
  accounting: { circle: "bg-amber-200 text-amber-800",   badge: "bg-amber-100 text-amber-700" },
  date:       { circle: "bg-purple-200 text-purple-800", badge: "bg-purple-100 text-purple-700" },
};
