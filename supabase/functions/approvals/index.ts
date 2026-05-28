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
  optionalString,
  records,
  requiredString,
  safeJsonArray,
} from "../_shared/postgrest.ts";
import {
  auditWriteFailed,
  requirePermission,
  writeAuditLog,
} from "../_shared/permissions.ts";
import type { AuditContext } from "../_shared/permissions.ts";

type ApprovalRow = {
  id: string;
  requestedByMemberId: string | null;
  decidedByMemberId: string | null;
  subjectType: string;
  subjectId: string | null;
  status: string;
  riskCategory: string | null;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type AiDraftApprovalRow = {
  approvalId: string | null;
  confidenceBand: string | null;
  conversationId: string | null;
  customerId: string | null;
  draftText: string | null;
  id: string;
  riskReasons: readonly string[];
  status: string;
};

type CustomerRow = {
  displayName: string;
  id: string;
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

  const parts = getRouteParts(request, "approvals");

  if (request.method === "GET" && parts.length === 0) {
    return listApprovals(request, context.context.businessId);
  }

  if (request.method === "PATCH" && parts.length === 2 && parts[1] === "decision") {
    return decideApproval(request, parts[0], context.context);
  }

  return methodNotAllowed(["GET", "PATCH", "OPTIONS"]);
});

async function listApprovals(
  request: Request,
  businessId: string,
): Promise<Response> {
  const status = normalizeStatus(new URL(request.url).searchParams.get("status"));
  const filters = [
    `business_id=eq.${encodeURIComponent(businessId)}`,
    "select=id,requested_by_member_id,decided_by_member_id,subject_type,subject_id,status,risk_category,decision_note,decided_at,created_at,updated_at",
    "order=created_at.desc",
    "limit=50",
  ];

  if (status) {
    filters.push(`status=eq.${encodeURIComponent(status)}`);
  }

  const approvals = await dbRequest(
    `/rest/v1/approvals?${filters.join("&")}`,
    { method: "GET" },
    (value) => records(value).map(parseApprovalRow),
  );

  if (!approvals.ok) {
    return approvals.response;
  }

  const aiDrafts = await selectAiDraftsForApprovals(businessId, approvals.data);
  if (!aiDrafts.ok) {
    return aiDrafts.response;
  }

  const customers = await selectCustomersForDrafts(businessId, aiDrafts.data);
  if (!customers.ok) {
    return customers.response;
  }

  return ok({
    approvals: approvals.data.map((approval) => {
      const aiDraft = aiDrafts.data.get(approval.id) ?? null;

      return approvalDto({
        aiDraft,
        approval,
        customer: customerForDraft({
          aiDraft,
          customers: customers.data,
        }),
      });
    }),
  });
}

async function decideApproval(
  request: Request,
  approvalId: string,
  context: AuditContext,
): Promise<Response> {
  const permission = await requirePermission(
    context,
    "approval.decide",
    request,
    {
      endpoint: "approvals/decision",
      entityId: approvalId,
      entityType: "approval",
    },
  );
  if (!permission.ok) {
    return permission.response;
  }

  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const decision = normalizeDecision(body.data.decision);
  if (!decision) {
    return fail(
      "VALIDATION_INVALID_APPROVAL_DECISION",
      "Choose a valid approval decision.",
      400,
    );
  }

  const existing = await selectApproval(approvalId, context.businessId);
  if (!existing.ok) {
    return existing.response;
  }

  if (!existing.data) {
    return fail("APPROVAL_NOT_FOUND", "This approval could not be found.", 404);
  }

  const updated = await dbRequest(
    `/rest/v1/approvals?id=eq.${encodeURIComponent(approvalId)}` +
      `&business_id=eq.${encodeURIComponent(context.businessId)}` +
      "&select=id,requested_by_member_id,decided_by_member_id,subject_type,subject_id,status,risk_category,decision_note,decided_at,created_at,updated_at",
    {
      body: {
        decided_at: new Date().toISOString(),
        decided_by_member_id: context.membership.id,
        decision_note: null,
        status: statusForDecision(decision),
        updated_at: new Date().toISOString(),
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => parseApprovalRow(requiredFirst(value)),
  );

  if (!updated.ok) {
    return updated.response;
  }

  const audit = await writeAuditLog(context, {
    action: "approval.decision_recorded",
    entityId: updated.data.id,
    entityType: "approval",
    metadata: {
      approval_type: updated.data.subjectType,
      decision,
      permission: "approval.decide",
      previous_status: existing.data.status,
      next_status: updated.data.status,
      result: "allowed",
    },
    request,
  });
  if (!audit.ok) {
    return auditWriteFailed();
  }

  if (updated.data.subjectType === "ai_draft" && updated.data.subjectId) {
    const draftUpdate = await updateAiDraftDecision({
      businessId: context.businessId,
      decision,
      draftId: updated.data.subjectId,
    });
    if (!draftUpdate.ok) {
      return draftUpdate.response;
    }
  }

  return ok({ approval: approvalDto({ approval: updated.data }) });
}

async function selectApproval(
  approvalId: string,
  businessId: string,
): Promise<
  | { ok: true; data: ApprovalRow | null }
  | { ok: false; response: Response }
> {
  return dbRequest(
    `/rest/v1/approvals?id=eq.${encodeURIComponent(approvalId)}` +
      `&business_id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,requested_by_member_id,decided_by_member_id,subject_type,subject_id,status,risk_category,decision_note,decided_at,created_at,updated_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseApprovalRow(record) : null;
    },
  );
}

async function selectAiDraftsForApprovals(
  businessId: string,
  approvals: readonly ApprovalRow[],
): Promise<
  | { ok: true; data: Map<string, AiDraftApprovalRow> }
  | { ok: false; response: Response }
> {
  const approvalIds = approvals
    .filter((approval) => approval.subjectType === "ai_draft")
    .map((approval) => approval.id);

  if (approvalIds.length === 0) {
    return { ok: true, data: new Map() };
  }

  return dbRequest(
    `/rest/v1/ai_drafts?business_id=eq.${encodeURIComponent(businessId)}` +
      `&approval_id=in.(${approvalIds.map(encodeURIComponent).join(",")})` +
      "&select=id,approval_id,conversation_id,customer_id,status,confidence_band,risk_reasons,draft_text",
    { method: "GET" },
    (value) =>
      new Map(records(value).map((record) => {
        const draft = parseAiDraftApprovalRow(record);
        return [draft.approvalId ?? draft.id, draft];
      })),
  );
}

async function selectCustomersForDrafts(
  businessId: string,
  drafts: Map<string, AiDraftApprovalRow>,
): Promise<
  | { ok: true; data: Map<string, CustomerRow> }
  | { ok: false; response: Response }
> {
  const customerIds = [...new Set(
    [...drafts.values()].flatMap((draft) =>
      draft.customerId ? [draft.customerId] : []
    ),
  )];

  if (customerIds.length === 0) {
    return { ok: true, data: new Map() };
  }

  return dbRequest(
    `/rest/v1/customers?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=in.(${customerIds.map(encodeURIComponent).join(",")})` +
      "&select=id,display_name",
    { method: "GET" },
    (value) =>
      new Map(records(value).map((record) => {
        const customer = parseCustomerRow(record);
        return [customer.id, customer];
      })),
  );
}

async function updateAiDraftDecision({
  businessId,
  decision,
  draftId,
}: {
  businessId: string;
  decision: string;
  draftId: string;
}): Promise<{ ok: true } | { ok: false; response: Response }> {
  const updated = await dbRequest(
    `/rest/v1/ai_drafts?business_id=eq.${encodeURIComponent(businessId)}` +
      `&id=eq.${encodeURIComponent(draftId)}&select=id`,
    {
      body: {
        status: statusForDecision(decision),
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

function approvalDto({
  aiDraft = null,
  approval,
  customer = null,
}: {
  aiDraft?: AiDraftApprovalRow | null;
  approval: ApprovalRow;
  customer?: CustomerRow | null;
}) {
  return {
    aiDraft: aiDraft
      ? {
          body: aiDraft.draftText ?? "",
          confidence: aiDraft.confidenceBand ?? "medium",
          conversationId: aiDraft.conversationId,
          customerName: customer?.displayName ?? "Customer",
          id: aiDraft.id,
          riskReasons: aiDraft.riskReasons,
          status: aiDraft.status,
        }
      : null,
    createdAt: approval.createdAt,
    decidedAt: approval.decidedAt,
    id: approval.id,
    riskCategory: approval.riskCategory,
    status: approval.status,
    subjectId: approval.subjectId,
    subjectType: approval.subjectType,
    updatedAt: approval.updatedAt,
  };
}

function customerForDraft({
  aiDraft,
  customers,
}: {
  aiDraft: AiDraftApprovalRow | null;
  customers: Map<string, CustomerRow>;
}): CustomerRow | null {
  return aiDraft?.customerId ? customers.get(aiDraft.customerId) ?? null : null;
}

function parseApprovalRow(record: Record<string, unknown>): ApprovalRow {
  return {
    createdAt: requiredString(record.created_at),
    decidedAt: optionalString(record.decided_at),
    decidedByMemberId: optionalString(record.decided_by_member_id),
    decisionNote: optionalString(record.decision_note),
    id: requiredString(record.id),
    requestedByMemberId: optionalString(record.requested_by_member_id),
    riskCategory: optionalString(record.risk_category),
    status: requiredString(record.status),
    subjectId: optionalString(record.subject_id),
    subjectType: requiredString(record.subject_type),
    updatedAt: requiredString(record.updated_at),
  };
}

function parseAiDraftApprovalRow(record: Record<string, unknown>): AiDraftApprovalRow {
  return {
    approvalId: optionalString(record.approval_id),
    confidenceBand: optionalString(record.confidence_band),
    conversationId: optionalString(record.conversation_id),
    customerId: optionalString(record.customer_id),
    draftText: optionalString(record.draft_text),
    id: requiredString(record.id),
    riskReasons: safeJsonArray(record.risk_reasons)
      .filter((item): item is string => typeof item === "string"),
    status: requiredString(record.status),
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

function normalizeStatus(value: unknown): string | null {
  if (
    value === "approved" ||
    value === "escalated" ||
    value === "pending" ||
    value === "rejected" ||
    value === "sent"
  ) {
    return value;
  }

  return null;
}

function normalizeDecision(value: unknown): string | null {
  if (
    value === "approved" ||
    value === "asked" ||
    value === "edited" ||
    value === "escalated" ||
    value === "rejected" ||
    value === "sent"
  ) {
    return value;
  }

  return null;
}

function statusForDecision(decision: string): string {
  if (decision === "asked" || decision === "edited") {
    return "pending";
  }

  return decision;
}
