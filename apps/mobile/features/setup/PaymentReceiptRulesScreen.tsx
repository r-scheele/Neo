import { useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, Switch, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";
import {
  type PaymentMethodId,
  type PaymentRulesSettings,
  type ReceiptCheckId,
  useSetupStore,
} from "@/stores/useSetupStore";

type PaymentMethod = {
  id: PaymentMethodId;
  title: string;
  description: string;
  icon: ImageSourcePropType;
};

type ReceiptCheck = {
  id: ReceiptCheckId;
  title: string;
  description: string;
  icon: ImageSourcePropType;
};

type ConfirmationRole = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
  status: string;
  tone: "success" | "muted";
};

const paymentMethods: readonly PaymentMethod[] = [
  {
    id: "bank-transfer",
    title: "Bank transfer",
    description: "Customers send to your account",
    icon: images.iconPaid,
  },
  {
    id: "payment-link",
    title: "Payment link",
    description: "Customers pay with a card or wallet",
    icon: images.iconProduct,
  },
  {
    id: "pay-on-delivery",
    title: "Pay on delivery",
    description: "Collect only after delivery handoff",
    icon: images.iconDelivery,
  },
];

const receiptChecks: readonly ReceiptCheck[] = [
  {
    id: "bank-alert",
    title: "Bank alert received",
    description: "Confirm payment in your bank app",
    icon: images.iconPaid,
  },
  {
    id: "amount-match",
    title: "Amount matches order",
    description: "Must be the exact expected amount",
    icon: images.iconReceiptReview,
  },
  {
    id: "payer-name",
    title: "Payer name matches",
    description: "Name must match customer details",
    icon: images.iconCustomer,
  },
];

function getStatusToneClassName(tone: "success" | "muted") {
  if (tone === "success") {
    return "border-[#BCD9C5] bg-[#EAF3EA] text-neo-primary";
  }

  return "border-neo-border bg-neo-surface-alt text-neo-text-muted";
}

function SectionCard({
  children,
  description,
  number,
  title,
  trailing,
}: {
  children: React.ReactNode;
  description: string;
  number: string;
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View className="rounded-lg border border-neo-border bg-neo-surface px-3 py-4">
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text className="text-[20px] font-bold leading-7 text-neo-primary">
            {number}. {title}
          </Text>
          <Text className="mt-1 text-[15px] leading-5 text-neo-text-muted">
            {description}
          </Text>
        </View>
        {trailing}
      </View>
      <View className="mt-4">{children}</View>
    </View>
  );
}

function ProgressChip() {
  return (
    <View className="min-h-[58px] justify-center rounded-lg border border-neo-border bg-neo-surface px-4">
      <Text className="text-[14px] font-bold leading-5 text-neo-text">
        Step 5 of 7
      </Text>
      <View className="mt-2 flex-row gap-1.5">
        {[0, 1, 2, 3, 4, 5, 6].map((segment) => (
          <View
            className={`h-1.5 w-5 rounded-full ${
              segment < 5 ? "bg-neo-primary" : "bg-neo-border"
            }`}
            key={segment}
          />
        ))}
      </View>
    </View>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "muted";
}) {
  return (
    <View
      className={`min-h-8 flex-row items-center gap-2 rounded-lg border px-3 ${getStatusToneClassName(
        tone,
      )}`}
    >
      <View className="h-4 w-4 items-center justify-center rounded-full border">
        <Text className="text-[9px] font-bold leading-3">
          {tone === "success" ? "OK" : "x"}
        </Text>
      </View>
      <Text className="text-[13px] font-bold leading-4">{label}</Text>
    </View>
  );
}

function PaymentMethodRow({
  isActive,
  method,
  onToggle,
}: {
  isActive: boolean;
  method: PaymentMethod;
  onToggle: () => void;
}) {
  return (
    <Pressable
      accessibilityHint="Toggles whether customers can use this payment method."
      accessibilityLabel={`${method.title}, ${isActive ? "active" : "inactive"}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      className="min-h-[84px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3"
      onPress={onToggle}
    >
      <View
        className={`h-14 w-14 items-center justify-center rounded-lg ${
          method.id === "payment-link" ? "bg-[#F8F0E4]" : "bg-[#EAF3EA]"
        }`}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={method.icon}
          style={{ height: 32, width: 32 }}
        />
      </View>
      <View className="flex-1">
        <Text className="text-[17px] font-bold leading-6 text-neo-text">
          {method.title}
        </Text>
        <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
          {method.description}
        </Text>
      </View>
      <View className="items-end gap-2">
        <StatusBadge
          label={isActive ? "Active" : "Off"}
          tone={isActive ? "success" : "muted"}
        />
        <Text className="text-[24px] leading-7 text-neo-text-muted">{">"}</Text>
      </View>
    </Pressable>
  );
}

function ReceiptCheckRow({
  check,
  isEnabled,
  onToggle,
}: {
  check: ReceiptCheck;
  isEnabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="min-h-[82px] flex-row items-center gap-3 border-b border-neo-border px-1 py-3">
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${
          isEnabled ? "bg-[#EAF3EA]" : "bg-neo-surface-alt"
        }`}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={check.icon}
          style={{ height: 26, width: 26 }}
        />
      </View>
      <View className="flex-1">
        <Text className="text-[16px] font-bold leading-5 text-neo-text">
          {check.title}
        </Text>
        <Text className="mt-1 text-[13px] leading-5 text-neo-text-muted">
          {check.description}
        </Text>
      </View>
      <Switch
        accessibilityLabel={`${check.title} required check`}
        accessibilityRole="switch"
        onValueChange={onToggle}
        thumbColor={colors.surface}
        trackColor={{ false: colors.border, true: colors.primary }}
        value={isEnabled}
      />
    </View>
  );
}

function ConfirmationRoleRow({ role }: { role: ConfirmationRole }) {
  return (
    <View className="min-h-[82px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3">
      <View
        className={`h-14 w-14 items-center justify-center rounded-lg ${
          role.tone === "success" ? "bg-[#EAF3EA]" : "bg-[#E6E6E6]"
        }`}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={role.icon}
          style={{ height: 31, width: 31 }}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-[16px] font-bold leading-5 ${
            role.tone === "success" ? "text-neo-text" : "text-neo-text-muted"
          }`}
        >
          {role.title}
        </Text>
        <Text className="mt-1 text-[13px] leading-5 text-neo-text-muted">
          {role.description}
        </Text>
      </View>
      <StatusBadge label={role.status} tone={role.tone} />
    </View>
  );
}

export function PaymentReceiptRulesScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const savedRules = useSetupStore((store) => store.paymentRulesSettings);
  const setPaymentRulesSettings = useSetupStore(
    (store) => store.setPaymentRulesSettings,
  );
  const markStepComplete = useSetupStore((store) => store.markStepComplete);
  const [draftRules, setDraftRules] = useState<PaymentRulesSettings>(savedRules);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visiblePaymentMethods = useMemo(
    () =>
      draftRules.showDeliveryMethod
        ? paymentMethods
        : paymentMethods.filter((method) => method.id !== "pay-on-delivery"),
    [draftRules.showDeliveryMethod],
  );

  const confirmationRoles = useMemo<readonly ConfirmationRole[]>(
    () => [
      {
        title: "Owner",
        description: "You can always confirm payments",
        icon: images.iconCustomer,
        status: "Always allowed",
        tone: "success",
      },
      {
        title: "Managers",
        description: draftRules.managersCanConfirm
          ? "Can confirm after owner/manager review"
          : "Need owner approval before confirming",
        icon: images.iconApprovals,
        status: draftRules.managersCanConfirm ? "Allowed" : "Review only",
        tone: draftRules.managersCanConfirm ? "success" : "muted",
      },
      {
        title: "Staff",
        description: "Staff cannot confirm payments",
        icon: images.iconPermission,
        status: "Restricted",
        tone: "muted",
      },
    ],
    [draftRules.managersCanConfirm],
  );

  const updateRules = (nextRules: Partial<PaymentRulesSettings>) => {
    setDraftRules((currentRules) => ({ ...currentRules, ...nextRules }));
    setError(null);
    setNotice(null);
  };

  const togglePaymentMethod = (methodId: PaymentMethodId) => {
    setDraftRules((currentRules) => ({
      ...currentRules,
      activeMethods: {
        ...currentRules.activeMethods,
        [methodId]: !currentRules.activeMethods[methodId],
      },
    }));
    setError(null);
    setNotice(null);
  };

  const toggleRequiredCheck = (checkId: ReceiptCheckId) => {
    setDraftRules((currentRules) => ({
      ...currentRules,
      requiredChecks: {
        ...currentRules.requiredChecks,
        [checkId]: !currentRules.requiredChecks[checkId],
      },
    }));
    setError(null);
    setNotice(null);
  };

  const handleAddMethod = () => {
    if (draftRules.showDeliveryMethod) {
      setNotice("Pay on delivery is already available as a local setup option.");
      return;
    }

    setDraftRules((currentRules) => ({
      ...currentRules,
      showDeliveryMethod: true,
      activeMethods: {
        ...currentRules.activeMethods,
        "pay-on-delivery": true,
      },
    }));
    setError(null);
    setNotice("Pay on delivery added locally. No payment provider was connected.");
  };

  const handleSave = () => {
    const activeMethodCount = visiblePaymentMethods.filter(
      (method) => draftRules.activeMethods[method.id],
    ).length;

    if (activeMethodCount === 0) {
      setError("Keep at least one customer payment method active.");
      return;
    }

    if (!draftRules.manualReceiptReview) {
      setError("Manual receipt review must stay on for transfer receipts.");
      return;
    }

    const hasRequiredCheckOff = receiptChecks.some(
      (check) => !draftRules.requiredChecks[check.id],
    );

    if (hasRequiredCheckOff) {
      setError("Keep all receipt checks on before confirming payment rules.");
      return;
    }

    setIsSubmitting(true);
    setPaymentRulesSettings(draftRules);
    markStepComplete("payment-rules");
    trackAnalyticsEvent("setup_step_completed", {
      step_id: "payment-rules",
    });
    router.push(routes.setup);
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
        <View>
          <View className="flex-row items-center justify-between gap-3">
            <Link asChild href={routes.setup}>
              <Pressable
                accessibilityLabel="Back to setup checklist"
                accessibilityRole="link"
                className="min-h-11 w-11 items-start justify-center"
              >
                <Text className="text-[34px] leading-9 text-neo-primary">{"<"}</Text>
              </Pressable>
            </Link>

            <ProgressChip />
          </View>

          <View className="mt-5 items-center px-2">
            <Text className="text-center text-[26px] font-bold leading-8 text-neo-text">
              Payment rules
            </Text>
            <Text className="mt-2 text-center text-[15px] leading-5 text-neo-text-muted">
              Set how customers pay and how receipts are reviewed safely.
            </Text>
          </View>
        </View>

        <View className="mt-7 gap-4">
          <SectionCard
            description="Choose how customers can pay you."
            number="1"
            title="Payment methods"
          >
            <View className="overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
              {visiblePaymentMethods.map((method) => (
                <PaymentMethodRow
                  isActive={draftRules.activeMethods[method.id]}
                  key={method.id}
                  method={method}
                  onToggle={() => togglePaymentMethod(method.id)}
                />
              ))}
            </View>

            <Pressable
              accessibilityHint="Adds a safe local payment method preference only."
              accessibilityLabel="Add payment method"
              accessibilityRole="button"
              className="mt-4 min-h-14 flex-row items-center justify-center gap-3 rounded-lg border border-dashed border-neo-border bg-neo-surface px-4"
              onPress={handleAddMethod}
            >
              <Text className="text-[26px] leading-7 text-neo-primary">+</Text>
              <Text className="text-[16px] font-bold leading-5 text-neo-primary">
                Add method
              </Text>
            </Pressable>
          </SectionCard>

          <SectionCard
            description="We never confirm screenshots automatically."
            number="2"
            title="Manual receipt review"
            trailing={
              <Switch
                accessibilityLabel="Manual receipt review"
                accessibilityRole="switch"
                onValueChange={(value) =>
                  updateRules({ manualReceiptReview: value })
                }
                thumbColor={colors.surface}
                trackColor={{ false: colors.border, true: colors.primary }}
                value={draftRules.manualReceiptReview}
              />
            }
          >
            <View className="rounded-lg border border-[#E9BF73] bg-[#FFF7EA] px-4 py-4">
              <View className="flex-row gap-3">
                <View className="h-14 w-14 items-center justify-center rounded-full border border-neo-warning bg-neo-surface">
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    source={images.iconWarning}
                    style={{ height: 30, width: 30 }}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text className="text-[15px] font-bold leading-5 text-neo-warning">
                      Verify against bank alert before confirming.
                    </Text>
                    <View className="rounded-lg bg-[#F8DCA8] px-3 py-1">
                      <Text className="text-[12px] font-bold leading-4 text-neo-warning">
                        Important
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
                    Manual transfer screenshots are not proof of payment.
                    Confirm only after you see your bank alert.
                  </Text>
                </View>
              </View>
            </View>

            <Text className="mt-5 text-[16px] font-bold leading-6 text-neo-text">
              Required checks
            </Text>
            <View className="mt-2">
              {receiptChecks.map((check) => (
                <ReceiptCheckRow
                  check={check}
                  isEnabled={draftRules.requiredChecks[check.id]}
                  key={check.id}
                  onToggle={() => toggleRequiredCheck(check.id)}
                />
              ))}
            </View>
          </SectionCard>

          <SectionCard
            description="Control who can confirm payments after review."
            number="3"
            title="Who can confirm payment"
          >
            <View className="overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
              {confirmationRoles.map((role) => (
                <ConfirmationRoleRow key={role.title} role={role} />
              ))}
            </View>

            <View className="mt-4 flex-row items-center justify-between gap-3 rounded-lg border border-neo-border bg-neo-surface-alt px-4 py-3">
              <View className="flex-1">
                <Text className="text-[15px] font-bold leading-5 text-neo-text">
                  Managers can confirm
                </Text>
                <Text className="mt-1 text-[13px] leading-5 text-neo-text-muted">
                  Staff remain restricted from payment confirmation.
                </Text>
              </View>
              <Switch
                accessibilityLabel="Managers can confirm reviewed payments"
                accessibilityRole="switch"
                onValueChange={(value) =>
                  updateRules({ managersCanConfirm: value })
                }
                thumbColor={colors.surface}
                trackColor={{ false: colors.border, true: colors.primary }}
                value={draftRules.managersCanConfirm}
              />
            </View>

            <View className="mt-4 flex-row items-center gap-3 rounded-lg border border-[#C2D3E4] bg-[#F1F7FC] px-4 py-4">
              <View className="h-14 w-14 items-center justify-center rounded-full border border-neo-info bg-neo-surface">
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={images.iconPaid}
                  style={{ height: 32, width: 32 }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold leading-5 text-neo-info">
                  Bank alert is the final proof.
                </Text>
                <Text className="mt-1 text-[13px] leading-5 text-neo-text">
                  If you do not see the alert, keep the order as Pending.
                </Text>
              </View>
              <View className="rounded-lg bg-[#DCEBF7] px-3 py-2">
                <Text className="text-[12px] font-bold leading-4 text-neo-info">
                  Trust first
                </Text>
              </View>
            </View>
          </SectionCard>
        </View>

        {notice ? (
          <Text className="mt-4 text-center text-[13px] font-semibold leading-5 text-neo-info">
            {notice}
          </Text>
        ) : null}

        {error ? (
          <Text className="mt-4 text-center text-[13px] font-semibold leading-5 text-neo-error">
            {error}
          </Text>
        ) : null}

        <Pressable
          accessibilityLabel="Save payment rules"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
          className={`mt-6 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg px-5 ${
            isSubmitting ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={isSubmitting}
          onPress={handleSave}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconReceiptReview}
            style={{ height: 28, width: 28 }}
          />
          <Text
            className={`text-[18px] font-bold leading-6 ${
              isSubmitting ? "text-neo-text-muted" : "text-neo-surface"
            }`}
          >
            {isSubmitting ? "Saving payment rules" : "Save payment rules"}
          </Text>
        </Pressable>

        <Link asChild href={routes.setup}>
          <Pressable
            accessibilityLabel="Back to checklist"
            accessibilityRole="link"
            className="mt-4 min-h-14 flex-row items-center justify-center gap-3 px-5"
          >
            <Text className="text-[24px] leading-7 text-neo-primary">{"<"}</Text>
            <Text className="text-[17px] font-bold leading-6 text-neo-primary">
              Back to checklist
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
