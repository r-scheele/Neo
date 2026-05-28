import "@/src/global.css";

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/colors";
import { AnalyticsProvider } from "@/lib/analytics";
import { clerkPublishableKey } from "@/lib/auth/clerk";
import { Text, View } from "@/src/tw";

function MissingClerkConfigScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neo-background px-5">
      <View className="w-full max-w-[430px] rounded-lg border border-neo-border bg-neo-surface px-5 py-6">
        <Text className="text-[22px] font-bold leading-7 text-neo-text">
          Clerk setup needed
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-neo-text-muted">
          Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to your local environment to
          use Neo authentication. Do not add private Clerk keys to the app.
        </Text>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

export default function RootLayout() {
  if (!clerkPublishableKey) {
    return (
      <AnalyticsProvider>
        <MissingClerkConfigScreen />
      </AnalyticsProvider>
    );
  }

  return (
    <AnalyticsProvider>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        tokenCache={tokenCache}
      >
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerShown: false,
          }}
        />
        <StatusBar style="dark" />
      </ClerkProvider>
    </AnalyticsProvider>
  );
}
