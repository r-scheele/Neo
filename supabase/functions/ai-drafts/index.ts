import { getRouteParts, requireCommerceContext } from "../_shared/commerceContext.ts";
import {
  confidenceBand,
  classifyDraftRouting,
  normalizeConfidence,
  normalizeRiskCategory,
  parseAiDraftPreferences,
  safeDraftPreview,
  type AiDraftPreferences,
  type AiDraftRiskCategory,
} from "../_shared/aiDraft.ts";
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
  optionalString,
  records,
  requiredString,
  safeJsonArray,
  safeJsonRecord,
} from "../_shared/postgrest.ts";
import { auditWriteFailed, writeAuditLog } from "../_shared/permissions.ts";
import type { AuditContext } from "../_shared/permissions.ts";

type ConversationRow = {
  customerId: string | null;
  id: string;
  lastMessageAt: string | null;
  status: string;
};

type CustomerRow = {
  displayName: string;
  id: string;
};

type MessageContext = {
  direction: "customer" | "business";
  messageType: string;
  preview: string;
};

type GeneratedDraft = {
  confidence: number;
  draftText: string;
  riskCategory: AiDraftRiskCategory;
  riskReasons: readonly string[];
  suggestedAction: "approval_required" | "edit_first" | "send_after_review" | "takeover";
};

type AiDraftRow = {
  approvalId: string | null;
  confidenceBand: "high" | "low" | "medium";
  conversationId: string;
  createdAt: string;
  draftText: string;
  id: string;
  riskReasons: readonly string[];
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

  const parts = getRouteParts(request, "ai-drafts");

  if (
    request.method === "POST" &&
    parts.length === 2 &&
    parts[0] === "conversations"
  ) {
    return createConversationDraft(request, context.context, parts[1]);
  }

  return methodNotAllowed(["POST", "OPTIONS"]);
});

async function createConversationDraft(
  request: Request,
  context: AuditContext,
  conversationId: string,
): Promise<Response> {
  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const preferences = parseAiDraftPreferences(body.data.preferences);
  const config = getAiProviderConfig();
  if (!config.ok) {
    return config.response;
  }

  const conversation = await selectConversation(context.businessId, conversationId);
  if (!conversation.ok) {
    return conversation.response;
  }

  if (!conversation.data) {
    return fail(
      "AI_DRAFT_CONVERSATION_NOT_FOUND",
      "This conversation could not be found.",
      404,
    );
  }

  const customer = conversation.data.customerId
    ? await selectCustomer(context.businessId, conversation.data.customerId)
    : { ok: true as const, data: null };
  if (!customer.ok) {
    return customer.response;
  }

  const messages = await selectMessageContext(context.businessId, conversation.data.id);
  if (!messages.ok) {
    return messages.response;
  }

  const generated = await generateDraftWithOpenAi({
    apiKey: config.data.apiKey,
    customerName: customer.data?.displayName ?? "Customer",
    messages: messages.data,
    model: config.data.model,
    preferences,
  });
  if (!generated.ok) {
    return generated.response;
  }

  const routing = classifyDraftRouting({
    confidence: generated.data.confidence,
    preferences,
    riskCategory: generated.data.riskCategory,
    riskReasons: generated.data.riskReasons,
  });
  const draftStatus = routing.approvalRequired
    ? "approval_required"
    : "drafted";

  const insertedDraft = await insertAiDraft({
    businessId: context.businessId,
    confidence: generated.data.confidence,
    conversationId: conversation.data.id,
    customerId: customer.data?.id ?? null,
    draftText: generated.data.draftText,
    riskReasons: generated.data.riskReasons,
    status: draftStatus,
  });
  if (!insertedDraft.ok) {
    return insertedDraft.response;
  }

  let approvalId: string | null = null;

  if (routing.approvalRequired) {
    const approval = await createApprovalForDraft({
      businessId: context.businessId,
      draftId: insertedDraft.data.id,
      memberId: context.membership.id,
      riskCategory: routing.riskCategory,
    });
    if (!approval.ok) {
      return approval.response;
    }

    approvalId = approval.data.id;

    const linked = await linkDraftApproval({
      approvalId,
      businessId: context.businessId,
      draftId: insertedDraft.data.id,
    });
    if (!linked.ok) {
      return linked.response;
    }
  }

  const audit = await writeAuditLog(context, {
    action: "ai_draft.created",
    entityId: insertedDraft.data.id,
    entityType: "ai_draft",
    metadata: {
      approval_required: routing.approvalRequired,
      confidence_band: insertedDraft.data.confidenceBand,
      permission: "ai_draft.create",
      reason_code: routing.reasonCode,
      result: "allowed",
      risk_category: routing.riskCategory,
    },
    request,
  });
  if (!audit.ok) {
    return auditWriteFailed();
  }

  return ok({
    draft: draftDto({
      approvalId,
      approvalRequired: routing.approvalRequired,
      conversationId: conversation.data.id,
      customerName: customer.data?.displayName ?? "Customer",
      draft: insertedDraft.data,
      reasonCode: routing.reasonCode,
      riskCategory: routing.riskCategory,
      suggestedAction: generated.data.suggestedAction,
    }),
  });
}

async function generateDraftWithOpenAi({
  apiKey,
  customerName,
  messages,
  model,
  preferences,
}: {
  apiKey: string;
  customerName: string;
  messages: readonly MessageContext[];
  model: string;
  preferences: AiDraftPreferences;
}): Promise<
  | { ok: true; data: GeneratedDraft }
  | { ok: false; response: Response }
> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    body: JSON.stringify({
      messages: [
        {
          content:
            "You write careful WhatsApp reply drafts for Nigerian SME sellers. Produce respectful, concise JSON. Never claim a bank transfer is confirmed from a screenshot. Never promise refunds, discounts, or complaint remedies without marking the risk category.",
          role: "system",
        },
        {
          content: JSON.stringify({
            customerLabel: customerName,
            messageContext: messages,
            preferences,
          }),
          role: "user",
        },
      ],
      model,
      response_format: {
        json_schema: {
          name: "neo_ai_draft",
          schema: draftResponseSchema(),
          strict: true,
        },
        type: "json_schema",
      },
      temperature: 0.4,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const responseBody = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return {
      ok: false,
      response: fail(
        "AI_DRAFT_PROVIDER_FAILED",
        "Neo could not generate an AI draft right now. Try again before relying on this reply.",
        502,
      ),
    };
  }

  const generated = parseOpenAiDraftResponse(responseBody);
  if (!generated) {
    return {
      ok: false,
      response: fail(
        "AI_DRAFT_PROVIDER_INVALID",
        "Neo received an unexpected AI draft response.",
        502,
      ),
    };
  }

  return { ok: true, data: generated };
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
      "&select=id,customer_id,status,last_message_at&limit=1",
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
      "&select=id,display_name&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseCustomerRow(record) : null;
    },
  );
}

async function selectMessageContext(
  businessId: string,
  conversationId: string,
): Promise<
  | { ok: true; data: MessageContext[] }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/whatsapp_messages?business_id=eq.${encodeURIComponent(businessId)}` +
      `&conversation_id=eq.${encodeURIComponent(conversationId)}` +
      "&select=body_preview,direction,message_type,created_at" +
      "&order=created_at.desc&limit=8",
    { method: "GET" },
    (value) =>
      records(value)
        .map(parseMessageContext)
        .reverse(),
  );
}

async function insertAiDraft({
  businessId,
  confidence,
  conversationId,
  customerId,
  draftText,
  riskReasons,
  status,
}: {
  businessId: string;
  confidence: number;
  conversationId: string;
  customerId: string | null;
  draftText: string;
  riskReasons: readonly string[];
  status: string;
}): Promise<
  | { ok: true; data: AiDraftRow }
  | { ok: false; response: Response }
> {
  return dbRequest(
    "/rest/v1/ai_drafts?select=id,conversation_id,approval_id,status,confidence_band,risk_reasons,draft_text,created_at",
    {
      body: {
        business_id: businessId,
        confidence_band: confidenceBand(confidence),
        conversation_id: conversationId,
        created_by: "ai",
        customer_id: customerId,
        draft_text: draftText,
        risk_reasons: riskReasons,
        status,
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => parseAiDraftRow(requiredFirst(value)),
  );
}

async function createApprovalForDraft({
  businessId,
  draftId,
  memberId,
  riskCategory,
}: {
  businessId: string;
  draftId: string;
  memberId: string;
  riskCategory: AiDraftRiskCategory;
}): Promise<
  | { ok: true; data: { id: string } }
  | { ok: false; response: Response }
> {
  return dbRequest(
    "/rest/v1/approvals?select=id",
    {
      body: {
        business_id: businessId,
        requested_by_member_id: memberId,
        risk_category: riskCategory,
        status: "pending",
        subject_id: draftId,
        subject_type: "ai_draft",
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => ({ id: requiredString(requiredFirst(value).id) }),
  );
}

async function linkDraftApproval({
  approvalId,
  businessId,
  draftId,
}: {
  approvalId: string;
  businessId: string;
  draftId: string;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const updated = await dbRequest(
    `/rest/v1/ai_drafts?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=eq.${encodeURIComponent(draftId)}&select=id`,
    {
      body: {
        approval_id: approvalId,
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

function draftDto({
  approvalId,
  approvalRequired,
  conversationId,
  customerName,
  draft,
  reasonCode,
  riskCategory,
  suggestedAction,
}: {
  approvalId: string | null;
  approvalRequired: boolean;
  conversationId: string;
  customerName: string;
  draft: AiDraftRow;
  reasonCode: string;
  riskCategory: AiDraftRiskCategory;
  suggestedAction: string;
}) {
  return {
    approvalId,
    approvalRequired,
    body: draft.draftText,
    confidence: draft.confidenceBand,
    conversationId,
    customerName,
    guardrail: approvalRequired
      ? "This draft needs owner or manager approval before it can be sent."
      : "Review this AI draft before sending. Neo will not send without your tap.",
    id: draft.id,
    reasonCode,
    riskCategory,
    riskReasons: draft.riskReasons,
    sourceChips: [
      "WhatsApp conversation",
      `Confidence: ${draft.confidenceBand}`,
      approvalRequired ? "Approval required" : "Human review",
    ],
    status: draft.status,
    suggestedAction,
  };
}

function parseOpenAiDraftResponse(value: unknown): GeneratedDraft | null {
  if (!isRecord(value) || !Array.isArray(value.choices)) {
    return null;
  }

  const firstChoice = value.choices[0] as unknown;
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return null;
  }

  const content = optionalString(firstChoice.message.content);
  if (!content) {
    return null;
  }

  const parsed = parseJsonRecord(content);
  if (!parsed) {
    return null;
  }

  const draftText = optionalString(parsed.draftText)?.trim();
  if (!draftText) {
    return null;
  }

  return {
    confidence: normalizeConfidence(parsed.confidence),
    draftText,
    riskCategory: normalizeRiskCategory(parsed.riskCategory),
    riskReasons: safeJsonArray(parsed.riskReasons)
      .map((item) => safeDraftPreview(item, 80))
      .filter(Boolean),
    suggestedAction: normalizeSuggestedAction(parsed.suggestedAction),
  };
}

function draftResponseSchema(): Record<string, unknown> {
  return {
    additionalProperties: false,
    properties: {
      confidence: {
        maximum: 100,
        minimum: 0,
        type: "number",
      },
      draftText: {
        maxLength: 1000,
        type: "string",
      },
      riskCategory: {
        enum: ["none", "complaint", "discount", "payment", "refund"],
        type: "string",
      },
      riskReasons: {
        items: {
          maxLength: 80,
          type: "string",
        },
        maxItems: 3,
        type: "array",
      },
      suggestedAction: {
        enum: ["send_after_review", "approval_required", "edit_first", "takeover"],
        type: "string",
      },
    },
    required: [
      "draftText",
      "confidence",
      "riskCategory",
      "riskReasons",
      "suggestedAction",
    ],
    type: "object",
  };
}

function getAiProviderConfig():
  | { ok: true; data: { apiKey: string; model: string } }
  | { ok: false; response: Response } {
  const apiKey = Deno.env.get("OPENAI_API_KEY")?.trim();

  if (!apiKey) {
    return {
      ok: false,
      response: fail(
        "AI_PROVIDER_CONFIG_MISSING",
        "AI draft generation is not configured yet.",
        503,
      ),
    };
  }

  return {
    ok: true,
    data: {
      apiKey,
      model: Deno.env.get("OPENAI_MODEL")?.trim() || "gpt-4o-mini",
    },
  };
}

function parseConversationRow(record: Record<string, unknown>): ConversationRow {
  return {
    customerId: optionalString(record.customer_id),
    id: requiredString(record.id),
    lastMessageAt: optionalString(record.last_message_at),
    status: requiredString(record.status),
  };
}

function parseCustomerRow(record: Record<string, unknown>): CustomerRow {
  return {
    displayName: requiredString(record.display_name),
    id: requiredString(record.id),
  };
}

function parseMessageContext(record: Record<string, unknown>): MessageContext {
  const direction = requiredString(record.direction);

  return {
    direction: direction === "outbound" ? "business" : "customer",
    messageType: requiredString(record.message_type),
    preview: safeDraftPreview(record.body_preview, 180),
  };
}

function parseAiDraftRow(record: Record<string, unknown>): AiDraftRow {
  const band = requiredString(record.confidence_band);

  return {
    approvalId: optionalString(record.approval_id),
    confidenceBand: band === "high" || band === "low" ? band : "medium",
    conversationId: requiredString(record.conversation_id),
    createdAt: requiredString(record.created_at),
    draftText: requiredString(record.draft_text),
    id: requiredString(record.id),
    riskReasons: safeJsonArray(record.risk_reasons)
      .map((item) => safeDraftPreview(item, 80))
      .filter(Boolean),
    status: requiredString(record.status),
  };
}

function normalizeSuggestedAction(
  value: unknown,
): GeneratedDraft["suggestedAction"] {
  if (
    value === "approval_required" ||
    value === "edit_first" ||
    value === "send_after_review" ||
    value === "takeover"
  ) {
    return value;
  }

  return "edit_first";
}

function parseJsonRecord(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as unknown;

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
