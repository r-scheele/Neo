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
  safeJsonArray,
  safeJsonRecord,
} from "../_shared/postgrest.ts";

type CustomerRow = {
  id: string;
  displayName: string;
  phoneE164: string | null;
  tags: string[];
  notesSummary: string | null;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  orderNumber: string | null;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
};

type FollowUpRow = {
  id: string;
  status: string;
  dueAt: string | null;
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

  const parts = getRouteParts(request, "customers");

  if (request.method === "GET" && parts.length === 1) {
    return getCustomerDetail(parts[0], context.context.businessId);
  }

  if (request.method === "GET" && parts.length === 0) {
    return listCustomers(request, context.context.businessId);
  }

  if (request.method === "POST" && parts.length === 0) {
    return createCustomer(request, context.context.businessId);
  }

  return methodNotAllowed(["GET", "POST", "OPTIONS"]);
});

async function getCustomerDetail(
  customerId: string,
  businessId: string,
): Promise<Response> {
  const customer = await selectCustomer(customerId, businessId);
  if (!customer.ok) {
    return customer.response;
  }

  if (!customer.data) {
    return fail("CUSTOMER_NOT_FOUND", "This customer could not be found.", 404);
  }

  const orders = await selectCustomerOrders(customer.data.id, businessId);
  if (!orders.ok) {
    return orders.response;
  }

  const followUps = await selectCustomerFollowUps(customer.data.id, businessId);
  if (!followUps.ok) {
    return followUps.response;
  }

  return ok({
    customer: customerDetailDto(customer.data, orders.data, followUps.data),
  });
}

async function listCustomers(request: Request, businessId: string): Promise<Response> {
  const search = new URL(request.url).searchParams.get("search")?.trim();
  const filters = [
    `business_id=eq.${encodeURIComponent(businessId)}`,
    "select=id,display_name,phone_e164,tags,notes_summary,preferences,created_at,updated_at",
    "order=updated_at.desc",
    "limit=50",
  ];

  if (search) {
    filters.push(`display_name=ilike.*${encodeURIComponent(search)}*`);
  }

  const customers = await dbRequest(
    `/rest/v1/customers?${filters.join("&")}`,
    { method: "GET" },
    (value) => records(value).map(parseCustomerRow),
  );

  if (!customers.ok) {
    return customers.response;
  }

  return ok({
    customers: customers.data.map((customer) => ({
      displayName: customer.displayName,
      id: customer.id,
      updatedAt: customer.updatedAt,
    })),
  });
}

async function createCustomer(
  request: Request,
  businessId: string,
): Promise<Response> {
  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const displayName = textOrNull(body.data.displayName);
  if (!displayName) {
    return fail(
      "VALIDATION_CUSTOMER_NAME_REQUIRED",
      "Enter the customer's name.",
      400,
    );
  }

  const customer = await dbRequest(
    "/rest/v1/customers?select=id,display_name,phone_e164,tags,notes_summary,preferences,created_at,updated_at",
    {
      body: {
        business_id: businessId,
        display_name: displayName,
        notes_summary: textOrNull(body.data.notesSummary),
        phone_e164: textOrNull(body.data.phoneE164),
        preferences: isRecord(body.data.preferences) ? body.data.preferences : {},
        tags: Array.isArray(body.data.tags)
          ? body.data.tags.filter((tag) => typeof tag === "string")
          : [],
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => parseCustomerRow(requiredFirst(value)),
  );

  if (!customer.ok) {
    return customer.response;
  }

  return ok({ customer: customerDetailDto(customer.data, [], []) }, 201);
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
      "&select=id,display_name,phone_e164,tags,notes_summary,preferences,created_at,updated_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseCustomerRow(record) : null;
    },
  );
}

async function selectCustomerOrders(
  customerId: string,
  businessId: string,
): Promise<
  | { ok: true; data: OrderRow[] }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/orders?customer_id=eq.${encodeURIComponent(customerId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,order_number,payment_status,total_amount,created_at" +
      "&order=created_at.desc&limit=20",
    { method: "GET" },
    (value) => records(value).map(parseOrderRow),
  );
}

async function selectCustomerFollowUps(
  customerId: string,
  businessId: string,
): Promise<
  | { ok: true; data: FollowUpRow[] }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/follow_ups?customer_id=eq.${encodeURIComponent(customerId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,status,due_at&order=created_at.desc&limit=20",
    { method: "GET" },
    (value) => records(value).map(parseFollowUpRow),
  );
}

function customerDetailDto(
  customer: CustomerRow,
  orders: OrderRow[],
  followUps: FollowUpRow[],
) {
  const totalSpend = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((total, order) => total + order.totalAmount, 0);
  const outstanding = orders
    .filter((order) => order.paymentStatus !== "paid")
    .reduce((total, order) => total + order.totalAmount, 0);
  const latestOrder = orders[0] ?? null;
  const nextFollowUp = followUps.find((followUp) => followUp.status !== "done");
  const deliveryArea = optionalString(customer.preferences.deliveryArea) ?? "Not set";

  return {
    activity: [
      ...orders.slice(0, 3).map((order) => ({
        detail: `${displayOrderId(order)} - ${order.paymentStatus}`,
        id: `order-${order.id}`,
        timeLabel: shortDate(order.createdAt),
        title: "Order recorded",
        tone: order.paymentStatus === "paid" ? "success" : "warning",
      })),
      ...followUps.slice(0, 2).map((followUp) => ({
        detail: followUp.dueAt ? shortDate(followUp.dueAt) : "No due date",
        id: `follow-up-${followUp.id}`,
        timeLabel: followUp.dueAt ? shortDate(followUp.dueAt) : "Open",
        title: `Follow-up ${followUp.status}`,
        tone: followUp.status === "done" ? "success" : "info",
      })),
    ],
    avatarTone: outstanding > 0 ? "warning" : "success",
    conversationId: "backend-customer",
    customerInitials: initials(customer.displayName),
    customerName: customer.displayName,
    customerSince: shortMonthYear(customer.createdAt),
    id: customer.id,
    latestOrderHref: latestOrder ? `/order/${latestOrder.id}` : "/order/new",
    locationLabel: deliveryArea,
    metrics: {
      lastOrder: latestOrder
        ? {
            amount: latestOrder.totalAmount,
            dateLabel: shortDate(latestOrder.createdAt),
            status: statusForOrder(latestOrder.paymentStatus),
          }
        : null,
      nextFollowUp: nextFollowUp?.dueAt ? shortDate(nextFollowUp.dueAt) : "None due",
      outstandingAmount: outstanding,
      totalSpend,
    },
    notes: customer.notesSummary
      ? [
          {
            authorLabel: "Backend",
            body: customer.notesSummary,
            dateLabel: shortDate(customer.updatedAt),
            id: `${customer.id}-note`,
            visibilityLabel: "Internal note",
          },
        ]
      : [],
    orderCount: orders.length,
    orders: orders.map((order) => ({
      amount: order.totalAmount,
      dateLabel: shortDate(order.createdAt),
      href: `/order/${order.id}`,
      id: displayOrderId(order),
      itemCountLabel: "Backend order",
      status: statusForOrder(order.paymentStatus),
    })),
    preferences: {
      deliveryArea,
      favoriteCategories: preferenceText(customer.preferences.favoriteCategories),
      paymentTime: "Needs more history",
    },
    primaryPreference: preferenceText(customer.preferences.primaryPreference),
    statusLabel: orders.length > 0 ? "Active customer" : "New customer",
    statusTone: outstanding > 0 ? "warning" : "success",
  };
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    createdAt: requiredString(record.created_at),
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
    notesSummary: optionalString(record.notes_summary),
    phoneE164: optionalString(record.phone_e164),
    preferences: safeJsonRecord(record.preferences),
    tags: safeJsonArray(record.tags).filter((tag): tag is string => typeof tag === "string"),
    updatedAt: requiredString(record.updated_at),
  };
}

function parseOrderRow(record: Record<string, unknown>): OrderRow {
  return {
    createdAt: requiredString(record.created_at),
    id: requiredString(record.id),
    orderNumber: optionalString(record.order_number),
    paymentStatus: requiredString(record.payment_status),
    totalAmount: requiredNumber(record.total_amount),
  };
}

function parseFollowUpRow(record: Record<string, unknown>): FollowUpRow {
  return {
    dueAt: optionalString(record.due_at),
    id: requiredString(record.id),
    status: requiredString(record.status),
  };
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}

function displayOrderId(order: OrderRow): string {
  return order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}`;
}

function statusForOrder(status: string) {
  if (status === "paid") {
    return "paid";
  }

  if (status === "awaiting_receipt" || status === "receipt_review") {
    return "review";
  }

  return "unpaid";
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";
}

function preferenceText(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "Not known yet";
}

function shortDate(value: string): string {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shortMonthYear(value: string): string {
  return new Date(value).toLocaleDateString("en-NG", {
    month: "short",
    year: "numeric",
  });
}

function textOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
