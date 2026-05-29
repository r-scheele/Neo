import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { InboxConversationListScreen } from "@/features/inbox/InboxConversationListScreen";

export default function InboxRoute() {
  const { state } = useLocalSearchParams<{ state?: string | string[] }>();

  return <InboxConversationListScreen initialState={getMockScreenState(state)} />;
}
