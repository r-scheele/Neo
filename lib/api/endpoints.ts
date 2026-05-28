export const apiEndpoints = {
  health: "health",
  meBootstrap: "me-bootstrap",
  setupBusiness: "setup-business",
  customers: "customers",
  orders: "orders",
  receipts: "receipts",
  followUps: "follow-ups",
  approvals: "approvals",
  whatsappSendMessage: "whatsapp-send-message",
  whatsappWebhook: "whatsapp-webhook",
  aiDrafts: "ai-drafts",
  mediaSignUpload: "media-sign-upload",
  clerkWebhook: "clerk-webhook",
} as const;

export type ApiEndpointName = keyof typeof apiEndpoints;
