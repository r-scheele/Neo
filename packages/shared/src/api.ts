export type ApiSuccess<T> = {
  data: T;
  error: null;
};

export type ApiFailure = {
  data: null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ApiRoute =
  | "/health"
  | "/me-bootstrap"
  | "/setup-business"
  | "/orders"
  | "/receipts"
  | "/approvals"
  | "/follow-ups"
  | "/customers"
  | "/ai-drafts"
  | "/whatsapp-send-message";
