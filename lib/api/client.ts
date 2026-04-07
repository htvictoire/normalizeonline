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
    const isAuthRefresh = originalRequest.url?.includes("/accounts/users/refresh/");
    const isAuthLogin = originalRequest.url?.includes("/accounts/users/login/");
    const isAuthRegister = originalRequest.url?.includes("/accounts/users/register/");

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

      try {
        if (refreshPromise) {
          await refreshPromise;
        }
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        throw refreshError;
      }
    }

    throw error;
  }
);
