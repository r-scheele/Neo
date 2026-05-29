import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createNeoPersistStorage, storageKeys } from "@/lib/storage";

export const setupStepIds = [
  "business-profile",
  "business-type",
  "whatsapp-status",
  "ai-personality",
  "payment-rules",
  "delivery-zones",
  "product-basics",
] as const;

export type SetupStepId = (typeof setupStepIds)[number];

export type BusinessTypeId =
  | "fashion"
  | "tailor"
  | "food"
  | "logistics"
  | "real-estate"
  | "beauty-hair"
  | "services"
  | "other";

export type ReplyTone = "warm" | "professional" | "direct" | "friendly";
export type ReplyLength = "short" | "balanced" | "detailed";
export type CustomerAddress = "ma-sir" | "first-name";
export type GuardrailId = "receipts" | "refunds" | "discounts" | "complaints";

export type AiPersonalitySettings = {
  approvalGuardrails: Record<GuardrailId, boolean>;
  customerAddress: CustomerAddress;
  replyLength: ReplyLength;
  tone: ReplyTone;
  useNigerianEnglish: boolean;
};

export type BusinessProfileDraft = {
  businessCategory: string;
  businessName: string;
  cityArea: string;
};

export type PaymentMethodId =
  | "bank-transfer"
  | "payment-link"
  | "pay-on-delivery";

export type ReceiptCheckId = "bank-alert" | "amount-match" | "payer-name";

export type PaymentRulesSettings = {
  activeMethods: Record<PaymentMethodId, boolean>;
  managersCanConfirm: boolean;
  manualReceiptReview: boolean;
  requiredChecks: Record<ReceiptCheckId, boolean>;
  showDeliveryMethod: boolean;
};

type SetupState = {
  aiPersonalitySettings: AiPersonalitySettings;
  businessProfileDraft: BusinessProfileDraft;
  businessType: BusinessTypeId | null;
  completedStepIds: readonly SetupStepId[];
  deliveryZoneCount: number;
  paymentRulesSettings: PaymentRulesSettings;
  productCount: number;
};

type SetupActions = {
  markStepComplete: (stepId: SetupStepId) => void;
  resetSetupState: () => void;
  setAiPersonalitySettings: (settings: AiPersonalitySettings) => void;
  setBusinessProfileDraft: (draft: BusinessProfileDraft) => void;
  setBusinessType: (businessType: BusinessTypeId) => void;
  setDeliveryZoneCount: (count: number) => void;
  setPaymentRulesSettings: (settings: PaymentRulesSettings) => void;
  setProductCount: (count: number) => void;
};

type SetupPersistedState = SetupState;

export type SetupStore = SetupState & SetupActions;

export const defaultAiPersonalitySettings: AiPersonalitySettings = {
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

export const defaultPaymentRulesSettings: PaymentRulesSettings = {
  activeMethods: {
    "bank-transfer": true,
    "pay-on-delivery": false,
    "payment-link": true,
  },
  managersCanConfirm: true,
  manualReceiptReview: true,
  requiredChecks: {
    "amount-match": true,
    "bank-alert": true,
    "payer-name": true,
  },
  showDeliveryMethod: false,
};

const defaultSetupState: SetupState = {
  aiPersonalitySettings: defaultAiPersonalitySettings,
  businessProfileDraft: {
    businessCategory: "Women's fashion",
    businessName: "",
    cityArea: "",
  },
  businessType: null,
  completedStepIds: [],
  deliveryZoneCount: 0,
  paymentRulesSettings: defaultPaymentRulesSettings,
  productCount: 0,
};

const setupStepIdSet = new Set<string>(setupStepIds);
const businessTypeIds = new Set<string>([
  "fashion",
  "tailor",
  "food",
  "logistics",
  "real-estate",
  "beauty-hair",
  "services",
  "other",
]);
const replyTones = new Set<string>(["warm", "professional", "direct", "friendly"]);
const replyLengths = new Set<string>(["short", "balanced", "detailed"]);
const customerAddresses = new Set<string>(["ma-sir", "first-name"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function asNonNegativeInteger(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : fallback;
}

function parseCompletedStepIds(value: unknown): readonly SetupStepId[] {
  if (!Array.isArray(value)) {
    return defaultSetupState.completedStepIds;
  }

  const stepIds = value.filter(
    (stepId): stepId is SetupStepId =>
      typeof stepId === "string" && setupStepIdSet.has(stepId),
  );

  return Array.from(new Set(stepIds));
}

function parseBusinessType(value: unknown): BusinessTypeId | null {
  return typeof value === "string" && businessTypeIds.has(value)
    ? (value as BusinessTypeId)
    : null;
}

function parseBusinessProfileDraft(value: unknown): BusinessProfileDraft {
  if (!isRecord(value)) {
    return defaultSetupState.businessProfileDraft;
  }

  return {
    businessCategory: asString(
      value.businessCategory,
      defaultSetupState.businessProfileDraft.businessCategory,
    ),
    businessName: asString(
      value.businessName,
      defaultSetupState.businessProfileDraft.businessName,
    ),
    cityArea: asString(value.cityArea, defaultSetupState.businessProfileDraft.cityArea),
  };
}

function parseAiPersonalitySettings(value: unknown): AiPersonalitySettings {
  if (!isRecord(value)) {
    return defaultAiPersonalitySettings;
  }

  const guardrails = isRecord(value.approvalGuardrails)
    ? value.approvalGuardrails
    : {};

  return {
    approvalGuardrails: {
      complaints: asBoolean(
        guardrails.complaints,
        defaultAiPersonalitySettings.approvalGuardrails.complaints,
      ),
      discounts: asBoolean(
        guardrails.discounts,
        defaultAiPersonalitySettings.approvalGuardrails.discounts,
      ),
      receipts: asBoolean(
        guardrails.receipts,
        defaultAiPersonalitySettings.approvalGuardrails.receipts,
      ),
      refunds: asBoolean(
        guardrails.refunds,
        defaultAiPersonalitySettings.approvalGuardrails.refunds,
      ),
    },
    customerAddress:
      typeof value.customerAddress === "string" &&
      customerAddresses.has(value.customerAddress)
        ? (value.customerAddress as CustomerAddress)
        : defaultAiPersonalitySettings.customerAddress,
    replyLength:
      typeof value.replyLength === "string" && replyLengths.has(value.replyLength)
        ? (value.replyLength as ReplyLength)
        : defaultAiPersonalitySettings.replyLength,
    tone:
      typeof value.tone === "string" && replyTones.has(value.tone)
        ? (value.tone as ReplyTone)
        : defaultAiPersonalitySettings.tone,
    useNigerianEnglish: asBoolean(
      value.useNigerianEnglish,
      defaultAiPersonalitySettings.useNigerianEnglish,
    ),
  };
}

function parsePaymentRulesSettings(value: unknown): PaymentRulesSettings {
  if (!isRecord(value)) {
    return defaultPaymentRulesSettings;
  }

  const activeMethods = isRecord(value.activeMethods) ? value.activeMethods : {};
  const requiredChecks = isRecord(value.requiredChecks) ? value.requiredChecks : {};

  return {
    activeMethods: {
      "bank-transfer": asBoolean(
        activeMethods["bank-transfer"],
        defaultPaymentRulesSettings.activeMethods["bank-transfer"],
      ),
      "pay-on-delivery": asBoolean(
        activeMethods["pay-on-delivery"],
        defaultPaymentRulesSettings.activeMethods["pay-on-delivery"],
      ),
      "payment-link": asBoolean(
        activeMethods["payment-link"],
        defaultPaymentRulesSettings.activeMethods["payment-link"],
      ),
    },
    managersCanConfirm: asBoolean(
      value.managersCanConfirm,
      defaultPaymentRulesSettings.managersCanConfirm,
    ),
    manualReceiptReview: asBoolean(
      value.manualReceiptReview,
      defaultPaymentRulesSettings.manualReceiptReview,
    ),
    requiredChecks: {
      "amount-match": asBoolean(
        requiredChecks["amount-match"],
        defaultPaymentRulesSettings.requiredChecks["amount-match"],
      ),
      "bank-alert": asBoolean(
        requiredChecks["bank-alert"],
        defaultPaymentRulesSettings.requiredChecks["bank-alert"],
      ),
      "payer-name": asBoolean(
        requiredChecks["payer-name"],
        defaultPaymentRulesSettings.requiredChecks["payer-name"],
      ),
    },
    showDeliveryMethod: asBoolean(
      value.showDeliveryMethod,
      defaultPaymentRulesSettings.showDeliveryMethod,
    ),
  };
}

function parsePersistedSetupState(value: unknown): SetupPersistedState {
  if (!isRecord(value)) {
    return defaultSetupState;
  }

  const businessType = parseBusinessType(value.businessType);
  const completedStepIds = parseCompletedStepIds(value.completedStepIds).filter(
    (stepId) => stepId !== "business-type" || businessType !== null,
  );

  return {
    aiPersonalitySettings: parseAiPersonalitySettings(
      value.aiPersonalitySettings,
    ),
    businessProfileDraft: parseBusinessProfileDraft(value.businessProfileDraft),
    businessType,
    completedStepIds,
    deliveryZoneCount: asNonNegativeInteger(
      value.deliveryZoneCount,
      defaultSetupState.deliveryZoneCount,
    ),
    paymentRulesSettings: parsePaymentRulesSettings(value.paymentRulesSettings),
    productCount: asNonNegativeInteger(value.productCount, defaultSetupState.productCount),
  };
}

export function getCompletedSetupStepCount(completedStepIds: readonly SetupStepId[]) {
  return completedStepIds.filter((stepId) => setupStepIdSet.has(stepId)).length;
}

export function getNextSetupStepId(
  completedStepIds: readonly SetupStepId[],
): SetupStepId | null {
  return setupStepIds.find((stepId) => !completedStepIds.includes(stepId)) ?? null;
}

export function getIsSetupComplete(completedStepIds: readonly SetupStepId[]) {
  return getNextSetupStepId(completedStepIds) === null;
}

function normalizeCount(count: number) {
  return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
}

export const useSetupStore = create<SetupStore>()(
  persist(
    (set) => ({
      ...defaultSetupState,
      markStepComplete: (stepId) =>
        set((state) =>
          state.completedStepIds.includes(stepId)
            ? state
            : { completedStepIds: [...state.completedStepIds, stepId] },
        ),
      resetSetupState: () => set(defaultSetupState),
      setAiPersonalitySettings: (settings) =>
        set({ aiPersonalitySettings: parseAiPersonalitySettings(settings) }),
      setBusinessProfileDraft: (draft) =>
        set({ businessProfileDraft: parseBusinessProfileDraft(draft) }),
      setBusinessType: (businessType) => set({ businessType }),
      setDeliveryZoneCount: (count) =>
        set({ deliveryZoneCount: normalizeCount(count) }),
      setPaymentRulesSettings: (settings) =>
        set({ paymentRulesSettings: parsePaymentRulesSettings(settings) }),
      setProductCount: (count) => set({ productCount: normalizeCount(count) }),
    }),
    {
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...parsePersistedSetupState(persistedState),
      }),
      name: storageKeys.setupProgress,
      partialize: (state): SetupPersistedState => ({
        aiPersonalitySettings: state.aiPersonalitySettings,
        businessProfileDraft: state.businessProfileDraft,
        businessType: state.businessType,
        completedStepIds: state.completedStepIds,
        deliveryZoneCount: state.deliveryZoneCount,
        paymentRulesSettings: state.paymentRulesSettings,
        productCount: state.productCount,
      }),
      storage: createNeoPersistStorage<SetupPersistedState>(),
      version: 1,
    },
  ),
);
