import { Tabs } from "expo-router";
import type { ColorValue, ImageSourcePropType } from "react-native";
import { Image } from "react-native";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import type { AttentionTabName } from "@/features/operations/attentionBadges";
import {
  attentionBadgeDescriptions,
  getAttentionBadgeValue,
  getTabAttentionAccessibilityLabel,
} from "@/features/operations/attentionBadges";
import { ProtectedRouteGuard } from "@/lib/auth/navigation";
import { useOperationsStore } from "@/stores/useOperationsStore";

type MainTab = {
  icon: ImageSourcePropType;
  name: AttentionTabName;
  title: string;
};

const mainTabs: readonly MainTab[] = [
  {
    icon: images.iconToday,
    name: "today",
    title: "Today",
  },
  {
    icon: images.iconInbox,
    name: "inbox",
    title: "Inbox",
  },
  {
    icon: images.iconApprovals,
    name: "approvals",
    title: "Approvals",
  },
  {
    icon: images.iconFollowUps,
    name: "follow-ups",
    title: "Follow-ups",
  },
  {
    icon: images.iconSettings,
    name: "settings",
    title: "Settings",
  },
];

function TabIcon({
  color,
  focused,
  icon,
}: {
  color: ColorValue;
  focused: boolean;
  icon: ImageSourcePropType;
}) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      source={icon}
      style={{
        height: focused ? 26 : 24,
        tintColor: color,
        width: focused ? 26 : 24,
      }}
    />
  );
}

export default function TabsLayout() {
  const attentionBadgeCounts = useOperationsStore(
    (store) => store.attentionCounts,
  );

  return (
    <ProtectedRouteGuard>
      <Tabs
        initialRouteName="today"
        screenOptions={{
          headerShown: false,
          tabBarActiveBackgroundColor: colors.surface,
          tabBarActiveTintColor: colors.primary,
          tabBarHideOnKeyboard: true,
          tabBarInactiveBackgroundColor: colors.surface,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarItemStyle: {
            minHeight: 60,
            paddingTop: 7,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            lineHeight: 16,
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 76,
            minHeight: 68,
            paddingBottom: 10,
            paddingTop: 6,
          },
        }}
      >
        {mainTabs.map((tab) => {
          const badgeCount = attentionBadgeCounts[tab.name];
          const badgeValue = getAttentionBadgeValue(badgeCount);

          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                tabBarAccessibilityLabel: getTabAttentionAccessibilityLabel({
                  count: badgeCount,
                  description: attentionBadgeDescriptions[tab.name],
                  title: tab.title,
                }),
                tabBarBadge: badgeValue,
                tabBarBadgeStyle: {
                  backgroundColor: colors.terracotta,
                  borderColor: colors.surface,
                  borderWidth: 1,
                  color: colors.surface,
                  fontSize: 11,
                  fontWeight: "700",
                  lineHeight: 14,
                  minWidth: 18,
                },
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} icon={tab.icon} />
                ),
                title: tab.title,
              }}
            />
          );
        })}
      </Tabs>
    </ProtectedRouteGuard>
  );
}
