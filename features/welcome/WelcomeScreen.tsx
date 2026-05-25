import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

type WelcomeHighlight = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
  iconContainerClassName: string;
};

const welcomeHighlights: readonly WelcomeHighlight[] = [
  {
    title: "Reply faster",
    description: "Organize chats and draft smart replies in your voice.",
    icon: images.iconInbox,
    iconContainerClassName: "bg-[#EDF4E9]",
  },
  {
    title: "Review receipts safely",
    description: "Never treat screenshots as proof. You stay in control.",
    icon: images.iconReceiptReview,
    iconContainerClassName: "bg-[#FFF5E2]",
  },
  {
    title: "Follow up without forgetting",
    description: "Neo reminds you kindly, so no customer falls through.",
    icon: images.iconFollowUps,
    iconContainerClassName: "bg-[#EEF5F8]",
  },
];

export function WelcomeScreen() {
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const logoSize = isCompactPhone ? 58 : 70;
  const heroWidth = Math.min(width - horizontalPadding * 2, 380);
  const heroHeight = isCompactPhone ? 260 : 330;

  return (
    <ScrollView
      className="flex-1 bg-neo-background"
      contentContainerClassName="items-center"
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
        paddingTop: isCompactPhone ? 28 : 48,
        paddingBottom: 28,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px] items-center">
        <View className="items-center">
          <View className="flex-row items-center justify-center gap-3">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.logoMarkNeo}
              style={{ height: logoSize, width: logoSize }}
            />
            <Text className="font-serif text-[46px] font-bold leading-[54px] text-neo-primary">
              Neo
            </Text>
          </View>

          <View className="mt-2 flex-row items-center justify-center gap-2">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconPermission}
              style={{ height: 22, width: 22 }}
            />
            <Text className="text-[18px] leading-6 text-neo-text-muted">
              Commerce assistant
            </Text>
          </View>

          <View className="mt-5 min-h-11 flex-row items-center gap-3 rounded-lg border border-neo-border bg-neo-surface px-4">
            <View
              accessibilityLabel="Nigeria"
              className="h-5 w-8 flex-row overflow-hidden rounded-[2px] border border-neo-border"
            >
              <View className="flex-1 bg-neo-success" />
              <View className="flex-1 bg-neo-surface" />
              <View className="flex-1 bg-neo-success" />
            </View>
            <Text className="text-[15px] font-semibold leading-5 text-neo-text">
              Built for WhatsApp sellers in Nigeria
            </Text>
          </View>
        </View>

        <View
          className="mt-6 w-full items-center justify-center overflow-hidden"
          style={{ height: heroHeight }}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.onboardingHeroNeoOperatingSystem}
            style={{
              height: heroWidth * 2.08,
              transform: [{ translateY: isCompactPhone ? 10 : 18 }],
              width: heroWidth,
            }}
          />
        </View>

        <View className="mt-5 items-center gap-3">
          <Text className="text-center text-[28px] font-bold leading-[34px] text-neo-text">
            Run your WhatsApp business{"\n"}with clarity and control
          </Text>
          <Text className="max-w-[350px] text-center text-[16px] leading-6 text-neo-text-muted">
            Neo organizes chats, orders, payments, and follow-ups so you can sell
            more and worry less.
          </Text>
        </View>

        <View className="mt-7 w-full rounded-lg border border-neo-border bg-neo-surface px-4 py-2">
          {welcomeHighlights.map((item, index) => (
            <View
              className={`flex-row gap-4 py-4 ${
                index < welcomeHighlights.length - 1
                  ? "border-b border-neo-border"
                  : ""
              }`}
              key={item.title}
            >
              <View
                className={`h-14 w-14 items-center justify-center rounded-lg border border-neo-border ${item.iconContainerClassName}`}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={item.icon}
                  style={{ height: 34, width: 34 }}
                />
              </View>
              <View className="flex-1 justify-center">
                <Text className="text-[18px] font-bold leading-6 text-neo-text">
                  {item.title}
                </Text>
                <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Link asChild href={routes.signIn}>
          <Pressable
            accessibilityLabel="Start setup"
            accessibilityRole="button"
            className="mt-7 min-h-12 w-full items-center justify-center rounded-lg bg-neo-primary px-5"
          >
            <Text className="text-[16px] font-bold leading-5 text-neo-surface">
              Start setup
            </Text>
          </Pressable>
        </Link>

        <Link asChild href={routes.signIn}>
          <Pressable
            accessibilityLabel="I already have an account"
            accessibilityRole="button"
            className="mt-4 min-h-11 flex-row items-center justify-center gap-3 px-3"
          >
            <View className="h-7 w-7 items-center justify-center">
              <View className="h-3 w-3 rounded-full border-2 border-neo-primary" />
              <View className="mt-1 h-3 w-6 rounded-t-full border-2 border-b-0 border-neo-primary" />
            </View>
            <Text className="text-[16px] font-semibold leading-6 text-neo-primary">
              I already have an account
            </Text>
          </Pressable>
        </Link>

        <View className="mt-3 flex-row items-center justify-center gap-2 px-3">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconPermission}
            style={{ height: 18, width: 18 }}
          />
          <Text className="text-center text-[13px] leading-5 text-neo-text-muted">
            Your data is private and secure. You are in control.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
