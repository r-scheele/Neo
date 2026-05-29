import { useEffect, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getClerkErrorMessage } from "@/lib/auth/clerk";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";

type AuthMode = "sign-in" | "create-account";

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

function getCredentialCopy(mode: AuthMode) {
  return {
    label: "Email address",
    placeholder: "owner@example.com",
    helper:
      mode === "create-account"
        ? "Create an account with the email/password method enabled in Clerk."
        : "Sign in with your Clerk test account email and password.",
    keyboardType: "email-address" as const,
  };
}

export function RegisterSignInScreen() {
  const router = useRouter();
  const { isLoaded: isAuthStateLoaded, isSignedIn } = useAuth();
  const {
    isLoaded: isSignInLoaded,
    setActive: setSignInActive,
    signIn,
  } = useSignIn();
  const {
    isLoaded: isSignUpLoaded,
    setActive: setSignUpActive,
    signUp,
  } = useSignUp();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authCopy = getAuthCopy(authMode);
  const credentialCopy = getCredentialCopy(authMode);
  const isClerkLoaded = isAuthStateLoaded && isSignInLoaded && isSignUpLoaded;

  useEffect(() => {
    if (isAuthStateLoaded && isSignedIn) {
      router.replace(routes.setup);
    }
  }, [isAuthStateLoaded, isSignedIn, router]);

  const handleCredentialChange = (value: string) => {
    setEmailAddress(value);
    if (error) {
      setError(null);
    }
  };

  const activateSession = async (
    createdSessionId: string | null,
    setActive: NonNullable<typeof setSignInActive>,
  ) => {
    if (!createdSessionId) {
      setError("Clerk needs one more verification step before opening setup.");
      return;
    }

    await setActive({ session: createdSessionId });
    trackAnalyticsEvent("onboarding_started", {
      entry_point: authMode,
    });
    router.replace(routes.setup);
  };

  const validateCredentials = () => {
    const trimmedEmailAddress = emailAddress.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmailAddress) {
      setError(`Enter your ${credentialCopy.label.toLowerCase()} to continue.`);
      return null;
    }

    if (!trimmedPassword) {
      setError("Enter your password to continue.");
      return null;
    }

    return {
      emailAddress: trimmedEmailAddress,
      password: trimmedPassword,
    };
  };

  const handleSignIn = async () => {
    const credentials = validateCredentials();

    if (!credentials || !signIn || !setSignInActive) {
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: credentials.emailAddress,
        password: credentials.password,
        strategy: "password",
      });

      if (signInAttempt.status === "complete") {
        await activateSession(signInAttempt.createdSessionId, setSignInActive);
        return;
      }

      setError("This account needs an extra verification step before setup opens.");
    } catch (signInError) {
      setError(
        getClerkErrorMessage(
          signInError,
          "Neo could not sign you in. Check the details and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = async () => {
    const credentials = validateCredentials();

    if (!credentials || !signUp || !setSignUpActive) {
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: credentials.emailAddress,
        password: credentials.password,
      });

      if (signUpAttempt.status === "complete") {
        await activateSession(signUpAttempt.createdSessionId, setSignUpActive);
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsPendingVerification(true);
      setNotice("Clerk sent a verification code to your email.");
    } catch (signUpError) {
      setError(
        getClerkErrorMessage(
          signUpError,
          "Neo could not create this account. Check the details and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAccount = async () => {
    const trimmedCode = verificationCode.trim();

    if (!trimmedCode) {
      setError("Enter the email verification code from Clerk.");
      return;
    }

    if (!signUp || !setSignUpActive) {
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: trimmedCode,
      });

      if (signUpAttempt.status === "complete") {
        await activateSession(signUpAttempt.createdSessionId, setSignUpActive);
        return;
      }

      setError("Clerk has not completed verification for this account yet.");
    } catch (verificationError) {
      setError(
        getClerkErrorMessage(
          verificationError,
          "Neo could not verify that code. Check it and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!isClerkLoaded || isSubmitting) {
      return;
    }

    if (isPendingVerification) {
      void handleVerifyAccount();
      return;
    }

    if (authMode === "create-account") {
      void handleCreateAccount();
      return;
    }

    void handleSignIn();
  };

  const handleAuthModeChange = (nextMode: AuthMode) => {
    setAuthMode(nextMode);
    setIsPendingVerification(false);
    setVerificationCode("");
    setNotice(null);
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
            onPress={() => handleAuthModeChange("sign-in")}
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
            onPress={() => handleAuthModeChange("create-account")}
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
              inputMode="email"
              keyboardType={credentialCopy.keyboardType}
              onChangeText={handleCredentialChange}
              placeholder={credentialCopy.placeholder}
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              textContentType="emailAddress"
              value={emailAddress}
            />
          </View>
        </View>

        <View className="mt-5">
          <Text className="text-[16px] font-bold leading-6 text-neo-text">
            Password
          </Text>
          <View
            className={`mt-3 min-h-16 flex-row items-center gap-3 rounded-lg border bg-neo-surface px-4 ${
              error ? "border-neo-error" : "border-neo-border"
            }`}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconPermission}
              style={{ height: 28, width: 28 }}
            />
            <TextInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoCorrect={false}
              className="min-h-12 flex-1 text-[16px] leading-6 text-neo-text"
              onChangeText={(value) => {
                setPassword(value);
                setError(null);
              }}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              secureTextEntry
              textContentType="password"
              value={password}
            />
          </View>
          {isPendingVerification ? (
            <View className="mt-5">
              <Text className="text-[16px] font-bold leading-6 text-neo-text">
                Email verification code
              </Text>
              <View
                className={`mt-3 min-h-16 flex-row items-center gap-3 rounded-lg border bg-neo-surface px-4 ${
                  error ? "border-neo-error" : "border-neo-border"
                }`}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={images.iconPaid}
                  style={{ height: 28, width: 28 }}
                />
                <TextInput
                  accessibilityLabel="Email verification code"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="min-h-12 flex-1 text-[16px] leading-6 text-neo-text"
                  inputMode="numeric"
                  keyboardType="number-pad"
                  onChangeText={(value) => {
                    setVerificationCode(value);
                    setError(null);
                  }}
                  placeholder="6-digit code"
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="done"
                  textContentType="oneTimeCode"
                  value={verificationCode}
                />
              </View>
            </View>
          ) : null}
          {error ? (
            <Text
              accessibilityRole="alert"
              className="mt-2 text-[13px] font-semibold leading-5 text-neo-error"
            >
              {error}
            </Text>
          ) : (
            <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
              {notice ?? credentialCopy.helper}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityLabel={authCopy.action}
          accessibilityRole="button"
          accessibilityState={{ busy: isSubmitting, disabled: !isClerkLoaded }}
          className="mt-7 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg bg-neo-primary px-5"
          disabled={!isClerkLoaded || isSubmitting}
          onPress={handleContinue}
        >
          <Text className="text-[18px] font-bold leading-6 text-neo-surface">
            {isSubmitting
              ? "Securing access"
              : isPendingVerification
                ? "Verify account"
                : authCopy.action}
          </Text>
          <Text className="text-[24px] leading-7 text-neo-surface">{"->"}</Text>
        </Pressable>

        <View className="my-6 flex-row items-center gap-4">
          <View className="h-px flex-1 bg-neo-border" />
          <Text className="text-[14px] leading-5 text-neo-text-muted">
            protected by Clerk
          </Text>
          <View className="h-px flex-1 bg-neo-border" />
        </View>

        <View className="min-h-14 flex-row items-center rounded-lg border border-neo-border bg-neo-surface px-4">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-neo-border bg-neo-surface">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconCustomer}
              style={{ height: 24, width: 24 }}
            />
          </View>
          <Text className="ml-4 flex-1 text-[16px] font-bold leading-6 text-neo-text">
            Email/password auth is active for this pass
          </Text>
        </View>

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
