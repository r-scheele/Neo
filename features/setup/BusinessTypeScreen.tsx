import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { Link, Pressable, ScrollView, Text, View } from "@/src/tw";

type BusinessTypeId =
  | "fashion"
  | "tailor"
  | "food"
  | "logistics"
  | "real-estate"
  | "beauty-hair"
  | "services"
  | "other";

type BusinessTypeOption = {
  id: BusinessTypeId;
  title: string;
  description: string;
  icon?: ImageSourcePropType;
  iconText?: string;
};

const businessTypeOptions: readonly BusinessTypeOption[] = [
  {
    id: "fashion",
    title: "Fashion",
    description: "Clothing, wear, accessories",
    icon: images.iconProduct,
  },
  {
    id: "tailor",
    title: "Tailor",
    description: "Tailoring, custom sewing, alterations",
    icon: images.iconSettings,
  },
  {
    id: "food",
    title: "Food",
    description: "Meals, snacks, catering, drinks",
    icon: images.iconOrder,
  },
  {
    id: "logistics",
    title: "Logistics",
    description: "Delivery, haulage, courier services",
    icon: images.iconDelivery,
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Properties, rentals, sales, management",
    icon: images.iconToday,
  },
  {
    id: "beauty-hair",
    title: "Beauty / Hair",
    description: "Hair, nails, spa, beauty services",
    icon: images.iconCustomer,
  },
  {
    id: "services",
    title: "Services",
    description: "Bookings, repairs, consulting, more",
    icon: images.iconFollowUps,
  },
  {
    id: "other",
    title: "Other",
    description: "Something else? We have got you",
    iconText: "...",
  },
];

function getOptionContainerClassName(isSelected: boolean) {
  if (isSelected) {
    return "border-neo-primary bg-[#F7FAF4]";
  }

  return "border-neo-border bg-neo-surface";
}

function BusinessTypeTile({
  isSelected,
  onPress,
  option,
}: {
  isSelected: boolean;
  onPress: () => void;
  option: BusinessTypeOption;
}) {
  return (
    <Pressable
      accessibilityHint="Selects this business type for setup defaults."
      accessibilityLabel={`${option.title}, ${option.description}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`min-h-[156px] flex-1 basis-[48%] rounded-lg border px-4 py-4 ${getOptionContainerClassName(
        isSelected,
      )}`}
      onPress={onPress}
    >
      <View className="flex-row justify-between gap-2">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-neo-surface-alt">
          {option.icon ? (
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={option.icon}
              style={{ height: 34, width: 34 }}
            />
          ) : (
            <Text className="text-[26px] font-bold leading-8 text-neo-primary">
              {option.iconText}
            </Text>
          )}
        </View>

        {isSelected ? (
          <View className="h-8 w-8 items-center justify-center rounded-full bg-neo-primary">
            <Text className="text-[11px] font-bold leading-4 text-neo-surface">
              OK
            </Text>
          </View>
        ) : null}
      </View>

      <Text className="mt-4 text-[18px] font-bold leading-6 text-neo-text">
        {option.title}
      </Text>
      <Text className="mt-2 text-[14px] leading-5 text-neo-text-muted">
        {option.description}
      </Text>
    </Pressable>
  );
}

export function BusinessTypeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const [selectedTypeId, setSelectedTypeId] = useState<BusinessTypeId | null>(
    "fashion",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (id: BusinessTypeId) => {
    setSelectedTypeId((currentId) => (currentId === id ? null : id));
    setError(null);
  };

  const handleContinue = () => {
    if (!selectedTypeId) {
      setError("Choose one business type before continuing setup.");
      return;
    }

    setIsSubmitting(true);
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
        <View className="flex-row items-center gap-3">
          <Link asChild href={routes.setup}>
            <Pressable
              accessibilityLabel="Back to setup checklist"
              accessibilityRole="link"
              className="min-h-11 w-11 items-start justify-center"
            >
              <Text className="text-[34px] leading-9 text-neo-primary">{"<"}</Text>
            </Pressable>
          </Link>

          <View className="flex-1 items-center">
            <Text
              className="text-center text-[22px] font-bold leading-7 text-neo-text"
              numberOfLines={1}
            >
              Business type
            </Text>
          </View>

          <View className="min-h-9 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt px-4">
            <Text className="text-[15px] font-bold leading-5 text-neo-text">
              Step 2 of 7
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((segment) => (
            <View
              className={`h-1.5 flex-1 rounded-full ${
                segment < 2 ? "bg-neo-primary" : "bg-neo-border"
              }`}
              key={segment}
            />
          ))}
        </View>

        <View className="mt-7 flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-[26px] font-bold leading-8 text-neo-text">
              What best describes your business?
            </Text>
            <Text className="mt-3 text-[16px] leading-6 text-neo-text-muted">
              This helps Neo tailor replies, suggestions, and setup defaults for
              you.
            </Text>
          </View>

          <View className="h-28 w-28 items-center justify-center rounded-full bg-neo-surface-alt">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.iconProduct}
              style={{ height: 70, width: 70 }}
            />
          </View>
        </View>

        <View className="mt-7 flex-row flex-wrap gap-3">
          {businessTypeOptions.map((option) => {
            const isSelected = selectedTypeId === option.id;

            return (
              <BusinessTypeTile
                isSelected={isSelected}
                key={option.id}
                onPress={() => handleSelect(option.id)}
                option={option}
              />
            );
          })}
        </View>

        <View className="mt-6 flex-row gap-3 rounded-lg border border-neo-border bg-neo-surface-alt px-4 py-4">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-neo-gold">
            <Text className="text-[18px] font-bold leading-6 text-neo-surface">
              i
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-bold leading-5 text-neo-text">
              You can change this anytime
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text-muted">
              Your choice helps Neo speak in the right customer language.
            </Text>
          </View>
        </View>

        {error ? (
          <Text className="mt-4 text-center text-[13px] font-semibold leading-5 text-neo-error">
            {error}
          </Text>
        ) : null}

        <Pressable
          accessibilityLabel="Choose type"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
          className={`mt-7 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-lg px-5 ${
            isSubmitting ? "bg-neo-surface-alt" : "bg-neo-primary"
          }`}
          disabled={isSubmitting}
          onPress={handleContinue}
        >
          <Text
            className={`text-[17px] font-bold leading-6 ${
              isSubmitting ? "text-neo-text-muted" : "text-neo-surface"
            }`}
          >
            {isSubmitting ? "Saving type" : "Choose type"}
          </Text>
          {!isSubmitting ? (
            <Text className="text-[26px] leading-7 text-neo-surface">{">"}</Text>
          ) : null}
        </Pressable>

        <Link asChild href={routes.setup}>
          <Pressable
            accessibilityLabel="Back to checklist"
            accessibilityRole="link"
            className="mt-4 min-h-11 items-center justify-center px-5"
          >
            <Text className="text-[16px] font-semibold leading-6 text-neo-primary underline">
              Back to checklist
            </Text>
          </Pressable>
        </Link>

        <Pressable
          accessibilityHint="Example guidance is not available yet."
          accessibilityLabel="Not sure? See examples"
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          className="min-h-11 flex-row items-center justify-center gap-2 px-4"
          disabled
        >
          <View className="h-7 w-7 items-center justify-center rounded-full border border-neo-primary">
            <Text className="text-[15px] font-bold leading-5 text-neo-primary">
              ?
            </Text>
          </View>
          <Text className="text-[14px] leading-5 text-neo-text-muted">
            Not sure?
          </Text>
          <Text className="text-[14px] font-semibold leading-5 text-neo-primary underline">
            See examples
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
