import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { CustomerProfileScreen } from "@/features/customer/CustomerProfileScreen";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";

export default function CustomerProfileRoute() {
  const { id, state } = useLocalSearchParams<{
    id?: string;
    state?: string | string[];
  }>();

  return (
    <ProtectedRouteGuard>
      <CustomerProfileScreen
        customerId={id}
        initialState={getMockScreenState(state)}
      />
    </ProtectedRouteGuard>
  );
}
