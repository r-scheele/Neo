import { useLocalSearchParams } from "expo-router";

import {
  getMockStaffRole,
  getPermissionAction,
} from "@/features/permissions/permissionData";
import { PermissionDeniedScreen } from "@/features/permissions/PermissionDeniedScreen";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";

export default function PermissionModalRoute() {
  const { action, role } = useLocalSearchParams<{
    action?: string | string[];
    role?: string | string[];
  }>();

  return (
    <ProtectedRouteGuard>
      <PermissionDeniedScreen
        action={getPermissionAction(action)}
        currentRole={getMockStaffRole(role)}
      />
    </ProtectedRouteGuard>
  );
}
