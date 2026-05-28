import { useEffect, useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import type { Href } from "expo-router";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import {
  SkeletonRows,
  StateBanner,
  StateCard,
} from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import {
  completeFollowUp,
  getFollowUps,
  rescheduleFollowUp as rescheduleBackendFollowUp,
  sendWhatsAppMessage,
  useApiClient,
} from "@/lib/api";
import { trackAnalyticsEvent, trackScreenStateSeen } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useOperationsStore } from "@/stores/useOperationsStore";

import type {
  FollowUpFilter,
  FollowUpQueueItem,
  FollowUpStatus,
  FollowUpTone,
} from "./followUpQueueData";
import {
  filterFollowUps,
  followUpFilters,
  formatFollowUpNaira,
  getFollowUpCounts,
  initialFollowUps,
  normalizeBackendFollowUp,
} from "./followUpQueueData";

type NoticeTone = "info" | "success" | "warning";

type Notice = {
  message: string;
  title: string;
  tone: NoticeTone;
};

function getToneStyle(tone: FollowUpTone) {
  if (tone === "error") {
    return {
      backgroundClassName: "bg-[#FFF1EF]",
      borderClassName: "border-neo-error",
      textClassName: "text-neo-error",
      tintColor: colors.error,
    };
  }

  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-neo-warning",
      textClassName: "text-neo-warning",
      tintColor: colors.warning,
    };
  }

  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-neo-success",
      textClassName: "text-neo-success",
      tintColor: colors.success,
    };
  }

  if (tone === "info") {
    return {
      backgroundClassName: "bg-[#EDF6FA]",
      borderClassName: "border-neo-info",
      textClassName: "text-neo-info",
      tintColor: colors.info,
    };
  }

  return {
    backgroundClassName: "bg-neo-surface",
    borderClassName: "border-neo-border",
    textClassName: "text-neo-text-muted",
    tintColor: colors.textMuted,
  };
}

function getStatusIcon(status: FollowUpStatus): ImageSourcePropType {
  if (status === "overdue") {
    return images.iconWarning;
  }

  if (status === "suggested") {
    return images.iconInbox;
  }

  if (status === "done") {
    return images.iconPaid;
  }

  return images.iconFollowUps;
}

function getStatusLabel(status: FollowUpStatus) {
  if (status === "overdue") {
    return "Overdue";
  }

  if (status === "suggested") {
    return "Suggested";
  }

  if (status === "done") {
    return "Done";
  }

  return "Due";
}

function getNoticeStyle(tone: NoticeTone) {
  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-neo-success",
      textClassName: "text-neo-success",
    };
  }

  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-neo-warning",
      textClassName: "text-neo-warning",
    };
  }

  return {
    backgroundClassName: "bg-[#EDF6FA]",
    borderClassName: "border-neo-info",
    textClassName: "text-neo-info",
  };
}

function Header({
  activeCount,
  onShowNotice,
}: {
  activeCount: number;
  onShowNotice: () => void;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-3">
          <Text className="text-[32px] font-bold leading-10 text-neo-text">
            Follow-ups
          </Text>
          <View className="min-h-10 min-w-10 items-center justify-center rounded-full bg-[#D96B0B] px-3">
            <Text
              className="text-[18px] font-bold leading-6 text-white"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {activeCount}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-[16px] leading-6 text-neo-text-muted">
          Recover sales and stay top of mind.
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Filter follow-ups"
        accessibilityRole="button"
        className="min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        onPress={onShowNotice}
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

function FilterChips({
  activeFilter,
  counts,
  setActiveFilter,
}: {
  activeFilter: FollowUpFilter;
  counts: ReturnType<typeof getFollowUpCounts>;
  setActiveFilter: (filter: FollowUpFilter) => void;
}) {
  return (
    <ScrollView
      className="mt-5"
      contentContainerStyle={{ gap: 8, paddingRight: 2 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {followUpFilters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const iconTint = isActive ? colors.surface : colors.primary;

        return (
          <Pressable
            accessibilityLabel={`Show ${filter.label} follow-ups`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`min-h-14 flex-row items-center gap-2 rounded-lg border px-4 ${
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
              source={filter.icon}
              style={{ height: 22, tintColor: iconTint, width: 22 }}
            />
            <Text
              className={`text-[15px] font-bold leading-5 ${
                isActive ? "text-white" : "text-neo-text"
              }`}
            >
              {filter.label}
            </Text>
            <View
              className={`min-h-8 min-w-8 items-center justify-center rounded-full px-2 ${
                isActive ? "bg-[#3C7B65]" : "bg-neo-background"
              }`}
            >
              <Text
                className={`text-[13px] font-bold leading-4 ${
                  isActive ? "text-white" : "text-neo-text-muted"
                }`}
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {counts[filter.id]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function QueueControls({ onShowNotice }: { onShowNotice: () => void }) {
  return (
    <View className="mt-5 flex-row items-center justify-between gap-4">
      <Pressable
        accessibilityLabel="Sort follow-ups by due soonest"
        accessibilityRole="button"
        className="min-h-10 flex-row items-center gap-2"
        onPress={onShowNotice}
      >
        <Text className="text-[24px] font-bold leading-6 text-neo-text">{"^v"}</Text>
        <Text className="text-[15px] leading-5 text-neo-text-muted">
          Sort:{" "}
          <Text className="font-bold text-neo-text">Due soonest v</Text>
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel="Group follow-ups"
        accessibilityRole="button"
        className="min-h-10 items-end justify-center"
        onPress={onShowNotice}
      >
        <Text className="text-right text-[15px] leading-5 text-neo-text-muted">
          Group by:{" "}
          <Text className="font-bold text-neo-text">None v</Text>
        </Text>
      </Pressable>
    </View>
  );
}

function NoticeBanner({ notice }: { notice: Notice }) {
  const style = getNoticeStyle(notice.tone);

  return (
    <View
      className={`mt-4 rounded-lg border px-4 py-3 ${style.borderClassName} ${style.backgroundClassName}`}
    >
      <Text className={`text-[15px] font-bold leading-5 ${style.textClassName}`}>
        {notice.title}
      </Text>
      <Text className="mt-1 text-[14px] leading-5 text-neo-text">
        {notice.message}
      </Text>
    </View>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <View className="mt-4 flex-row items-center gap-3 rounded-lg border border-[#B9D7C4] bg-[#EEF8F0] px-4 py-3">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.successFollowUpSent}
        style={{ height: 56, width: 64 }}
      />
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-bold leading-5 text-neo-success">
          Follow-up updated
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text">
          {message}
        </Text>
      </View>
    </View>
  );
}

function Avatar({ item }: { item: FollowUpQueueItem }) {
  return (
    <View className="h-16 w-16 items-center justify-center rounded-full bg-[#F3E8D5]">
      <Text className="text-[23px] font-bold leading-8 text-neo-text">
        {item.customerInitials}
      </Text>
    </View>
  );
}

function StatusHeader({ item }: { item: FollowUpQueueItem }) {
  const toneStyle = getToneStyle(item.tone);

  return (
    <View
      className={`flex-row items-center justify-between gap-3 border-b border-neo-border px-4 py-3 ${toneStyle.backgroundClassName}`}
    >
      <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-3">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={getStatusIcon(item.status)}
          style={{ height: 22, tintColor: toneStyle.tintColor, width: 22 }}
        />
        <Text className={`text-[15px] font-bold leading-5 ${toneStyle.textClassName}`}>
          {getStatusLabel(item.status)}
        </Text>
        <Text
          className={`text-[15px] font-bold leading-5 ${
            item.status === "overdue" ? "text-neo-error" : toneStyle.textClassName
          }`}
          numberOfLines={1}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {item.status === "overdue" ? item.dueMetaLabel : item.dueLabel}
        </Text>
      </View>

      <View
        className={`min-h-9 rounded-lg border px-3 py-1 ${toneStyle.borderClassName} ${toneStyle.backgroundClassName}`}
      >
        <Text className={`text-[13px] font-bold leading-4 ${toneStyle.textClassName}`}>
          {item.kindLabel}
        </Text>
      </View>
    </View>
  );
}

function FollowUpMeta({ item }: { item: FollowUpQueueItem }) {
  return (
    <View className="mt-4 flex-row gap-3 px-4">
      <Avatar item={item} />

      <View className="min-w-0 flex-1">
        <Text
          className="text-[20px] font-bold leading-7 text-neo-text"
          numberOfLines={1}
        >
          {item.customerName}
        </Text>
        {item.detailLines.map((line, index) => (
          <View className="mt-1 flex-row items-center gap-2" key={line}>
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={
                index === 0
                  ? item.targetType === "order"
                    ? images.iconOrder
                    : images.iconInbox
                  : images.iconReceiptReview
              }
              style={{ height: 18, tintColor: colors.text, width: 18 }}
            />
            <Text
              className="min-w-0 flex-1 text-[15px] leading-5 text-neo-text"
              numberOfLines={1}
            >
              {line}
            </Text>
          </View>
        ))}
      </View>

      <View className="max-w-[128px] items-end">
        {item.amount ? (
          <>
            <Text className="text-right text-[13px] leading-4 text-neo-text-muted">
              Total
            </Text>
            <Text
              className="text-right text-[19px] font-bold leading-6 text-neo-text"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatFollowUpNaira(item.amount)}
            </Text>
          </>
        ) : item.lastActivityLabel ? (
          <>
            <Text className="text-right text-[13px] leading-4 text-neo-text-muted">
              Last activity
            </Text>
            <Text
              className="text-right text-[15px] font-bold leading-5 text-neo-text"
              numberOfLines={2}
            >
              {item.lastActivityLabel}
            </Text>
          </>
        ) : null}
        <Text className="mt-2 text-right text-[13px] leading-4 text-neo-text-muted">
          {item.status === "done" ? "Completed" : "Due"}
        </Text>
        <Text
          className={`text-right text-[14px] font-bold leading-5 ${
            item.status === "overdue" ? "text-neo-error" : "text-neo-warning"
          }`}
          numberOfLines={2}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {item.completedLabel ?? item.dueLabel}
        </Text>
      </View>
    </View>
  );
}

function MessagePreview({
  actionsDisabled,
  draft,
  isEditing,
  item,
  onChangeDraft,
  onEdit,
  onSaveEdit,
}: {
  actionsDisabled: boolean;
  draft: string;
  isEditing: boolean;
  item: FollowUpQueueItem;
  onChangeDraft: (value: string) => void;
  onEdit: () => void;
  onSaveEdit: () => void;
}) {
  return (
    <View className="mx-4 mt-4 rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
      <View className="flex-row items-start gap-3">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconAiDraft}
          style={{ height: 24, tintColor: colors.info, width: 24 }}
        />
        <View className="min-w-0 flex-1">
          <Text className="text-[15px] font-bold leading-5 text-neo-info">
            Suggested message
          </Text>
          {isEditing ? (
            <TextInput
              accessibilityLabel={`Edit follow-up message for ${item.customerName}`}
              className="mt-2 min-h-[116px] rounded-lg border border-neo-border bg-neo-background px-3 py-2 text-[15px] leading-6 text-neo-text"
              multiline
              onChangeText={onChangeDraft}
              textAlignVertical="top"
              value={draft}
            />
          ) : (
            <Text className="mt-1 text-[15px] leading-6 text-neo-text">
              {draft}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityLabel={
            isEditing ? "Save edited follow-up message" : "Edit follow-up message"
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className={`min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border ${
            actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
          }`}
          disabled={actionsDisabled}
          onPress={isEditing ? onSaveEdit : onEdit}
        >
          <Text
            className={`text-[24px] font-bold leading-7 ${
              actionsDisabled ? "text-neo-text-muted" : "text-neo-text"
            }`}
          >
            {isEditing ? "OK" : "/"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function CardActions({
  actionsDisabled,
  item,
  onMarkDone,
  onReschedule,
  onSend,
}: {
  actionsDisabled: boolean;
  item: FollowUpQueueItem;
  onMarkDone: () => void;
  onReschedule: () => void;
  onSend: () => void;
}) {
  const targetHref =
    item.targetType === "order" && item.orderRouteId
      ? (`/order/${item.orderRouteId}` as Href)
      : (`/conversation/${item.conversationId}` as Href);
  const isDone = item.status === "done";

  return (
    <View className="mt-3 border-t border-neo-border px-3 py-3">
      <View className="flex-row flex-wrap gap-2">
        <Link asChild href={targetHref}>
          <Pressable
            accessibilityLabel={`${item.targetLabel} for ${item.customerName}`}
            accessibilityRole="link"
            className="min-h-12 flex-1 basis-[30%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-2"
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={item.targetType === "order" ? images.iconOrder : images.iconInbox}
              style={{ height: 22, tintColor: colors.text, width: 22 }}
            />
            <Text
              className="text-center text-[14px] font-bold leading-5 text-neo-text"
              numberOfLines={2}
            >
              {item.targetLabel}
            </Text>
          </Pressable>
        </Link>

        {!isDone ? (
          <>
            <Pressable
              accessibilityLabel={`Reschedule follow-up for ${item.customerName}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: actionsDisabled }}
              className={`min-h-12 flex-1 basis-[24%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border px-2 ${
                actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
              }`}
              disabled={actionsDisabled}
              onPress={onReschedule}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconFollowUps}
                style={{
                  height: 22,
                  tintColor: actionsDisabled ? colors.textMuted : colors.text,
                  width: 22,
                }}
              />
              <Text
                className={`text-center text-[14px] font-bold leading-5 ${
                  actionsDisabled ? "text-neo-text-muted" : "text-neo-text"
                }`}
              >
                Reschedule
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel={`Mark follow-up done for ${item.customerName}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: actionsDisabled }}
              className={`min-h-12 flex-1 basis-[24%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border px-2 ${
                actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-surface"
              }`}
              disabled={actionsDisabled}
              onPress={onMarkDone}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconPaid}
                style={{
                  height: 22,
                  tintColor: actionsDisabled ? colors.textMuted : colors.text,
                  width: 22,
                }}
              />
              <Text
                className={`text-center text-[14px] font-bold leading-5 ${
                  actionsDisabled ? "text-neo-text-muted" : "text-neo-text"
                }`}
              >
                Mark done
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel={`Send follow-up to ${item.customerName}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: actionsDisabled }}
              className={`min-h-12 flex-1 basis-[48%] flex-row items-center justify-center gap-2 rounded-lg px-3 ${
                actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-primary"
              }`}
              disabled={actionsDisabled}
              onPress={onSend}
            >
              <Text
                className={`text-[22px] font-bold leading-6 ${
                  actionsDisabled ? "text-neo-text-muted" : "text-white"
                }`}
              >
                {">"}
              </Text>
              <Text
                className={`text-center text-[15px] font-bold leading-5 ${
                  actionsDisabled ? "text-neo-text-muted" : "text-white"
                }`}
              >
                Send follow-up
              </Text>
            </Pressable>
          </>
        ) : (
          <View className="min-h-12 flex-1 basis-[48%] flex-row items-center justify-center gap-2 rounded-lg border border-[#B9D7C4] bg-[#EEF8F0] px-3">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconPaid}
              style={{ height: 22, tintColor: colors.success, width: 22 }}
            />
            <Text className="text-center text-[15px] font-bold leading-5 text-neo-success">
              Completed locally
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function FollowUpCard({
  actionsDisabled,
  draft,
  editingId,
  item,
  onChangeDraft,
  onEdit,
  onMarkDone,
  onReschedule,
  onSaveEdit,
  onSend,
}: {
  actionsDisabled: boolean;
  draft: string;
  editingId: string | null;
  item: FollowUpQueueItem;
  onChangeDraft: (value: string) => void;
  onEdit: (item: FollowUpQueueItem) => void;
  onMarkDone: (item: FollowUpQueueItem) => void;
  onReschedule: (item: FollowUpQueueItem) => void;
  onSaveEdit: (item: FollowUpQueueItem) => void;
  onSend: (item: FollowUpQueueItem) => void;
}) {
  const isEditing = editingId === item.id;
  const toneStyle = getToneStyle(item.tone);

  return (
    <View className={`overflow-hidden rounded-lg border bg-neo-surface ${toneStyle.borderClassName}`}>
      <StatusHeader item={item} />
      <FollowUpMeta item={item} />
      <MessagePreview
        actionsDisabled={actionsDisabled}
        draft={draft}
        isEditing={isEditing}
        item={item}
        onChangeDraft={onChangeDraft}
        onEdit={() => onEdit(item)}
        onSaveEdit={() => onSaveEdit(item)}
      />
      <CardActions
        actionsDisabled={actionsDisabled}
        item={item}
        onMarkDone={() => onMarkDone(item)}
        onReschedule={() => onReschedule(item)}
        onSend={() => onSend(item)}
      />
    </View>
  );
}

function EmptyFollowUps({
  activeFilter,
  onShowAll,
}: {
  activeFilter: FollowUpFilter;
  onShowAll: () => void;
}) {
  const title =
    activeFilter === "done"
      ? "No completed follow-ups"
      : activeFilter === "all"
        ? "No follow-ups due"
        : `No ${activeFilter} follow-ups due`;

  return (
    <View className="mt-6 items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-8">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.emptyFollowUps}
        style={{ height: 150, width: 190 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        {title}
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        Neo will show respectful reminders here when customers need a careful
        nudge.
      </Text>
      {activeFilter !== "all" ? (
        <Pressable
          accessibilityLabel="Show all follow-ups"
          accessibilityRole="button"
          className="mt-5 min-h-12 items-center justify-center rounded-lg border border-neo-primary bg-neo-surface px-4"
          onPress={onShowAll}
        >
          <Text className="text-[15px] font-bold leading-5 text-neo-primary">
            Show all follow-ups
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function RespectfulReminder() {
  return (
    <View className="mt-6 flex-row items-center justify-center gap-3 rounded-lg border border-neo-border bg-neo-surface-alt px-4 py-4">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.iconPermission}
        style={{ height: 22, tintColor: colors.textMuted, width: 22 }}
      />
      <Text className="min-w-0 flex-1 text-center text-[14px] leading-5 text-neo-text-muted">
        Keep it respectful and helpful. Avoid spammy or repetitive messages.
      </Text>
    </View>
  );
}

export function FollowUpsScreen({
  initialState = "ready",
}: {
  initialState?: MockScreenState;
}) {
  const apiClient = useApiClient();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const setFollowUpAttentionCount = useOperationsStore(
    (store) => store.setFollowUpAttentionCount,
  );
  const [activeFilter, setActiveFilter] = useState<FollowUpFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [followUps, setFollowUps] =
    useState<readonly FollowUpQueueItem[]>(
      initialState === "empty" ? [] : initialFollowUps,
    );
  const [screenState, setScreenState] = useState<MockScreenState>(() =>
    initialState === "ready" ? "loading" : initialState,
  );
  const [notice, setNotice] = useState<Notice | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  const counts = useMemo(() => getFollowUpCounts(followUps), [followUps]);
  const visibleFollowUps = useMemo(
    () => filterFollowUps({ filter: activeFilter, items: followUps }),
    [activeFilter, followUps],
  );
  const activeCount = counts.all - counts.done;
  const actionsDisabled =
    screenState === "offline" || screenState === "permission";

  useEffect(() => {
    if (initialState !== "ready") {
      return;
    }

    let isActive = true;

    getFollowUps(apiClient).then((result) => {
      if (!isActive) {
        return;
      }

      if (result.ok) {
        setFollowUps(result.data.followUps.map(normalizeBackendFollowUp));
        setNotice(null);
        setScreenState("ready");
        return;
      }

      setNotice({
        message: `${result.error.message} Showing the isolated demo queue instead.`,
        title: "Backend follow-ups unavailable",
        tone: "warning",
      });
      setScreenState("ready");
    });

    return () => {
      isActive = false;
    };
  }, [apiClient, initialState, reloadVersion]);

  useEffect(() => {
    trackScreenStateSeen({
      errorCategory: "follow_up_queue_load_failed",
      hasCachedData: initialState !== "empty",
      screen: "follow_ups",
      state: screenState,
    });
  }, [initialState, screenState]);

  useEffect(() => {
    setFollowUpAttentionCount(activeCount);
  }, [activeCount, setFollowUpAttentionCount]);

  if (screenState === "loading") {
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
          actionLabel="Retry follow-ups"
          image={images.errorOffline}
          message="The follow-up queue could not load. Retry asks the backend commerce records API again."
          onAction={() => {
            setScreenState("loading");
            setReloadVersion((currentValue) => currentValue + 1);
          }}
          title="Could not load follow-ups"
        />
      </View>
    );
  }

  function getDraft(item: FollowUpQueueItem) {
    return drafts[item.id] ?? item.suggestedMessage;
  }

  function updateFollowUp(
    itemId: string,
    updater: (item: FollowUpQueueItem) => FollowUpQueueItem,
  ) {
    setFollowUps((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? updater(item) : item)),
    );
  }

  function startEditing(item: FollowUpQueueItem) {
    setEditingId(item.id);
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [item.id]: getDraft(item),
    }));
    setNotice({
      message: "Edit the follow-up copy before saving. Nothing will be sent.",
      title: "Editing local message",
      tone: "info",
    });
    setSuccessMessage(null);
  }

  function saveEdit(item: FollowUpQueueItem) {
    const draft = getDraft(item).trim();

    if (!draft) {
      setNotice({
        message: "Add a respectful message before saving this local edit.",
        title: "Message cannot be empty",
        tone: "warning",
      });
      return;
    }

    trackAnalyticsEvent("follow_up_sent", {
      edited_before_send: draft !== item.suggestedMessage.trim(),
      reason: item.status,
    });
    updateFollowUp(item.id, (currentItem) => ({
      ...currentItem,
      suggestedMessage: draft,
    }));
    setEditingId(null);
    setNotice({
      message: "Edited message saved locally. It has not been sent to WhatsApp.",
      title: "Message updated",
      tone: "success",
    });
    setSuccessMessage(null);
  }

  async function markDone(item: FollowUpQueueItem) {
    if (isBackendRecordId(item.id)) {
      const result = await completeFollowUp(apiClient, item.id);

      if (!result.ok) {
        setNotice({
          message: result.error.message,
          title: "Follow-up could not update",
          tone: "warning",
        });
        setSuccessMessage(null);
        return;
      }

      updateFollowUp(item.id, () => normalizeBackendFollowUp(result.data.followUp));
      setEditingId(null);
      setNotice({
        message: "Follow-up completion was saved to the backend record.",
        title: "Follow-up marked done",
        tone: "success",
      });
      setSuccessMessage(null);
      return;
    }

    updateFollowUp(item.id, (currentItem) => ({
      ...currentItem,
      completedLabel: "Marked done just now",
      dueMetaLabel: "Completed",
      kindLabel: "Done",
      status: "done",
      tone: "success",
    }));
    setEditingId(null);
    setNotice({
      message:
        "Marked done in the isolated demo queue only. Backend records need a durable follow-up ID.",
      title: "Follow-up marked done locally",
      tone: "success",
    });
    setSuccessMessage(null);
  }

  async function sendFollowUp(item: FollowUpQueueItem) {
    const draft = getDraft(item).trim();

    if (!draft) {
      setNotice({
        message: "Add a message before saving this local send action.",
        title: "Message cannot be empty",
        tone: "warning",
      });
      return;
    }

    if (isBackendRecordId(item.id)) {
      if (!isBackendRecordId(item.conversationId)) {
        setNotice({
          message:
            "This backend follow-up is missing a live WhatsApp conversation ID, so Neo did not send it.",
          title: "WhatsApp conversation missing",
          tone: "warning",
        });
        setSuccessMessage(null);
        return;
      }

      const sendResult = await sendWhatsAppMessage(
        apiClient,
        item.conversationId,
        draft,
      );

      if (!sendResult.ok) {
        setNotice({
          message: sendResult.error.message,
          title: "Follow-up could not send",
          tone: "warning",
        });
        setSuccessMessage(null);
        return;
      }

      const result = await completeFollowUp(apiClient, item.id);

      if (!result.ok) {
        setNotice({
          message: result.error.message,
          title: "Follow-up could not update",
          tone: "warning",
        });
        setSuccessMessage(null);
        return;
      }

      updateFollowUp(item.id, () => ({
        ...normalizeBackendFollowUp(result.data.followUp),
        suggestedMessage: draft,
      }));
      setEditingId(null);
      setNotice(null);
      setSuccessMessage(
        "Follow-up was sent through the WhatsApp backend and marked complete.",
      );
      return;
    }

    updateFollowUp(item.id, (currentItem) => ({
      ...currentItem,
      completedLabel: "Sent just now",
      dueMetaLabel: "Completed",
      kindLabel: "Done",
      status: "done",
      suggestedMessage: draft,
      tone: "success",
    }));
    setEditingId(null);
    setNotice(null);
    setSuccessMessage(
      "No WhatsApp message was sent. This only updates the isolated demo queue.",
    );
  }

  async function rescheduleFollowUp(item: FollowUpQueueItem) {
    if (isBackendRecordId(item.id)) {
      const dueAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const result = await rescheduleBackendFollowUp(apiClient, item.id, dueAt);

      if (!result.ok) {
        setNotice({
          message: result.error.message,
          title: "Follow-up could not reschedule",
          tone: "warning",
        });
        setSuccessMessage(null);
        return;
      }

      updateFollowUp(item.id, () => normalizeBackendFollowUp(result.data.followUp));
      setNotice({
        message:
          "Follow-up was rescheduled to tomorrow in backend records. No customer message was sent.",
        title: `Rescheduled ${item.customerName}`,
        tone: "success",
      });
      setSuccessMessage(null);
      return;
    }

    setNotice({
      message:
        "Rescheduling is local-only for this demo item. Backend records need a durable follow-up ID.",
      title: `Reschedule ${item.customerName}`,
      tone: "info",
    });
    setSuccessMessage(null);
  }

  function showUnavailableControl() {
    setNotice({
      message:
        "Advanced filtering and grouping are not connected in this MVP screen.",
      title: "Control not connected",
      tone: "info",
    });
    setSuccessMessage(null);
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
        <Header activeCount={activeCount} onShowNotice={showUnavailableControl} />
        <FilterChips
          activeFilter={activeFilter}
          counts={counts}
          setActiveFilter={(filter) => {
            setActiveFilter(filter);
            setEditingId(null);
          }}
        />
        <QueueControls onShowNotice={showUnavailableControl} />
        {screenState === "offline" ? (
          <StateBanner
            message="Cached follow-ups are visible. Sending, rescheduling, and marking done stay disabled until Neo is online."
            title="Offline follow-ups"
            tone="offline"
          />
        ) : null}
        {screenState === "permission" ? (
          <StateBanner
            message="Sending or changing follow-ups requires owner or manager access. Ask the owner/admin before contacting customers."
            title="Follow-up permission needed"
            tone="permission"
          />
        ) : null}
        {notice ? <NoticeBanner notice={notice} /> : null}
        {successMessage ? <SuccessBanner message={successMessage} /> : null}

        {visibleFollowUps.length > 0 ? (
          <View className="mt-6 gap-4">
            {visibleFollowUps.map((item) => (
              <FollowUpCard
                actionsDisabled={actionsDisabled}
                draft={getDraft(item)}
                editingId={editingId}
                item={item}
                key={item.id}
                onChangeDraft={(value) =>
                  setDrafts((currentDrafts) => ({
                    ...currentDrafts,
                    [item.id]: value,
                  }))
                }
                onEdit={startEditing}
                onMarkDone={markDone}
                onReschedule={rescheduleFollowUp}
                onSaveEdit={saveEdit}
                onSend={sendFollowUp}
              />
            ))}
          </View>
        ) : (
          <EmptyFollowUps
            activeFilter={activeFilter}
            onShowAll={() => setActiveFilter("all")}
          />
        )}

        <RespectfulReminder />
      </View>
    </ScrollView>
  );
}

function isBackendRecordId(recordId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordId);
}
