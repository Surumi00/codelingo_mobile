import axios, { type InternalAxiosRequestConfig } from "axios";

import { clearToken, getToken } from "./token-store";
import type { ApiErrorBody } from "./types";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const AUTH_FREE_PATHS = ["/auth/login", "/auth/register"];

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: (() => void) | null): void {
  onUnauthorized = callback;
}

export function getHttpStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function isAuthFreePath(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  const path = url.split("?")[0];

  return AUTH_FREE_PATHS.some((freePath) => path.endsWith(freePath));
}

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const status = getHttpStatus(error);
    const url = axios.isAxiosError(error) ? error.config?.url : undefined;

    if (status === 401 && !isAuthFreePath(url)) {
      await clearToken();
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
