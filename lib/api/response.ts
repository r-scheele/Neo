import type {
  ApiDataParser,
  ApiErrorCategory,
  ApiFailure,
  ApiResult,
  ApiSuccess,
} from "./types";

const fallbackMessage = "Neo could not complete that request. Please try again.";

const retryableCategories = new Set<ApiErrorCategory>([
  "network_error",
  "rate_limited",
  "integration_unavailable",
  "whatsapp_disconnected",
  "ai_generation_failed",
  "receipt_image_failed",
]);

export function apiSuccess<TData>(
  data: TData,
  status = 200,
): ApiSuccess<TData> {
  return {
    ok: true,
    data,
    error: null,
    status,
  };
}

export function apiFailure(
  category: ApiErrorCategory,
  code: string,
  message = fallbackMessage,
  status = 400,
  details: Record<string, unknown> = {},
): ApiFailure {
  return {
    ok: false,
    data: null,
    status,
    error: {
      category,
      code: normalizeErrorCode(code),
      message: normalizeMessage(message),
      details,
      retryable: retryableCategories.has(category),
    },
  };
}

export function parseApiEnvelope<TData>(
  body: unknown,
  parseData: ApiDataParser<TData>,
  status = 200,
): ApiResult<TData> {
  if (!isRecord(body)) {
    return invalidResponse(status);
  }

  if (body.error === null && "data" in body) {
    try {
      return apiSuccess(parseData(body.data), status);
    } catch {
      return invalidResponse(status);
    }
  }

  if (body.data === null && isRecord(body.error)) {
    return parseFailureEnvelope(body.error, status);
  }

  return invalidResponse(status);
}

export function parseJsonText(text: string): ApiResult<unknown> {
  if (!text.trim()) {
    return invalidResponse();
  }

  try {
    return apiSuccess(JSON.parse(text) as unknown);
  } catch {
    return invalidResponse();
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseRecordData(data: unknown): Record<string, unknown> {
  if (!isRecord(data)) {
    throw new Error("Expected response data object.");
  }

  return data;
}

export function errorCategoryFromCode(code: string): ApiErrorCategory {
  const normalized = normalizeErrorCode(code);

  if (normalized.includes("permission") || normalized.includes("forbidden")) {
    return "permission_denied";
  }

  if (normalized.includes("auth") || normalized.includes("unauthorized")) {
    return "auth_error";
  }

  if (normalized.includes("validation") || normalized.includes("invalid_input")) {
    return "validation_error";
  }

  if (normalized.includes("not_found")) {
    return "not_found";
  }

  if (normalized.includes("conflict")) {
    return "conflict";
  }

  if (normalized.includes("rate")) {
    return "rate_limited";
  }

  if (normalized.includes("whatsapp")) {
    return "whatsapp_disconnected";
  }

  if (normalized.includes("ai")) {
    return "ai_generation_failed";
  }

  if (normalized.includes("receipt_image")) {
    return "receipt_image_failed";
  }

  if (normalized.includes("receipt_unreadable")) {
    return "receipt_unreadable";
  }

  if (normalized.includes("payment")) {
    return "payment_verification_required";
  }

  if (normalized.includes("audit")) {
    return "audit_write_failed";
  }

  if (normalized.includes("deferred") || normalized.includes("unavailable")) {
    return "integration_unavailable";
  }

  return "invalid_response";
}

function parseFailureEnvelope(
  error: Record<string, unknown>,
  status: number,
): ApiFailure {
  const code =
    typeof error.code === "string" && error.code.trim()
      ? error.code
      : "invalid_response";
  const message =
    typeof error.message === "string" && error.message.trim()
      ? error.message
      : fallbackMessage;
  const details = isRecord(error.details) ? error.details : {};

  return apiFailure(
    errorCategoryFromCode(code),
    code,
    message,
    status,
    details,
  );
}

function invalidResponse(status = 502): ApiFailure {
  return apiFailure(
    "invalid_response",
    "invalid_response",
    "Neo received an unexpected backend response.",
    status,
  );
}

function normalizeErrorCode(code: string): string {
  const normalized = code.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");

  return normalized || "invalid_response";
}

function normalizeMessage(message: string): string {
  return message.trim() || fallbackMessage;
}
