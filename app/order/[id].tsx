import { useLocalSearchParams } from "expo-router";

import { PlaceholderScreen } from "@/components/layout/PlaceholderScreen";

export default function OrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title="Order detail" description={`ID: ${id ?? ""}`} />;
}
