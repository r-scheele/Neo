import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { getMockStaffRole } from "@/features/permissions/permissionData";
import { ReceiptReviewScreen } from "@/features/receipts/ReceiptReviewScreen";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";

export default function ReceiptReviewRoute() {
  const { id, role, state } = useLocalSearchParams<{
    id?: string;
    role?: string | string[];
    state?: string | string[];
  }>();

  return (
    <ProtectedRouteGuard>
      <ReceiptReviewScreen
        initialState={getMockScreenState(state)}
        mockRole={getMockStaffRole(role)}
        receiptId={id}
      />
    </ProtectedRouteGuard>
  );
}
