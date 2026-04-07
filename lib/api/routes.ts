const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001/api/";

export const API_ENDPOINTS = {
  base: API_BASE,
  authRefresh: () => `${API_BASE}accounts/users/refresh/`,
  uploadUrl: () => `${API_BASE}normalization/datasets/upload-url/`,
  datasets: () => `${API_BASE}normalization/datasets/`,
  dataset: (id: string) => `${API_BASE}normalization/datasets/${id}/`,
} as const;
