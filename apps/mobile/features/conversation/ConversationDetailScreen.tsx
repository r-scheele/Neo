import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, KeyboardAvoidingView, Platform, useWindowDimensions } from "react-native";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import { StateBanner } from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import {
  getWhatsAppConversation,
  requestAiDraft,
  sendWhatsAppMessage,
  type AiDraftPreferencesPayload,
  type BackendAiDraft,
  type BackendWhatsAppConversationDetail,
  type BackendWhatsAppLabel,
  useApiClient,
} from "@/lib/api";
import {
  getConfidenceBand,
  trackAnalyticsEvent,
  trackScreenStateSeen,
} from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useSetupStore } from "@/stores/useSetupStore";
import type { AiPersonalitySettings } from "@/stores/useSetupStore";

type ConversationViewState = "ready" | "loading" | "error";
type Sender = "customer" | "staff";
type MessageKind = "text" | "receipt";
type Tone = "success" | "warning" | "error" | "info" | "neutral";
type DraftReviewMode = "review" | "editing" | "sent" | "takeover";

type CustomerSummaryItem = {
  detail: string;
  icon: ImageSourcePropType;
  meta: string;
  title: string;
};

type ConversationChip = {
  icon: ImageSourcePropType;
  label: string;
  tone: Tone;
};

type ConversationMessage = {
  amount?: string;
  body: string;
  id: string;
  kind: MessageKind;
  sender: Sender;
  time: string;
  title?: string;
};

type ContextItem = {
  detail: string;
  icon: ImageSourcePropType;
  meta: string;
  title: string;
};

type AiDraft = {
  approvalId?: string;
  approvalRequired?: boolean;
  body: string;
  confidence: "medium" | "high" | "low";
  guardrail: string;
  id?: string;
  reasonCode?: string;
  riskCategory?: string;
  riskReasons?: readonly string[];
  sourceChips: readonly ConversationChip[];
  status?: string;
  suggestedAction?: string;
};

type ConversationRecord = {
  aiDraft: AiDraft | null;
  assignmentLabel: string;
  chips: readonly ConversationChip[];
  contextItems: readonly ContextItem[];
  customerId: string;
  customerInitials: string;
  customerName: string;
  emptyNote: string;
  messages: readonly ConversationMessage[];
  statusLabel: string;
  subtitle: string;
  summary: readonly CustomerSummaryItem[];
};

const aishaConversation: ConversationRecord = {
  customerId: "aisha-o",
  customerInitials: "AO",
  customerName: "Aisha O.",
  statusLabel: "New lead",
  subtitle: "Customer since May 2024",
  assignmentLabel: "Unassigned",
  summary: [
    {
      detail: "Jollof Tray x 2",
      icon: images.iconOrder,
      meta: "May 5, 2024",
      title: "Last order",
    },
    {
      detail: "Prefers early delivery",
      icon: images.iconAiDraft,
      meta: "Polite, concise replies",
      title: "Preferences",
    },
    {
      detail: "NGN 42,000",
      icon: images.iconPaid,
      meta: "3 orders",
      title: "Total spent",
    },
  ],
  chips: [
    { icon: images.iconInbox, label: "WhatsApp connected", tone: "success" },
    { icon: images.iconCustomer, label: "New lead", tone: "neutral" },
    { icon: images.iconCustomer, label: "Unassigned", tone: "neutral" },
  ],
  messages: [
    {
      body: "Good morning. Do you have jollof trays available for this Saturday?",
      id: "aisha-1",
      kind: "text",
      sender: "customer",
      time: "10:21 AM",
    },
    {
      body: "Good morning, Aisha. Yes we do.",
      id: "aisha-2",
      kind: "text",
      sender: "staff",
      time: "10:22 AM",
    },
    {
      body: "Great. How much for 3 trays and what is the delivery fee to Lekki?",
      id: "aisha-3",
      kind: "text",
      sender: "customer",
      time: "10:24 AM",
    },
    {
      amount: "NGN 22,000",
      body: "Payment to Neo Foods",
      id: "aisha-4",
      kind: "receipt",
      sender: "customer",
      time: "10:24 AM",
      title: "Receipt",
    },
    {
      body: "Thank you.",
      id: "aisha-5",
      kind: "text",
      sender: "staff",
      time: "10:25 AM",
    },
  ],
  contextItems: [
    {
      detail: "3 trays requested",
      icon: images.iconOrder,
      meta: "Delivery to Lekki",
      title: "Context",
    },
    {
      detail: "Lekki fee: NGN 1,500",
      icon: images.iconDelivery,
      meta: "Earliest: Sat, 10 May",
      title: "Delivery",
    },
    {
      detail: "50%+ before delivery",
      icon: images.iconPaid,
      meta: "Receipts required",
      title: "Payment rule",
    },
  ],
  aiDraft: {
    body:
      "Good morning, Aisha.\nWe can deliver 3 trays this Saturday.\nPrice is NGN 22,500 (NGN 7,000 per tray + NGN 1,500 delivery to Lekki).\nPlease kindly confirm so I can reserve and send payment details.",
    confidence: "medium",
    guardrail: "Draft includes pricing and payment details. Review before sending.",
    sourceChips: [
      { icon: images.iconProduct, label: "Product: Jollof Tray", tone: "neutral" },
      { icon: images.iconDelivery, label: "Delivery: Lekki", tone: "neutral" },
      { icon: images.iconPaid, label: "Payment rule: 50%+", tone: "neutral" },
    ],
  },
  emptyNote:
    "No messages are available for this customer yet. Customer context and actions will appear when a WhatsApp thread is connected.",
};

const conversationRecords: Record<string, ConversationRecord> = {
  "aisha-order-review": aishaConversation,
  "blessing-receipt": {
    ...aishaConversation,
    customerId: "blessing-m",
    customerInitials: "BM",
    customerName: "Blessing M.",
    statusLabel: "Receipt review",
    subtitle: "Repeat customer",
    assignmentLabel: "You",
    chips: [
      { icon: images.iconInbox, label: "WhatsApp connected", tone: "success" },
      { icon: images.iconReceiptReview, label: "Receipt attached", tone: "success" },
      { icon: images.iconCustomer, label: "Assigned to you", tone: "neutral" },
    ],
    messages: [
      {
        body: "Thanks. I just sent the payment receipt.",
        id: "blessing-1",
        kind: "text",
        sender: "customer",
        time: "10:58 AM",
      },
      {
        amount: "NGN 18,000",
        body: "Payment to Neo Foods",
        id: "blessing-2",
        kind: "receipt",
        sender: "customer",
        time: "10:59 AM",
        title: "Receipt",
      },
    ],
  },
  "godwin-blue-black": {
    ...aishaConversation,
    customerId: "godwin-t",
    customerInitials: "GT",
    customerName: "Godwin T.",
    statusLabel: "AI draft ready",
    subtitle: "Customer since April 2024",
    assignmentLabel: "Assigned to Femi",
    messages: [
      {
        body: "Do you have this in blue or black?",
        id: "godwin-1",
        kind: "text",
        sender: "customer",
        time: "10:21 AM",
      },
    ],
  },
  "ngozi-delivery-yaba": {
    ...aishaConversation,
    customerId: "ngozi-k",
    customerInitials: "NK",
    customerName: "Ngozi K.",
    statusLabel: "Delivery question",
    subtitle: "Customer since March 2024",
    assignmentLabel: "You",
    messages: [
      {
        body: "What is the delivery fee to Yaba?",
        id: "ngozi-1",
        kind: "text",
        sender: "customer",
        time: "9:35 AM",
      },
    ],
  },
  "musa-jollof-order": {
    ...aishaConversation,
    customerId: "musa-a",
    customerInitials: "MA",
    customerName: "Musa A.",
    statusLabel: "Order request",
    subtitle: "New customer",
    assignmentLabel: "Assigned to Tola",
    messages: [
      {
        body: "I would like to place an order for 3 Jollof trays.",
        id: "musa-1",
        kind: "text",
        sender: "customer",
        time: "Yesterday",
      },
    ],
  },
  "sandra-paid": {
    ...aishaConversation,
    customerId: "sandra-d",
    customerInitials: "SD",
    customerName: "Sandra D.",
    statusLabel: "Paid",
    subtitle: "Repeat customer",
    assignmentLabel: "You",
    messages: [
      {
        body: "Great service as always. Thank you.",
        id: "sandra-1",
        kind: "text",
        sender: "customer",
        time: "Yesterday",
      },
    ],
  },
  "emeka-same-day": {
    ...aishaConversation,
    customerId: "emeka-o",
    customerInitials: "EO",
    customerName: "Emeka O.",
    statusLabel: "Delivery question",
    subtitle: "New customer",
    assignmentLabel: "Unassigned",
    messages: [
      {
        body: "Do you do same-day delivery?",
        id: "emeka-1",
        kind: "text",
        sender: "customer",
        time: "Tue",
      },
    ],
  },
};

function getToneChipClassName(tone: Tone) {
  if (tone === "success") {
    return "border-neo-success bg-[#EEF8F0] text-neo-success";
  }

  if (tone === "warning") {
    return "border-neo-warning bg-[#FFF7E5] text-neo-warning";
  }

  if (tone === "error") {
    return "border-neo-error bg-[#FFF1EF] text-neo-error";
  }

  if (tone === "info") {
    return "border-neo-info bg-[#EDF6FA] text-neo-info";
  }

  return "border-neo-border bg-neo-surface text-neo-text";
}

function getToneTint(tone: Tone) {
  if (tone === "success") {
    return colors.success;
  }

  if (tone === "warning") {
    return colors.warning;
  }

  if (tone === "error") {
    return colors.error;
  }

  if (tone === "info") {
    return colors.info;
  }

  return colors.text;
}

function getDraftModeLabel(mode: DraftReviewMode) {
  if (mode === "editing") {
    return "Editing draft";
  }

  if (mode === "sent") {
    return "Sent";
  }

  if (mode === "takeover") {
    return "Human takeover";
  }

  return "Review needed";
}

function getConversationById(id?: string) {
  if (!id) {
    return null;
  }

  return conversationRecords[id] ?? null;
}

function backendChipIcon(chip: BackendWhatsAppLabel) {
  if (chip.text.includes("WhatsApp")) {
    return images.iconInbox;
  }

  if (chip.tone === "error") {
    return images.iconWarning;
  }

  return images.iconCustomer;
}

function backendDetailIcon(title: string) {
  if (title === "Customer") {
    return images.iconCustomer;
  }

  if (title === "Guardrail") {
    return images.iconPermission;
  }

  return images.iconInbox;
}

function normalizeBackendConversationDetail(
  detail: BackendWhatsAppConversationDetail,
): ConversationRecord {
  return {
    aiDraft: null,
    assignmentLabel: detail.assignmentLabel,
    chips: detail.chips.map((chip) => ({
      icon: backendChipIcon(chip),
      label: chip.text,
      tone: chip.tone,
    })),
    contextItems: detail.contextItems.map((item) => ({
      detail: item.detail,
      icon: backendDetailIcon(item.title),
      meta: item.meta,
      title: item.title,
    })),
    customerId: detail.customerId,
    customerInitials: detail.customerInitials,
    customerName: detail.customerName,
    emptyNote: detail.emptyNote,
    messages: detail.messages.map((message) => ({
      body: message.body,
      id: message.id,
      kind: message.kind,
      sender: message.sender,
      time: message.time,
    })),
    statusLabel: detail.statusLabel,
    subtitle: detail.subtitle,
    summary: detail.summary.map((item) => ({
      detail: item.detail,
      icon: backendDetailIcon(item.title),
      meta: item.meta,
      title: item.title,
    })),
  };
}

function normalizeBackendAiDraft(draft: BackendAiDraft): AiDraft {
  return {
    approvalId: draft.approvalId,
    approvalRequired: draft.approvalRequired,
    body: draft.body,
    confidence: draft.confidence,
    guardrail: draft.guardrail,
    id: draft.id,
    reasonCode: draft.reasonCode,
    riskCategory: draft.riskCategory,
    riskReasons: draft.riskReasons,
    sourceChips: draft.sourceChips.map((label) => ({
      icon: backendDraftSourceIcon(label),
      label,
      tone: label.includes("Approval") || label.includes("low") ? "warning" : "neutral",
    })),
    status: draft.status,
    suggestedAction: draft.suggestedAction,
  };
}

function backendDraftSourceIcon(label: string): ImageSourcePropType {
  if (label.includes("WhatsApp")) {
    return images.iconInbox;
  }

  if (label.includes("Confidence")) {
    return images.iconApprovals;
  }

  if (label.includes("Approval")) {
    return images.iconPermission;
  }

  return images.iconAiDraft;
}

function aiPreferencesPayload(
  settings: AiPersonalitySettings,
): AiDraftPreferencesPayload {
  return {
    approvalGuardrails: settings.approvalGuardrails,
    customerAddress: settings.customerAddress,
    replyLength: settings.replyLength,
    tone: settings.tone,
    useNigerianEnglish: settings.useNigerianEnglish,
  };
}

function HeaderButton({
  accessibilityLabel,
  children,
  onPress,
}: {
  accessibilityLabel: string;
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

function ConversationHeader({ conversation }: { conversation: ConversationRecord }) {
  const router = useRouter();
  const customerHref = `/customer/${conversation.customerId}` as Href;

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="min-h-12 w-10 items-start justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-[34px] leading-9 text-neo-text">{"<"}</Text>
        </Pressable>

        <View className="h-16 w-16 items-center justify-center rounded-full bg-neo-terracotta">
          <Text className="text-[24px] font-bold leading-8 text-white">
            {conversation.customerInitials}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text
              className="text-[24px] font-bold leading-8 text-neo-text"
              numberOfLines={1}
            >
              {conversation.customerName}
            </Text>
            <View className="rounded-full border border-neo-success bg-[#EEF8F0] px-3 py-1">
              <Text className="text-[13px] font-bold leading-4 text-neo-success">
                {conversation.statusLabel}
              </Text>
            </View>
          </View>
          <Text
            className="mt-1 text-[14px] leading-5 text-neo-text-muted"
            numberOfLines={1}
          >
            {conversation.subtitle}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Link asChild href={customerHref}>
            <Pressable
              accessibilityLabel="Open customer profile"
              accessibilityRole="link"
              className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconCustomer}
                style={{ height: 26, tintColor: colors.text, width: 26 }}
              />
            </Pressable>
          </Link>
          <HeaderButton accessibilityLabel="More conversation actions">
            <Text className="text-[28px] font-bold leading-8 text-neo-text">...</Text>
          </HeaderButton>
        </View>
      </View>
    </View>
  );
}

function CustomerSummary({ summary }: { summary: readonly CustomerSummaryItem[] }) {
  return (
    <View className="mt-4 flex-row overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {summary.map((item, index) => (
        <View
          className={`min-h-[104px] flex-1 px-3 py-4 ${
            index > 0 ? "border-l border-neo-border" : ""
          }`}
          key={item.title}
        >
          <View className="flex-row items-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={item.icon}
              style={{ height: 22, tintColor: colors.text, width: 22 }}
            />
            <Text
              className="text-[12px] font-semibold leading-4 text-neo-text-muted"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>
          <Text
            className="mt-2 text-[14px] font-semibold leading-5 text-neo-text"
            numberOfLines={3}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {item.detail}
          </Text>
          <Text
            className="mt-1 text-[13px] leading-5 text-neo-text-muted"
            numberOfLines={2}
          >
            {item.meta}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ConversationChips({
  assignmentLabel,
  chips,
}: {
  assignmentLabel: string;
  chips: readonly ConversationChip[];
}) {
  return (
    <View className="mt-4 flex-row flex-wrap items-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-3 py-2">
      {chips.map((chip) => (
        <View
          className={`min-h-9 flex-row items-center gap-2 rounded-full border px-3 ${getToneChipClassName(
            chip.tone,
          )}`}
          key={chip.label}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={chip.icon}
            style={{ height: 18, tintColor: getToneTint(chip.tone), width: 18 }}
          />
          <Text className="text-[13px] font-semibold leading-4">{chip.label}</Text>
        </View>
      ))}
      <Pressable
        accessibilityLabel={`Change assignment, currently ${assignmentLabel}`}
        accessibilityRole="button"
        className="ml-auto min-h-9 items-center justify-center px-2"
      >
        <Text className="text-[13px] font-bold leading-4 text-neo-info">Change</Text>
      </Pressable>
    </View>
  );
}

function DatePill() {
  return (
    <View className="my-5 items-center">
      <View className="rounded-full border border-neo-border bg-neo-surface px-3 py-1">
        <Text className="text-[13px] font-semibold leading-4 text-neo-text-muted">
          Today
        </Text>
      </View>
    </View>
  );
}

function ChatMessage({ message }: { message: ConversationMessage }) {
  const isStaff = message.sender === "staff";

  if (message.kind === "receipt") {
    return (
      <View className="mb-4 max-w-[82%] self-start rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
        <View className="flex-row items-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconReceiptReview}
              style={{ height: 36, tintColor: colors.text, width: 36 }}
            />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[16px] font-bold leading-5 text-neo-text">
              {message.title}
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text">
              {message.body}
            </Text>
            <Text
              className="mt-1 text-[13px] leading-4 text-neo-text-muted"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {message.amount} - May 5, 2024 - {message.time}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className={`mb-4 max-w-[84%] rounded-lg border px-4 py-3 ${
        isStaff
          ? "self-end border-[#B9D7C4] bg-[#E8F4EB]"
          : "self-start border-neo-border bg-neo-surface"
      }`}
    >
      <Text className="text-[16px] leading-6 text-neo-text">{message.body}</Text>
      <Text
        className="mt-2 text-right text-[12px] leading-4 text-neo-text-muted"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {message.time}
        {isStaff ? "  Read" : ""}
      </Text>
    </View>
  );
}

function ContextStrip({ items }: { items: readonly ContextItem[] }) {
  return (
    <View className="mt-1 flex-row overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {items.map((item, index) => (
        <View
          className={`min-h-[92px] flex-1 px-3 py-3 ${
            index > 0 ? "border-l border-neo-border" : ""
          }`}
          key={item.title}
        >
          <View className="flex-row items-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={item.icon}
              style={{ height: 20, tintColor: colors.text, width: 20 }}
            />
            <Text className="text-[12px] font-semibold leading-4 text-neo-text-muted">
              {item.title}
            </Text>
          </View>
          <Text
            className="mt-2 text-[13px] font-semibold leading-5 text-neo-text"
            numberOfLines={2}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {item.detail}
          </Text>
          <Text
            className="mt-1 text-[12px] leading-4 text-neo-text-muted"
            numberOfLines={2}
          >
            {item.meta}
          </Text>
        </View>
      ))}
    </View>
  );
}

function AiDraftCard({
  draftText,
  draft,
  mode,
  onCancelEdit,
  onChangeDraftText,
  onEdit,
  onNotice,
  onResumeDraft,
  onSaveEdit,
}: {
  draftText: string;
  draft: AiDraft;
  mode: DraftReviewMode;
  onCancelEdit: () => void;
  onChangeDraftText: (value: string) => void;
  onEdit: () => void;
  onNotice: (message: string) => void;
  onResumeDraft: () => void;
  onSaveEdit: () => void;
}) {
  const isEditing = mode === "editing";
  const isSent = mode === "sent";
  const isTakeover = mode === "takeover";

  return (
    <View
      className={`mt-4 rounded-lg border bg-neo-surface ${
        isSent
          ? "border-neo-success"
          : isTakeover
            ? "border-neo-info"
            : "border-[#E6C88E]"
      }`}
    >
      <View className="px-4 py-4">
        <View className="flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconAiDraft}
              style={{ height: 24, tintColor: colors.info, width: 24 }}
            />
            <Text className="text-[18px] font-bold leading-6 text-neo-info">
              AI draft
            </Text>
          </View>
          <View
            className={`rounded-full border px-3 py-1 ${
              isSent
                ? "border-neo-success bg-[#EEF8F0]"
                : isTakeover
                  ? "border-neo-info bg-[#EDF6FA]"
                  : "border-neo-warning bg-[#FFF7E5]"
            }`}
          >
            <Text
              className={`text-[13px] font-bold leading-4 ${
                isSent
                  ? "text-neo-success"
                  : isTakeover
                    ? "text-neo-info"
                    : "text-neo-warning"
              }`}
            >
              {getDraftModeLabel(mode)}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Explain draft confidence"
            accessibilityRole="button"
            className="min-h-9 items-center justify-center px-1"
            onPress={() =>
              onNotice(
                "Draft confidence is based on product, delivery, and payment context.",
              )
            }
          >
            <Text className="text-[13px] font-bold leading-4 text-neo-info">Why?</Text>
          </Pressable>
          {!isTakeover && !isEditing ? (
            <Pressable
              accessibilityLabel="Edit AI draft"
              accessibilityRole="button"
              className="ml-auto min-h-10 flex-row items-center rounded-lg border border-neo-border px-3"
              disabled={isSent}
              onPress={onEdit}
            >
              <Text
                className={`text-[14px] font-bold leading-5 ${
                  isSent ? "text-neo-text-muted" : "text-neo-text"
                }`}
              >
                Edit draft
              </Text>
            </Pressable>
          ) : null}
        </View>

        {isSent ? (
          <View className="mt-4 flex-row items-start gap-3 rounded-lg border border-neo-success bg-[#EEF8F0] px-3 py-3">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.successReplySent}
              style={{ height: 44, width: 44 }}
            />
            <View className="min-w-0 flex-1">
              <Text className="text-[16px] font-bold leading-5 text-neo-success">
                {draft.id ? "Draft sent" : "Draft marked sent"}
              </Text>
              <Text className="mt-1 text-[14px] leading-5 text-neo-text">
                {draft.id
                  ? "Message was sent through the WhatsApp backend."
                  : "This is local feedback only. No WhatsApp message was sent."}
              </Text>
            </View>
          </View>
        ) : null}

        {isTakeover ? (
          <View className="mt-4 rounded-lg border border-neo-info bg-[#EDF6FA] px-4 py-3">
            <Text className="text-[16px] font-bold leading-5 text-neo-info">
              Human takeover active
            </Text>
            <Text className="mt-2 text-[14px] leading-5 text-neo-text">
              Neo has paused draft actions so you can reply manually from the
              composer.
            </Text>
            <Pressable
              accessibilityLabel="Resume AI draft review"
              accessibilityRole="button"
              className="mt-3 min-h-11 self-start justify-center rounded-lg border border-neo-info bg-neo-surface px-3"
              onPress={onResumeDraft}
            >
              <Text className="text-[14px] font-bold leading-5 text-neo-info">
                Resume draft review
              </Text>
            </Pressable>
          </View>
        ) : null}

        {isEditing ? (
          <View className="mt-4 rounded-lg border border-neo-border bg-neo-background px-3 py-3">
            <Text className="text-[13px] font-bold leading-4 text-neo-text-muted">
              Edit draft locally
            </Text>
            <TextInput
              accessibilityLabel="Edit AI draft text"
              className="mt-2 min-h-[132px] text-[16px] leading-6 text-neo-text"
              multiline
              onChangeText={onChangeDraftText}
              textAlignVertical="top"
              value={draftText}
            />
            <View className="mt-3 flex-row gap-2">
              <Pressable
                accessibilityLabel="Save draft edits"
                accessibilityRole="button"
                className="min-h-11 flex-1 items-center justify-center rounded-lg bg-neo-primary px-3"
                onPress={onSaveEdit}
              >
                <Text className="text-[14px] font-bold leading-5 text-white">
                  Save edits
                </Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Cancel draft edits"
                accessibilityRole="button"
                className="min-h-11 flex-1 items-center justify-center rounded-lg border border-neo-border bg-neo-surface px-3"
                onPress={onCancelEdit}
              >
                <Text className="text-[14px] font-bold leading-5 text-neo-text">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {!isEditing && !isTakeover ? (
          <Text className="mt-4 text-[16px] leading-6 text-neo-text">{draftText}</Text>
        ) : null}

        <View className={`${isTakeover ? "mt-4 opacity-60" : "mt-4"} flex-row flex-wrap items-center gap-2`}>
          <Text className="text-[13px] font-semibold leading-4 text-neo-text">
            Sources:
          </Text>
          {draft.sourceChips.map((chip) => (
            <View
              className="min-h-9 flex-row items-center gap-2 rounded-md border border-neo-border bg-neo-background px-2"
              key={chip.label}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={chip.icon}
                style={{ height: 18, tintColor: colors.text, width: 18 }}
              />
              <Text className="text-[13px] font-semibold leading-4 text-neo-text">
                {chip.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        className={`border-t px-4 py-3 ${
          isSent
            ? "border-neo-success bg-[#EEF8F0]"
            : isTakeover
              ? "border-neo-info bg-[#EDF6FA]"
              : "border-[#E6C88E] bg-[#FFF8EA]"
        }`}
      >
        <View className="flex-row items-center gap-2">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={isSent ? images.successReplySent : images.iconWarning}
            style={{
              height: 22,
              tintColor: isSent ? colors.success : colors.warning,
              width: 22,
            }}
          />
          <Text
            className={`min-w-0 flex-1 text-[13px] font-semibold leading-5 ${
              isSent
                ? "text-neo-success"
                : isTakeover
                  ? "text-neo-info"
                  : "text-neo-warning"
            }`}
          >
            {isSent
              ? draft.id
                ? "Sent through the backend. Keep payment and receipt confirmations manual."
                : "Local success feedback only. Send behavior is intentionally not connected yet."
              : isTakeover
                ? "Draft actions are paused while human takeover is active."
                : draft.guardrail}
          </Text>
        </View>
      </View>
    </View>
  );
}

function GenerateDraftPanel({
  actionsDisabled,
  isRequestingDraft,
  onGenerateDraft,
}: {
  actionsDisabled: boolean;
  isRequestingDraft: boolean;
  onGenerateDraft: () => void;
}) {
  const disabled = actionsDisabled || isRequestingDraft;

  return (
    <View className="mt-4 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <View className="flex-row items-start gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#EDF6FA]">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconAiDraft}
            style={{ height: 28, tintColor: colors.info, width: 28 }}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[17px] font-bold leading-6 text-neo-text">
            Need a reply draft?
          </Text>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
            Neo can draft from this WhatsApp thread and keep sensitive replies in
            approval.
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel="Generate AI draft"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={`mt-3 min-h-12 flex-row items-center justify-center rounded-lg px-4 ${
          disabled ? "bg-neo-surface-alt" : "bg-neo-primary"
        }`}
        disabled={disabled}
        onPress={onGenerateDraft}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconAiDraft}
          style={{
            height: 22,
            tintColor: disabled ? colors.textMuted : colors.surface,
            width: 22,
          }}
        />
        <Text
          className={`ml-2 text-[15px] font-bold leading-5 ${
            disabled ? "text-neo-text-muted" : "text-white"
          }`}
        >
          {isRequestingDraft ? "Generating draft..." : "Generate AI draft"}
        </Text>
      </Pressable>
    </View>
  );
}

function DraftActions({
  actionsDisabled,
  conversationId,
  customerName,
  isSendingDraft,
  mode,
  onEdit,
  onNotice,
  onSendDraft,
  onTakeover,
  sendDisabled,
}: {
  actionsDisabled: boolean;
  conversationId?: string;
  customerName: string;
  isSendingDraft: boolean;
  mode: DraftReviewMode;
  onEdit: () => void;
  onNotice: (message: string) => void;
  onSendDraft: () => void;
  onTakeover: () => void;
  sendDisabled?: boolean;
}) {
  const orderHref = conversationId
    ? (`/order/new?conversationId=${encodeURIComponent(conversationId)}` as Href)
    : ("/order/new" as Href);
  const draftActionsDisabled =
    actionsDisabled || mode === "takeover" || mode === "sent" || mode === "editing";
  const sendActionDisabled = draftActionsDisabled || isSendingDraft || sendDisabled;

  return (
    <View className="mt-4 gap-3">
      <Pressable
        accessibilityLabel={
          mode === "sent" ? "AI draft already marked sent" : "Review and send AI draft"
        }
        accessibilityRole="button"
        accessibilityState={{ disabled: sendActionDisabled }}
        className={`min-h-14 flex-row items-center justify-center rounded-lg px-4 ${
          sendActionDisabled ? "bg-neo-surface-alt" : "bg-neo-primary"
        }`}
        disabled={sendActionDisabled}
        onPress={onSendDraft}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconAiDraft}
          style={{
            height: 22,
            tintColor: sendActionDisabled ? colors.textMuted : colors.surface,
            width: 22,
          }}
        />
        <Text
          className={`ml-2 text-[16px] font-bold leading-5 ${
            sendActionDisabled ? "text-neo-text-muted" : "text-white"
          }`}
        >
          {isSendingDraft
            ? "Reviewing draft..."
            : mode === "sent"
              ? "Draft marked sent"
              : mode === "takeover"
                ? "Draft paused"
                : sendDisabled
                  ? "Approval required"
                  : "Review and send draft"}
        </Text>
      </Pressable>

      <View className="flex-row gap-3">
        <Pressable
          accessibilityLabel="Edit draft"
          accessibilityRole="button"
          accessibilityState={{ disabled: draftActionsDisabled }}
          className={`min-h-12 flex-1 items-center justify-center rounded-lg border border-neo-border px-3 ${
            draftActionsDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
          }`}
          disabled={draftActionsDisabled}
          onPress={onEdit}
        >
          <Text
            className={`text-[15px] font-bold leading-5 ${
              draftActionsDisabled ? "text-neo-text-muted" : "text-neo-text"
            }`}
          >
            Edit draft
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`Take over conversation with ${customerName}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled, selected: mode === "takeover" }}
          className={`min-h-12 flex-1 items-center justify-center rounded-lg border px-3 ${
            actionsDisabled
              ? "border-neo-border bg-neo-surface-alt"
              : mode === "takeover"
              ? "border-neo-info bg-[#EDF6FA]"
              : "border-neo-border bg-neo-surface"
          }`}
          disabled={actionsDisabled}
          onPress={onTakeover}
        >
          <Text
            className={`text-[15px] font-bold leading-5 ${
              actionsDisabled
                ? "text-neo-text-muted"
                : mode === "takeover"
                  ? "text-neo-info"
                  : "text-neo-text"
            }`}
          >
            {mode === "takeover" ? "Taking over" : "Take over"}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {actionsDisabled ? (
          <Pressable
            accessibilityLabel="Create order from this conversation"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            className="min-h-11 flex-1 basis-[48%] flex-row items-center justify-center rounded-lg border border-neo-border bg-neo-surface-alt px-3"
            disabled
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconOrder}
              style={{ height: 20, tintColor: colors.textMuted, width: 20 }}
            />
            <Text className="ml-2 text-[14px] font-semibold leading-5 text-neo-text-muted">
              Create order
            </Text>
          </Pressable>
        ) : (
          <Link asChild href={orderHref}>
            <Pressable
              accessibilityLabel="Create order from this conversation"
              accessibilityRole="link"
              className="min-h-11 flex-1 basis-[48%] flex-row items-center justify-center rounded-lg border border-neo-border bg-neo-surface px-3"
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconOrder}
                style={{ height: 20, tintColor: colors.text, width: 20 }}
              />
              <Text className="ml-2 text-[14px] font-semibold leading-5 text-neo-text">
                Create order
              </Text>
            </Pressable>
          </Link>
        )}

        {[
          { icon: images.iconProduct, label: "Attach product" },
          { icon: images.iconReceiptReview, label: "Attach receipt" },
          { icon: images.iconPaid, label: "Payment link" },
        ].map((action) => (
          <Pressable
            accessibilityLabel={action.label}
            accessibilityRole="button"
            accessibilityState={{ disabled: actionsDisabled }}
            className={`min-h-11 flex-1 basis-[48%] flex-row items-center justify-center rounded-lg border border-neo-border px-3 ${
              actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
            }`}
            disabled={actionsDisabled}
            key={action.label}
            onPress={() => onNotice(`${action.label} is not enabled in this mock screen.`)}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={action.icon}
              style={{
                height: 20,
                tintColor: actionsDisabled ? colors.textMuted : colors.text,
                width: 20,
              }}
            />
            <Text
              className={`ml-2 text-[14px] font-semibold leading-5 ${
                actionsDisabled ? "text-neo-text-muted" : "text-neo-text"
              }`}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Composer({
  composerText,
  customerName,
  disabled,
  isSending,
  onChangeText,
  onNotice,
  onSend,
}: {
  composerText: string;
  customerName: string;
  disabled: boolean;
  isSending: boolean;
  onChangeText: (value: string) => void;
  onNotice: (message: string) => void;
  onSend: () => void;
}) {
  const sendDisabled = disabled || isSending || composerText.trim().length === 0;

  return (
    <View className="mt-4 flex-row items-center gap-2">
      <Pressable
        accessibilityLabel="Open composer attachments"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={`min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border ${
          disabled ? "bg-neo-surface-alt" : "bg-neo-surface"
        }`}
        disabled={disabled}
        onPress={() => onNotice("Attachments are not enabled in this mock screen.")}
      >
        <Text
          className={`text-[28px] leading-8 ${
            disabled ? "text-neo-text-muted" : "text-neo-text"
          }`}
        >
          +
        </Text>
      </Pressable>

      <View
        className={`min-h-12 flex-1 rounded-lg border border-neo-border px-3 py-2 ${
          disabled ? "bg-neo-surface-alt" : "bg-neo-surface"
        }`}
      >
        <TextInput
          accessibilityLabel={`Message ${customerName}`}
          className="min-h-8 text-[16px] leading-6 text-neo-text"
          editable={!disabled && !isSending}
          multiline
          onChangeText={onChangeText}
          placeholder={disabled ? "Messaging disabled while offline" : `Message ${customerName}`}
          placeholderTextColor={colors.textMuted}
          value={composerText}
        />
      </View>

      <Pressable
        accessibilityLabel="Send manual message"
        accessibilityRole="button"
        accessibilityState={{ disabled: sendDisabled }}
        className={`min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border ${
          sendDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
        }`}
        disabled={sendDisabled}
        onPress={onSend}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconInbox}
          style={{
            height: 24,
            tintColor: sendDisabled ? colors.textMuted : colors.text,
            width: 24,
          }}
        />
      </Pressable>
    </View>
  );
}

function ConversationSkeleton() {
  return (
    <View className="gap-4">
      <View className="h-20 rounded-lg border border-neo-border bg-neo-surface-alt" />
      <View className="h-28 rounded-lg border border-neo-border bg-neo-surface-alt" />
      {[0, 1, 2, 3].map((item) => (
        <View
          className={`h-20 rounded-lg border border-neo-border bg-neo-surface-alt ${
            item % 2 === 0 ? "mr-16" : "ml-16"
          }`}
          key={item}
        />
      ))}
      <View className="h-44 rounded-lg border border-neo-border bg-neo-surface-alt" />
    </View>
  );
}

function ConversationEmptyState({
  conversation,
}: {
  conversation: ConversationRecord;
}) {
  return (
    <View className="mt-5 items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-7">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.illustrationInboxAiDraft}
        style={{ height: 138, width: 180 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        No messages yet
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        {conversation.emptyNote}
      </Text>
    </View>
  );
}

function ConversationErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EF]">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.errorWhatsappDisconnected}
          style={{ height: 40, width: 40 }}
        />
      </View>
      <Text className="mt-4 text-[20px] font-bold leading-7 text-neo-text">
        Could not load conversation
      </Text>
      <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
        Try again. Cached conversations stay read-only when Neo is offline.
      </Text>
      <Pressable
        accessibilityLabel="Retry loading conversation"
        accessibilityRole="button"
        className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-4"
        onPress={onRetry}
      >
        <Text className="text-[15px] font-bold leading-5 text-white">Retry</Text>
      </Pressable>
    </View>
  );
}

function MissingConversationState({ conversationId }: { conversationId?: string }) {
  return (
    <View className="flex-1 bg-neo-background px-5 py-16">
      <View className="rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
        <Text className="text-[20px] font-bold leading-7 text-neo-text">
          Conversation not found
        </Text>
        <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
          This mock conversation is not available yet.
        </Text>
        {conversationId ? (
          <Text className="mt-3 text-[13px] font-semibold leading-5 text-neo-text-muted">
            ID: {conversationId}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function ConversationDetailScreen({
  conversationId,
  initialState = "ready",
}: {
  conversationId?: string;
  initialState?: MockScreenState;
}) {
  const apiClient = useApiClient();
  const aiPersonalitySettings = useSetupStore(
    (store) => store.aiPersonalitySettings,
  );
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const fixtureConversation = useMemo(
    () => getConversationById(conversationId),
    [conversationId],
  );
  const [backendConversation, setBackendConversation] =
    useState<ConversationRecord | null>(null);
  const activeConversation = backendConversation ?? fixtureConversation;
  const initialDraftText = activeConversation?.aiDraft?.body ?? "";
  const [composerText, setComposerText] = useState("");
  const [draftText, setDraftText] = useState(initialDraftText);
  const [draftMode, setDraftMode] = useState<DraftReviewMode>("review");
  const [hasEditedDraft, setHasEditedDraft] = useState(false);
  const [isRequestingDraft, setIsRequestingDraft] = useState(false);
  const [isSendingDraft, setIsSendingDraft] = useState(false);
  const [isSendingManualMessage, setIsSendingManualMessage] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ConversationViewState>(
    initialState === "loading" || initialState === "error"
      ? initialState
      : fixtureConversation
        ? "ready"
        : "loading",
  );
  const actionsDisabled =
    initialState === "offline" || initialState === "permission";
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (sendTimerRef.current) {
        clearTimeout(sendTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialState !== "ready" || !conversationId || fixtureConversation) {
      return;
    }

    let isActive = true;

    getWhatsAppConversation(apiClient, conversationId).then((result) => {
      if (!isActive) {
        return;
      }

      if (result.ok) {
        setBackendConversation(
          normalizeBackendConversationDetail(result.data.conversation),
        );
        setViewState("ready");
        return;
      }

      setNotice(result.error.message);
      setViewState("error");
    });

    return () => {
      isActive = false;
    };
  }, [apiClient, conversationId, fixtureConversation, initialState]);

  useEffect(() => {
    trackScreenStateSeen({
      errorCategory: "conversation_load_failed",
      hasCachedData: initialState !== "empty",
      screen: "conversation_detail",
      state: initialState,
    });
  }, [initialState]);

  useEffect(() => {
    if (
      !activeConversation?.aiDraft ||
      viewState !== "ready" ||
      initialState === "empty" ||
      initialState === "error" ||
      initialState === "loading"
    ) {
      return;
    }

    trackAnalyticsEvent("ai_draft_reviewed", {
      confidence_band: getConfidenceBand(activeConversation.aiDraft.confidence),
      draft_type: "reply",
    });
  }, [activeConversation, initialState, viewState]);

  if (!activeConversation && viewState !== "loading" && viewState !== "error") {
    return <MissingConversationState conversationId={conversationId} />;
  }

  function retryLoad() {
    if (!conversationId || fixtureConversation) {
      setViewState("ready");
      return;
    }

    setViewState("loading");
    getWhatsAppConversation(apiClient, conversationId).then((result) => {
      if (result.ok) {
        setBackendConversation(
          normalizeBackendConversationDetail(result.data.conversation),
        );
        setViewState("ready");
        return;
      }

      setNotice(result.error.message);
      setViewState("error");
    });
  }

  function showNotice(message: string) {
    setNotice(message);
  }

  function editDraft() {
    if (activeConversation?.aiDraft) {
      setDraftMode("editing");
      setNotice(
        activeConversation.aiDraft.approvalRequired
          ? "This draft needs approval. You can edit it here, but it cannot be sent from this screen yet."
          : "Edit this draft before reviewing it.",
      );
    }
  }

  function cancelDraftEdit() {
    setDraftText(activeConversation?.aiDraft?.body ?? "");
    setDraftMode("review");
    setNotice("Draft edits were discarded locally.");
  }

  function saveDraftEdit() {
    const trimmedDraft = draftText.trim();

    if (!trimmedDraft) {
      setNotice("Draft cannot be empty. Add a reply before saving.");
      return;
    }

    setDraftText(trimmedDraft);
    setHasEditedDraft(trimmedDraft !== (activeConversation?.aiDraft?.body ?? ""));
    setDraftMode("review");
    setNotice("Draft edits saved locally. Nothing was sent.");
  }

  async function requestDraft() {
    if (!conversationId || fixtureConversation) {
      setNotice("Backend AI drafts are available only for live WhatsApp conversations.");
      return;
    }

    setIsRequestingDraft(true);
    const result = await requestAiDraft(
      apiClient,
      conversationId,
      aiPreferencesPayload(aiPersonalitySettings),
    );
    setIsRequestingDraft(false);

    if (!result.ok) {
      setNotice(result.error.message);
      return;
    }

    const normalizedDraft = normalizeBackendAiDraft(result.data.draft);
    setBackendConversation((currentConversation) => {
      const baseConversation = currentConversation ?? activeConversation;

      return baseConversation
        ? { ...baseConversation, aiDraft: normalizedDraft }
        : currentConversation;
    });
    setDraftText(normalizedDraft.body);
    setDraftMode("review");
    setHasEditedDraft(false);
    setNotice(
      normalizedDraft.approvalRequired
        ? "Draft needs owner or manager approval and was added to Approvals."
        : "Draft ready for human review. Neo will not send without your tap.",
    );
  }

  async function reviewAndSendDraft() {
    if (!draftText.trim()) {
      setNotice("Draft cannot be sent while empty.");
      return;
    }

    const currentDraft = activeConversation?.aiDraft;

    if (currentDraft?.approvalRequired) {
      setNotice("This draft is waiting in Approvals and cannot be sent from here yet.");
      return;
    }

    const editedBeforeSend = hasEditedDraft;

    if (conversationId && !fixtureConversation && currentDraft?.id) {
      setIsSendingDraft(true);
      const result = await sendWhatsAppMessage(
        apiClient,
        conversationId,
        draftText.trim(),
      );
      setIsSendingDraft(false);

      if (!result.ok) {
        setNotice(result.error.message);
        return;
      }

      setBackendConversation({
        ...normalizeBackendConversationDetail(result.data.conversation),
        aiDraft: {
          ...currentDraft,
          body: draftText.trim(),
          status: "sent",
        },
      });
      setDraftMode("sent");
      trackAnalyticsEvent("ai_draft_sent", {
        draft_type: currentDraft.riskCategory ?? "reply",
        edited_before_send: editedBeforeSend,
      });
      setNotice("Draft sent through the WhatsApp backend.");
      return;
    }

    setIsSendingDraft(true);
    setNotice("Reviewing draft locally. No WhatsApp message is being sent.");

    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current);
    }

    sendTimerRef.current = setTimeout(() => {
      setIsSendingDraft(false);
      setDraftMode("sent");
      trackAnalyticsEvent("ai_draft_sent", {
        draft_type: "reply",
        edited_before_send: editedBeforeSend,
      });
      setNotice("Local success feedback shown. No WhatsApp message was sent.");
    }, 500);
  }

  function takeOverConversation() {
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current);
    }

    setIsSendingDraft(false);
    setDraftMode("takeover");
    setNotice("Human takeover is active. Draft actions are paused.");
  }

  function resumeDraftReview() {
    setDraftMode("review");
    setNotice("AI draft review is active again.");
  }

  async function sendManualMessage() {
    const trimmedMessage = composerText.trim();

    if (!trimmedMessage) {
      setNotice("Add a message before sending.");
      return;
    }

    if (!conversationId || fixtureConversation) {
      setNotice("Manual sending is available only for backend WhatsApp conversations.");
      return;
    }

    setIsSendingManualMessage(true);
    const result = await sendWhatsAppMessage(apiClient, conversationId, trimmedMessage);
    setIsSendingManualMessage(false);

    if (!result.ok) {
      setNotice(result.error.message);
      return;
    }

    setBackendConversation(
      normalizeBackendConversationDetail(result.data.conversation),
    );
    setComposerText("");
    setNotice("Message sent through the WhatsApp backend.");
  }

  if (!activeConversation) {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <ConversationSkeleton />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-neo-background"
    >
      <ScrollView
        className="flex-1 bg-neo-background"
        contentContainerClassName="items-center"
        contentContainerStyle={{
          paddingBottom: 28,
          paddingHorizontal: horizontalPadding,
          paddingTop: isCompactPhone ? 28 : 44,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px]">
          {viewState === "loading" ? <ConversationSkeleton /> : null}
          {viewState === "error" ? <ConversationErrorState onRetry={retryLoad} /> : null}
          {viewState === "ready" ? (
            <>
              <ConversationHeader conversation={activeConversation} />
              <CustomerSummary summary={activeConversation.summary} />
              <ConversationChips
                assignmentLabel={activeConversation.assignmentLabel}
                chips={activeConversation.chips}
              />

              {initialState === "offline" ? (
                <StateBanner
                  message="This cached thread is read-only. Sending replies, creating orders, and attachment actions stay disabled until Neo is online."
                  title="Offline conversation"
                  tone="offline"
                />
              ) : null}
              {initialState === "permission" ? (
                <StateBanner
                  message="You can review this customer thread, but sending replies and creating orders require owner or manager access."
                  title="Conversation actions locked"
                  tone="permission"
                />
              ) : null}

              {initialState !== "empty" && activeConversation.messages.length > 0 ? (
                <>
                  <DatePill />
                  <View>
                    {activeConversation.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </View>
                </>
              ) : (
                <ConversationEmptyState conversation={activeConversation} />
              )}

              <ContextStrip items={activeConversation.contextItems} />

              {activeConversation.aiDraft ? (
                <>
                  <AiDraftCard
                    draft={activeConversation.aiDraft}
                    draftText={draftText}
                    mode={draftMode}
                    onCancelEdit={cancelDraftEdit}
                    onChangeDraftText={setDraftText}
                    onEdit={editDraft}
                    onNotice={showNotice}
                    onResumeDraft={resumeDraftReview}
                    onSaveEdit={saveDraftEdit}
                  />
                  <DraftActions
                    actionsDisabled={actionsDisabled}
                    conversationId={conversationId}
                    customerName={activeConversation.customerName}
                    isSendingDraft={isSendingDraft}
                    mode={draftMode}
                    onEdit={editDraft}
                    onNotice={showNotice}
                    onSendDraft={() => {
                      void reviewAndSendDraft();
                    }}
                    onTakeover={takeOverConversation}
                    sendDisabled={activeConversation.aiDraft.approvalRequired === true}
                  />
                </>
              ) : (
                <GenerateDraftPanel
                  actionsDisabled={actionsDisabled || !conversationId || Boolean(fixtureConversation)}
                  isRequestingDraft={isRequestingDraft}
                  onGenerateDraft={() => {
                    void requestDraft();
                  }}
                />
              )}

              {notice ? (
                <View className="mt-4 rounded-lg border border-neo-info bg-[#EDF6FA] px-4 py-3">
                  <Text className="text-[14px] font-semibold leading-5 text-neo-info">
                    {notice}
                  </Text>
                </View>
              ) : null}

              <Composer
                composerText={composerText}
                customerName={activeConversation.customerName}
                disabled={actionsDisabled}
                isSending={isSendingManualMessage}
                onChangeText={setComposerText}
                onNotice={showNotice}
                onSend={sendManualMessage}
              />
            </>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
