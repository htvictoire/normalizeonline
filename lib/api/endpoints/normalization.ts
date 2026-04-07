import { apiClient } from "../client";
import { API_ENDPOINTS } from "../routes";
import type { ApiResponse } from "../../types/base";
import type { UploadUrl, Dataset } from "../../types/dataset";

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
    .then((res) => res.data.data);
}

export function createDataset(payload: CreateDatasetPayload) {
  return apiClient
    .post<ApiResponse<Dataset>>(API_ENDPOINTS.datasets(), payload)
    .then((res) => res.data);
}
