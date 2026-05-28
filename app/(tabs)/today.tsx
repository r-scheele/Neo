import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { TodayCommandCenterScreen } from "@/features/today/TodayCommandCenterScreen";

export default function TodayRoute() {
  const { state } = useLocalSearchParams<{ state?: string | string[] }>();

  return <TodayCommandCenterScreen initialState={getMockScreenState(state)} />;
}
