import { fail } from "./http.ts";
import { dbRequest, firstRecord } from "./postgrest.ts";
import type { CommerceContext } from "./commerceContext.ts";
import type { Membership } from "./supabaseRest.ts";

export type Permission =
  | "approval.decide"
  | "follow_up.complete"
  | "follow_up.reschedule"
  | "order.cancel"
  | "order.create"
  | "order.delivery_update"
  | "receipt.review_decide";

type Role = Membership["role"];

type AuditMetadata = Record<
  string,
  boolean | null | number | string | readonly (boolean | number | string)[]
>;

type AuditInput = {
  action: string;
  entityId?: string | null;
  entityType: string;
  metadata?: AuditMetadata;
  requestId?: string | null;
};

type PermissionDeniedAuditInput = {
  endpoint: string;
  entityId?: string | null;
  entityType: string;
  metadata?: AuditMetadata;
  requestId?: string | null;
};

export type PermissionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      response: Response;
    };

const rolesByPermission: Record<Permission, readonly Role[]> = {
  "approval.decide": ["owner", "manager"],
  "follow_up.complete": ["owner", "manager", "staff"],
  "follow_up.reschedule": ["owner", "manager", "staff"],
  "order.cancel": ["owner", "manager"],
  "order.create": ["owner", "manager", "staff"],
  "order.delivery_update": ["owner", "manager"],
  "receipt.review_decide": ["owner", "manager"],
};

export function hasPermission(membership: Membership, permission: Permission): boolean {
  return rolesByPermission[permission].includes(membership.role);
}

export async function requirePermission(
  context: CommerceContext,
  permission: Permission,
  audit: PermissionDeniedAuditInput,
): Promise<PermissionResult> {
  if (hasPermission(context.membership, permission)) {
    return { ok: true };
  }

  await writeAuditLog(context, {
    action: "permission.denied",
    entityId: audit.entityId,
    entityType: audit.entityType,
    metadata: {
      ...audit.metadata,
      actor_role: context.membership.role,
      endpoint: audit.endpoint,
      permission,
      result: "denied",
    },
    requestId: audit.requestId,
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

export async function writeRequiredAuditLog(
  context: CommerceContext,
  audit: AuditInput,
): Promise<PermissionResult> {
  const result = await writeAuditLog(context, audit);

  if (result.ok) {
    return result;
  }

  return {
    ok: false,
    response: fail(
      "AUDIT_WRITE_FAILED",
      "Neo could not record the audit history for this action.",
      500,
      {
        action: audit.action,
        entityType: audit.entityType,
      },
    ),
  };
}

export function amountBand(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "unknown";
  }

  if (value <= 10_000) {
    return "0-10000";
  }

  if (value <= 50_000) {
    return "10001-50000";
  }

  if (value <= 100_000) {
    return "50001-100000";
  }

  return "100001+";
}

export function countBand(value: number): string {
  if (value <= 1) {
    return "1";
  }

  if (value <= 3) {
    return "2-3";
  }

  if (value <= 10) {
    return "4-10";
  }

  return "11+";
}

async function writeAuditLog(
  context: CommerceContext,
  audit: AuditInput,
): Promise<PermissionResult> {
  const result = await dbRequest(
    "/rest/v1/audit_logs?select=id",
    {
      body: {
        action: audit.action,
        actor_member_id: context.membership.id,
        actor_profile_id: context.profile.id,
        business_id: context.businessId,
        entity_id: audit.entityId ?? null,
        entity_type: audit.entityType,
        request_id: audit.requestId ?? null,
        safe_metadata: audit.metadata ?? {},
        source: "edge_function",
      },
      method: "POST",
      prefer: "return=representation",
    },
    (value) => {
      const record = firstRecord(value);

      if (!record) {
        throw new Error("Expected audit row.");
      }

      return record;
    },
  );

  if (!result.ok) {
    return result;
  }

  return { ok: true };
}
