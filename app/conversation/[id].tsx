import { useLocalSearchParams } from "expo-router";

import { PlaceholderScreen } from "@/components/layout/PlaceholderScreen";

export default function ConversationDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title="Conversation" description={`ID: ${id ?? ""}`} />;
}
