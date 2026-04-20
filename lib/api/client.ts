import axios, { type AxiosInstance, type AxiosError } from "axios";
import { API_ENDPOINTS } from "./routes";

const refreshClient: AxiosInstance = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const apiClient: AxiosInstance = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      throw error;
    }

    const status = error.response?.status;

    const getPathname = (url: string) => {
      try { return new URL(url).pathname; } catch { return url; }
    };
    const requestPath = getPathname(originalRequest.url ?? "");
    const isAuthRefresh = requestPath === getPathname(API_ENDPOINTS.authRefresh());
    const isAuthLogin = requestPath.includes("/accounts/users/login/");
    const isAuthRegister = requestPath.includes("/accounts/users/register/");

    if (status === 401 && !isAuthRefresh && !isAuthLogin && !isAuthRegister) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshClient
          .post(API_ENDPOINTS.authRefresh(), {})
          .then(() => undefined)
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      if (refreshPromise) {
        await refreshPromise;
      }
      return apiClient.request(originalRequest);
    }

    throw error;
  }
);
