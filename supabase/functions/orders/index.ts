import { getRouteParts, requireCommerceContext } from "../_shared/commerceContext.ts";
import {
  fail,
  handleOptions,
  isRecord,
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
  requiredNumber,
  requiredString,
  safeJsonRecord,
} from "../_shared/postgrest.ts";

type OrderRow = {
  id: string;
  businessId: string;
  customerId: string | null;
  conversationId: string | null;
  orderNumber: string | null;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  currency: string;
  subtotalAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderItemRow = {
  id: string;
  name: string;
  quantity: number;
  unitPriceAmount: number;
  lineTotalAmount: number;
  description: string;
  productId: string;
  variant: string;
};

type CustomerRow = {
  id: string;
  displayName: string;
  createdAt: string;
};

type ReceiptRow = {
  id: string;
  amountClaimed: number | null;
  paymentDecision: string;
  reviewStatus: string;
  createdAt: string;
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

  const parts = getRouteParts(request, "orders");

  if (request.method === "POST" && parts.length === 0) {
    return createOrder(request, context.context.businessId, context.context.membership.id);
  }

  if (request.method === "GET" && parts[0] === "today-summary") {
    return getTodaySummary(context.context.businessId);
  }

  if (request.method === "GET" && parts.length === 1) {
    return getOrderDetail(parts[0], context.context.businessId);
  }

  if (request.method === "GET" && parts.length === 0) {
    return listOrders(request, context.context.businessId);
  }

  return methodNotAllowed(["GET", "POST", "OPTIONS"]);
});

async function createOrder(
  request: Request,
  businessId: string,
  memberId: string,
): Promise<Response> {
  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const items = parseCreateItems(body.data.items);
  if (!items.ok) {
    return items.response;
  }

  const deliveryFeeAmount = nonNegativeAmount(body.data.deliveryFeeAmount);
  if (deliveryFeeAmount === null) {
    return fail(
      "VALIDATION_INVALID_DELIVERY_FEE",
      "Enter a valid delivery fee.",
      400,
    );
  }

  const customer = await resolveCustomer(body.data, businessId);
  if (!customer.ok) {
    return customer.response;
  }

  const subtotalAmount = items.data.reduce(
    (total, item) => total + item.unitPriceAmount * item.quantity,
    0,
  );
  const totalAmount = subtotalAmount + deliveryFeeAmount;
  const orderNumber = createOrderNumber();
  const paymentStatus = normalizeCreatePaymentStatus(body.data.paymentStatus);
  const conversationId = uuidOrNull(body.data.conversationId);
  const notes = textOrNull(body.data.notes);

  const insertedOrder = await dbRequest(
    "/rest/v1/orders?select=*",
    {
      body: {
        business_id: businessId,
        conversation_id: conversationId,
        created_by_member_id: memberId,
        currency: "NGN",
        customer_id: customer.data?.id ?? null,
        delivery_fee_amount: deliveryFeeAmount,
        delivery_status: "scheduled",
        notes,
        order_number: orderNumber,
        payment_status: paymentStatus,
        status: "draft",
        subtotal_amount: subtotalAmount,
        total_amount: totalAmount,
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => parseOrderRow(requiredFirst(value)),
  );

  if (!insertedOrder.ok) {
    return insertedOrder.response;
  }

  const itemRows = items.data.map((item) => ({
    business_id: businessId,
    line_total_amount: item.quantity * item.unitPriceAmount,
    metadata: {
      description: item.description,
      productId: item.productId,
      variant: item.variant,
    },
    name: item.name,
    order_id: insertedOrder.data.id,
    quantity: item.quantity,
    unit_price_amount: item.unitPriceAmount,
  }));
  const insertedItems = await dbRequest(
    "/rest/v1/order_items?select=*",
    {
      body: itemRows,
      method: "POST",
      prefer: "return=representation",
    },
    (value) => records(value).map(parseOrderItemRow),
  );

  if (!insertedItems.ok) {
    return insertedItems.response;
  }

  return ok(
    {
      order: orderDetailDto({
        customer: customer.data,
        items: insertedItems.data,
        order: insertedOrder.data,
        receipt: null,
      }),
    },
    201,
  );
}

async function listOrders(request: Request, businessId: string): Promise<Response> {
  const url = new URL(request.url);
  const paymentStatus = url.searchParams.get("paymentStatus");
  const status = url.searchParams.get("status");
  const customerId = uuidOrNull(url.searchParams.get("customerId"));
  const filters = [
    `business_id=eq.${encodeURIComponent(businessId)}`,
    "select=*",
    "order=created_at.desc",
    "limit=50",
  ];

  if (paymentStatus) {
    filters.push(`payment_status=eq.${encodeURIComponent(paymentStatus)}`);
  }

  if (status) {
    filters.push(`status=eq.${encodeURIComponent(status)}`);
  }

  if (customerId) {
    filters.push(`customer_id=eq.${encodeURIComponent(customerId)}`);
  }

  const orders = await dbRequest(
    `/rest/v1/orders?${filters.join("&")}`,
    { method: "GET" },
    (value) => records(value).map(parseOrderRow),
  );

  if (!orders.ok) {
    return orders.response;
  }

  return ok({
    orders: orders.data.map((order) => ({
      id: order.id,
      displayId: displayOrderId(order),
      paymentStatus: order.paymentStatus,
      status: order.status,
      totalAmount: order.totalAmount,
      updatedAt: order.updatedAt,
    })),
  });
}

async function getOrderDetail(orderId: string, businessId: string): Promise<Response> {
  const order = await selectOrder(orderId, businessId);
  if (!order.ok) {
    return order.response;
  }

  if (!order.data) {
    return fail("ORDER_NOT_FOUND", "This order could not be found.", 404);
  }

  const items = await selectOrderItems(order.data.id, businessId);
  if (!items.ok) {
    return items.response;
  }

  const customer = order.data.customerId
    ? await selectCustomer(order.data.customerId, businessId)
    : { ok: true as const, data: null };
  if (!customer.ok) {
    return customer.response;
  }

  const receipt = await selectReceiptForOrder(order.data.id, businessId);
  if (!receipt.ok) {
    return receipt.response;
  }

  return ok({
    order: orderDetailDto({
      customer: customer.data,
      items: items.data,
      order: order.data,
      receipt: receipt.data,
    }),
  });
}

async function getTodaySummary(businessId: string): Promise<Response> {
  const orders = await dbRequest(
    `/rest/v1/orders?business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,payment_status,total_amount,created_at&limit=200",
    { method: "GET" },
    records,
  );
  if (!orders.ok) {
    return orders.response;
  }

  const receipts = await dbRequest(
    `/rest/v1/receipts?business_id=eq.${encodeURIComponent(businessId)}` +
      "&review_status=eq.pending&select=id,amount_claimed,created_at&limit=100",
    { method: "GET" },
    records,
  );
  if (!receipts.ok) {
    return receipts.response;
  }

  const followUps = await dbRequest(
    `/rest/v1/follow_ups?business_id=eq.${encodeURIComponent(businessId)}` +
      "&status=in.(queued,due,overdue)&select=id,status,due_at&limit=100",
    { method: "GET" },
    records,
  );
  if (!followUps.ok) {
    return followUps.response;
  }

  const unpaidOrders = orders.data.filter((order) => {
    const status = optionalString(order.payment_status);
    return status !== "paid";
  });
  const unpaidOrdersAmount = unpaidOrders.reduce(
    (total, order) => total + (optionalNumber(order.total_amount) ?? 0),
    0,
  );
  const pendingReceiptsAmount = receipts.data.reduce(
    (total, receipt) => total + (optionalNumber(receipt.amount_claimed) ?? 0),
    0,
  );
  const firstPendingReceiptId = optionalString(receipts.data[0]?.id);
  const firstUnpaidOrderId = optionalString(unpaidOrders[0]?.id);

  return ok({
    summary: {
      dueFollowUpsCount: followUps.data.length,
      lastUpdatedAt: new Date().toISOString(),
      pendingReceiptsAmount,
      pendingReceiptsCount: receipts.data.length,
      unpaidOrdersAmount,
      unpaidOrdersCount: unpaidOrders.length,
      urgentChatsCount: 0,
    },
    queueItems: todayQueueItems({
      dueFollowUpsCount: followUps.data.length,
      pendingReceiptsAmount,
      pendingReceiptsCount: receipts.data.length,
      pendingReceiptId: firstPendingReceiptId,
      unpaidOrdersAmount,
      unpaidOrdersCount: unpaidOrders.length,
      unpaidOrderId: firstUnpaidOrderId,
    }),
  });
}

async function resolveCustomer(
  body: Record<string, unknown>,
  businessId: string,
): Promise<
  | { ok: true; data: CustomerRow | null }
  | { ok: false; response: Response }
> {
  const customerId = uuidOrNull(body.customerId);

  if (customerId) {
    return selectCustomer(customerId, businessId);
  }

  const customerBody = isRecord(body.customer) ? body.customer : {};
  const displayName = textOrNull(customerBody.displayName);

  if (!displayName) {
    return { ok: true, data: null };
  }

  return dbRequest(
    "/rest/v1/customers?select=id,display_name,created_at",
    {
      body: {
        business_id: businessId,
        display_name: displayName,
        phone_e164: textOrNull(customerBody.phoneE164),
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => parseCustomerRow(requiredFirst(value)),
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
      `&business_id=eq.${encodeURIComponent(businessId)}&select=*&limit=1`,
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseOrderRow(record) : null;
    },
  );
}

async function selectOrderItems(
  orderId: string,
  businessId: string,
): Promise<
  | { ok: true; data: OrderItemRow[] }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/order_items?order_id=eq.${encodeURIComponent(orderId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}&select=*&order=created_at.asc`,
    { method: "GET" },
    (value) => records(value).map(parseOrderItemRow),
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
      "&select=id,display_name,created_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseCustomerRow(record) : null;
    },
  );
}

async function selectReceiptForOrder(
  orderId: string,
  businessId: string,
): Promise<
  | { ok: true; data: ReceiptRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/receipts?order_id=eq.${encodeURIComponent(orderId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,amount_claimed,payment_decision,review_status,created_at" +
      "&order=created_at.desc&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseReceiptRow(record) : null;
    },
  );
}

function orderDetailDto({
  customer,
  items,
  order,
  receipt,
}: {
  customer: CustomerRow | null;
  items: OrderItemRow[];
  order: OrderRow;
  receipt: ReceiptRow | null;
}) {
  const paymentState = paymentStateFromStatus(order.paymentStatus, receipt);
  const created = new Date(order.createdAt);
  const customerName = customer?.displayName ?? "Walk-in customer";

  return {
    conversationId: order.conversationId ?? "backend-order",
    customer: {
      customerId: customer?.id ?? "backend-customer",
      customerInitials: initials(customerName),
      customerName,
      customerSince: customer?.createdAt
        ? shortMonthYear(customer.createdAt)
        : shortMonthYear(order.createdAt),
      orderCount: 1,
      relationshipLabel: customer ? "Backend customer" : "Guest customer",
    },
    delivery: {
      estimate: "Delivery timing managed by staff",
      fee: order.deliveryFeeAmount,
      state: "scheduled",
      stateLabel: "Scheduled",
      zone: "Delivery zone recorded on order",
    },
    displayId: displayOrderId(order),
    id: order.id,
    items: items.map((item) => ({
      description: item.description,
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPriceAmount,
      variant: item.variant,
    })),
    orderDate: created.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    orderTime: created.toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
    }),
    payment: paymentDto(order, paymentState, receipt),
    sourceLabel: "Backend order",
    sourceTitle: order.notes ? "Order note attached" : "Order created in Neo",
    statusLabel: statusLabel(order.paymentStatus),
    statusTone: paymentState === "paid" ? "success" : "warning",
    timeline: timelineDto(order, paymentState, receipt),
  };
}

function paymentDto(
  order: OrderRow,
  paymentState: "awaiting-payment" | "receipt-review" | "paid",
  receipt: ReceiptRow | null,
) {
  if (paymentState === "paid") {
    return {
      actionLabel: "View receipt",
      amount: order.totalAmount,
      detail: "Payment was marked reviewed by a human.",
      receiptId: receipt?.id,
      state: "paid",
      submittedAt: receipt ? shortDateTime(receipt.createdAt) : undefined,
      title: "Payment reviewed",
      warning: "Payment state came from a backend record, not screenshot automation.",
    };
  }

  if (paymentState === "receipt-review") {
    return {
      actionLabel: "Review receipt",
      amount: order.totalAmount,
      detail: "A receipt record needs human review.",
      receiptId: receipt?.id,
      state: "receipt-review",
      submittedAt: receipt ? shortDateTime(receipt.createdAt) : undefined,
      title: "Receipt submitted",
      warning: "Review the receipt and check the bank alert before confirming.",
    };
  }

  return {
    actionLabel: "Send reminder",
    amount: order.totalAmount,
    detail: "No reviewed payment is recorded yet.",
    state: "awaiting-payment",
    title: "Awaiting payment",
    warning: "Send a respectful reminder or wait for proof before taking action.",
  };
}

function timelineDto(
  order: OrderRow,
  paymentState: "awaiting-payment" | "receipt-review" | "paid",
  receipt: ReceiptRow | null,
) {
  const events = [
    {
      id: "order-created",
      time: shortDateTime(order.createdAt),
      title: "Order created",
      tone: "success",
    },
  ];

  if (receipt) {
    events.unshift({
      id: "receipt-recorded",
      time: shortDateTime(receipt.createdAt),
      title: paymentState === "paid" ? "Receipt reviewed" : "Receipt needs review",
      tone: paymentState === "paid" ? "success" : "warning",
    });
  }

  return events;
}

function todayQueueItems({
  dueFollowUpsCount,
  pendingReceiptsAmount,
  pendingReceiptsCount,
  pendingReceiptId,
  unpaidOrdersAmount,
  unpaidOrdersCount,
  unpaidOrderId,
}: {
  dueFollowUpsCount: number;
  pendingReceiptsAmount: number;
  pendingReceiptsCount: number;
  pendingReceiptId: string | null;
  unpaidOrdersAmount: number;
  unpaidOrdersCount: number;
  unpaidOrderId: string | null;
}) {
  const items = [];

  if (pendingReceiptsCount > 0) {
    items.push({
      actionLabel: "Review receipts",
      badgeCount: pendingReceiptsCount,
      details: `${pendingReceiptsCount} pending - NGN ${pendingReceiptsAmount}`,
      href: pendingReceiptId ? `/receipt/${pendingReceiptId}` : "/receipt",
      id: "receipt-review",
      priority: "high",
      reason: "Check amount and bank alert before marking paid",
      status: "Needs review",
      statusTone: "warning",
      title: "Receipts need review",
    });
  }

  if (unpaidOrdersCount > 0) {
    items.push({
      actionLabel: "Open orders",
      badgeCount: unpaidOrdersCount,
      details: `${unpaidOrdersCount} orders - NGN ${unpaidOrdersAmount}`,
      href: unpaidOrderId ? `/order/${unpaidOrderId}` : "/order",
      id: "unpaid-orders",
      priority: "medium",
      reason: "Send payment link or respectful reminder",
      status: "Awaiting payment",
      statusTone: "warning",
      title: "Unpaid orders",
    });
  }

  if (dueFollowUpsCount > 0) {
    items.push({
      actionLabel: "See follow-ups",
      badgeCount: dueFollowUpsCount,
      details: `${dueFollowUpsCount} customers`,
      href: "/follow-ups",
      id: "due-follow-ups",
      priority: "medium",
      reason: "Reminders and status checks",
      status: "Due",
      statusTone: "success",
      title: "Follow-ups due",
    });
  }

  return items;
}

function parseCreateItems(value: unknown):
  | { ok: true; data: CreateItem[] }
  | { ok: false; response: Response } {
  if (!Array.isArray(value) || value.length === 0) {
    return {
      ok: false,
      response: fail("VALIDATION_ITEMS_REQUIRED", "Add at least one product.", 400),
    };
  }

  const items: CreateItem[] = [];

  for (const item of value) {
    if (!isRecord(item)) {
      return invalidItem();
    }

    const name = textOrNull(item.name);
    const quantity = positiveInteger(item.quantity);
    const unitPriceAmount = nonNegativeAmount(item.unitPriceAmount);

    if (!name || quantity === null || unitPriceAmount === null) {
      return invalidItem();
    }

    items.push({
      description: textOrNull(item.description) ?? "",
      name,
      productId: textOrNull(item.productId) ?? "",
      quantity,
      unitPriceAmount,
      variant: textOrNull(item.variant) ?? "Default",
    });
  }

  return { ok: true, data: items };
}

type CreateItem = {
  description: string;
  name: string;
  productId: string;
  quantity: number;
  unitPriceAmount: number;
  variant: string;
};

function invalidItem() {
  return {
    ok: false as const,
    response: fail(
      "VALIDATION_INVALID_ITEM",
      "Every order item needs a name, quantity, and price.",
      400,
    ),
  };
}

function parseOrderRow(record: Record<string, unknown>): OrderRow {
  return {
    businessId: requiredString(record.business_id),
    conversationId: optionalString(record.conversation_id),
    createdAt: requiredString(record.created_at),
    currency: requiredString(record.currency),
    customerId: optionalString(record.customer_id),
    deliveryFeeAmount: requiredNumber(record.delivery_fee_amount),
    deliveryStatus: requiredString(record.delivery_status),
    id: requiredString(record.id),
    notes: optionalString(record.notes),
    orderNumber: optionalString(record.order_number),
    paymentStatus: requiredString(record.payment_status),
    status: requiredString(record.status),
    subtotalAmount: requiredNumber(record.subtotal_amount),
    totalAmount: requiredNumber(record.total_amount),
    updatedAt: requiredString(record.updated_at),
  };
}

function parseOrderItemRow(record: Record<string, unknown>): OrderItemRow {
  const metadata = safeJsonRecord(record.metadata);

  return {
    description: optionalString(metadata.description) ?? "",
    id: requiredString(record.id),
    lineTotalAmount: requiredNumber(record.line_total_amount),
    name: requiredString(record.name),
    productId: optionalString(metadata.productId) ?? "",
    quantity: requiredNumber(record.quantity),
    unitPriceAmount: requiredNumber(record.unit_price_amount),
    variant: optionalString(metadata.variant) ?? "Default",
  };
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    createdAt: requiredString(record.created_at),
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
  };
}

function parseReceiptRow(record: Record<string, unknown>): ReceiptRow {
  return {
    amountClaimed: optionalNumber(record.amount_claimed),
    createdAt: requiredString(record.created_at),
    id: requiredString(record.id),
    paymentDecision: requiredString(record.payment_decision),
    reviewStatus: requiredString(record.review_status),
  };
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}

function normalizeCreatePaymentStatus(value: unknown): string {
  if (value === "paid") {
    return "paid";
  }

  if (value === "awaiting-receipt" || value === "awaiting_receipt") {
    return "awaiting_receipt";
  }

  return "unpaid";
}

function paymentStateFromStatus(orderPaymentStatus: string, receipt: ReceiptRow | null) {
  if (orderPaymentStatus === "paid" || receipt?.paymentDecision === "approved_after_bank_check") {
    return "paid";
  }

  if (receipt || orderPaymentStatus === "awaiting_receipt" || orderPaymentStatus === "receipt_review") {
    return "receipt-review";
  }

  return "awaiting-payment";
}

function statusLabel(paymentStatus: string): string {
  if (paymentStatus === "paid") {
    return "Paid";
  }

  if (paymentStatus === "awaiting_receipt" || paymentStatus === "receipt_review") {
    return "Receipt review";
  }

  return "Awaiting payment";
}

function displayOrderId(order: OrderRow): string {
  return order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}`;
}

function createOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();

  return `ORD-${date}-${suffix}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";
}

function shortMonthYear(value: string): string {
  return new Date(value).toLocaleDateString("en-NG", {
    month: "short",
    year: "numeric",
  });
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

function textOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function positiveInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

function nonNegativeAmount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.trunc(value)
    : null;
}

function uuidOrNull(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}
