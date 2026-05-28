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
import {
  cancelCommerceOrder,
  getCommerceOrder,
  updateCommerceOrderDeliveryStatus,
  useApiClient,
} from "@/lib/api";
import type { BackendOrderDeliveryState } from "@/lib/api";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

import type { MockStaffRole } from "@/features/permissions/permissionData";
import { getPermissionDeniedHref } from "@/features/permissions/permissionData";
import type {
  OrderDetailItem,
  OrderDetailRecord,
  OrderPaymentState,
  OrderStatusTone,
  OrderTimelineEvent,
  OrderTimelineTone,
} from "./orderDetailData";
import {
  calculateOrderTotals,
  formatOrderNaira,
  getOrderDetailById,
  normalizeBackendOrderDetail,
} from "./orderDetailData";

type Notice = {
  message: string;
  title: string;
};

function getStatusChipClassName(tone: OrderStatusTone) {
  if (tone === "success") {
    return "border-neo-success bg-[#EEF8F0] text-neo-success";
  }

  if (tone === "warning") {
    return "border-neo-warning bg-[#FFF7E5] text-neo-warning";
  }

  if (tone === "info") {
    return "border-neo-info bg-[#EDF6FA] text-neo-info";
  }

  return "border-neo-border bg-neo-surface text-neo-text-muted";
}

function getPaymentTone(paymentState: OrderPaymentState) {
  if (paymentState === "paid") {
    return {
      borderClassName: "border-neo-success",
      icon: images.iconPaid,
      label: "Reviewed",
      textClassName: "text-neo-success",
      tintColor: colors.success,
    };
  }

  if (paymentState === "receipt-review") {
    return {
      borderClassName: "border-neo-warning",
      icon: images.iconReceiptReview,
      label: "Needs review",
      textClassName: "text-neo-warning",
      tintColor: colors.warning,
    };
  }

  return {
    borderClassName: "border-neo-warning",
    icon: images.iconWarning,
    label: "Awaiting payment",
    textClassName: "text-neo-warning",
    tintColor: colors.warning,
  };
}

function getTimelineStyle(tone: OrderTimelineTone) {
  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-neo-warning",
      tintColor: colors.warning,
    };
  }

  if (tone === "info") {
    return {
      backgroundClassName: "bg-[#EDF6FA]",
      borderClassName: "border-[#B9D3DF]",
      tintColor: colors.info,
    };
  }

  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      tintColor: colors.success,
    };
  }

  return {
    backgroundClassName: "bg-neo-background",
    borderClassName: "border-neo-border",
    tintColor: colors.textMuted,
  };
}

function Header({ order }: { order: OrderDetailRecord }) {
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
        <Text className="text-[28px] font-bold leading-9 text-neo-text">
          Order detail
        </Text>
        <View className="mt-1 flex-row flex-wrap items-center gap-2">
          <Text
            className="text-[16px] leading-6 text-neo-text-muted"
            numberOfLines={1}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {order.displayId}
          </Text>
          <View
            className={`rounded-md border px-3 py-1 ${getStatusChipClassName(
              order.statusTone,
            )}`}
          >
            <Text className="text-[13px] font-bold leading-4">
              {order.statusLabel}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityLabel="More order actions"
        accessibilityRole="button"
        className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
      >
        <Text className="text-[28px] font-bold leading-8 text-neo-text">...</Text>
      </Pressable>
    </View>
  );
}

function CustomerSummary({ order }: { order: OrderDetailRecord }) {
  const conversationHref = `/conversation/${order.conversationId}` as Href;
  const customerHref = `/customer/${order.customer.customerId}` as Href;

  return (
    <View className="mt-6 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <View className="flex-row items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#4F8A60]">
          <Text className="text-[24px] font-bold leading-8 text-white">
            {order.customer.customerInitials}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text
              className="text-[20px] font-bold leading-7 text-neo-text"
              numberOfLines={1}
            >
              {order.customer.customerName}
            </Text>
            <View className="rounded-md border border-[#B9D7C4] bg-[#EEF8F0] px-2 py-1">
              <Text className="text-[13px] font-bold leading-4 text-neo-success">
                {order.customer.relationshipLabel}
              </Text>
            </View>
          </View>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
            Customer since {order.customer.customerSince} -{" "}
            {order.customer.orderCount} orders
          </Text>
          <Link asChild href={conversationHref}>
            <Pressable
              accessibilityLabel="Open source conversation"
              accessibilityRole="link"
              className="mt-2 min-h-8 flex-row items-center gap-2"
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconInbox}
                style={{ height: 20, tintColor: colors.textMuted, width: 20 }}
              />
              <Text
                className="min-w-0 flex-1 text-[14px] leading-5 text-neo-text"
                numberOfLines={1}
              >
                From conversation: {order.sourceTitle}
              </Text>
            </Pressable>
          </Link>
        </View>

        <Link asChild href={customerHref}>
          <Pressable
            accessibilityLabel={`Open ${order.customer.customerName} customer profile`}
            accessibilityRole="link"
            className="min-h-11 w-8 items-end justify-center"
          >
            <Text className="text-[28px] font-bold leading-8 text-neo-text">{">"}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function SummaryMetrics({
  isNarrow,
  order,
  totals,
}: {
  isNarrow: boolean;
  order: OrderDetailRecord;
  totals: ReturnType<typeof calculateOrderTotals>;
}) {
  const metrics: readonly {
    icon: ImageSourcePropType;
    label: string;
    value: string;
  }[] = [
    {
      icon: images.iconOrder,
      label: "Order date",
      value: `${order.orderDate}\n${order.orderTime}`,
    },
    {
      icon: images.iconProduct,
      label: "Items",
      value: `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"}`,
    },
    {
      icon: images.iconPaid,
      label: "Total",
      value: formatOrderNaira(totals.total),
    },
    {
      icon: images.iconAiDraft,
      label: "Source",
      value: order.sourceLabel,
    },
  ];

  return (
    <View
      className={`mt-5 overflow-hidden rounded-lg border border-neo-border bg-neo-surface ${
        isNarrow ? "flex-row flex-wrap" : "flex-row"
      }`}
    >
      {metrics.map((metric, index) => (
        <View
          className={`min-h-[116px] px-3 py-4 ${
            isNarrow ? "basis-1/2" : "flex-1"
          } ${
            index > 0 && !isNarrow ? "border-l border-neo-border" : ""
          } ${
            isNarrow && index % 2 === 1 ? "border-l border-neo-border" : ""
          } ${
            isNarrow && index > 1 ? "border-t border-neo-border" : ""
          }`}
          key={metric.label}
        >
          <View className="h-11 w-11 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={metric.icon}
              style={{ height: 24, tintColor: colors.primary, width: 24 }}
            />
          </View>
          <Text
            className="mt-2 text-[12px] font-semibold leading-4 text-neo-text-muted"
            numberOfLines={2}
          >
            {metric.label}
          </Text>
          <Text
            className="mt-2 text-[14px] font-bold leading-5 text-neo-text"
            numberOfLines={3}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {metric.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PaymentStatusCard({ order }: { order: OrderDetailRecord }) {
  const paymentTone = getPaymentTone(order.payment.state);
  const receiptHref = order.payment.receiptId
    ? (`/receipt/${order.payment.receiptId}` as Href)
    : null;

  return (
    <View className="mt-5 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          Payment status
        </Text>
        <View className="flex-row items-center gap-2">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={paymentTone.icon}
            style={{ height: 20, tintColor: paymentTone.tintColor, width: 20 }}
          />
          <Text className={`text-[14px] font-bold leading-5 ${paymentTone.textClassName}`}>
            {paymentTone.label}
          </Text>
        </View>
      </View>

      <View
        className={`mt-4 overflow-hidden rounded-lg border ${paymentTone.borderClassName} bg-[#FFF8EA]`}
      >
        <View className="flex-row items-center gap-3 px-4 py-4">
          <View className="h-16 w-16 items-center justify-center rounded-full border border-[#E6C88E] bg-[#FFF3DD]">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={paymentTone.icon}
              style={{ height: 34, tintColor: paymentTone.tintColor, width: 34 }}
            />
          </View>

          <View className="min-w-0 flex-1">
            <Text
              className="text-[17px] font-bold leading-6 text-neo-text"
              numberOfLines={2}
            >
              {order.payment.title}
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
              {order.payment.detail}
            </Text>
            {order.payment.submittedAt ? (
              <Text
                className="mt-1 text-[14px] leading-5 text-neo-text-muted"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {order.payment.submittedAt}
              </Text>
            ) : null}
          </View>

          <View className="items-end">
            <Text
              className="text-right text-[17px] font-bold leading-6 text-neo-text"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatOrderNaira(order.payment.amount)}
            </Text>
            <Text className="mt-1 text-right text-[13px] leading-4 text-neo-text-muted">
              Total amount
            </Text>
          </View>
        </View>

        <View className="border-t border-[#E6C88E] px-4 py-3">
          <View className="flex-row flex-wrap items-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full border border-neo-warning">
              <Text className="text-[15px] font-bold leading-5 text-neo-warning">
                i
              </Text>
            </View>
            <Text className="min-w-0 flex-1 text-[14px] leading-5 text-neo-text">
              {order.payment.warning}
            </Text>
            {receiptHref ? (
              <Link asChild href={receiptHref}>
                <Pressable
                  accessibilityLabel="Review receipt"
                  accessibilityRole="link"
                  className="min-h-11 items-center justify-center rounded-lg border border-neo-warning bg-neo-surface px-4"
                >
                  <Text className="text-[15px] font-bold leading-5 text-neo-warning">
                    {order.payment.actionLabel}
                  </Text>
                </Pressable>
              </Link>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

function DeliveryCard({
  actionsDisabled,
  onUpdateDelivery,
  order,
}: {
  actionsDisabled: boolean;
  onUpdateDelivery: () => void;
  order: OrderDetailRecord;
}) {
  return (
    <View className="mt-5 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconDelivery}
            style={{ height: 30, tintColor: colors.text, width: 30 }}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[18px] font-bold leading-6 text-neo-text">
            Delivery
          </Text>
          <Text className="mt-1 text-[15px] leading-5 text-neo-text">
            {order.delivery.zone}
          </Text>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
            {order.delivery.estimate}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Update delivery status"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className="min-h-12 items-end justify-center gap-2"
          disabled={actionsDisabled}
          onPress={onUpdateDelivery}
        >
          <View className="rounded-md border border-[#B9D3DF] bg-[#EDF6FA] px-3 py-1">
            <Text className="text-[13px] font-bold leading-4 text-neo-info">
              {order.delivery.stateLabel}
            </Text>
          </View>
          <Text
            className="text-[14px] leading-5 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            Fee: {formatOrderNaira(order.delivery.fee)}
          </Text>
        </Pressable>
        <Text className="text-[28px] font-bold leading-8 text-neo-text">{">"}</Text>
      </View>
    </View>
  );
}

function ItemRow({
  item,
  showDivider,
}: {
  item: OrderDetailItem;
  showDivider: boolean;
}) {
  return (
    <View className={`flex-row gap-3 py-4 ${showDivider ? "border-b border-neo-border" : ""}`}>
      <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconProduct}
          style={{ height: 30, tintColor: colors.text, width: 30 }}
        />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="text-[17px] font-bold leading-6 text-neo-text"
          numberOfLines={2}
        >
          {item.name} ({item.variant})
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
          {item.description}
        </Text>
        <Text
          className="mt-1 text-[14px] leading-5 text-neo-text"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {formatOrderNaira(item.unitPrice)} each
        </Text>
      </View>
      <View className="items-end justify-center gap-3">
        <View className="rounded-md border border-[#B9D7C4] bg-[#EEF8F0] px-4 py-1">
          <Text
            className="text-[15px] font-bold leading-5 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            x {item.quantity}
          </Text>
        </View>
        <Text
          className="text-right text-[17px] font-bold leading-6 text-neo-text"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {formatOrderNaira(item.unitPrice * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

function ItemsCard({
  order,
  totals,
}: {
  order: OrderDetailRecord;
  totals: ReturnType<typeof calculateOrderTotals>;
}) {
  return (
    <View className="mt-5 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <Text className="text-[18px] font-bold leading-6 text-neo-text">
        Items ({totals.itemCount})
      </Text>
      <View className="mt-2">
        {order.items.map((item, index) => (
          <ItemRow
            item={item}
            key={item.id}
            showDivider={index < order.items.length - 1}
          />
        ))}
      </View>

      <View className="border-t border-neo-border py-3">
        <View className="flex-row justify-between gap-4">
          <Text className="text-[15px] leading-5 text-neo-text">Delivery fee</Text>
          <Text
            className="text-right text-[15px] leading-5 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatOrderNaira(totals.deliveryFee)}
          </Text>
        </View>
      </View>

      <View className="rounded-lg border border-[#E6C88E] bg-[#FFF8EA] px-3 py-3">
        <View className="flex-row items-center justify-between gap-4">
          <Text className="text-[19px] font-bold leading-6 text-neo-text">Total</Text>
          <Text
            className="text-right text-[22px] font-bold leading-7 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatOrderNaira(totals.total)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TimelineEventRow({
  event,
  isLast,
}: {
  event: OrderTimelineEvent;
  isLast: boolean;
}) {
  const toneStyle = getTimelineStyle(event.tone);

  return (
    <View className="flex-row gap-3">
      <View className="items-center">
        <View
          className={`h-11 w-11 items-center justify-center rounded-full border ${toneStyle.borderClassName} ${toneStyle.backgroundClassName}`}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={event.tone === "warning" ? images.iconReceiptReview : images.iconInbox}
            style={{ height: 24, tintColor: toneStyle.tintColor, width: 24 }}
          />
        </View>
        {!isLast ? <View className="w-px flex-1 bg-neo-border" /> : null}
      </View>

      <View className="min-w-0 flex-1 pb-5">
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <Text
            className="min-w-0 flex-1 text-[16px] font-bold leading-5 text-neo-text"
            numberOfLines={2}
          >
            {event.title}
          </Text>
          {event.statusLabel ? (
            <View className="rounded-md border border-neo-warning bg-[#FFF8EA] px-3 py-1">
              <Text className="text-[13px] font-bold leading-4 text-neo-warning">
                {event.statusLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          className="mt-1 text-[14px] leading-5 text-neo-text-muted"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {event.time}
        </Text>
        {event.detail ? (
          <Text className="mt-1 text-[14px] italic leading-5 text-neo-text-muted">
            {event.detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function TimelineCard({ order }: { order: OrderDetailRecord }) {
  return (
    <View className="mt-5 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <Text className="text-[18px] font-bold leading-6 text-neo-text">Timeline</Text>
      <View className="mt-4">
        {order.timeline.map((event, index) => (
          <TimelineEventRow
            event={event}
            isLast={index === order.timeline.length - 1}
            key={event.id}
          />
        ))}
      </View>
    </View>
  );
}

function ActionDock({
  actionsDisabled,
  onCancelOrder,
  onUpdateDelivery,
  order,
}: {
  actionsDisabled: boolean;
  onCancelOrder: () => void;
  onUpdateDelivery: () => void;
  order: OrderDetailRecord;
}) {
  const receiptHref = order.payment.receiptId
    ? (`/receipt/${order.payment.receiptId}` as Href)
    : null;
  const conversationHref = `/conversation/${order.conversationId}` as Href;
  const editHref = `/order/new?conversationId=${encodeURIComponent(
    order.conversationId,
  )}` as Href;

  return (
    <View className="mt-4 rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
      <View className="flex-row flex-wrap gap-2">
        <Link asChild href={conversationHref}>
          <Pressable
            accessibilityLabel="Message customer"
            accessibilityRole="link"
            className="min-h-12 flex-1 basis-[31%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-primary bg-neo-surface px-2"
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconInbox}
              style={{ height: 22, tintColor: colors.text, width: 22 }}
            />
            <Text
              className="text-center text-[14px] font-bold leading-5 text-neo-text"
              numberOfLines={2}
            >
              Message customer
            </Text>
          </Pressable>
        </Link>

        {actionsDisabled ? (
          <Pressable
            accessibilityLabel="Edit order"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            className="min-h-12 flex-1 basis-[31%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-border bg-neo-surface-alt px-2"
            disabled
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconAiDraft}
              style={{ height: 22, tintColor: colors.textMuted, width: 22 }}
            />
            <Text className="text-center text-[14px] font-bold leading-5 text-neo-text-muted">
              Edit order
            </Text>
          </Pressable>
        ) : (
          <Link asChild href={editHref}>
            <Pressable
              accessibilityLabel="Edit order"
              accessibilityRole="link"
              className="min-h-12 flex-1 basis-[31%] flex-row items-center justify-center gap-2 rounded-lg border border-neo-primary bg-neo-surface px-2"
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconAiDraft}
                style={{ height: 22, tintColor: colors.text, width: 22 }}
              />
              <Text className="text-center text-[14px] font-bold leading-5 text-neo-text">
                Edit order
              </Text>
            </Pressable>
          </Link>
        )}

        <Pressable
          accessibilityLabel="Update delivery"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className={`min-h-12 flex-1 basis-[31%] flex-row items-center justify-center gap-2 rounded-lg border px-2 ${
            actionsDisabled
              ? "border-neo-border bg-neo-surface-alt"
              : "border-neo-primary bg-neo-surface"
          }`}
          disabled={actionsDisabled}
          onPress={onUpdateDelivery}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconDelivery}
            style={{
              height: 22,
              tintColor: actionsDisabled ? colors.textMuted : colors.text,
              width: 22,
            }}
          />
          <Text
            className="text-center text-[14px] font-bold leading-5 text-neo-text"
            numberOfLines={2}
          >
            Update delivery
          </Text>
        </Pressable>
      </View>

      {receiptHref ? (
        <Link asChild href={receiptHref}>
          <Pressable
            accessibilityLabel="Review receipt"
            accessibilityRole="link"
            className="mt-3 min-h-14 flex-row items-center justify-center gap-3 rounded-lg bg-neo-primary px-4"
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconReceiptReview}
              style={{ height: 28, tintColor: colors.surface, width: 28 }}
            />
            <Text className="text-[18px] font-bold leading-6 text-white">
              Review receipt
            </Text>
          </Pressable>
        </Link>
      ) : (
        <Pressable
          accessibilityLabel="Send payment reminder"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className={`mt-3 min-h-14 flex-row items-center justify-center gap-3 rounded-lg px-4 ${
            actionsDisabled ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={actionsDisabled}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconFollowUps}
            style={{
              height: 28,
              tintColor: actionsDisabled ? colors.textMuted : colors.surface,
              width: 28,
            }}
          />
          <Text
            className={`text-[18px] font-bold leading-6 ${
              actionsDisabled ? "text-neo-text-muted" : "text-white"
            }`}
          >
            Send payment reminder
          </Text>
        </Pressable>
      )}

      <View className="mt-3 border-t border-neo-border pt-3">
        <Pressable
          accessibilityLabel="Cancel order"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled }}
          className="min-h-12 flex-row items-center justify-center gap-2"
          disabled={actionsDisabled}
          onPress={onCancelOrder}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconWarning}
            style={{ height: 24, tintColor: colors.error, width: 24 }}
          />
          <Text className="text-[15px] font-bold leading-5 text-neo-error">
            Cancel order
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function NoticeBanner({ notice }: { notice: Notice }) {
  return (
    <View className="mt-5 rounded-lg border border-neo-info bg-[#EDF6FA] px-4 py-3">
      <Text className="text-[15px] font-bold leading-5 text-neo-info">
        {notice.title}
      </Text>
      <Text className="mt-1 text-[14px] leading-5 text-neo-text">
        {notice.message}
      </Text>
    </View>
  );
}

function MissingOrderState({ orderId }: { orderId?: string }) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neo-background px-5 py-16">
      <View className="rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EF]">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.errorReceiptUnreadable}
            style={{ height: 40, width: 40 }}
          />
        </View>
        <Text className="mt-4 text-[20px] font-bold leading-7 text-neo-text">
          Order not found
        </Text>
        <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
          This local mock order is not available. Go back and open another order.
        </Text>
        {orderId ? (
          <Text className="mt-3 text-[13px] font-semibold leading-5 text-neo-text-muted">
            ID: {orderId}
          </Text>
        ) : null}
        <Pressable
          accessibilityLabel="Go back from missing order"
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

export function OrderDetailScreen({
  initialState = "ready",
  orderId,
}: {
  initialState?: MockScreenState;
  orderId?: string;
}) {
  const apiClient = useApiClient();
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const useStackedMetrics = width < 410;
  const localOrder = useMemo(() => getOrderDetailById(orderId), [orderId]);
  const [backendOrder, setBackendOrder] = useState<OrderDetailRecord | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [screenState, setScreenState] = useState<MockScreenState>(() =>
    initialState === "ready" &&
    orderId &&
    isBackendRecordId(orderId) &&
    !localOrder
      ? "loading"
      : initialState,
  );
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSavingAction, setIsSavingAction] = useState(false);
  const order = backendOrder ?? localOrder;

  useEffect(() => {
    if (!orderId || initialState !== "ready" || !isBackendRecordId(orderId)) {
      return;
    }

    let isActive = true;

    getCommerceOrder(apiClient, orderId).then((result) => {
      if (!isActive) {
        return;
      }

      if (result.ok) {
        setBackendOrder(normalizeBackendOrderDetail(result.data.order));
        setNotice(null);
        setScreenState("ready");
        return;
      }

      if (localOrder) {
        setNotice({
          message: `${result.error.message} Showing the isolated demo order instead.`,
          title: "Backend order unavailable",
        });
        setScreenState("ready");
        return;
      }

      setNotice(null);
      setScreenState("error");
    });

    return () => {
      isActive = false;
    };
  }, [apiClient, initialState, localOrder, orderId, reloadVersion]);

  function retryOrderLoad() {
    if (orderId && isBackendRecordId(orderId) && !localOrder) {
      setScreenState("loading");
    }

    setReloadVersion((currentValue) => currentValue + 1);
  }

  if (screenState === "loading") {
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
          <SkeletonRows count={6} />
        </View>
      </ScrollView>
    );
  }

  if (screenState === "error") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          actionLabel="Retry order"
          image={images.errorOffline}
          message="The backend order could not load. Retry will ask the commerce records API again."
          onAction={retryOrderLoad}
          title="Could not load order"
        />
      </View>
    );
  }

  if (screenState === "empty") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          actionLabel="Go back"
          image={images.emptyProducts}
          message="This order has no local details yet. Open a linked conversation or create a new order from chat."
          onAction={() => router.back()}
          title="No order details"
        />
      </View>
    );
  }

  if (!order) {
    return <MissingOrderState orderId={orderId} />;
  }

  const totals = calculateOrderTotals(order.items, order.delivery.fee);
  const actionsDisabled =
    isSavingAction || screenState === "offline" || screenState === "permission";

  async function updateDeliveryStatus() {
    if (!order) {
      return;
    }

    if (!isBackendRecordId(order.id)) {
      setNotice({
        message:
          "Delivery updates stay local for isolated demo orders. Backend records need a durable order ID.",
        title: "Delivery action paused",
      });
      return;
    }

    const nextStatus = nextDeliveryState(order.delivery.state);

    if (!nextStatus) {
      setNotice({
        message: "This order is already marked delivered.",
        title: "Delivery already complete",
      });
      return;
    }

    setIsSavingAction(true);
    const result = await updateCommerceOrderDeliveryStatus(
      apiClient,
      order.id,
      nextStatus,
    );
    setIsSavingAction(false);

    if (!result.ok) {
      handleSensitiveActionError(result.error);
      return;
    }

    setBackendOrder(normalizeBackendOrderDetail(result.data.order));
    setNotice({
      message: "Delivery status was updated on the backend and audit logged.",
      title: "Delivery updated",
    });
  }

  async function cancelOrder() {
    if (!order) {
      return;
    }

    if (!isBackendRecordId(order.id)) {
      setNotice({
        message:
          "Order cancellation stays local for isolated demo orders. Backend records need a durable order ID.",
        title: "Cancel order not enabled",
      });
      return;
    }

    setIsSavingAction(true);
    const result = await cancelCommerceOrder(apiClient, order.id);
    setIsSavingAction(false);

    if (!result.ok) {
      handleSensitiveActionError(result.error);
      return;
    }

    setBackendOrder(normalizeBackendOrderDetail(result.data.order));
    setNotice({
      message: "Order cancellation was saved on the backend and audit logged.",
      title: "Order cancelled",
    });
  }

  function handleSensitiveActionError(error: {
    category: string;
    details: Record<string, unknown>;
    message: string;
  }) {
    if (error.category === "permission_denied") {
      router.push(
        getPermissionDeniedHref({
          action: "order-change",
          role: roleFromPermissionDetails(error.details.role),
        }),
      );
      return;
    }

    setNotice({
      message: error.message,
      title: "Order action could not save",
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
        <Header order={order} />
        {notice ? <NoticeBanner notice={notice} /> : null}
        {screenState === "offline" ? (
          <StateBanner
            message="Cached order details are visible. Editing, delivery updates, reminders, and cancellation stay disabled until Neo is online."
            title="Offline order view"
            tone="offline"
          />
        ) : null}
        {screenState === "permission" ? (
          <StateBanner
            message="Payment, delivery, and cancellation actions need owner or manager permission. Ask the owner/admin before changing this order."
            title="Order actions locked"
            tone="permission"
          />
        ) : null}
        <CustomerSummary order={order} />
        <SummaryMetrics
          isNarrow={useStackedMetrics}
          order={order}
          totals={totals}
        />
        <PaymentStatusCard order={order} />
        <DeliveryCard
          actionsDisabled={actionsDisabled}
          onUpdateDelivery={updateDeliveryStatus}
          order={order}
        />
        <ItemsCard order={order} totals={totals} />
        <TimelineCard order={order} />
        <ActionDock
          actionsDisabled={actionsDisabled}
          onCancelOrder={cancelOrder}
          onUpdateDelivery={updateDeliveryStatus}
          order={order}
        />
      </View>
    </ScrollView>
  );
}

function isBackendRecordId(recordId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordId);
}

function nextDeliveryState(
  currentState: OrderDetailRecord["delivery"]["state"],
): BackendOrderDeliveryState | null {
  if (currentState === "scheduled") {
    return "in-progress";
  }

  if (currentState === "in-progress") {
    return "delivered";
  }

  return null;
}

function roleFromPermissionDetails(value: unknown): MockStaffRole {
  if (value === "owner" || value === "manager" || value === "staff") {
    return value;
  }

  return "staff";
}
