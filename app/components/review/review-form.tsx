"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { InstanceConfig, ColumnConfig, SuggestionDisplay } from "@/lib/types/normalize";
import ColumnRow from "./column-row";
import ConfirmBar from "./confirm-bar";
import SourceFormatEditor from "./source-format-editor";
import OperationConfigEditor from "./operation-config-editor";
import SampleTable from "./sample-table";

type Props = {
  datasetId: string;
  initialConfig: InstanceConfig;
  suggestionDisplay: SuggestionDisplay;
};

function isDiff(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function SectionHeader({
  title, isDirty, open, onToggle, onRestore,
}: {
  title: string;
  isDirty: boolean;
  open: boolean;
  onToggle: () => void;
  onRestore: () => void;
}) {
  const t = useTranslations("review");
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${isDirty ? "bg-brand" : "bg-transparent"}`} />
        <span className="text-sm font-semibold text-ink">{title}</span>
        {isDirty && (
          <button type="button" onClick={onRestore} className="text-xs text-ink-muted transition-colors hover:text-brand">
            {t("restoreDefaults")}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-border hover:text-ink"
        aria-label={open ? t("collapseSection") : t("expandSection")}
      >
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}

export default function ReviewForm({ datasetId, initialConfig, suggestionDisplay }: Props) {
  const t = useTranslations("review");
  const [config, setConfig] = useState<InstanceConfig>(initialConfig);
  const [showSource, setShowSource] = useState(true);
  const [showOperation, setShowOperation] = useState(true);
  const [showSample, setShowSample] = useState(true);

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) { e.preventDefault(); }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const columnKeys = Object.keys(config.column_config);
  const isSourceDirty = isDiff(config.source_format, initialConfig.source_format);
  const isOpDirty = isDiff(config.operation_config, initialConfig.operation_config);

  const dirtyColumnCount = useMemo(
    () => columnKeys.filter((k) => isDiff(config.column_config[k], initialConfig.column_config[k])).length,
    [config.column_config, initialConfig.column_config, columnKeys]
  );

  const totalChanges = (isSourceDirty ? 1 : 0) + (isOpDirty ? 1 : 0) + dirtyColumnCount;

  function updateColumn(key: string, colConfig: ColumnConfig) {
    setConfig((prev) => ({ ...prev, column_config: { ...prev.column_config, [key]: colConfig } }));
  }

  return (
    <>
      <div className="mt-6 rounded-2xl border border-border px-6 py-5">
        <SectionHeader
          title={t("sourceFormat")}
          isDirty={isSourceDirty}
          open={showSource}
          onToggle={() => setShowSource((v) => !v)}
          onRestore={() => setConfig((prev) => ({ ...prev, source_format: initialConfig.source_format }))}
        />
        {showSource && (
          <div className="mt-4">
            <SourceFormatEditor
              format={config.source_format}
              onChange={(f) => setConfig((prev) => ({ ...prev, source_format: f }))}
            />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-border px-6 py-5">
        <SectionHeader
          title={t("operationConfig")}
          isDirty={isOpDirty}
          open={showOperation}
          onToggle={() => setShowOperation((v) => !v)}
          onRestore={() => setConfig((prev) => ({ ...prev, operation_config: initialConfig.operation_config }))}
        />
        {showOperation && (
          <div className="mt-4">
            <OperationConfigEditor
              config={config.operation_config}
              onChange={(c) => setConfig((prev) => ({ ...prev, operation_config: c }))}
            />
          </div>
        )}
      </div>

      {suggestionDisplay.sample_rows.length > 1 && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <div className="px-6 py-5">
            <SectionHeader
              title={t("sampleData")}
              isDirty={false}
              open={showSample}
              onToggle={() => setShowSample((v) => !v)}
              onRestore={() => {}}
            />
          </div>
          {showSample && <SampleTable sampleRows={suggestionDisplay.sample_rows.slice(0, 11)} />}
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {dirtyColumnCount > 0 && <div className="h-1.5 w-1.5 rounded-full bg-brand" />}
            <span className="text-sm font-semibold text-ink">
              {t("columns")}
              <span className="ml-1.5 rounded-full bg-border px-1.5 py-0.5 text-xs font-medium text-ink-muted">
                {columnKeys.length}
              </span>
            </span>
          </div>
          {dirtyColumnCount > 0 && (
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, column_config: { ...initialConfig.column_config } }))}
              className="text-xs text-ink-muted transition-colors hover:text-brand"
            >
              {t("resetAllColumns")}
            </button>
          )}
        </div>

        <div className="mt-3 divide-y divide-border rounded-2xl border border-border px-6">
          {columnKeys.map((key, i) => {
            const display = suggestionDisplay.columns[key];
            const colConfig = config.column_config[key];
            const suggested = initialConfig.column_config[key];
            if (!display || !colConfig || !suggested) return null;
            return (
              <ColumnRow
                key={key}
                columnKey={key}
                index={i}
                display={display}
                config={colConfig}
                suggestedConfig={suggested}
                rowCount={suggestionDisplay.row_count}
                onChange={(c) => updateColumn(key, c)}
              />
            );
          })}
        </div>
      </div>

      <ConfirmBar datasetId={datasetId} currentConfig={config} changeCount={totalChanges} />
    </>
  );
}
