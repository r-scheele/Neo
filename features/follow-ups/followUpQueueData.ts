import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";

// DEV-ONLY FIXTURE DATA: replace with backend-backed follow-up records before release.
export type FollowUpFilter = "all" | "due" | "overdue" | "suggested" | "done";
export type FollowUpStatus = "due" | "overdue" | "suggested" | "done";
export type FollowUpTone = "success" | "warning" | "error" | "info" | "neutral";
export type FollowUpTargetType = "order" | "conversation";

export type FollowUpFilterOption = {
  id: FollowUpFilter;
  icon: ImageSourcePropType;
  label: string;
};

export type FollowUpQueueItem = {
  amount?: number;
  completedLabel?: string;
  conversationId: string;
  customerInitials: string;
  customerName: string;
  detailLines: readonly string[];
  dueLabel: string;
  dueMetaLabel: string;
  id: string;
  isHighPriority?: boolean;
  kindLabel: string;
  lastActivityLabel?: string;
  orderDisplayId?: string;
  orderRouteId?: string;
  status: FollowUpStatus;
  suggestedMessage: string;
  targetLabel: string;
  targetType: FollowUpTargetType;
  tone: FollowUpTone;
};

export type FollowUpCounts = Record<FollowUpFilter, number>;

export const followUpFilters: readonly FollowUpFilterOption[] = [
  { id: "all", icon: images.iconFollowUps, label: "All" },
  { id: "due", icon: images.iconFollowUps, label: "Due" },
  { id: "overdue", icon: images.iconWarning, label: "Overdue" },
  { id: "suggested", icon: images.iconInbox, label: "Suggested" },
  { id: "done", icon: images.iconPaid, label: "Done" },
];

export const initialFollowUps: readonly FollowUpQueueItem[] = [
  {
    amount: 18000,
    conversationId: "aisha-order-review",
    customerInitials: "AO",
    customerName: "Aisha O.",
    detailLines: ["Order #ORD-2025-0561", "Receipt pending"],
    dueLabel: "Today, 9:30 AM",
    dueMetaLabel: "2h 15m ago",
    id: "follow-up-aisha-overdue",
    isHighPriority: true,
    kindLabel: "High priority",
    orderDisplayId: "#ORD-2025-0561",
    orderRouteId: "ord-2025-0561",
    status: "overdue",
    suggestedMessage:
      "Hi Aisha, just checking in on your payment for order #ORD-2025-0561. Please send the receipt when convenient so we can confirm and prepare your order. Thanks so much!",
    targetLabel: "Open order",
    targetType: "order",
    tone: "error",
  },
  {
    amount: 25500,
    conversationId: "musa-jollof-order",
    customerInitials: "MK",
    customerName: "Michael K.",
    detailLines: ["Order #ORD-2025-0553", "Unpaid order"],
    dueLabel: "Today, 2:00 PM",
    dueMetaLabel: "Today, 2:00 PM",
    id: "follow-up-michael-due",
    kindLabel: "Payment reminder",
    orderDisplayId: "#ORD-2025-0553",
    orderRouteId: "unpaid-today",
    status: "due",
    suggestedMessage:
      "Hi Michael, your order is reserved for you. Kindly complete payment to help us prepare it. Let me know if you have any questions.",
    targetLabel: "Open order",
    targetType: "order",
    tone: "warning",
  },
  {
    conversationId: "godwin-blue-black",
    customerInitials: "YS",
    customerName: "Yemi S.",
    detailLines: ["Last message 3 days ago", "Interested in products"],
    dueLabel: "Tomorrow, 10:00 AM",
    dueMetaLabel: "Tomorrow, 10:00 AM",
    id: "follow-up-yemi-suggested",
    kindLabel: "Silent lead",
    lastActivityLabel: "3 days ago",
    status: "suggested",
    suggestedMessage:
      "Hi Yemi, just following up on the items you were interested in. Happy to help whenever you're ready.",
    targetLabel: "Open conversation",
    targetType: "conversation",
    tone: "info",
  },
  {
    conversationId: "sandra-paid",
    customerInitials: "BT",
    customerName: "Bola T.",
    detailLines: ["Order #ORD-2025-0547", "Delivered"],
    dueLabel: "Feb 25, 11:00 AM",
    dueMetaLabel: "Feb 25, 11:00 AM",
    id: "follow-up-bola-delivery",
    kindLabel: "Delivery follow-up",
    lastActivityLabel: "Delivered on Feb 22, 4:15 PM",
    orderDisplayId: "#ORD-2025-0547",
    orderRouteId: "paid-aisha-jollof",
    status: "due",
    suggestedMessage:
      "Hi Bola, hope your order arrived safely. Please let us know if everything is good or if you need any help.",
    targetLabel: "Open order",
    targetType: "order",
    tone: "success",
  },
  {
    conversationId: "ngozi-delivery-yaba",
    customerInitials: "NK",
    customerName: "Ngozi K.",
    detailLines: ["Delivery question", "No reply after quote"],
    dueLabel: "Yesterday, 5:30 PM",
    dueMetaLabel: "Yesterday, 5:30 PM",
    id: "follow-up-ngozi-overdue",
    kindLabel: "Quote follow-up",
    status: "overdue",
    suggestedMessage:
      "Hi Ngozi, just checking if the Yaba delivery option works for you. I can help adjust the order if needed.",
    targetLabel: "Open conversation",
    targetType: "conversation",
    tone: "error",
  },
  {
    completedLabel: "Sent today, 8:40 AM",
    conversationId: "blessing-receipt",
    customerInitials: "BM",
    customerName: "Blessing M.",
    detailLines: ["Receipt attached", "Payment review shared"],
    dueLabel: "Today, 8:30 AM",
    dueMetaLabel: "Completed",
    id: "follow-up-blessing-done",
    kindLabel: "Done",
    status: "done",
    suggestedMessage:
      "Hi Blessing, thank you for sending the receipt. We'll review it and update you shortly.",
    targetLabel: "Open conversation",
    targetType: "conversation",
    tone: "success",
  },
];

export function formatFollowUpNaira(amount: number) {
  return `\u20A6${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

export function getFollowUpCounts(
  items: readonly FollowUpQueueItem[],
): FollowUpCounts {
  return {
    all: items.length,
    done: items.filter((item) => item.status === "done").length,
    due: items.filter((item) => item.status === "due").length,
    overdue: items.filter((item) => item.status === "overdue").length,
    suggested: items.filter((item) => item.status === "suggested").length,
  };
}

export function filterFollowUps({
  filter,
  items,
}: {
  filter: FollowUpFilter;
  items: readonly FollowUpQueueItem[];
}) {
  if (filter === "all") {
    return items;
  }

  return items.filter((item) => item.status === filter);
}
