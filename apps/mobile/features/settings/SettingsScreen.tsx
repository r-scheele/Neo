import { useState } from "react";
import { Image, Switch, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useClerk } from "@clerk/clerk-expo";

import type { MockScreenState } from "@/components/feedback/ScreenState";
import {
  SkeletonRows,
  StateBanner,
  StateCard,
} from "@/components/feedback/ScreenState";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { resetAnalyticsIdentity } from "@/lib/analytics";
import { getClerkErrorMessage } from "@/lib/auth/clerk";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";
import { clearUserLocalState } from "@/stores/localStateReset";
import { useUserPreferencesStore } from "@/stores/useUserPreferencesStore";

import type {
  SettingsRow,
  SettingsStatusTone,
  SettingsToggleId,
  SettingsToggleRow,
} from "./settingsData";
import {
  settingsAccountSummary,
  settingsSections,
} from "./settingsData";

type SettingsScreenProps = {
  state?: MockScreenState;
};

type SettingsToggles = Record<SettingsToggleId, boolean>;

type Notice = {
  message: string;
  title: string;
  tone: "info" | "success" | "warning";
};

function getStatusStyle(tone: SettingsStatusTone = "muted") {
  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-[#B9D7C4]",
      marker: "OK",
      textClassName: "text-neo-success",
    };
  }

  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-[#E8C98E]",
      marker: "!",
      textClassName: "text-neo-warning",
    };
  }

  if (tone === "error") {
    return {
      backgroundClassName: "bg-[#FFF1EF]",
      borderClassName: "border-[#E8A59B]",
      marker: "x",
      textClassName: "text-neo-error",
    };
  }

  if (tone === "info") {
    return {
      backgroundClassName: "bg-[#EDF6FA]",
      borderClassName: "border-[#B9D3DF]",
      marker: "i",
      textClassName: "text-neo-info",
    };
  }

  return {
    backgroundClassName: "bg-neo-surface-alt",
    borderClassName: "border-neo-border",
    marker: "-",
    textClassName: "text-neo-text-muted",
  };
}

function getNoticeStyle(tone: Notice["tone"]) {
  if (tone === "success") {
    return {
      backgroundClassName: "bg-[#EEF8F0]",
      borderClassName: "border-neo-success",
      textClassName: "text-neo-success",
    };
  }

  if (tone === "warning") {
    return {
      backgroundClassName: "bg-[#FFF7E5]",
      borderClassName: "border-neo-warning",
      textClassName: "text-neo-warning",
    };
  }

  return {
    backgroundClassName: "bg-[#EDF6FA]",
    borderClassName: "border-neo-info",
    textClassName: "text-neo-info",
  };
}

function StatusChip({
  label,
  tone = "muted",
}: {
  label: string;
  tone?: SettingsStatusTone;
}) {
  const style = getStatusStyle(tone);

  return (
    <View
      className={`min-h-8 max-w-[150px] flex-row items-center gap-2 rounded-lg border px-3 ${style.backgroundClassName} ${style.borderClassName}`}
    >
      <View className={`h-5 min-w-5 items-center justify-center rounded-full border ${style.borderClassName}`}>
        <Text className={`text-[9px] font-bold leading-3 ${style.textClassName}`}>
          {style.marker}
        </Text>
      </View>
      <Text
        className={`min-w-0 text-[13px] font-bold leading-4 ${style.textClassName}`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

function NoticeBanner({ notice }: { notice: Notice }) {
  const style = getNoticeStyle(notice.tone);

  return (
    <View
      className={`mt-4 rounded-lg border px-4 py-3 ${style.backgroundClassName} ${style.borderClassName}`}
    >
      <Text className={`text-[15px] font-bold leading-5 ${style.textClassName}`}>
        {notice.title}
      </Text>
      <Text className="mt-1 text-[14px] leading-5 text-neo-text">
        {notice.message}
      </Text>
    </View>
  );
}

function Header({ isCompactPhone }: { isCompactPhone: boolean }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="min-w-0 flex-1">
        <Text
          className={`font-bold text-neo-text ${
            isCompactPhone
              ? "text-[30px] leading-9"
              : "text-[36px] leading-[44px]"
          }`}
          numberOfLines={1}
        >
          Settings
        </Text>
      </View>

      <View className="h-16 w-16 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt">
        <Text className="text-[24px] font-bold leading-7 text-neo-primary">
          {settingsAccountSummary.initials}
        </Text>
      </View>
    </View>
  );
}

function AccountSummary() {
  return (
    <Link asChild href={routes.businessProfile}>
      <Pressable
        accessibilityLabel="Open business account settings"
        accessibilityRole="link"
        className="mt-5 min-h-[126px] flex-row items-center gap-4 rounded-lg border border-neo-border bg-neo-surface px-4 py-4"
      >
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F4EDDF]">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconSettings}
            style={{ height: 36, tintColor: colors.text, width: 36 }}
          />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="text-[20px] font-bold leading-7 text-neo-text"
            numberOfLines={1}
          >
            {settingsAccountSummary.businessName}
          </Text>
          <View className="mt-2 self-start rounded-lg border border-[#E8C98E] bg-[#FFF7E5] px-3 py-1">
            <Text className="text-[13px] font-bold leading-4 text-neo-warning">
              {settingsAccountSummary.roleLabel}
            </Text>
          </View>
        </View>

        <View className="max-w-[140px] items-end gap-2">
          <Text
            className="text-right text-[14px] font-semibold leading-5 text-neo-text-muted"
            numberOfLines={1}
          >
            {settingsAccountSummary.accountLabel}
          </Text>
          <StatusChip
            label={settingsAccountSummary.healthLabel}
            tone={settingsAccountSummary.healthTone}
          />
        </View>

        <Text className="text-[32px] leading-8 text-neo-text">{">"}</Text>
      </Pressable>
    </Link>
  );
}

function getToggleStatus(row: SettingsToggleRow, toggles: SettingsToggles) {
  const isEnabled = toggles[row.toggleId];

  return {
    isEnabled,
    label: isEnabled ? row.onStatusLabel : row.offStatusLabel,
    tone: isEnabled ? row.onStatusTone : row.offStatusTone,
  };
}

function RowIcon({ row }: { row: SettingsRow }) {
  const tone = row.statusTone ?? (row.kind === "locked" ? "muted" : "info");
  const iconStyle = getStatusStyle(tone);

  return (
    <View className="h-14 w-14 items-center justify-center rounded-full border border-neo-border bg-[#FAF6EE]">
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={row.icon}
        style={{
          height: 30,
          tintColor:
            tone === "success"
              ? colors.success
              : tone === "warning"
                ? colors.warning
                : tone === "error"
                  ? colors.error
                  : tone === "info"
                    ? colors.info
                    : colors.text,
          width: 30,
        }}
      />
      <View className={`absolute -bottom-1 h-2.5 w-2.5 rounded-full border ${iconStyle.borderClassName} ${iconStyle.backgroundClassName}`} />
    </View>
  );
}

function RowText({ row }: { row: SettingsRow }) {
  return (
    <View className="min-w-0 flex-1">
      <Text
        className="text-[17px] font-bold leading-6 text-neo-text"
        numberOfLines={1}
      >
        {row.title}
      </Text>
      <Text
        className="mt-1 text-[14px] leading-5 text-neo-text-muted"
        numberOfLines={2}
      >
        {row.description}
      </Text>
    </View>
  );
}

function LinkRow({ row }: { row: Extract<SettingsRow, { kind: "link" }> }) {
  return (
    <Link asChild href={row.href}>
      <Pressable
        accessibilityLabel={`Open ${row.title}`}
        accessibilityRole="link"
        className="min-h-[92px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3"
      >
        <RowIcon row={row} />
        <RowText row={row} />
        <View className="max-w-[142px] flex-row items-center gap-2">
          {row.statusLabel ? (
            <Text
              className={`text-right text-[15px] font-bold leading-5 ${
                row.statusTone === "success"
                  ? "text-neo-success"
                  : row.statusTone === "warning"
                    ? "text-neo-warning"
                    : row.statusTone === "error"
                      ? "text-neo-error"
                      : row.statusTone === "info"
                        ? "text-neo-info"
                        : "text-neo-text-muted"
              }`}
              numberOfLines={1}
            >
              {row.statusLabel}
            </Text>
          ) : null}
          <Text className="text-[30px] leading-8 text-neo-text">{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

function ToggleRow({
  disabled,
  onToggle,
  row,
  toggles,
}: {
  disabled: boolean;
  onToggle: (row: SettingsToggleRow, nextValue: boolean) => void;
  row: SettingsToggleRow;
  toggles: SettingsToggles;
}) {
  const status = getToggleStatus(row, toggles);

  return (
    <View
      className={`min-h-[96px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <RowIcon row={{ ...row, statusTone: status.tone }} />
      <RowText row={row} />
      <View className="items-end gap-2">
        <StatusChip label={status.label} tone={status.tone} />
        <Switch
          accessibilityHint="Changes this local setting for the current session."
          accessibilityLabel={row.title}
          disabled={disabled}
          onValueChange={(nextValue) => onToggle(row, nextValue)}
          thumbColor={colors.surface}
          trackColor={{ false: colors.border, true: colors.primary }}
          value={status.isEnabled}
        />
      </View>
    </View>
  );
}

function LockedRow({
  onNotice,
  row,
}: {
  onNotice: (notice: Notice) => void;
  row: Extract<SettingsRow, { kind: "locked" }>;
}) {
  return (
    <Pressable
      accessibilityHint="Shows why this setting is restricted."
      accessibilityLabel={`${row.title}, restricted`}
      accessibilityRole="button"
      className="min-h-[92px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3"
      onPress={() =>
        onNotice({
          message: row.notice,
          title: "Restricted setting",
          tone: "warning",
        })
      }
    >
      <RowIcon row={row} />
      <RowText row={row} />
      <View className="max-w-[140px] flex-row items-center gap-2">
        <StatusChip label={row.lockedLabel} tone={row.statusTone ?? "muted"} />
        <Text className="text-[30px] leading-8 text-neo-text">{">"}</Text>
      </View>
    </Pressable>
  );
}

function NoticeRow({
  onNotice,
  row,
}: {
  onNotice: (notice: Notice) => void;
  row: Extract<SettingsRow, { kind: "notice" }>;
}) {
  return (
    <Pressable
      accessibilityHint="Shows local availability for this setting."
      accessibilityLabel={`Open ${row.title}`}
      accessibilityRole="button"
      className="min-h-[92px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3"
      onPress={() =>
        onNotice({
          message: row.notice,
          title: row.title,
          tone: "info",
        })
      }
    >
      <RowIcon row={row} />
      <RowText row={row} />
      <Text className="text-[30px] leading-8 text-neo-text">{">"}</Text>
    </Pressable>
  );
}

function SettingsRowItem({
  controlsDisabled,
  onNotice,
  onToggle,
  row,
  toggles,
}: {
  controlsDisabled: boolean;
  onNotice: (notice: Notice) => void;
  onToggle: (row: SettingsToggleRow, nextValue: boolean) => void;
  row: SettingsRow;
  toggles: SettingsToggles;
}) {
  if (row.kind === "link") {
    return <LinkRow row={row} />;
  }

  if (row.kind === "toggle") {
    return (
      <ToggleRow
        disabled={controlsDisabled}
        onToggle={onToggle}
        row={row}
        toggles={toggles}
      />
    );
  }

  if (row.kind === "locked") {
    return <LockedRow onNotice={onNotice} row={row} />;
  }

  return <NoticeRow onNotice={onNotice} row={row} />;
}

function SettingsSectionCard({
  controlsDisabled,
  onNotice,
  onToggle,
  section,
  toggles,
}: {
  controlsDisabled: boolean;
  onNotice: (notice: Notice) => void;
  onToggle: (row: SettingsToggleRow, nextValue: boolean) => void;
  section: (typeof settingsSections)[number];
  toggles: SettingsToggles;
}) {
  return (
    <View className="mt-7">
      <Text className="px-1 text-[15px] font-bold uppercase leading-5 text-neo-text-muted">
        {section.title}
      </Text>
      <View className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
        {section.rows.map((row, index) => (
          <View key={row.id}>
            <SettingsRowItem
              controlsDisabled={controlsDisabled}
              onNotice={onNotice}
              onToggle={onToggle}
              row={row}
              toggles={toggles}
            />
            {index === section.rows.length - 1 ? (
              <View className="-mt-px h-px bg-neo-surface" />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function SignOutRow({
  isSigningOut,
  onPress,
}: {
  isSigningOut: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityHint="Signs out through Clerk and clears safe local setup and preference data."
      accessibilityLabel="Sign out"
      accessibilityRole="button"
      accessibilityState={{ busy: isSigningOut, disabled: isSigningOut }}
      className="mt-6 min-h-[68px] flex-row items-center gap-4 rounded-lg border border-neo-border bg-neo-surface px-4 py-3"
      disabled={isSigningOut}
      onPress={onPress}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFF1EF]">
        <Text className="text-[22px] font-bold leading-6 text-neo-error">
          {"->"}
        </Text>
      </View>
      <Text className="flex-1 text-[18px] font-bold leading-6 text-neo-error">
        {isSigningOut ? "Signing out" : "Sign out"}
      </Text>
      <Text className="text-[30px] leading-8 text-neo-text">{">"}</Text>
    </Pressable>
  );
}

function SettingsStateContent({
  state,
  onRetry,
}: {
  onRetry: () => void;
  state: Exclude<MockScreenState, "ready" | "offline" | "permission">;
}) {
  if (state === "loading") {
    return (
      <View className="mt-6 gap-5">
        <SkeletonRows count={1} />
        <SkeletonRows count={4} />
        <SkeletonRows count={3} />
      </View>
    );
  }

  if (state === "empty") {
    return (
      <View className="mt-6">
        <StateCard
          actionLabel="Open setup checklist"
          image={images.iconSettings}
          message="Settings will fill in after the owner completes the business setup steps."
          onAction={onRetry}
          title="Settings are not ready yet"
        />
      </View>
    );
  }

  return (
    <View className="mt-6">
      <StateCard
        actionLabel="Retry"
        image={images.errorOffline}
        message="Neo could not load these local settings. Try again before changing safety rules."
        onAction={onRetry}
        title="Settings could not load"
      />
    </View>
  );
}

export function SettingsScreen({ state = "ready" }: SettingsScreenProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const toggles = useUserPreferencesStore((store) => store.settingsToggles);
  const setSettingToggle = useUserPreferencesStore(
    (store) => store.setSettingToggle,
  );
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const controlsDisabled = state === "offline" || state === "permission";
  const handleToggle = (row: SettingsToggleRow, nextValue: boolean) => {
    if (controlsDisabled) {
      setNotice({
        message:
          state === "offline"
            ? "Cached settings are visible offline, but changes are paused until connection returns."
            : "Your current role can view these settings, but cannot change them.",
        title: state === "offline" ? "Offline mode" : "Permission needed",
        tone: state === "offline" ? "warning" : "info",
      });
      return;
    }

    setSettingToggle(row.toggleId, nextValue);
    setNotice({
      message:
        row.toggleId === "aiRoutineApproval"
          ? "Routine AI review changed locally and will survive restart. Sensitive actions still require human approval."
          : "This setting changed locally and will survive restart. Nothing sensitive is stored.",
      title: nextValue ? "Setting turned on" : "Setting turned off",
      tone: nextValue ? "success" : "warning",
    });
  };

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOut();
      resetAnalyticsIdentity();
      await clearUserLocalState();
      router.replace(routes.welcome);
    } catch (signOutError) {
      setNotice({
        message:
          getClerkErrorMessage(
            signOutError,
            "Neo could not sign you out. Check your connection and try again.",
          ),
        title: "Sign out failed",
        tone: "warning",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const retryState = () => {
    setNotice({
      message:
        "This is a local settings prototype, so retry keeps you on the same mock data.",
      title: "Local settings",
      tone: "info",
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-neo-background"
      contentContainerClassName="items-center"
      contentContainerStyle={{
        paddingBottom: 28,
        paddingHorizontal: horizontalPadding,
        paddingTop: isCompactPhone ? 24 : 36,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <Header isCompactPhone={isCompactPhone} />

        {state === "offline" ? (
          <StateBanner
            message="Cached settings are visible. Changing safety, payment, or account controls is paused."
            title="Offline mode"
            tone="offline"
          />
        ) : null}

        {state === "permission" ? (
          <StateBanner
            message="You can review the current setup, but owner-only and safety changes need approval."
            title="Limited access"
            tone="permission"
          />
        ) : null}

        {notice ? <NoticeBanner notice={notice} /> : null}

        {state === "loading" || state === "empty" || state === "error" ? (
          <SettingsStateContent onRetry={retryState} state={state} />
        ) : (
          <>
            <AccountSummary />

            {settingsSections.map((section) => (
              <SettingsSectionCard
                controlsDisabled={controlsDisabled}
                key={section.id}
                onNotice={setNotice}
                onToggle={handleToggle}
                section={section}
                toggles={toggles}
              />
            ))}

            <SignOutRow
              isSigningOut={isSigningOut}
              onPress={() => {
                void handleSignOut();
              }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}
