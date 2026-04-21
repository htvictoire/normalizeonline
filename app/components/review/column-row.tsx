"use client";

import { useTranslations } from "next-intl";
import type { ColumnConfig, SuggestedColumnDisplay } from "@/lib/types/normalize";
import { TYPE_COLOR } from "@/lib/constants/column-type-colors";
import { TypeSelector, ConfigEditor } from "./column-config-editor";
import { fillColor, countColor, colLetter, isDiff } from "@/lib/utils";

type Props = {
  columnKey: string;
  index: number;
  display: SuggestedColumnDisplay;
  config: ColumnConfig;
  suggestedConfig: ColumnConfig;
  rowCount: number;
  onChange: (config: ColumnConfig) => void;
};

export default function ColumnRow({ columnKey, index, display, config, suggestedConfig, rowCount, onChange }: Props) {
  const t = useTranslations("review");

  const isDirty = isDiff(config, suggestedConfig);
  const fillPct = rowCount > 0 ? (display.counts.non_null_count / rowCount) * 100 : 0;
  const fillLabel = fillPct === 100 ? "100%" : `${fillPct.toFixed(1)}%`;
  const nullCount = display.counts.null_count;
  const nullishCount = display.counts.nullish_count;
  const extraNullish = nullishCount > nullCount ? nullishCount - nullCount : 0;
  const nonNullishCount = display.counts.non_nullish_count;
  const showNonNullish = nonNullishCount !== display.counts.non_null_count;
  const colors = TYPE_COLOR[config.type];
  const label = display.label || columnKey;

  return (
    <div className="flex items-stretch gap-4 py-5">
      <div className="flex shrink-0 items-start pt-0.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${colors.circle} ${isDirty ? "ring-2 ring-offset-1 ring-orange-400" : ""}`}>
          {colLetter(index)}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-medium text-ink">{label}</span>
            <TypeSelector config={config} onChange={onChange} />
            {isDirty && (
              <button
                type="button"
                onClick={() => onChange(suggestedConfig)}
                className="text-xs text-orange-400 transition-colors hover:text-orange-500"
              >
                {t("restoreDefaults")}
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 tabular-nums">
            {nullCount > 0 && (
              <span className="text-xs text-ink-muted">
                <span className={countColor(nullCount, rowCount)}>{nullCount}</span> {t("nullsWord")}
              </span>
            )}
            {extraNullish > 0 && (
              <span className="text-xs text-ink-muted">
                <span className={countColor(extraNullish, rowCount)}>{extraNullish}</span> {t("nullishWord")}
              </span>
            )}
            {showNonNullish && (
              <span className="text-xs text-ink-muted">
                <span className="text-amber-400">{nonNullishCount}</span> {t("nonNullishWord")}
              </span>
            )}
            <span className={`text-sm ${fillColor(fillPct)}`}>{fillLabel}</span>
          </div>
        </div>

        {display.sample_values.length > 0 && (
          <div className="mt-2.5 flex w-full overflow-x-auto border-y border-border [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400">
            {display.sample_values.map((v, i) => (
              <div
                key={`${v}-${i}`}
                className="shrink-0 border-r border-border px-3 py-1.5 font-mono text-xs text-ink-muted last:border-r-0"
              >
                {v}
              </div>
            ))}
          </div>
        )}

        <ConfigEditor config={config} onChange={onChange} />
      </div>
    </div>
  );
}
