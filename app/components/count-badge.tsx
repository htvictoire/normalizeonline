"use client";

import type { ReactNode } from "react";

type Props = {
  value: ReactNode;
  label: string;
  badgeClassName: string;
  valueClassName: string;
};

export default function CountBadge({ value, label, badgeClassName, valueClassName }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-ink-muted ${badgeClassName}`}
    >
      <span className={`font-bold ${valueClassName}`}>{value}</span>
      <span>{label}</span>
    </span>
  );
}
