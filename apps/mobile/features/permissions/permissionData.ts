import type { Href } from "expo-router";
import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";
import {
  getLocalPreviewParamValue,
  getLocalPreviewQueryString,
  isLocalPreviewEnabled,
} from "@/lib/mocks/localPreview";

export type MockStaffRole = "owner" | "manager" | "staff";

export type SensitivePermissionAction =
  | "approval-decision"
  | "order-decision"
  | "receipt-decision"
  | "safety-settings";

export type PermissionActionDetail = {
  actionLabel: string;
  description: string;
  icon: ImageSourcePropType;
  id: SensitivePermissionAction;
  restrictedLabel: string;
};

export type RoleDetail = {
  description: string;
  label: string;
  role: MockStaffRole;
};

export const roleDetails: Record<MockStaffRole, RoleDetail> = {
  manager: {
    description: "Can review sensitive actions when the owner allows it.",
    label: "Manager",
    role: "manager",
  },
  owner: {
    description: "Can approve payment, AI, and safety decisions.",
    label: "Owner",
    role: "owner",
  },
  staff: {
    description: "Can view work, create notes, and handle safe follow-ups.",
    label: "Staff",
    role: "staff",
  },
};

export const permissionActionDetails: Record<
  SensitivePermissionAction,
  PermissionActionDetail
> = {
  "approval-decision": {
    actionLabel: "Approve sensitive AI action",
    description:
      "Approve, edit, reject, or escalate AI actions that affect customers, payments, complaints, or discounts.",
    icon: images.iconApprovals,
    id: "approval-decision",
    restrictedLabel: "Approval required",
  },
  "order-decision": {
    actionLabel: "Change order status",
    description:
      "Cancel orders, change payment status, or update delivery and fulfillment states.",
    icon: images.iconOrder,
    id: "order-decision",
    restrictedLabel: "Restricted",
  },
  "receipt-decision": {
    actionLabel: "Review payment receipt",
    description:
      "Confirm, reject, or save a decision on a manual bank transfer receipt.",
    icon: images.iconReceiptReview,
    id: "receipt-decision",
    restrictedLabel: "Restricted",
  },
  "safety-settings": {
    actionLabel: "Change safety rules",
    description:
      "Change AI guardrails, payment rules, refunds, discounts, or other sensitive settings.",
    icon: images.iconPermission,
    id: "safety-settings",
    restrictedLabel: "Owner only",
  },
};

export const permittedSensitiveRoles: readonly MockStaffRole[] = [
  "owner",
  "manager",
];

export const allowedStaffActions: readonly string[] = [
  "View orders, conversations, and history",
  "Create follow-ups and customer notes",
  "View cached information without changing payment state",
];

export function getMockStaffRole(value: string | string[] | undefined) {
  const role = getLocalPreviewParamValue(value);

  if (role === "owner" || role === "manager" || role === "staff") {
    return role;
  }

  return isLocalPreviewEnabled() ? "owner" : "staff";
}

export function getPermissionAction(
  value: string | string[] | undefined,
): SensitivePermissionAction {
  const action = Array.isArray(value) ? value[0] : value;

  if (
    action === "approval-decision" ||
    action === "order-decision" ||
    action === "receipt-decision" ||
    action === "safety-settings"
  ) {
    return action;
  }

  return "approval-decision";
}

export function canPerformSensitiveAction({
  action,
  role,
}: {
  action: SensitivePermissionAction;
  role: MockStaffRole;
}) {
  if (action === "approval-decision" || action === "receipt-decision") {
    return role === "owner" || role === "manager";
  }

  if (action === "order-decision") {
    return role === "owner" || role === "manager";
  }

  return role === "owner";
}

export function getPermissionDeniedHref({
  action,
  role,
}: {
  action: SensitivePermissionAction;
  role: MockStaffRole;
}): Href {
  return `/modals/permission?action=${action}${getLocalPreviewQueryString({
    role,
  }).replace("?", "&")}` as Href;
}

export function getRoleScopedReceiptHref({
  receiptId,
  role,
}: {
  receiptId: string;
  role: MockStaffRole;
}): Href {
  return `/receipt/${receiptId}${getLocalPreviewQueryString({ role })}` as Href;
}

export function getDeniedRoleFromDetails(
  details: Record<string, unknown>,
  fallbackRole: MockStaffRole,
): MockStaffRole {
  const role = details.role;

  if (role === "owner" || role === "manager" || role === "staff") {
    return role;
  }

  return fallbackRole;
}
