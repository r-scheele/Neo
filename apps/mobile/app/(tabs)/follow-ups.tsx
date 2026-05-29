import { useLocalSearchParams } from "expo-router";

import { getMockScreenState } from "@/components/feedback/ScreenState";
import { FollowUpsScreen } from "@/features/follow-ups/FollowUpsScreen";

export default function FollowUpsRoute() {
  const { state } = useLocalSearchParams<{ state?: string | string[] }>();

  return <FollowUpsScreen initialState={getMockScreenState(state)} />;
}
