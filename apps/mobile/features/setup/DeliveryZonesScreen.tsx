import { useMemo, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useSetupStore } from "@/stores/useSetupStore";

type DeliveryZoneStatus = "default" | "active";

type DeliveryZone = {
  id: string;
  location: string;
  fee: number;
  note: string;
  status: DeliveryZoneStatus;
};

type DeliveryZoneForm = {
  location: string;
  fee: string;
  note: string;
};

type DeliveryZoneErrors = Partial<Record<keyof DeliveryZoneForm, string>>;

const initialZones: readonly DeliveryZone[] = [
  {
    id: "lekki",
    location: "Lekki",
    fee: 1500,
    note: "1-2 days delivery",
    status: "default",
  },
  {
    id: "yaba",
    location: "Yaba",
    fee: 1000,
    note: "1-2 days delivery",
    status: "active",
  },
  {
    id: "ikeja",
    location: "Ikeja",
    fee: 1200,
    note: "Same-day delivery",
    status: "active",
  },
  {
    id: "abuja",
    location: "Abuja",
    fee: 2500,
    note: "2-3 days delivery",
    status: "active",
  },
];

const emptyForm: DeliveryZoneForm = {
  location: "",
  fee: "",
  note: "",
};

function parseFee(value: string) {
  const normalizedValue = value.replace(/,/g, "").trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedFee = Number(normalizedValue);

  if (!Number.isFinite(parsedFee)) {
    return null;
  }

  return parsedFee;
}

function formatFee(fee: number) {
  return `NGN ${fee.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}

function validateDeliveryZoneForm(form: DeliveryZoneForm) {
  const errors: DeliveryZoneErrors = {};
  const fee = parseFee(form.fee);

  if (!form.location.trim()) {
    errors.location = "Enter a delivery location customers know.";
  }

  if (fee === null) {
    errors.fee = "Enter a valid delivery fee.";
  } else if (fee < 0) {
    errors.fee = "Fee cannot be negative.";
  } else if (!Number.isInteger(fee)) {
    errors.fee = "Use whole naira amounts only.";
  }

  return errors;
}

function getInputBorderClassName(error?: string) {
  return error ? "border-neo-error" : "border-neo-border";
}

function getStatusLabel(status: DeliveryZoneStatus) {
  return status === "default" ? "Default" : "Active";
}

function getStatusBadgeClassName(status: DeliveryZoneStatus) {
  return status === "default"
    ? "border-[#BCD9C5] bg-[#EEF8F0]"
    : "border-neo-border bg-[#F4F7EF]";
}

function StepChip() {
  return (
    <View className="min-h-10 items-center justify-center rounded-full border border-neo-success bg-neo-surface px-4">
      <Text className="text-[15px] font-bold leading-5 text-neo-primary">
        Step 6 of 7
      </Text>
    </View>
  );
}

function ZoneInput({
  error,
  label,
  onChangeText,
  placeholder,
  value,
  keyboardType,
}: {
  error?: string;
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View className="flex-1">
      <Text className="text-[15px] font-semibold leading-5 text-neo-text">
        {label}
      </Text>
      <View
        className={`mt-2 min-h-14 flex-row items-center gap-3 rounded-lg border bg-neo-surface px-4 ${getInputBorderClassName(
          error,
        )}`}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={label === "Location" ? images.iconDelivery : images.iconReceiptReview}
          style={{ height: 26, width: 26 }}
        />
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={label === "Location" ? "words" : "sentences"}
          autoCorrect={false}
          className="min-h-12 flex-1 text-[16px] leading-6 text-neo-text"
          inputMode={keyboardType === "numeric" ? "numeric" : "text"}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
        />
      </View>
      {error ? (
        <Text className="mt-2 text-[13px] font-semibold leading-5 text-neo-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function DeliveryZoneRow({
  onDelete,
  onEdit,
  zone,
}: {
  onDelete: () => void;
  onEdit: () => void;
  zone: DeliveryZone;
}) {
  return (
    <View className="min-h-[104px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3">
      <View className="h-14 w-14 items-center justify-center rounded-lg bg-[#F8EEDC]">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={images.iconDelivery}
          style={{ height: 34, width: 34 }}
        />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-[18px] font-bold leading-6 text-neo-text"
          numberOfLines={1}
        >
          {zone.location}
        </Text>
        <Text
          className="mt-1 text-[14px] leading-5 text-neo-text-muted"
          numberOfLines={2}
        >
          {zone.note}
        </Text>
      </View>

      <View className="items-end gap-2">
        <View
          className={`min-h-8 flex-row items-center gap-2 rounded-lg border px-3 ${getStatusBadgeClassName(
            zone.status,
          )}`}
        >
          <View className="h-3 w-3 rounded-full bg-neo-primary" />
          <Text className="text-[13px] font-semibold leading-4 text-neo-primary">
            {getStatusLabel(zone.status)}
          </Text>
        </View>
        <Text
          className="text-right text-[16px] font-bold leading-5 text-neo-text"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {formatFee(zone.fee)}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          accessibilityLabel={`Edit ${zone.location}`}
          accessibilityRole="button"
          className="min-h-11 w-11 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
          onPress={onEdit}
        >
          <Text className="text-[16px] font-bold leading-5 text-neo-text">Edit</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`Remove ${zone.location}`}
          accessibilityRole="button"
          className="min-h-11 w-11 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
          onPress={onDelete}
        >
          <Text className="text-[16px] font-bold leading-5 text-neo-error">Del</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function DeliveryZonesScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const setDeliveryZoneCount = useSetupStore((store) => store.setDeliveryZoneCount);
  const markStepComplete = useSetupStore((store) => store.markStepComplete);
  const [zones, setZones] = useState<readonly DeliveryZone[]>(initialZones);
  const [form, setForm] = useState<DeliveryZoneForm>(emptyForm);
  const [errors, setErrors] = useState<DeliveryZoneErrors>({});
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const zoneCountLabel = useMemo(
    () => `${zones.length} ${zones.length === 1 ? "zone" : "zones"}`,
    [zones.length],
  );
  const isEditing = editingZoneId !== null;

  const updateField = (field: keyof DeliveryZoneForm, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (errors[field]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingZoneId(null);
  };

  const handleEdit = (zone: DeliveryZone) => {
    setForm({
      location: zone.location,
      fee: String(zone.fee),
      note: zone.note,
    });
    setErrors({});
    setEditingZoneId(zone.id);
  };

  const handleDelete = (zoneId: string) => {
    setZones((currentZones) => currentZones.filter((zone) => zone.id !== zoneId));
    if (editingZoneId === zoneId) {
      resetForm();
    }
  };

  const handleAddOrUpdateZone = () => {
    const validationErrors = validateDeliveryZoneForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const fee = parseFee(form.fee);

    if (fee === null) {
      return;
    }

    if (editingZoneId) {
      setZones((currentZones) =>
        currentZones.map((zone) =>
          zone.id === editingZoneId
            ? {
                ...zone,
                fee,
                location: form.location.trim(),
                note: form.note.trim() || "Delivery timing to confirm",
              }
            : zone,
        ),
      );
      resetForm();
      return;
    }

    const normalizedLocation = form.location.trim();
    const nextZone: DeliveryZone = {
      id: `${normalizedLocation.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      fee,
      location: normalizedLocation,
      note: form.note.trim() || "Delivery timing to confirm",
      status: zones.length === 0 ? "default" : "active",
    };

    setZones((currentZones) => [...currentZones, nextZone]);
    resetForm();
  };

  const handleSave = () => {
    if (zones.length === 0) {
      setErrors({
        location: "Add at least one delivery zone before saving.",
      });
      return;
    }

    setIsSubmitting(true);
    setDeliveryZoneCount(zones.length);
    markStepComplete("delivery-zones");
    trackAnalyticsEvent("setup_step_completed", {
      step_id: "delivery-zones",
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
        <View>
          <View className="flex-row items-center justify-between gap-3">
            <Link asChild href={routes.setup}>
              <Pressable
                accessibilityLabel="Back to setup checklist"
                accessibilityRole="link"
                className="min-h-11 w-11 items-start justify-center"
              >
                <Text className="text-[34px] leading-9 text-neo-text">{"<"}</Text>
              </Pressable>
            </Link>

            <StepChip />
          </View>

          <View className="mt-5 items-center px-2">
            <Text className="text-center text-[26px] font-bold leading-8 text-neo-text">
              Delivery zones
            </Text>
            <Text className="mt-3 text-center text-[16px] leading-6 text-neo-text-muted">
              Add common locations and fees so Neo can share accurate delivery
              details.
            </Text>
          </View>
        </View>

        <View className="mt-7 rounded-lg border border-neo-border bg-neo-surface px-4 py-5">
          <View className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F8EEDC]">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconDelivery}
                style={{ height: 34, width: 34 }}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[20px] font-bold leading-7 text-neo-text">
                {isEditing ? "Edit zone" : "Add new zone"}
              </Text>
              {isEditing ? (
                <Pressable
                  accessibilityLabel="Cancel editing zone"
                  accessibilityRole="button"
                  className="mt-1 min-h-8 justify-center"
                  onPress={resetForm}
                >
                  <Text className="text-[14px] font-semibold leading-5 text-neo-primary">
                    Cancel edit
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View className="mt-5 gap-4">
            <ZoneInput
              error={errors.location}
              label="Location"
              onChangeText={(value) => updateField("location", value)}
              placeholder="e.g. Lekki, Ajah, Yaba"
              value={form.location}
            />

            <View className="flex-row gap-3">
              <ZoneInput
                error={errors.fee}
                keyboardType="numeric"
                label="Delivery fee (NGN)"
                onChangeText={(value) => updateField("fee", value)}
                placeholder="0"
                value={form.fee}
              />
              <ZoneInput
                error={errors.note}
                label="Note (optional)"
                onChangeText={(value) => updateField("note", value)}
                placeholder="e.g. 1-2 days"
                value={form.note}
              />
            </View>
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-between gap-4">
          <Text className="text-[18px] font-semibold leading-6 text-neo-text">
            Your delivery zones
          </Text>
          <Text className="text-[17px] font-bold leading-6 text-neo-primary">
            {zoneCountLabel}
          </Text>
        </View>

        {zones.length > 0 ? (
          <View className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
            {zones.map((zone) => (
              <DeliveryZoneRow
                key={zone.id}
                onDelete={() => handleDelete(zone.id)}
                onEdit={() => handleEdit(zone)}
                zone={zone}
              />
            ))}
          </View>
        ) : (
          <View className="mt-3 items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-8">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.emptyProducts}
              style={{ height: 116, width: 148 }}
            />
            <Text className="mt-4 text-center text-[18px] font-bold leading-6 text-neo-text">
              Add your first zone
            </Text>
            <Text className="mt-2 text-center text-[14px] leading-5 text-neo-text-muted">
              Delivery locations and fees will help Neo avoid vague delivery
              promises.
            </Text>
          </View>
        )}

        <View className="mt-6 flex-row items-center gap-4 rounded-lg border border-[#C2D3E4] bg-[#F1F7FC] px-4 py-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#DDECF7]">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconDelivery}
              style={{ height: 38, width: 38 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[17px] font-bold leading-6 text-neo-text">
              Keep it clear for customers
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
              These zones and fees will be used in AI replies and order capture
              to set the right expectations.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel={isEditing ? "Save zone changes" : "Add zone"}
          accessibilityRole="button"
          className="mt-6 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg bg-neo-primary px-5"
          onPress={handleAddOrUpdateZone}
        >
          <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-neo-surface">
            <Text className="text-[24px] leading-7 text-neo-surface">
              {isEditing ? "OK" : "+"}
            </Text>
          </View>
          <Text className="text-[20px] font-bold leading-7 text-neo-surface">
            {isEditing ? "Save zone" : "Add zone"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Save delivery zones"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
          className={`mt-4 min-h-14 w-full items-center justify-center rounded-lg px-5 ${
            isSubmitting ? "bg-neo-surface-alt" : "bg-neo-surface"
          } border border-neo-primary`}
          disabled={isSubmitting}
          onPress={handleSave}
        >
          <Text
            className={`text-[17px] font-bold leading-6 ${
              isSubmitting ? "text-neo-text-muted" : "text-neo-primary"
            }`}
          >
            {isSubmitting ? "Saving zones" : "Save zones"}
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

        <View className="mt-4 flex-row items-center justify-center gap-3 px-4">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={images.iconPermission}
            style={{ height: 26, width: 26 }}
          />
          <Text className="flex-1 text-center text-[14px] leading-5 text-neo-text-muted">
            You can edit or add more zones anytime in Settings.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
