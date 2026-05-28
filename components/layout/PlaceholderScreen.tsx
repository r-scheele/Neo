import { useState } from "react";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import {
  SkeletonRows,
  StateBanner,
  StateCard,
} from "@/components/feedback/ScreenState";
import { images } from "@/constants/images";
import { Text, View } from "@/src/tw";

type PlaceholderScreenProps = {
  title: string;
  description?: string;
  state?: MockScreenState;
};

function getPlaceholderEmptyImage(title: string) {
  if (title === "Follow-ups") {
    return images.emptyFollowUps;
  }

  if (title === "Settings") {
    return images.iconSettings;
  }

  if (title === "Customer profile") {
    return images.iconCustomer;
  }

  return images.errorPermissionDenied;
}

export function PlaceholderScreen({
  title,
  description,
  state = "ready",
}: PlaceholderScreenProps) {
  const [screenState, setScreenState] = useState<MockScreenState>(state);

  if (screenState === "loading") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <SkeletonRows count={4} />
      </View>
    );
  }

  if (screenState === "empty") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          image={getPlaceholderEmptyImage(title)}
          message={
            description ??
            "When this MVP screen has local data, it will appear here with one clear next action."
          }
          title={title === "Follow-ups" ? "No follow-ups due" : `${title} is empty`}
        />
      </View>
    );
  }

  if (screenState === "error") {
    return (
      <View className="flex-1 bg-neo-background px-5 py-16">
        <StateCard
          actionLabel={`Retry ${title}`}
          image={images.errorOffline}
          message={`Could not load ${title.toLowerCase()}. Retry to restore the local mock screen.`}
          onAction={() => setScreenState("ready")}
          title={`${title} failed to load`}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neo-background px-5 py-16">
      {screenState === "offline" ? (
        <StateBanner
          message={`Cached ${title.toLowerCase()} details remain visible. Risky changes are disabled until Neo is online.`}
          title="Offline read-only state"
          tone="offline"
        />
      ) : null}
      {screenState === "permission" ? (
        <StateBanner
          message={`You do not have permission to change ${title.toLowerCase()} yet. Ask the owner/admin for access.`}
          title="Permission needed"
          tone="permission"
        />
      ) : null}
      <View className="rounded-lg border border-neo-border bg-neo-surface p-4">
        <Text className="text-[22px] font-bold leading-7 text-neo-text">{title}</Text>
        {description ? (
          <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
