import { fail } from "./http.ts";
import { dbRequest, firstRecord, requiredString } from "./postgrest.ts";

export type BusinessRole = "owner" | "manager" | "staff";

export type SensitivePermission =
  | "approval.decide"
  | "business.ai_settings.update"
  | "business.delivery_zones.update"
  | "business.payment_rules.update"
  | "business.product_basics.update"
  | "business.profile.update"
  | "business.security_settings.update"
  | "customer.summary.update"
  | "follow_up.complete"
  | "follow_up.reschedule"
  | "media.request"
  | "order.cancel"
  | "order.create"
  | "order.delivery_status.update"
  | "order.payment_status.update"
  | "order.update"
  | "receipt.review_decide"
  | "team.manage"
  | "whatsapp.send";

export type AuditAction =
  | "approval.decision_recorded"
  | "business.ai_settings.updated"
  | "business.delivery_zones.updated"
  | "business.payment_rules.updated"
  | "business.product_basics.updated"
  | "business.settings.updated"
  | "customer.summary.updated"
  | "follow_up.completed"
  | "follow_up.rescheduled"
  | "media.signed_url_issued"
  | "media.upload_requested"
  | "order.cancelled"
  | "order.created"
  | "order.delivery_status_updated"
  | "order.updated"
  | "payment.status_updated"
  | "permission.denied"
  | "receipt.review_decision_recorded"
  | "team.member.disabled"
  | "team.member.invited"
  | "team.member.role_updated"
  | "whatsapp.send_attempted";

export type AuditEntityType =
  | "approval"
  | "business"
  | "customer"
  | "follow_up"
  | "media"
  | "order"
  | "permission"
  | "receipt"
  | "team_member"
  | "whatsapp_message";

export type PermissionTarget = {
  endpoint: string;
  entityId?: string | null;
  entityType: AuditEntityType;
};

export type AuditContext = {
  businessId: string;
  membership: {
    id: string;
    role: BusinessRole;
  };
  profile: {
    id: string;
  };
};

export type PermissionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      response: Response;
    };

type AuditLogInput = {
  action: AuditAction;
  entityId?: string | null;
  entityType: AuditEntityType;
  metadata?: Record<string, unknown>;
  request: Request;
};

type AuditLogResult =
  | {
      ok: true;
      id: string;
    }
  | {
      ok: false;
      response: Response;
    };

const permissionsByRole: Record<BusinessRole, ReadonlySet<SensitivePermission>> = {
  manager: new Set([
    "approval.decide",
    "business.ai_settings.update",
    "business.delivery_zones.update",
    "business.product_basics.update",
    "customer.summary.update",
    "follow_up.complete",
    "follow_up.reschedule",
    "media.request",
    "order.cancel",
    "order.create",
    "order.delivery_status.update",
    "order.payment_status.update",
    "order.update",
    "receipt.review_decide",
    "whatsapp.send",
  ]),
  owner: new Set([
    "approval.decide",
    "business.ai_settings.update",
    "business.delivery_zones.update",
    "business.payment_rules.update",
    "business.product_basics.update",
    "business.profile.update",
    "business.security_settings.update",
    "customer.summary.update",
    "follow_up.complete",
    "follow_up.reschedule",
    "media.request",
    "order.cancel",
    "order.create",
    "order.delivery_status.update",
    "order.payment_status.update",
    "order.update",
    "receipt.review_decide",
    "team.manage",
    "whatsapp.send",
  ]),
  staff: new Set([
    "follow_up.complete",
    "follow_up.reschedule",
    "order.create",
  ]),
};

const safeMetadataKeys = new Set([
  "actor_role",
  "amount_band",
  "approval_type",
  "decision",
  "delivery_status",
  "endpoint",
  "has_bank_check",
  "media_kind",
  "next_status",
  "permission",
  "previous_status",
  "reason_code",
  "result",
  "target_role",
]);

export function canPerformPermission(
  role: BusinessRole,
  permission: SensitivePermission,
): boolean {
  return permissionsByRole[role].has(permission);
}

export function amountBand(amount: number): string {
  if (amount <= 0) {
    return "none";
  }

  if (amount < 10_000) {
    return "under_10k";
  }

  if (amount < 50_000) {
    return "10k_to_50k";
  }

  if (amount < 200_000) {
    return "50k_to_200k";
  }

  return "over_200k";
}

export function auditMetadata(
  metadata: Record<string, unknown> = {},
): Record<string, string | number | boolean | null> {
  const safeMetadata: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (!safeMetadataKeys.has(key)) {
      continue;
    }

    const safeValue = primitiveAuditValue(value);

    if (safeValue !== undefined) {
      safeMetadata[key] = safeValue;
    }
  }

  return safeMetadata;
}

export async function requirePermission(
  context: AuditContext,
  permission: SensitivePermission,
  request: Request,
  target: PermissionTarget,
): Promise<PermissionResult> {
  if (canPerformPermission(context.membership.role, permission)) {
    return { ok: true };
  }

  await writeAuditLog(context, {
    action: "permission.denied",
    entityId: target.entityId,
    entityType: target.entityType,
    metadata: {
      actor_role: context.membership.role,
      endpoint: target.endpoint,
      permission,
      result: "denied",
    },
    request,
  });

  return {
    ok: false,
    response: fail(
      "PERMISSION_DENIED",
      "You do not have permission to do that.",
      403,
      {
        requiredPermission: permission,
        role: context.membership.role,
      },
    ),
  };
}

export async function writeAuditLog(
  context: AuditContext,
  input: AuditLogInput,
): Promise<AuditLogResult> {
  const result = await dbRequest(
    "/rest/v1/audit_logs?select=id",
    {
      body: {
        action: input.action,
        actor_member_id: context.membership.id,
        actor_profile_id: context.profile.id,
        business_id: context.businessId,
        entity_id: input.entityId ?? null,
        entity_type: input.entityType,
        request_id: requestId(input.request),
        safe_metadata: auditMetadata({
          actor_role: context.membership.role,
          ...input.metadata,
        }),
        source: "edge_function",
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => {
      const record = firstRecord(value);

      if (!record) {
        throw new Error("Expected audit log row.");
      }

      return { id: requiredString(record.id) };
    },
  );

  if (!result.ok) {
    return result;
  }

  return { ok: true, id: result.data.id };
}

export function auditWriteFailed(): Response {
  return fail(
    "AUDIT_WRITE_FAILED",
    "Neo could not safely record the required audit log. Try again before relying on this change.",
    500,
  );
}

function primitiveAuditValue(
  value: unknown,
): string | number | boolean | null | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  return undefined;
}

function requestId(request: Request): string {
  const headerValue =
    request.headers.get("x-request-id") ??
    request.headers.get("x-correlation-id");

  if (headerValue?.trim()) {
    return headerValue.trim().slice(0, 120);
  }

  return crypto.randomUUID();
}
