"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  getUploadUrl,
  createDataset,
  type CreateDatasetPayload,
} from "@/lib/api/endpoints/normalization";
import { uploadToS3 } from "@/lib/storage";
import type { Dataset } from "@/lib/types/dataset";
import type { FileFormat } from "@/lib/types/normalize";

type RetryAction = "upload" | "process";

type UploadedSource = {
  file: File;
  fileType: FileFormat;
  s3Key: string;
  sourceChecksum?: string;
};

export type UploadPhase =
  | { phase: "idle" }
  | { phase: "selected"; file: File; error?: string }
  | { phase: "uploading"; file: File; progress: number }
  | { phase: "processing"; file: File }
  | { phase: "success"; dataset: Dataset }
  | { phase: "error"; message: string; file?: File; retryAction: RetryAction };

const SIZE_LIMITS: Record<string, number> = {
  csv:  150 * 1024 * 1024,
  xlsx: 15 * 1024 * 1024,
  json: 10 * 1024 * 1024,
};

function getExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function getFileType(ext: string): FileFormat | null {
  if (ext === "csv")  return "csv";
  if (ext === "xlsx") return "excel";
  if (ext === "json") return "json";
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

function toCreateDatasetPayload(uploadedSource: UploadedSource): CreateDatasetPayload {
  if (!uploadedSource.sourceChecksum) {
    throw new Error("Missing checksum for uploaded file");
  }

  return {
    name: getBaseName(uploadedSource.file.name),
    original_name: uploadedSource.file.name,
    file_type: uploadedSource.fileType,
    s3_key: uploadedSource.s3Key,
    size_mb: uploadedSource.file.size / (1024 * 1024),
    source_checksum: uploadedSource.sourceChecksum,
  };
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
  const uploadedSourceRef = useRef<UploadedSource | null>(null);

  useEffect(() => {
    const handlePopState = () => setState({ phase: "idle" });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      uploadedSourceRef.current = null;
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

  const submitUploadedSource = useCallback(
    async (uploadedSource: UploadedSource) => {
      try {
        setState({ phase: "processing", file: uploadedSource.file });

        if (!uploadedSource.sourceChecksum) {
          uploadedSource.sourceChecksum = await computeChecksum(uploadedSource.file);
        }

        const dataset = await createDataset(toCreateDatasetPayload(uploadedSource));

        uploadedSourceRef.current = uploadedSource;
        setState({ phase: "success", dataset });
        router.push(`/review/${dataset.id}`);
      } catch {
        uploadedSourceRef.current = uploadedSource;
        setState({
          phase: "error",
          message: t("errors.generic"),
          file: uploadedSource.file,
          retryAction: "process",
        });
      }
    },
    [router, t]
  );

  const startUpload = useCallback(
    async (file: File) => {
      const fileType = getFileType(getExtension(file));
      if (!fileType) {
        setState({
          phase: "error",
          message: t("errors.unsupportedType"),
          file,
          retryAction: "upload",
        });
        return;
      }

      uploadedSourceRef.current = null;

      try {
        setState({ phase: "uploading", file, progress: 0 });

        const checksumPromise = computeChecksum(file);
        const { url, s3_key } = await getUploadUrl(file.name);

        await uploadToS3(url, file, (progress) => {
          setState({ phase: "uploading", file, progress });
        });

        const uploadedSource: UploadedSource = { file, fileType, s3Key: s3_key };
        uploadedSourceRef.current = uploadedSource;
        uploadedSource.sourceChecksum = await checksumPromise;

        await submitUploadedSource(uploadedSource);
      } catch {
        const uploadSucceeded = uploadedSourceRef.current?.file === file;
        setState({
          phase: "error",
          message: t("errors.generic"),
          file,
          retryAction: uploadSucceeded ? "process" : "upload",
        });
      }
    },
    [submitUploadedSource, t]
  );

  const handleUpload = useCallback(async () => {
    if (state.phase !== "selected" || state.error) return;
    await startUpload(state.file);
  }, [startUpload, state]);

  const handleRetry = useCallback(async () => {
    if (state.phase !== "error" || !state.file) return;

    if (state.retryAction === "process") {
      const uploadedSource = uploadedSourceRef.current;
      if (uploadedSource?.file === state.file) {
        await submitUploadedSource(uploadedSource);
        return;
      }
    }

    await startUpload(state.file);
  }, [startUpload, state, submitUploadedSource]);

  const reset = useCallback(() => {
    uploadedSourceRef.current = null;
    setState({ phase: "idle" });
  }, []);

  return { state, isDragging, setIsDragging, inputRef, handleFile, handleUpload, handleRetry, reset };
}
