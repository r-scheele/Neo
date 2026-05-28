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
import { getCustomerProfile, useApiClient } from "@/lib/api";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";

import type {
  CustomerActivity,
  CustomerMetric,
  CustomerNote,
  CustomerOrder,
  CustomerOrderStatus,
  CustomerPreference,
  CustomerProfileRecord,
  CustomerStatusTone,
} from "./customerProfileData";
import {
  formatCustomerNaira,
  getCustomerProfileById,
  normalizeBackendCustomerProfile,
} from "./customerProfileData";

type ProfileTab = "summary" | "orders" | "notes" | "activity";

type Notice = {
  message: string;
  title: string;
};

const profileTabs: readonly {
  icon: ImageSourcePropType;
  id: ProfileTab;
  label: string;
}[] = [
  { icon: images.iconCustomer, id: "summary", label: "Summary" },
  { icon: images.iconOrder, id: "orders", label: "Orders" },
  { icon: images.iconAiDraft, id: "notes", label: "Notes" },
  { icon: images.iconFollowUps, id: "activity", label: "Activity" },
];

function getToneStyle(tone: CustomerStatusTone) {
  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      textClassName: "text-neo-success",
      tintColor: colors.success,
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

  if (tone === "info") {
    return {
      backgroundClassName: "bg-[#EDF6FA]",
      borderClassName: "border-[#B9D3DF]",
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

function getOrderStatusStyle(status: CustomerOrderStatus) {
  if (status === "paid") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      label: "Paid",
      textClassName: "text-neo-success",
    };
  }

  if (status === "review") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-neo-warning",
      label: "Review",
      textClassName: "text-neo-warning",
    };
  }

  return {
    backgroundClassName: "bg-[#FFF7E5]",
    borderClassName: "border-neo-warning",
    label: "Unpaid",
    textClassName: "text-neo-warning",
  };
}

function Header() {
  const router = useRouter();

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
        <Text
          className="text-[24px] font-bold leading-8 text-neo-text"
          numberOfLines={1}
        >
          Customer Profile
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Edit customer profile"
        accessibilityRole="button"
        className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
      >
        <Text className="text-[24px] font-bold leading-7 text-neo-text">/</Text>
      </Pressable>

      <Pressable
        accessibilityLabel="More customer actions"
        accessibilityRole="button"
        className="min-h-12 w-10 items-center justify-center"
      >
        <Text className="text-[28px] font-bold leading-8 text-neo-text">...</Text>
      </Pressable>
    </View>
  );
}

function CustomerHero({
  customer,
  isCompactPhone,
}: {
  customer: CustomerProfileRecord;
  isCompactPhone: boolean;
}) {
  const statusStyle = getToneStyle(customer.avatarTone);

  return (
    <View className="mt-6 flex-row items-center gap-4">
      <View
        className={`items-center justify-center rounded-full border ${
          isCompactPhone ? "h-24 w-24" : "h-32 w-32"
        } ${statusStyle.borderClassName} bg-[#F3E8D5]`}
      >
        <Text
          className={`font-bold text-neo-primary ${
            isCompactPhone
              ? "text-[36px] leading-[44px]"
              : "text-[48px] leading-[56px]"
          }`}
        >
          {customer.customerInitials}
        </Text>
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text
            className="min-w-0 text-[28px] font-bold leading-9 text-neo-text"
            numberOfLines={2}
          >
            {customer.customerName}
          </Text>
          <View className="rounded-lg border border-[#B9D7C4] bg-[#EEF8F0] px-2 py-1">
            <Text className="text-[13px] font-bold leading-4 text-neo-success">
              {customer.statusLabel}
            </Text>
          </View>
        </View>

        <View className="mt-3 gap-2">
          <View className="flex-row items-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconDelivery}
              style={{ height: 20, tintColor: colors.info, width: 20 }}
            />
            <Text
              className="min-w-0 flex-1 text-[15px] leading-5 text-neo-text"
              numberOfLines={1}
            >
              {customer.locationLabel}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconProduct}
              style={{ height: 20, tintColor: colors.text, width: 20 }}
            />
            <Text
              className="min-w-0 flex-1 text-[15px] leading-5 text-neo-text"
              numberOfLines={2}
            >
              {customer.primaryPreference}
            </Text>
          </View>
        </View>
      </View>

      <View
        className={`border-l border-neo-border pl-3 ${
          isCompactPhone ? "max-w-[92px]" : "max-w-[112px]"
        }`}
      >
        <Text className="text-[13px] leading-4 text-neo-text-muted">
          Customer since
        </Text>
        <Text
          className="mt-1 text-[16px] font-bold leading-5 text-neo-text"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {customer.customerSince}
        </Text>
        <Text className="mt-4 text-[13px] leading-4 text-neo-text-muted">
          Total orders
        </Text>
        <Text
          className="mt-1 text-[17px] font-bold leading-6 text-neo-primary"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {customer.orderCount}
        </Text>
      </View>
    </View>
  );
}

function MetricCard({
  metric,
  showDivider,
}: {
  metric: CustomerMetric;
  showDivider: boolean;
}) {
  const statusStyle = metric.status ? getOrderStatusStyle(metric.status) : null;

  return (
    <View
      className={`min-h-[116px] flex-1 px-3 py-4 ${
        showDivider ? "border-l border-neo-border" : ""
      }`}
    >
      <View className="flex-row items-center gap-2">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={metric.icon}
          style={{ height: 24, tintColor: colors.text, width: 24 }}
        />
        <Text
          className="min-w-0 flex-1 text-[13px] font-semibold leading-4 text-neo-text"
          numberOfLines={2}
        >
          {metric.label}
        </Text>
      </View>
      <Text
        className={`mt-3 text-[16px] leading-5 ${
          metric.id === "outstanding" ? "font-bold text-neo-warning" : "text-neo-text"
        }`}
        numberOfLines={2}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {metric.value}
      </Text>
      {metric.detail ? (
        statusStyle ? (
          <View
            className={`mt-2 self-start rounded-md border px-2 py-1 ${statusStyle.borderClassName} ${statusStyle.backgroundClassName}`}
          >
            <Text className={`text-[13px] font-bold leading-4 ${statusStyle.textClassName}`}>
              {metric.detail}
            </Text>
          </View>
        ) : (
          <Text
            className="mt-2 text-[14px] font-bold leading-5 text-neo-primary"
            numberOfLines={2}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {metric.detail}
          </Text>
        )
      ) : null}
    </View>
  );
}

function MetricsStrip({ metrics }: { metrics: readonly CustomerMetric[] }) {
  return (
    <View className="mt-6 flex-row overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          showDivider={index > 0}
        />
      ))}
    </View>
  );
}

function QuickActions({
  actionsDisabled,
  customer,
  onAddNote,
  onCreateFollowUp,
}: {
  actionsDisabled: boolean;
  customer: CustomerProfileRecord;
  onAddNote: () => void;
  onCreateFollowUp: () => void;
}) {
  const conversationHref = `/conversation/${customer.conversationId}` as Href;
  const latestOrderHref = customer.latestOrderHref as Href;
  const secondaryActionClassName = `min-h-24 flex-1 items-center justify-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-3 ${
    actionsDisabled ? "opacity-60" : ""
  }`;
  const secondaryIconTint = actionsDisabled ? colors.textMuted : colors.text;
  const secondaryTextClassName = actionsDisabled
    ? "text-neo-text-muted"
    : "text-neo-text";

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          Quick actions
        </Text>
        <Text className="text-[15px] font-bold leading-5 text-neo-primary">
          View all {">"}
        </Text>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <Link asChild href={conversationHref}>
          <Pressable
            accessibilityLabel={`Open conversation with ${customer.customerName}`}
            accessibilityRole="link"
            className="min-h-24 flex-1 basis-[46%] items-center justify-center gap-2 rounded-lg bg-neo-primary px-3"
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconInbox}
              style={{ height: 30, tintColor: colors.surface, width: 30 }}
            />
            <Text className="text-center text-[16px] font-bold leading-5 text-white">
              Open conversation
            </Text>
          </Pressable>
        </Link>

        <Pressable
          accessibilityLabel="Add customer note"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className={`${secondaryActionClassName} basis-[23%]`}
          disabled={actionsDisabled}
          onPress={onAddNote}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconAiDraft}
            style={{ height: 28, tintColor: secondaryIconTint, width: 28 }}
          />
          <Text
            className={`text-center text-[15px] font-bold leading-5 ${secondaryTextClassName}`}
          >
            Add note
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Create customer follow-up"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className={`${secondaryActionClassName} basis-[30%]`}
          disabled={actionsDisabled}
          onPress={onCreateFollowUp}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconFollowUps}
            style={{ height: 28, tintColor: secondaryIconTint, width: 28 }}
          />
          <Text
            className={`text-center text-[15px] font-bold leading-5 ${secondaryTextClassName}`}
          >
            Create follow-up
          </Text>
        </Pressable>

        <Link asChild href={latestOrderHref}>
          <Pressable
            accessibilityLabel={`View latest order for ${customer.customerName}`}
            accessibilityRole="link"
            className="min-h-24 flex-1 basis-[30%] items-center justify-center gap-2 rounded-lg border border-neo-border bg-neo-surface px-3"
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconOrder}
              style={{ height: 30, tintColor: colors.text, width: 30 }}
            />
            <Text className="text-center text-[15px] font-bold leading-5 text-neo-text">
              View latest order
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function ProfileTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}) {
  return (
    <View className="mt-6 flex-row overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      {profileTabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <Pressable
            accessibilityLabel={`Show customer ${tab.label}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`min-h-14 flex-1 flex-row items-center justify-center gap-2 px-2 ${
              isActive ? "bg-neo-surface-alt" : "bg-neo-surface"
            }`}
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={tab.icon}
              style={{
                height: 21,
                tintColor: isActive ? colors.primary : colors.text,
                width: 21,
              }}
            />
            <Text
              className={`text-[14px] font-bold leading-5 ${
                isActive ? "text-neo-primary" : "text-neo-text"
              }`}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionCard({
  actionLabel,
  children,
  title,
}: {
  actionLabel?: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <View className="mt-4 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
      <View className="flex-row items-center justify-between gap-3 px-4 py-3">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          {title}
        </Text>
        {actionLabel ? (
          <Text className="text-[15px] font-bold leading-5 text-neo-primary">
            {actionLabel}
          </Text>
        ) : null}
      </View>
      <View className="border-t border-neo-border">{children}</View>
    </View>
  );
}

function PreferenceRow({
  preference,
  showDivider,
}: {
  preference: CustomerPreference;
  showDivider: boolean;
}) {
  return (
    <View
      className={`flex-row items-center gap-3 px-4 py-3 ${
        showDivider ? "border-b border-neo-border" : ""
      }`}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={preference.icon}
        style={{ height: 22, tintColor: colors.text, width: 22 }}
      />
      <Text className="min-w-0 flex-1 text-[14px] leading-5 text-neo-text-muted">
        {preference.label}
      </Text>
      <Text
        className="min-w-0 flex-1 text-right text-[14px] font-bold leading-5 text-neo-primary"
        numberOfLines={3}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {preference.value}
      </Text>
    </View>
  );
}

function PreferencesCard({
  preferences,
}: {
  preferences: readonly CustomerPreference[];
}) {
  return (
    <SectionCard title="At a glance">
      {preferences.map((preference, index) => (
        <PreferenceRow
          key={preference.id}
          preference={preference}
          showDivider={index < preferences.length - 1}
        />
      ))}
    </SectionCard>
  );
}

function NoteCard({
  canEdit,
  isEditing,
  note,
  noteDraft,
  onChangeNote,
  onEdit,
  onSave,
}: {
  canEdit: boolean;
  isEditing: boolean;
  note: CustomerNote | null;
  noteDraft: string;
  onChangeNote: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  return (
    <SectionCard actionLabel="View all notes" title="Recent note">
      <View className="p-4">
        <View className="flex-row gap-3 rounded-lg border border-neo-border bg-[#FFF8EA] px-3 py-3">
          <View className="h-14 w-14 items-center justify-center rounded-lg border border-[#E9B27A] bg-neo-surface">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconAiDraft}
              style={{ height: 30, tintColor: colors.warning, width: 30 }}
            />
          </View>
          <View className="min-w-0 flex-1">
            {isEditing ? (
              <TextInput
                accessibilityLabel="Edit customer note"
                className="min-h-[92px] rounded-lg border border-neo-border bg-neo-surface px-3 py-2 text-[15px] leading-6 text-neo-text"
                multiline
                onChangeText={onChangeNote}
                textAlignVertical="top"
                value={noteDraft}
              />
            ) : (
              <Text className="text-[15px] leading-6 text-neo-text">
                {note?.body ?? "No private notes yet. Add a safe internal note when it helps the next reply."}
              </Text>
            )}
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconPermission}
                style={{ height: 16, tintColor: colors.textMuted, width: 16 }}
              />
              <Text className="text-[13px] leading-4 text-neo-text-muted">
                {note
                  ? `${note.visibilityLabel} - ${note.dateLabel} by ${note.authorLabel}`
                  : "Internal note - local only"}
              </Text>
            </View>
          </View>
          {canEdit ? (
            <Pressable
              accessibilityLabel={isEditing ? "Save customer note" : "Edit customer note"}
              accessibilityRole="button"
              className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
              onPress={isEditing ? onSave : onEdit}
            >
              <Text className="text-[20px] font-bold leading-6 text-neo-text">
                {isEditing ? "OK" : "/"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SectionCard>
  );
}

function EmptyOrders() {
  return (
    <View className="items-center px-5 py-7">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.emptyProducts}
        style={{ height: 132, width: 168 }}
      />
      <Text className="mt-3 text-center text-[18px] font-bold leading-6 text-neo-text">
        No orders yet
      </Text>
      <Text className="mt-2 text-center text-[14px] leading-5 text-neo-text-muted">
        Orders linked to this customer will appear here after capture.
      </Text>
    </View>
  );
}

function OrderRow({
  order,
  showDivider,
}: {
  order: CustomerOrder;
  showDivider: boolean;
}) {
  const statusStyle = getOrderStatusStyle(order.status);

  return (
    <Link asChild href={order.href as Href}>
      <Pressable
        accessibilityLabel={`Open order ${order.id}`}
        accessibilityRole="link"
        className={`min-h-20 flex-row items-center gap-3 px-4 py-3 ${
          showDivider ? "border-b border-neo-border" : ""
        }`}
      >
        <View className="h-12 w-12 items-center justify-center rounded-full border border-neo-border bg-neo-background">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconOrder}
            style={{ height: 28, tintColor: colors.text, width: 28 }}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className="text-[16px] font-bold leading-5 text-neo-text"
            numberOfLines={1}
          >
            {order.id}
          </Text>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
            {order.itemCountLabel}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className="text-right text-[16px] font-bold leading-5 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatCustomerNaira(order.amount)}
          </Text>
          <View
            className={`mt-2 rounded-md border px-2 py-1 ${statusStyle.borderClassName} ${statusStyle.backgroundClassName}`}
          >
            <Text className={`text-[13px] font-bold leading-4 ${statusStyle.textClassName}`}>
              {statusStyle.label}
            </Text>
          </View>
        </View>
        <View className="w-14 items-end">
          <Text
            className="text-right text-[14px] leading-5 text-neo-text-muted"
            numberOfLines={2}
          >
            {order.dateLabel}
          </Text>
        </View>
        <Text className="text-[24px] font-bold leading-7 text-neo-text">{">"}</Text>
      </Pressable>
    </Link>
  );
}

function OrderHistory({ orders }: { orders: readonly CustomerOrder[] }) {
  return (
    <SectionCard actionLabel="View all orders" title="Order history">
      {orders.length > 0 ? (
        <>
          {orders.map((order, index) => (
            <OrderRow
              key={order.id}
              order={order}
              showDivider={index < orders.length - 1}
            />
          ))}
          <View className="border-t border-neo-border px-4 py-3">
            <Text className="text-center text-[15px] font-bold leading-5 text-neo-primary">
              View all orders {">"}
            </Text>
          </View>
        </>
      ) : (
        <EmptyOrders />
      )}
    </SectionCard>
  );
}

function getActivityToneStyle(tone: CustomerActivity["tone"]) {
  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      tintColor: colors.success,
    };
  }

  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-[#E9B27A]",
      tintColor: colors.warning,
    };
  }

  return {
    backgroundClassName: "bg-[#EDF6FA]",
    borderClassName: "border-[#B9D3DF]",
    tintColor: colors.info,
  };
}

function ActivityRow({
  activity,
  isLast,
}: {
  activity: CustomerActivity;
  isLast: boolean;
}) {
  const toneStyle = getActivityToneStyle(activity.tone);

  return (
    <View className="flex-row gap-3 px-4 pt-3">
      <View className="items-center">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full border ${toneStyle.borderClassName} ${toneStyle.backgroundClassName}`}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={activity.icon}
            style={{ height: 26, tintColor: toneStyle.tintColor, width: 26 }}
          />
        </View>
        {!isLast ? <View className="w-px flex-1 bg-neo-border" /> : null}
      </View>
      <View className={`min-w-0 flex-1 pb-4 ${!isLast ? "border-b border-neo-border" : ""}`}>
        <View className="flex-row items-start gap-3">
          <View className="min-w-0 flex-1">
            <Text
              className="text-[15px] font-bold leading-5 text-neo-text"
              numberOfLines={2}
            >
              {activity.title}
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
              {activity.detail}
            </Text>
          </View>
          <Text
            className="max-w-[104px] text-right text-[13px] leading-5 text-neo-text-muted"
            numberOfLines={2}
          >
            {activity.timeLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function EmptyActivity() {
  return (
    <View className="items-center px-5 py-7">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.iconCustomer}
        style={{ height: 90, tintColor: colors.textMuted, width: 90 }}
      />
      <Text className="mt-3 text-center text-[18px] font-bold leading-6 text-neo-text">
        No activity yet
      </Text>
      <Text className="mt-2 text-center text-[14px] leading-5 text-neo-text-muted">
        Customer activity will appear after conversations, orders, and notes.
      </Text>
    </View>
  );
}

function RecentActivity({ activity }: { activity: readonly CustomerActivity[] }) {
  return (
    <SectionCard actionLabel="View full activity" title="Recent activity">
      {activity.length > 0 ? (
        <>
          {activity.map((item, index) => (
            <ActivityRow
              activity={item}
              isLast={index === activity.length - 1}
              key={item.id}
            />
          ))}
          <View className="border-t border-neo-border px-4 py-3">
            <Text className="text-center text-[15px] font-bold leading-5 text-neo-primary">
              View all activity {">"}
            </Text>
          </View>
        </>
      ) : (
        <EmptyActivity />
      )}
    </SectionCard>
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

function getEmptyCustomerProfile(
  customer: CustomerProfileRecord,
): CustomerProfileRecord {
  return {
    ...customer,
    activity: [],
    metrics: [
      {
        icon: images.iconOrder,
        id: "last-order",
        label: "Last order",
        value: "No orders yet",
      },
      {
        icon: images.iconFollowUps,
        id: "next-follow-up",
        label: "Next follow-up",
        value: "None due",
      },
      {
        icon: images.iconPaid,
        id: "outstanding",
        label: "Outstanding",
        value: formatCustomerNaira(0),
      },
      {
        icon: images.iconPermission,
        id: "payment-habit",
        label: "Payment habit",
        value: "Not enough history",
      },
    ],
    notes: [],
    orderCount: 0,
    orders: [],
    statusLabel: "New customer",
    statusTone: "info",
  };
}

function MissingCustomerState({ customerId }: { customerId?: string }) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neo-background px-5 py-16">
      <StateCard
        actionLabel="Go back"
        image={images.errorPermissionDenied}
        message={`This local mock customer is not available.${
          customerId ? ` ID: ${customerId}` : ""
        }`}
        onAction={() => router.back()}
        title="Customer not found"
      />
    </View>
  );
}

function CustomerSkeleton({
  isCompactPhone,
  horizontalPadding,
}: {
  horizontalPadding: number;
  isCompactPhone: boolean;
}) {
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
        <SkeletonRows count={6} />
      </View>
    </ScrollView>
  );
}

export function CustomerProfileScreen({
  customerId,
  initialState = "ready",
}: {
  customerId?: string;
  initialState?: MockScreenState;
}) {
  const apiClient = useApiClient();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 430;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const localCustomer = useMemo(
    () => getCustomerProfileById(customerId),
    [customerId],
  );
  const [backendCustomer, setBackendCustomer] =
    useState<CustomerProfileRecord | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [activeTab, setActiveTab] = useState<ProfileTab>("summary");
  const [currentState, setCurrentState] = useState<MockScreenState>(() =>
    initialState === "ready" &&
    customerId &&
    isBackendRecordId(customerId) &&
    !localCustomer
      ? "loading"
      : initialState,
  );
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [localNote, setLocalNote] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const customer = backendCustomer ?? localCustomer;

  useEffect(() => {
    if (!customerId || initialState !== "ready" || !isBackendRecordId(customerId)) {
      return;
    }

    let isActive = true;

    getCustomerProfile(apiClient, customerId).then((result) => {
      if (!isActive) {
        return;
      }

      if (result.ok) {
        setBackendCustomer(normalizeBackendCustomerProfile(result.data.customer));
        setNotice(null);
        setCurrentState("ready");
        return;
      }

      if (localCustomer) {
        setNotice({
          message: `${result.error.message} Showing the isolated demo customer instead.`,
          title: "Backend customer unavailable",
        });
        setCurrentState("ready");
        return;
      }

      setNotice(null);
      setCurrentState("error");
    });

    return () => {
      isActive = false;
    };
  }, [apiClient, customerId, initialState, localCustomer, reloadVersion]);

  if (currentState === "loading") {
    return (
      <CustomerSkeleton
        horizontalPadding={horizontalPadding}
        isCompactPhone={isCompactPhone}
      />
    );
  }

  if (currentState === "error") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          actionLabel="Retry profile"
          image={images.errorOffline}
          message="The backend customer profile could not load. Retry asks the commerce records API again."
          onAction={() => {
            if (customerId && isBackendRecordId(customerId) && !localCustomer) {
              setCurrentState("loading");
            }

            setReloadVersion((currentValue) => currentValue + 1);
          }}
          title="Could not load customer"
        />
      </View>
    );
  }

  if (!customer) {
    return <MissingCustomerState customerId={customerId} />;
  }

  const displayCustomer =
    currentState === "empty" ? getEmptyCustomerProfile(customer) : customer;
  const firstNote = displayCustomer.notes[0] ?? null;
  const canModifyCustomer =
    currentState !== "offline" && currentState !== "permission";
  const noteBody = localNote || firstNote?.body || "";

  function startNoteEdit() {
    if (!customer) {
      return;
    }

    setLocalNote(noteBody);
    setIsEditingNote(true);
    setNotice({
      message:
        "Notes stay local to this screen. Do not store payment proof, private messages, or sensitive personal details here.",
      title: "Editing internal note",
    });
  }

  function saveNote() {
    const trimmedNote = localNote.trim();

    if (!trimmedNote) {
      setNotice({
        message: "Add a short, safe note before saving.",
        title: "Note cannot be empty",
      });
      return;
    }

    setLocalNote(trimmedNote);
    setIsEditingNote(false);
    setNotice({
      message:
        "Note saved locally in component state only. Nothing was persisted or synced.",
      title: "Note saved locally",
    });
  }

  function showCreateFollowUpNotice() {
    setNotice({
      message:
        "Follow-up creation is not connected here. Use the Follow-ups tab for the current local queue.",
      title: "Create follow-up not connected",
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
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <Header />
        {currentState === "offline" ? (
          <StateBanner
            message="Cached customer context is visible. New notes are disabled until Neo is online."
            title="Offline customer profile"
            tone="offline"
          />
        ) : null}
        {currentState === "permission" ? (
          <StateBanner
            message="Sensitive notes are hidden for restricted staff. Ask an owner or manager for access."
            title="Limited customer access"
            tone="permission"
          />
        ) : null}
        {notice ? <NoticeBanner notice={notice} /> : null}
        <CustomerHero customer={displayCustomer} isCompactPhone={isCompactPhone} />
        <MetricsStrip metrics={displayCustomer.metrics} />
        <QuickActions
          actionsDisabled={!canModifyCustomer}
          customer={displayCustomer}
          onAddNote={startNoteEdit}
          onCreateFollowUp={showCreateFollowUpNotice}
        />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {(activeTab === "summary" || activeTab === "orders") ? (
          <PreferencesCard preferences={displayCustomer.preferences} />
        ) : null}
        {(activeTab === "summary" || activeTab === "notes") ? (
          <NoteCard
            canEdit={canModifyCustomer}
            isEditing={isEditingNote}
            note={
              currentState === "permission"
                ? {
                    authorLabel: "Owner",
                    body: "Sensitive notes are hidden for your current role.",
                    dateLabel: "Hidden",
                    id: "permission-hidden-note",
                    visibilityLabel: "Restricted note",
                  }
                : firstNote
            }
            noteDraft={noteBody}
            onChangeNote={setLocalNote}
            onEdit={startNoteEdit}
            onSave={saveNote}
          />
        ) : null}
        {(activeTab === "summary" || activeTab === "orders") ? (
          <OrderHistory orders={displayCustomer.orders} />
        ) : null}
        {(activeTab === "summary" || activeTab === "activity") ? (
          <RecentActivity activity={displayCustomer.activity} />
        ) : null}
      </View>
    </ScrollView>
  );
}

function isBackendRecordId(recordId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordId);
}
