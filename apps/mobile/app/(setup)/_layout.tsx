import { Stack } from "expo-router";

import { SetupRouteGuard } from "@/lib/auth/navigation";

export default function SetupLayout() {
  return (
    <SetupRouteGuard>
      <Stack screenOptions={{ headerShown: false }} />
    </SetupRouteGuard>
  );
}
