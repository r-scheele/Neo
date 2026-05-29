export const neoErrorCodes = {
  authError: "auth_error",
  forbidden: "forbidden",
  networkError: "network_error",
  permissionDenied: "permission_denied",
  receiptImageFailed: "receipt_image_failed",
  validationError: "validation_error",
  whatsappDisconnected: "whatsapp_disconnected",
} as const;

export type NeoErrorCode =
  (typeof neoErrorCodes)[keyof typeof neoErrorCodes];
