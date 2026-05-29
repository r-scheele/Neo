import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";
import type { BackendCustomerProfile } from "@/lib/api";

// DEV-ONLY FIXTURE DATA: replace with backend-backed customer records before release.
export type CustomerStatusTone = "success" | "warning" | "info" | "neutral";
export type CustomerOrderStatus = "paid" | "unpaid" | "review";
export type CustomerActivityTone = "success" | "warning" | "info";

export type CustomerMetric = {
  detail?: string;
  icon: ImageSourcePropType;
  id: string;
  label: string;
  status?: CustomerOrderStatus;
  value: string;
};

export type CustomerPreference = {
  icon: ImageSourcePropType;
  id: string;
  label: string;
  value: string;
};

export type CustomerNote = {
  authorLabel: string;
  body: string;
  dateLabel: string;
  id: string;
  visibilityLabel: string;
};

export type CustomerOrder = {
  amount: number;
  dateLabel: string;
  href: string;
  id: string;
  itemCountLabel: string;
  status: CustomerOrderStatus;
};

export type CustomerActivity = {
  detail: string;
  icon: ImageSourcePropType;
  id: string;
  timeLabel: string;
  title: string;
  tone: CustomerActivityTone;
};

export type CustomerProfileRecord = {
  activity: readonly CustomerActivity[];
  avatarTone: CustomerStatusTone;
  conversationId: string;
  customerInitials: string;
  customerName: string;
  customerSince: string;
  id: string;
  latestOrderHref: string;
  locationLabel: string;
  metrics: readonly CustomerMetric[];
  notes: readonly CustomerNote[];
  orderCount: number;
  orders: readonly CustomerOrder[];
  preferences: readonly CustomerPreference[];
  primaryPreference: string;
  statusLabel: string;
  statusTone: CustomerStatusTone;
};

export function formatCustomerNaira(amount: number) {
  return `\u20A6${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}

const aishaProfile: CustomerProfileRecord = {
  activity: [
    {
      detail: "Payment reminder for order #ORD-2025-0473",
      icon: images.iconInbox,
      id: "follow-up-sent",
      timeLabel: "May 19, 10:15 AM",
      title: "You sent a follow-up",
      tone: "info",
    },
    {
      detail: "Delivered and paid",
      icon: images.iconOrder,
      id: "order-completed",
      timeLabel: "May 20, 4:35 PM",
      title: "Order #ORD-2025-0561 completed",
      tone: "success",
    },
    {
      detail: "Prefers gentle products. Sensitive skin.",
      icon: images.iconAiDraft,
      id: "note-added",
      timeLabel: "May 18, 11:30 AM",
      title: "Note added",
      tone: "warning",
    },
  ],
  avatarTone: "success",
  conversationId: "aisha-order-review",
  customerInitials: "AO",
  customerName: "Aisha O.",
  customerSince: "Feb 2024",
  id: "aisha-o",
  latestOrderHref: "/order/ord-2025-0561",
  locationLabel: "Lagos Mainland",
  metrics: [
    {
      detail: formatCustomerNaira(18000),
      icon: images.iconOrder,
      id: "last-order",
      label: "Last order",
      status: "paid",
      value: "May 20, 2025",
    },
    {
      detail: "10:00 AM",
      icon: images.iconFollowUps,
      id: "next-follow-up",
      label: "Next follow-up",
      value: "Due tomorrow",
    },
    {
      detail: "Unpaid",
      icon: images.iconPaid,
      id: "outstanding",
      label: "Outstanding",
      status: "unpaid",
      value: formatCustomerNaira(6500),
    },
    {
      detail: "on time",
      icon: images.iconPermission,
      id: "payment-habit",
      label: "Payment habit",
      value: "Usually pays",
    },
  ],
  notes: [
    {
      authorLabel: "You",
      body: "Prefers gentle products. Sensitive skin. Avoid strong fragrances.",
      dateLabel: "May 18, 2025",
      id: "aisha-sensitive-skin",
      visibilityLabel: "Internal note",
    },
  ],
  orderCount: 8,
  orders: [
    {
      amount: 18000,
      dateLabel: "May 20, 2025",
      href: "/order/ord-2025-0561",
      id: "#ORD-2025-0561",
      itemCountLabel: "3 items",
      status: "paid",
    },
    {
      amount: 12500,
      dateLabel: "Apr 28, 2025",
      href: "/order/paid-aisha-jollof",
      id: "#ORD-2025-0473",
      itemCountLabel: "2 items",
      status: "paid",
    },
    {
      amount: 9000,
      dateLabel: "Apr 10, 2025",
      href: "/order/unpaid-today",
      id: "#ORD-2025-0389",
      itemCountLabel: "1 item",
      status: "unpaid",
    },
  ],
  preferences: [
    {
      icon: images.iconDelivery,
      id: "preferred-area",
      label: "Preferred area",
      value: "Lagos Mainland",
    },
    {
      icon: images.iconDelivery,
      id: "delivery-fee",
      label: "Typical delivery fee",
      value: "\u20A61,200 - \u20A61,800",
    },
    {
      icon: images.iconProduct,
      id: "favorite-categories",
      label: "Favorite categories",
      value: "Skincare, Haircare, Wellness",
    },
    {
      icon: images.iconOrder,
      id: "average-order",
      label: "Average order value",
      value: formatCustomerNaira(14250),
    },
    {
      icon: images.iconFollowUps,
      id: "preferred-delivery",
      label: "Preferred delivery",
      value: "Weekends",
    },
    {
      icon: images.iconPaid,
      id: "payment-time",
      label: "Average payment time",
      value: "Same day",
    },
  ],
  primaryPreference: "Prefers weekend delivery",
  statusLabel: "Active customer",
  statusTone: "success",
};

const newCustomerProfile: CustomerProfileRecord = {
  ...aishaProfile,
  activity: [],
  avatarTone: "info",
  conversationId: "emeka-same-day",
  customerInitials: "EO",
  customerName: "Emeka O.",
  customerSince: "May 2025",
  id: "emeka-o",
  latestOrderHref: "/conversation/emeka-same-day",
  locationLabel: "Lagos",
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
  preferences: [
    {
      icon: images.iconDelivery,
      id: "preferred-area",
      label: "Preferred area",
      value: "Not set",
    },
    {
      icon: images.iconProduct,
      id: "favorite-categories",
      label: "Favorite categories",
      value: "Not known yet",
    },
  ],
  primaryPreference: "Asked about same-day delivery",
  statusLabel: "New customer",
  statusTone: "info",
};

const customerProfiles: Record<string, CustomerProfileRecord> = {
  [aishaProfile.id]: aishaProfile,
  "blessing-m": {
    ...aishaProfile,
    conversationId: "blessing-receipt",
    customerInitials: "BM",
    customerName: "Blessing M.",
    customerSince: "Mar 2024",
    id: "blessing-m",
    locationLabel: "Surulere",
    primaryPreference: "Likes pickup confirmation before dispatch",
  },
  [newCustomerProfile.id]: newCustomerProfile,
  "godwin-t": {
    ...newCustomerProfile,
    conversationId: "godwin-blue-black",
    customerInitials: "GT",
    customerName: "Godwin T.",
    id: "godwin-t",
    primaryPreference: "Asked about blue or black options",
  },
  "musa-a": {
    ...newCustomerProfile,
    conversationId: "musa-jollof-order",
    customerInitials: "MA",
    customerName: "Musa A.",
    id: "musa-a",
    primaryPreference: "Interested in jollof trays",
  },
  "ngozi-k": {
    ...newCustomerProfile,
    conversationId: "ngozi-delivery-yaba",
    customerInitials: "NK",
    customerName: "Ngozi K.",
    id: "ngozi-k",
    locationLabel: "Yaba",
    primaryPreference: "Asked about delivery fee",
  },
  "sandra-d": {
    ...aishaProfile,
    conversationId: "sandra-paid",
    customerInitials: "SD",
    customerName: "Sandra D.",
    id: "sandra-d",
    locationLabel: "Ikeja",
    primaryPreference: "Repeat customer who values fast dispatch",
  },
};

export function getCustomerProfileById(
  customerId?: string,
): CustomerProfileRecord | null {
  if (!customerId) {
    return null;
  }

  return customerProfiles[customerId] ?? null;
}

export function normalizeBackendCustomerProfile(
  customer: BackendCustomerProfile,
): CustomerProfileRecord {
  return {
    activity: customer.activity.map((activity) => ({
      ...activity,
      icon: getCustomerActivityIcon(activity.title),
    })),
    avatarTone: normalizeCustomerTone(customer.avatarTone),
    conversationId: customer.conversationId,
    customerInitials: customer.customerInitials,
    customerName: customer.customerName,
    customerSince: customer.customerSince,
    id: customer.id,
    latestOrderHref: customer.latestOrderHref,
    locationLabel: customer.locationLabel,
    metrics: [
      {
        detail: customer.metrics.lastOrder
          ? formatCustomerNaira(customer.metrics.lastOrder.amount)
          : undefined,
        icon: images.iconOrder,
        id: "last-order",
        label: "Last order",
        status: customer.metrics.lastOrder?.status,
        value: customer.metrics.lastOrder?.dateLabel ?? "No orders yet",
      },
      {
        icon: images.iconFollowUps,
        id: "next-follow-up",
        label: "Next follow-up",
        value: customer.metrics.nextFollowUp,
      },
      {
        detail:
          customer.metrics.outstandingAmount > 0 ? "Unpaid" : "Clear",
        icon: images.iconPaid,
        id: "outstanding",
        label: "Outstanding",
        status: customer.metrics.outstandingAmount > 0 ? "unpaid" : "paid",
        value: formatCustomerNaira(customer.metrics.outstandingAmount),
      },
      {
        icon: images.iconPermission,
        id: "total-spend",
        label: "Total spend",
        value: formatCustomerNaira(customer.metrics.totalSpend),
      },
    ],
    notes: customer.notes,
    orderCount: customer.orderCount,
    orders: customer.orders,
    preferences: [
      {
        icon: images.iconDelivery,
        id: "preferred-area",
        label: "Preferred area",
        value: customer.preferences.deliveryArea,
      },
      {
        icon: images.iconProduct,
        id: "favorite-categories",
        label: "Favorite categories",
        value: customer.preferences.favoriteCategories,
      },
      {
        icon: images.iconPaid,
        id: "payment-time",
        label: "Payment time",
        value: customer.preferences.paymentTime,
      },
    ],
    primaryPreference: customer.primaryPreference,
    statusLabel: customer.statusLabel,
    statusTone: normalizeCustomerTone(customer.statusTone),
  };
}

function normalizeCustomerTone(
  tone: BackendCustomerProfile["statusTone"],
): CustomerStatusTone {
  if (tone === "error") {
    return "warning";
  }

  return tone;
}

function getCustomerActivityIcon(title: string): ImageSourcePropType {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("follow")) {
    return images.iconFollowUps;
  }

  if (normalizedTitle.includes("order")) {
    return images.iconOrder;
  }

  return images.iconInbox;
}
