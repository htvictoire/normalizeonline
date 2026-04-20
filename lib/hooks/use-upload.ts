"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getUploadUrl, createDataset } from "@/lib/api/endpoints/normalization";
import { uploadToS3 } from "@/lib/storage";
import type { Dataset } from "@/lib/types/dataset";

export type UploadPhase =
  | { phase: "idle" }
  | { phase: "selected"; file: File; error?: string }
  | { phase: "uploading"; file: File; progress: number }
  | { phase: "processing"; file: File }
  | { phase: "success"; dataset: Dataset }
  | { phase: "error"; message: string; file?: File };

const SIZE_LIMITS: Record<string, number> = {
  csv:  50 * 1024 * 1024,
  xlsx: 15 * 1024 * 1024,
  json: 10 * 1024 * 1024,
};

export function getExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

export function getFileType(ext: string): "CSV" | "XLSX" | "JSON" | null {
  if (ext === "csv")  return "CSV";
  if (ext === "xlsx") return "XLSX";
  if (ext === "json") return "JSON";
  return null;
}

type ValidationError =
  | { key: "errors.unsupportedType" }
  | { key: "errors.tooLarge"; type: string; limit: number };

function getValidationError(file: File): ValidationError | null {
  const ext = getExtension(file);
  if (!getFileType(ext)) return { key: "errors.unsupportedType" };
  const limit = SIZE_LIMITS[ext];
  if (file.size > limit) {
    return { key: "errors.tooLarge", type: ext.toUpperCase(), limit: Math.round(limit / (1024 * 1024)) };
  }
  return null;
}

function getBaseName(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

async function computeChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useUpload() {
  const t = useTranslations("home.uploadPad");
  const router = useRouter();
  const [state, setState] = useState<UploadPhase>({ phase: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.phase === "success") {
      router.push(`/review/${state.dataset.id}`);
    }
  }, [state, router]);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = getValidationError(file);
      const error = validationError
        ? validationError.key === "errors.tooLarge"
          ? t("errors.tooLarge", { type: validationError.type, limit: validationError.limit })
          : t("errors.unsupportedType")
        : undefined;
      setState({ phase: "selected", file, error });
    },
    [t]
  );

  const handleUpload = useCallback(async () => {
    if (state.phase !== "selected" || state.error) return;

    const file = state.file;
    const fileType = getFileType(getExtension(file));
    if (!fileType) {
      setState({ phase: "error", message: t("errors.unsupportedType"), file });
      return;
    }

    try {
      setState({ phase: "uploading", file, progress: 0 });

      const uploadUrlPromise = getUploadUrl(file.name);
      const checksumPromise = computeChecksum(file);

      const s3UploadPromise = uploadUrlPromise.then(({ url }) =>
        uploadToS3(url, file, (progress) => {
          setState({ phase: "uploading", file, progress });
        })
      );

      const [{ s3_key }, source_checksum] = await Promise.all([
        uploadUrlPromise,
        checksumPromise,
        s3UploadPromise,
      ]);

      setState({ phase: "processing", file });

      const dataset = await createDataset({
        name: getBaseName(file.name),
        original_name: file.name,
        file_type: fileType,
        s3_key,
        size_mb: file.size / (1024 * 1024),
        source_checksum,
      });

      setState({ phase: "success", dataset });
    } catch {
      setState({ phase: "error", message: t("errors.generic"), file });
    }
  }, [state, t]);

  const reset = useCallback(() => setState({ phase: "idle" }), []);

  return { state, isDragging, setIsDragging, inputRef, handleFile, handleUpload, reset };
}
