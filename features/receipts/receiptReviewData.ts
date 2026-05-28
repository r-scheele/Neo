import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";

// DEV-ONLY FIXTURE DATA: replace with backend-backed receipt review records before release.
export type ReceiptRiskLevel = "low" | "medium" | "high";
export type ReceiptReviewState = "ready" | "unreadable";
export type ReceiptRowStatus = "matches" | "partial" | "detected" | "mismatch" | "unreadable";

export type ReceiptPreviewLine = {
  label: string;
  value: string;
};

export type ReceiptExtractedRow = {
  icon: ImageSourcePropType;
  id: string;
  label: string;
  note?: string;
  status: ReceiptRowStatus;
  statusLabel: string;
  value: string;
};

export type ReceiptReviewRecord = {
  confidence: number;
  conversationId: string;
  customerInitials: string;
  customerName: string;
  expectedAmount: number;
  extractedAmount?: number;
  extractedRows: readonly ReceiptExtractedRow[];
  id: string;
  orderDisplayId: string;
  orderRouteId: string;
  placedAt: string;
  previewLines: readonly ReceiptPreviewLine[];
  previewSubtitle: string;
  previewTitle: string;
  riskLabel: string;
  riskLevel: ReceiptRiskLevel;
  state: ReceiptReviewState;
  statusLabel: string;
  submittedAt: string;
  warningLines: readonly string[];
};

export function formatReceiptNaira(amount: number) {
  return `\u20A6${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

const aishaReceipt: ReceiptReviewRecord = {
  confidence: 72,
  conversationId: "aisha-order-review",
  customerInitials: "AO",
  customerName: "Aisha O.",
  expectedAmount: 18000,
  extractedAmount: 18000,
  extractedRows: [
    {
      icon: images.iconPaid,
      id: "amount",
      label: "Amount",
      status: "matches",
      statusLabel: "Matches",
      value: formatReceiptNaira(18000),
    },
    {
      icon: images.iconCustomer,
      id: "sender",
      label: "Sender",
      note: "Initials match customer, full sender name needs bank alert check.",
      status: "partial",
      statusLabel: "Partial",
      value: "A. O.",
    },
    {
      icon: images.iconOrder,
      id: "date-time",
      label: "Date & time",
      status: "matches",
      statusLabel: "Matches",
      value: "Today, 10:45 AM",
    },
    {
      icon: images.iconReceiptReview,
      id: "reference",
      label: "Reference / Narration",
      note: "Narration mentions the order but is not proof of settlement.",
      status: "partial",
      statusLabel: "Partial",
      value: "Payment for order",
    },
    {
      icon: images.iconInbox,
      id: "channel",
      label: "Channel",
      status: "detected",
      statusLabel: "Detected",
      value: "Mobile transfer",
    },
  ],
  id: "aisha-receipt-18000",
  orderDisplayId: "#ORD-2025-0561",
  orderRouteId: "ord-2025-0561",
  placedAt: "Placed today - 11:02 AM",
  previewLines: [
    { label: "Amount", value: formatReceiptNaira(18000) },
    { label: "From", value: "A. O." },
    { label: "To", value: "Neo Foods" },
    { label: "Reference", value: "Payment for order" },
    { label: "Date", value: "Today, 10:45 AM" },
  ],
  previewSubtitle: "Your transfer was successful.",
  previewTitle: "Transfer Successful",
  riskLabel: "Needs review",
  riskLevel: "medium",
  state: "ready",
  statusLabel: "Needs review",
  submittedAt: "Today - 11:02 AM",
  warningLines: [
    "Manual transfer screenshots can be altered.",
    "Only confirm after seeing a matching bank alert.",
  ],
};

const unreadableReceipt: ReceiptReviewRecord = {
  ...aishaReceipt,
  confidence: 18,
  extractedAmount: undefined,
  extractedRows: [
    {
      icon: images.iconReceiptReview,
      id: "image",
      label: "Receipt image",
      note: "The screenshot is too blurry for a safe local review.",
      status: "unreadable",
      statusLabel: "Unreadable",
      value: "Could not read details",
    },
    {
      icon: images.iconPaid,
      id: "amount",
      label: "Amount",
      status: "unreadable",
      statusLabel: "Unreadable",
      value: "Not clear",
    },
  ],
  id: "unreadable-receipt",
  previewLines: [
    { label: "Amount", value: "Not clear" },
    { label: "From", value: "Not clear" },
    { label: "Reference", value: "Not clear" },
    { label: "Date", value: "Not clear" },
  ],
  previewSubtitle: "The receipt image needs a clearer resend.",
  previewTitle: "Receipt unreadable",
  riskLabel: "High risk",
  riskLevel: "high",
  state: "unreadable",
  statusLabel: "Unreadable",
  warningLines: [
    "Do not confirm payment from this screenshot.",
    "Ask for a clearer receipt and verify against bank alert.",
  ],
};

const receiptReviewRecords: Record<string, ReceiptReviewRecord> = {
  [aishaReceipt.id]: aishaReceipt,
  [unreadableReceipt.id]: unreadableReceipt,
};

export function getReceiptReviewById(
  receiptId?: string,
): ReceiptReviewRecord | null {
  if (!receiptId) {
    return null;
  }

  return receiptReviewRecords[receiptId] ?? null;
}
