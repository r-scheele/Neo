import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Platform } from "react-native";
import { PostHogProvider } from "posthog-react-native";

import { trackAnalyticsEvent } from "./events";
import { getPostHogClient } from "./posthogClient";

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const client = getPostHogClient();

  useEffect(() => {
    trackAnalyticsEvent("app_opened", {
      is_first_open: false,
      platform: Platform.OS,
    });
  }, []);

  if (!client) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider autocapture={false} client={client}>
      {children}
    </PostHogProvider>
  );
}
