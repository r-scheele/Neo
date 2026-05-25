import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import type { Href } from "expo-router";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

type SetupChecklistViewState = "loading" | "ready" | "empty" | "error";
type SetupTaskStatus = "done" | "current" | "todo";

type SetupTask = {
  id: string;
  title: string;
  description: string;
  status: SetupTaskStatus;
  icon: ImageSourcePropType;
  route?: string;
};

const setupTasks: readonly SetupTask[] = [
  {
    id: "business-profile",
    title: "Business profile",
    description: "Name, category, location, phone",
    status: "done",
    icon: images.iconSettings,
    route: routes.businessProfile,
  },
  {
    id: "business-type",
    title: "Business type",
    description: "Category and key offerings",
    status: "done",
    icon: images.iconProduct,
    route: routes.businessType,
  },
  {
    id: "whatsapp-status",
    title: "WhatsApp status",
    description: "Connect and verify your number",
    status: "done",
    icon: images.iconInbox,
    route: routes.whatsappSetup,
  },
  {
    id: "ai-personality",
    title: "AI personality & tone",
    description: "Set how Neo should talk for you",
    status: "current",
    icon: images.iconAiDraft,
    route: routes.aiPersonality,
  },
  {
    id: "payment-rules",
    title: "Payment rules",
    description: "Methods and receipt review rules",
    status: "todo",
    icon: images.iconReceiptReview,
  },
  {
    id: "delivery-zones",
    title: "Delivery zones",
    description: "Areas and delivery settings",
    status: "todo",
    icon: images.iconDelivery,
  },
  {
    id: "product-basics",
    title: "Product basics",
    description: "Add key products and prices",
    status: "todo",
    icon: images.iconProduct,
  },
];

const completedTaskCount = setupTasks.filter((task) => task.status === "done").length;
const totalTaskCount = setupTasks.length;
const nextTask = setupTasks.find((task) => task.id === "payment-rules") ?? setupTasks[0];

function getStatusLabel(status: SetupTaskStatus) {
  if (status === "done") {
    return "Done";
  }

  if (status === "current") {
    return "Current";
  }

  return "To do";
}

function getStatusClassName(status: SetupTaskStatus) {
  if (status === "done") {
    return "border-neo-success bg-[#F0F8F3] text-neo-success";
  }

  if (status === "current") {
    return "border-neo-warning bg-[#FFF8E8] text-neo-warning";
  }

  return "border-neo-border bg-neo-surface text-neo-text-muted";
}

function SetupSkeleton() {
  return (
    <View className="gap-4">
      <View className="h-44 rounded-lg border border-neo-border bg-neo-surface-alt" />
      <View className="h-24 rounded-lg border border-neo-border bg-neo-surface-alt" />
      <View className="overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
        {[0, 1, 2, 3].map((item) => (
          <View
            className="min-h-20 flex-row items-center gap-3 border-b border-neo-border px-4"
            key={item}
          >
            <View className="h-12 w-12 rounded-lg bg-neo-surface-alt" />
            <View className="flex-1 gap-2">
              <View className="h-4 w-3/5 rounded-full bg-neo-surface-alt" />
              <View className="h-3 w-4/5 rounded-full bg-neo-surface-alt" />
            </View>
            <View className="h-8 w-20 rounded-full bg-neo-surface-alt" />
          </View>
        ))}
      </View>
    </View>
  );
}

function SetupMessageState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <View className="items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-8">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={images.illustrationSetupChecklist}
        style={{ height: 132, width: 176 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        {title}
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        {description}
      </Text>
    </View>
  );
}

function SetupTaskRow({ task }: { task: SetupTask }) {
  const isAvailable = Boolean(task.route);
  const rowContent = (
    <Pressable
      accessibilityHint={
        isAvailable ? "Opens this setup task." : "This setup task screen is not available yet."
      }
      accessibilityLabel={`${task.title}, ${getStatusLabel(task.status)}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isAvailable }}
      className={`min-h-[92px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3 ${
        task.status === "current" ? "bg-[#FFFAEF]" : "bg-neo-surface"
      } ${isAvailable ? "" : "opacity-90"}`}
      disabled={!isAvailable}
    >
      <View className="h-14 w-14 items-center justify-center rounded-lg border border-neo-border bg-neo-background">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={task.icon}
          style={{ height: 32, width: 32 }}
        />
      </View>
      <View className="flex-1">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          {task.title}
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
          {task.description}
        </Text>
        {!isAvailable ? (
          <Text className="mt-1 text-[12px] font-semibold leading-4 text-neo-text-muted">
            Task screen not ready
          </Text>
        ) : null}
      </View>
      <View className="items-end gap-2">
        <View
          className={`min-h-8 items-center justify-center rounded-full border px-3 ${getStatusClassName(
            task.status,
          )}`}
        >
          <Text className="text-[13px] font-bold leading-4">
            {getStatusLabel(task.status)}
          </Text>
        </View>
        <Text className="text-[24px] leading-7 text-neo-text-muted">{">"}</Text>
      </View>
    </Pressable>
  );

  if (task.route) {
    return (
      <Link asChild href={task.route as Href}>
        {rowContent}
      </Link>
    );
  }

  return rowContent;
}

export function SetupChecklistScreen() {
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [viewState, setViewState] = useState<SetupChecklistViewState>("ready");

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
        <View className="flex-row items-start justify-between gap-3">
          <Link asChild href={routes.signIn}>
            <Pressable
              accessibilityLabel="Back to sign in"
              accessibilityRole="link"
              className="min-h-11 w-11 items-start justify-center"
            >
              <Text className="text-[34px] leading-9 text-neo-primary">{"<"}</Text>
            </Pressable>
          </Link>
          <View className="flex-1 items-center">
            <Text className="text-center font-serif text-[32px] font-bold leading-10 text-neo-text">
              Setup Neo
            </Text>
            <Text className="mt-1 text-center text-[15px] leading-5 text-neo-text-muted">
              Let us get your business ready to reply safely
            </Text>
          </View>
          <View className="min-h-9 flex-row items-center gap-2 rounded-full border border-neo-border bg-neo-surface px-3">
            <View className="h-2.5 w-2.5 rounded-full bg-neo-success" />
            <Text className="text-[13px] font-semibold leading-4 text-neo-primary">
              Connected
            </Text>
          </View>
        </View>

        <View className="mt-7">
          {viewState === "loading" ? <SetupSkeleton /> : null}

          {viewState === "empty" ? (
            <SetupMessageState
              description="No setup tasks are available right now. You can continue when the setup flow is configured."
              title="Setup is ready"
            />
          ) : null}

          {viewState === "error" ? (
            <View className="rounded-lg border border-neo-border bg-neo-surface p-5">
              <Text className="text-[18px] font-bold leading-6 text-neo-text">
                Could not load setup status
              </Text>
              <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
                Check your connection and try again. No setup data was changed.
              </Text>
              <Pressable
                accessibilityLabel="Retry loading setup status"
                accessibilityRole="button"
                className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-4"
                onPress={() => setViewState("ready")}
              >
                <Text className="text-[15px] font-bold leading-5 text-neo-surface">
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : null}

          {viewState === "ready" ? (
            <View>
              <View className="rounded-lg border border-neo-border bg-neo-surface p-4">
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-[15px] leading-5 text-neo-text-muted">
                      Setup progress
                    </Text>
                    <View className="mt-3 flex-row items-end gap-2">
                      <Text className="text-[40px] font-bold leading-[44px] text-neo-primary">
                        {completedTaskCount}
                      </Text>
                      <Text className="pb-1 text-[26px] font-bold leading-8 text-neo-text">
                        of {totalTaskCount} done
                      </Text>
                    </View>
                    <View className="mt-4 h-2 overflow-hidden rounded-full bg-neo-border">
                      <View className="h-2 w-[43%] rounded-full bg-neo-primary" />
                    </View>
                    <Text className="mt-4 text-[14px] leading-5 text-neo-text-muted">
                      Almost there. Complete the next steps to unlock safer AI
                      assistance.
                    </Text>
                  </View>
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    source={images.illustrationSetupChecklist}
                    style={{
                      height: isCompactPhone ? 118 : 140,
                      width: isCompactPhone ? 126 : 150,
                    }}
                  />
                </View>
              </View>

              <Pressable
                accessibilityHint="The Payment rules screen has not been built yet."
                accessibilityLabel="Next step, Payment rules, needs attention"
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
                className="mt-5 min-h-24 flex-row items-center gap-4 rounded-lg border border-neo-warning bg-neo-surface px-4 py-4"
                disabled
              >
                <View className="h-16 w-16 items-center justify-center rounded-full border border-neo-border bg-neo-background">
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    source={nextTask.icon}
                    style={{ height: 38, width: 38 }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] font-bold uppercase leading-4 text-neo-warning">
                    Your next step
                  </Text>
                  <Text className="mt-1 text-[20px] font-bold leading-7 text-neo-text">
                    {nextTask.title}
                  </Text>
                  <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
                    Set how customers pay and how receipts are reviewed safely.
                  </Text>
                  <Text className="mt-1 text-[12px] font-semibold leading-4 text-neo-warning">
                    Task screen not ready
                  </Text>
                </View>
                <View className="items-end gap-2">
                  <View className="rounded-full border border-neo-warning px-3 py-1">
                    <Text className="text-[13px] font-bold leading-4 text-neo-warning">
                      Needs attention
                    </Text>
                  </View>
                  <Text className="text-[28px] leading-8 text-neo-text-muted">{">"}</Text>
                </View>
              </Pressable>

              <Text className="mt-6 text-[16px] font-semibold leading-6 text-neo-text">
                Complete these steps
              </Text>

              <View className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
                {setupTasks.map((task) => (
                  <SetupTaskRow key={task.id} task={task} />
                ))}
              </View>

              <Pressable
                accessibilityHint="Setup help is not available yet."
                accessibilityLabel="Need help with setup"
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
                className="mt-5 min-h-16 flex-row items-center gap-4 rounded-lg border border-neo-border bg-neo-surface px-4"
                disabled
              >
                <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-neo-gold">
                  <Text className="text-[22px] font-bold leading-7 text-neo-warning">?</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-bold leading-5 text-neo-text">
                    Need help with setup?
                  </Text>
                  <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
                    Help center and support chat are coming later.
                  </Text>
                </View>
                <Text className="text-[24px] leading-7 text-neo-text-muted">{">"}</Text>
              </Pressable>

              <Pressable
                accessibilityHint="Individual setup screens have not been built yet."
                accessibilityLabel="Continue setup unavailable"
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
                className="mt-5 min-h-14 flex-row items-center justify-center gap-3 rounded-lg bg-neo-surface-alt px-5"
                disabled
              >
                <Text className="text-[16px] font-bold leading-5 text-neo-text-muted">
                  Task screens coming soon
                </Text>
                <Text className="text-[22px] leading-7 text-neo-text-muted">{">"}</Text>
              </Pressable>

              <Pressable
                accessibilityLabel="Finish later"
                accessibilityRole="button"
                className="mt-4 min-h-11 items-center justify-center px-4"
              >
                <Text className="text-[16px] font-semibold leading-6 text-neo-primary">
                  Finish later
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
