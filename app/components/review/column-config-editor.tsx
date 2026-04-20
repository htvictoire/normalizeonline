"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ColumnConfig, GroupingStyle } from "@/lib/types/normalize";
import FieldSelect from "./field-select";
import FieldTokens from "./field-tokens";

export const TYPE_COLOR: Record<string, { circle: string; badge: string }> = {
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

type ColumnType = ColumnConfig["type"];

export function defaultConfig(newType: ColumnType, from: ColumnConfig): ColumnConfig {
  const sep = "thousand_separator" in from ? from.thousand_separator : "";
  const dec = "decimal_separator" in from ? from.decimal_separator : ".";
  const grp: GroupingStyle = "grouping_style" in from ? from.grouping_style : "western";
  const ldp = "allow_leading_decimal_point" in from ? from.allow_leading_decimal_point : false;

  switch (newType) {
    case "string":     return { type: "string" };
    case "boolean":    return { type: "boolean", true_tokens: ["true", "yes", "1"], false_tokens: ["false", "no", "0"] };
    case "date":       return { type: "date", date_format: "%Y-%m-%d" };
    case "integer":    return { type: "integer", thousand_separator: sep, grouping_style: grp };
    case "decimal":    return { type: "decimal",    decimal_separator: dec, thousand_separator: sep, grouping_style: grp, allow_leading_decimal_point: ldp };
    case "currency":   return { type: "currency",   decimal_separator: dec, thousand_separator: sep, grouping_style: grp, allow_leading_decimal_point: ldp };
    case "percentage": return { type: "percentage", decimal_separator: dec, thousand_separator: sep, grouping_style: grp, allow_leading_decimal_point: ldp };
    case "signed":     return { type: "signed",     decimal_separator: dec, thousand_separator: sep, grouping_style: grp, allow_leading_decimal_point: ldp, positive_markers: [],     negative_markers: ["-"],       parentheses_as_negative: false };
    case "accounting": return { type: "accounting", decimal_separator: dec, thousand_separator: sep, grouping_style: grp, allow_leading_decimal_point: ldp, positive_markers: ["DR"], negative_markers: ["-", "CR"], parentheses_as_negative: true  };
  }
}

const DATE_FORMAT_OPTIONS = [
  { value: "%Y-%m-%d", label: "%Y-%m-%d  (2024-01-15)" },
  { value: "%Y/%m/%d", label: "%Y/%m/%d  (2024/01/15)" },
  { value: "%m/%d/%Y", label: "%m/%d/%Y  (01/15/2024)" },
  { value: "%d/%m/%Y", label: "%d/%m/%Y  (15/01/2024)" },
  { value: "%m-%d-%Y", label: "%m-%d-%Y  (01-15-2024)" },
  { value: "%d-%m-%Y", label: "%d-%m-%Y  (15-01-2024)" },
];

const DECIMAL_SEP_OPTIONS = [
  { value: ".", label: ". (period)  1.50" },
  { value: ",", label: ", (comma)  1,50" },
];

const THOUSAND_SEP_OPTIONS = [
  { value: "",  label: "None  1000000" },
  { value: ",", label: ", (comma)  1,000,000" },
  { value: ".", label: ". (period)  1.000.000" },
  { value: "'", label: "' (apostrophe)  1'000'000" },
];

function withCustom(options: { value: string; label: string }[], value: string) {
  return options.some((o) => o.value === value) ? options : [...options, { value, label: value }];
}

export function TypeSelector({ config, onChange }: { config: ColumnConfig; onChange: (c: ColumnConfig) => void }) {
  const t = useTranslations("review");
  const [open, setOpen] = useState(false);
  const colors = TYPE_COLOR[config.type] ?? TYPE_COLOR.string;
  const types: ColumnType[] = ["string", "boolean", "integer", "decimal", "currency", "percentage", "signed", "accounting", "date"];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${colors.badge}`}
      >
        {config.type}
        <svg viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 pt-1">
          <div className="min-w-[9rem] rounded-xl border border-border bg-canvas p-1.5 shadow-[0_24px_50px_-35px_rgba(15,30,53,0.7)]">
            {types.map((type) => {
              const tc = TYPE_COLOR[type] ?? TYPE_COLOR.string;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => { onChange(defaultConfig(type, config)); setOpen(false); }}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    type === config.type ? `${tc.badge} font-medium` : "text-ink-muted hover:bg-brand/5 hover:text-ink"
                  }`}
                >
                  {t(`type_${type}`)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConfigEditor({ config, onChange }: { config: ColumnConfig; onChange: (c: ColumnConfig) => void }) {
  const t = useTranslations("review");

  const groupingOptions = [
    { value: "western", label: t("groupingWestern") },
    { value: "indian",  label: t("groupingIndian") },
  ];
  const boolOptions = [
    { value: "true",  label: t("yes") },
    { value: "false", label: t("no") },
  ];

  function patch(fields: Partial<ColumnConfig>) {
    onChange({ ...config, ...fields } as ColumnConfig);
  }

  switch (config.type) {
    case "string":
      return null;

    case "boolean":
      return (
        <div className="mt-3 flex flex-col gap-2">
          <FieldTokens label={t("trueTokens")} tokens={config.true_tokens} onChange={(v) => patch({ true_tokens: v } as never)} />
          <FieldTokens label={t("falseTokens")} tokens={config.false_tokens} onChange={(v) => patch({ false_tokens: v } as never)} />
        </div>
      );

    case "date":
      return (
        <div className="mt-3">
          <FieldSelect label={t("dateFormat")} value={config.date_format} options={withCustom(DATE_FORMAT_OPTIONS, config.date_format)} onChange={(v) => patch({ date_format: v } as never)} />
        </div>
      );

    case "integer":
      return (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <FieldSelect label={t("thousands")} value={config.thousand_separator} options={withCustom(THOUSAND_SEP_OPTIONS, config.thousand_separator)} onChange={(v) => patch({ thousand_separator: v } as never)} />
          <FieldSelect label={t("groupingStyle")} value={config.grouping_style} options={groupingOptions} onChange={(v) => patch({ grouping_style: v as GroupingStyle } as never)} />
        </div>
      );

    case "decimal":
    case "currency":
    case "percentage":
      return (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <FieldSelect label={t("decimal")} value={config.decimal_separator} options={withCustom(DECIMAL_SEP_OPTIONS, config.decimal_separator)} onChange={(v) => patch({ decimal_separator: v } as never)} />
          <FieldSelect label={t("thousands")} value={config.thousand_separator} options={withCustom(THOUSAND_SEP_OPTIONS, config.thousand_separator)} onChange={(v) => patch({ thousand_separator: v } as never)} />
          <FieldSelect label={t("groupingStyle")} value={config.grouping_style} options={groupingOptions} onChange={(v) => patch({ grouping_style: v as GroupingStyle } as never)} />
          <FieldSelect label={t("allowLeadingDecimal")} value={String(config.allow_leading_decimal_point)} options={boolOptions} onChange={(v) => patch({ allow_leading_decimal_point: v === "true" } as never)} />
        </div>
      );

    case "signed":
    case "accounting":
      return (
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <FieldSelect label={t("decimal")} value={config.decimal_separator} options={withCustom(DECIMAL_SEP_OPTIONS, config.decimal_separator)} onChange={(v) => patch({ decimal_separator: v } as never)} />
            <FieldSelect label={t("thousands")} value={config.thousand_separator} options={withCustom(THOUSAND_SEP_OPTIONS, config.thousand_separator)} onChange={(v) => patch({ thousand_separator: v } as never)} />
            <FieldSelect label={t("groupingStyle")} value={config.grouping_style} options={groupingOptions} onChange={(v) => patch({ grouping_style: v as GroupingStyle } as never)} />
            <FieldSelect label={t("allowLeadingDecimal")} value={String(config.allow_leading_decimal_point)} options={boolOptions} onChange={(v) => patch({ allow_leading_decimal_point: v === "true" } as never)} />
            <FieldSelect label={t("parenthesesNegative")} value={String(config.parentheses_as_negative)} options={boolOptions} onChange={(v) => patch({ parentheses_as_negative: v === "true" } as never)} />
          </div>
          <FieldTokens label={t("positive")} tokens={config.positive_markers} onChange={(v) => patch({ positive_markers: v } as never)} />
          <FieldTokens label={t("negative")} tokens={config.negative_markers} onChange={(v) => patch({ negative_markers: v } as never)} />
        </div>
      );
  }
}
