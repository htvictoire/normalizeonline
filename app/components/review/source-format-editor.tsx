"use client";

import { useTranslations } from "next-intl";
import type { SourceFormat, CsvSourceFormat, ExcelSourceFormat, HeaderMode } from "@/lib/types/normalize";
import FieldSelect from "./field-select";
import FieldText from "./field-text";
import FieldNumber from "./field-number";

type Props = {
  format: SourceFormat;
  onChange: (f: SourceFormat) => void;
};

function withCustom(options: { value: string; label: string }[], value: string) {
  return options.some((o) => o.value === value) ? options : [...options, { value, label: value }];
}

export default function SourceFormatEditor({ format, onChange }: Props) {
  const t = useTranslations("review");

  const headerOptions = [
    { value: "present", label: t("headerPresent") },
    { value: "absent",  label: t("headerAbsent") },
  ];
  const encodingOptions = [
    { value: "utf-8",     label: "UTF-8" },
    { value: "utf-8-sig", label: "UTF-8 BOM (utf-8-sig)" },
    { value: "latin-1",   label: "Latin-1" },
    { value: "utf-16",    label: "UTF-16" },
  ];
  const delimiterOptions = [
    { value: ",",  label: t("delimiterComma") },
    { value: ";",  label: t("delimiterSemicolon") },
    { value: "\t", label: t("delimiterTab") },
    { value: "|",  label: t("delimiterPipe") },
  ];

  function patchCsv(fields: Partial<CsvSourceFormat>) {
    onChange({ ...(format as CsvSourceFormat), ...fields });
  }
  function patchExcel(fields: Partial<ExcelSourceFormat>) {
    onChange({ ...(format as ExcelSourceFormat), ...fields });
  }

  if (format.format_type === "csv") {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <FieldSelect label={t("encoding")} value={format.encoding} options={encodingOptions} onChange={(v) => patchCsv({ encoding: v })} />
        <FieldSelect label={t("delimiter")} value={format.delimiter} options={withCustom(delimiterOptions, format.delimiter)} onChange={(v) => patchCsv({ delimiter: v })} />
        <FieldSelect
          label={t("header")}
          value={format.header_mode}
          options={headerOptions}
          onChange={(v) => patchCsv({ header_mode: v as HeaderMode, header_row_index: v === "absent" ? null : (format.header_row_index ?? 1) })}
        />
        <FieldNumber
          label={t("headerRow")}
          value={format.header_row_index}
          disabled={format.header_mode === "absent"}
          onChange={(v) => patchCsv({ header_row_index: v })}
          min={1}
          step={1}
        />
      </div>
    );
  }

  if (format.format_type === "excel") {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <FieldText label={t("sheet")} value={format.sheet_name ?? ""} onChange={(v) => patchExcel({ sheet_name: v || null })} />
        <FieldSelect
          label={t("header")}
          value={format.header_mode}
          options={headerOptions}
          onChange={(v) => patchExcel({ header_mode: v as HeaderMode, header_row_index: v === "absent" ? null : (format.header_row_index ?? 1) })}
        />
        <FieldNumber
          label={t("headerRow")}
          value={format.header_row_index}
          disabled={format.header_mode === "absent"}
          onChange={(v) => patchExcel({ header_row_index: v })}
          min={1}
          step={1}
        />
      </div>
    );
  }

  return <span className="text-sm text-ink-muted">JSON — {t("noSourceOptions")}</span>;
}
