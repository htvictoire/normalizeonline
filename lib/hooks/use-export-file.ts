"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getExportUrl } from "@/lib/api/endpoints/normalization";

export type ExportFormat = "csv" | "json" | "xlsx" | "parquet";

export type ExportErrorKey = "errorTimeout" | "errorFailed";

export type ExportState =
  | { phase: "idle" }
  | { phase: "preparing"; format: ExportFormat; progress: number }
  | { phase: "done"; format: ExportFormat }
  | { phase: "error"; errorKey: ExportErrorKey; format: ExportFormat };

// Estimated generation time per format in ms (used for fake progress only)
const EXPECTED_MS: Record<ExportFormat, number> = {
  parquet: 1_000,
  csv:     15_000,
  json:    20_000,
  xlsx:    45_000,
};

const POLL_INTERVAL_MS = 2_500;
const MAX_ATTEMPTS     = 72; // 3 min ceiling

export function useExportFile(datasetId: string) {
  const [state, setState] = useState<ExportState>({ phase: "idle" });
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const attemptsRef  = useRef(0);
  const formatRef    = useRef<ExportFormat>("csv");

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const triggerDownload = useCallback((url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setState({ phase: "done", format: formatRef.current });
  }, []);

  const poll = useCallback(() => {
    const fmt = formatRef.current;
    getExportUrl(datasetId, fmt)
      .then(({ url, filename }) => triggerDownload(url, filename))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          attemptsRef.current += 1;
          if (attemptsRef.current >= MAX_ATTEMPTS) {
            setState({ phase: "error", errorKey: "errorTimeout", format: fmt });
            return;
          }
          const elapsed   = Date.now() - startTimeRef.current;
          const progress  = Math.min(92, (elapsed / EXPECTED_MS[fmt]) * 100);
          setState({ phase: "preparing", format: fmt, progress });
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setState({ phase: "error", errorKey: "errorFailed", format: fmt });
        }
      });
  }, [datasetId, triggerDownload]);

  const startExport = useCallback((format: ExportFormat) => {
    clear();
    formatRef.current     = format;
    attemptsRef.current   = 0;
    startTimeRef.current  = Date.now();
    setState({ phase: "preparing", format, progress: 0 });
    poll();
  }, [clear, poll]);

  const reset = useCallback(() => {
    clear();
    setState({ phase: "idle" });
    attemptsRef.current = 0;
  }, [clear]);

  useEffect(() => () => clear(), [clear]);

  return { state, startExport, reset };
}
