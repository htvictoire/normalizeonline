import type { ColumnType } from "@/lib/types/normalize";

export const TYPE_COLOR: Record<ColumnType, { circle: string; badge: string }> = {
  string:        { circle: "bg-zinc-200 text-zinc-600",     badge: "bg-zinc-100 text-zinc-500" },
  identifier:    { circle: "bg-slate-200 text-slate-800",   badge: "bg-slate-100 text-slate-700" },
  boolean:       { circle: "bg-green-200 text-green-800",   badge: "bg-green-100 text-green-700" },
  integer:       { circle: "bg-blue-200 text-blue-800",     badge: "bg-blue-100 text-blue-700" },
  decimal:       { circle: "bg-blue-200 text-blue-800",     badge: "bg-blue-100 text-blue-700" },
  signed:        { circle: "bg-blue-200 text-blue-800",     badge: "bg-blue-100 text-blue-700" },
  currency:      { circle: "bg-indigo-200 text-indigo-800", badge: "bg-indigo-100 text-indigo-700" },
  percentage:    { circle: "bg-cyan-200 text-cyan-800",     badge: "bg-cyan-100 text-cyan-700" },
  accounting:    { circle: "bg-amber-200 text-amber-800",   badge: "bg-amber-100 text-amber-700" },
  date:          { circle: "bg-purple-200 text-purple-800", badge: "bg-purple-100 text-purple-700" },
  datetime:      { circle: "bg-violet-200 text-violet-800", badge: "bg-violet-100 text-violet-700" },
  time:          { circle: "bg-fuchsia-200 text-fuchsia-800", badge: "bg-fuchsia-100 text-fuchsia-700" },
  country_code:  { circle: "bg-sky-200 text-sky-800",       badge: "bg-sky-100 text-sky-700" },
  currency_code: { circle: "bg-teal-200 text-teal-800",     badge: "bg-teal-100 text-teal-700" },
  language_code: { circle: "bg-lime-200 text-lime-800",     badge: "bg-lime-100 text-lime-700" },
  categorical:   { circle: "bg-rose-200 text-rose-800",     badge: "bg-rose-100 text-rose-700" },
  email:         { circle: "bg-orange-200 text-orange-800", badge: "bg-orange-100 text-orange-700" },
  url:           { circle: "bg-yellow-200 text-yellow-800", badge: "bg-yellow-100 text-yellow-700" },
  ip_address:    { circle: "bg-emerald-200 text-emerald-800", badge: "bg-emerald-100 text-emerald-700" },
  phone:         { circle: "bg-pink-200 text-pink-800",     badge: "bg-pink-100 text-pink-700" },
};
