import type { createApiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import { isRecord } from "./response";
import type { ApiResult } from "./types";

type ApiClient = ReturnType<typeof createApiClient>;

export type CreateCommerceOrderItem = {
  description: string;
  name: string;
  productId?: string;
  quantity: number;
  unitPriceAmount: number;
  variant: string;
};

export type CreateCommerceOrderPayload = {
  conversationId?: string;
  customer: {
    displayName: string;
    phoneE164?: string;
  };
  deliveryFeeAmount: number;
  deliveryZone: string;
  items: readonly CreateCommerceOrderItem[];
  notes?: string;
  paymentStatus: "unpaid" | "awaiting_receipt" | "paid";
};

export type BackendOrderPaymentState =
  | "awaiting-payment"
  | "receipt-review"
  | "paid";
export type BackendOrderDeliveryState =
  | "scheduled"
  | "in-progress"
  | "delivered";
export type BackendTone = "success" | "warning" | "error" | "info" | "neutral";

export type BackendOrderDetail = {
  conversationId: string;
  customer: {
    customerId: string;
    customerInitials: string;
    customerName: string;
    customerSince: string;
    orderCount: number;
    relationshipLabel: string;
  };
  delivery: {
    estimate: string;
    fee: number;
    state: BackendOrderDeliveryState;
    stateLabel: string;
    zone: string;
  };
  displayId: string;
  id: string;
  items: readonly {
    description: string;
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    variant: string;
  }[];
  orderDate: string;
  orderTime: string;
  payment: {
    actionLabel: string;
    amount: number;
    detail: string;
    receiptId?: string;
    state: BackendOrderPaymentState;
    submittedAt?: string;
    title: string;
    warning: string;
  };
  sourceLabel: string;
  sourceTitle: string;
  statusLabel: string;
  statusTone: BackendTone;
  timeline: readonly {
    detail?: string;
    id: string;
    statusLabel?: string;
    time: string;
    title: string;
    tone: BackendTone;
  }[];
};

export type BackendReceiptReview = {
  confidence: number;
  conversationId: string;
  customerInitials: string;
  customerName: string;
  expectedAmount: number;
  extractedAmount?: number;
  extractedRows: readonly {
    id: string;
    label: string;
    note?: string;
    status: "matches" | "partial" | "detected" | "mismatch" | "unreadable";
    statusLabel: string;
    value: string;
  }[];
  id: string;
  orderDisplayId: string;
  orderRouteId: string;
  placedAt: string;
  previewLines: readonly {
    label: string;
    value: string;
  }[];
  previewSubtitle: string;
  previewTitle: string;
  riskLabel: string;
  riskLevel: "low" | "medium" | "high";
  state: "ready" | "unreadable";
  statusLabel: string;
  submittedAt: string;
  warningLines: readonly string[];
};

export type BackendReceiptDecision =
  | "needs_bank_check"
  | "approved_after_bank_check"
  | "rejected_mismatch"
  | "unreadable";

export type BackendCustomerProfile = {
  activity: readonly {
    detail: string;
    id: string;
    timeLabel: string;
    title: string;
    tone: "success" | "warning" | "info";
  }[];
  avatarTone: BackendTone;
  conversationId: string;
  customerInitials: string;
  customerName: string;
  customerSince: string;
  id: string;
  latestOrderHref: string;
  locationLabel: string;
  metrics: {
    lastOrder: {
      amount: number;
      dateLabel: string;
      status: "paid" | "unpaid" | "review";
    } | null;
    nextFollowUp: string;
    outstandingAmount: number;
    totalSpend: number;
  };
  notes: readonly {
    authorLabel: string;
    body: string;
    dateLabel: string;
    id: string;
    visibilityLabel: string;
  }[];
  orderCount: number;
  orders: readonly {
    amount: number;
    dateLabel: string;
    href: string;
    id: string;
    itemCountLabel: string;
    status: "paid" | "unpaid" | "review";
  }[];
  preferences: {
    deliveryArea: string;
    favoriteCategories: string;
    paymentTime: string;
  };
  primaryPreference: string;
  statusLabel: string;
  statusTone: BackendTone;
};

export type BackendFollowUpQueueItem = {
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
  status: "due" | "overdue" | "suggested" | "done";
  suggestedMessage: string;
  targetLabel: string;
  targetType: "order" | "conversation";
  tone: BackendTone;
};

export type BackendFollowUpsResponse = {
  counts: {
    all: number;
    done: number;
    due: number;
    overdue: number;
    suggested: number;
  };
  followUps: readonly BackendFollowUpQueueItem[];
};

export type BackendTodaySummary = {
  dueFollowUpsCount: number;
  lastUpdatedAt: string;
  pendingReceiptsAmount: number;
  pendingReceiptsCount: number;
  unpaidOrdersAmount: number;
  unpaidOrdersCount: number;
  urgentChatsCount: number;
};

export type BackendTodayQueueItem = {
  actionLabel: string;
  badgeCount?: number;
  details: string;
  href: string;
  id: string;
  priority: "high" | "medium";
  reason: string;
  status: string;
  statusTone: BackendTone;
  title: string;
};

export type BackendTodayResponse = {
  queueItems: readonly BackendTodayQueueItem[];
  summary: BackendTodaySummary;
};

export type BackendApprovalDecision =
  | "approved"
  | "asked"
  | "edited"
  | "escalated"
  | "rejected"
  | "sent";

export type BackendApproval = {
  createdAt: string;
  decidedAt?: string;
  id: string;
  riskCategory?: string;
  status: string;
  subjectId?: string;
  subjectType: string;
  updatedAt: string;
};

export function createCommerceOrder(
  client: ApiClient,
  payload: CreateCommerceOrderPayload,
): Promise<ApiResult<{ order: BackendOrderDetail }>> {
  return client.request({
    path: apiEndpoints.orders,
    method: "POST",
    body: {
      conversationId: payload.conversationId,
      customer: payload.customer,
      deliveryFeeAmount: payload.deliveryFeeAmount,
      deliveryZone: payload.deliveryZone,
      items: payload.items.map((item) => ({
        description: item.description,
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceAmount: item.unitPriceAmount,
        variant: item.variant,
      })),
      notes: payload.notes,
      paymentStatus: payload.paymentStatus,
    },
    parseData: parseOrderDetailEnvelope,
  });
}

export function getCommerceOrder(
  client: ApiClient,
  orderId: string,
): Promise<ApiResult<{ order: BackendOrderDetail }>> {
  return client.request({
    path: `${apiEndpoints.orders}/${encodeURIComponent(orderId)}`,
    parseData: parseOrderDetailEnvelope,
  });
}

export function cancelCommerceOrder(
  client: ApiClient,
  orderId: string,
): Promise<ApiResult<{ order: BackendOrderDetail }>> {
  return client.request({
    path: `${apiEndpoints.orders}/${encodeURIComponent(orderId)}/cancel`,
    method: "PATCH",
    body: {},
    parseData: parseOrderDetailEnvelope,
  });
}

export function updateCommerceOrderDeliveryStatus(
  client: ApiClient,
  orderId: string,
  status: "not_started" | "scheduled" | "in_progress" | "delivered",
): Promise<ApiResult<{ order: BackendOrderDetail }>> {
  return client.request({
    path: `${apiEndpoints.orders}/${encodeURIComponent(orderId)}/delivery-status`,
    method: "PATCH",
    body: { status },
    parseData: parseOrderDetailEnvelope,
  });
}

export function updateCommerceOrderPaymentStatus(
  client: ApiClient,
  orderId: string,
  status: "unpaid" | "awaiting_receipt" | "receipt_review" | "paid",
): Promise<ApiResult<{ order: BackendOrderDetail }>> {
  return client.request({
    path: `${apiEndpoints.orders}/${encodeURIComponent(orderId)}/payment-status`,
    method: "PATCH",
    body: { status },
    parseData: parseOrderDetailEnvelope,
  });
}

export function decideApproval(
  client: ApiClient,
  approvalId: string,
  decision: BackendApprovalDecision,
): Promise<ApiResult<{ approval: BackendApproval }>> {
  return client.request({
    path: `${apiEndpoints.approvals}/${encodeURIComponent(approvalId)}/decision`,
    method: "PATCH",
    body: { decision },
    parseData: parseApprovalEnvelope,
  });
}

export function getCustomerProfile(
  client: ApiClient,
  customerId: string,
): Promise<ApiResult<{ customer: BackendCustomerProfile }>> {
  return client.request({
    path: `${apiEndpoints.customers}/${encodeURIComponent(customerId)}`,
    parseData: parseCustomerProfileEnvelope,
  });
}

export function getReceiptReview(
  client: ApiClient,
  receiptId: string,
): Promise<ApiResult<{ receipt: BackendReceiptReview }>> {
  return client.request({
    path: `${apiEndpoints.receipts}/${encodeURIComponent(receiptId)}`,
    parseData: parseReceiptReviewEnvelope,
  });
}

export function reviewReceipt(
  client: ApiClient,
  receiptId: string,
  decision: BackendReceiptDecision,
): Promise<ApiResult<{ receipt: BackendReceiptReview }>> {
  return client.request({
    path: `${apiEndpoints.receipts}/${encodeURIComponent(receiptId)}/review`,
    method: "PATCH",
    body: { decision },
    parseData: parseReceiptReviewEnvelope,
  });
}

export function getFollowUps(
  client: ApiClient,
): Promise<ApiResult<BackendFollowUpsResponse>> {
  return client.request({
    path: apiEndpoints.followUps,
    parseData: parseFollowUpsResponse,
  });
}

export function completeFollowUp(
  client: ApiClient,
  followUpId: string,
): Promise<ApiResult<{ followUp: BackendFollowUpQueueItem }>> {
  return client.request({
    path: `${apiEndpoints.followUps}/${encodeURIComponent(followUpId)}/complete`,
    method: "PATCH",
    body: {},
    parseData: parseFollowUpEnvelope,
  });
}

export function rescheduleFollowUp(
  client: ApiClient,
  followUpId: string,
  dueAt: string,
): Promise<ApiResult<{ followUp: BackendFollowUpQueueItem }>> {
  return client.request({
    path: `${apiEndpoints.followUps}/${encodeURIComponent(followUpId)}/reschedule`,
    method: "PATCH",
    body: { dueAt, status: "queued" },
    parseData: parseFollowUpEnvelope,
  });
}

export function getTodaySummary(
  client: ApiClient,
): Promise<ApiResult<BackendTodayResponse>> {
  return client.request({
    path: `${apiEndpoints.orders}/today-summary`,
    parseData: parseTodayResponse,
  });
}

function parseOrderDetailEnvelope(data: unknown): { order: BackendOrderDetail } {
  const record = requiredRecord(data);

  return {
    order: parseOrderDetail(record.order),
  };
}

function parseOrderDetail(value: unknown): BackendOrderDetail {
  const record = requiredRecord(value);
  const customer = requiredRecord(record.customer);
  const delivery = requiredRecord(record.delivery);
  const payment = requiredRecord(record.payment);

  return {
    conversationId: requiredString(record.conversationId),
    customer: {
      customerId: requiredString(customer.customerId),
      customerInitials: requiredString(customer.customerInitials),
      customerName: requiredString(customer.customerName),
      customerSince: requiredString(customer.customerSince),
      orderCount: requiredNumber(customer.orderCount),
      relationshipLabel: requiredString(customer.relationshipLabel),
    },
    delivery: {
      estimate: requiredString(delivery.estimate),
      fee: requiredNumber(delivery.fee),
      state: parseUnion(delivery.state, orderDeliveryStates),
      stateLabel: requiredString(delivery.stateLabel),
      zone: requiredString(delivery.zone),
    },
    displayId: requiredString(record.displayId),
    id: requiredString(record.id),
    items: requiredArray(record.items).map(parseOrderItem),
    orderDate: requiredString(record.orderDate),
    orderTime: requiredString(record.orderTime),
    payment: {
      actionLabel: requiredString(payment.actionLabel),
      amount: requiredNumber(payment.amount),
      detail: requiredString(payment.detail),
      receiptId: optionalString(payment.receiptId),
      state: parseUnion(payment.state, orderPaymentStates),
      submittedAt: optionalString(payment.submittedAt),
      title: requiredString(payment.title),
      warning: requiredString(payment.warning),
    },
    sourceLabel: requiredString(record.sourceLabel),
    sourceTitle: requiredString(record.sourceTitle),
    statusLabel: requiredString(record.statusLabel),
    statusTone: parseUnion(record.statusTone, backendTones),
    timeline: requiredArray(record.timeline).map(parseTimelineEvent),
  };
}

function parseReceiptReviewEnvelope(data: unknown): { receipt: BackendReceiptReview } {
  const record = requiredRecord(data);

  return {
    receipt: parseReceiptReview(record.receipt),
  };
}

function parseReceiptReview(value: unknown): BackendReceiptReview {
  const record = requiredRecord(value);

  return {
    confidence: requiredNumber(record.confidence),
    conversationId: requiredString(record.conversationId),
    customerInitials: requiredString(record.customerInitials),
    customerName: requiredString(record.customerName),
    expectedAmount: requiredNumber(record.expectedAmount),
    extractedAmount: optionalNumber(record.extractedAmount),
    extractedRows: requiredArray(record.extractedRows).map(parseReceiptRow),
    id: requiredString(record.id),
    orderDisplayId: requiredString(record.orderDisplayId),
    orderRouteId: requiredString(record.orderRouteId),
    placedAt: requiredString(record.placedAt),
    previewLines: requiredArray(record.previewLines).map(parseLabelValue),
    previewSubtitle: requiredString(record.previewSubtitle),
    previewTitle: requiredString(record.previewTitle),
    riskLabel: requiredString(record.riskLabel),
    riskLevel: parseUnion(record.riskLevel, receiptRiskLevels),
    state: parseUnion(record.state, receiptStates),
    statusLabel: requiredString(record.statusLabel),
    submittedAt: requiredString(record.submittedAt),
    warningLines: requiredArray(record.warningLines).map(requiredString),
  };
}

function parseCustomerProfileEnvelope(data: unknown): { customer: BackendCustomerProfile } {
  const record = requiredRecord(data);

  return {
    customer: parseCustomerProfile(record.customer),
  };
}

function parseCustomerProfile(value: unknown): BackendCustomerProfile {
  const record = requiredRecord(value);
  const metrics = requiredRecord(record.metrics);
  const preferences = requiredRecord(record.preferences);

  return {
    activity: requiredArray(record.activity).map(parseCustomerActivity),
    avatarTone: parseUnion(record.avatarTone, backendTones),
    conversationId: requiredString(record.conversationId),
    customerInitials: requiredString(record.customerInitials),
    customerName: requiredString(record.customerName),
    customerSince: requiredString(record.customerSince),
    id: requiredString(record.id),
    latestOrderHref: requiredString(record.latestOrderHref),
    locationLabel: requiredString(record.locationLabel),
    metrics: {
      lastOrder: metrics.lastOrder === null
        ? null
        : parseCustomerLastOrder(metrics.lastOrder),
      nextFollowUp: requiredString(metrics.nextFollowUp),
      outstandingAmount: requiredNumber(metrics.outstandingAmount),
      totalSpend: requiredNumber(metrics.totalSpend),
    },
    notes: requiredArray(record.notes).map(parseCustomerNote),
    orderCount: requiredNumber(record.orderCount),
    orders: requiredArray(record.orders).map(parseCustomerOrder),
    preferences: {
      deliveryArea: requiredString(preferences.deliveryArea),
      favoriteCategories: requiredString(preferences.favoriteCategories),
      paymentTime: requiredString(preferences.paymentTime),
    },
    primaryPreference: requiredString(record.primaryPreference),
    statusLabel: requiredString(record.statusLabel),
    statusTone: parseUnion(record.statusTone, backendTones),
  };
}

function parseFollowUpsResponse(data: unknown): BackendFollowUpsResponse {
  const record = requiredRecord(data);
  const counts = requiredRecord(record.counts);

  return {
    counts: {
      all: requiredNumber(counts.all),
      done: requiredNumber(counts.done),
      due: requiredNumber(counts.due),
      overdue: requiredNumber(counts.overdue),
      suggested: requiredNumber(counts.suggested),
    },
    followUps: requiredArray(record.followUps).map(parseFollowUp),
  };
}

function parseFollowUpEnvelope(data: unknown): { followUp: BackendFollowUpQueueItem } {
  const record = requiredRecord(data);

  return {
    followUp: parseFollowUp(record.followUp),
  };
}

function parseFollowUp(value: unknown): BackendFollowUpQueueItem {
  const record = requiredRecord(value);

  return {
    amount: optionalNumber(record.amount),
    completedLabel: optionalString(record.completedLabel),
    conversationId: requiredString(record.conversationId),
    customerInitials: requiredString(record.customerInitials),
    customerName: requiredString(record.customerName),
    detailLines: requiredArray(record.detailLines).map(requiredString),
    dueLabel: requiredString(record.dueLabel),
    dueMetaLabel: requiredString(record.dueMetaLabel),
    id: requiredString(record.id),
    isHighPriority: optionalBoolean(record.isHighPriority),
    kindLabel: requiredString(record.kindLabel),
    lastActivityLabel: optionalString(record.lastActivityLabel),
    orderDisplayId: optionalString(record.orderDisplayId),
    orderRouteId: optionalString(record.orderRouteId),
    status: parseUnion(record.status, followUpStatuses),
    suggestedMessage: requiredString(record.suggestedMessage),
    targetLabel: requiredString(record.targetLabel),
    targetType: parseUnion(record.targetType, followUpTargetTypes),
    tone: parseUnion(record.tone, backendTones),
  };
}

function parseTodayResponse(data: unknown): BackendTodayResponse {
  const record = requiredRecord(data);
  const summary = requiredRecord(record.summary);

  return {
    queueItems: requiredArray(record.queueItems).map(parseTodayQueueItem),
    summary: {
      dueFollowUpsCount: requiredNumber(summary.dueFollowUpsCount),
      lastUpdatedAt: requiredString(summary.lastUpdatedAt),
      pendingReceiptsAmount: requiredNumber(summary.pendingReceiptsAmount),
      pendingReceiptsCount: requiredNumber(summary.pendingReceiptsCount),
      unpaidOrdersAmount: requiredNumber(summary.unpaidOrdersAmount),
      unpaidOrdersCount: requiredNumber(summary.unpaidOrdersCount),
      urgentChatsCount: requiredNumber(summary.urgentChatsCount),
    },
  };
}

function parseApprovalEnvelope(data: unknown): { approval: BackendApproval } {
  const record = requiredRecord(data);

  return {
    approval: parseApproval(record.approval),
  };
}

function parseApproval(value: unknown): BackendApproval {
  const record = requiredRecord(value);

  return {
    createdAt: requiredString(record.createdAt),
    decidedAt: optionalString(record.decidedAt),
    id: requiredString(record.id),
    riskCategory: optionalString(record.riskCategory),
    status: requiredString(record.status),
    subjectId: optionalString(record.subjectId),
    subjectType: requiredString(record.subjectType),
    updatedAt: requiredString(record.updatedAt),
  };
}

function parseOrderItem(value: unknown) {
  const record = requiredRecord(value);

  return {
    description: requiredString(record.description),
    id: requiredString(record.id),
    name: requiredString(record.name),
    quantity: requiredNumber(record.quantity),
    unitPrice: requiredNumber(record.unitPrice),
    variant: requiredString(record.variant),
  };
}

function parseTimelineEvent(value: unknown) {
  const record = requiredRecord(value);

  return {
    detail: optionalString(record.detail),
    id: requiredString(record.id),
    statusLabel: optionalString(record.statusLabel),
    time: requiredString(record.time),
    title: requiredString(record.title),
    tone: parseUnion(record.tone, backendTones),
  };
}

function parseReceiptRow(value: unknown) {
  const record = requiredRecord(value);

  return {
    id: requiredString(record.id),
    label: requiredString(record.label),
    note: optionalString(record.note),
    status: parseUnion(record.status, receiptRowStatuses),
    statusLabel: requiredString(record.statusLabel),
    value: requiredString(record.value),
  };
}

function parseLabelValue(value: unknown) {
  const record = requiredRecord(value);

  return {
    label: requiredString(record.label),
    value: requiredString(record.value),
  };
}

function parseCustomerLastOrder(value: unknown) {
  const record = requiredRecord(value);

  return {
    amount: requiredNumber(record.amount),
    dateLabel: requiredString(record.dateLabel),
    status: parseUnion(record.status, customerOrderStatuses),
  };
}

function parseCustomerNote(value: unknown) {
  const record = requiredRecord(value);

  return {
    authorLabel: requiredString(record.authorLabel),
    body: requiredString(record.body),
    dateLabel: requiredString(record.dateLabel),
    id: requiredString(record.id),
    visibilityLabel: requiredString(record.visibilityLabel),
  };
}

function parseCustomerOrder(value: unknown) {
  const record = requiredRecord(value);

  return {
    amount: requiredNumber(record.amount),
    dateLabel: requiredString(record.dateLabel),
    href: requiredString(record.href),
    id: requiredString(record.id),
    itemCountLabel: requiredString(record.itemCountLabel),
    status: parseUnion(record.status, customerOrderStatuses),
  };
}

function parseCustomerActivity(value: unknown) {
  const record = requiredRecord(value);

  return {
    detail: requiredString(record.detail),
    id: requiredString(record.id),
    timeLabel: requiredString(record.timeLabel),
    title: requiredString(record.title),
    tone: parseUnion(record.tone, customerActivityTones),
  };
}

function parseTodayQueueItem(value: unknown): BackendTodayQueueItem {
  const record = requiredRecord(value);

  return {
    actionLabel: requiredString(record.actionLabel),
    badgeCount: optionalNumber(record.badgeCount),
    details: requiredString(record.details),
    href: requiredString(record.href),
    id: requiredString(record.id),
    priority: parseUnion(record.priority, priorityLevels),
    reason: requiredString(record.reason),
    status: requiredString(record.status),
    statusTone: parseUnion(record.statusTone, backendTones),
    title: requiredString(record.title),
  };
}

function requiredRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error("Expected response object.");
  }

  return value;
}

function requiredArray(value: unknown): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected response array.");
  }

  return value;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Expected response string.");
  }

  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function requiredNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Expected response number.");
  }

  return value;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function parseUnion<const TValues extends readonly string[]>(
  value: unknown,
  values: TValues,
): TValues[number] {
  if (typeof value === "string" && values.includes(value)) {
    return value;
  }

  throw new Error("Expected known response value.");
}

const backendTones = ["success", "warning", "error", "info", "neutral"] as const;
const orderPaymentStates = ["awaiting-payment", "receipt-review", "paid"] as const;
const orderDeliveryStates = ["scheduled", "in-progress", "delivered"] as const;
const receiptRiskLevels = ["low", "medium", "high"] as const;
const receiptStates = ["ready", "unreadable"] as const;
const receiptRowStatuses = [
  "matches",
  "partial",
  "detected",
  "mismatch",
  "unreadable",
] as const;
const customerOrderStatuses = ["paid", "unpaid", "review"] as const;
const customerActivityTones = ["success", "warning", "info"] as const;
const followUpStatuses = ["due", "overdue", "suggested", "done"] as const;
const followUpTargetTypes = ["order", "conversation"] as const;
const priorityLevels = ["high", "medium"] as const;
