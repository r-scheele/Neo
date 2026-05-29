import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { ApprovalQueueScreen } from "@/features/approvals/ApprovalQueueScreen";
import { getMockStaffRole } from "@/features/permissions/permissionData";

export default function ApprovalsRoute() {
  const { role, state } = useLocalSearchParams<{
    role?: string | string[];
    state?: string | string[];
  }>();

  return (
    <ApprovalQueueScreen
      initialState={getMockScreenState(state)}
      mockRole={getMockStaffRole(role)}
    />
  );
}
