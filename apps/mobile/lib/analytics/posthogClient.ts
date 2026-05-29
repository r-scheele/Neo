import PostHog, { type PostHogOptions } from "posthog-react-native";

export type AnalyticsPrimitive = string | number | boolean | null;
export type AnalyticsProperties = Readonly<Record<string, AnalyticsPrimitive | undefined>>;

const defaultPostHogHost = "https://us.i.posthog.com";

function normalizePublicEnvValue(value: string | undefined): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}

const posthogKey = normalizePublicEnvValue(process.env.EXPO_PUBLIC_POSTHOG_KEY);
const posthogHost =
  normalizePublicEnvValue(process.env.EXPO_PUBLIC_POSTHOG_HOST) ??
  defaultPostHogHost;

const posthogOptions: PostHogOptions = {
  captureAppLifecycleEvents: false,
  customAppProperties: (properties) => ({
    $app_build: properties.$app_build,
    $app_name: properties.$app_name,
    $app_namespace: properties.$app_namespace,
    $app_version: properties.$app_version,
    $device_type: properties.$device_type,
    $os_name: properties.$os_name,
    $os_version: properties.$os_version,
  }),
  defaultOptIn: true,
  disableGeoip: true,
  disableRemoteConfig: true,
  disableSurveys: true,
  enablePersistSessionIdAcrossRestart: false,
  enableSessionReplay: false,
  fetchRetryCount: 2,
  flushAt: 10,
  flushInterval: 30000,
  host: posthogHost,
  personProfiles: "never",
  preloadFeatureFlags: false,
  sendFeatureFlagEvent: false,
  sessionReplayConfig: {
    captureLog: false,
    captureNetworkTelemetry: false,
    maskAllImages: true,
    maskAllSandboxedViews: true,
    maskAllTextInputs: true,
    sampleRate: 0,
  },
  setDefaultPersonProperties: false,
};

let posthogClient: PostHog | null = null;

export function isAnalyticsConfigured(): boolean {
  return posthogKey !== null;
}

export function getPostHogClient(): PostHog | null {
  if (!posthogKey) {
    return null;
  }

  try {
    posthogClient ??= new PostHog(posthogKey, posthogOptions);
  } catch {
    posthogClient = null;
  }

  return posthogClient;
}

export function captureAnalyticsEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
): void {
  let client: PostHog | null;

  try {
    client = getPostHogClient();
  } catch {
    return;
  }

  if (!client) {
    return;
  }

  try {
    client.capture(eventName, compactProperties(properties));
  } catch {
    // Analytics must never block product behavior.
  }
}

export function resetAnalyticsIdentity(): void {
  const client = getPostHogClient();

  if (!client) {
    return;
  }

  try {
    client.reset();
  } catch {
    // Analytics identity cleanup must not block sign-out.
  }
}

function compactProperties(properties: AnalyticsProperties): Record<string, AnalyticsPrimitive> {
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, AnalyticsPrimitive] => {
      const [, value] = entry;
      return value !== undefined;
    }),
  );
}
