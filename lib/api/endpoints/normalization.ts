import { apiClient } from "../client";
import { API_ENDPOINTS } from "../routes";
import type { ApiResponse } from "../../types/base";
import type { UploadUrl, Dataset } from "../../types/dataset";
import type { InstanceConfig } from "../../types/normalize";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  return res.data.data;
}

export type CreateDatasetPayload = {
  name: string;
  original_name: string;
  file_type: string;
  s3_key: string;
  size_mb: number;
  source_checksum: string;
};

export function getUploadUrl(filename: string) {
  return apiClient
    .get<ApiResponse<UploadUrl>>(API_ENDPOINTS.uploadUrl(), { params: { filename } })
    .then(unwrap);
}

export function createDataset(payload: CreateDatasetPayload) {
  return apiClient
    .post<ApiResponse<Dataset>>(API_ENDPOINTS.datasets(), payload)
    .then(unwrap);
}

export function getDataset(id: string) {
  return apiClient
    .get<ApiResponse<Dataset>>(API_ENDPOINTS.dataset(id))
    .then(unwrap);
}

export function getDownloadUrl(id: string): Promise<{ url: string; filename: string }> {
  return apiClient
    .get<ApiResponse<{ url: string; filename: string }>>(API_ENDPOINTS.datasetDownload(id))
    .then(unwrap);
}

export function confirmDataset(id: string, confirmedConfig: InstanceConfig) {
  return apiClient
    .post<ApiResponse<Dataset>>(API_ENDPOINTS.datasetConfirm(id), { confirmed_config: confirmedConfig })
    .then(unwrap);
}
