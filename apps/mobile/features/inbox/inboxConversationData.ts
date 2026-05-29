import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";

// DEV-ONLY FIXTURE DATA: replace with backend-backed WhatsApp conversations before release.
export type ConversationFilter =
  | "all"
  | "mine"
  | "unread"
  | "review"
  | "orders";
export type Assignment = "you" | "unassigned" | "assigned";
export type StatusTone = "success" | "warning" | "error" | "info" | "neutral";
export type PresenceTone = "urgent" | "online" | "idle";

export type ConversationLabel = {
  icon: ImageSourcePropType;
  text: string;
  tone: StatusTone;
};

export type Conversation = {
  id: string;
  assignment: Assignment;
  assignmentLabel: string;
  avatarTone: StatusTone;
  customerInitials: string;
  customerName: string;
  labels: readonly ConversationLabel[];
  latestSnippet: string;
  presenceTone: PresenceTone;
  timestamp: string;
  unreadCount: number;
};

export type FilterOption = {
  id: ConversationFilter;
  label: string;
};

export const filterOptions: readonly FilterOption[] = [
  { id: "all", label: "All" },
  { id: "mine", label: "Mine" },
  { id: "unread", label: "Unread" },
  { id: "review", label: "Needs review" },
  { id: "orders", label: "Orders" },
];

export const conversations: readonly Conversation[] = [
  {
    id: "aisha-order-review",
    assignment: "unassigned",
    assignmentLabel: "Unassigned",
    avatarTone: "error",
    customerInitials: "AO",
    customerName: "Aisha O.",
    labels: [
      { icon: images.iconWarning, text: "Needs review", tone: "error" },
      { icon: images.iconOrder, text: "Order pending", tone: "neutral" },
    ],
    latestSnippet: "Please confirm the price and when I can get it delivered to Lekki?",
    presenceTone: "urgent",
    timestamp: "11:42 AM",
    unreadCount: 3,
  },
  {
    id: "blessing-receipt",
    assignment: "you",
    assignmentLabel: "You",
    avatarTone: "success",
    customerInitials: "BM",
    customerName: "Blessing M.",
    labels: [
      { icon: images.iconReceiptReview, text: "Receipt attached", tone: "success" },
    ],
    latestSnippet: "Thanks. I just sent the payment receipt.",
    presenceTone: "online",
    timestamp: "10:58 AM",
    unreadCount: 2,
  },
  {
    id: "godwin-blue-black",
    assignment: "assigned",
    assignmentLabel: "Assigned to Femi",
    avatarTone: "info",
    customerInitials: "GT",
    customerName: "Godwin T.",
    labels: [{ icon: images.iconAiDraft, text: "AI draft ready", tone: "info" }],
    latestSnippet: "Do you have this in blue or black?",
    presenceTone: "urgent",
    timestamp: "10:21 AM",
    unreadCount: 1,
  },
  {
    id: "ngozi-delivery-yaba",
    assignment: "you",
    assignmentLabel: "You",
    avatarTone: "warning",
    customerInitials: "NK",
    customerName: "Ngozi K.",
    labels: [
      { icon: images.iconDelivery, text: "Delivery question", tone: "neutral" },
    ],
    latestSnippet: "What is the delivery fee to Yaba?",
    presenceTone: "idle",
    timestamp: "9:35 AM",
    unreadCount: 0,
  },
  {
    id: "musa-jollof-order",
    assignment: "assigned",
    assignmentLabel: "Assigned to Tola",
    avatarTone: "warning",
    customerInitials: "MA",
    customerName: "Musa A.",
    labels: [{ icon: images.iconOrder, text: "Order request", tone: "warning" }],
    latestSnippet: "I would like to place an order for 3 Jollof trays.",
    presenceTone: "online",
    timestamp: "Yesterday",
    unreadCount: 2,
  },
  {
    id: "sandra-paid",
    assignment: "you",
    assignmentLabel: "You",
    avatarTone: "success",
    customerInitials: "SD",
    customerName: "Sandra D.",
    labels: [{ icon: images.iconPaid, text: "Paid", tone: "success" }],
    latestSnippet: "Great service as always. Thank you.",
    presenceTone: "idle",
    timestamp: "Yesterday",
    unreadCount: 0,
  },
  {
    id: "emeka-same-day",
    assignment: "unassigned",
    assignmentLabel: "Unassigned",
    avatarTone: "warning",
    customerInitials: "EO",
    customerName: "Emeka O.",
    labels: [
      { icon: images.iconDelivery, text: "Delivery question", tone: "neutral" },
    ],
    latestSnippet: "Do you do same-day delivery?",
    presenceTone: "idle",
    timestamp: "Tue",
    unreadCount: 0,
  },
];

export function getFilterCount(
  filter: ConversationFilter,
  items: readonly Conversation[] = conversations,
) {
  if (filter === "all") {
    return items.length;
  }

  if (filter === "mine") {
    return items.filter((conversation) => conversation.assignment === "you")
      .length;
  }

  if (filter === "unread") {
    return items.filter((conversation) => conversation.unreadCount > 0).length;
  }

  if (filter === "review") {
    return items.filter((conversation) =>
      conversation.labels.some(
        (label) =>
          label.text === "Needs review" || label.text === "AI draft ready",
      ),
    ).length;
  }

  return items.filter((conversation) =>
    conversation.labels.some((label) => label.text.includes("Order")),
  ).length;
}

export function matchesFilter(
  conversation: Conversation,
  filter: ConversationFilter,
) {
  if (filter === "all") {
    return true;
  }

  if (filter === "mine") {
    return conversation.assignment === "you";
  }

  if (filter === "unread") {
    return conversation.unreadCount > 0;
  }

  if (filter === "review") {
    return conversation.labels.some(
      (label) => label.text === "Needs review" || label.text === "AI draft ready",
    );
  }

  return conversation.labels.some((label) => label.text.includes("Order"));
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function filterConversations({
  filter,
  items = conversations,
  onlyUnassigned,
  query,
}: {
  filter: ConversationFilter;
  items?: readonly Conversation[];
  onlyUnassigned: boolean;
  query: string;
}) {
  const normalizedQuery = normalizeSearch(query);

  return items.filter((conversation) => {
    const matchesQuery =
      !normalizedQuery ||
      conversation.customerName.toLowerCase().includes(normalizedQuery) ||
      conversation.latestSnippet.toLowerCase().includes(normalizedQuery) ||
      conversation.labels.some((label) =>
        label.text.toLowerCase().includes(normalizedQuery),
      );

    if (!matchesQuery || !matchesFilter(conversation, filter)) {
      return false;
    }

    if (onlyUnassigned) {
      return conversation.assignment === "unassigned";
    }

    return true;
  });
}

export function getInboxUnreadCount(
  items: readonly Conversation[] = conversations,
) {
  return items.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );
}
