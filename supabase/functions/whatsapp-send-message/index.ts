import { getRouteParts, requireCommerceContext } from "../_shared/commerceContext.ts";
import {
  fail,
  handleOptions,
  isRecord,
  methodNotAllowed,
  ok,
  readJsonRecord,
} from "../_shared/http.ts";
import type { AuditContext } from "../_shared/permissions.ts";
import {
  auditWriteFailed,
  requirePermission,
  writeAuditLog,
} from "../_shared/permissions.ts";
import {
  dbRequest,
  firstRecord,
  optionalNumber,
  optionalString,
  records,
  requiredString,
  safeJsonRecord,
} from "../_shared/postgrest.ts";
import {
  getWhatsAppConfig,
  graphApiUrl,
  phoneForGraphApi,
  safeMessagePreview,
} from "../_shared/whatsapp.ts";

type CustomerRow = {
  createdAt: string;
  displayName: string;
  id: string;
  phoneE164: string | null;
};

type ConversationRow = {
  createdAt: string;
  customerId: string | null;
  id: string;
  lastMessageAt: string | null;
  metadata: Record<string, unknown>;
  status: string;
  unreadCount: number;
  updatedAt: string;
};

type MessageRow = {
  bodyPreview: string;
  createdAt: string;
  direction: "inbound" | "outbound";
  id: string;
  messageType: string;
  receivedAt: string | null;
  sentAt: string | null;
  status: string;
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

  const parts = getRouteParts(request, "whatsapp-send-message");

  if (request.method === "GET" && parts.length === 1 && parts[0] === "status") {
    return getConnectionStatus();
  }

  if (
    request.method === "GET" &&
    parts.length === 1 &&
    parts[0] === "conversations"
  ) {
    return listConversations(context.context.businessId);
  }

  if (
    request.method === "GET" &&
    parts.length === 2 &&
    parts[0] === "conversations"
  ) {
    return getConversationDetail(context.context.businessId, parts[1], true);
  }

  if (
    request.method === "POST" &&
    parts.length === 3 &&
    parts[0] === "conversations" &&
    parts[2] === "messages"
  ) {
    return sendConversationMessage(request, context.context, parts[1]);
  }

  return methodNotAllowed(["GET", "POST", "OPTIONS"]);
});

function getConnectionStatus(): Response {
  const config = getWhatsAppConfig();
  const checkedAt = new Date().toISOString();

  if (!config.ok) {
    return ok({
      status: {
        canReceive: false,
        canSend: false,
        lastCheckedAt: checkedAt,
        messageSource: "WhatsApp Cloud API",
        setupState: "needs_configuration",
        statusLabel: "Needs setup",
      },
    });
  }

  return ok({
    status: {
      businessAccountIdLast4: lastFour(config.config.businessAccountId),
      canReceive: true,
      canSend: true,
      lastCheckedAt: checkedAt,
      messageSource: "WhatsApp Cloud API",
      phoneNumberIdLast4: lastFour(config.config.phoneNumberId),
      setupState: "connected",
      statusLabel: "Connected",
    },
  });
}

async function listConversations(businessId: string): Promise<Response> {
  const conversations = await selectConversations(businessId);
  if (!conversations.ok) {
    return conversations.response;
  }

  const customers = await selectCustomersByIds(
    businessId,
    conversations.data.flatMap((conversation) =>
      conversation.customerId ? [conversation.customerId] : []
    ),
  );
  if (!customers.ok) {
    return customers.response;
  }

  const latestMessages = await selectLatestMessagesByConversation(
    businessId,
    conversations.data.map((conversation) => conversation.id),
  );
  if (!latestMessages.ok) {
    return latestMessages.response;
  }

  return ok({
    conversations: conversations.data.map((conversation) =>
      conversationListItem({
        conversation,
        customer: conversation.customerId
          ? customers.data.get(conversation.customerId) ?? null
          : null,
        latestMessage: latestMessages.data.get(conversation.id) ?? null,
      })
    ),
  });
}

async function getConversationDetail(
  businessId: string,
  conversationId: string,
  markRead: boolean,
): Promise<Response> {
  const conversation = await selectConversation(businessId, conversationId);
  if (!conversation.ok) {
    return conversation.response;
  }

  if (!conversation.data) {
    return fail(
      "WHATSAPP_CONVERSATION_NOT_FOUND",
      "This WhatsApp conversation could not be found.",
      404,
    );
  }

  if (markRead && conversation.data.unreadCount > 0) {
    const read = await markConversationRead(businessId, conversation.data.id);
    if (!read.ok) {
      return read.response;
    }
    conversation.data.unreadCount = 0;
  }

  const customer = conversation.data.customerId
    ? await selectCustomer(businessId, conversation.data.customerId)
    : { ok: true as const, data: null };
  if (!customer.ok) {
    return customer.response;
  }

  const messages = await selectConversationMessages(businessId, conversation.data.id);
  if (!messages.ok) {
    return messages.response;
  }

  return ok({
    conversation: conversationDetail({
      conversation: conversation.data,
      customer: customer.data,
      messages: messages.data,
    }),
  });
}

async function sendConversationMessage(
  request: Request,
  context: AuditContext,
  conversationId: string,
): Promise<Response> {
  const permission = await requirePermission(
    context,
    "whatsapp.send",
    request,
    {
      endpoint: "whatsapp-send-message/conversations/messages",
      entityId: conversationId,
      entityType: "whatsapp_message",
    },
  );
  if (!permission.ok) {
    return permission.response;
  }

  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const messageBody = outboundMessageText(body.data.body);
  if (!messageBody.ok) {
    return messageBody.response;
  }

  const config = getWhatsAppConfig();
  if (!config.ok) {
    return config.response;
  }

  const conversation = await selectConversation(context.businessId, conversationId);
  if (!conversation.ok) {
    return conversation.response;
  }

  if (!conversation.data) {
    return fail(
      "WHATSAPP_CONVERSATION_NOT_FOUND",
      "This WhatsApp conversation could not be found.",
      404,
    );
  }

  const customer = conversation.data.customerId
    ? await selectCustomer(context.businessId, conversation.data.customerId)
    : { ok: true as const, data: null };
  if (!customer.ok) {
    return customer.response;
  }

  if (!customer.data?.phoneE164) {
    return fail(
      "WHATSAPP_CUSTOMER_PHONE_MISSING",
      "This customer does not have a WhatsApp phone number Neo can send to.",
      409,
    );
  }

  const sentAt = new Date().toISOString();
  const graphResponse = await sendViaGraphApi({
    accessToken: config.config.accessToken,
    body: messageBody.data,
    phoneNumberId: config.config.phoneNumberId,
    toPhoneE164: customer.data.phoneE164,
    url: graphApiUrl(config.config, `${config.config.phoneNumberId}/messages`),
  });

  if (!graphResponse.ok) {
    await writeAuditLog(context, {
      action: "whatsapp.send_attempted",
      entityId: conversation.data.id,
      entityType: "whatsapp_message",
      metadata: {
        endpoint: "whatsapp-send-message",
        permission: "whatsapp.send",
        result: "failed",
      },
      request,
    });

    return graphResponse.response;
  }

  const preview = safeMessagePreview(messageBody.data);
  const inserted = await dbRequest(
    "/rest/v1/whatsapp_messages?select=id",
    {
      body: {
        body_preview: preview,
        business_id: context.businessId,
        conversation_id: conversation.data.id,
        customer_id: customer.data.id,
        direction: "outbound",
        external_message_id: graphResponse.data.externalMessageId,
        message_type: "text",
        metadata: {
          source: "meta_whatsapp",
        },
        sender_kind: "business",
        sent_at: sentAt,
        status: "sent",
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => requiredString(requiredFirst(value).id),
  );
  if (!inserted.ok) {
    return inserted.response;
  }

  const updated = await updateConversationAfterOutbound({
    businessId: context.businessId,
    conversationId: conversation.data.id,
    latestPreview: preview,
    sentAt,
  });
  if (!updated.ok) {
    return updated.response;
  }

  const audit = await writeAuditLog(context, {
    action: "whatsapp.send_attempted",
    entityId: inserted.data,
    entityType: "whatsapp_message",
    metadata: {
      endpoint: "whatsapp-send-message",
      permission: "whatsapp.send",
      result: "sent",
    },
    request,
  });
  if (!audit.ok) {
    return auditWriteFailed();
  }

  return getConversationDetail(context.businessId, conversation.data.id, false);
}

async function sendViaGraphApi({
  accessToken,
  body,
  phoneNumberId,
  toPhoneE164,
  url,
}: {
  accessToken: string;
  body: string;
  phoneNumberId: string;
  toPhoneE164: string;
  url: string;
}): Promise<
  | { ok: true; data: { externalMessageId: string | null } }
  | { ok: false; response: Response }
> {
  const response = await fetch(url, {
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      text: {
        body,
        preview_url: false,
      },
      to: phoneForGraphApi(toPhoneE164),
      type: "text",
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const responseBody = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return {
      ok: false,
      response: fail(
        "WHATSAPP_SEND_FAILED",
        "Neo could not send this WhatsApp message. Try again before relying on the follow-up.",
        502,
        { provider: "meta_whatsapp" },
      ),
    };
  }

  return {
    ok: true,
    data: {
      externalMessageId: graphMessageId(responseBody, phoneNumberId),
    },
  };
}

async function selectConversations(
  businessId: string,
): Promise<
  | { ok: true; data: ConversationRow[] }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/whatsapp_conversations?business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,customer_id,status,last_message_at,unread_count,metadata,created_at,updated_at" +
      "&order=last_message_at.desc.nullslast&order=updated_at.desc&limit=50",
    { method: "GET" },
    (value) => records(value).map(parseConversationRow),
  );
}

async function selectConversation(
  businessId: string,
  conversationId: string,
): Promise<
  | { ok: true; data: ConversationRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/whatsapp_conversations?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=eq.${encodeURIComponent(conversationId)}` +
      "&select=id,customer_id,status,last_message_at,unread_count,metadata,created_at,updated_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseConversationRow(record) : null;
    },
  );
}

async function selectCustomer(
  businessId: string,
  customerId: string,
): Promise<
  | { ok: true; data: CustomerRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/customers?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=eq.${encodeURIComponent(customerId)}` +
      "&select=id,display_name,phone_e164,created_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseCustomerRow(record) : null;
    },
  );
}

async function selectCustomersByIds(
  businessId: string,
  customerIds: readonly string[],
): Promise<
  | { ok: true; data: Map<string, CustomerRow> }
  | { ok: false; response: Response }
> {
  const uniqueIds = [...new Set(customerIds)].filter(Boolean);
  if (uniqueIds.length === 0) {
    return { ok: true, data: new Map() };
  }

  return dbRequest(
    `/rest/v1/customers?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=in.(${uniqueIds.map(encodeURIComponent).join(",")})` +
      "&select=id,display_name,phone_e164,created_at",
    { method: "GET" },
    (value) =>
      new Map(records(value).map((record) => {
        const customer = parseCustomerRow(record);
        return [customer.id, customer];
      })),
  );
}

async function selectLatestMessagesByConversation(
  businessId: string,
  conversationIds: readonly string[],
): Promise<
  | { ok: true; data: Map<string, MessageRow> }
  | { ok: false; response: Response }
> {
  if (conversationIds.length === 0) {
    return { ok: true, data: new Map() };
  }

  return dbRequest(
    `/rest/v1/whatsapp_messages?business_id=eq.${encodeURIComponent(businessId)}` +
      `&conversation_id=in.(${conversationIds.map(encodeURIComponent).join(",")})` +
      "&select=id,conversation_id,body_preview,direction,message_type,status,sent_at,received_at,created_at" +
      "&order=created_at.desc&limit=200",
    { method: "GET" },
    (value) => {
      const messageMap = new Map<string, MessageRow>();

      for (const record of records(value)) {
        const conversationId = requiredString(record.conversation_id);
        if (!messageMap.has(conversationId)) {
          messageMap.set(conversationId, parseMessageRow(record));
        }
      }

      return messageMap;
    },
  );
}

async function selectConversationMessages(
  businessId: string,
  conversationId: string,
): Promise<
  | { ok: true; data: MessageRow[] }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/whatsapp_messages?business_id=eq.${encodeURIComponent(businessId)}` +
      `&conversation_id=eq.${encodeURIComponent(conversationId)}` +
      "&select=id,body_preview,direction,message_type,status,sent_at,received_at,created_at" +
      "&order=created_at.asc&limit=100",
    { method: "GET" },
    (value) => records(value).map(parseMessageRow),
  );
}

async function markConversationRead(
  businessId: string,
  conversationId: string,
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const updated = await dbRequest(
    `/rest/v1/whatsapp_conversations?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=eq.${encodeURIComponent(conversationId)}&select=id`,
    {
      body: {
        unread_count: 0,
        updated_at: new Date().toISOString(),
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => requiredString(requiredFirst(value).id),
  );

  if (!updated.ok) {
    return updated;
  }

  return { ok: true };
}

async function updateConversationAfterOutbound({
  businessId,
  conversationId,
  latestPreview,
  sentAt,
}: {
  businessId: string;
  conversationId: string;
  latestPreview: string;
  sentAt: string;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const updated = await dbRequest(
    `/rest/v1/whatsapp_conversations?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=eq.${encodeURIComponent(conversationId)}&select=id`,
    {
      body: {
        last_message_at: sentAt,
        metadata: {
          latest_preview: latestPreview,
        },
        updated_at: sentAt,
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => requiredString(requiredFirst(value).id),
  );

  if (!updated.ok) {
    return updated;
  }

  return { ok: true };
}

function conversationListItem({
  conversation,
  customer,
  latestMessage,
}: {
  conversation: ConversationRow;
  customer: CustomerRow | null;
  latestMessage: MessageRow | null;
}): Record<string, unknown> {
  const customerName = customer?.displayName ?? "WhatsApp customer";
  const unreadCount = conversation.unreadCount;
  const latestSnippet =
    latestMessage?.bodyPreview ||
    optionalString(conversation.metadata.latest_preview) ||
    "No messages yet";

  return {
    assignmentLabel: "Unassigned",
    customerId: customer?.id ?? null,
    customerInitials: initials(customerName),
    customerName,
    id: conversation.id,
    labels: conversationLabels(conversation, latestMessage),
    latestSnippet,
    lastMessageAt: conversation.lastMessageAt,
    presenceTone: unreadCount > 0 ? "urgent" : "idle",
    statusLabel: statusLabel(conversation.status),
    statusTone: conversation.status === "open" ? "success" : "neutral",
    timestamp: timeLabel(
      latestMessage?.receivedAt ??
        latestMessage?.sentAt ??
        conversation.lastMessageAt ??
        conversation.updatedAt,
    ),
    unreadCount,
  };
}

function conversationDetail({
  conversation,
  customer,
  messages,
}: {
  conversation: ConversationRow;
  customer: CustomerRow | null;
  messages: readonly MessageRow[];
}): Record<string, unknown> {
  const customerName = customer?.displayName ?? "WhatsApp customer";

  return {
    aiDraft: null,
    assignmentLabel: "Unassigned",
    chips: [
      { label: "WhatsApp connected", tone: "success" },
      { label: statusLabel(conversation.status), tone: "neutral" },
      { label: "Unassigned", tone: "neutral" },
    ],
    contextItems: [
      {
        detail: messages.length > 0 ? `${messages.length} message(s)` : "No messages yet",
        meta: "Live WhatsApp thread",
        title: "Conversation",
      },
      {
        detail: customer?.phoneE164 ? "Phone saved" : "Phone missing",
        meta: "Stored on the server",
        title: "Customer",
      },
      {
        detail: "Human approval required",
        meta: "Neo sends only from approved actions",
        title: "Guardrail",
      },
    ],
    customerId: customer?.id ?? conversation.id,
    customerInitials: initials(customerName),
    customerName,
    emptyNote:
      "Messages from WhatsApp will appear here after customers write to your connected business number.",
    id: conversation.id,
    messages: messages.map((message) => ({
      body: message.bodyPreview || messageTypeLabel(message.messageType),
      id: message.id,
      kind: message.messageType === "image" ? "receipt" : "text",
      sender: message.direction === "outbound" ? "staff" : "customer",
      status: message.status,
      time: timeLabel(message.receivedAt ?? message.sentAt ?? message.createdAt),
    })),
    statusLabel: statusLabel(conversation.status),
    subtitle: customer?.createdAt ? `Customer since ${dateLabel(customer.createdAt)}` : "WhatsApp customer",
    summary: [
      {
        detail: customer?.phoneE164 ? "Phone saved" : "No phone saved",
        meta: "Server-side customer record",
        title: "Customer",
      },
      {
        detail: conversation.lastMessageAt ? timeLabel(conversation.lastMessageAt) : "No activity yet",
        meta: "Last WhatsApp activity",
        title: "Latest",
      },
      {
        detail: String(conversation.unreadCount),
        meta: "Unread messages",
        title: "Inbox",
      },
    ],
  };
}

function conversationLabels(
  conversation: ConversationRow,
  latestMessage: MessageRow | null,
): readonly Record<string, string>[] {
  const labels: Record<string, string>[] = [
    { text: statusLabel(conversation.status), tone: "success" },
  ];

  if (conversation.unreadCount > 0) {
    labels.unshift({ text: "Unread", tone: "error" });
  }

  if (latestMessage?.messageType && latestMessage.messageType !== "text") {
    labels.push({
      text: messageTypeLabel(latestMessage.messageType),
      tone: "neutral",
    });
  }

  return labels;
}

function parseConversationRow(record: Record<string, unknown>): ConversationRow {
  return {
    createdAt: requiredString(record.created_at),
    customerId: optionalString(record.customer_id),
    id: requiredString(record.id),
    lastMessageAt: optionalString(record.last_message_at),
    metadata: safeJsonRecord(record.metadata),
    status: requiredString(record.status),
    unreadCount: optionalNumber(record.unread_count) ?? 0,
    updatedAt: requiredString(record.updated_at),
  };
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    createdAt: requiredString(record.created_at),
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
    phoneE164: optionalString(record.phone_e164),
  };
}

function parseMessageRow(record: Record<string, unknown>): MessageRow {
  const direction = requiredString(record.direction);

  return {
    bodyPreview: optionalString(record.body_preview) ?? "",
    createdAt: requiredString(record.created_at),
    direction: direction === "outbound" ? "outbound" : "inbound",
    id: requiredString(record.id),
    messageType: requiredString(record.message_type),
    receivedAt: optionalString(record.received_at),
    sentAt: optionalString(record.sent_at),
    status: requiredString(record.status),
  };
}

function outboundMessageText(value: unknown):
  | { ok: true; data: string }
  | { ok: false; response: Response } {
  if (typeof value !== "string") {
    return {
      ok: false,
      response: fail(
        "VALIDATION_MESSAGE_REQUIRED",
        "Enter a WhatsApp message before sending.",
        400,
      ),
    };
  }

  const trimmed = value.replace(/\s+/g, " ").trim();

  if (!trimmed) {
    return {
      ok: false,
      response: fail(
        "VALIDATION_MESSAGE_REQUIRED",
        "Enter a WhatsApp message before sending.",
        400,
      ),
    };
  }

  if (trimmed.length > 1000) {
    return {
      ok: false,
      response: fail(
        "VALIDATION_MESSAGE_TOO_LONG",
        "Keep WhatsApp replies under 1,000 characters for this MVP.",
        400,
      ),
    };
  }

  return { ok: true, data: trimmed };
}

function graphMessageId(
  value: unknown,
  phoneNumberId: string,
): string | null {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    return null;
  }

  const firstMessage = value.messages[0] as unknown;
  if (!isRecord(firstMessage)) {
    return null;
  }

  return optionalString(firstMessage.id) ?? `sent-${lastFour(phoneNumberId)}-${Date.now()}`;
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}

function initials(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const value = `${parts[0]?.[0] ?? "W"}${parts[1]?.[0] ?? ""}`;

  return value.toUpperCase();
}

function statusLabel(status: string): string {
  if (status === "closed") {
    return "Closed";
  }

  if (status === "archived") {
    return "Archived";
  }

  return "Open";
}

function messageTypeLabel(messageType: string): string {
  if (messageType === "image") {
    return "Image received";
  }

  if (messageType === "audio") {
    return "Voice note received";
  }

  if (messageType === "document") {
    return "Document received";
  }

  return "WhatsApp message";
}

function timeLabel(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();
  const sameDate =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDate) {
    return new Intl.DateTimeFormat("en-NG", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function dateLabel(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function lastFour(value: string): string {
  return value.slice(-4);
}
