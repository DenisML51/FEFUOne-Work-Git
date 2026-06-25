import { apiFetch } from "@/lib/api";
import type { AuthUser } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/sso/me");
}

export function loginWithPassword(payload: {
  email: string;
  password: string;
}): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>("/auth/sso/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout(): Promise<unknown> {
  return apiFetch("/auth/sso/logout");
}

/** Full-page redirect to the Yandex / DVFU OAuth flow, mirroring the reference. */
export function loginWithYandex(): void {
  const url = new URL(`${BASE_URL}/auth/sso/login`, window.location.origin);
  url.searchParams.set("return_url", window.location.href);
  window.location.href = url.toString();
}
