import { getRouteParts, requireCommerceContext } from "../_shared/commerceContext.ts";
import type { CommerceContext } from "../_shared/commerceContext.ts";
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
} from "../_shared/postgrest.ts";
import {
  requirePermission,
  writeRequiredAuditLog,
} from "../_shared/permissions.ts";

type ApprovalDecision = "approved" | "escalated" | "rejected";

type ApprovalRow = {
  id: string;
  riskCategory: string | null;
  status: string;
  subjectId: string | null;
  subjectType: string;
  updatedAt: string;
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

  const commerceContext = context.context;
  const parts = getRouteParts(request, "approvals");

  if (request.method === "GET" && parts.length === 0) {
    return listApprovals(request, commerceContext.businessId);
  }

  if (request.method === "PATCH" && parts.length === 2 && parts[1] === "decision") {
    return decideApproval(request, parts[0], commerceContext);
  }

  return methodNotAllowed(["GET", "PATCH", "OPTIONS"]);
});

async function listApprovals(
  request: Request,
  businessId: string,
): Promise<Response> {
  const status = normalizeStatusFilter(new URL(request.url).searchParams.get("status"));
  const filters = [
    `business_id=eq.${encodeURIComponent(businessId)}`,
    "select=id,subject_type,subject_id,status,risk_category,updated_at",
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

  return ok({
    approvals: approvals.data.map(approvalDto),
  });
}

async function decideApproval(
  request: Request,
  approvalId: string,
  context: CommerceContext,
): Promise<Response> {
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

  const permission = await requirePermission(context, "approval.decide", {
    endpoint: "approvals.decision",
    entityId: approvalId,
    entityType: "approval",
    metadata: {
      decision,
    },
  });
  if (!permission.ok) {
    return permission.response;
  }

  const existing = await selectApproval(approvalId, context.businessId);
  if (!existing.ok) {
    return existing.response;
  }

  if (!existing.data) {
    return fail("APPROVAL_NOT_FOUND", "This approval item could not be found.", 404);
  }

  const updated = await dbRequest(
    `/rest/v1/approvals?id=eq.${encodeURIComponent(approvalId)}` +
      `&business_id=eq.${encodeURIComponent(context.businessId)}` +
      "&select=id,subject_type,subject_id,status,risk_category,updated_at",
    {
      body: {
        decided_at: new Date().toISOString(),
        decided_by_member_id: context.membership.id,
        decision_note: optionalText(body.data.note),
        status: decision,
      },
      method: "PATCH",
      prefer: "return=representation",
    },
    (value) => parseApprovalRow(requiredFirst(value)),
  );

  if (!updated.ok) {
    return updated.response;
  }

  const audit = await writeRequiredAuditLog(context, {
    action: "approval.decision_recorded",
    entityId: updated.data.id,
    entityType: "approval",
    metadata: {
      actor_role: context.membership.role,
      approval_type: updated.data.subjectType,
      decision,
      next_status: updated.data.status,
      permission: "approval.decide",
      previous_status: existing.data.status,
      result: "allowed",
    },
  });
  if (!audit.ok) {
    return audit.response;
  }

  return ok({
    approval: approvalDto(updated.data),
  });
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
      "&select=id,subject_type,subject_id,status,risk_category,updated_at&limit=1",
    { method: "GET" },
    (value) => {
      const record = firstRecord(value);
      return record ? parseApprovalRow(record) : null;
    },
  );
}

function approvalDto(approval: ApprovalRow) {
  return {
    id: approval.id,
    riskCategory: approval.riskCategory,
    status: approval.status,
    subjectId: approval.subjectId,
    subjectType: approval.subjectType,
    updatedAt: approval.updatedAt,
  };
}

function parseApprovalRow(record: Record<string, unknown>): ApprovalRow {
  return {
    id: requiredString(record.id),
    riskCategory: optionalString(record.risk_category),
    status: requiredString(record.status),
    subjectId: optionalString(record.subject_id),
    subjectType: requiredString(record.subject_type),
    updatedAt: requiredString(record.updated_at),
  };
}

function normalizeDecision(value: unknown): ApprovalDecision | null {
  if (value === "approved" || value === "escalated" || value === "rejected") {
    return value;
  }

  return null;
}

function normalizeStatusFilter(value: unknown): string | null {
  if (
    value === "approved" ||
    value === "escalated" ||
    value === "pending" ||
    value === "rejected"
  ) {
    return value;
  }

  return null;
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function requiredFirst(value: unknown): Record<string, unknown> {
  const record = firstRecord(value);

  if (!record) {
    throw new Error("Expected one response row.");
  }

  return record;
}
