import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import type { BackendTodayQueueItem, BackendTodayResponse } from "@/lib/api";

// DEV-ONLY FIXTURE DATA: replace with backend-backed Today queues before release.
export type PriorityLevel = "high" | "medium";
export type StatusTone = "success" | "warning" | "error" | "info" | "neutral";

export type SummaryMetric = {
  id: string;
  detail: string;
  detailTone: StatusTone;
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

export type QueueItem = {
  id: string;
  actionLabel: string;
  badgeCount?: number;
  details: string;
  href: string;
  icon: ImageSourcePropType;
  isHighlighted?: boolean;
  priority: PriorityLevel;
  reason: string;
  status: string;
  statusTone: StatusTone;
  title: string;
};

export type AiRecommendation = {
  actionLabel: string;
  description: string;
  href: string;
  title: string;
};

export type TodayDashboard = {
  aiRecommendation: AiRecommendation | null;
  queueItems: readonly QueueItem[];
  summaryMetrics: readonly SummaryMetric[];
};

export const activeDashboard: TodayDashboard = {
  summaryMetrics: [
    {
      id: "pending-receipts",
      detail: "NGN 184k",
      detailTone: "success",
      icon: images.iconReceiptReview,
      label: "Pending receipts",
      value: "6",
    },
    {
      id: "urgent-chats",
      detail: "Need your reply",
      detailTone: "error",
      icon: images.iconInbox,
      label: "Urgent chats",
      value: "4",
    },
    {
      id: "due-follow-ups",
      detail: "Today",
      detailTone: "warning",
      icon: images.iconFollowUps,
      label: "Due follow-ups",
      value: "7",
    },
  ],
  queueItems: [
    {
      id: "receipt-review",
      actionLabel: "Review receipt",
      badgeCount: 1,
      details: "Tunde - 2m - NGN 32.5k",
      href: "/receipt/tunde-32500",
      icon: images.iconReceiptReview,
      isHighlighted: true,
      priority: "high",
      reason: "Check amount and bank alert before marking paid",
      status: "Transfer in",
      statusTone: "success",
      title: "Receipt needs review",
    },
    {
      id: "urgent-chats",
      actionLabel: "View inbox",
      badgeCount: 4,
      details: "4 customers - Oldest 12m ago",
      href: routes.inbox,
      icon: images.iconInbox,
      priority: "high",
      reason: "Customers waiting for your response",
      status: "Needs reply",
      statusTone: "info",
      title: "Urgent chats",
    },
    {
      id: "unpaid-orders",
      actionLabel: "Open orders",
      badgeCount: 3,
      details: "3 orders - NGN 96.45k",
      href: "/order/unpaid-today",
      icon: images.iconOrder,
      priority: "medium",
      reason: "Send payment link or respectful reminder",
      status: "Awaiting payment",
      statusTone: "warning",
      title: "Unpaid orders",
    },
    {
      id: "due-follow-ups",
      actionLabel: "See follow-ups",
      badgeCount: 7,
      details: "7 customers",
      href: routes.followUps,
      icon: images.iconFollowUps,
      priority: "medium",
      reason: "Reminders and status checks",
      status: "Due today",
      statusTone: "success",
      title: "Follow-ups due today",
    },
  ],
  aiRecommendation: {
    actionLabel: "View suggestions",
    description:
      "3 customer receipts older than 24h still need bank-alert checks. Reviewing them keeps records clean.",
    href: routes.approvals,
    title: "Neo recommendation",
  },
};

export const emptyDashboard: TodayDashboard = {
  summaryMetrics: [
    {
      id: "pending-receipts",
      detail: "All reviewed",
      detailTone: "success",
      icon: images.iconReceiptReview,
      label: "Pending receipts",
      value: "0",
    },
    {
      id: "urgent-chats",
      detail: "No waits",
      detailTone: "success",
      icon: images.iconInbox,
      label: "Urgent chats",
      value: "0",
    },
    {
      id: "due-follow-ups",
      detail: "Clear",
      detailTone: "success",
      icon: images.iconFollowUps,
      label: "Due follow-ups",
      value: "0",
    },
  ],
  queueItems: [],
  aiRecommendation: null,
};

export function getTodayUrgentAttentionCount(
  dashboard: TodayDashboard = activeDashboard,
) {
  return dashboard.queueItems
    .filter((item) => item.priority === "high")
    .reduce((total, item) => total + (item.badgeCount ?? 1), 0);
}

export function getFollowUpsAttentionCount(
  dashboard: TodayDashboard = activeDashboard,
) {
  const followUpItem = dashboard.queueItems.find(
    (item) => item.id === "due-follow-ups",
  );

  return followUpItem?.badgeCount ?? 0;
}

export function normalizeBackendTodayDashboard(
  response: BackendTodayResponse,
): TodayDashboard {
  const pendingReceipts = response.summary.pendingReceiptsCount;
  const urgentChats = response.summary.urgentChatsCount;
  const dueFollowUps = response.summary.dueFollowUpsCount;

  return {
    aiRecommendation: pendingReceipts > 0
      ? {
          actionLabel: "Review receipts",
          description:
            "Receipt screenshots still need human bank-alert checks before any payment is treated as settled.",
          href: getReceiptQueueHref(response.queueItems),
          title: "Neo recommendation",
        }
      : null,
    queueItems: response.queueItems.map(normalizeBackendQueueItem),
    summaryMetrics: [
      {
        id: "pending-receipts",
        detail: formatCompactNaira(response.summary.pendingReceiptsAmount),
        detailTone: pendingReceipts > 0 ? "warning" : "success",
        icon: images.iconReceiptReview,
        label: "Pending receipts",
        value: String(pendingReceipts),
      },
      {
        id: "urgent-chats",
        detail: urgentChats > 0 ? "Need your reply" : "No waits",
        detailTone: urgentChats > 0 ? "error" : "success",
        icon: images.iconInbox,
        label: "Urgent chats",
        value: String(urgentChats),
      },
      {
        id: "due-follow-ups",
        detail: dueFollowUps > 0 ? "Today" : "Clear",
        detailTone: dueFollowUps > 0 ? "warning" : "success",
        icon: images.iconFollowUps,
        label: "Due follow-ups",
        value: String(dueFollowUps),
      },
    ],
  };
}

function normalizeBackendQueueItem(item: BackendTodayQueueItem): QueueItem {
  return {
    actionLabel: item.actionLabel,
    badgeCount: item.badgeCount,
    details: item.details,
    href: normalizeQueueHref(item),
    icon: getQueueIcon(item.id),
    isHighlighted: item.priority === "high",
    priority: item.priority,
    reason: item.reason,
    status: item.status,
    statusTone: item.statusTone === "neutral" ? "info" : item.statusTone,
    title: item.title,
    id: item.id,
  };
}

function getQueueIcon(itemId: string): ImageSourcePropType {
  if (itemId.includes("receipt")) {
    return images.iconReceiptReview;
  }

  if (itemId.includes("follow")) {
    return images.iconFollowUps;
  }

  if (itemId.includes("order")) {
    return images.iconOrder;
  }

  return images.iconInbox;
}

function normalizeQueueHref(item: BackendTodayQueueItem): string {
  if (item.id.includes("follow")) {
    return routes.followUps;
  }

  if (item.href.startsWith("/receipt/") || item.href.startsWith("/order/")) {
    return item.href;
  }

  if (item.id.includes("order")) {
    return "/order/unpaid-today";
  }

  return routes.inbox;
}

function getReceiptQueueHref(items: readonly BackendTodayQueueItem[]): string {
  const receiptItem = items.find((item) => item.id.includes("receipt"));

  return receiptItem ? normalizeQueueHref(receiptItem) : routes.approvals;
}

function formatCompactNaira(amount: number): string {
  if (amount <= 0) {
    return "NGN 0";
  }

  if (amount >= 1000000) {
    return `NGN ${(amount / 1000000).toFixed(1)}m`;
  }

  if (amount >= 1000) {
    return `NGN ${(amount / 1000).toFixed(1)}k`;
  }

  return `NGN ${amount}`;
}
