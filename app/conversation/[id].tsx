import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { ConversationDetailScreen } from "@/features/conversation/ConversationDetailScreen";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";

export default function ConversationDetailRoute() {
  const { id, state } = useLocalSearchParams<{
    id: string;
    state?: string | string[];
  }>();

  return (
    <ProtectedRouteGuard>
      <ConversationDetailScreen
        conversationId={id}
        initialState={getMockScreenState(state)}
        key={`${id ?? "missing"}-${state ?? "ready"}`}
      />
    </ProtectedRouteGuard>
  );
}
