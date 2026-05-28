import { apiFailure, apiSuccess } from "./response";
import type { ApiFailure, ApiResult } from "./types";

export type ApiConfig = {
  baseUrl: string;
};

export function resolveApiConfig(
  baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL,
): ApiResult<ApiConfig> {
  const trimmedBaseUrl = baseUrl?.trim() ?? "";

  if (!trimmedBaseUrl) {
    return apiFailure(
      "configuration_error",
      "missing_api_base_url",
      "Neo backend is not configured yet.",
      0,
    );
  }

  const parsedUrl = parseHttpUrl(trimmedBaseUrl);

  if (!parsedUrl.ok) {
    return parsedUrl;
  }

  return apiSuccess({
    baseUrl: parsedUrl.data.href.replace(/\/+$/, ""),
  });
}

function parseHttpUrl(value: string): ApiResult<URL> {
  try {
    const parsed = new URL(value);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return invalidApiBaseUrl();
    }

    return apiSuccess(parsed);
  } catch {
    return invalidApiBaseUrl();
  }
}

function invalidApiBaseUrl(): ApiFailure {
  return apiFailure(
    "configuration_error",
    "invalid_api_base_url",
    "Neo backend is not configured correctly.",
    0,
  );
}
