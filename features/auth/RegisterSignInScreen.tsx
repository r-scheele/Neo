import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";

type AuthMode = "sign-in" | "create-account";
type CredentialMode = "email-or-phone" | "phone";

type SecurityPoint = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
};

const securityPoint: SecurityPoint = {
  title: "Your business is protected",
  description:
    "We protect your customer chats, orders, receipts, staff access, and settings with industry-standard security.",
  icon: images.iconPermission,
};

function getAuthCopy(mode: AuthMode) {
  if (mode === "create-account") {
    return {
      title: "Create your account",
      subtitle:
        "Set up secure access before adding chats, orders, receipts, and business settings.",
      action: "Create account",
    };
  }

  return {
    title: "Welcome back",
    subtitle: "Sign in to access your chats, orders, receipts, and business settings.",
    action: "Continue",
  };
}

function getCredentialCopy(mode: CredentialMode) {
  if (mode === "phone") {
    return {
      label: "Phone number",
      placeholder: "0801 234 5678",
      helper: "When auth is connected, Neo will send a secure code to this number.",
      toggle: "Use email instead",
      keyboardType: "phone-pad" as const,
    };
  }

  return {
    label: "Email or phone number",
    placeholder: "Email or 0801 234 5678",
    helper: "When auth is connected, Neo will send a secure code. For now, Continue opens setup.",
    toggle: "Use phone number instead",
    keyboardType: "email-address" as const,
  };
}

export function RegisterSignInScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [credentialMode, setCredentialMode] =
    useState<CredentialMode>("email-or-phone");
  const [credential, setCredential] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authCopy = getAuthCopy(authMode);
  const credentialCopy = getCredentialCopy(credentialMode);

  const handleCredentialChange = (value: string) => {
    setCredential(value);
    if (error) {
      setError(null);
    }
  };

  const handleContinue = () => {
    const trimmedCredential = credential.trim();

    if (!trimmedCredential) {
      setError(`Enter your ${credentialCopy.label.toLowerCase()} to continue.`);
      return;
    }

    setIsSubmitting(true);
    router.push(routes.setup);
  };

  const handleCredentialModeToggle = () => {
    setCredentialMode((currentMode) =>
      currentMode === "phone" ? "email-or-phone" : "phone",
    );
    setError(null);
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
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <Link asChild href={routes.welcome}>
          <Pressable
            accessibilityLabel="Back to welcome"
            accessibilityRole="link"
            className="min-h-11 w-11 items-start justify-center"
          >
            <Text className="text-[34px] leading-9 text-neo-text">{"<"}</Text>
          </Pressable>
        </Link>

        <View className="mt-4 items-center">
          <View className="flex-row items-center justify-center gap-3">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.logoMarkNeo}
              style={{ height: isCompactPhone ? 56 : 64, width: isCompactPhone ? 56 : 64 }}
            />
            <Text className="font-serif text-[48px] font-bold leading-[56px] text-neo-primary">
              Neo
            </Text>
          </View>
          <Text className="mt-1 text-center text-[12px] font-semibold uppercase leading-4 text-neo-primary">
            AI WhatsApp Commerce OS
          </Text>
        </View>

        <View className="mt-9 items-center gap-3">
          <Text className="text-center font-serif text-[42px] font-bold leading-[48px] text-neo-text">
            {authCopy.title}
          </Text>
          <Text className="max-w-[340px] text-center text-[18px] leading-7 text-neo-text-muted">
            {authCopy.subtitle}
          </Text>
        </View>

        <View className="mt-9 flex-row overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
          <Pressable
            accessibilityLabel="Sign in"
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === "sign-in" }}
            className={`min-h-14 flex-1 items-center justify-center border-b-4 ${
              authMode === "sign-in"
                ? "border-neo-primary bg-neo-surface"
                : "border-transparent bg-neo-background"
            }`}
            onPress={() => setAuthMode("sign-in")}
          >
            <Text
              className={`text-[17px] font-bold leading-6 ${
                authMode === "sign-in" ? "text-neo-primary" : "text-neo-text-muted"
              }`}
            >
              Sign in
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Create account"
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === "create-account" }}
            className={`min-h-14 flex-1 items-center justify-center border-b-4 ${
              authMode === "create-account"
                ? "border-neo-primary bg-neo-surface"
                : "border-transparent bg-neo-background"
            }`}
            onPress={() => setAuthMode("create-account")}
          >
            <Text
              className={`text-[17px] font-bold leading-6 ${
                authMode === "create-account"
                  ? "text-neo-primary"
                  : "text-neo-text-muted"
              }`}
            >
              Create account
            </Text>
          </Pressable>
        </View>

        <View className="mt-7">
          <Text className="text-[16px] font-bold leading-6 text-neo-text">
            {credentialCopy.label}
          </Text>
          <View
            className={`mt-3 min-h-16 flex-row items-center gap-3 rounded-lg border bg-neo-surface px-4 ${
              error ? "border-neo-error" : "border-neo-border"
            }`}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconCustomer}
              style={{ height: 28, width: 28 }}
            />
            <TextInput
              accessibilityLabel={credentialCopy.label}
              autoCapitalize="none"
              autoCorrect={false}
              className="min-h-12 flex-1 text-[16px] leading-6 text-neo-text"
              inputMode={credentialMode === "phone" ? "tel" : "email"}
              keyboardType={credentialCopy.keyboardType}
              onChangeText={handleCredentialChange}
              placeholder={credentialCopy.placeholder}
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              value={credential}
            />
          </View>
          {error ? (
            <Text
              accessibilityRole="alert"
              className="mt-2 text-[13px] font-semibold leading-5 text-neo-error"
            >
              {error}
            </Text>
          ) : (
            <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
              {credentialCopy.helper}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityLabel={authCopy.action}
          accessibilityRole="button"
          accessibilityState={{ busy: isSubmitting }}
          className="mt-7 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg bg-neo-primary px-5"
          disabled={isSubmitting}
          onPress={handleContinue}
        >
          <Text className="text-[18px] font-bold leading-6 text-neo-surface">
            {isSubmitting ? "Opening setup" : authCopy.action}
          </Text>
          <Text className="text-[24px] leading-7 text-neo-surface">{"->"}</Text>
        </Pressable>

        <View className="my-6 flex-row items-center gap-4">
          <View className="h-px flex-1 bg-neo-border" />
          <Text className="text-[14px] leading-5 text-neo-text-muted">
            or continue with
          </Text>
          <View className="h-px flex-1 bg-neo-border" />
        </View>

        <Pressable
          accessibilityLabel={credentialCopy.toggle}
          accessibilityRole="button"
          className="min-h-14 flex-row items-center rounded-lg border border-neo-border bg-neo-surface px-4"
          onPress={handleCredentialModeToggle}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full border border-neo-border bg-neo-surface">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={credentialMode === "phone" ? images.iconInbox : images.iconCustomer}
              style={{ height: 24, width: 24 }}
            />
          </View>
          <Text className="ml-4 flex-1 text-[16px] font-bold leading-6 text-neo-text">
            {credentialCopy.toggle}
          </Text>
          <Text className="text-[24px] leading-7 text-neo-text">{">"}</Text>
        </Pressable>

        <View className="mt-7 flex-row items-center gap-4 rounded-lg border border-neo-border bg-neo-surface p-4">
          <View className="h-16 w-16 items-center justify-center rounded-lg bg-neo-surface-alt">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={securityPoint.icon}
              style={{ height: 36, width: 36 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[17px] font-bold leading-6 text-neo-text">
              {securityPoint.title}
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
              {securityPoint.description}
            </Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-neo-success">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconPaid}
              style={{ height: 22, width: 22 }}
            />
          </View>
        </View>

        <Pressable
          accessibilityLabel="Need help signing in"
          accessibilityRole="button"
          className="mt-8 min-h-11 flex-row items-center justify-center gap-3 px-3"
        >
          <View className="h-7 w-7 items-center justify-center rounded-full border-2 border-neo-primary">
            <Text className="text-[17px] font-bold leading-6 text-neo-primary">?</Text>
          </View>
          <Text className="text-[16px] font-semibold leading-6 text-neo-primary">
            Need help signing in?
          </Text>
        </Pressable>

        <Text className="mt-8 text-center text-[13px] leading-5 text-neo-text-muted">
          By continuing, you agree to Neo Terms of Service and Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}
