import { useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, Switch, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

type ReplyTone = "warm" | "professional" | "direct" | "friendly";
type ReplyLength = "short" | "balanced" | "detailed";
type CustomerAddress = "ma-sir" | "first-name";
type GuardrailId = "receipts" | "refunds" | "discounts" | "complaints";

type ToneOption = {
  id: ReplyTone;
  icon: string;
  label: string;
};

type ReplyLengthOption = {
  id: ReplyLength;
  label: string;
  helper: string;
};

type Guardrail = {
  id: GuardrailId;
  title: string;
  description: string;
  icon: ImageSourcePropType;
  required?: boolean;
};

type AiPersonalitySettings = {
  tone: ReplyTone;
  useNigerianEnglish: boolean;
  customerAddress: CustomerAddress;
  replyLength: ReplyLength;
  approvalGuardrails: Record<GuardrailId, boolean>;
};

const toneOptions: readonly ToneOption[] = [
  { id: "warm", icon: "W", label: "Warm" },
  { id: "professional", icon: "P", label: "Professional" },
  { id: "direct", icon: "D", label: "Direct" },
  { id: "friendly", icon: ":)", label: "Friendly" },
];

const replyLengthOptions: readonly ReplyLengthOption[] = [
  { id: "short", label: "Short & clear", helper: "1-2 lines" },
  { id: "balanced", label: "Balanced", helper: "3-5 lines" },
  { id: "detailed", label: "Detailed", helper: "5+ lines" },
];

const approvalGuardrails: readonly Guardrail[] = [
  {
    id: "receipts",
    title: "Send receipts",
    description: "Always get my approval before sending.",
    icon: images.iconReceiptReview,
    required: true,
  },
  {
    id: "refunds",
    title: "Process refunds",
    description: "Always get my approval before refunding.",
    icon: images.iconPaid,
    required: true,
  },
  {
    id: "discounts",
    title: "Give discounts",
    description: "Always get my approval before offering.",
    icon: images.iconProduct,
  },
  {
    id: "complaints",
    title: "Handle complaints",
    description: "Always get my approval before responding.",
    icon: images.iconCustomer,
  },
];

const defaultSettings: AiPersonalitySettings = {
  tone: "warm",
  useNigerianEnglish: true,
  customerAddress: "ma-sir",
  replyLength: "balanced",
  approvalGuardrails: {
    receipts: true,
    refunds: true,
    discounts: true,
    complaints: true,
  },
};

function getPreviewReply(settings: AiPersonalitySettings) {
  const greeting =
    settings.customerAddress === "ma-sir" ? "Good afternoon, ma." : "Good afternoon.";
  const localPhrase = settings.useNigerianEnglish
    ? "Thanks for reaching out."
    : "Thank you for reaching out.";
  const toneLine =
    settings.tone === "professional"
      ? "I will be happy to assist with your order."
      : settings.tone === "direct"
        ? "I can help with your order details."
        : settings.tone === "friendly"
          ? "I am happy to help you sort it out."
          : "Your order is important to us and I am happy to help.";
  const question =
    settings.tone === "direct"
      ? "What item and delivery area should I check?"
      : "What exactly would you like to know?";

  if (settings.replyLength === "short") {
    return `${greeting} ${localPhrase} ${question}`;
  }

  if (settings.replyLength === "detailed") {
    return `${greeting} ${localPhrase} ${toneLine} Please share the item, size, and delivery area so we can guide you properly.`;
  }

  return `${greeting} ${localPhrase} ${toneLine} ${question}`;
}

function getSelectedButtonClassName(isSelected: boolean) {
  return isSelected
    ? "border-neo-primary bg-neo-primary"
    : "border-neo-border bg-neo-surface";
}

function getSelectedTextClassName(isSelected: boolean) {
  return isSelected ? "text-neo-surface" : "text-neo-text";
}

function SectionCard({
  children,
  icon,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  icon: string;
  subtitle: string;
  title: string;
}) {
  return (
    <View className="rounded-lg border border-neo-border bg-neo-surface px-3 py-4">
      <View className="flex-row gap-3">
        <View className="h-9 w-9 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt">
          <Text className="text-[10px] font-bold uppercase leading-3 text-neo-text">
            {icon}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[22px] font-bold leading-7 text-neo-text">
            {title}
          </Text>
          <Text className="mt-1 text-[15px] leading-5 text-neo-text-muted">
            {subtitle}
          </Text>
        </View>
      </View>

      <View className="mt-5">{children}</View>
    </View>
  );
}

function ToneButton({
  isSelected,
  onPress,
  option,
}: {
  isSelected: boolean;
  onPress: () => void;
  option: ToneOption;
}) {
  return (
    <Pressable
      accessibilityLabel={`Reply tone, ${option.label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`min-h-14 flex-row items-center justify-center gap-2 rounded-lg border px-3 ${getSelectedButtonClassName(
        isSelected,
      )}`}
      onPress={onPress}
    >
      <Text
        className={`text-[18px] font-bold leading-6 ${getSelectedTextClassName(
          isSelected,
        )}`}
      >
        {option.icon}
      </Text>
      <Text
        className={`text-[14px] font-bold leading-5 ${getSelectedTextClassName(
          isSelected,
        )}`}
      >
        {option.label}
      </Text>
    </Pressable>
  );
}

function SegmentedOption({
  isSelected,
  label,
  onPress,
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`min-h-14 flex-1 items-center justify-center rounded-lg border px-3 ${getSelectedButtonClassName(
        isSelected,
      )}`}
      onPress={onPress}
    >
      <Text
        className={`text-center text-[16px] font-bold leading-5 ${getSelectedTextClassName(
          isSelected,
        )}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ReplyLengthButton({
  isSelected,
  onPress,
  option,
}: {
  isSelected: boolean;
  onPress: () => void;
  option: ReplyLengthOption;
}) {
  return (
    <Pressable
      accessibilityLabel={`${option.label}, ${option.helper}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`min-h-[76px] flex-1 items-center justify-center rounded-lg border px-3 ${getSelectedButtonClassName(
        isSelected,
      )}`}
      onPress={onPress}
    >
      <Text
        className={`text-center text-[15px] font-bold leading-5 ${getSelectedTextClassName(
          isSelected,
        )}`}
      >
        {option.label}
      </Text>
      <Text
        className={`mt-1 text-center text-[13px] leading-4 ${
          isSelected ? "text-neo-surface" : "text-neo-text-muted"
        }`}
      >
        {option.helper}
      </Text>
    </Pressable>
  );
}

function GuardrailRow({
  guardrail,
  isEnabled,
  onToggle,
}: {
  guardrail: Guardrail;
  isEnabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="min-h-[88px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-neo-surface-alt">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={guardrail.icon}
          style={{ height: 30, width: 30 }}
        />
      </View>
      <View className="flex-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-[16px] font-bold leading-5 text-neo-text">
            {guardrail.title}
          </Text>
          {guardrail.required ? (
            <View className="rounded-full border border-neo-warning bg-[#FFF8E8] px-2 py-0.5">
              <Text className="text-[11px] font-bold leading-3 text-neo-warning">
                Required
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-1 text-[13px] leading-5 text-neo-text-muted">
          {guardrail.description}
        </Text>
      </View>
      <Switch
        accessibilityLabel={`${guardrail.title} approval guardrail`}
        accessibilityRole="switch"
        onValueChange={onToggle}
        thumbColor={colors.surface}
        trackColor={{ false: colors.border, true: colors.primary }}
        value={isEnabled}
      />
    </View>
  );
}

export function AiPersonalityScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [settings, setSettings] = useState<AiPersonalitySettings>(defaultSettings);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewReply = useMemo(() => getPreviewReply(settings), [settings]);

  const updateSettings = (nextSettings: Partial<AiPersonalitySettings>) => {
    setSettings((currentSettings) => ({ ...currentSettings, ...nextSettings }));
    setError(null);
  };

  const toggleGuardrail = (guardrailId: GuardrailId) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      approvalGuardrails: {
        ...currentSettings.approvalGuardrails,
        [guardrailId]: !currentSettings.approvalGuardrails[guardrailId],
      },
    }));
    setError(null);
  };

  const handleSave = () => {
    const hasRequiredGuardrailOff = approvalGuardrails.some(
      (guardrail) =>
        guardrail.required && !settings.approvalGuardrails[guardrail.id],
    );

    if (hasRequiredGuardrailOff) {
      setError("Keep receipts and refunds approval-first for this MVP.");
      return;
    }

    setIsSubmitting(true);
    router.push(routes.setup);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
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
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <View className="flex-row items-start gap-3">
          <Link asChild href={routes.setup}>
            <Pressable
              accessibilityLabel="Back to setup checklist"
              accessibilityRole="link"
              className="min-h-11 w-11 items-start justify-center"
            >
              <Text className="text-[34px] leading-9 text-neo-primary">{"<"}</Text>
            </Pressable>
          </Link>

          <View className="flex-1">
            <Text className="text-[30px] font-bold leading-9 text-neo-text">
              AI personality
            </Text>
            <Text className="mt-1 text-[16px] leading-6 text-neo-text-muted">
              {"Match Neo's replies to your brand voice."}
            </Text>
          </View>

          <View className="min-h-9 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt px-4">
            <Text className="text-[15px] font-bold leading-5 text-neo-text">
              Step 4 of 7
            </Text>
          </View>
        </View>

        <View className="mt-7 gap-4">
          <SectionCard
            icon="chat"
            subtitle="Choose how Neo should sound with customers."
            title="Reply tone"
          >
            <View className="flex-row flex-wrap gap-3">
              {toneOptions.map((option) => (
                <ToneButton
                  isSelected={settings.tone === option.id}
                  key={option.id}
                  onPress={() => updateSettings({ tone: option.id })}
                  option={option}
                />
              ))}
            </View>
          </SectionCard>

          <SectionCard
            icon="lang"
            subtitle="How Neo speaks and addresses your customers."
            title="Language & politeness"
          >
            <View className="overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
              <View className="min-h-16 flex-row items-center gap-3 border-b border-neo-border px-3 py-3">
                <Text className="flex-1 text-[16px] leading-6 text-neo-text">
                  Use conversational English (Nigerian)
                </Text>
                <Switch
                  accessibilityLabel="Use conversational Nigerian English"
                  accessibilityRole="switch"
                  onValueChange={(value) =>
                    updateSettings({ useNigerianEnglish: value })
                  }
                  thumbColor={colors.surface}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  value={settings.useNigerianEnglish}
                />
              </View>

              <View className="min-h-16 flex-row items-center gap-3 px-3 py-3">
                <Text className="flex-1 text-[16px] leading-6 text-neo-text">
                  Address customers as
                </Text>
                <View className="flex-1 flex-row gap-2">
                  <SegmentedOption
                    isSelected={settings.customerAddress === "ma-sir"}
                    label="Ma / Sir"
                    onPress={() => updateSettings({ customerAddress: "ma-sir" })}
                  />
                  <SegmentedOption
                    isSelected={settings.customerAddress === "first-name"}
                    label="First name"
                    onPress={() =>
                      updateSettings({ customerAddress: "first-name" })
                    }
                  />
                </View>
              </View>
            </View>
          </SectionCard>

          <SectionCard
            icon="T"
            subtitle="Control how long AI draft replies should be."
            title="Reply length"
          >
            <View className="flex-row gap-3">
              {replyLengthOptions.map((option) => (
                <ReplyLengthButton
                  isSelected={settings.replyLength === option.id}
                  key={option.id}
                  onPress={() => updateSettings({ replyLength: option.id })}
                  option={option}
                />
              ))}
            </View>
          </SectionCard>

          <SectionCard
            icon="safe"
            subtitle="Neo will always ask before taking sensitive actions."
            title="Approval guardrails"
          >
            <View className="mb-3 flex-row items-center justify-end">
              <View className="min-h-9 flex-row items-center gap-2 rounded-full border border-neo-warning bg-[#FFF8E8] px-3">
                <Text className="text-[12px] font-bold leading-4 text-neo-warning">
                  OK
                </Text>
                <Text className="text-[13px] font-bold leading-4 text-neo-warning">
                  Approval-first
                </Text>
              </View>
            </View>

            <View className="overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
              {approvalGuardrails.map((guardrail) => (
                <GuardrailRow
                  guardrail={guardrail}
                  isEnabled={settings.approvalGuardrails[guardrail.id]}
                  key={guardrail.id}
                  onToggle={() => toggleGuardrail(guardrail.id)}
                />
              ))}
            </View>
          </SectionCard>

          <View className="rounded-lg border border-[#AFC8E2] bg-[#F2F7FC] px-4 py-4">
            <View className="flex-row gap-4">
              <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-neo-info bg-[#E5F0F8]">
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={images.iconAiDraft}
                  style={{ height: 48, width: 48 }}
                />
              </View>
              <View className="flex-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-[18px] font-bold leading-6 text-neo-text">
                    AI draft preview
                  </Text>
                  <View className="rounded-full border border-[#9AB9D8] bg-neo-surface px-2 py-1">
                    <Text className="text-[12px] font-bold leading-4 text-neo-info">
                      Draft only
                    </Text>
                  </View>
                </View>
                <Text className="mt-1 text-[13px] leading-5 text-neo-info">
                  Sample reply using your current settings
                </Text>

                <View className="mt-4 rounded-lg border border-[#BCC5CF] bg-neo-surface px-4 py-3">
                  <Text className="text-[15px] leading-6 text-neo-text">
                    {previewReply}
                  </Text>
                  <Text className="mt-2 text-right text-[12px] leading-4 text-neo-text-muted">
                    11:30 AM
                  </Text>
                </View>

                <View className="mt-3 flex-row gap-2">
                  <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full border border-neo-info">
                    <Text className="text-[12px] font-bold leading-4 text-neo-info">
                      i
                    </Text>
                  </View>
                  <Text className="flex-1 text-[13px] leading-5 text-neo-text">
                    This is a draft preview. You will review before anything is
                    sent.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {error ? (
          <Text className="mt-4 text-center text-[13px] font-semibold leading-5 text-neo-error">
            {error}
          </Text>
        ) : null}

        <Pressable
          accessibilityLabel="Save AI rules"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
          className={`mt-6 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg px-5 ${
            isSubmitting ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={isSubmitting}
          onPress={handleSave}
        >
          <View
            className={`h-8 w-8 items-center justify-center rounded-full border-2 ${
              isSubmitting ? "border-neo-text-muted" : "border-neo-surface"
            }`}
          >
            <Text
              className={`text-[18px] font-bold leading-6 ${
                isSubmitting ? "text-neo-text-muted" : "text-neo-surface"
              }`}
            >
              OK
            </Text>
          </View>
          <Text
            className={`text-[20px] font-bold leading-7 ${
              isSubmitting ? "text-neo-text-muted" : "text-neo-surface"
            }`}
          >
            {isSubmitting ? "Saving AI rules" : "Save AI rules"}
          </Text>
        </Pressable>

        <Link asChild href={routes.setup}>
          <Pressable
            accessibilityLabel="Back to checklist"
            accessibilityRole="link"
            className="mt-4 min-h-14 flex-row items-center justify-center gap-3 rounded-lg border border-neo-primary bg-neo-surface px-5"
          >
            <Text className="text-[24px] leading-7 text-neo-primary">{"<"}</Text>
            <Text className="text-[17px] font-bold leading-6 text-neo-primary">
              Back to checklist
            </Text>
          </Pressable>
        </Link>

        <Pressable
          accessibilityLabel="Reset AI personality settings to defaults"
          accessibilityRole="button"
          className="mt-3 min-h-11 flex-row items-center justify-center gap-3 px-5"
          onPress={handleReset}
        >
          <Text className="text-[15px] font-bold leading-5 text-neo-text-muted">
            R
          </Text>
          <Text className="text-[15px] font-semibold leading-5 text-neo-text-muted">
            Reset to defaults
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
