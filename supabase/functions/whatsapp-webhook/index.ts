import {
  fail,
  handleOptions,
  isRecord,
  methodNotAllowed,
  ok,
} from "../_shared/http.ts";
import {
  dbRequest,
  firstRecord,
  optionalNumber,
  optionalString,
  records,
  requiredString,
} from "../_shared/postgrest.ts";
import {
  getWhatsAppConfig,
  normalizeWhatsAppPhone,
  redactWebhookPayload,
  safeMessagePreview,
  verifyMetaSignature,
  verifyWebhookChallenge,
} from "../_shared/whatsapp.ts";

type BusinessRow = {
  id: string;
};

type CustomerRow = {
  id: string;
  displayName: string;
};

type ConversationRow = {
  id: string;
  unreadCount: number;
};

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request);
  if (optionsResponse) {
    return optionsResponse;
  }

  const config = getWhatsAppConfig();
  if (!config.ok) {
    return config.response;
  }

  if (request.method === "GET") {
    const challenge = verifyWebhookChallenge(request.url, config.config.verifyToken);

    if (!challenge) {
      return fail(
        "WHATSAPP_WEBHOOK_VERIFY_FAILED",
        "WhatsApp webhook verification failed.",
        403,
      );
    }

    return new Response(challenge, {
      headers: { "Content-Type": "text/plain" },
      status: 200,
    });
  }

  if (request.method !== "POST") {
    return methodNotAllowed(["GET", "POST", "OPTIONS"]);
  }

  const rawBody = await request.text();
  const signatureValid = await verifyMetaSignature({
    appSecret: config.config.appSecret,
    rawBody,
    signatureHeader: request.headers.get("x-hub-signature-256"),
  });

  if (!signatureValid) {
    return fail(
      "WHATSAPP_WEBHOOK_SIGNATURE_INVALID",
      "WhatsApp webhook signature could not be verified.",
      401,
    );
  }

  const payload = parseJsonRecord(rawBody);
  if (!payload) {
    return fail("VALIDATION_INVALID_JSON", "Send a valid JSON payload.", 400);
  }

  const business = await selectDefaultBusiness();
  if (!business.ok) {
    return business.response;
  }

  const storedEvent = await storeWebhookEvent({
    businessId: business.data?.id ?? null,
    eventId: firstWebhookEventId(payload),
    eventType: "messages",
    payload,
  });
  if (!storedEvent.ok) {
    return storedEvent.response;
  }

  if (business.data) {
    const processed = await processWebhookMessages(payload, business.data.id);
    if (!processed.ok) {
      return processed.response;
    }
  }

  return ok({ received: true });
});

async function processWebhookMessages(
  payload: Record<string, unknown>,
  businessId: string,
): Promise<{ ok: true } | { ok: false; response: Response }> {
  for (const changeValue of webhookChangeValues(payload)) {
    for (const message of webhookMessages(changeValue)) {
      const processed = await processInboundMessage({
        businessId,
        contactName: contactNameForMessage(changeValue, message.from),
        fromWaId: message.from,
        message,
      });

      if (!processed.ok) {
        return processed;
      }
    }

    for (const status of webhookStatuses(changeValue)) {
      const updated = await updateMessageStatus({
        businessId,
        externalMessageId: status.id,
        status: status.status,
      });

      if (!updated.ok) {
        return updated;
      }
    }
  }

  return { ok: true };
}

async function processInboundMessage({
  businessId,
  contactName,
  fromWaId,
  message,
}: {
  businessId: string;
  contactName: string | null;
  fromWaId: string;
  message: WebhookMessage;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const phoneE164 = normalizeWhatsAppPhone(fromWaId);
  if (!phoneE164) {
    return { ok: true };
  }

  const customer = await findOrCreateCustomer({
    businessId,
    displayName: contactName ?? "WhatsApp customer",
    phoneE164,
    whatsappProfileId: fromWaId,
  });
  if (!customer.ok) {
    return customer;
  }

  const conversation = await findOrCreateConversation({
    businessId,
    customerId: customer.data.id,
    externalThreadId: fromWaId,
  });
  if (!conversation.ok) {
    return conversation;
  }

  const receivedAt = timestampToIso(message.timestamp) ?? new Date().toISOString();
  const preview = messagePreview(message);
  const inserted = await dbRequest(
    "/rest/v1/whatsapp_messages?select=id",
    {
      body: {
        body_preview: preview,
        business_id: businessId,
        conversation_id: conversation.data.id,
        customer_id: customer.data.id,
        direction: "inbound",
        external_message_id: message.id,
        message_type: message.type,
        metadata: {
          source: "meta_whatsapp",
          type: message.type,
        },
        received_at: receivedAt,
        sender_kind: "customer",
        status: "received",
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => requiredString(requiredFirst(value).id),
  );

  if (!inserted.ok) {
    return inserted;
  }

  const updated = await updateConversationAfterInbound({
    businessId,
    conversation: conversation.data,
    lastMessageAt: receivedAt,
    latestPreview: preview,
  });

  if (!updated.ok) {
    return updated;
  }

  return { ok: true };
}

async function findOrCreateCustomer({
  businessId,
  displayName,
  phoneE164,
  whatsappProfileId,
}: {
  businessId: string;
  displayName: string;
  phoneE164: string;
  whatsappProfileId: string;
}): Promise<
  | { ok: true; data: CustomerRow }
  | { ok: false; response: Response }
> {
  const existing = await dbRequest(
    `/rest/v1/customers?business_id=eq.${encodeURIComponent(businessId)}` +
      `&phone_e164=eq.${encodeURIComponent(phoneE164)}` +
      "&select=id,display_name&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseCustomerRow(record) : null;
    },
  );
  if (!existing.ok) {
    return existing;
  }

  if (existing.data) {
    return { ok: true, data: existing.data };
  }

  return dbRequest(
    "/rest/v1/customers?select=id,display_name",
    {
      body: {
        business_id: businessId,
        display_name: displayName,
        phone_e164: phoneE164,
        whatsapp_profile_id: whatsappProfileId,
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => parseCustomerRow(requiredFirst(value)),
  );
}

async function findOrCreateConversation({
  businessId,
  customerId,
  externalThreadId,
}: {
  businessId: string;
  customerId: string;
  externalThreadId: string;
}): Promise<
  | { ok: true; data: ConversationRow }
  | { ok: false; response: Response }
> {
  const existing = await dbRequest(
    `/rest/v1/whatsapp_conversations?business_id=eq.${encodeURIComponent(businessId)}` +
      `&external_thread_id=eq.${encodeURIComponent(externalThreadId)}` +
      "&select=id,unread_count&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseConversationRow(record) : null;
    },
  );
  if (!existing.ok) {
    return existing;
  }

  if (existing.data) {
    return { ok: true, data: existing.data };
  }

  return dbRequest(
    "/rest/v1/whatsapp_conversations?select=id,unread_count",
    {
      body: {
        business_id: businessId,
        customer_id: customerId,
        external_thread_id: externalThreadId,
        status: "open",
        unread_count: 0,
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => parseConversationRow(requiredFirst(value)),
  );
}

async function updateConversationAfterInbound({
  businessId,
  conversation,
  lastMessageAt,
  latestPreview,
}: {
  businessId: string;
  conversation: ConversationRow;
  lastMessageAt: string;
  latestPreview: string;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const updated = await dbRequest(
    `/rest/v1/whatsapp_conversations?id=eq.${encodeURIComponent(conversation.id)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}&select=id`,
    {
      body: {
        last_message_at: lastMessageAt,
        metadata: {
          latest_preview: latestPreview,
        },
        unread_count: conversation.unreadCount + 1,
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

async function updateMessageStatus({
  businessId,
  externalMessageId,
  status,
}: {
  businessId: string;
  externalMessageId: string;
  status: string;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const updated = await dbRequest(
    `/rest/v1/whatsapp_messages?business_id=eq.${encodeURIComponent(businessId)}` +
      `&external_message_id=eq.${encodeURIComponent(externalMessageId)}` +
      "&select=id",
    {
      body: {
        status,
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    records,
  );

  if (!updated.ok) {
    return updated;
  }

  return { ok: true };
}

async function selectDefaultBusiness(): Promise<
  | { ok: true; data: BusinessRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    "/rest/v1/businesses?select=id&order=created_at.asc&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? { id: requiredString(record.id) } : null;
    },
  );
}

async function storeWebhookEvent({
  businessId,
  eventId,
  eventType,
  payload,
}: {
  businessId: string | null;
  eventId: string | null;
  eventType: string;
  payload: Record<string, unknown>;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const stored = await dbRequest(
    "/rest/v1/raw_webhook_events?select=id",
    {
      body: {
        business_id: businessId,
        event_type: eventType,
        external_event_id: eventId,
        payload: redactWebhookPayload(payload),
        processed_at: new Date().toISOString(),
        provider: "meta_whatsapp",
        verification_status: "verified",
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => requiredString(requiredFirst(value).id),
  );

  if (!stored.ok) {
    return stored;
  }

  return { ok: true };
}

function webhookChangeValues(payload: Record<string, unknown>): Record<string, unknown>[] {
  const entries = Array.isArray(payload.entry) ? payload.entry : [];
  const values: Record<string, unknown>[] = [];

  for (const entry of entries) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) {
      continue;
    }

    for (const change of entry.changes) {
      if (isRecord(change.value)) {
        values.push(change.value);
      }
    }
  }

  return values;
}

type WebhookMessage = {
  from: string;
  id: string;
  textBody: string | null;
  timestamp: string | null;
  type: string;
};

type WebhookStatus = {
  id: string;
  status: string;
};

function webhookMessages(changeValue: Record<string, unknown>): WebhookMessage[] {
  const messages = Array.isArray(changeValue.messages) ? changeValue.messages : [];

  return messages.flatMap((message) => {
    if (!isRecord(message)) {
      return [];
    }

    const id = optionalString(message.id);
    const from = optionalString(message.from);
    const type = optionalString(message.type) ?? "unknown";

    if (!id || !from) {
      return [];
    }

    return [{
      from,
      id,
      textBody: textBodyFromMessage(message),
      timestamp: optionalString(message.timestamp),
      type,
    }];
  });
}

function webhookStatuses(changeValue: Record<string, unknown>): WebhookStatus[] {
  const statuses = Array.isArray(changeValue.statuses) ? changeValue.statuses : [];

  return statuses.flatMap((status) => {
    if (!isRecord(status)) {
      return [];
    }

    const id = optionalString(status.id);
    const value = optionalString(status.status);

    return id && value ? [{ id, status: value }] : [];
  });
}

function contactNameForMessage(
  changeValue: Record<string, unknown>,
  fromWaId: string,
): string | null {
  const contacts = Array.isArray(changeValue.contacts) ? changeValue.contacts : [];

  for (const contact of contacts) {
    if (!isRecord(contact) || contact.wa_id !== fromWaId) {
      continue;
    }

    const profile = isRecord(contact.profile) ? contact.profile : {};
    const name = optionalString(profile.name);

    return name?.trim() || null;
  }

  return null;
}

function textBodyFromMessage(message: Record<string, unknown>): string | null {
  const text = isRecord(message.text) ? message.text : {};

  return optionalString(text.body);
}

function messagePreview(message: WebhookMessage): string {
  if (message.textBody) {
    return safeMessagePreview(message.textBody);
  }

  if (message.type === "image") {
    return "Image received";
  }

  if (message.type === "document") {
    return "Document received";
  }

  if (message.type === "audio") {
    return "Voice note received";
  }

  return "WhatsApp message received";
}

function firstWebhookEventId(payload: Record<string, unknown>): string | null {
  for (const value of webhookChangeValues(payload)) {
    const messageId = webhookMessages(value)[0]?.id;
    if (messageId) {
      return messageId;
    }

    const statusId = webhookStatuses(value)[0]?.id;
    if (statusId) {
      return statusId;
    }
  }

  return null;
}

function timestampToIso(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const seconds = optionalNumber(Number(value));

  if (seconds === null) {
    return null;
  }

  return new Date(seconds * 1000).toISOString();
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
  };
}

function parseConversationRow(record: Record<string, unknown>): ConversationRow {
  return {
    id: requiredString(record.id),
    unreadCount: optionalNumber(record.unread_count) ?? 0,
  };
}

function parseJsonRecord(rawBody: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(rawBody) as unknown;

    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}
