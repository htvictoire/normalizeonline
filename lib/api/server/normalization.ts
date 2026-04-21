import { fetchWithAuth } from "./client";
import { API_ENDPOINTS } from "@/lib/api/routes";
import type { ApiResponse } from "@/lib/types/base";
import type { Dataset } from "@/lib/types/dataset";

export function getDatasetById(id: string) {
  return fetchWithAuth<ApiResponse<Dataset>>(API_ENDPOINTS.dataset(id));
}
