import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";

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
