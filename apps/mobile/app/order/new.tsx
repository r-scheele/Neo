import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { CreateOrderScreen } from "@/features/order/CreateOrderScreen";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";

export default function CreateOrderRoute() {
  const { conversationId, state } = useLocalSearchParams<{
    conversationId?: string;
    state?: string | string[];
  }>();

  return (
    <ProtectedRouteGuard>
      <CreateOrderScreen
        conversationId={conversationId}
        initialState={getMockScreenState(state)}
      />
    </ProtectedRouteGuard>
  );
}
