import { useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import type { Href } from "expo-router";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import { StateBanner } from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import {
  getCountBand,
  trackAnalyticsEvent,
  trackScreenStateSeen,
} from "@/lib/analytics";
import { getTodaySummary, useApiClient } from "@/lib/api";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";
import { useConnectivityStore } from "@/stores/useConnectivityStore";
import { useOperationsStore } from "@/stores/useOperationsStore";

import type {
  AiRecommendation,
  PriorityLevel,
  QueueItem,
  StatusTone,
  SummaryMetric,
  TodayDashboard,
} from "./todayCommandData";
import {
  activeDashboard,
  emptyDashboard,
  getTodayUrgentAttentionCount,
  normalizeBackendTodayDashboard,
} from "./todayCommandData";

type TodayViewState = "ready" | "loading" | "error";

function getToneTextClassName(tone: StatusTone) {
  if (tone === "success") {
    return "text-neo-success";
  }

  if (tone === "warning") {
    return "text-neo-warning";
  }

  if (tone === "error") {
    return "text-neo-error";
  }

  if (tone === "info") {
    return "text-neo-info";
  }

  return "text-neo-text-muted";
}

function getToneChipClassName(tone: StatusTone) {
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

  return "border-neo-border bg-neo-surface text-neo-text-muted";
}

function getIconToneStyle(tone: StatusTone) {
  if (tone === "info") {
    return {
      backgroundClassName: "bg-[#EDF6FA]",
      borderClassName: "border-[#B9D3DF]",
      tintColor: colors.info,
    };
  }

  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-[#E8C980]",
      tintColor: colors.warning,
    };
  }

  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      tintColor: colors.primary,
    };
  }

  return {
    backgroundClassName: "bg-[#F8EEDC]",
    borderClassName: "border-neo-border",
    tintColor: colors.primary,
  };
}

function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  const label = priority === "high" ? "High priority" : "Medium";

  return (
    <View className="min-h-8 flex-row items-center gap-2 rounded-full border border-[#E4B65E] bg-[#FFF8EA] px-3">
      <View className="h-2 w-2 rounded-full bg-neo-warning" />
      <Text className="text-[13px] font-semibold leading-4 text-[#7A4D07]">
        {label}
      </Text>
    </View>
  );
}

function RefreshMark() {
  return (
    <View className="h-7 w-7 items-center justify-center rounded-full border-2 border-neo-text">
      <Text className="absolute -right-1 -top-2 text-[20px] font-bold leading-6 text-neo-text">
        {">"}
      </Text>
    </View>
  );
}

function HeaderActions({
  approvalPendingCount,
  isDisabled,
  isLoading,
  onRefresh,
}: {
  approvalPendingCount: number;
  isDisabled: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const approvalBadgeLabel =
    approvalPendingCount > 99 ? "99+" : String(approvalPendingCount);

  return (
    <View className="flex-row items-center gap-3">
      <Link asChild href={routes.approvals as Href}>
        <Pressable
          accessibilityLabel="Open waiting approvals"
          accessibilityRole="link"
          className="relative min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconWarning}
            style={{ height: 28, tintColor: colors.text, width: 28 }}
          />
          {approvalPendingCount > 0 ? (
            <View className="absolute -right-2 -top-2 h-7 min-w-7 items-center justify-center rounded-full bg-neo-terracotta px-2">
              <Text className="text-center text-[13px] font-bold leading-4 text-white">
                {approvalBadgeLabel}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </Link>

      <Pressable
        accessibilityLabel="Refresh today queue"
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled || isLoading }}
        className="min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        disabled={isDisabled || isLoading}
        onPress={onRefresh}
      >
        <RefreshMark />
      </Pressable>
    </View>
  );
}

function HeaderChips({
  isOnline,
  lastSyncedLabel,
}: {
  isOnline: boolean;
  lastSyncedLabel: string;
}) {
  return (
    <View className="mt-5 flex-row flex-wrap gap-3">
      <View className="min-h-10 flex-row items-center gap-2 rounded-full border border-neo-border bg-neo-surface px-3">
        <View
          className={`h-6 w-6 items-center justify-center rounded-full border ${
            isOnline ? "border-neo-success" : "border-neo-warning"
          }`}
        >
          <View
            className={`h-2.5 w-2.5 rounded-full ${
              isOnline ? "bg-neo-success" : "bg-neo-warning"
            }`}
          />
        </View>
        <Text
          className={`text-[15px] font-bold leading-5 ${
            isOnline ? "text-neo-success" : "text-neo-warning"
          }`}
        >
          {isOnline ? "WhatsApp connected" : "Offline"}
        </Text>
        <View
          className={`h-2 w-2 rounded-full ${
            isOnline ? "bg-neo-success" : "bg-neo-warning"
          }`}
        />
      </View>

      <View className="min-h-10 flex-row items-center gap-2 rounded-full border border-neo-border bg-neo-surface px-3">
        <View className="h-6 w-6 items-center justify-center rounded-full border border-neo-text-muted">
          <Text className="text-[12px] font-bold leading-4 text-neo-text-muted">
            i
          </Text>
        </View>
        <Text className="text-[15px] font-semibold leading-5 text-neo-text">
          Last synced {lastSyncedLabel}
        </Text>
      </View>
    </View>
  );
}

function SummaryMetrics({ metrics }: { metrics: readonly SummaryMetric[] }) {
  return (
    <View className="mt-6 flex-row overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {metrics.map((metric, index) => {
        const iconTone = getIconToneStyle(metric.detailTone);

        return (
          <View
            className={`min-h-[132px] flex-1 px-3 py-4 ${
              index > 0 ? "border-l border-neo-border" : ""
            }`}
            key={metric.id}
          >
            <View
              className={`h-14 w-14 items-center justify-center rounded-full border ${iconTone.backgroundClassName} ${iconTone.borderClassName}`}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={metric.icon}
                style={{ height: 30, tintColor: iconTone.tintColor, width: 30 }}
              />
            </View>
            <Text
              className="mt-3 text-[30px] font-bold leading-9 text-neo-primary"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {metric.value}
            </Text>
            <Text className="text-[14px] font-semibold leading-5 text-neo-text">
              {metric.label}
            </Text>
            <Text
              className={`mt-1 text-[13px] font-semibold leading-4 ${getToneTextClassName(
                metric.detailTone,
              )}`}
              numberOfLines={1}
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {metric.detail}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function QueueCard({
  isCompactPhone,
  item,
  onOpen,
}: {
  isCompactPhone: boolean;
  item: QueueItem;
  onOpen: () => void;
}) {
  const iconTone = getIconToneStyle(item.statusTone);

  return (
    <Link asChild href={item.href as Href}>
      <Pressable
        accessibilityHint={`Opens ${item.actionLabel.toLowerCase()}.`}
        accessibilityLabel={`${item.title}, ${item.priority} priority, ${item.status}`}
        accessibilityRole="link"
        className={`rounded-lg border bg-neo-surface px-3 py-4 ${
          item.isHighlighted ? "border-[#D8B65F]" : "border-neo-border"
        }`}
        onPressIn={onOpen}
      >
        <View
          className={`gap-3 ${
            isCompactPhone ? "" : "flex-row items-center justify-between"
          }`}
        >
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            <View
              className={`relative h-20 w-20 items-center justify-center rounded-full border ${iconTone.backgroundClassName} ${iconTone.borderClassName}`}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={item.icon}
                style={{ height: 42, tintColor: iconTone.tintColor, width: 42 }}
              />
              {item.badgeCount ? (
                <View className="absolute -bottom-1 -right-1 h-8 min-w-8 items-center justify-center rounded-full bg-neo-terracotta px-2">
                  <Text className="text-center text-[13px] font-bold leading-4 text-white">
                    {item.badgeCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="min-w-0 flex-1">
              <View className="flex-row flex-wrap items-center justify-between gap-2">
                <Text
                  className="min-w-0 flex-1 text-[19px] font-bold leading-6 text-neo-primary"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <PriorityBadge priority={item.priority} />
              </View>
              <Text
                className="mt-1 text-[14px] leading-5 text-neo-text-muted"
                numberOfLines={1}
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {item.details}
              </Text>
              <View
                className={`mt-2 self-start rounded-md border px-2 py-1 ${getToneChipClassName(
                  item.statusTone,
                )}`}
              >
                <Text className="text-[13px] font-semibold leading-4">
                  {item.status}
                </Text>
              </View>
              <Text
                className="mt-2 text-[14px] leading-5 text-neo-text-muted"
                numberOfLines={2}
              >
                {item.reason}
              </Text>
            </View>
          </View>

          <View
            className={`min-h-12 flex-row items-center justify-center rounded-lg bg-neo-primary px-4 ${
              isCompactPhone ? "self-stretch" : "w-[148px]"
            }`}
          >
            <Text
              className="text-center text-[15px] font-bold leading-5 text-white"
              numberOfLines={1}
            >
              {item.actionLabel}
            </Text>
            <Text className="ml-2 text-[24px] font-bold leading-6 text-white">
              {">"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function QueueSection({
  dashboard,
  isCompactPhone,
}: {
  dashboard: TodayDashboard;
  isCompactPhone: boolean;
}) {
  if (dashboard.queueItems.length === 0) {
    return <TodayEmptyState />;
  }

  return (
    <View className="mt-6">
      <View className="mb-3 flex-row items-center justify-between gap-4">
        <Text className="text-[22px] font-bold leading-7 text-neo-primary">
          Priority queue
        </Text>
        <Link asChild href={routes.approvals as Href}>
          <Pressable
            accessibilityLabel="View all waiting actions"
            accessibilityRole="link"
            className="min-h-11 flex-row items-center justify-center gap-2 px-1"
          >
            <Text className="text-[15px] font-semibold leading-5 text-neo-text">
              View all
            </Text>
            <Text className="text-[24px] font-bold leading-6 text-neo-text">
              {">"}
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="gap-3">
        {dashboard.queueItems.map((item) => (
          <QueueCard
            isCompactPhone={isCompactPhone}
            item={item}
            key={item.id}
            onOpen={() =>
              trackAnalyticsEvent("today_item_opened", {
                item_type: item.id,
                priority: item.priority,
              })
            }
          />
        ))}
      </View>
    </View>
  );
}

function AiRecommendationCard({
  recommendation,
}: {
  recommendation: AiRecommendation;
}) {
  return (
    <Link asChild href={recommendation.href as Href}>
      <Pressable
        accessibilityHint="Opens the approval queue suggestions."
        accessibilityLabel={recommendation.title}
        accessibilityRole="link"
        className="mt-6 rounded-lg border border-[#9CC2D4] bg-[#F1F8FB] px-4 py-4"
        onPressIn={() =>
          trackAnalyticsEvent("today_item_opened", {
            item_type: "ai_recommendation",
            priority: "medium",
          })
        }
      >
        <View className="flex-row items-start gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-neo-info">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconAiDraft}
              style={{ height: 34, tintColor: colors.surface, width: 34 }}
            />
          </View>

          <View className="min-w-0 flex-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-[19px] font-bold leading-6 text-neo-primary">
                {recommendation.title}
              </Text>
              <View className="rounded-md bg-neo-info px-2 py-1">
                <Text className="text-[12px] font-bold leading-4 text-white">AI</Text>
              </View>
            </View>
            <Text className="mt-1 text-[15px] leading-6 text-neo-text">
              {recommendation.description}
            </Text>

            <View className="mt-3 flex-row items-end justify-between gap-3">
              <View className="min-h-10 flex-row items-center rounded-md border border-[#9CC2D4] bg-[#E8F4F9] px-3">
                <Text className="text-[14px] font-bold leading-5 text-neo-info">
                  {recommendation.actionLabel}
                </Text>
                <Text className="ml-2 text-[22px] font-bold leading-6 text-neo-info">
                  {">"}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Text className="text-[12px] font-semibold leading-4 text-neo-text-muted">
                  You are in control
                </Text>
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={images.iconPermission}
                  style={{ height: 22, tintColor: colors.primary, width: 22 }}
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function TodaySkeleton() {
  return (
    <View className="mt-6 gap-4">
      <View className="h-[132px] rounded-lg border border-neo-border bg-neo-surface-alt" />
      <View className="h-7 w-48 rounded-full bg-neo-surface-alt" />
      {[0, 1, 2, 3].map((item) => (
        <View
          className="min-h-[124px] rounded-lg border border-neo-border bg-neo-surface px-3 py-4"
          key={item}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-16 w-16 rounded-full bg-neo-surface-alt" />
            <View className="flex-1 gap-2">
              <View className="h-5 w-3/5 rounded-full bg-neo-surface-alt" />
              <View className="h-4 w-4/5 rounded-full bg-neo-surface-alt" />
              <View className="h-8 w-28 rounded-md bg-neo-surface-alt" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function TodayErrorState({ onRetry }: { onRetry: () => void }) {
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
        Could not refresh queue
      </Text>
      <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
        Your last saved Today view is still safe to review. Try again when the
        connection is steady.
      </Text>
      <Pressable
        accessibilityLabel="Retry refreshing the Today queue"
        accessibilityRole="button"
        className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-4"
        onPress={onRetry}
      >
        <Text className="text-[15px] font-bold leading-5 text-white">Retry</Text>
      </Pressable>
    </View>
  );
}

function TodayEmptyState() {
  return (
    <View className="mt-6 items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-7">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.illustrationTodayCommandCenter}
        style={{ height: 142, width: 180 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        No urgent work right now
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        New receipts, unread chats, unpaid orders, and due follow-ups will appear
        here when they need attention.
      </Text>
      <Link asChild href={routes.inbox as Href}>
        <Pressable
          accessibilityLabel="Open inbox"
          accessibilityRole="link"
          className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-5"
        >
          <Text className="text-[15px] font-bold leading-5 text-white">
            Open inbox
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

export function TodayCommandCenterScreen({
  initialState = "ready",
}: {
  initialState?: MockScreenState;
}) {
  const apiClient = useApiClient();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 430;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const approvalPendingCount = useOperationsStore(
    (store) => store.attentionCounts.approvals,
  );
  const setTodayUrgentCount = useOperationsStore(
    (store) => store.setTodayUrgentCount,
  );
  const isOnline = useConnectivityStore((store) => store.isOnline);
  const lastSyncedLabel = useConnectivityStore((store) => store.lastSyncedLabel);
  const markSynced = useConnectivityStore((store) => store.markSynced);
  const isOffline = initialState === "offline" || !isOnline;
  const [viewState, setViewState] = useState<TodayViewState>(
    initialState === "loading" || initialState === "error"
      ? initialState
      : initialState === "ready" && !isOffline
        ? "loading"
        : "ready",
  );
  const [dashboard, setDashboard] = useState<TodayDashboard>(
    initialState === "empty" ? emptyDashboard : activeDashboard,
  );
  const [reloadVersion, setReloadVersion] = useState(0);
  const isPermissionLimited = initialState === "permission";
  const queueCount = dashboard.queueItems.length;
  const hasUrgentItems = dashboard.queueItems.some((item) => item.priority === "high");

  useEffect(() => {
    if (initialState !== "ready" || isOffline) {
      return;
    }

    let isActive = true;

    getTodaySummary(apiClient).then((result) => {
      if (!isActive) {
        return;
      }

      if (result.ok) {
        setDashboard(normalizeBackendTodayDashboard(result.data));
        setViewState("ready");
        markSynced();
        return;
      }

      setViewState("error");
    });

    return () => {
      isActive = false;
    };
  }, [apiClient, initialState, isOffline, markSynced, reloadVersion]);

  useEffect(() => {
    trackAnalyticsEvent("today_viewed", {
      has_urgent_items: hasUrgentItems,
      queue_count_band: getCountBand(queueCount),
    });
    trackScreenStateSeen({
      errorCategory: "today_queue_load_failed",
      hasCachedData: initialState === "offline",
      screen: "today",
      state: initialState,
    });
  }, [hasUrgentItems, initialState, queueCount]);

  useEffect(() => {
    setTodayUrgentCount(
      initialState === "empty" ? 0 : getTodayUrgentAttentionCount(dashboard),
    );
  }, [dashboard, initialState, setTodayUrgentCount]);

  function refreshTodayQueue() {
    if (!isOffline) {
      setViewState("loading");
    }

    setReloadVersion((currentValue) => currentValue + 1);
  }

  return (
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
        <View className="flex-row items-start justify-between gap-4">
          <View className="min-w-0 flex-1">
            <Text className="text-[32px] font-bold leading-10 text-neo-primary">
              Today
            </Text>
            <Text className="mt-1 text-[17px] leading-6 text-neo-text-muted">
              Good morning, Femi
            </Text>
          </View>
          <HeaderActions
            approvalPendingCount={approvalPendingCount}
            isDisabled={isOffline}
            isLoading={viewState === "loading"}
            onRefresh={refreshTodayQueue}
          />
        </View>

        <HeaderChips isOnline={!isOffline} lastSyncedLabel={lastSyncedLabel} />

        {isOffline ? (
          <StateBanner
            message="Showing the last synced queue from 2m ago. Refreshing and sensitive changes stay paused until Neo is online."
            title="Offline mode"
            tone="offline"
          />
        ) : null}
        {isPermissionLimited ? (
          <StateBanner
            message="Some payment and approval actions need an owner or manager. You can still review the queue and ask an owner/admin."
            title="Owner approval needed"
            tone="permission"
          />
        ) : null}

        {viewState === "loading" ? <TodaySkeleton /> : null}
        {viewState === "error" ? <TodayErrorState onRetry={refreshTodayQueue} /> : null}
        {viewState === "ready" ? (
          <>
            <SummaryMetrics metrics={dashboard.summaryMetrics} />
            <QueueSection dashboard={dashboard} isCompactPhone={isCompactPhone} />
            {dashboard.aiRecommendation ? (
              <AiRecommendationCard recommendation={dashboard.aiRecommendation} />
            ) : null}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
