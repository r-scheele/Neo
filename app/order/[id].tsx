import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { OrderDetailScreen } from "@/features/order/OrderDetailScreen";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";

export default function OrderDetailRoute() {
  const { id, state } = useLocalSearchParams<{
    id?: string;
    state?: string | string[];
  }>();

  return (
    <ProtectedRouteGuard>
      <OrderDetailScreen
        initialState={getMockScreenState(state)}
        orderId={id}
      />
    </ProtectedRouteGuard>
  );
}
