import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";

// DEV-ONLY FIXTURE DATA: replace with backend-backed approval records before release.
export type ApprovalCategory =
  | "payments"
  | "complaints"
  | "discounts"
  | "low-confidence";
export type ApprovalRiskLevel = "low" | "medium" | "high";
export type ApprovalDecision = "approved" | "edited" | "rejected" | "asked" | "escalated";
export type ApprovalActionKind = "review-receipt" | "edit-first" | "review-request" | "review-draft";

export type ApprovalQueueItem = {
  actionKind: ApprovalActionKind;
  amountLabel?: string;
  category: ApprovalCategory;
  confidence: number;
  contextLabel: string;
  customerName: string;
  detailLabel?: string;
  draftTitle: string;
  icon: ImageSourcePropType;
  id: string;
  issueTitle: string;
  orderId: string;
  primaryActionLabel: string;
  recommendation: string;
  receiptId?: string;
  riskLabel: string;
  riskLevel: ApprovalRiskLevel;
  sourceLabel: string;
  subtitle: string;
  suggestionTitle: string;
  timestamp: string;
};

export type ApprovalFilter = "all" | ApprovalCategory;

export type ApprovalFilterOption = {
  id: ApprovalFilter;
  label: string;
};

export type ApprovalCounts = Record<ApprovalFilter, number>;

export const approvalFilters: readonly ApprovalFilterOption[] = [
  { id: "all", label: "All" },
  { id: "payments", label: "Payments" },
  { id: "complaints", label: "Complaints" },
  { id: "discounts", label: "Discounts" },
  { id: "low-confidence", label: "Low confidence" },
];

export const initialApprovalItems: readonly ApprovalQueueItem[] = [
  {
    actionKind: "review-receipt",
    amountLabel: "\u20A618,000.00",
    category: "payments",
    confidence: 62,
    contextLabel: "Receipt image",
    customerName: "Aisha O.",
    detailLabel: "Payment amount",
    draftTitle: "Receipt needs review",
    icon: images.iconReceiptReview,
    id: "receipt-aisha-review",
    issueTitle: "Mismatch in total amount and payment timestamp",
    orderId: "#ORD-2025-0561",
    primaryActionLabel: "Review receipt",
    receiptId: "aisha-receipt-18000",
    recommendation:
      "Receipt may be altered or incomplete. Confirm payment before marking as paid.",
    riskLabel: "Payment risk",
    riskLevel: "medium",
    sourceLabel: "Neo AI",
    subtitle: "Today - 11:02 AM",
    suggestionTitle: "AI recommendation",
    timestamp: "Today - 11:02 AM",
  },
  {
    actionKind: "edit-first",
    category: "low-confidence",
    confidence: 48,
    contextLabel: "From conversation",
    customerName: "Tunde B.",
    detailLabel: '"Can you deliver on Saturday morning?"',
    draftTitle: "Low-confidence reply",
    icon: images.iconAiDraft,
    id: "draft-tunde-low-confidence",
    issueTitle: "No clear delivery windows found in customer context.",
    orderId: "#ORD-2025-0553",
    primaryActionLabel: "Edit first",
    recommendation: "We can deliver on Saturday morning between 9am and 12pm.",
    riskLabel: "Low confidence",
    riskLevel: "low",
    sourceLabel: "Neo AI",
    subtitle: "Today - 9:47 AM",
    suggestionTitle: "AI draft reply",
    timestamp: "Today - 9:47 AM",
  },
  {
    actionKind: "review-request",
    amountLabel: "\u20A63,600.00",
    category: "discounts",
    confidence: 71,
    contextLabel: "From conversation",
    customerName: "Zara Stores",
    detailLabel: "20% discount",
    draftTitle: "Discount request",
    icon: images.iconPaid,
    id: "discount-zara-request",
    issueTitle: "Requested discount is above allowed limit.",
    orderId: "#ORD-2025-0559",
    primaryActionLabel: "Review request",
    recommendation: "Offer 10% discount instead of 20%. Aligns with policy and order value.",
    riskLabel: "Commercial risk",
    riskLevel: "medium",
    sourceLabel: "Neo AI",
    subtitle: "Yesterday - 6:15 PM",
    suggestionTitle: "AI recommendation",
    timestamp: "Yesterday - 6:15 PM",
  },
  {
    actionKind: "review-draft",
    category: "complaints",
    confidence: 66,
    contextLabel: "From conversation",
    customerName: "Kemi A.",
    detailLabel: "Damaged item received",
    draftTitle: "Complaint draft",
    icon: images.iconInbox,
    id: "complaint-kemi-draft",
    issueTitle: "Complaint detected. Sensitive customer situation.",
    orderId: "#ORD-2025-0548",
    primaryActionLabel: "Review draft",
    recommendation: "We are sorry about this. We will replace the item or issue a refund.",
    riskLabel: "Customer care",
    riskLevel: "high",
    sourceLabel: "Neo AI",
    subtitle: "Yesterday - 3:32 PM",
    suggestionTitle: "AI draft reply",
    timestamp: "Yesterday - 3:32 PM",
  },
];

export function getApprovalCounts(
  items: readonly ApprovalQueueItem[],
): ApprovalCounts {
  return {
    all: items.length,
    complaints: items.filter((item) => item.category === "complaints").length,
    discounts: items.filter((item) => item.category === "discounts").length,
    "low-confidence": items.filter((item) => item.category === "low-confidence")
      .length,
    payments: items.filter((item) => item.category === "payments").length,
  };
}

export function filterApprovalItems({
  filter,
  items,
  query,
}: {
  filter: ApprovalFilter;
  items: readonly ApprovalQueueItem[];
  query: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesQuery =
      !normalizedQuery ||
      item.customerName.toLowerCase().includes(normalizedQuery) ||
      item.draftTitle.toLowerCase().includes(normalizedQuery) ||
      item.orderId.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });
}
