import type { ImageSourcePropType } from "react-native";
import { Image } from "react-native";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { getLocalPreviewParamValue } from "@/lib/mocks/localPreview";
import { Pressable, Text, View } from "@/src/tw";

export type MockScreenState =
  | "ready"
  | "loading"
  | "empty"
  | "error"
  | "offline"
  | "permission";

export function getMockScreenState(value: string | string[] | undefined) {
  const state = getLocalPreviewParamValue(value);

  if (
    state === "loading" ||
    state === "empty" ||
    state === "error" ||
    state === "offline" ||
    state === "permission"
  ) {
    return state;
  }

  return "ready";
}

export function StateBanner({
  message,
  title,
  tone,
}: {
  message: string;
  title: string;
  tone: "offline" | "permission" | "info";
}) {
  const isOffline = tone === "offline";
  const isPermission = tone === "permission";

  return (
    <View
      className={`mt-4 flex-row items-start gap-3 rounded-lg border px-4 py-3 ${
        isOffline
          ? "border-neo-warning bg-[#FFF7E5]"
          : isPermission
            ? "border-neo-error bg-[#FFF1EF]"
            : "border-neo-info bg-[#EDF6FA]"
      }`}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={
          isOffline
            ? images.iconOffline
            : isPermission
              ? images.iconPermission
              : images.iconWarning
        }
        style={{
          height: 24,
          tintColor: isOffline
            ? colors.warning
            : isPermission
              ? colors.error
              : colors.info,
          width: 24,
        }}
      />
      <View className="min-w-0 flex-1">
        <Text
          className={`text-[15px] font-bold leading-5 ${
            isOffline
              ? "text-neo-warning"
              : isPermission
                ? "text-neo-error"
                : "text-neo-info"
          }`}
        >
          {title}
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text">
          {message}
        </Text>
      </View>
    </View>
  );
}

export function StateCard({
  actionLabel,
  image,
  message,
  onAction,
  title,
}: {
  actionLabel?: string;
  image: ImageSourcePropType;
  message: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <View className="items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-7">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={image}
        style={{ height: 138, width: 180 }}
      />
      <Text className="mt-4 text-center text-[20px] font-bold leading-7 text-neo-text">
        {title}
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-neo-text-muted">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          className="mt-5 min-h-12 items-center justify-center rounded-lg bg-neo-primary px-5"
          onPress={onAction}
        >
          <Text className="text-[15px] font-bold leading-5 text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }, (_, index) => (
        <View
          className="min-h-[96px] rounded-lg border border-neo-border bg-neo-surface-alt"
          key={index}
        />
      ))}
    </View>
  );
}
