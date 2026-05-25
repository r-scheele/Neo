import { useLocalSearchParams } from "expo-router";

import { PlaceholderScreen } from "@/components/layout/PlaceholderScreen";

export default function CustomerProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title="Customer profile" description={`ID: ${id ?? ""}`} />;
}
