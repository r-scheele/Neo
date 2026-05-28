import { useMemo, useState } from "react";
import type { ImageSourcePropType, KeyboardTypeOptions } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useSetupStore } from "@/stores/useSetupStore";

type BusinessProfileForm = {
  businessName: string;
  businessCategory: string;
  cityArea: string;
  businessPhone: string;
};

type BusinessProfileErrors = Partial<Record<keyof BusinessProfileForm, string>>;

type BusinessProfileFieldProps = {
  error?: string;
  helper: string;
  icon: ImageSourcePropType;
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
  keyboardType?: KeyboardTypeOptions;
};

const businessCategories = [
  "Women's fashion",
  "Tailoring / custom wear",
  "Food and snacks",
  "Beauty / hair",
  "Home and decor",
  "Other retail",
] as const;

const emptyForm: BusinessProfileForm = {
  businessName: "",
  businessCategory: businessCategories[0],
  cityArea: "",
  businessPhone: "",
};

function validateBusinessProfile(form: BusinessProfileForm) {
  const errors: BusinessProfileErrors = {};

  if (!form.businessName.trim()) {
    errors.businessName = "Enter the business name customers know you by.";
  }

  if (!form.businessCategory.trim()) {
    errors.businessCategory = "Choose the option that best describes what you sell.";
  }

  if (!form.cityArea.trim()) {
    errors.cityArea = "Enter the city or area your customers know.";
  }

  if (!form.businessPhone.trim()) {
    errors.businessPhone = "Enter the WhatsApp number customers can reach.";
  }

  return errors;
}

function getInputBorderClassName(error?: string) {
  return error ? "border-neo-error" : "border-neo-border";
}

function BusinessProfileField({
  error,
  helper,
  icon,
  keyboardType,
  label,
  maxLength,
  onChangeText,
  placeholder,
  value,
}: BusinessProfileFieldProps) {
  return (
    <View className="flex-row gap-4">
      <View className="min-h-[76px] w-10 items-center pt-8">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={icon}
          style={{ height: 30, width: 30 }}
        />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-[16px] font-bold leading-6 text-neo-text">
            {label}
          </Text>
          {maxLength ? (
            <Text className="text-[13px] font-semibold leading-4 text-neo-primary">
              {value.length}/{maxLength}
            </Text>
          ) : null}
        </View>

        <View
          className={`mt-2 min-h-14 justify-center rounded-lg border bg-neo-surface px-4 ${getInputBorderClassName(
            error,
          )}`}
        >
          <TextInput
            accessibilityLabel={label}
            autoCapitalize={keyboardType === "phone-pad" ? "none" : "words"}
            autoCorrect={false}
            className="min-h-12 text-[17px] leading-6 text-neo-text"
            inputMode={keyboardType === "phone-pad" ? "tel" : "text"}
            keyboardType={keyboardType}
            maxLength={maxLength}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            value={value}
          />
        </View>

        <Text
          className={`mt-2 text-[13px] leading-5 ${
            error ? "font-semibold text-neo-error" : "text-neo-text-muted"
          }`}
        >
          {error ?? helper}
        </Text>
      </View>
    </View>
  );
}

export function BusinessProfileScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const savedDraft = useSetupStore((store) => store.businessProfileDraft);
  const setBusinessProfileDraft = useSetupStore(
    (store) => store.setBusinessProfileDraft,
  );
  const markStepComplete = useSetupStore((store) => store.markStepComplete);
  const [formOverrides, setFormOverrides] = useState<Partial<BusinessProfileForm>>(
    {},
  );
  const [errors, setErrors] = useState<BusinessProfileErrors>({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form: BusinessProfileForm = {
    ...emptyForm,
    ...savedDraft,
    ...formOverrides,
  };

  const previewName = form.businessName.trim() || "Your business name";
  const previewCity = form.cityArea.trim() || "City / area";
  const previewPhone = form.businessPhone.trim() || "Business phone";

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const updateField = (field: keyof BusinessProfileForm, value: string) => {
    setFormOverrides((currentFormOverrides) => ({
      ...currentFormOverrides,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleCategorySelect = (category: string) => {
    updateField("businessCategory", category);
    setIsCategoryOpen(false);
  };

  const handleSave = () => {
    const validationErrors = validateBusinessProfile(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setBusinessProfileDraft({
      businessCategory: form.businessCategory,
      businessName: form.businessName.trim(),
      cityArea: form.cityArea.trim(),
    });
    markStepComplete("business-profile");
    trackAnalyticsEvent("setup_step_completed", {
      business_type: form.businessCategory,
      step_id: "business-profile",
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
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[430px]">
        <View className="flex-row items-center gap-3">
          <Link asChild href={routes.setup}>
            <Pressable
              accessibilityLabel="Back to setup checklist"
              accessibilityRole="link"
              className="min-h-11 w-11 items-start justify-center"
            >
              <Text className="text-[34px] leading-9 text-neo-text">{"<"}</Text>
            </Pressable>
          </Link>

          <View className="flex-1 items-center">
            <Text
              className="text-center text-[22px] font-bold leading-7 text-neo-text"
              numberOfLines={1}
            >
              Business profile
            </Text>
          </View>

          <View className="min-h-9 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt px-4">
            <Text className="text-[15px] font-bold leading-5 text-neo-text">
              Step 1 of 7
            </Text>
          </View>
        </View>

        <Text className="mt-4 text-center text-[18px] leading-6 text-neo-text-muted">
          Tell Neo who you are replying for.
        </Text>

        <View className="mt-8 gap-6 rounded-lg border border-neo-border bg-neo-surface px-4 py-5">
          <BusinessProfileField
            error={errors.businessName}
            helper="Use the name your customers know you by."
            icon={images.iconSettings}
            label="Business name"
            maxLength={60}
            onChangeText={(value) => updateField("businessName", value)}
            placeholder="Zuri Collections"
            value={form.businessName}
          />

          <View className="flex-row gap-4">
            <View className="min-h-[76px] w-10 items-center pt-8">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconProduct}
                style={{ height: 30, width: 30 }}
              />
            </View>

            <View className="flex-1">
              <Text className="text-[16px] font-bold leading-6 text-neo-text">
                Business category
              </Text>
              <Pressable
                accessibilityHint="Shows business category options."
                accessibilityLabel="Business category"
                accessibilityRole="button"
                className={`mt-2 min-h-14 flex-row items-center justify-between gap-3 rounded-lg border bg-neo-surface px-4 ${getInputBorderClassName(
                  errors.businessCategory,
                )}`}
                onPress={() => setIsCategoryOpen((current) => !current)}
              >
                <Text className="flex-1 text-[17px] leading-6 text-neo-text">
                  {form.businessCategory}
                </Text>
                <Text className="text-[22px] leading-6 text-neo-text-muted">v</Text>
              </Pressable>

              {isCategoryOpen ? (
                <View className="mt-2 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
                  {businessCategories.map((category) => (
                    <Pressable
                      accessibilityLabel={`Choose ${category}`}
                      accessibilityRole="button"
                      className={`min-h-11 justify-center border-b border-neo-border px-4 ${
                        category === form.businessCategory ? "bg-neo-surface-alt" : ""
                      }`}
                      key={category}
                      onPress={() => handleCategorySelect(category)}
                    >
                      <Text className="text-[15px] font-semibold leading-5 text-neo-text">
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              <Text
                className={`mt-2 text-[13px] leading-5 ${
                  errors.businessCategory
                    ? "font-semibold text-neo-error"
                    : "text-neo-text-muted"
                }`}
              >
                {errors.businessCategory ??
                  "Choose the option that best describes what you sell."}
              </Text>
            </View>
          </View>

          <BusinessProfileField
            error={errors.cityArea}
            helper="Helps Neo tailor replies to your local customers."
            icon={images.iconDelivery}
            label="City / area"
            onChangeText={(value) => updateField("cityArea", value)}
            placeholder="Lagos, Nigeria"
            value={form.cityArea}
          />

          <BusinessProfileField
            error={errors.businessPhone}
            helper="The number customers reach you on WhatsApp."
            icon={images.iconCustomer}
            keyboardType="phone-pad"
            label="Business phone"
            onChangeText={(value) => updateField("businessPhone", value)}
            placeholder="+234 801 234 5678"
            value={form.businessPhone}
          />
        </View>

        <View className="mt-6 rounded-lg border border-neo-border bg-neo-surface p-4">
          <Text className="text-[18px] font-bold leading-6 text-neo-text">
            Reply context preview
          </Text>
          <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
            This is how Neo will understand your business.
          </Text>

          <View className="mt-4 flex-row gap-4 rounded-lg border border-dashed border-neo-border bg-neo-surface-alt p-4">
            <View className="h-16 w-16 items-center justify-center rounded-full border border-neo-border bg-neo-background">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconSettings}
                style={{ height: 36, width: 36 }}
              />
            </View>
            <View className="flex-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-[18px] font-bold leading-6 text-neo-text">
                  {previewName}
                </Text>
                <View className="rounded-full bg-[#E8F1E8] px-3 py-1">
                  <Text className="text-[13px] font-semibold leading-4 text-neo-primary">
                    {form.businessCategory}
                  </Text>
                </View>
              </View>
              <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
                {previewCity} - {previewPhone}
              </Text>
              <Text className="mt-3 text-[14px] font-bold leading-5 text-neo-warning">
                Warm, helpful and professional tone
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6 flex-row items-center gap-4 rounded-lg border border-[#B9D1BA] bg-[#F6FAF3] px-4 py-4">
          <View className="h-14 w-14 items-center justify-center rounded-full border border-[#B9D1BA] bg-neo-surface">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconPermission}
              style={{ height: 30, width: 30 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold leading-6 text-neo-text">
              Your business data is private and secure.
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text">
              We only use it to personalize replies and organize your work.
            </Text>
          </View>
        </View>

        {hasErrors ? (
          <Text className="mt-4 text-center text-[13px] font-semibold leading-5 text-neo-error">
            Fix the highlighted fields before saving this setup step.
          </Text>
        ) : null}

        <Pressable
          accessibilityLabel="Save profile"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
          className={`mt-7 min-h-14 w-full items-center justify-center rounded-lg px-5 ${
            isSubmitting ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={isSubmitting}
          onPress={handleSave}
        >
          <Text
            className={`text-[17px] font-bold leading-6 ${
              isSubmitting ? "text-neo-text-muted" : "text-neo-surface"
            }`}
          >
            {isSubmitting ? "Saving profile" : "Save profile"}
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
      </View>
    </ScrollView>
  );
}
