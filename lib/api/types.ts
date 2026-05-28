export type ApiErrorCategory =
  | "network_error"
  | "auth_error"
  | "permission_denied"
  | "validation_error"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "integration_unavailable"
  | "whatsapp_disconnected"
  | "ai_generation_failed"
  | "receipt_image_failed"
  | "receipt_unreadable"
  | "payment_verification_required"
  | "audit_write_failed"
  | "invalid_response"
  | "configuration_error";

export type ApiError = {
  category: ApiErrorCategory;
  code: string;
  message: string;
  details: Record<string, unknown>;
  retryable: boolean;
};

export type ApiSuccess<TData> = {
  ok: true;
  data: TData;
  error: null;
  status: number;
};

export type ApiFailure = {
  ok: false;
  data: null;
  error: ApiError;
  status: number;
};

export type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

export type ApiDataParser<TData> = (data: unknown) => TData;

export type ApiTokenProvider = () => Promise<string | null>;

export type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";
