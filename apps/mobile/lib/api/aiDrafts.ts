import type { createApiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import { isRecord } from "./response";
import type { ApiResult } from "./types";

type ApiClient = ReturnType<typeof createApiClient>;

export type AiDraftPreferencesPayload = {
  approvalGuardrails: {
    complaints: boolean;
    discounts: boolean;
    receipts: boolean;
    refunds: boolean;
  };
  customerAddress: "first-name" | "ma-sir";
  replyLength: "balanced" | "detailed" | "short";
  tone: "direct" | "friendly" | "professional" | "warm";
  useNigerianEnglish: boolean;
};

export type BackendAiDraft = {
  approvalId?: string;
  approvalRequired: boolean;
  body: string;
  confidence: "high" | "low" | "medium";
  conversationId: string;
  customerName: string;
  guardrail: string;
  id: string;
  reasonCode: string;
  riskCategory: "complaint" | "discount" | "none" | "payment" | "refund";
  riskReasons: readonly string[];
  sourceChips: readonly string[];
  status: string;
  suggestedAction: string;
};

export function requestAiDraft(
  client: ApiClient,
  conversationId: string,
  preferences: AiDraftPreferencesPayload,
): Promise<ApiResult<{ draft: BackendAiDraft }>> {
  return client.request({
    body: { preferences },
    method: "POST",
    path: `${apiEndpoints.aiDrafts}/conversations/${encodeURIComponent(conversationId)}`,
    parseData: parseAiDraftEnvelope,
  });
}

function parseAiDraftEnvelope(data: unknown): { draft: BackendAiDraft } {
  const record = requiredRecord(data);

  return {
    draft: parseAiDraft(record.draft),
  };
}

function parseAiDraft(value: unknown): BackendAiDraft {
  const record = requiredRecord(value);

  return {
    approvalId: optionalString(record.approvalId),
    approvalRequired: requiredBoolean(record.approvalRequired),
    body: requiredString(record.body),
    confidence: parseUnion(record.confidence, ["high", "low", "medium"] as const),
    conversationId: requiredString(record.conversationId),
    customerName: requiredString(record.customerName),
    guardrail: requiredString(record.guardrail),
    id: requiredString(record.id),
    reasonCode: requiredString(record.reasonCode),
    riskCategory: parseUnion(
      record.riskCategory,
      ["complaint", "discount", "none", "payment", "refund"] as const,
    ),
    riskReasons: requiredArray(record.riskReasons).map(requiredString),
    sourceChips: requiredArray(record.sourceChips).map(requiredString),
    status: requiredString(record.status),
    suggestedAction: requiredString(record.suggestedAction),
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
