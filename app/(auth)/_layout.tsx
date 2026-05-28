import { Stack } from "expo-router";

import { PublicAuthRouteGuard } from "@/lib/auth/navigation";

export default function AuthLayout() {
  return (
    <PublicAuthRouteGuard>
      <Stack screenOptions={{ headerShown: false }} />
    </PublicAuthRouteGuard>
  );
}
