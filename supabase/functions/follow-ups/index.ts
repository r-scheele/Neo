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
  requiredNumber,
  requiredString,
} from "../_shared/postgrest.ts";

type FollowUpRow = {
  id: string;
  customerId: string | null;
  conversationId: string | null;
  orderId: string | null;
  reason: string;
  status: string;
  dueAt: string | null;
  suggestedMessagePreview: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CustomerRow = {
  id: string;
  displayName: string;
};

type OrderRow = {
  id: string;
  orderNumber: string | null;
  paymentStatus: string;
  totalAmount: number;
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

  const parts = getRouteParts(request, "follow-ups");

  if (request.method === "GET" && parts.length === 0) {
    return listFollowUps(request, context.context.businessId);
  }

  if (request.method === "PATCH" && parts.length === 2 && parts[1] === "complete") {
    return completeFollowUp(
      parts[0],
      context.context.businessId,
      context.context.membership.id,
    );
  }

  if (request.method === "PATCH" && parts.length === 2 && parts[1] === "reschedule") {
    return rescheduleFollowUp(request, parts[0], context.context.businessId);
  }

  return methodNotAllowed(["GET", "PATCH", "OPTIONS"]);
});

async function listFollowUps(request: Request, businessId: string): Promise<Response> {
  const url = new URL(request.url);
  const status = normalizeStatusFilter(url.searchParams.get("status"));
  const filters = [
    `business_id=eq.${encodeURIComponent(businessId)}`,
    "select=id,customer_id,conversation_id,order_id,reason,status,due_at,suggested_message_preview,completed_at,created_at,updated_at",
    "order=due_at.asc.nullslast",
    "limit=100",
  ];

  if (status) {
    filters.push(`status=eq.${encodeURIComponent(status)}`);
  }

  const followUps = await dbRequest(
    `/rest/v1/follow_ups?${filters.join("&")}`,
    { method: "GET" },
    (value) => records(value).map(parseFollowUpRow),
  );

  if (!followUps.ok) {
    return followUps.response;
  }

  const customers = await selectCustomersForFollowUps(followUps.data, businessId);
  if (!customers.ok) {
    return customers.response;
  }

  const orders = await selectOrdersForFollowUps(followUps.data, businessId);
  if (!orders.ok) {
    return orders.response;
  }

  const items = followUps.data.map((followUp) =>
    followUpDto({
      customer: followUp.customerId ? customers.data.get(followUp.customerId) ?? null : null,
      followUp,
      order: followUp.orderId ? orders.data.get(followUp.orderId) ?? null : null,
    }),
  );

  return ok({
    counts: followUpCounts(items),
    followUps: items,
  });
}

async function completeFollowUp(
  followUpId: string,
  businessId: string,
  memberId: string,
): Promise<Response> {
  const updated = await dbRequest(
    `/rest/v1/follow_ups?id=eq.${encodeURIComponent(followUpId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,customer_id,conversation_id,order_id,reason,status,due_at,suggested_message_preview,completed_at,created_at,updated_at",
    {
      body: {
        completed_at: new Date().toISOString(),
        completed_by_member_id: memberId,
        status: "done",
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => parseFollowUpRow(requiredFirst(value)),
  );

  if (!updated.ok) {
    return updated.response;
  }

  return followUpDetailResponse(updated.data, businessId);
}

async function rescheduleFollowUp(
  request: Request,
  followUpId: string,
  businessId: string,
): Promise<Response> {
  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const dueAt = parseDueAt(body.data.dueAt);
  if (!dueAt.ok) {
    return dueAt.response;
  }

  const requestedStatus = normalizeStatusFilter(body.data.status);
  const now = Date.now();
  const nextStatus = dueAt.data.getTime() < now
    ? requestedStatus === "overdue"
      ? "overdue"
      : null
    : requestedStatus === "due" || requestedStatus === "queued"
      ? requestedStatus
      : "queued";

  if (!nextStatus) {
    return fail(
      "VALIDATION_INVALID_FOLLOW_UP_DUE_AT",
      "Choose a future time, or explicitly mark this follow-up overdue.",
      400,
    );
  }

  const updated = await dbRequest(
    `/rest/v1/follow_ups?id=eq.${encodeURIComponent(followUpId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,customer_id,conversation_id,order_id,reason,status,due_at,suggested_message_preview,completed_at,created_at,updated_at",
    {
      body: {
        completed_at: null,
        completed_by_member_id: null,
        due_at: dueAt.data.toISOString(),
        status: nextStatus,
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => parseFollowUpRow(requiredFirst(value)),
  );

  if (!updated.ok) {
    return updated.response;
  }

  return followUpDetailResponse(updated.data, businessId);
}

async function followUpDetailResponse(
  followUp: FollowUpRow,
  businessId: string,
): Promise<Response> {
  const customer = followUp.customerId
    ? await selectCustomer(followUp.customerId, businessId)
    : { ok: true as const, data: null };
  if (!customer.ok) {
    return customer.response;
  }

  const order = followUp.orderId
    ? await selectOrder(followUp.orderId, businessId)
    : { ok: true as const, data: null };
  if (!order.ok) {
    return order.response;
  }

  return ok({
    followUp: followUpDto({
      customer: customer.data,
      followUp,
      order: order.data,
    }),
  });
}

async function selectCustomersForFollowUps(
  followUps: FollowUpRow[],
  businessId: string,
): Promise<
  | { ok: true; data: Map<string, CustomerRow> }
  | { ok: false; response: Response }
> {
  const ids = uniqueIds(followUps.map((followUp) => followUp.customerId));

  if (ids.length === 0) {
    return { ok: true, data: new Map() };
  }

  const result = await dbRequest(
    `/rest/v1/customers?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=in.(${ids.map(encodeURIComponent).join(",")})` +
      "&select=id,display_name",
    { method: "GET" },
    (value) => records(value).map(parseCustomerRow),
  );

  if (!result.ok) {
    return result;
  }

  return { ok: true, data: new Map(result.data.map((customer) => [customer.id, customer])) };
}

async function selectOrdersForFollowUps(
  followUps: FollowUpRow[],
  businessId: string,
): Promise<
  | { ok: true; data: Map<string, OrderRow> }
  | { ok: false; response: Response }
> {
  const ids = uniqueIds(followUps.map((followUp) => followUp.orderId));

  if (ids.length === 0) {
    return { ok: true, data: new Map() };
  }

  const result = await dbRequest(
    `/rest/v1/orders?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=in.(${ids.map(encodeURIComponent).join(",")})` +
      "&select=id,order_number,payment_status,total_amount",
    { method: "GET" },
    (value) => records(value).map(parseOrderRow),
  );

  if (!result.ok) {
    return result;
  }

  return { ok: true, data: new Map(result.data.map((order) => [order.id, order])) };
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
      "&select=id,order_number,payment_status,total_amount&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseOrderRow(record) : null;
    },
  );
}

function followUpDto({
  customer,
  followUp,
  order,
}: {
  customer: CustomerRow | null;
  followUp: FollowUpRow;
  order: OrderRow | null;
}) {
  const customerName = customer?.displayName ?? "Customer";
  const uiStatus = followUpStatus(followUp);
  const orderDisplayId = order ? displayOrderId(order) : undefined;
  const dueLabel = followUp.dueAt ? shortDateTime(followUp.dueAt) : "No due time";

  return {
    amount: order?.totalAmount,
    completedLabel: followUp.completedAt ? `Completed ${shortDateTime(followUp.completedAt)}` : undefined,
    conversationId: followUp.conversationId ?? "backend-follow-up",
    customerInitials: initials(customerName),
    customerName,
    detailLines: [
      orderDisplayId ? `Order ${orderDisplayId}` : "No linked order",
      followUp.reason,
    ],
    dueLabel,
    dueMetaLabel: uiStatus === "done" ? "Completed" : dueLabel,
    id: followUp.id,
    isHighPriority: uiStatus === "overdue",
    kindLabel: kindLabel(followUp, uiStatus),
    orderDisplayId,
    orderRouteId: order?.id,
    status: uiStatus,
    suggestedMessage:
      followUp.suggestedMessagePreview ??
      `Hi ${firstName(customerName)}, just following up on your order. Please let us know if you need any help.`,
    targetLabel: order ? "Open order" : "Open conversation",
    targetType: order ? "order" : "conversation",
    tone: followUpTone(uiStatus),
  };
}

function followUpCounts(items: ReturnType<typeof followUpDto>[]) {
  return {
    all: items.length,
    done: items.filter((item) => item.status === "done").length,
    due: items.filter((item) => item.status === "due").length,
    overdue: items.filter((item) => item.status === "overdue").length,
    suggested: items.filter((item) => item.status === "suggested").length,
  };
}

function followUpStatus(followUp: FollowUpRow) {
  if (followUp.status === "done" || followUp.status === "dismissed") {
    return "done";
  }

  const dueAt = followUp.dueAt ? new Date(followUp.dueAt).getTime() : null;
  const now = Date.now();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  if (followUp.status === "overdue" || (dueAt !== null && dueAt < now)) {
    return "overdue";
  }

  if (followUp.status === "due" || (dueAt !== null && dueAt <= endOfToday.getTime())) {
    return "due";
  }

  return "suggested";
}

function followUpTone(status: ReturnType<typeof followUpStatus>) {
  if (status === "overdue") {
    return "error";
  }

  if (status === "due") {
    return "warning";
  }

  if (status === "done") {
    return "success";
  }

  return "info";
}

function kindLabel(followUp: FollowUpRow, status: ReturnType<typeof followUpStatus>) {
  if (status === "done") {
    return "Done";
  }

  if (status === "overdue") {
    return "High priority";
  }

  if (followUp.reason.trim()) {
    return followUp.reason;
  }

  return "Follow-up";
}

function parseFollowUpRow(record: Record<string, unknown>): FollowUpRow {
  return {
    completedAt: optionalString(record.completed_at),
    conversationId: optionalString(record.conversation_id),
    createdAt: requiredString(record.created_at),
    customerId: optionalString(record.customer_id),
    dueAt: optionalString(record.due_at),
    id: requiredString(record.id),
    orderId: optionalString(record.order_id),
    reason: requiredString(record.reason),
    status: requiredString(record.status),
    suggestedMessagePreview: optionalString(record.suggested_message_preview),
    updatedAt: requiredString(record.updated_at),
  };
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
  };
}

function parseOrderRow(record: Record<string, unknown>): OrderRow {
  return {
    id: requiredString(record.id),
    orderNumber: optionalString(record.order_number),
    paymentStatus: requiredString(record.payment_status),
    totalAmount: requiredNumber(record.total_amount),
  };
}

function parseDueAt(value: unknown):
  | { ok: true; data: Date }
  | { ok: false; response: Response } {
  if (typeof value !== "string") {
    return invalidDueAt();
  }

  const dueAt = new Date(value);

  if (Number.isNaN(dueAt.getTime())) {
    return invalidDueAt();
  }

  return { ok: true, data: dueAt };
}

function invalidDueAt() {
  return {
    ok: false as const,
    response: fail(
      "VALIDATION_INVALID_FOLLOW_UP_DUE_AT",
      "Choose a valid follow-up time.",
      400,
    ),
  };
}

function normalizeStatusFilter(value: unknown): string | null {
  if (
    value === "queued" ||
    value === "due" ||
    value === "overdue" ||
    value === "done" ||
    value === "dismissed"
  ) {
    return value;
  }

  return null;
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}

function uniqueIds(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
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

function firstName(name: string): string {
  return name.split(/\s+/).filter(Boolean)[0] ?? "there";
}

function shortDateTime(value: string): string {
  const date = new Date(value);

  return `${date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
