import { useEffect, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

type ConnectionStatus = "connected" | "disconnected" | "checking";
type TestStatus = "not-tested" | "tested" | "failed";

type DetailStatusTone = "success" | "warning" | "error" | "muted";

type ConnectionDetail = {
  description: string;
  icon: ImageSourcePropType;
  label: string;
  statusLabel: string;
  tone: DetailStatusTone;
};

function getToneClassName(tone: DetailStatusTone) {
  if (tone === "success") {
    return "border-[#B9DCC4] bg-[#EEF8F0] text-neo-success";
  }

  if (tone === "warning") {
    return "border-[#EAD2A2] bg-[#FFF8E8] text-neo-warning";
  }

  if (tone === "error") {
    return "border-[#E8B9B2] bg-[#FFF1EF] text-neo-error";
  }

  return "border-neo-border bg-neo-surface-alt text-neo-text-muted";
}

function getStatusCopy(status: ConnectionStatus) {
  if (status === "checking") {
    return {
      title: "Checking connection",
      description: "Neo is checking the local mock status for this setup step.",
      badge: "Checking",
      tone: "warning" as const,
      image: images.iconInbox,
    };
  }

  if (status === "disconnected") {
    return {
      title: "Connection needs attention",
      description: "This mock status is disconnected. Retry when your setup is ready.",
      badge: "Disconnected",
      tone: "error" as const,
      image: images.errorWhatsappDisconnected,
    };
  }

  return {
    title: "Connection looks good",
    description: "Your WhatsApp Business number is connected and ready in this mock setup.",
    badge: "Connected",
    tone: "success" as const,
    image: images.iconInbox,
  };
}

function getConnectionDetails(
  connectionStatus: ConnectionStatus,
  testStatus: TestStatus,
): readonly ConnectionDetail[] {
  const isConnected = connectionStatus === "connected";

  return [
    {
      icon: images.iconCustomer,
      label: "Business number",
      description: isConnected ? "+234 80... .... ...." : "No number is connected yet",
      statusLabel: isConnected ? "Verified" : "Missing",
      tone: isConnected ? "success" : "error",
    },
    {
      icon: images.iconInbox,
      label: "Message source",
      description: isConnected ? "WhatsApp Business App" : "Waiting for connection",
      statusLabel: isConnected ? "Active" : "Inactive",
      tone: isConnected ? "success" : "muted",
    },
    {
      icon: images.iconAiDraft,
      label: "Test message",
      description: "Send a test message to confirm Neo can receive from this number.",
      statusLabel:
        testStatus === "tested"
          ? "Tested"
          : testStatus === "failed"
            ? "Failed"
            : "Not tested",
      tone:
        testStatus === "tested"
          ? "success"
          : testStatus === "failed"
            ? "error"
            : "warning",
    },
    {
      icon: images.iconPermission,
      label: "Connection health",
      description: "Health checks confirm Neo can safely receive your messages.",
      statusLabel:
        connectionStatus === "checking"
          ? "Checking"
          : isConnected
            ? "Good"
            : "Retry",
      tone:
        connectionStatus === "checking"
          ? "warning"
          : isConnected
            ? "success"
            : "error",
    },
  ];
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: DetailStatusTone;
}) {
  return (
    <View
      className={`min-h-9 flex-row items-center justify-center gap-2 rounded-lg border px-3 ${getToneClassName(
        tone,
      )}`}
    >
      <View className="h-5 w-5 items-center justify-center rounded-full border">
        <Text className="text-[10px] font-bold leading-3">
          {tone === "error" ? "!" : tone === "warning" ? "i" : "OK"}
        </Text>
      </View>
      <Text className="text-[13px] font-bold leading-4">{label}</Text>
    </View>
  );
}

function DetailRow({ detail }: { detail: ConnectionDetail }) {
  return (
    <View className="min-h-[92px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3">
      <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={detail.icon}
          style={{ height: 32, width: 32 }}
        />
      </View>

      <View className="flex-1">
        <Text className="text-[17px] font-bold leading-6 text-neo-text">
          {detail.label}
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
          {detail.description}
        </Text>
      </View>

      <View className="items-end gap-2">
        <StatusBadge label={detail.statusLabel} tone={detail.tone} />
        <Text className="text-[22px] leading-6 text-neo-text-muted">{">"}</Text>
      </View>
    </View>
  );
}

function WhatsAppSetupSkeleton() {
  return (
    <View className="gap-5">
      <View className="h-44 rounded-lg border border-neo-border bg-neo-surface-alt" />
      <View className="gap-0 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
        {[0, 1, 2, 3].map((row) => (
          <View
            className="min-h-[92px] flex-row items-center gap-3 border-b border-neo-border px-3"
            key={row}
          >
            <View className="h-14 w-14 rounded-lg bg-neo-surface-alt" />
            <View className="flex-1 gap-2">
              <View className="h-4 w-2/3 rounded-full bg-neo-surface-alt" />
              <View className="h-3 w-4/5 rounded-full bg-neo-surface-alt" />
            </View>
            <View className="h-8 w-20 rounded-lg bg-neo-surface-alt" />
          </View>
        ))}
      </View>
    </View>
  );
}

export function WhatsAppSetupScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connected");
  const [testStatus, setTestStatus] = useState<TestStatus>("not-tested");
  const [isActionPending, setIsActionPending] = useState(false);
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (actionTimerRef.current) {
        clearTimeout(actionTimerRef.current);
      }
    };
  }, []);

  const statusCopy = getStatusCopy(connectionStatus);
  const connectionDetails = getConnectionDetails(connectionStatus, testStatus);

  const scheduleMockResult = ({
    nextConnectionStatus,
    nextTestStatus,
  }: {
    nextConnectionStatus: ConnectionStatus;
    nextTestStatus: TestStatus;
  }) => {
    if (actionTimerRef.current) {
      clearTimeout(actionTimerRef.current);
    }

    setIsActionPending(true);
    setConnectionStatus("checking");
    actionTimerRef.current = setTimeout(() => {
      setConnectionStatus(nextConnectionStatus);
      setTestStatus(nextTestStatus);
      setIsActionPending(false);
    }, 900);
  };

  const handlePrimaryAction = () => {
    if (connectionStatus === "disconnected") {
      scheduleMockResult({
        nextConnectionStatus: "connected",
        nextTestStatus: "not-tested",
      });
      return;
    }

    scheduleMockResult({
      nextConnectionStatus: "connected",
      nextTestStatus: "tested",
    });
  };

  const handleTroubleshoot = () => {
    setConnectionStatus("disconnected");
    setTestStatus("failed");
    setIsActionPending(false);
  };

  const handleContinue = () => {
    router.push(routes.setup);
  };

  return (
    <ScrollView
      className="flex-1 bg-neo-background"
      contentContainerClassName="items-center"
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
        paddingTop: isCompactPhone ? 28 : 44,
        paddingBottom: 28,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <View className="flex-row items-center gap-3">
          <Link asChild href={routes.setup}>
            <Pressable
              accessibilityLabel="Back to setup checklist"
              accessibilityRole="link"
              className="min-h-11 w-11 items-start justify-center"
            >
              <Text className="text-[34px] leading-9 text-neo-text">{"<"}</Text>
            </Pressable>
          </Link>

          <View className="flex-1 items-center">
            <Text
              className="text-center text-[22px] font-bold leading-7 text-neo-text"
              numberOfLines={1}
            >
              WhatsApp setup
            </Text>
          </View>

          <View className="min-h-9 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt px-4">
            <Text className="text-[15px] font-bold leading-5 text-neo-text">
              Step 3 of 7
            </Text>
          </View>
        </View>

        <Text className="mt-5 text-center text-[17px] leading-6 text-neo-text-muted">
          Connect your WhatsApp Business number so Neo can assist you.
        </Text>

        {connectionStatus === "checking" ? (
          <View className="mt-7">
            <WhatsAppSetupSkeleton />
          </View>
        ) : (
          <View>
            <View className="mt-7 rounded-lg border border-neo-border bg-neo-surface p-5">
              <View className="flex-row items-center gap-4">
                <View
                  className={`h-24 w-24 items-center justify-center rounded-full ${
                    statusCopy.tone === "error" ? "bg-[#FFF1EF]" : "bg-[#EAF4EA]"
                  }`}
                >
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    source={statusCopy.image}
                    style={{ height: statusCopy.tone === "error" ? 86 : 56, width: statusCopy.tone === "error" ? 86 : 56 }}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-[22px] font-bold leading-7 ${
                      statusCopy.tone === "error" ? "text-neo-error" : "text-neo-primary"
                    }`}
                  >
                    {statusCopy.title}
                  </Text>
                  <Text className="mt-2 text-[16px] leading-6 text-neo-text-muted">
                    {statusCopy.description}
                  </Text>
                </View>
              </View>

              <View className="mt-5 h-px bg-neo-border" />

              <View className="mt-5 flex-row gap-5">
                <View className="flex-1">
                  <Text className="text-[14px] leading-5 text-neo-text-muted">
                    Last checked
                  </Text>
                  <Text className="mt-2 text-[16px] font-semibold leading-6 text-neo-text">
                    Today, 10:24 AM
                  </Text>
                </View>
                <View className="w-px bg-neo-border" />
                <View className="flex-1">
                  <Text className="text-[14px] leading-5 text-neo-text-muted">
                    Status
                  </Text>
                  <View className="mt-2 items-start">
                    <StatusBadge label={statusCopy.badge} tone={statusCopy.tone} />
                  </View>
                </View>
              </View>
            </View>

            <Text className="mt-6 text-[18px] font-bold leading-6 text-neo-text">
              Connection details
            </Text>

            <View className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
              {connectionDetails.map((detail) => (
                <DetailRow detail={detail} key={detail.label} />
              ))}
            </View>

            <View className="mt-6 flex-row gap-4 rounded-lg border border-neo-border bg-neo-surface-alt px-4 py-4">
              <View className="h-12 w-12 items-center justify-center rounded-full border border-neo-info">
                <Text className="text-[22px] font-bold leading-7 text-neo-info">
                  i
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-[16px] font-bold leading-6 text-neo-text">
                  How it works
                </Text>
                <Text className="mt-1 text-[15px] leading-6 text-neo-text-muted">
                  Neo will validate your connection through a secure backend later.
                  This screen uses local mock status only.
                </Text>
              </View>
            </View>
          </View>
        )}

        <Pressable
          accessibilityLabel={
            connectionStatus === "disconnected"
              ? "Retry WhatsApp connection"
              : "Test connection"
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: isActionPending }}
          className={`mt-7 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg px-5 ${
            isActionPending ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={isActionPending}
          onPress={handlePrimaryAction}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconInbox}
            style={{ height: 28, width: 28 }}
          />
          <Text
            className={`text-[17px] font-bold leading-6 ${
              isActionPending ? "text-neo-text-muted" : "text-neo-surface"
            }`}
          >
            {isActionPending
              ? "Checking status"
              : connectionStatus === "disconnected"
                ? "Retry connection"
                : "Test connection"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityHint="Manual number entry is a placeholder until real WhatsApp setup is connected."
          accessibilityLabel="Enter number manually"
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          className="mt-4 min-h-14 flex-row items-center justify-center gap-3 rounded-lg border border-neo-primary bg-neo-surface px-5"
          disabled
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconCustomer}
            style={{ height: 26, width: 26 }}
          />
          <Text className="text-[17px] font-bold leading-6 text-neo-primary">
            Enter number manually
          </Text>
        </Pressable>

        <View className="mt-5 h-px bg-neo-border" />

        <View className="mt-3 flex-row items-center justify-between gap-4">
          <Link asChild href={routes.setup}>
            <Pressable
              accessibilityLabel="Back to checklist"
              accessibilityRole="link"
              className="min-h-11 flex-row items-center gap-3"
            >
              <Text className="text-[24px] leading-7 text-neo-primary">{"<"}</Text>
              <Text className="text-[15px] font-semibold leading-5 text-neo-primary">
                Back to checklist
              </Text>
            </Pressable>
          </Link>

          <Pressable
            accessibilityHint="Shows the local disconnected state and retry control."
            accessibilityLabel="Troubleshoot WhatsApp setup"
            accessibilityRole="button"
            className="min-h-11 flex-row items-center gap-2"
            onPress={handleTroubleshoot}
          >
            <Text className="text-[15px] font-semibold leading-5 text-neo-primary">
              Troubleshoot
            </Text>
            <View className="h-8 w-8 items-center justify-center rounded-full border border-neo-primary">
              <Text className="text-[16px] font-bold leading-5 text-neo-primary">
                ?
              </Text>
            </View>
          </Pressable>
        </View>

        {connectionStatus === "connected" && testStatus === "tested" ? (
          <Pressable
            accessibilityLabel="Continue to setup checklist"
            accessibilityRole="button"
            className="mt-5 min-h-12 w-full items-center justify-center rounded-lg bg-neo-surface-alt px-5"
            onPress={handleContinue}
          >
            <Text className="text-[16px] font-bold leading-5 text-neo-primary">
              Continue setup
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}
