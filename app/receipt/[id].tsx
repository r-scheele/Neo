import { useLocalSearchParams } from "expo-router";

import { PlaceholderScreen } from "@/components/layout/PlaceholderScreen";

export default function ReceiptReviewRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title="Receipt review" description={`ID: ${id ?? ""}`} />;
}
