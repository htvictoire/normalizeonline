"use client";

import { useTranslations } from "next-intl";
import type { OperationConfig, TraceMode } from "@/lib/types/normalize";
import FieldSelect from "./field-select";
import FieldNumber from "./field-number";
import FieldTokens from "./field-tokens";

type Props = {
  config: OperationConfig;
  onChange: (c: OperationConfig) => void;
};

export default function OperationConfigEditor({ config, onChange }: Props) {
  const t = useTranslations("review");

  const boolOptions = [
    { value: "true",  label: t("yes") },
    { value: "false", label: t("no") },
  ];
  const traceModeOptions = [
    { value: "full",   label: t("traceFull") },
    { value: "sparse", label: t("traceSparse") },
  ];

  function patch(fields: Partial<OperationConfig>) {
    onChange({ ...config, ...fields });
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldTokens
        label={t("nullTokens")}
        tokens={config.null_tokens}
        onChange={(v) => patch({ null_tokens: v })}
      />
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <FieldSelect label={t("traceMode")} value={config.trace_mode} options={traceModeOptions} onChange={(v) => patch({ trace_mode: v as TraceMode })} />
        <FieldSelect label={t("dropEmptyRows")} value={String(config.drop_empty_rows)} options={boolOptions} onChange={(v) => patch({ drop_empty_rows: v === "true" })} />
        <FieldSelect label={t("assignIndices")} value={String(config.assign_indices)} options={boolOptions} onChange={(v) => patch({ assign_indices: v === "true" })} />
        <FieldSelect label={t("emitRawRow")} value={String(config.emit_raw_row)} options={boolOptions} onChange={(v) => patch({ emit_raw_row: v === "true", full_raw_row: v === "true" ? config.full_raw_row : false })} />
        <FieldSelect label={t("fullRawRow")} value={String(config.full_raw_row)} options={boolOptions} onChange={(v) => patch({ full_raw_row: v === "true" })} disabled={!config.emit_raw_row} />
        <FieldSelect label={t("emitParseIssues")} value={String(config.emit_parse_issues)} options={boolOptions} onChange={(v) => patch({ emit_parse_issues: v === "true" })} />
        <FieldSelect label={t("includeUniqueRatio")} value={String(config.include_unique_ratio)} options={boolOptions} onChange={(v) => patch({ include_unique_ratio: v === "true" })} />
        <FieldSelect label={t("includeParseErrorCounts")} value={String(config.include_per_column_parse_error_counts)} options={boolOptions} onChange={(v) => patch({ include_per_column_parse_error_counts: v === "true" })} />
        <FieldSelect label={t("approximateUnique")} value={String(config.approximate_unique)} options={boolOptions} onChange={(v) => patch({ approximate_unique: v === "true" })} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <FieldNumber label={t("thresholdReady")} value={config.decision_thresholds.ready} step={0.5} min={0} max={100} onChange={(v) => patch({ decision_thresholds: { ...config.decision_thresholds, ready: v ?? config.decision_thresholds.ready } })} />
        <FieldNumber label={t("thresholdWarning")} value={config.decision_thresholds.warning} step={0.5} min={0} max={100} onChange={(v) => patch({ decision_thresholds: { ...config.decision_thresholds, warning: v ?? config.decision_thresholds.warning } })} />
      </div>
    </div>
  );
}
