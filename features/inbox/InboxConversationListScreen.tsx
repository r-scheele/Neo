import { useEffect, useMemo, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import type { Href } from "expo-router";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import { StateBanner } from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent, trackScreenStateSeen } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useConnectivityStore } from "@/stores/useConnectivityStore";
import { useOperationsStore } from "@/stores/useOperationsStore";

import type {
  Conversation,
  ConversationFilter,
  PresenceTone,
  StatusTone,
} from "./inboxConversationData";
import {
  conversations,
  filterConversations,
  filterOptions,
  getFilterCount,
  getInboxUnreadCount,
  normalizeSearch,
} from "./inboxConversationData";

type InboxViewState = "ready" | "loading" | "error";

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

  return "text-neo-text";
}

function getToneChipClassName(tone: StatusTone) {
  if (tone === "success") {
    return "border-neo-success bg-[#EEF8F0]";
  }

  if (tone === "warning") {
    return "border-neo-warning bg-[#FFF7E5]";
  }

  if (tone === "error") {
    return "border-[#E8C2B8] bg-[#FFF1EC]";
  }

  if (tone === "info") {
    return "border-[#B9D3DF] bg-[#EDF6FA]";
  }

  return "border-neo-border bg-neo-surface";
}

function getAvatarToneClassName(tone: StatusTone) {
  if (tone === "success") {
    return "border-[#B9D7C4] bg-[#DDEEE2]";
  }

  if (tone === "warning") {
    return "border-[#E8C980] bg-[#F9EACD]";
  }

  if (tone === "error") {
    return "border-[#D9673F] bg-[#E0522A]";
  }

  if (tone === "info") {
    return "border-[#B9D3DF] bg-[#D8EEF8]";
  }

  return "border-neo-border bg-neo-surface-alt";
}

function getAvatarTextClassName(tone: StatusTone) {
  if (tone === "error") {
    return "text-white";
  }

  if (tone === "info") {
    return "text-neo-info";
  }

  if (tone === "warning") {
    return "text-[#5C3500]";
  }

  return "text-neo-primary";
}

function getPresenceClassName(tone: PresenceTone) {
  if (tone === "urgent") {
    return "bg-neo-terracotta";
  }

  if (tone === "online") {
    return "bg-neo-success";
  }

  return "bg-neo-border";
}

function getLabelTint(tone: StatusTone) {
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

function SearchMark() {
  return (
    <View className="h-8 w-8 items-center justify-center">
      <View className="h-5 w-5 rounded-full border-2 border-neo-text" />
      <View className="absolute bottom-1 right-1 h-3 w-0.5 rotate-[-45deg] rounded-full bg-neo-text" />
    </View>
  );
}

function FilterMark({ active }: { active: boolean }) {
  return (
    <View className="relative h-8 w-8 items-center justify-center">
      <View className="h-0.5 w-7 rounded-full bg-neo-text" />
      <View className="mt-1.5 h-0.5 w-5 rounded-full bg-neo-text" />
      <View className="mt-1.5 h-0.5 w-3 rounded-full bg-neo-text" />
      {active ? (
        <View className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-neo-success" />
      ) : null}
    </View>
  );
}

function HeaderActions({
  isSearchVisible,
  onToggleFilter,
  onToggleSearch,
  onlyUnassigned,
}: {
  isSearchVisible: boolean;
  onToggleFilter: () => void;
  onToggleSearch: () => void;
  onlyUnassigned: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityLabel={isSearchVisible ? "Hide inbox search" : "Show inbox search"}
        accessibilityRole="button"
        className="min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        onPress={onToggleSearch}
      >
        <SearchMark />
      </Pressable>

      <Pressable
        accessibilityLabel={onlyUnassigned ? "Show all assignments" : "Filter unassigned conversations"}
        accessibilityRole="button"
        accessibilityState={{ selected: onlyUnassigned }}
        className="min-h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        onPress={onToggleFilter}
      >
        <FilterMark active={onlyUnassigned} />
      </Pressable>
    </View>
  );
}

function ConnectionChips({
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
          className={`text-[15px] font-semibold leading-5 ${
            isOnline ? "text-neo-success" : "text-neo-warning"
          }`}
        >
          {isOnline ? "Connected" : "Offline"}
        </Text>
        <View
          className={`h-2 w-2 rounded-full ${
            isOnline ? "bg-neo-success" : "bg-neo-warning"
          }`}
        />
      </View>

      <View className="min-h-10 flex-row items-center gap-2 rounded-full border border-neo-border bg-neo-surface px-3">
        <View className="h-6 w-6 items-center justify-center rounded-full border border-neo-text">
          <View className="absolute -right-0.5 top-1 h-2 w-2 rounded-sm border-r border-t border-neo-text" />
        </View>
        <Text className="text-[15px] font-semibold leading-5 text-neo-text">
          Last synced {lastSyncedLabel}
        </Text>
      </View>
    </View>
  );
}

function SearchField({
  onChangeText,
  onClear,
  value,
}: {
  onChangeText: (value: string) => void;
  onClear: () => void;
  value: string;
}) {
  return (
    <View className="mt-5 min-h-14 flex-row items-center gap-3 rounded-lg border border-neo-border bg-neo-surface px-4">
      <SearchMark />
      <TextInput
        accessibilityLabel="Search conversations"
        autoCapitalize="none"
        autoCorrect={false}
        className="min-h-12 flex-1 text-[16px] leading-6 text-neo-text"
        onChangeText={onChangeText}
        placeholder="Search customer, label, or message"
        placeholderTextColor={colors.textMuted}
        value={value}
      />
      {value ? (
        <Pressable
          accessibilityLabel="Clear inbox search"
          accessibilityRole="button"
          className="min-h-11 min-w-11 items-center justify-center rounded-lg"
          onPress={onClear}
        >
          <Text className="text-[18px] font-bold leading-6 text-neo-text-muted">X</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FilterChips({
  activeFilter,
  onSelectFilter,
}: {
  activeFilter: ConversationFilter;
  onSelectFilter: (filter: ConversationFilter) => void;
}) {
  return (
    <ScrollView
      className="-mx-5 mt-6 border-y border-neo-border bg-neo-surface"
      contentContainerClassName="gap-4 px-5 py-4"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {filterOptions.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <Pressable
            accessibilityLabel={`Show ${filter.label} conversations`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`min-h-11 flex-row items-center gap-2 rounded-full px-4 ${
              isActive ? "bg-neo-primary" : "bg-neo-background"
            }`}
            key={filter.id}
            onPress={() => onSelectFilter(filter.id)}
          >
            <Text
              className={`text-[15px] font-bold leading-5 ${
                isActive ? "text-white" : "text-neo-text"
              }`}
            >
              {filter.label}
            </Text>
            <View
              className={`min-h-8 min-w-8 items-center justify-center rounded-full px-2 ${
                isActive ? "bg-white" : "border border-neo-border bg-neo-surface"
              }`}
            >
              <Text
                className={`text-[14px] font-bold leading-5 ${
                  isActive ? "text-neo-primary" : "text-neo-text"
                }`}
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {getFilterCount(filter.id)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function conversationHasAiDraft(conversation: Conversation) {
  return conversation.labels.some((label) => label.text === "AI draft ready");
}

function ConversationRow({
  conversation,
  sourceTab,
}: {
  conversation: Conversation;
  sourceTab: ConversationFilter;
}) {
  const conversationHref = `/conversation/${conversation.id}` as Href;

  return (
    <Link asChild href={conversationHref}>
      <Pressable
        accessibilityHint="Opens the conversation detail placeholder."
        accessibilityLabel={`${conversation.customerName}, ${conversation.unreadCount} unread messages`}
        accessibilityRole="link"
        className="min-h-[124px] flex-row gap-3 border-b border-neo-border bg-neo-surface px-3 py-4"
        onPressIn={() =>
          trackAnalyticsEvent("inbox_conversation_opened", {
            has_ai_draft: conversationHasAiDraft(conversation),
            has_unread: conversation.unreadCount > 0,
            source_tab: sourceTab,
          })
        }
      >
        <View className="flex-row items-start gap-3">
          <View className={`mt-9 h-3.5 w-3.5 rounded-full ${getPresenceClassName(conversation.presenceTone)}`} />
          <View
            className={`h-14 w-14 items-center justify-center rounded-full border ${getAvatarToneClassName(
              conversation.avatarTone,
            )}`}
          >
            <Text
              className={`text-[23px] font-bold leading-7 ${getAvatarTextClassName(
                conversation.avatarTone,
              )}`}
            >
              {conversation.customerInitials}
            </Text>
          </View>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="min-w-0 flex-1 text-[20px] font-bold leading-7 text-neo-text"
              numberOfLines={1}
            >
              {conversation.customerName}
            </Text>
            <Text
              className="text-right text-[14px] leading-5 text-neo-text"
              numberOfLines={1}
            >
              {conversation.timestamp}
            </Text>
          </View>

          <Text
            className="mt-1 text-[16px] leading-6 text-neo-text-muted"
            numberOfLines={2}
          >
            {conversation.latestSnippet}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center gap-2">
            {conversation.labels.map((label) => (
              <View
                className={`min-h-9 flex-row items-center gap-2 rounded-md border px-2 ${getToneChipClassName(
                  label.tone,
                )}`}
                key={`${conversation.id}-${label.text}`}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={label.icon}
                  style={{ height: 18, tintColor: getLabelTint(label.tone), width: 18 }}
                />
                <Text
                  className={`text-[13px] font-semibold leading-4 ${getToneTextClassName(
                    label.tone,
                  )}`}
                  numberOfLines={1}
                >
                  {label.text}
                </Text>
              </View>
            ))}

            <View className="min-h-9 flex-row items-center gap-2 rounded-md px-1">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconCustomer}
                style={{ height: 20, tintColor: colors.text, width: 20 }}
              />
              <Text
                className="text-[13px] leading-4 text-neo-text"
                numberOfLines={1}
              >
                {conversation.assignmentLabel}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-7 items-center justify-center gap-5">
          {conversation.unreadCount > 0 ? (
            <View className="h-7 min-w-7 items-center justify-center rounded-full bg-neo-terracotta px-2">
              <Text
                className="text-center text-[13px] font-bold leading-4 text-white"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {conversation.unreadCount}
              </Text>
            </View>
          ) : (
            <View className="h-8" />
          )}
          <Text className="text-[26px] leading-7 text-neo-text-muted">{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

function ConversationList({
  conversationsToShow,
  forceEmpty,
  isSearchActive,
  sourceTab,
}: {
  conversationsToShow: readonly Conversation[];
  forceEmpty: boolean;
  isSearchActive: boolean;
  sourceTab: ConversationFilter;
}) {
  if (forceEmpty || conversations.length === 0) {
    return <InboxEmptyState />;
  }

  if (conversationsToShow.length === 0) {
    return (
      <View className="items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-7">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.emptyInbox}
          style={{ height: 128, width: 168 }}
        />
        <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
          No matching conversations
        </Text>
        <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
          Try another filter or search term. Customer conversations will stay
          listed here without storing them locally.
        </Text>
        {isSearchActive ? (
          <Text className="mt-4 text-center text-[13px] font-semibold leading-5 text-neo-info">
            Search is active
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View className="overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {conversationsToShow.map((conversation) => (
        <ConversationRow
          conversation={conversation}
          key={conversation.id}
          sourceTab={sourceTab}
        />
      ))}
    </View>
  );
}

function InboxSkeleton() {
  return (
    <View className="mt-6 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {[0, 1, 2, 3, 4].map((item) => (
        <View
          className="min-h-[132px] flex-row items-center gap-3 border-b border-neo-border px-4 py-4"
          key={item}
        >
          <View className="h-3.5 w-3.5 rounded-full bg-neo-surface-alt" />
          <View className="h-16 w-16 rounded-full bg-neo-surface-alt" />
          <View className="flex-1 gap-2">
            <View className="h-5 w-2/5 rounded-full bg-neo-surface-alt" />
            <View className="h-4 w-4/5 rounded-full bg-neo-surface-alt" />
            <View className="h-9 w-3/5 rounded-md bg-neo-surface-alt" />
          </View>
          <View className="h-8 w-8 rounded-full bg-neo-surface-alt" />
        </View>
      ))}
    </View>
  );
}

function InboxErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="mt-6 rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EF]">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.errorWhatsappDisconnected}
          style={{ height: 40, width: 40 }}
        />
      </View>
      <Text className="mt-4 text-[20px] font-bold leading-7 text-neo-text">
        Could not load inbox
      </Text>
      <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
        Check your connection and try again. Cached conversations stay read-only
        when Neo is offline.
      </Text>
      <Pressable
        accessibilityLabel="Retry loading inbox"
        accessibilityRole="button"
        className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-4"
        onPress={onRetry}
      >
        <Text className="text-[15px] font-bold leading-5 text-white">Retry</Text>
      </Pressable>
    </View>
  );
}

function InboxEmptyState() {
  return (
    <View className="items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-7">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.emptyInbox}
        style={{ height: 138, width: 180 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        No conversations yet
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        Customer WhatsApp conversations will appear here after setup. Send a test
        message when the connection is ready.
      </Text>
      <Link asChild href={routes.whatsappSetup as Href}>
        <Pressable
          accessibilityLabel="Open WhatsApp setup"
          accessibilityRole="link"
          className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-5"
        >
          <Text className="text-[15px] font-bold leading-5 text-white">
            Check WhatsApp setup
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

export function InboxConversationListScreen({
  initialState = "ready",
}: {
  initialState?: MockScreenState;
}) {
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const inboxUnreadCount = useOperationsStore(
    (store) => store.attentionCounts.inbox,
  );
  const setInboxUnreadCount = useOperationsStore(
    (store) => store.setInboxUnreadCount,
  );
  const isOnline = useConnectivityStore((store) => store.isOnline);
  const lastSyncedLabel = useConnectivityStore((store) => store.lastSyncedLabel);
  const markSynced = useConnectivityStore((store) => store.markSynced);
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const [query, setQuery] = useState("");
  const [viewState, setViewState] = useState<InboxViewState>(
    initialState === "loading" || initialState === "error"
      ? initialState
      : "ready",
  );
  const isOffline = initialState === "offline" || !isOnline;
  const isPermissionLimited = initialState === "permission";
  const unreadCount =
    initialState === "empty" ? 0 : getInboxUnreadCount(conversations);

  const visibleConversations = useMemo(
    () => filterConversations({ filter: activeFilter, onlyUnassigned, query }),
    [activeFilter, onlyUnassigned, query],
  );

  useEffect(() => {
    trackScreenStateSeen({
      errorCategory: "inbox_load_failed",
      hasCachedData: initialState !== "empty",
      screen: "inbox",
      state: initialState,
    });
  }, [initialState]);

  useEffect(() => {
    setInboxUnreadCount(unreadCount);
  }, [setInboxUnreadCount, unreadCount]);

  function retryInboxLoad() {
    setViewState("loading");
    setTimeout(() => {
      setViewState("ready");
      markSynced();
    }, 350);
  }

  function toggleSearch() {
    setIsSearchVisible((currentValue) => {
      if (currentValue) {
        setQuery("");
      }

      return !currentValue;
    });
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
            <View className="flex-row flex-wrap items-center gap-3">
              <Text className="text-[32px] font-bold leading-10 text-neo-primary">
                Inbox
              </Text>
              <View className="min-h-9 min-w-12 items-center justify-center rounded-full bg-neo-primary px-3">
                <Text
                  className="text-[16px] font-bold leading-5 text-white"
                  style={{ fontVariant: ["tabular-nums"] }}
                >
                  {inboxUnreadCount}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-[17px] leading-6 text-neo-text-muted">
              All your customer conversations
            </Text>
          </View>

          <HeaderActions
            isSearchVisible={isSearchVisible}
            onToggleFilter={() => setOnlyUnassigned((currentValue) => !currentValue)}
            onToggleSearch={toggleSearch}
            onlyUnassigned={onlyUnassigned}
          />
        </View>

        <ConnectionChips isOnline={!isOffline} lastSyncedLabel={lastSyncedLabel} />

        {isOffline ? (
          <StateBanner
            message="Cached conversations remain visible. Sending replies, receipt decisions, and sensitive updates stay disabled until Neo is online."
            title="Offline read-only inbox"
            tone="offline"
          />
        ) : null}
        {isPermissionLimited ? (
          <StateBanner
            message="This staff view is limited to assigned conversations. Ask the owner/admin to change inbox access."
            title="Limited inbox access"
            tone="permission"
          />
        ) : null}

        {isSearchVisible ? (
          <SearchField
            onChangeText={setQuery}
            onClear={() => setQuery("")}
            value={query}
          />
        ) : null}

        {onlyUnassigned ? (
          <View className="mt-3 self-start rounded-full border border-neo-info bg-[#EDF6FA] px-3 py-2">
            <Text className="text-[13px] font-bold leading-4 text-neo-info">
              Showing unassigned conversations
            </Text>
          </View>
        ) : null}

        <FilterChips activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        <View className="mt-3">
          {viewState === "loading" ? <InboxSkeleton /> : null}
          {viewState === "error" ? <InboxErrorState onRetry={retryInboxLoad} /> : null}
          {viewState === "ready" ? (
            <ConversationList
              conversationsToShow={visibleConversations}
              forceEmpty={initialState === "empty"}
              isSearchActive={normalizeSearch(query).length > 0}
              sourceTab={activeFilter}
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
