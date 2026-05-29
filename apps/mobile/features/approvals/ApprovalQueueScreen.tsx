import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import { StateBanner } from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import type { MockStaffRole } from "@/features/permissions/permissionData";
import {
  canPerformSensitiveAction,
  getDeniedRoleFromDetails,
  getPermissionDeniedHref,
  getRoleScopedReceiptHref,
} from "@/features/permissions/permissionData";
import {
  getConfidenceBand,
  trackAnalyticsEvent,
  trackScreenStateSeen,
} from "@/lib/analytics";
import { decideApproval, getApprovals, useApiClient } from "@/lib/api";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useOperationsStore } from "@/stores/useOperationsStore";

import type {
  ApprovalDecision,
  ApprovalFilter,
  ApprovalQueueItem,
  ApprovalRiskLevel,
} from "./approvalQueueData";
import {
  approvalFilters,
  filterApprovalItems,
  getApprovalCounts,
  initialApprovalItems,
  normalizeBackendApproval,
} from "./approvalQueueData";

type ApprovalViewState = "ready" | "loading" | "error";

type Notice = {
  message: string;
  title: string;
};

type DecisionState = Record<string, ApprovalDecision>;

function getRiskStyle(riskLevel: ApprovalRiskLevel) {
  if (riskLevel === "high") {
    return {
      borderClassName: "border-neo-error",
      backgroundClassName: "bg-[#FFF1EF]",
      textClassName: "text-neo-error",
      tintColor: colors.error,
    };
  }

  if (riskLevel === "medium") {
    return {
      borderClassName: "border-neo-warning",
      backgroundClassName: "bg-[#FFF7E5]",
      textClassName: "text-neo-warning",
      tintColor: colors.warning,
    };
  }

  return {
    borderClassName: "border-neo-info",
    backgroundClassName: "bg-[#EDF6FA]",
    textClassName: "text-neo-info",
    tintColor: colors.info,
  };
}

function getCategoryIcon(filter: ApprovalFilter): ImageSourcePropType {
  if (filter === "payments") {
    return images.iconReceiptReview;
  }

  if (filter === "complaints") {
    return images.iconInbox;
  }

  if (filter === "discounts") {
    return images.iconPaid;
  }

  if (filter === "low-confidence") {
    return images.iconAiDraft;
  }

  return images.iconApprovals;
}

function getDecisionLabel(decision: ApprovalDecision) {
  if (decision === "approved") {
    return "Approved";
  }

  if (decision === "edited") {
    return "Edited";
  }

  if (decision === "asked") {
    return "Asked customer";
  }

  if (decision === "escalated") {
    return "Escalated";
  }

  return "Rejected";
}

function Header({
  pendingCount,
  showSearch,
  toggleSearch,
}: {
  pendingCount: number;
  showSearch: boolean;
  toggleSearch: () => void;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-3">
          <Text className="text-[32px] font-bold leading-10 text-neo-text">
            Approvals
          </Text>
          <View className="min-h-10 min-w-12 items-center justify-center rounded-lg border border-[#E9B27A] bg-[#FFF4E6] px-3">
            <Text
              className="text-[22px] font-bold leading-7 text-neo-warning"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {pendingCount}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-[16px] leading-6 text-neo-text-muted">
          Decisions needed from you
        </Text>
      </View>

      <Pressable
        accessibilityLabel={showSearch ? "Hide approval search" : "Search approvals"}
        accessibilityRole="button"
        accessibilityState={{ selected: showSearch }}
        className="min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        onPress={toggleSearch}
      >
        <Text className="text-[13px] font-bold leading-5 text-neo-text">
          {showSearch ? "Hide" : "Find"}
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel="Filter approvals"
        accessibilityRole="button"
        className="min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconSettings}
          style={{ height: 28, tintColor: colors.text, width: 28 }}
        />
      </Pressable>
    </View>
  );
}

function SafetyRuleBar() {
  return (
    <View className="mt-5 flex-row items-center gap-3 rounded-lg border border-neo-border bg-neo-surface-alt px-4 py-3">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.iconPermission}
        style={{ height: 24, tintColor: colors.primary, width: 24 }}
      />
      <Text className="min-w-0 flex-1 text-[15px] font-bold leading-5 text-neo-text">
        Assist-first. Approval-first.
      </Text>
      <Text className="text-[14px] font-bold leading-5 text-neo-primary">
        Approval rules
      </Text>
      <Text className="text-[22px] font-bold leading-6 text-neo-text-muted">
        {">"}
      </Text>
    </View>
  );
}

function SearchBox({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <View className="mt-4 rounded-lg border border-neo-border bg-neo-surface px-4 py-2">
      <TextInput
        accessibilityLabel="Search approval queue"
        className="min-h-11 text-[16px] leading-6 text-neo-text"
        onChangeText={setQuery}
        placeholder="Search customer, order, or reason"
        placeholderTextColor={colors.textMuted}
        value={query}
      />
    </View>
  );
}

function FilterChips({
  activeFilter,
  counts,
  setActiveFilter,
}: {
  activeFilter: ApprovalFilter;
  counts: ReturnType<typeof getApprovalCounts>;
  setActiveFilter: (filter: ApprovalFilter) => void;
}) {
  return (
    <ScrollView
      className="mt-5"
      contentContainerStyle={{ gap: 10, paddingRight: 2 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {approvalFilters.map((filter) => {
        const isActive = filter.id === activeFilter;
        const count = counts[filter.id];

        return (
          <Pressable
            accessibilityLabel={`Show ${filter.label} approvals`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`min-h-11 flex-row items-center gap-2 rounded-full border px-4 ${
              isActive
                ? "border-neo-primary bg-neo-primary"
                : "border-neo-border bg-neo-surface"
            }`}
            key={filter.id}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={getCategoryIcon(filter.id)}
              style={{
                height: 20,
                tintColor: isActive ? colors.surface : colors.text,
                width: 20,
              }}
            />
            <Text
              className={`text-[14px] font-bold leading-5 ${
                isActive ? "text-white" : "text-neo-text"
              }`}
            >
              {filter.label}
            </Text>
            <View
              className={`min-h-7 min-w-7 items-center justify-center rounded-full px-2 ${
                isActive ? "bg-[#2F6B57]" : "bg-neo-background"
              }`}
            >
              <Text
                className={`text-[13px] font-bold leading-4 ${
                  isActive ? "text-white" : "text-neo-text-muted"
                }`}
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function SourceChips({ item }: { item: ApprovalQueueItem }) {
  return (
    <View className="mt-3 flex-row flex-wrap items-center gap-2">
      {[
        { icon: images.iconInbox, label: item.contextLabel },
        { icon: images.iconAiDraft, label: item.sourceLabel },
        { icon: images.iconApprovals, label: `Confidence: ${item.confidence}%` },
      ].map((chip) => (
        <View className="min-h-9 flex-row items-center gap-2 px-2" key={chip.label}>
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={chip.icon}
            style={{ height: 18, tintColor: colors.textMuted, width: 18 }}
          />
          <Text
            className={`text-[13px] leading-4 ${
              chip.label.startsWith("Confidence") && item.confidence < 70
                ? "font-bold text-neo-warning"
                : "text-neo-text-muted"
            }`}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {chip.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function DecisionPill({ decision }: { decision: ApprovalDecision }) {
  const isRejected = decision === "rejected";

  return (
    <View
      className={`mt-3 rounded-lg border px-3 py-2 ${
        isRejected ? "border-neo-error bg-[#FFF1EF]" : "border-neo-success bg-[#EEF8F0]"
      }`}
    >
      <Text
        className={`text-[14px] font-bold leading-5 ${
          isRejected ? "text-neo-error" : "text-neo-success"
        }`}
      >
        {getDecisionLabel(decision)}
      </Text>
      <Text className="mt-1 text-[13px] leading-5 text-neo-text">
        No customer message, payment confirmation, or AI reply was sent automatically.
      </Text>
    </View>
  );
}

function EditPanel({
  draftText,
  onCancel,
  onSave,
  setDraftText,
}: {
  draftText: string;
  onCancel: () => void;
  onSave: () => void;
  setDraftText: (value: string) => void;
}) {
  return (
    <View className="mt-3 rounded-lg border border-neo-info bg-[#EDF6FA] px-3 py-3">
      <Text className="text-[14px] font-bold leading-5 text-neo-info">
        Edit before approval
      </Text>
      <TextInput
        accessibilityLabel="Edit approval draft"
        className="mt-2 min-h-[96px] rounded-lg border border-neo-border bg-neo-surface px-3 py-2 text-[15px] leading-6 text-neo-text"
        multiline
        onChangeText={setDraftText}
        textAlignVertical="top"
        value={draftText}
      />
      <View className="mt-3 flex-row gap-2">
        <Pressable
          accessibilityLabel="Save edited approval"
          accessibilityRole="button"
          className="min-h-11 flex-1 items-center justify-center rounded-lg bg-neo-primary px-3"
          onPress={onSave}
        >
          <Text className="text-[14px] font-bold leading-5 text-white">
            Save edit
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Cancel approval edit"
          accessibilityRole="button"
          className="min-h-11 flex-1 items-center justify-center rounded-lg border border-neo-border bg-neo-surface px-3"
          onPress={onCancel}
        >
          <Text className="text-[14px] font-bold leading-5 text-neo-text">
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ApprovalCard({
  actionsDisabled,
  decision,
  draftText,
  editingId,
  item,
  mockRole,
  onApprove,
  onAsk,
  onEdit,
  onEscalate,
  onReject,
  onSaveEdit,
  setDraftText,
  stopEditing,
}: {
  actionsDisabled: boolean;
  decision?: ApprovalDecision;
  draftText: string;
  editingId: string | null;
  item: ApprovalQueueItem;
  mockRole: MockStaffRole;
  onApprove: (item: ApprovalQueueItem) => void;
  onAsk: (item: ApprovalQueueItem) => void;
  onEdit: (item: ApprovalQueueItem) => void;
  onEscalate: (item: ApprovalQueueItem) => void;
  onReject: (item: ApprovalQueueItem) => void;
  onSaveEdit: (item: ApprovalQueueItem) => void;
  setDraftText: (value: string) => void;
  stopEditing: () => void;
}) {
  const riskStyle = getRiskStyle(item.riskLevel);
  const isEditing = editingId === item.id;
  const receiptHref = item.receiptId
    ? getRoleScopedReceiptHref({ receiptId: item.receiptId, role: mockRole })
    : null;
  const showApproveButton = item.actionKind === "review-request";
  const showEscalateButton = item.actionKind === "review-draft";
  const secondaryLabel = showEscalateButton
    ? "Escalate"
    : showApproveButton
      ? "Counter offer"
      : "Ask customer";

  return (
    <View className="rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <View className="flex-row gap-3">
        <View
          className={`h-16 w-16 items-center justify-center rounded-full border ${riskStyle.borderClassName} ${riskStyle.backgroundClassName}`}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={item.icon}
            style={{ height: 34, tintColor: riskStyle.tintColor, width: 34 }}
          />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <View
              className={`rounded-md border px-2 py-1 ${riskStyle.borderClassName} ${riskStyle.backgroundClassName}`}
            >
              <Text className={`text-[13px] font-bold leading-4 ${riskStyle.textClassName}`}>
                {item.riskLabel}
              </Text>
            </View>
            <View
              className={`rounded-md border px-2 py-1 ${riskStyle.borderClassName} ${riskStyle.backgroundClassName}`}
            >
              <Text className={`text-[13px] font-bold leading-4 ${riskStyle.textClassName}`}>
                {item.riskLevel === "high"
                  ? "High risk"
                  : item.riskLevel === "medium"
                    ? "Medium risk"
                    : "Low risk"}
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row gap-3">
            <View className="min-w-0 flex-1">
              <Text
                className="text-[19px] font-bold leading-6 text-neo-text"
                numberOfLines={2}
              >
                {item.draftTitle}
              </Text>
              <Text
                className="mt-1 text-[14px] leading-5 text-neo-text-muted"
                numberOfLines={2}
              >
                {item.orderId} - {item.customerName}
              </Text>
              <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
                {item.timestamp}
              </Text>
            </View>
            {item.amountLabel || item.detailLabel ? (
              <View className="max-w-[118px] items-end">
                {item.amountLabel ? (
                  <Text
                    className="text-right text-[17px] font-bold leading-6 text-neo-text"
                    style={{ fontVariant: ["tabular-nums"] }}
                  >
                    {item.amountLabel}
                  </Text>
                ) : null}
                {item.detailLabel ? (
                  <Text className="mt-1 text-right text-[14px] italic leading-5 text-neo-text-muted">
                    {item.detailLabel}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View className="mt-4 overflow-hidden rounded-lg border border-neo-border bg-[#FFF8EA]">
        <View className="flex-row">
          <View className="min-w-0 flex-1 px-3 py-3">
            <Text className="text-[14px] font-bold leading-5 text-neo-text">
              {item.suggestionTitle}
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text">
              {item.recommendation}
            </Text>
          </View>
          <View className="w-px bg-neo-border" />
          <View className="min-w-0 flex-1 px-3 py-3">
            <Text className="text-[14px] font-bold leading-5 text-neo-text">
              {item.category === "low-confidence" ? "Why low confidence" : "Key issue"}
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text">
              {item.issueTitle}
            </Text>
          </View>
        </View>
      </View>

      <SourceChips item={item} />

      {decision ? <DecisionPill decision={decision} /> : null}

      {isEditing ? (
        <EditPanel
          draftText={draftText}
          onCancel={stopEditing}
          onSave={() => onSaveEdit(item)}
          setDraftText={setDraftText}
        />
      ) : null}

      <View className="mt-3 border-t border-neo-border pt-3">
        <View className="flex-row flex-wrap gap-2">
          {receiptHref ? (
            <Link asChild href={receiptHref}>
              <Pressable
                accessibilityLabel={`Review receipt for ${item.customerName}`}
                accessibilityRole="link"
                className="min-h-12 flex-1 basis-[44%] flex-row items-center justify-center gap-2 rounded-lg bg-neo-primary px-3"
              >
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={images.iconReceiptReview}
                  style={{ height: 22, tintColor: colors.surface, width: 22 }}
                />
                <Text className="text-[15px] font-bold leading-5 text-white">
                  {item.primaryActionLabel}
                </Text>
              </Pressable>
            </Link>
          ) : (
            <Pressable
              accessibilityLabel={`${showApproveButton ? "Approve" : "Edit"} ${item.draftTitle}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: actionsDisabled }}
              className={`min-h-12 flex-1 basis-[44%] flex-row items-center justify-center gap-2 rounded-lg px-3 ${
                actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-primary"
              }`}
              disabled={actionsDisabled}
              onPress={() => (showApproveButton ? onApprove(item) : onEdit(item))}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={showApproveButton ? images.iconApprovals : images.iconAiDraft}
                style={{
                  height: 22,
                  tintColor: actionsDisabled ? colors.textMuted : colors.surface,
                  width: 22,
                }}
              />
              <Text
                className={`text-[15px] font-bold leading-5 ${
                  actionsDisabled ? "text-neo-text-muted" : "text-white"
                }`}
              >
                {showApproveButton ? "Approve" : item.primaryActionLabel}
              </Text>
            </Pressable>
          )}

          <Pressable
            accessibilityLabel={`${secondaryLabel} for ${item.draftTitle}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: actionsDisabled }}
            className={`min-h-12 flex-1 basis-[30%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border px-3 ${
              actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
            }`}
            disabled={actionsDisabled}
            onPress={() => (showEscalateButton ? onEscalate(item) : onAsk(item))}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={showEscalateButton ? images.iconPermission : images.iconInbox}
              style={{ height: 22, tintColor: colors.text, width: 22 }}
            />
            <Text className="text-[14px] font-bold leading-5 text-neo-text">
              {secondaryLabel}
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel={`Reject ${item.draftTitle}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: actionsDisabled }}
            className={`min-h-12 flex-1 basis-[24%] items-center justify-center rounded-lg border px-3 ${
              actionsDisabled
                ? "border-neo-border bg-neo-surface-alt"
                : "border-neo-error bg-neo-surface"
            }`}
            disabled={actionsDisabled}
            onPress={() => onReject(item)}
          >
            <Text
              className={`text-[14px] font-bold leading-5 ${
                actionsDisabled ? "text-neo-text-muted" : "text-neo-error"
              }`}
            >
              Reject
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ApprovalSkeleton() {
  return (
    <View className="mt-6 gap-4">
      {[0, 1, 2].map((item) => (
        <View
          className="h-56 rounded-lg border border-neo-border bg-neo-surface-alt"
          key={item}
        />
      ))}
    </View>
  );
}

function EmptyApprovals({
  actionLabel,
  onReset,
}: {
  actionLabel: string;
  onReset: () => void;
}) {
  return (
    <View className="mt-6 items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-8">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.emptyApprovals}
        style={{ height: 150, width: 180 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        No approvals waiting
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        Sensitive AI actions will appear here when they need owner or manager
        review.
      </Text>
      <Pressable
        accessibilityLabel={actionLabel}
        accessibilityRole="button"
        className="mt-5 min-h-12 items-center justify-center rounded-lg border border-neo-primary bg-neo-surface px-4"
        onPress={onReset}
      >
        <Text className="text-[15px] font-bold leading-5 text-neo-primary">
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function ErrorApprovals({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="mt-6 rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EF]">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.errorOffline}
          style={{ height: 40, width: 40 }}
        />
      </View>
      <Text className="mt-4 text-[20px] font-bold leading-7 text-neo-text">
        Could not load approvals
      </Text>
      <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
        Try again. Cached approvals should stay visible but decisions need a safe
        connection later.
      </Text>
      <Pressable
        accessibilityLabel="Retry loading approvals"
        accessibilityRole="button"
        className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-4"
        onPress={onRetry}
      >
        <Text className="text-[15px] font-bold leading-5 text-white">Retry</Text>
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

export function ApprovalQueueScreen({
  initialState = "ready",
  mockRole = "owner",
}: {
  initialState?: MockScreenState;
  mockRole?: MockStaffRole;
}) {
  const router = useRouter();
  const apiClient = useApiClient();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBackendMode = initialState === "ready";
  const setApprovalPendingCount = useOperationsStore(
    (store) => store.setApprovalPendingCount,
  );
  const [items, setItems] = useState<readonly ApprovalQueueItem[]>(
    isBackendMode ? [] : initialApprovalItems,
  );
  const [activeFilter, setActiveFilter] = useState<ApprovalFilter>("all");
  const [decisions, setDecisions] = useState<DecisionState>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [viewState, setViewState] = useState<ApprovalViewState>(
    initialState === "loading" || initialState === "error"
      ? initialState
      : isBackendMode
        ? "loading"
        : "ready",
  );
  const effectiveRole = initialState === "permission" ? "staff" : mockRole;
  const actionsDisabled = initialState === "offline";
  const actionsBlockedByRole =
    initialState === "permission" ||
    !canPerformSensitiveAction({
      action: "approval-decision",
      role: effectiveRole,
    });
  const permissionHref = getPermissionDeniedHref({
    action: "approval-decision",
    role: effectiveRole,
  });

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isBackendMode) {
      return;
    }

    let isActive = true;

    getApprovals(apiClient).then((result) => {
      if (!isActive) {
        return;
      }

      if (result.ok) {
        setItems(result.data.approvals.map(normalizeBackendApproval));
        setViewState("ready");
        return;
      }

      setNotice({
        message: result.error.message,
        title: "Approval queue failed",
      });
      setViewState("error");
    });

    return () => {
      isActive = false;
    };
  }, [apiClient, isBackendMode]);

  useEffect(() => {
    const screenStateForAnalytics: MockScreenState =
      viewState === "error" ? "error" : initialState === "error" ? "ready" : initialState;

    trackScreenStateSeen({
      errorCategory: "approval_queue_load_failed",
      hasCachedData: initialState !== "empty",
      screen: "approvals",
      state: screenStateForAnalytics,
    });
  }, [initialState, viewState]);

  const pendingItems = useMemo(
    () =>
      (initialState === "empty" ? [] : items).filter(
        (item) => !decisions[item.id],
      ),
    [decisions, initialState, items],
  );
  const counts = useMemo(() => getApprovalCounts(pendingItems), [pendingItems]);
  const visibleItems = useMemo(
    () =>
      filterApprovalItems({
        filter: activeFilter,
        items: pendingItems,
        query,
      }),
    [activeFilter, pendingItems, query],
  );

  useEffect(() => {
    setApprovalPendingCount(counts.all);
  }, [counts.all, setApprovalPendingCount]);

  async function decide(item: ApprovalQueueItem, decision: ApprovalDecision) {
    const isBackendApproval = isBackendRecordId(item.id);

    if (actionsBlockedByRole && !isBackendApproval) {
      router.push(permissionHref);
      return;
    }

    if (isBackendApproval) {
      const result = await decideApproval(apiClient, item.id, decision);

      if (!result.ok) {
        if (result.error.category === "permission_denied") {
          router.push(
            getPermissionDeniedHref({
              action: "approval-decision",
              role: getDeniedRoleFromDetails(result.error.details, effectiveRole),
            }),
          );
          return;
        }

        setNotice({
          message: result.error.message,
          title: "Approval decision failed",
        });
        return;
      }
    }

    if (
      (decision === "approved" || decision === "edited") &&
      item.actionKind !== "review-receipt"
    ) {
      trackAnalyticsEvent("ai_draft_sent", {
        draft_type: item.category,
        edited_before_send: decision === "edited",
      });
    }

    setDecisions((currentDecisions) => ({
      ...currentDecisions,
      [item.id]: decision,
    }));
    setEditingId(null);
    setNotice({
      message: isBackendApproval
        ? "Decision saved through the backend and recorded in the audit log. No customer message was sent."
        : "Decision saved to local UI only. No AI action, payment update, or customer message was sent.",
      title: getDecisionLabel(decision),
    });
  }

  function startEdit(item: ApprovalQueueItem) {
    if (actionsBlockedByRole) {
      router.push(permissionHref);
      return;
    }

    setEditingId(item.id);
    setDraftText(item.recommendation);
    trackAnalyticsEvent("ai_draft_reviewed", {
      confidence_band: getConfidenceBand(item.confidence),
      draft_type: item.category,
    });
    setNotice({
      message: "Edit the draft locally before approving it. Nothing will be sent.",
      title: "Edit mode",
    });
  }

  function saveEdit(item: ApprovalQueueItem) {
    if (!draftText.trim()) {
      setNotice({
        message: "Add draft text before saving this local edit.",
        title: "Draft cannot be empty",
      });
      return;
    }

    void decide(item, "edited");
  }

  function resetQueue() {
    if (isBackendMode) {
      retryLoad();
      return;
    }

    setItems(initialApprovalItems);
    setDecisions({});
    setEditingId(null);
    setNotice({
      message: "The demo approval queue has been restored locally.",
      title: "Queue restored",
    });
  }

  function retryLoad() {
    setViewState("loading");

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
    }

    if (isBackendMode) {
      getApprovals(apiClient).then((result) => {
        if (result.ok) {
          setItems(result.data.approvals.map(normalizeBackendApproval));
          setDecisions({});
          setViewState("ready");
          return;
        }

        setNotice({
          message: result.error.message,
          title: "Approval queue failed",
        });
        setViewState("error");
      });
      return;
    }

    retryTimerRef.current = setTimeout(() => {
      setViewState("ready");
    }, 350);
  }

  return (
    <ScrollView
      className="flex-1 bg-neo-background"
      contentContainerClassName="items-center"
      contentContainerStyle={{
        paddingBottom: 112,
        paddingHorizontal: horizontalPadding,
        paddingTop: isCompactPhone ? 28 : 44,
      }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <Header
          pendingCount={pendingItems.length}
          showSearch={showSearch}
          toggleSearch={() => setShowSearch((currentValue) => !currentValue)}
        />
        <SafetyRuleBar />
        {initialState === "offline" ? (
          <StateBanner
            message="Cached approvals are visible, but approve, reject, edit, and escalation decisions stay disabled until Neo is online."
            title="Offline approvals are read-only"
            tone="offline"
          />
        ) : null}
        {initialState === "permission" ? (
          <StateBanner
            message="Only an owner or manager can approve sensitive AI, payment, complaint, and discount actions. Ask the owner/admin to review."
            title="Approval permission needed"
            tone="permission"
          />
        ) : null}
        {initialState !== "permission" && actionsBlockedByRole ? (
          <StateBanner
            message="Your current mock role can view approvals, but sensitive decisions need owner or manager permission."
            title="Approval permission needed"
            tone="permission"
          />
        ) : null}
        {showSearch ? <SearchBox query={query} setQuery={setQuery} /> : null}
        <FilterChips
          activeFilter={activeFilter}
          counts={counts}
          setActiveFilter={setActiveFilter}
        />
        {notice ? <NoticeBanner notice={notice} /> : null}

        {viewState === "loading" ? <ApprovalSkeleton /> : null}
        {viewState === "error" ? <ErrorApprovals onRetry={retryLoad} /> : null}

        {viewState === "ready" ? (
          visibleItems.length > 0 ? (
            <View className="mt-6 gap-4">
              {visibleItems.map((item) => (
                <ApprovalCard
                  actionsDisabled={actionsDisabled}
                  decision={decisions[item.id]}
                  draftText={editingId === item.id ? draftText : item.recommendation}
                  editingId={editingId}
                  item={item}
                  key={item.id}
                  mockRole={effectiveRole}
                  onApprove={(approvalItem) => {
                    void decide(approvalItem, "approved");
                  }}
                  onAsk={(approvalItem) => {
                    void decide(approvalItem, "asked");
                  }}
                  onEdit={startEdit}
                  onEscalate={(approvalItem) => {
                    void decide(approvalItem, "escalated");
                  }}
                  onReject={(approvalItem) => {
                    void decide(approvalItem, "rejected");
                  }}
                  onSaveEdit={saveEdit}
                  setDraftText={setDraftText}
                  stopEditing={() => setEditingId(null)}
                />
              ))}
            </View>
          ) : (
            <EmptyApprovals
              actionLabel={isBackendMode ? "Reload approvals" : "Restore demo queue"}
              onReset={resetQueue}
            />
          )
        ) : null}
      </View>
    </ScrollView>
  );
}

function isBackendRecordId(recordId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordId);
}
