import { isRecord } from "./http.ts";

export type AiDraftTone = "direct" | "friendly" | "professional" | "warm";
export type AiDraftReplyLength = "balanced" | "detailed" | "short";
export type AiDraftCustomerAddress = "first-name" | "ma-sir";
export type AiDraftRiskCategory =
  | "complaint"
  | "discount"
  | "none"
  | "payment"
  | "refund";

export type AiDraftPreferences = {
  approvalGuardrails: {
    complaints: boolean;
    discounts: boolean;
    receipts: boolean;
    refunds: boolean;
  };
  customerAddress: AiDraftCustomerAddress;
  replyLength: AiDraftReplyLength;
  tone: AiDraftTone;
  useNigerianEnglish: boolean;
};

export type DraftRoutingInput = {
  confidence: number;
  preferences: AiDraftPreferences;
  riskCategory: AiDraftRiskCategory;
  riskReasons: readonly string[];
};

export type DraftRouting = {
  approvalRequired: boolean;
  reasonCode: "low_confidence" | "sensitive_guardrail" | "none";
  riskCategory: AiDraftRiskCategory;
};

const defaultPreferences: AiDraftPreferences = {
  approvalGuardrails: {
    complaints: true,
    discounts: true,
    receipts: true,
    refunds: true,
  },
  customerAddress: "ma-sir",
  replyLength: "balanced",
  tone: "warm",
  useNigerianEnglish: true,
};

export function parseAiDraftPreferences(value: unknown): AiDraftPreferences {
  if (!isRecord(value)) {
    return defaultPreferences;
  }

  const guardrails = isRecord(value.approvalGuardrails)
    ? value.approvalGuardrails
    : {};

  return {
    approvalGuardrails: {
      complaints: booleanValue(
        guardrails.complaints,
        defaultPreferences.approvalGuardrails.complaints,
      ),
      discounts: booleanValue(
        guardrails.discounts,
        defaultPreferences.approvalGuardrails.discounts,
      ),
      receipts: booleanValue(
        guardrails.receipts,
        defaultPreferences.approvalGuardrails.receipts,
      ),
      refunds: booleanValue(
        guardrails.refunds,
        defaultPreferences.approvalGuardrails.refunds,
      ),
    },
    customerAddress: parseUnion(
      value.customerAddress,
      ["first-name", "ma-sir"],
      defaultPreferences.customerAddress,
    ),
    replyLength: parseUnion(
      value.replyLength,
      ["balanced", "detailed", "short"],
      defaultPreferences.replyLength,
    ),
    tone: parseUnion(
      value.tone,
      ["direct", "friendly", "professional", "warm"],
      defaultPreferences.tone,
    ),
    useNigerianEnglish: booleanValue(
      value.useNigerianEnglish,
      defaultPreferences.useNigerianEnglish,
    ),
  };
}

export function classifyDraftRouting(input: DraftRoutingInput): DraftRouting {
  if (input.confidence < 70) {
    return {
      approvalRequired: true,
      reasonCode: "low_confidence",
      riskCategory: input.riskCategory,
    };
  }

  if (guardrailEnabled(input.preferences, input.riskCategory)) {
    return {
      approvalRequired: true,
      reasonCode: "sensitive_guardrail",
      riskCategory: input.riskCategory,
    };
  }

  return {
    approvalRequired: false,
    reasonCode: "none",
    riskCategory: input.riskCategory,
  };
}

export function confidenceBand(confidence: number): "high" | "low" | "medium" {
  if (confidence < 50) {
    return "low";
  }

  if (confidence < 80) {
    return "medium";
  }

  return "high";
}

export function safeDraftPreview(value: unknown, maxLength = 160): string {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

export function normalizeRiskCategory(value: unknown): AiDraftRiskCategory {
  if (
    value === "complaint" ||
    value === "discount" ||
    value === "payment" ||
    value === "refund"
  ) {
    return value;
  }

  return "none";
}

export function normalizeConfidence(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 50;
  }

  if (value <= 1) {
    return Math.round(Math.max(0, value) * 100);
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function guardrailEnabled(
  preferences: AiDraftPreferences,
  riskCategory: AiDraftRiskCategory,
): boolean {
  if (riskCategory === "complaint") {
    return preferences.approvalGuardrails.complaints;
  }

  if (riskCategory === "discount") {
    return preferences.approvalGuardrails.discounts;
  }

  if (riskCategory === "payment") {
    return preferences.approvalGuardrails.receipts;
  }

  if (riskCategory === "refund") {
    return preferences.approvalGuardrails.refunds;
  }

  return false;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseUnion<const TValues extends readonly string[]>(
  value: unknown,
  values: TValues,
  fallback: TValues[number],
): TValues[number] {
  return typeof value === "string" && values.includes(value) ? value : fallback;
}
