import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { SettingsScreen } from "@/features/settings/SettingsScreen";

export default function SettingsRoute() {
  const { state } = useLocalSearchParams<{ state?: string | string[] }>();

  return <SettingsScreen state={getMockScreenState(state)} />;
}
