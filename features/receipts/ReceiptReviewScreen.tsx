import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import {
  SkeletonRows,
  StateBanner,
  StateCard,
} from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import type { MockStaffRole } from "@/features/permissions/permissionData";
import {
  canPerformSensitiveAction,
  getPermissionDeniedHref,
} from "@/features/permissions/permissionData";
import {
  getAmountBand,
  getConfidenceBand,
  trackAnalyticsEvent,
  trackScreenStateSeen,
} from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

import type {
  ReceiptExtractedRow,
  ReceiptReviewRecord,
  ReceiptRiskLevel,
  ReceiptRowStatus,
} from "./receiptReviewData";
import { formatReceiptNaira, getReceiptReviewById } from "./receiptReviewData";

type ReceiptDecision = "confirm" | "ask" | "reject" | "escalate";

type Notice = {
  message: string;
  title: string;
};

type DecisionConfig = {
  actionLabel: string;
  body: string;
  borderClassName: string;
  icon: ImageSourcePropType;
  savedMessage: string;
  savedTitle: string;
  textClassName: string;
  title: string;
  tintColor: string;
};

function getRiskStyle(riskLevel: ReceiptRiskLevel) {
  if (riskLevel === "high") {
    return {
      backgroundClassName: "bg-[#FFF1EF]",
      borderClassName: "border-neo-error",
      textClassName: "text-neo-error",
      tintColor: colors.error,
    };
  }

  if (riskLevel === "medium") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-neo-warning",
      textClassName: "text-neo-warning",
      tintColor: colors.warning,
    };
  }

  return {
    backgroundClassName: "bg-[#EDF6FA]",
    borderClassName: "border-neo-info",
    textClassName: "text-neo-info",
    tintColor: colors.info,
  };
}

function getRowStatusStyle(status: ReceiptRowStatus) {
  if (status === "matches") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      textClassName: "text-neo-success",
      tintColor: colors.success,
    };
  }

  if (status === "detected") {
    return {
      backgroundClassName: "bg-[#EDF6FA]",
      borderClassName: "border-[#B9D3DF]",
      textClassName: "text-neo-info",
      tintColor: colors.info,
    };
  }

  if (status === "mismatch" || status === "unreadable") {
    return {
      backgroundClassName: "bg-[#FFF1EF]",
      borderClassName: "border-neo-error",
      textClassName: "text-neo-error",
      tintColor: colors.error,
    };
  }

  return {
    backgroundClassName: "bg-[#FFF7E5]",
    borderClassName: "border-neo-warning",
    textClassName: "text-neo-warning",
    tintColor: colors.warning,
  };
}

function getDecisionConfig(decision: ReceiptDecision): DecisionConfig {
  if (decision === "confirm") {
    return {
      actionLabel: "Save local confirmation",
      body:
        "Confirm only if you have checked the matching bank alert outside Neo.",
      borderClassName: "border-neo-success bg-[#EEF8F0]",
      icon: images.iconPaid,
      savedMessage:
        "This mock decision assumes a human checked the bank alert. No bank lookup, payment provider, or backend was contacted.",
      savedTitle: "Confirmation saved locally",
      textClassName: "text-neo-success",
      title: "Confirm this payment?",
      tintColor: colors.success,
    };
  }

  if (decision === "reject") {
    return {
      actionLabel: "Save local rejection",
      body: "Use this when the receipt looks unsafe, altered, or does not match the order.",
      borderClassName: "border-neo-error bg-[#FFF1EF]",
      icon: images.iconWarning,
      savedMessage:
        "The receipt was rejected in this screen only. No customer message or backend update was sent.",
      savedTitle: "Receipt rejected locally",
      textClassName: "text-neo-error",
      title: "Reject this receipt?",
      tintColor: colors.error,
    };
  }

  if (decision === "ask") {
    return {
      actionLabel: "Save ask-customer note",
      body: "Use this when you need a clearer receipt, sender name, or bank alert match.",
      borderClassName: "border-neo-info bg-[#EDF6FA]",
      icon: images.iconInbox,
      savedMessage:
        "Ask-customer was saved locally. Neo did not send a WhatsApp message.",
      savedTitle: "Ask customer saved locally",
      textClassName: "text-neo-info",
      title: "Ask customer for more detail?",
      tintColor: colors.info,
    };
  }

  return {
    actionLabel: "Save escalation",
    body: "Use this when an owner or manager should review before any payment state changes.",
    borderClassName: "border-neo-warning bg-[#FFF7E5]",
    icon: images.iconPermission,
    savedMessage:
      "Escalation was saved locally for this mock screen. No staff workflow or backend task was created.",
    savedTitle: "Escalation saved locally",
    textClassName: "text-neo-warning",
    title: "Escalate to manager?",
    tintColor: colors.warning,
  };
}

function Header({ receipt }: { receipt: ReceiptReviewRecord }) {
  const router = useRouter();
  const riskStyle = getRiskStyle(receipt.riskLevel);

  return (
    <View className="flex-row items-start gap-3">
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        className="min-h-12 w-10 items-start justify-center"
        onPress={() => router.back()}
      >
        <Text className="text-[34px] leading-9 text-neo-text">{"<"}</Text>
      </Pressable>

      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-3">
          <Text className="text-[28px] font-bold leading-9 text-neo-text">
            Receipt review
          </Text>
          <View
            className={`min-h-10 flex-row items-center gap-2 rounded-lg border px-3 ${riskStyle.borderClassName} ${riskStyle.backgroundClassName}`}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconWarning}
              style={{ height: 18, tintColor: riskStyle.tintColor, width: 18 }}
            />
            <Text className={`text-[14px] font-bold leading-5 ${riskStyle.textClassName}`}>
              {receipt.statusLabel}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-[16px] leading-6 text-neo-text-muted">
          Manual transfer screenshot
        </Text>
      </View>

      <Pressable
        accessibilityLabel="More receipt actions"
        accessibilityRole="button"
        className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
      >
        <Text className="text-[28px] font-bold leading-8 text-neo-text">...</Text>
      </Pressable>
    </View>
  );
}

function NoticeBanner({ notice }: { notice: Notice }) {
  return (
    <View className="mt-4 rounded-lg border border-neo-info bg-[#EDF6FA] px-4 py-3">
      <Text className="text-[15px] font-bold leading-5 text-neo-info">
        {notice.title}
      </Text>
      <Text className="mt-1 text-[14px] leading-5 text-neo-text">
        {notice.message}
      </Text>
    </View>
  );
}

function OrderSummary({ receipt }: { receipt: ReceiptReviewRecord }) {
  const orderHref = `/order/${receipt.orderRouteId}` as Href;

  return (
    <View className="mt-5 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <View className="flex-row items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#0F7A5A]">
          <Text className="text-[23px] font-bold leading-8 text-white">
            {receipt.customerInitials}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="text-[21px] font-bold leading-7 text-neo-text"
            numberOfLines={1}
          >
            {receipt.customerName}
          </Text>
          <Text
            className="mt-1 text-[15px] leading-5 text-neo-text"
            numberOfLines={1}
          >
            Order {receipt.orderDisplayId}
          </Text>
          <Text
            className="mt-1 text-[14px] leading-5 text-neo-text-muted"
            numberOfLines={2}
          >
            {receipt.placedAt}
          </Text>
        </View>

        <View className="items-end gap-2">
          <Link asChild href={orderHref}>
            <Pressable
              accessibilityLabel={`Open order ${receipt.orderDisplayId}`}
              accessibilityRole="link"
              className="min-h-11 flex-row items-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-3"
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconOrder}
                style={{ height: 20, tintColor: colors.primary, width: 20 }}
              />
              <Text className="text-[14px] font-bold leading-5 text-neo-text">
                Open order
              </Text>
            </Pressable>
          </Link>
          <Text className="text-right text-[13px] leading-4 text-neo-text-muted">
            Total due
          </Text>
          <Text
            className="text-right text-[20px] font-bold leading-6 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatReceiptNaira(receipt.expectedAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({
  action,
  icon,
  title,
}: {
  action?: ReactNode;
  icon: ImageSourcePropType;
  title: string;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={icon}
          style={{ height: 24, tintColor: colors.text, width: 24 }}
        />
        <Text
          className="min-w-0 flex-1 text-[18px] font-bold leading-6 text-neo-text"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

function ReceiptPreview({
  isZoomed,
  onToggleZoom,
  receipt,
}: {
  isZoomed: boolean;
  onToggleZoom: () => void;
  receipt: ReceiptReviewRecord;
}) {
  const previewHeight = isZoomed ? 420 : 304;

  return (
    <View className="mt-4 overflow-hidden rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
      <SectionHeader
        action={
          <Pressable
            accessibilityLabel={isZoomed ? "Reduce receipt preview" : "Zoom receipt preview"}
            accessibilityRole="button"
            accessibilityState={{ expanded: isZoomed }}
            className="min-h-10 flex-row items-center gap-2 px-2"
            onPress={onToggleZoom}
          >
            <Text className="text-[24px] font-bold leading-6 text-neo-info">+</Text>
            <Text className="text-[15px] font-bold leading-5 text-neo-info">
              {isZoomed ? "Reduce" : "Zoom"}
            </Text>
          </Pressable>
        }
        icon={images.iconReceiptReview}
        title="Receipt image"
      />

      <View
        className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-[#F8FAFA]"
        style={{ height: previewHeight }}
      >
        <View className="flex-1 flex-row">
          <View className="w-[21%] bg-[#2D3941]" />
          <View className="min-w-0 flex-1 items-center justify-start px-4 py-6">
            <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-[#2A7B64]">
              <Text className="text-[30px] font-bold leading-8 text-[#2A7B64]">
                OK
              </Text>
            </View>
            <Text className="mt-3 text-center text-[19px] font-bold leading-6 text-neo-text">
              {receipt.previewTitle}
            </Text>
            <Text className="mt-2 text-center text-[14px] leading-5 text-neo-text-muted">
              {receipt.previewSubtitle}
            </Text>

            <View className="mt-5 w-full rounded-lg border border-neo-border bg-neo-surface px-4 py-3">
              {receipt.previewLines.map((line, index) => (
                <View
                  className={`flex-row items-center justify-between gap-3 py-2 ${
                    index > 0 ? "border-t border-neo-border" : ""
                  }`}
                  key={line.label}
                >
                  <Text className="min-w-[82px] text-[13px] leading-4 text-neo-text-muted">
                    {line.label}
                  </Text>
                  <Text
                    className={`min-w-0 flex-1 text-right text-[14px] leading-5 ${
                      line.value.startsWith("\u20A6")
                        ? "font-bold text-neo-text"
                        : "text-neo-text"
                    }`}
                    numberOfLines={2}
                    style={{ fontVariant: ["tabular-nums"] }}
                  >
                    {line.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View className="w-[21%] bg-[#2D3941]" />
        </View>

        <View className="absolute bottom-3 left-3 rounded-md bg-[#1F2522] px-2 py-1">
          <Text className="text-[13px] font-bold leading-4 text-white">1 of 1</Text>
        </View>
      </View>
    </View>
  );
}

function RowStatusPill({ row }: { row: ReceiptExtractedRow }) {
  const statusStyle = getRowStatusStyle(row.status);

  return (
    <View
      className={`min-h-8 flex-row items-center gap-2 rounded-md border px-2 ${statusStyle.borderClassName} ${statusStyle.backgroundClassName}`}
    >
      <Text className={`text-[13px] font-bold leading-4 ${statusStyle.textClassName}`}>
        {row.statusLabel}
      </Text>
      <Text className={`text-[13px] font-bold leading-4 ${statusStyle.textClassName}`}>
        {row.status === "matches" ? "OK" : row.status === "detected" ? "i" : "!"}
      </Text>
    </View>
  );
}

function ExtractedRow({
  row,
  showDivider,
}: {
  row: ReceiptExtractedRow;
  showDivider: boolean;
}) {
  return (
    <View className={`flex-row gap-3 px-3 py-3 ${showDivider ? "border-b border-neo-border" : ""}`}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={row.icon}
        style={{ height: 24, marginTop: 2, tintColor: colors.text, width: 24 }}
      />

      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-start justify-between gap-2">
          <View className="min-w-0 flex-1">
            <Text
              className="text-[15px] font-bold leading-5 text-neo-text"
              numberOfLines={2}
            >
              {row.label}
            </Text>
            <Text
              className="mt-1 text-[16px] leading-6 text-neo-text"
              numberOfLines={2}
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {row.value}
            </Text>
          </View>
          <RowStatusPill row={row} />
        </View>
        {row.note ? (
          <Text className="mt-2 text-[13px] leading-5 text-neo-text-muted">
            {row.note}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function ExtractedDetails({ receipt }: { receipt: ReceiptReviewRecord }) {
  return (
    <View className="mt-4 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      <View className="px-3 py-3">
        <SectionHeader
          action={
            <View className="flex-row items-center gap-2">
              <Text
                className={`text-[14px] font-bold leading-5 ${
                  receipt.confidence < 50 ? "text-neo-error" : "text-neo-info"
                }`}
                style={{ fontVariant: ["tabular-nums"] }}
              >
                Confidence: {receipt.confidence}%
              </Text>
              <View className="h-7 w-7 items-center justify-center rounded-full border border-neo-info">
                <Text className="text-[14px] font-bold leading-5 text-neo-info">
                  i
                </Text>
              </View>
            </View>
          }
          icon={images.iconReceiptReview}
          title="Extracted details"
        />
      </View>

      <View className="border-t border-neo-border">
        {receipt.extractedRows.map((row, index) => (
          <ExtractedRow
            key={row.id}
            row={row}
            showDivider={index < receipt.extractedRows.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function PaymentComparison({ receipt }: { receipt: ReceiptReviewRecord }) {
  const hasExtractedAmount = typeof receipt.extractedAmount === "number";
  const amountsMatch = hasExtractedAmount && receipt.extractedAmount === receipt.expectedAmount;
  const statusRow: ReceiptExtractedRow = {
    icon: images.iconPaid,
    id: "comparison-status",
    label: "Amount comparison",
    status: amountsMatch ? "matches" : "mismatch",
    statusLabel: amountsMatch ? "Matches" : "Review",
    value: amountsMatch ? "Amounts match" : "Amount needs review",
  };

  return (
    <View className="mt-4 rounded-lg border border-[#E6C88E] bg-[#FFF8EA] px-3 py-3">
      <SectionHeader
        action={
          <View className="flex-row items-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconWarning}
              style={{ height: 18, tintColor: colors.warning, width: 18 }}
            />
            <Text className="text-[14px] font-bold leading-5 text-neo-warning">
              Review differences
            </Text>
          </View>
        }
        icon={images.iconPaid}
        title="Payment comparison"
      />

      <View className="mt-3 rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
        <View className="flex-row items-center gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-[14px] leading-5 text-neo-text-muted">
              Expected amount
            </Text>
            <Text
              className="mt-1 text-[20px] font-bold leading-7 text-neo-text"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatReceiptNaira(receipt.expectedAmount)}
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full border border-[#E6C88E] bg-[#FFF3DD]">
            <Text className="text-[22px] font-bold leading-7 text-neo-warning">
              =
            </Text>
          </View>

          <View className="min-w-0 flex-1">
            <Text className="text-right text-[14px] leading-5 text-neo-text-muted">
              Extracted amount
            </Text>
            <Text
              className={`mt-1 text-right text-[20px] font-bold leading-7 ${
                amountsMatch ? "text-neo-success" : "text-neo-error"
              }`}
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {hasExtractedAmount
                ? formatReceiptNaira(receipt.extractedAmount ?? 0)
                : "Not clear"}
            </Text>
          </View>
        </View>

        <View className="mt-3 items-end">
          <RowStatusPill row={statusRow} />
        </View>
      </View>
    </View>
  );
}

function WarningBlock({ receipt }: { receipt: ReceiptReviewRecord }) {
  return (
    <View className="mt-4 flex-row gap-4 rounded-lg border border-[#E9B27A] bg-[#FFF8EA] px-4 py-4">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#E58A18]">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconWarning}
          style={{ height: 34, tintColor: colors.surface, width: 34 }}
        />
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          Verify against bank alert before confirming.
        </Text>
        {receipt.warningLines.map((line) => (
          <Text className="mt-1 text-[15px] leading-6 text-neo-text" key={line}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

function DecisionConfirmation({
  decision,
  onCancel,
  onSave,
}: {
  decision: ReceiptDecision;
  onCancel: () => void;
  onSave: () => void;
}) {
  const config = getDecisionConfig(decision);

  return (
    <View className={`mt-4 rounded-lg border px-4 py-4 ${config.borderClassName}`}>
      <View className="flex-row gap-3">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={config.icon}
          style={{ height: 32, tintColor: config.tintColor, width: 32 }}
        />
        <View className="min-w-0 flex-1">
          <Text className={`text-[17px] font-bold leading-6 ${config.textClassName}`}>
            {config.title}
          </Text>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text">
            {config.body}
          </Text>
          <Text className="mt-1 text-[13px] leading-5 text-neo-text-muted">
            This is local-only. No payment, message, or backend action will run.
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        <Pressable
          accessibilityLabel={config.actionLabel}
          accessibilityRole="button"
          className="min-h-12 flex-1 basis-[58%] items-center justify-center rounded-lg bg-neo-primary px-3"
          onPress={onSave}
        >
          <Text className="text-center text-[15px] font-bold leading-5 text-white">
            {config.actionLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Cancel receipt decision"
          accessibilityRole="button"
          className="min-h-12 flex-1 basis-[32%] items-center justify-center rounded-lg border border-neo-border bg-neo-surface px-3"
          onPress={onCancel}
        >
          <Text className="text-[15px] font-bold leading-5 text-neo-text">
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function DecisionFeedback({ decision }: { decision: ReceiptDecision }) {
  const config = getDecisionConfig(decision);

  return (
    <View className={`mt-4 rounded-lg border px-4 py-4 ${config.borderClassName}`}>
      <View className="flex-row gap-3">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={config.icon}
          style={{ height: 34, tintColor: config.tintColor, width: 34 }}
        />
        <View className="min-w-0 flex-1">
          <Text className={`text-[16px] font-bold leading-6 ${config.textClassName}`}>
            {config.savedTitle}
          </Text>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text">
            {config.savedMessage}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReceiptActionButton({
  decision,
  disabled,
  onPress,
}: {
  decision: ReceiptDecision;
  disabled: boolean;
  onPress: (decision: ReceiptDecision) => void;
}) {
  if (decision === "confirm") {
    return (
      <Pressable
        accessibilityLabel="Confirm payment after checking bank alert"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={`min-h-14 flex-1 basis-[48%] flex-row items-center justify-center gap-3 rounded-lg px-3 ${
          disabled ? "bg-neo-surface-alt" : "bg-neo-primary"
        }`}
        disabled={disabled}
        onPress={() => onPress(decision)}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconPaid}
          style={{
            height: 26,
            tintColor: disabled ? colors.textMuted : colors.surface,
            width: 26,
          }}
        />
        <Text
          className={`text-center text-[16px] font-bold leading-5 ${
            disabled ? "text-neo-text-muted" : "text-white"
          }`}
        >
          Confirm payment
        </Text>
      </Pressable>
    );
  }

  if (decision === "reject") {
    return (
      <Pressable
        accessibilityLabel="Reject receipt"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={`min-h-14 flex-1 basis-[32%] flex-row items-center justify-center gap-2 rounded-lg border px-3 ${
          disabled
            ? "border-neo-border bg-neo-surface-alt"
            : "border-neo-error bg-neo-surface"
        }`}
        disabled={disabled}
        onPress={() => onPress(decision)}
      >
        <Text
          className={`text-[24px] font-bold leading-6 ${
            disabled ? "text-neo-text-muted" : "text-neo-error"
          }`}
        >
          x
        </Text>
        <Text
          className={`text-center text-[15px] font-bold leading-5 ${
            disabled ? "text-neo-text-muted" : "text-neo-error"
          }`}
        >
          Reject receipt
        </Text>
      </Pressable>
    );
  }

  if (decision === "ask") {
    return (
      <Pressable
        accessibilityLabel="Ask customer about receipt"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={`min-h-14 flex-1 basis-[32%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border px-3 ${
          disabled ? "bg-neo-surface-alt" : "bg-neo-surface"
        }`}
        disabled={disabled}
        onPress={() => onPress(decision)}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconInbox}
          style={{
            height: 24,
            tintColor: disabled ? colors.textMuted : colors.text,
            width: 24,
          }}
        />
        <Text
          className={`text-center text-[15px] font-bold leading-5 ${
            disabled ? "text-neo-text-muted" : "text-neo-text"
          }`}
        >
          Ask customer
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityLabel="Escalate receipt to manager"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg border border-neo-border px-3 ${
        disabled ? "bg-neo-surface-alt" : "bg-neo-surface"
      }`}
      disabled={disabled}
      onPress={() => onPress(decision)}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.iconPermission}
        style={{
          height: 24,
          tintColor: disabled ? colors.textMuted : colors.text,
          width: 24,
        }}
      />
      <Text
        className={`text-center text-[16px] font-bold leading-5 ${
          disabled ? "text-neo-text-muted" : "text-neo-text"
        }`}
      >
        Escalate to manager
      </Text>
      <Text className="text-[24px] font-bold leading-7 text-neo-text-muted">
        v
      </Text>
    </Pressable>
  );
}

function DecisionActions({
  allowConfirm,
  disabled,
  onSelectDecision,
}: {
  allowConfirm: boolean;
  disabled: boolean;
  onSelectDecision: (decision: ReceiptDecision) => void;
}) {
  return (
    <View className="mt-4 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <Text className="text-[18px] font-bold leading-6 text-neo-text">
        Your decision
      </Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {allowConfirm ? (
          <ReceiptActionButton
            decision="confirm"
            disabled={disabled}
            onPress={onSelectDecision}
          />
        ) : null}
        <ReceiptActionButton
          decision="ask"
          disabled={disabled}
          onPress={onSelectDecision}
        />
        <ReceiptActionButton
          decision="reject"
          disabled={disabled}
          onPress={onSelectDecision}
        />
        <ReceiptActionButton
          decision="escalate"
          disabled={disabled}
          onPress={onSelectDecision}
        />
      </View>
      <View className="mt-3 flex-row items-center justify-center gap-2">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconPermission}
          style={{ height: 18, tintColor: colors.textMuted, width: 18 }}
        />
        <Text className="text-center text-[13px] leading-5 text-neo-text-muted">
          Your decision will update only this local mock screen.
        </Text>
      </View>
    </View>
  );
}

function UnreadableReceiptPanel({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <View className="mt-4 rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.errorReceiptUnreadable}
        style={{ alignSelf: "center", height: 150, width: 190 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        Receipt image could not be read
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        The screenshot is too blurry or cropped for a safe review. Ask the customer
        for a clearer receipt and check your bank alert before any payment decision.
      </Text>
      <Pressable
        accessibilityLabel="Retry reading receipt image"
        accessibilityRole="button"
        className="mt-5 min-h-12 items-center justify-center rounded-lg border border-neo-primary bg-neo-surface px-4"
        onPress={onRetry}
      >
        <Text className="text-[15px] font-bold leading-5 text-neo-primary">
          Retry image review
        </Text>
      </Pressable>
    </View>
  );
}

function SecondaryLinks({ receipt }: { receipt: ReceiptReviewRecord }) {
  const orderHref = `/order/${receipt.orderRouteId}` as Href;
  const conversationHref = `/conversation/${receipt.conversationId}` as Href;

  return (
    <View className="mt-4 flex-row flex-wrap gap-2">
      <Link asChild href={orderHref}>
        <Pressable
          accessibilityLabel={`Open order ${receipt.orderDisplayId}`}
          accessibilityRole="link"
          className="min-h-12 flex-1 basis-[45%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-3"
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconOrder}
            style={{ height: 22, tintColor: colors.text, width: 22 }}
          />
          <Text className="text-center text-[14px] font-bold leading-5 text-neo-text">
            Open order
          </Text>
        </Pressable>
      </Link>

      <Link asChild href={conversationHref}>
        <Pressable
          accessibilityLabel={`View conversation for ${receipt.customerName}`}
          accessibilityRole="link"
          className="min-h-12 flex-1 basis-[45%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-3"
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconInbox}
            style={{ height: 22, tintColor: colors.text, width: 22 }}
          />
          <Text className="text-center text-[14px] font-bold leading-5 text-neo-text">
            View conversation
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

function MissingReceiptState({ receiptId }: { receiptId?: string }) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neo-background px-5 py-16">
      <View className="rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.emptyReceipts}
          style={{ alignSelf: "center", height: 150, width: 190 }}
        />
        <Text className="mt-4 text-[20px] font-bold leading-7 text-neo-text">
          Receipt not found
        </Text>
        <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
          This local mock receipt is not available. Go back and open another
          receipt review.
        </Text>
        {receiptId ? (
          <Text className="mt-3 text-[13px] font-semibold leading-5 text-neo-text-muted">
            ID: {receiptId}
          </Text>
        ) : null}
        <Pressable
          accessibilityLabel="Go back from missing receipt"
          accessibilityRole="button"
          className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-4"
          onPress={() => router.back()}
        >
          <Text className="text-[15px] font-bold leading-5 text-white">Go back</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ReceiptReviewScreen({
  initialState = "ready",
  mockRole = "owner",
  receiptId,
}: {
  initialState?: MockScreenState;
  mockRole?: MockStaffRole;
  receiptId?: string;
}) {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const receipt = useMemo(() => getReceiptReviewById(receiptId), [receiptId]);
  const [screenState, setScreenState] = useState<MockScreenState>(initialState);
  const [decision, setDecision] = useState<ReceiptDecision | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingDecision, setPendingDecision] = useState<ReceiptDecision | null>(
    null,
  );

  useEffect(() => {
    trackScreenStateSeen({
      errorCategory: "receipt_review_load_failed",
      hasCachedData: Boolean(receipt),
      screen: "receipt_review",
      state: screenState,
    });
  }, [receipt, screenState]);

  useEffect(() => {
    if (
      !receipt ||
      screenState === "loading" ||
      screenState === "error" ||
      screenState === "empty"
    ) {
      return;
    }

    trackAnalyticsEvent("receipt_review_opened", {
      confidence_band: getConfidenceBand(receipt.confidence),
      source: "direct",
    });
  }, [receipt, screenState]);

  if (screenState === "loading") {
    return (
      <ScrollView
        className="flex-1 bg-neo-background"
        contentContainerClassName="items-center"
        contentContainerStyle={{
          paddingBottom: 32,
          paddingHorizontal: horizontalPadding,
          paddingTop: isCompactPhone ? 28 : 44,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px]">
          <SkeletonRows count={5} />
        </View>
      </ScrollView>
    );
  }

  if (screenState === "error") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          actionLabel="Retry receipt review"
          image={images.errorReceiptUnreadable}
          message="The receipt image or extracted details failed to load. Try again before making any payment decision."
          onAction={() => setScreenState("ready")}
          title="Could not load receipt"
        />
      </View>
    );
  }

  if (screenState === "empty") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          actionLabel="Go back"
          image={images.emptyReceipts}
          message="No receipt is attached to this local order yet. Open a linked order or ask the customer for a clearer transfer receipt."
          onAction={() => router.back()}
          title="No receipt found"
        />
      </View>
    );
  }

  if (!receipt) {
    return <MissingReceiptState receiptId={receiptId} />;
  }

  const effectiveRole = screenState === "permission" ? "staff" : mockRole;
  const decisionsDisabled = screenState === "offline";
  const decisionsBlockedByRole =
    screenState === "permission" ||
    !canPerformSensitiveAction({
      action: "receipt-decision",
      role: effectiveRole,
    });
  const permissionHref = getPermissionDeniedHref({
    action: "receipt-decision",
    role: effectiveRole,
  });

  function requestDecision(nextDecision: ReceiptDecision) {
    if (decisionsDisabled) {
      setNotice({
        message:
          "Receipt decisions are disabled offline. Review the receipt, then reconnect before saving a decision.",
        title: "Decision paused",
      });
      return;
    }

    if (decisionsBlockedByRole) {
      router.push(permissionHref);
      return;
    }

    setPendingDecision(nextDecision);
    setNotice(null);
  }

  function savePendingDecision() {
    if (!pendingDecision || !receipt) {
      return;
    }

    const config = getDecisionConfig(pendingDecision);
    trackAnalyticsEvent("receipt_decision_recorded", {
      amount_band: getAmountBand(receipt.expectedAmount),
      confidence_band: getConfidenceBand(receipt.confidence),
      decision_type: pendingDecision,
    });
    setDecision(pendingDecision);
    setNotice({
      message:
        "Saved to local UI only. No payment status, customer message, or backend record was changed.",
      title: config.savedTitle,
    });
    setPendingDecision(null);
  }

  function retryUnreadableReview() {
    setNotice({
      message:
        "Retry is local-only in this mock. No OCR, bank lookup, or payment verification was run.",
      title: "Image review still needs a clearer receipt",
    });
  }

  return (
    <ScrollView
      className="flex-1 bg-neo-background"
      contentContainerClassName="items-center"
      contentContainerStyle={{
        paddingBottom: 32,
        paddingHorizontal: horizontalPadding,
        paddingTop: isCompactPhone ? 28 : 44,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <Header receipt={receipt} />
        {notice ? <NoticeBanner notice={notice} /> : null}
        {screenState === "offline" ? (
          <StateBanner
            message="You can inspect the cached receipt, but confirm, reject, ask-customer, and escalation decisions stay disabled until Neo is online."
            title="Offline receipt review"
            tone="offline"
          />
        ) : null}
        {screenState === "permission" ? (
          <StateBanner
            message="Payment decisions require owner or manager permission. Ask the owner/admin before confirming or rejecting this transfer."
            title="Payment permission needed"
            tone="permission"
          />
        ) : null}
        {screenState !== "permission" && decisionsBlockedByRole ? (
          <StateBanner
            message="Your current mock role can inspect this receipt, but payment decisions need owner or manager permission."
            title="Payment permission needed"
            tone="permission"
          />
        ) : null}
        <OrderSummary receipt={receipt} />
        {receipt.state === "unreadable" ? (
          <UnreadableReceiptPanel onRetry={retryUnreadableReview} />
        ) : (
          <ReceiptPreview
            isZoomed={isZoomed}
            onToggleZoom={() => setIsZoomed((currentValue) => !currentValue)}
            receipt={receipt}
          />
        )}
        <ExtractedDetails receipt={receipt} />
        {receipt.state === "ready" ? <PaymentComparison receipt={receipt} /> : null}
        <WarningBlock receipt={receipt} />
        {decision ? <DecisionFeedback decision={decision} /> : null}
        {pendingDecision ? (
          <DecisionConfirmation
            decision={pendingDecision}
            onCancel={() => setPendingDecision(null)}
            onSave={savePendingDecision}
          />
        ) : null}
        <DecisionActions
          allowConfirm={receipt.state === "ready"}
          disabled={decisionsDisabled}
          onSelectDecision={requestDecision}
        />
        <SecondaryLinks receipt={receipt} />
      </View>
    </ScrollView>
  );
}
