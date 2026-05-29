export type UserRole = "owner" | "manager" | "staff";

export type PaymentStatus =
  | "awaiting_payment"
  | "receipt_pending_review"
  | "paid"
  | "rejected";

export type OrderStatus =
  | "draft"
  | "confirmed"
  | "in_fulfillment"
  | "ready"
  | "delivered"
  | "cancelled";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "edited";

export type AttentionPriority = "high" | "medium" | "low";

export type BusinessProfileSummary = {
  id: string;
  name: string;
  category: string;
  countryCode: "NG" | string;
};
