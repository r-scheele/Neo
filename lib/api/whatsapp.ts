import type { createApiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import { isRecord } from "./response";
import type { ApiResult } from "./types";

type ApiClient = ReturnType<typeof createApiClient>;

export type BackendWhatsAppTone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export type BackendWhatsAppStatus = {
  businessAccountIdLast4?: string;
  canReceive: boolean;
  canSend: boolean;
  lastCheckedAt: string;
  messageSource: string;
  phoneNumberIdLast4?: string;
  setupState: "connected" | "needs_configuration";
  statusLabel: string;
};

export type BackendWhatsAppLabel = {
  text: string;
  tone: BackendWhatsAppTone;
};

export type BackendWhatsAppConversation = {
  assignmentLabel: string;
  customerId?: string;
  customerInitials: string;
  customerName: string;
  id: string;
  labels: readonly BackendWhatsAppLabel[];
  latestSnippet: string;
  lastMessageAt?: string;
  presenceTone: "urgent" | "online" | "idle";
  statusLabel: string;
  statusTone: BackendWhatsAppTone;
  timestamp: string;
  unreadCount: number;
};

export type BackendWhatsAppMessage = {
  body: string;
  id: string;
  kind: "text" | "receipt";
  sender: "customer" | "staff";
  status: string;
  time: string;
};

export type BackendWhatsAppConversationDetail = {
  aiDraft: null;
  assignmentLabel: string;
  chips: readonly BackendWhatsAppLabel[];
  contextItems: readonly {
    detail: string;
    meta: string;
    title: string;
  }[];
  customerId: string;
  customerInitials: string;
  customerName: string;
  emptyNote: string;
  id: string;
  messages: readonly BackendWhatsAppMessage[];
  statusLabel: string;
  subtitle: string;
  summary: readonly {
    detail: string;
    meta: string;
    title: string;
  }[];
};

export function getWhatsAppStatus(
  client: ApiClient,
): Promise<ApiResult<{ status: BackendWhatsAppStatus }>> {
  return client.request({
    path: `${apiEndpoints.whatsappSendMessage}/status`,
    parseData: parseStatusEnvelope,
  });
}

export function getWhatsAppConversations(
  client: ApiClient,
): Promise<ApiResult<{ conversations: readonly BackendWhatsAppConversation[] }>> {
  return client.request({
    path: `${apiEndpoints.whatsappSendMessage}/conversations`,
    parseData: parseConversationsEnvelope,
  });
}

export function getWhatsAppConversation(
  client: ApiClient,
  conversationId: string,
): Promise<ApiResult<{ conversation: BackendWhatsAppConversationDetail }>> {
  return client.request({
    path: `${apiEndpoints.whatsappSendMessage}/conversations/${encodeURIComponent(conversationId)}`,
    parseData: parseConversationDetailEnvelope,
  });
}

export function sendWhatsAppMessage(
  client: ApiClient,
  conversationId: string,
  body: string,
): Promise<ApiResult<{ conversation: BackendWhatsAppConversationDetail }>> {
  return client.request({
    body: { body },
    method: "POST",
    path: `${apiEndpoints.whatsappSendMessage}/conversations/${encodeURIComponent(conversationId)}/messages`,
    parseData: parseConversationDetailEnvelope,
  });
}

function parseStatusEnvelope(data: unknown): { status: BackendWhatsAppStatus } {
  const record = requiredRecord(data);

  return {
    status: parseStatus(record.status),
  };
}

function parseStatus(value: unknown): BackendWhatsAppStatus {
  const record = requiredRecord(value);

  return {
    businessAccountIdLast4: optionalString(record.businessAccountIdLast4),
    canReceive: requiredBoolean(record.canReceive),
    canSend: requiredBoolean(record.canSend),
    lastCheckedAt: requiredString(record.lastCheckedAt),
    messageSource: requiredString(record.messageSource),
    phoneNumberIdLast4: optionalString(record.phoneNumberIdLast4),
    setupState: parseUnion(record.setupState, setupStates),
    statusLabel: requiredString(record.statusLabel),
  };
}

function parseConversationsEnvelope(
  data: unknown,
): { conversations: readonly BackendWhatsAppConversation[] } {
  const record = requiredRecord(data);

  return {
    conversations: requiredArray(record.conversations).map(parseConversation),
  };
}

function parseConversation(value: unknown): BackendWhatsAppConversation {
  const record = requiredRecord(value);

  return {
    assignmentLabel: requiredString(record.assignmentLabel),
    customerId: optionalString(record.customerId),
    customerInitials: requiredString(record.customerInitials),
    customerName: requiredString(record.customerName),
    id: requiredString(record.id),
    labels: requiredArray(record.labels).map(parseLabel),
    latestSnippet: requiredString(record.latestSnippet),
    lastMessageAt: optionalString(record.lastMessageAt),
    presenceTone: parseUnion(record.presenceTone, presenceTones),
    statusLabel: requiredString(record.statusLabel),
    statusTone: parseUnion(record.statusTone, backendWhatsAppTones),
    timestamp: requiredString(record.timestamp),
    unreadCount: requiredNumber(record.unreadCount),
  };
}

function parseConversationDetailEnvelope(
  data: unknown,
): { conversation: BackendWhatsAppConversationDetail } {
  const record = requiredRecord(data);

  return {
    conversation: parseConversationDetail(record.conversation),
  };
}

function parseConversationDetail(
  value: unknown,
): BackendWhatsAppConversationDetail {
  const record = requiredRecord(value);

  return {
    aiDraft: null,
    assignmentLabel: requiredString(record.assignmentLabel),
    chips: requiredArray(record.chips).map(parseLabel),
    contextItems: requiredArray(record.contextItems).map(parseDetailItem),
    customerId: requiredString(record.customerId),
    customerInitials: requiredString(record.customerInitials),
    customerName: requiredString(record.customerName),
    emptyNote: requiredString(record.emptyNote),
    id: requiredString(record.id),
    messages: requiredArray(record.messages).map(parseMessage),
    statusLabel: requiredString(record.statusLabel),
    subtitle: requiredString(record.subtitle),
    summary: requiredArray(record.summary).map(parseDetailItem),
  };
}

function parseLabel(value: unknown): BackendWhatsAppLabel {
  const record = requiredRecord(value);

  return {
    text: requiredString(record.text),
    tone: parseUnion(record.tone, backendWhatsAppTones),
  };
}

function parseDetailItem(value: unknown) {
  const record = requiredRecord(value);

  return {
    detail: requiredString(record.detail),
    meta: requiredString(record.meta),
    title: requiredString(record.title),
  };
}

function parseMessage(value: unknown): BackendWhatsAppMessage {
  const record = requiredRecord(value);

  return {
    body: requiredString(record.body),
    id: requiredString(record.id),
    kind: parseUnion(record.kind, messageKinds),
    sender: parseUnion(record.sender, messageSenders),
    status: requiredString(record.status),
    time: requiredString(record.time),
  };
}

function requiredRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error("Expected response object.");
  }

  return value;
}

function requiredArray(value: unknown): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected response array.");
  }

  return value;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Expected response string.");
  }

  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function requiredNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Expected response number.");
  }

  return value;
}

function requiredBoolean(value: unknown): boolean {
  if (typeof value !== "boolean") {
    throw new Error("Expected response boolean.");
  }

  return value;
}

function parseUnion<const TValues extends readonly string[]>(
  value: unknown,
  values: TValues,
): TValues[number] {
  if (typeof value === "string" && values.includes(value)) {
    return value;
  }

  throw new Error("Expected known response value.");
}

const backendWhatsAppTones = [
  "success",
  "warning",
  "error",
  "info",
  "neutral",
] as const;
const messageKinds = ["text", "receipt"] as const;
const messageSenders = ["customer", "staff"] as const;
const presenceTones = ["urgent", "online", "idle"] as const;
const setupStates = ["connected", "needs_configuration"] as const;
