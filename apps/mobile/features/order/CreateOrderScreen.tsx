import { useEffect, useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
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
  getItemCountBand,
  trackAnalyticsEvent,
  trackScreenStateSeen,
} from "@/lib/analytics";
import { createCommerceOrder, useApiClient } from "@/lib/api";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";

import type {
  CreateOrderFormErrors,
  CreateOrderItem,
  PaymentStatus,
} from "./createOrderForm";
import {
  calculateCreateOrderTotals,
  formatNaira,
  validateCreateOrderForm,
} from "./createOrderForm";

type OrderProduct = {
  description: string;
  icon: ImageSourcePropType;
  name: string;
  productId: string;
  unitPrice: number;
  variant: string;
};

type DeliveryZoneOption = {
  earliestDelivery: string;
  fee: number;
  id: string;
  label: string;
};

type CreateOrderContext = {
  customerInitials: string;
  customerName: string;
  customerSince: string;
  orderCount: number;
  relationshipLabel: string;
  sourceConversationId: string;
  sourceMeta: string;
  sourceTitle: string;
};

type FeedbackKind = "success" | "error" | "info";

type FeedbackMessage = {
  kind: FeedbackKind;
  message: string;
  title: string;
};

const availableProducts: readonly OrderProduct[] = [
  {
    description: "Serves 8-10 people",
    icon: images.iconOrder,
    name: "Jollof Tray",
    productId: "jollof-tray-medium",
    unitPrice: 7000,
    variant: "Medium",
  },
  {
    description: "Sweet, ripe plantain",
    icon: images.iconProduct,
    name: "Plantain",
    productId: "plantain-large",
    unitPrice: 2500,
    variant: "Large",
  },
  {
    description: "Small party pack",
    icon: images.iconProduct,
    name: "Small Chops",
    productId: "small-chops-pack",
    unitPrice: 4500,
    variant: "Pack",
  },
];

const deliveryZones: readonly DeliveryZoneOption[] = [
  {
    earliestDelivery: "Earliest delivery: Sat, May 10",
    fee: 1500,
    id: "lekki",
    label: "Lekki",
  },
  {
    earliestDelivery: "Earliest delivery: Sat, May 10",
    fee: 1200,
    id: "yaba",
    label: "Yaba",
  },
  {
    earliestDelivery: "Earliest delivery: Mon, May 12",
    fee: 2500,
    id: "ikeja",
    label: "Ikeja",
  },
  {
    earliestDelivery: "Earliest delivery: Mon, May 12",
    fee: 3000,
    id: "ajah",
    label: "Ajah",
  },
];

const defaultContext: CreateOrderContext = {
  customerInitials: "AO",
  customerName: "Aisha O.",
  customerSince: "May 2024",
  orderCount: 3,
  relationshipLabel: "Returning",
  sourceConversationId: "aisha-order-review",
  sourceMeta: "Today, 10:21 AM - Customer requested 3 trays",
  sourceTitle: "Jollof trays for Saturday",
};

const conversationContexts: Record<string, CreateOrderContext> = {
  "aisha-order-review": defaultContext,
  "musa-jollof-order": {
    ...defaultContext,
    customerInitials: "MA",
    customerName: "Musa A.",
    customerSince: "May 2024",
    orderCount: 1,
    relationshipLabel: "New",
    sourceConversationId: "musa-jollof-order",
    sourceMeta: "Yesterday - Customer requested 3 trays",
  },
  "ngozi-delivery-yaba": {
    ...defaultContext,
    customerInitials: "NK",
    customerName: "Ngozi K.",
    customerSince: "March 2024",
    orderCount: 2,
    relationshipLabel: "Returning",
    sourceConversationId: "ngozi-delivery-yaba",
    sourceMeta: "9:35 AM - Delivery fee question",
    sourceTitle: "Delivery fee to Yaba",
  },
};

const paymentStatusOptions: readonly {
  detail: string;
  icon: ImageSourcePropType;
  id: PaymentStatus;
  label: string;
}[] = [
  {
    detail: "Not paid yet",
    icon: images.iconWarning,
    id: "pending",
    label: "Pending",
  },
  {
    detail: "Recorded by staff",
    icon: images.iconPaid,
    id: "paid",
    label: "Paid",
  },
  {
    detail: "Sent, verify first",
    icon: images.iconReceiptReview,
    id: "awaiting-receipt",
    label: "Awaiting receipt",
  },
];

const backendPaymentStatus: Record<
  PaymentStatus,
  "unpaid" | "awaiting_receipt" | "paid"
> = {
  "awaiting-receipt": "awaiting_receipt",
  paid: "paid",
  pending: "unpaid",
};

function getCreateOrderContext(conversationId?: string) {
  if (!conversationId) {
    return defaultContext;
  }

  return conversationContexts[conversationId] ?? {
    ...defaultContext,
    sourceConversationId: conversationId,
  };
}

function createOrderItem(product: OrderProduct, quantity: number): CreateOrderItem {
  return {
    description: product.description,
    id: `${product.productId}-${Date.now()}`,
    name: product.name,
    productId: product.productId,
    quantity,
    unitPrice: product.unitPrice,
    variant: product.variant,
  };
}

function createInitialItems(): readonly CreateOrderItem[] {
  const jollofTray = availableProducts[0];
  const plantain = availableProducts[1];

  return [
    {
      ...createOrderItem(jollofTray, 2),
      id: "prefill-jollof-tray",
    },
    {
      ...createOrderItem(plantain, 1),
      id: "prefill-plantain",
    },
  ];
}

function getProductIcon(productId: string) {
  return (
    availableProducts.find((product) => product.productId === productId)?.icon ??
    images.iconProduct
  );
}

function getFeedbackClassName(kind: FeedbackKind) {
  if (kind === "success") {
    return "border-neo-success bg-[#EEF8F0]";
  }

  if (kind === "error") {
    return "border-neo-error bg-[#FFF1EF]";
  }

  return "border-neo-info bg-[#EDF6FA]";
}

function getFeedbackTextClassName(kind: FeedbackKind) {
  if (kind === "success") {
    return "text-neo-success";
  }

  if (kind === "error") {
    return "text-neo-error";
  }

  return "text-neo-info";
}

function getPaymentTint(status: PaymentStatus) {
  if (status === "paid") {
    return colors.success;
  }

  if (status === "awaiting-receipt") {
    return colors.info;
  }

  return colors.warning;
}

function Header({
  context,
  onMore,
}: {
  context: CreateOrderContext;
  onMore: () => void;
}) {
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
          Create order
        </Text>
        <View className="mt-1 flex-row flex-wrap items-center gap-2">
          <Text className="text-[16px] leading-6 text-neo-text-muted">
            From conversation
          </Text>
          <View className="rounded-md border border-[#AFC8E8] bg-[#EFF6FF] px-3 py-1">
            <Text
              className="text-[15px] font-bold leading-5 text-neo-info"
              numberOfLines={1}
            >
              {context.customerName}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityLabel="More order actions"
        accessibilityRole="button"
        className="min-h-12 w-12 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
        onPress={onMore}
      >
        <Text className="text-[28px] font-bold leading-8 text-neo-text">...</Text>
      </Pressable>
    </View>
  );
}

function FeedbackBanner({ feedback }: { feedback: FeedbackMessage }) {
  return (
    <View
      className={`mt-5 flex-row items-center gap-3 rounded-lg border px-4 py-3 ${getFeedbackClassName(
        feedback.kind,
      )}`}
    >
      {feedback.kind === "success" ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.successOrderCreated}
          style={{ height: 46, width: 46 }}
        />
      ) : (
        <View className="h-11 w-11 items-center justify-center rounded-full border border-neo-border bg-neo-surface">
          <Text
            className={`text-[22px] font-bold leading-7 ${getFeedbackTextClassName(
              feedback.kind,
            )}`}
          >
            !
          </Text>
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text
          className={`text-[15px] font-bold leading-5 ${getFeedbackTextClassName(
            feedback.kind,
          )}`}
        >
          {feedback.title}
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text">
          {feedback.message}
        </Text>
      </View>
    </View>
  );
}

function SourceConversationCard({ context }: { context: CreateOrderContext }) {
  const chatHref = `/conversation/${context.sourceConversationId}` as Href;

  return (
    <View className="mt-5 rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
      <View className="flex-row items-center gap-3">
        <View className="h-16 w-16 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconInbox}
            style={{ height: 34, tintColor: colors.text, width: 34 }}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[14px] font-semibold leading-5 text-neo-text-muted">
            Source conversation
          </Text>
          <Text
            className="mt-1 text-[18px] font-bold leading-6 text-neo-text"
            numberOfLines={1}
          >
            {context.sourceTitle}
          </Text>
          <Text
            className="mt-1 text-[14px] leading-5 text-neo-text-muted"
            numberOfLines={2}
          >
            {context.sourceMeta}
          </Text>
        </View>

        <Link asChild href={chatHref}>
          <Pressable
            accessibilityLabel="View source chat"
            accessibilityRole="link"
            className="min-h-11 flex-row items-center justify-center gap-2 px-1"
          >
            <Text className="text-[14px] font-bold leading-5 text-neo-info">
              View chat
            </Text>
            <Text className="text-[22px] font-bold leading-6 text-neo-info">
              {">"}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function CustomerCard({
  context,
  onChange,
}: {
  context: CreateOrderContext;
  onChange: () => void;
}) {
  return (
    <View className="mt-5">
      <Text className="text-[18px] font-bold leading-6 text-neo-text">Customer</Text>
      <View className="mt-2 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#4F8A60]">
            <Text className="text-[24px] font-bold leading-8 text-white">
              {context.customerInitials}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text
                className="text-[20px] font-bold leading-7 text-neo-text"
                numberOfLines={1}
              >
                {context.customerName}
              </Text>
              <View className="rounded-md border border-[#B9D7C4] bg-[#EEF8F0] px-2 py-1">
                <Text className="text-[13px] font-bold leading-4 text-neo-success">
                  {context.relationshipLabel}
                </Text>
              </View>
            </View>
            <Text
              className="mt-1 text-[14px] leading-5 text-neo-text-muted"
              numberOfLines={2}
            >
              Customer since {context.customerSince} - {context.orderCount} orders
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Change customer"
            accessibilityRole="button"
            className="min-h-11 flex-row items-center gap-2 px-1"
            onPress={onChange}
          >
            <Text className="text-[14px] font-bold leading-5 text-neo-info">
              Change
            </Text>
            <Text className="text-[22px] font-bold leading-6 text-neo-text">
              v
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SectionTitle({
  actionLabel,
  subtitle,
  title,
}: {
  actionLabel?: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <View className="flex-row flex-wrap items-center justify-between gap-2">
      <View className="flex-row flex-wrap items-center gap-3">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">{title}</Text>
        {subtitle ? (
          <Text className="text-[14px] leading-5 text-neo-text-muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Text className="text-[15px] font-bold leading-5 text-neo-info">
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

function QuantityButton({
  disabled,
  label,
  onPress,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label === "+" ? "Increase quantity" : "Decrease quantity"}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className="min-h-11 w-11 items-center justify-center"
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        className={`text-[26px] font-bold leading-8 ${
          disabled ? "text-neo-text-muted" : "text-neo-text"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OrderItemRow({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  showDivider,
}: {
  item: CreateOrderItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  showDivider: boolean;
}) {
  return (
    <View className={`px-3 py-4 ${showDivider ? "border-b border-neo-border" : ""}`}>
      <View className="flex-row items-start gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={getProductIcon(item.productId)}
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
          <Text
            className="mt-1 text-[14px] leading-5 text-neo-text-muted"
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View className="mt-3 w-[156px] flex-row items-center overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
            <QuantityButton
              disabled={item.quantity <= 1}
              label="-"
              onPress={onDecrease}
            />
            <View className="min-h-11 w-12 items-center justify-center border-x border-neo-border">
              <Text
                className="text-[18px] font-bold leading-6 text-neo-text"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {item.quantity}
              </Text>
            </View>
            <QuantityButton label="+" onPress={onIncrease} />
          </View>
        </View>

        <View className="items-end gap-3">
          <Text
            className="text-right text-[17px] font-semibold leading-6 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatNaira(item.unitPrice)}
          </Text>
          <Text
            className="text-right text-[17px] font-bold leading-6 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatNaira(item.unitPrice * item.quantity)}
          </Text>
          <Pressable
            accessibilityLabel={`Remove ${item.name}`}
            accessibilityRole="button"
            className="min-h-11 w-11 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
            onPress={onRemove}
          >
            <Text className="text-[14px] font-bold leading-5 text-neo-error">
              Del
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AddItemPanel({
  onAddProduct,
  selectedProductId,
  setSelectedProductId,
}: {
  onAddProduct: () => void;
  selectedProductId: string;
  setSelectedProductId: (productId: string) => void;
}) {
  return (
    <View className="border-t border-neo-border bg-[#FFF8EA] px-3 py-4">
      <Text className="text-[15px] font-bold leading-5 text-neo-text">
        Choose a product
      </Text>
      <View className="mt-3 flex-row flex-wrap gap-3">
        {availableProducts.map((product) => {
          const isSelected = product.productId === selectedProductId;

          return (
            <Pressable
              accessibilityLabel={`Choose ${product.name} ${product.variant}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={`min-h-[92px] flex-1 basis-[47%] rounded-lg border px-3 py-3 ${
                isSelected
                  ? "border-neo-primary bg-[#EEF8F0]"
                  : "border-neo-border bg-neo-surface"
              }`}
              key={product.productId}
              onPress={() => setSelectedProductId(product.productId)}
            >
              <View className="flex-row items-center gap-2">
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={product.icon}
                  style={{
                    height: 22,
                    tintColor: isSelected ? colors.primary : colors.text,
                    width: 22,
                  }}
                />
                <Text
                  className="min-w-0 flex-1 text-[14px] font-bold leading-5 text-neo-text"
                  numberOfLines={2}
                >
                  {product.name}
                </Text>
              </View>
              <Text className="mt-2 text-[13px] leading-4 text-neo-text-muted">
                {product.variant} - {formatNaira(product.unitPrice)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityLabel="Add selected product to order"
        accessibilityRole="button"
        className="mt-4 min-h-12 flex-row items-center justify-center gap-3 rounded-lg border border-neo-primary bg-neo-surface px-4"
        onPress={onAddProduct}
      >
        <View className="h-8 w-8 items-center justify-center rounded-full bg-neo-primary">
          <Text className="text-[24px] font-bold leading-7 text-white">+</Text>
        </View>
        <Text className="text-[16px] font-bold leading-5 text-neo-primary">
          Add selected item
        </Text>
      </Pressable>
    </View>
  );
}

function ItemsSection({
  error,
  isAddingItem,
  items,
  onAddProduct,
  onToggleAddItem,
  selectedProductId,
  setSelectedProductId,
  updateQuantity,
  removeItem,
}: {
  error?: string;
  isAddingItem: boolean;
  items: readonly CreateOrderItem[];
  onAddProduct: () => void;
  onToggleAddItem: () => void;
  removeItem: (itemId: string) => void;
  selectedProductId: string;
  setSelectedProductId: (productId: string) => void;
  updateQuantity: (itemId: string, direction: "increase" | "decrease") => void;
}) {
  const itemCount = items.length;

  return (
    <View className="mt-6">
      <SectionTitle
        actionLabel={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        title="Items"
      />
      <View className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
        {items.length > 0 ? (
          items.map((item, index) => (
            <OrderItemRow
              item={item}
              key={item.id}
              onDecrease={() => updateQuantity(item.id, "decrease")}
              onIncrease={() => updateQuantity(item.id, "increase")}
              onRemove={() => removeItem(item.id)}
              showDivider={index < items.length - 1}
            />
          ))
        ) : (
          <View className="items-center px-5 py-7">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.emptyProducts}
              style={{ height: 118, width: 160 }}
            />
            <Text className="mt-3 text-center text-[17px] font-bold leading-6 text-neo-text">
              No items on this order
            </Text>
            <Text className="mt-2 text-center text-[14px] leading-5 text-neo-text-muted">
              Add a product from the conversation before saving.
            </Text>
          </View>
        )}

        <Pressable
          accessibilityLabel={isAddingItem ? "Hide add item controls" : "Add item"}
          accessibilityRole="button"
          className="m-3 min-h-12 flex-row items-center justify-center gap-3 rounded-lg border border-[#DDBF88] bg-neo-surface px-4"
          onPress={onToggleAddItem}
        >
          <View className="h-8 w-8 items-center justify-center rounded-full bg-neo-primary">
            <Text className="text-[24px] font-bold leading-7 text-white">
              {isAddingItem ? "-" : "+"}
            </Text>
          </View>
          <Text className="text-[17px] font-bold leading-6 text-neo-primary">
            Add item
          </Text>
        </Pressable>

        {isAddingItem ? (
          <AddItemPanel
            onAddProduct={onAddProduct}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
          />
        ) : null}
      </View>
      {error ? (
        <Text className="mt-2 text-[13px] font-semibold leading-5 text-neo-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function DeliverySection({
  deliveryFee,
  deliveryZone,
  errors,
  onChangeDeliveryFee,
  onSelectZone,
}: {
  deliveryFee: string;
  deliveryZone: string;
  errors: CreateOrderFormErrors;
  onChangeDeliveryFee: (value: string) => void;
  onSelectZone: (zone: DeliveryZoneOption) => void;
}) {
  const selectedZone =
    deliveryZones.find((zone) => zone.label === deliveryZone) ?? deliveryZones[0];

  return (
    <View className="mt-6">
      <Text className="text-[18px] font-bold leading-6 text-neo-text">Delivery</Text>
      <View className="mt-3 gap-3 rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
        <View className="gap-3">
          <View className="min-h-[84px] flex-row items-center gap-3 rounded-lg border border-neo-border bg-neo-surface px-3">
            <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconDelivery}
                style={{ height: 30, tintColor: colors.text, width: 30 }}
              />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[13px] font-semibold leading-4 text-neo-text-muted">
                Delivery zone
              </Text>
              <Text className="mt-1 text-[17px] font-bold leading-6 text-neo-text">
                {deliveryZone}
              </Text>
            </View>
          </View>

          <View
            className={`min-h-[84px] flex-row items-center gap-3 rounded-lg border bg-neo-surface px-3 ${
              errors.deliveryFee ? "border-neo-error" : "border-neo-border"
            }`}
          >
            <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconPaid}
                style={{ height: 30, tintColor: colors.text, width: 30 }}
              />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[13px] font-semibold leading-4 text-neo-text-muted">
                Delivery fee
              </Text>
              <TextInput
                accessibilityLabel="Delivery fee"
                className="min-h-10 text-[17px] font-bold leading-6 text-neo-text"
                inputMode="decimal"
                keyboardType="numeric"
                onChangeText={onChangeDeliveryFee}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                style={{ fontVariant: ["tabular-nums"] }}
                value={deliveryFee}
              />
            </View>
          </View>
        </View>

        {errors.deliveryZone ? (
          <Text className="text-[13px] font-semibold leading-5 text-neo-error">
            {errors.deliveryZone}
          </Text>
        ) : null}
        {errors.deliveryFee ? (
          <Text className="text-[13px] font-semibold leading-5 text-neo-error">
            {errors.deliveryFee}
          </Text>
        ) : null}

        <View className="flex-row flex-wrap gap-2">
          {deliveryZones.map((zone) => {
            const isSelected = zone.label === deliveryZone;

            return (
              <Pressable
                accessibilityLabel={`Choose ${zone.label} delivery zone`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`min-h-10 rounded-full border px-3 py-2 ${
                  isSelected
                    ? "border-neo-primary bg-[#EEF8F0]"
                    : "border-neo-border bg-neo-background"
                }`}
                key={zone.id}
                onPress={() => onSelectZone(zone)}
              >
                <Text
                  className={`text-[14px] font-bold leading-5 ${
                    isSelected ? "text-neo-primary" : "text-neo-text"
                  }`}
                >
                  {zone.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row items-center gap-3 rounded-lg border border-[#E6C88E] bg-[#FFF8EA] px-3 py-3">
          <View className="h-8 w-8 items-center justify-center rounded-full border border-neo-warning">
            <Text className="text-[15px] font-bold leading-5 text-neo-warning">
              i
            </Text>
          </View>
          <Text className="min-w-0 flex-1 text-[14px] leading-5 text-neo-text">
            {selectedZone.earliestDelivery}
          </Text>
          <Text className="text-[14px] font-bold leading-5 text-neo-info">
            Change
          </Text>
        </View>
      </View>
    </View>
  );
}

function PaymentStatusSection({
  error,
  onSelectStatus,
  paymentStatus,
}: {
  error?: string;
  onSelectStatus: (status: PaymentStatus) => void;
  paymentStatus: PaymentStatus | null;
}) {
  return (
    <View className="mt-6">
      <SectionTitle
        subtitle="Select the current payment state"
        title="Payment status"
      />
      <View className="mt-3 flex-row flex-wrap gap-3">
        {paymentStatusOptions.map((option) => {
          const isSelected = option.id === paymentStatus;
          const tintColor = getPaymentTint(option.id);

          return (
            <Pressable
              accessibilityLabel={`Set payment status to ${option.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={`min-h-[92px] flex-1 basis-[31%] rounded-lg border px-3 py-3 ${
                isSelected
                  ? "border-neo-warning bg-[#FFF8EA]"
                  : "border-neo-border bg-neo-surface"
              }`}
              key={option.id}
              onPress={() => onSelectStatus(option.id)}
            >
              <View className="items-start gap-2">
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={option.icon}
                  style={{ height: 26, tintColor, width: 26 }}
                />
                <Text
                  className="text-[15px] font-bold leading-5 text-neo-text"
                >
                  {option.label}
                </Text>
              </View>
              <Text className="mt-2 text-[13px] leading-4 text-neo-text-muted">
                {option.detail}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="mt-2 text-[13px] font-semibold leading-5 text-neo-error">
          {error}
        </Text>
      ) : null}
      <View className="mt-3 rounded-lg border border-[#E6C88E] bg-[#FFF8EA] px-3 py-3">
        <Text className="text-[13px] font-semibold leading-5 text-neo-warning">
          Verify against the bank alert before treating manual transfers as paid.
        </Text>
      </View>
    </View>
  );
}

function NotesSection({
  notes,
  onChangeNotes,
}: {
  notes: string;
  onChangeNotes: (value: string) => void;
}) {
  return (
    <View className="mt-6">
      <View className="flex-row items-baseline gap-2">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          Order notes
        </Text>
        <Text className="text-[14px] leading-5 text-neo-text-muted">
          (optional)
        </Text>
      </View>
      <View className="mt-3 rounded-lg border border-neo-border bg-neo-surface px-4 py-3">
        <View className="flex-row items-start gap-3">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconAiDraft}
            style={{ height: 24, tintColor: colors.textMuted, width: 24 }}
          />
          <TextInput
            accessibilityLabel="Order notes"
            className="min-h-[64px] flex-1 text-[16px] leading-6 text-neo-text"
            maxLength={200}
            multiline
            onChangeText={onChangeNotes}
            placeholder="Add delivery or customer notes"
            placeholderTextColor={colors.textMuted}
            textAlignVertical="top"
            value={notes}
          />
        </View>
        <Text
          className="mt-2 text-right text-[13px] leading-4 text-neo-text-muted"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {notes.length}/200
        </Text>
      </View>
    </View>
  );
}

function OrderSummary({
  paymentStatus,
  totals,
}: {
  paymentStatus: PaymentStatus | null;
  totals: ReturnType<typeof calculateCreateOrderTotals>;
}) {
  const paymentLabel =
    paymentStatusOptions.find((option) => option.id === paymentStatus)?.label ??
    "Not selected";

  return (
    <View className="mt-6 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
      <Text className="text-[18px] font-bold leading-6 text-neo-text">
        Order summary
      </Text>
      <View className="mt-4 gap-3">
        <View className="flex-row justify-between gap-4">
          <Text className="text-[15px] leading-5 text-neo-text">
            Subtotal ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})
          </Text>
          <Text
            className="text-right text-[15px] leading-5 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatNaira(totals.subtotal)}
          </Text>
        </View>
        <View className="flex-row justify-between gap-4">
          <Text className="text-[15px] leading-5 text-neo-text">Delivery fee</Text>
          <Text
            className="text-right text-[15px] leading-5 text-neo-text"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatNaira(totals.deliveryFee)}
          </Text>
        </View>
        <View className="flex-row justify-between gap-4">
          <Text className="text-[15px] leading-5 text-neo-text">Payment</Text>
          <Text className="text-right text-[15px] font-semibold leading-5 text-neo-text">
            {paymentLabel}
          </Text>
        </View>
        <View className="border-t border-neo-border pt-4">
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-[19px] font-bold leading-6 text-neo-text">
              Total
            </Text>
            <Text
              className="text-right text-[22px] font-bold leading-7 text-neo-text"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatNaira(totals.total)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function BottomActions({
  actionsDisabled,
  isSubmitting,
  onSaveDraft,
  onSaveOrder,
}: {
  actionsDisabled: boolean;
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onSaveOrder: () => void;
}) {
  const disabled = actionsDisabled || isSubmitting;

  return (
    <View className="mt-4 rounded-lg border border-neo-border bg-neo-surface px-3 py-3">
      <View className="flex-row gap-3">
        <Pressable
          accessibilityLabel="Save order draft locally"
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          className={`min-h-14 flex-1 flex-row items-center justify-center gap-2 rounded-lg border px-3 ${
            disabled
              ? "border-neo-border bg-neo-surface-alt"
              : "border-neo-primary bg-neo-surface"
          }`}
          disabled={disabled}
          onPress={onSaveDraft}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconAiDraft}
            style={{
              height: 24,
              tintColor: disabled ? colors.textMuted : colors.text,
              width: 24,
            }}
          />
          <Text
            className={`text-[16px] font-bold leading-5 ${
              disabled ? "text-neo-text-muted" : "text-neo-text"
            }`}
          >
            Save draft
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Save order"
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          className={`min-h-14 flex-1 flex-row items-center justify-center gap-2 rounded-lg px-3 ${
            disabled ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={disabled}
          onPress={onSaveOrder}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconOrder}
            style={{
              height: 24,
              tintColor: disabled ? colors.textMuted : colors.surface,
              width: 24,
            }}
          />
          <Text
            className={`text-[16px] font-bold leading-5 ${
              disabled ? "text-neo-text-muted" : "text-white"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save order"}
          </Text>
        </Pressable>
      </View>

      <View className="mt-4 flex-row items-center justify-center gap-2">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconPermission}
          style={{ height: 20, tintColor: colors.textMuted, width: 20 }}
        />
        <Text className="text-center text-[13px] leading-5 text-neo-text-muted">
          You can edit this order anytime before fulfillment.
        </Text>
      </View>
    </View>
  );
}

export function CreateOrderScreen({
  conversationId,
  initialState = "ready",
}: {
  conversationId?: string;
  initialState?: MockScreenState;
}) {
  const apiClient = useApiClient();
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const context = useMemo(
    () => getCreateOrderContext(conversationId),
    [conversationId],
  );
  const [screenState, setScreenState] = useState<MockScreenState>(initialState);
  const [items, setItems] = useState<readonly CreateOrderItem[]>(
    initialState === "empty" ? [] : createInitialItems,
  );
  const [deliveryZone, setDeliveryZone] = useState(deliveryZones[0].label);
  const [deliveryFee, setDeliveryFee] = useState(String(deliveryZones[0].fee));
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>("pending");
  const [notes, setNotes] = useState(
    "Please deliver before 2pm. Call on arrival.",
  );
  const [errors, setErrors] = useState<CreateOrderFormErrors>({});
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(
    availableProducts[0].productId,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = useMemo(
    () => calculateCreateOrderTotals({ deliveryFee, items }),
    [deliveryFee, items],
  );

  const actionsDisabled =
    screenState === "offline" || screenState === "permission";

  useEffect(() => {
    trackScreenStateSeen({
      errorCategory: "order_form_load_failed",
      hasCachedData: initialState !== "empty",
      screen: "create_order",
      state: initialState,
    });
  }, [initialState]);

  function clearError(field: keyof CreateOrderFormErrors) {
    if (!errors[field]) {
      return;
    }

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function updateQuantity(itemId: string, direction: "increase" | "decrease") {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const nextQuantity =
          direction === "increase"
            ? item.quantity + 1
            : Math.max(1, item.quantity - 1);

        return { ...item, quantity: nextQuantity };
      }),
    );
    clearError("items");
  }

  function removeItem(itemId: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }

  function addSelectedProduct() {
    const selectedProduct =
      availableProducts.find((product) => product.productId === selectedProductId) ??
      availableProducts[0];

    setItems((currentItems) => [
      ...currentItems,
      createOrderItem(selectedProduct, 1),
    ]);
    clearError("items");
    setIsAddingItem(false);
    setFeedback({
      kind: "info",
      message: `${selectedProduct.name} was added to this local order.`,
      title: "Item added",
    });
  }

  function selectDeliveryZone(zone: DeliveryZoneOption) {
    setDeliveryZone(zone.label);
    setDeliveryFee(String(zone.fee));
    clearError("deliveryZone");
    clearError("deliveryFee");
  }

  function changeDeliveryFee(value: string) {
    setDeliveryFee(value);
    clearError("deliveryFee");
  }

  function selectPaymentStatus(status: PaymentStatus) {
    setPaymentStatus(status);
    clearError("paymentStatus");
  }

  function saveDraft() {
    if (actionsDisabled) {
      setFeedback({
        kind: "error",
        message:
          "Saving is disabled in this state. Reconnect or ask an owner/admin before changing order records.",
        title: "Order save paused",
      });
      return;
    }

    setFeedback({
      kind: "info",
      message:
        "Draft feedback is local to this screen. No backend order was created.",
      title: "Draft kept locally",
    });
  }

  async function saveOrder() {
    if (isSubmitting || actionsDisabled) {
      if (actionsDisabled) {
        setFeedback({
          kind: "error",
          message:
            "Order submission is disabled in this state. Draft details stay visible for review.",
          title: "Order save paused",
        });
      }
      return;
    }

    const validationErrors = validateCreateOrderForm({
      deliveryFee,
      deliveryZone,
      items,
      paymentStatus,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedback({
        kind: "error",
        message: "Fix the highlighted fields, then save the order again.",
        title: "Order needs a few details",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({
      kind: "info",
      message: "Saving this order to the backend record system...",
      title: "Saving order",
    });

    const result = await createCommerceOrder(apiClient, {
      conversationId,
      customer: {
        displayName: context.customerName,
      },
      deliveryFeeAmount: Math.trunc(totals.deliveryFee),
      deliveryZone,
      items: items.map((item) => ({
        description: item.description,
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceAmount: Math.trunc(item.unitPrice),
        variant: item.variant,
      })),
      notes,
      paymentStatus: paymentStatus
        ? backendPaymentStatus[paymentStatus]
        : "unpaid",
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFeedback({
        kind: "error",
        message: result.error.message,
        title: "Order could not save",
      });
      return;
    }

    trackAnalyticsEvent("order_created", {
      item_count_band: getItemCountBand(items.length),
      source: conversationId ? "conversation" : "manual",
    });
    setFeedback({
      kind: "success",
      message: "Backend order saved. Opening the durable order record...",
      title: "Order saved",
    });
    router.push(`/order/${result.data.order.id}` as Href);
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
          actionLabel="Retry order form"
          image={images.errorOffline}
          message="The order form could not load. Retry keeps the current route and restores the local draft form."
          onAction={() => setScreenState("ready")}
          title="Could not load order form"
        />
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[430px]">
          <Header
            context={context}
            onMore={() =>
              setFeedback({
                kind: "info",
                message: "More order actions are not enabled in this local flow.",
                title: "Local order flow",
              })
            }
          />

          {feedback ? <FeedbackBanner feedback={feedback} /> : null}

          {screenState === "offline" ? (
            <StateBanner
              message="Draft details can stay on screen, but saving the order is disabled until Neo is online."
              title="Offline order draft"
              tone="offline"
            />
          ) : null}
          {screenState === "permission" ? (
            <StateBanner
              message="Creating or changing orders requires order permission. Ask the owner/admin before saving this order."
              title="Order permission needed"
              tone="permission"
            />
          ) : null}

          <SourceConversationCard context={context} />
          <CustomerCard
            context={context}
            onChange={() =>
              setFeedback({
                kind: "info",
                message: "Customer changes are not enabled in this mock flow.",
                title: "Customer locked",
              })
            }
          />
          <ItemsSection
            error={errors.items}
            isAddingItem={isAddingItem}
            items={items}
            onAddProduct={addSelectedProduct}
            onToggleAddItem={() => setIsAddingItem((currentValue) => !currentValue)}
            removeItem={removeItem}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            updateQuantity={updateQuantity}
          />
          <DeliverySection
            deliveryFee={deliveryFee}
            deliveryZone={deliveryZone}
            errors={errors}
            onChangeDeliveryFee={changeDeliveryFee}
            onSelectZone={selectDeliveryZone}
          />
          <PaymentStatusSection
            error={errors.paymentStatus}
            onSelectStatus={selectPaymentStatus}
            paymentStatus={paymentStatus}
          />
          <NotesSection notes={notes} onChangeNotes={setNotes} />
          <OrderSummary paymentStatus={paymentStatus} totals={totals} />
          <BottomActions
            actionsDisabled={actionsDisabled}
            isSubmitting={isSubmitting}
            onSaveDraft={saveDraft}
            onSaveOrder={saveOrder}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
