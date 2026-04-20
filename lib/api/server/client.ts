import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/lib/api/routes";

type FetchResult<T> = {
  data: T;
  status: number;
};

const buildCookieHeader = async () => {
  const store = await cookies();
  return store
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};

const fetchWithAuth = async <T>(url: string, init?: RequestInit): Promise<FetchResult<T>> => {
  const cookieHeader = await buildCookieHeader();
  const headers = new Headers(init?.headers);

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }
  headers.set("accept", "application/json");

  const doFetch = async () =>
    fetch(url, {
      ...init,
      headers,
      cache: "no-store",
    });

  let response = await doFetch();
  if (response.status === 401) {
    const refreshResponse = await fetch(API_ENDPOINTS.authRefresh(), {
      method: "POST",
      headers,
      cache: "no-store",
    });
    if (!refreshResponse.ok) {
      const data = (await refreshResponse.json()) as T;
      return { data, status: refreshResponse.status };
    }
    response = await doFetch();
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
};

export { fetchWithAuth };
export type { FetchResult };
