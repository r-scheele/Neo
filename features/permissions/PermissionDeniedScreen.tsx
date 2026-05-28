import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

import type { MockStaffRole, SensitivePermissionAction } from "./permissionData";
import {
  allowedStaffActions,
  permissionActionDetails,
  permittedSensitiveRoles,
  roleDetails,
} from "./permissionData";

type PermissionDeniedScreenProps = {
  action: SensitivePermissionAction;
  currentRole: MockStaffRole;
};

type Notice = {
  message: string;
  title: string;
};

function Header({ onHelp }: { onHelp: () => void }) {
  const router = useRouter();

  return (
    <View className="border-b border-neo-border pb-4">
      <View className="flex-row items-center justify-between gap-3">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="min-h-12 w-12 items-start justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-[38px] leading-10 text-neo-text">{"<"}</Text>
        </Pressable>

        <Text
          className="min-w-0 flex-1 text-center text-[25px] font-bold leading-8 text-neo-text"
          numberOfLines={1}
        >
          Access limited
        </Text>

        <Pressable
          accessibilityLabel="More permission help"
          accessibilityRole="button"
          className="min-h-12 w-12 items-end justify-center"
          onPress={onHelp}
        >
          <Text className="text-[28px] font-bold leading-8 text-neo-text">
            ...
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function NoticeBanner({ notice }: { notice: Notice }) {
  return (
    <View className="mt-4 rounded-lg border border-neo-info bg-[#EDF6FA] px-4 py-3">
      <Text className="text-[15px] font-bold leading-5 text-neo-info">
        {notice.title}
      </Text>
      <Text className="mt-1 text-[14px] leading-5 text-neo-text">
        {notice.message}
      </Text>
    </View>
  );
}

function GuardrailChip({
  label,
  tone,
}: {
  label: string;
  tone: "warning" | "info";
}) {
  const isWarning = tone === "warning";

  return (
    <View
      className={`min-h-11 flex-1 basis-[30%] flex-row items-center justify-center gap-2 rounded-lg border px-2 ${
        isWarning
          ? "border-[#E8C98E] bg-[#FFF7E5]"
          : "border-[#B9D3DF] bg-[#EDF6FA]"
      }`}
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border ${
          isWarning ? "border-neo-warning" : "border-neo-info"
        }`}
      >
        <Text
          className={`text-[10px] font-bold leading-3 ${
            isWarning ? "text-neo-warning" : "text-neo-info"
          }`}
        >
          {isWarning ? "!" : "i"}
        </Text>
      </View>
      <Text
        className={`text-center text-[13px] font-bold leading-4 ${
          isWarning ? "text-neo-warning" : "text-neo-info"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

function RoleBadge({
  label,
  tone,
}: {
  label: string;
  tone: "info" | "warning";
}) {
  const isWarning = tone === "warning";

  return (
    <View
      className={`self-start rounded-lg border px-3 py-1 ${
        isWarning
          ? "border-[#E8C98E] bg-[#FFF7E5]"
          : "border-[#B9D3DF] bg-[#EDF6FA]"
      }`}
    >
      <Text
        className={`text-[14px] font-bold leading-5 ${
          isWarning ? "text-neo-warning" : "text-neo-info"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

function DetailRow({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <View className="flex-row gap-4 border-b border-neo-border px-3 py-4">
      <View className="h-16 w-16 items-center justify-center rounded-full border border-neo-border bg-[#FAF6EE]">
        {icon}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[18px] font-bold leading-6 text-neo-text">
          {title}
        </Text>
        <View className="mt-2">{children}</View>
      </View>
    </View>
  );
}

export function PermissionDeniedScreen({
  action,
  currentRole,
}: PermissionDeniedScreenProps) {
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [notice, setNotice] = useState<Notice | null>(null);
  const actionDetail = permissionActionDetails[action];
  const currentRoleDetail = roleDetails[currentRole];
  const requiredLabel =
    action === "safety-settings" ? "Owner" : "Owner or manager";
  const permittedRolesForAction: readonly MockStaffRole[] =
    action === "safety-settings" ? ["owner"] : permittedSensitiveRoles;

  useEffect(() => {
    trackAnalyticsEvent("permission_denied_seen", {
      action_type: action,
      role_type: currentRole,
    });
  }, [action, currentRole]);

  return (
    <ScrollView
      className="flex-1 bg-neo-background"
      contentContainerClassName="items-center"
      contentContainerStyle={{
        paddingBottom: 28,
        paddingHorizontal: horizontalPadding,
        paddingTop: isCompactPhone ? 20 : 28,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <Header
          onHelp={() =>
            setNotice({
              message:
                "These are mock role gates for the local MVP. Production permissions must be enforced by a trusted backend.",
              title: "Local role gate",
            })
          }
        />

        {notice ? <NoticeBanner notice={notice} /> : null}

        <View className="items-center px-2 pt-8">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.errorPermissionDenied}
            style={{
              height: isCompactPhone ? 178 : 224,
              width: isCompactPhone ? 220 : 274,
            }}
          />

          <Text className="mt-5 text-center text-[32px] font-bold leading-10 text-neo-text">
            Permission needed
          </Text>
          <Text className="mt-3 text-center text-[17px] leading-7 text-neo-text">
            This action is restricted because it is sensitive and requires owner
            or manager permission.
          </Text>
        </View>

        <View className="mt-6 flex-row flex-wrap gap-2">
          <GuardrailChip label="Sensitive action" tone="warning" />
          <GuardrailChip label={actionDetail.restrictedLabel} tone="warning" />
          <GuardrailChip label="Protected by role" tone="info" />
        </View>

        <View className="mt-6 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
          <DetailRow
            icon={
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={actionDetail.icon}
                style={{ height: 36, tintColor: colors.info, width: 36 }}
              />
            }
            title="Restricted action"
          >
            <View className="flex-row items-start justify-between gap-3">
              <Text className="min-w-0 flex-1 text-[15px] leading-6 text-neo-text-muted">
                {actionDetail.description}
              </Text>
              <RoleBadge label="Restricted" tone="warning" />
            </View>
          </DetailRow>

          <DetailRow
            icon={
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconCustomer}
                style={{ height: 36, tintColor: colors.info, width: 36 }}
              />
            }
            title="Your role"
          >
            <RoleBadge label={currentRoleDetail.label} tone="info" />
            <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
              {currentRoleDetail.description}
            </Text>
          </DetailRow>

          <DetailRow
            icon={
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconPermission}
                style={{ height: 36, tintColor: colors.warning, width: 36 }}
              />
            }
            title="Required role"
          >
            <RoleBadge label={requiredLabel} tone="warning" />
            <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
              Allowed locally for{" "}
              {permittedRolesForAction
                .map((role) => roleDetails[role].label)
                .join(" and ")}
              .
            </Text>
          </DetailRow>

          <DetailRow
            icon={
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconPaid}
                style={{ height: 36, tintColor: colors.success, width: 36 }}
              />
            }
            title="What you can still do"
          >
            <View className="gap-2">
              {allowedStaffActions.map((allowedAction) => (
                <View className="flex-row items-start gap-2" key={allowedAction}>
                  <Text className="text-[17px] font-bold leading-5 text-neo-success">
                    ok
                  </Text>
                  <Text className="min-w-0 flex-1 text-[15px] leading-5 text-neo-text-muted">
                    {allowedAction}
                  </Text>
                </View>
              ))}
            </View>
          </DetailRow>
        </View>

        <Pressable
          accessibilityLabel="Ask owner or admin for permission"
          accessibilityRole="button"
          className="mt-6 min-h-14 flex-row items-center justify-center gap-3 rounded-lg bg-neo-primary px-4"
          onPress={() =>
            setNotice({
              message:
                "Request noted locally. No staff invite, notification, or backend workflow was created.",
              title: "Owner/admin request",
            })
          }
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconCustomer}
            style={{ height: 28, tintColor: colors.surface, width: 28 }}
          />
          <Text className="text-[18px] font-bold leading-6 text-white">
            Ask owner/admin
          </Text>
        </Pressable>

        <Link asChild href={routes.today}>
          <Pressable
            accessibilityLabel="Return to Today"
            accessibilityRole="link"
            className="mt-3 min-h-14 flex-row items-center justify-center gap-3 rounded-lg border border-neo-primary bg-neo-surface px-4"
          >
            <Text className="text-[24px] leading-7 text-neo-primary">{"<"}</Text>
            <Text className="text-[18px] font-bold leading-6 text-neo-primary">
              Return to Today
            </Text>
          </Pressable>
        </Link>

        <View className="mt-6 flex-row items-center gap-4 rounded-lg border border-neo-border bg-neo-surface px-4 py-4">
          <View className="h-12 w-12 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt">
            <Text className="text-[24px] font-bold leading-7 text-neo-text-muted">
              ?
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[15px] font-bold leading-5 text-neo-text">
              Need help?
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
              Contact your owner or reach out to support.
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Contact support"
            accessibilityRole="button"
            className="min-h-11 justify-center"
            onPress={() =>
              setNotice({
                message:
                  "Support is not connected in this local MVP. Ask the owner/admin for approval.",
                title: "Support unavailable",
              })
            }
          >
            <Text className="text-[14px] font-bold leading-5 text-neo-info">
              Contact support {">"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
