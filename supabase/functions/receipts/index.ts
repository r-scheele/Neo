import { getRouteParts, requireCommerceContext } from "../_shared/commerceContext.ts";
import {
  fail,
  handleOptions,
  methodNotAllowed,
  ok,
  readJsonRecord,
} from "../_shared/http.ts";
import {
  dbRequest,
  firstRecord,
  optionalNumber,
  optionalString,
  records,
  requiredString,
  safeJsonArray,
} from "../_shared/postgrest.ts";

type ReceiptRow = {
  id: string;
  customerId: string | null;
  orderId: string | null;
  reviewStatus: string;
  extractionStatus: string;
  paymentDecision: string;
  amountClaimed: number | null;
  currency: string;
  riskFlags: unknown[];
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  orderNumber: string | null;
  totalAmount: number;
  createdAt: string;
};

type CustomerRow = {
  id: string;
  displayName: string;
};

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request);
  if (optionsResponse) {
    return optionsResponse;
  }

  const context = await requireCommerceContext(request);
  if (!context.ok) {
    return context.response;
  }

  const parts = getRouteParts(request, "receipts");

  if (request.method === "GET" && parts.length === 1) {
    return getReceiptDetail(parts[0], context.context.businessId);
  }

  if (request.method === "GET" && parts.length === 0) {
    return listReceipts(request, context.context.businessId);
  }

  if (request.method === "PATCH" && parts.length === 2 && parts[1] === "review") {
    return reviewReceipt(
      request,
      parts[0],
      context.context.businessId,
      context.context.membership.id,
    );
  }

  return methodNotAllowed(["GET", "PATCH", "OPTIONS"]);
});

async function getReceiptDetail(
  receiptId: string,
  businessId: string,
): Promise<Response> {
  const receipt = await selectReceipt(receiptId, businessId);
  if (!receipt.ok) {
    return receipt.response;
  }

  if (!receipt.data) {
    return fail("RECEIPT_NOT_FOUND", "This receipt could not be found.", 404);
  }

  const order = receipt.data.orderId
    ? await selectOrder(receipt.data.orderId, businessId)
    : { ok: true as const, data: null };
  if (!order.ok) {
    return order.response;
  }

  const customer = receipt.data.customerId
    ? await selectCustomer(receipt.data.customerId, businessId)
    : { ok: true as const, data: null };
  if (!customer.ok) {
    return customer.response;
  }

  return ok({
    receipt: receiptDetailDto(receipt.data, order.data, customer.data),
  });
}

async function listReceipts(request: Request, businessId: string): Promise<Response> {
  const status = new URL(request.url).searchParams.get("reviewStatus");
  const filters = [
    `business_id=eq.${encodeURIComponent(businessId)}`,
    "select=id,customer_id,order_id,review_status,extraction_status,payment_decision,amount_claimed,currency,risk_flags,reviewed_at,created_at,updated_at",
    "order=created_at.desc",
    "limit=50",
  ];

  if (status) {
    filters.push(`review_status=eq.${encodeURIComponent(status)}`);
  }

  const receipts = await dbRequest(
    `/rest/v1/receipts?${filters.join("&")}`,
    { method: "GET" },
    (value) => records(value).map(parseReceiptRow),
  );

  if (!receipts.ok) {
    return receipts.response;
  }

  return ok({
    receipts: receipts.data.map((receipt) => ({
      amountClaimed: receipt.amountClaimed,
      id: receipt.id,
      orderId: receipt.orderId,
      paymentDecision: receipt.paymentDecision,
      reviewStatus: receipt.reviewStatus,
      updatedAt: receipt.updatedAt,
    })),
  });
}

async function reviewReceipt(
  request: Request,
  receiptId: string,
  businessId: string,
  memberId: string,
): Promise<Response> {
  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const decision = normalizeDecision(body.data.decision);
  if (!decision) {
    return fail(
      "VALIDATION_INVALID_RECEIPT_DECISION",
      "Choose a valid receipt review decision.",
      400,
    );
  }

  const receipt = await dbRequest(
    `/rest/v1/receipts?id=eq.${encodeURIComponent(receiptId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,customer_id,order_id,review_status,extraction_status,payment_decision,amount_claimed,currency,risk_flags,reviewed_at,created_at,updated_at",
    {
      body: {
        payment_decision: decision,
        review_status: decision === "needs_bank_check" ? "pending" : "reviewed",
        reviewed_at: new Date().toISOString(),
        reviewed_by_member_id: memberId,
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => parseReceiptRow(requiredFirst(value)),
  );

  if (!receipt.ok) {
    return receipt.response;
  }

  return ok({
    receipt: receiptDetailDto(receipt.data, null, null),
  });
}

async function selectReceipt(
  receiptId: string,
  businessId: string,
): Promise<
  | { ok: true; data: ReceiptRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/receipts?id=eq.${encodeURIComponent(receiptId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,customer_id,order_id,review_status,extraction_status,payment_decision,amount_claimed,currency,risk_flags,reviewed_at,created_at,updated_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseReceiptRow(record) : null;
    },
  );
}

async function selectOrder(
  orderId: string,
  businessId: string,
): Promise<
  | { ok: true; data: OrderRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,order_number,total_amount,created_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseOrderRow(record) : null;
    },
  );
}

async function selectCustomer(
  customerId: string,
  businessId: string,
): Promise<
  | { ok: true; data: CustomerRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/customers?id=eq.${encodeURIComponent(customerId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,display_name&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseCustomerRow(record) : null;
    },
  );
}

function receiptDetailDto(
  receipt: ReceiptRow,
  order: OrderRow | null,
  customer: CustomerRow | null,
) {
  const expectedAmount = order?.totalAmount ?? receipt.amountClaimed ?? 0;
  const extractedAmount = receipt.amountClaimed ?? undefined;
  const customerName = customer?.displayName ?? "Customer";
  const isUnreadable = receipt.extractionStatus === "unreadable";
  const amountsMatch = extractedAmount !== undefined && extractedAmount === expectedAmount;

  return {
    confidence: isUnreadable ? 18 : amountsMatch ? 72 : 45,
    conversationId: "backend-receipt",
    customerInitials: initials(customerName),
    customerName,
    expectedAmount,
    extractedAmount,
    extractedRows: [
      {
        id: "amount",
        label: "Amount",
        note: amountsMatch
          ? undefined
          : "Compare this with the order and bank alert before deciding.",
        status: amountsMatch ? "matches" : "partial",
        statusLabel: amountsMatch ? "Matches" : "Review",
        value: extractedAmount ? `NGN ${extractedAmount}` : "Not clear",
      },
      {
        id: "source",
        label: "Source",
        status: "detected",
        statusLabel: "Recorded",
        value: "Backend receipt record",
      },
    ],
    id: receipt.id,
    orderDisplayId: order ? displayOrderId(order) : "Order not linked",
    orderRouteId: order?.id ?? "",
    placedAt: `Recorded ${shortDateTime(receipt.createdAt)}`,
    previewLines: [
      { label: "Amount", value: extractedAmount ? `NGN ${extractedAmount}` : "Not clear" },
      { label: "Status", value: receipt.reviewStatus },
      { label: "Decision", value: receipt.paymentDecision },
      { label: "Date", value: shortDateTime(receipt.createdAt) },
    ],
    previewSubtitle: "Stored as a private media reference.",
    previewTitle: "Receipt record",
    riskLabel: riskLabel(receipt),
    riskLevel: riskLevel(receipt),
    state: isUnreadable ? "unreadable" : "ready",
    statusLabel: receipt.reviewStatus === "reviewed" ? "Reviewed" : "Needs review",
    submittedAt: shortDateTime(receipt.createdAt),
    warningLines: [
      "Manual transfer screenshots can be altered.",
      "Only confirm after seeing a matching bank alert.",
    ],
  };
}

function parseReceiptRow(record: Record<string, unknown>): ReceiptRow {
  return {
    amountClaimed: optionalNumber(record.amount_claimed),
    createdAt: requiredString(record.created_at),
    currency: requiredString(record.currency),
    customerId: optionalString(record.customer_id),
    extractionStatus: requiredString(record.extraction_status),
    id: requiredString(record.id),
    orderId: optionalString(record.order_id),
    paymentDecision: requiredString(record.payment_decision),
    reviewedAt: optionalString(record.reviewed_at),
    reviewStatus: requiredString(record.review_status),
    riskFlags: safeJsonArray(record.risk_flags),
    updatedAt: requiredString(record.updated_at),
  };
}

function parseOrderRow(record: Record<string, unknown>): OrderRow {
  return {
    createdAt: requiredString(record.created_at),
    id: requiredString(record.id),
    orderNumber: optionalString(record.order_number),
    totalAmount: optionalNumber(record.total_amount) ?? 0,
  };
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
  };
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}

function normalizeDecision(value: unknown): string | null {
  if (
    value === "needs_bank_check" ||
    value === "approved_after_bank_check" ||
    value === "rejected_mismatch" ||
    value === "unreadable"
  ) {
    return value;
  }

  return null;
}

function riskLevel(receipt: ReceiptRow) {
  if (receipt.paymentDecision === "rejected_mismatch" || receipt.extractionStatus === "unreadable") {
    return "high";
  }

  return receipt.riskFlags.length > 0 ? "medium" : "low";
}

function riskLabel(receipt: ReceiptRow): string {
  if (receipt.reviewStatus === "reviewed") {
    return "Reviewed";
  }

  if (riskLevel(receipt) === "high") {
    return "High risk";
  }

  return "Needs review";
}

function displayOrderId(order: OrderRow): string {
  return order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";
}

function shortDateTime(value: string): string {
  const date = new Date(value);

  return `${date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} - ${date.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
