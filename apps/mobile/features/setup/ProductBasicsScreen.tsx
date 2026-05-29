import { useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import { images } from "@/constants/images";
import { routes } from "@/constants/routes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Link, Pressable, ScrollView, Text, TextInput, View } from "@/src/tw";
import { useSetupStore } from "@/stores/useSetupStore";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  variant: string;
  note: string;
  icon: ImageSourcePropType;
};

type ProductForm = {
  name: string;
  price: string;
  variant: string;
  note: string;
};

type ProductFormErrors = Partial<Record<keyof ProductForm, string>>;

const initialProducts: readonly Product[] = [
  {
    id: "ankara-dress",
    name: "Ankara Dress",
    price: 18000,
    category: "Womens wear",
    variant: "Multiple sizes",
    note: "Short sleeve, premium quality",
    icon: images.iconProduct,
  },
  {
    id: "jollof-party-tray",
    name: "Jollof Rice (Party Tray)",
    price: 25000,
    category: "Food",
    variant: "Serves 10-12",
    note: "Party tray",
    icon: images.iconOrder,
  },
  {
    id: "delivery-fee",
    name: "Delivery Fee",
    price: 1500,
    category: "Service",
    variant: "Per trip",
    note: "Local delivery",
    icon: images.iconDelivery,
  },
  {
    id: "gift-box-medium",
    name: "Gift Box (Medium)",
    price: 2000,
    category: "Packaging",
    variant: "Includes ribbon",
    note: "Medium gift packaging",
    icon: images.iconPaid,
  },
];

const emptyForm: ProductForm = {
  name: "",
  price: "",
  variant: "",
  note: "",
};

function parsePrice(value: string) {
  const normalizedValue = value.replace(/,/g, "").trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedPrice = Number(normalizedValue);

  if (!Number.isFinite(parsedPrice)) {
    return null;
  }

  return parsedPrice;
}

function formatPrice(price: number) {
  return `NGN ${price.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}

function validateProductForm(form: ProductForm) {
  const errors: ProductFormErrors = {};
  const price = parsePrice(form.price);

  if (!form.name.trim()) {
    errors.name = "Enter a product name customers will recognize.";
  }

  if (price === null) {
    errors.price = "Enter a valid product price.";
  } else if (price <= 0) {
    errors.price = "Price must be greater than zero.";
  } else if (!Number.isInteger(price)) {
    errors.price = "Use whole naira amounts only.";
  }

  return errors;
}

function getInputBorderClassName(error?: string) {
  return error ? "border-neo-error" : "border-neo-border";
}

function getInputIcon(label: string) {
  if (label === "Product name") {
    return images.iconProduct;
  }

  if (label === "Price (NGN)") {
    return images.iconPaid;
  }

  if (label === "Variant (optional)") {
    return images.iconSettings;
  }

  return images.iconAiDraft;
}

function StepChip() {
  return (
    <View className="min-h-10 items-center justify-center rounded-full border border-neo-border bg-neo-surface-alt px-4">
      <Text className="text-[15px] font-bold leading-5 text-neo-text">
        Step 7 of 7
      </Text>
    </View>
  );
}

function ProductInput({
  error,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  value,
}: {
  error?: string;
  keyboardType?: "default" | "numeric";
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
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
          source={getInputIcon(label)}
          style={{ height: 26, width: 26 }}
        />
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={label === "Price (NGN)" ? "none" : "sentences"}
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

function ProductRow({
  onDelete,
  onEdit,
  product,
}: {
  onDelete: () => void;
  onEdit: () => void;
  product: Product;
}) {
  return (
    <View className="min-h-[104px] flex-row items-center gap-3 border-b border-neo-border px-3 py-3">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F8EEDC]">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={product.icon}
          style={{ height: 34, width: 34 }}
        />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-[17px] font-bold leading-6 text-neo-text"
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <Text
          className="mt-1 text-[14px] leading-5 text-neo-text-muted"
          numberOfLines={1}
        >
          {product.category}
        </Text>
      </View>

      <View className="items-end gap-2">
        <Text
          className="text-right text-[16px] font-bold leading-5 text-neo-text"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {formatPrice(product.price)}
        </Text>
        <View className="max-w-[116px] rounded-full bg-[#EEF8F0] px-3 py-1">
          <Text
            className="text-center text-[12px] font-semibold leading-4 text-neo-primary"
            numberOfLines={1}
          >
            {product.variant || "Starter item"}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          accessibilityLabel={`Edit ${product.name}`}
          accessibilityRole="button"
          className="min-h-11 w-11 items-center justify-center rounded-lg border border-neo-border bg-neo-surface"
          onPress={onEdit}
        >
          <Text className="text-[16px] font-bold leading-5 text-neo-text">Edit</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`Remove ${product.name}`}
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

export function ProductBasicsScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const isCompactPhone = height < 760 || width < 380;
  const horizontalPadding = width >= 390 ? 20 : 16;
  const businessType = useSetupStore((store) => store.businessType);
  const setProductCount = useSetupStore((store) => store.setProductCount);
  const markStepComplete = useSetupStore((store) => store.markStepComplete);
  const [products, setProducts] = useState<readonly Product[]>(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productCountLabel = useMemo(
    () => `${products.length} ${products.length === 1 ? "item" : "items"}`,
    [products.length],
  );
  const isEditing = editingProductId !== null;

  const updateField = (field: keyof ProductForm, value: string) => {
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
    setEditingProductId(null);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      note: product.note,
      price: String(product.price),
      variant: product.variant,
    });
    setErrors({});
    setEditingProductId(product.id);
  };

  const handleDelete = (productId: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
    if (editingProductId === productId) {
      resetForm();
    }
  };

  const handleAddOrUpdateProduct = () => {
    const validationErrors = validateProductForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const price = parsePrice(form.price);

    if (price === null) {
      return;
    }

    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                name: form.name.trim(),
                note: form.note.trim(),
                price,
                variant: form.variant.trim() || "Starter item",
              }
            : product,
        ),
      );
      resetForm();
      return;
    }

    const normalizedName = form.name.trim();
    const nextProduct: Product = {
      id: `${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      category: "Starter item",
      icon: images.iconProduct,
      name: normalizedName,
      note: form.note.trim(),
      price,
      variant: form.variant.trim() || "Starter item",
    };

    setProducts((currentProducts) => [...currentProducts, nextProduct]);
    resetForm();
  };

  const handleSave = () => {
    setIsSubmitting(true);
    setProductCount(products.length);
    markStepComplete("product-basics");
    trackAnalyticsEvent("setup_step_completed", {
      business_type: businessType ?? undefined,
      step_id: "product-basics",
    });
    trackAnalyticsEvent("onboarding_completed", {
      business_type: businessType ?? undefined,
      step_count: 7,
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
                <Text className="text-[34px] leading-9 text-neo-primary">{"<"}</Text>
              </Pressable>
            </Link>

            <StepChip />
          </View>

          <View className="mt-5 items-center px-2">
            <Text className="text-center text-[26px] font-bold leading-8 text-neo-text">
              Product basics
            </Text>
            <Text className="mt-3 text-center text-[16px] leading-6 text-neo-text-muted">
              Add a few items so Neo can answer price and availability
              accurately.
            </Text>
          </View>
        </View>

        <View className="mt-7 rounded-lg border border-neo-border bg-neo-surface px-4 py-5">
          <View className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F8EEDC]">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={images.iconProduct}
                style={{ height: 34, width: 34 }}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[20px] font-bold leading-7 text-neo-text">
                {isEditing ? "Edit product" : "Add a product"}
              </Text>
              <Text className="mt-1 text-[15px] leading-5 text-neo-text-muted">
                Start with your most common items.
              </Text>
              {isEditing ? (
                <Pressable
                  accessibilityLabel="Cancel editing product"
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
            <ProductInput
              error={errors.name}
              label="Product name"
              onChangeText={(value) => updateField("name", value)}
              placeholder="e.g. Ankara dress"
              value={form.name}
            />

            <View className="flex-row gap-3">
              <ProductInput
                error={errors.price}
                keyboardType="numeric"
                label="Price (NGN)"
                onChangeText={(value) => updateField("price", value)}
                placeholder="0.00"
                value={form.price}
              />
              <ProductInput
                error={errors.variant}
                label="Variant (optional)"
                onChangeText={(value) => updateField("variant", value)}
                placeholder="e.g. Size, Color"
                value={form.variant}
              />
            </View>

            <ProductInput
              error={errors.note}
              label="Notes (optional)"
              onChangeText={(value) => updateField("note", value)}
              placeholder="e.g. Short sleeve, premium quality"
              value={form.note}
            />
          </View>

          <Pressable
            accessibilityLabel={isEditing ? "Save product changes" : "Add product to list"}
            accessibilityRole="button"
            className="mt-5 min-h-14 flex-row items-center justify-center gap-3 rounded-lg bg-neo-surface-alt px-4"
            onPress={handleAddOrUpdateProduct}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-neo-primary">
              <Text className="text-[22px] leading-7 text-neo-primary">
                {isEditing ? "OK" : "+"}
              </Text>
            </View>
            <Text className="text-[17px] font-bold leading-6 text-neo-primary">
              {isEditing ? "Save product" : "Add to list"}
            </Text>
          </Pressable>
        </View>

        <View className="mt-6 flex-row items-center justify-between gap-4">
          <Text className="text-[18px] font-semibold leading-6 text-neo-text">
            Your starter products
          </Text>
          <Text className="text-[17px] font-bold leading-6 text-neo-text-muted">
            {productCountLabel}
          </Text>
        </View>

        {products.length > 0 ? (
          <View className="mt-3 overflow-hidden rounded-lg border border-neo-border bg-neo-surface">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                onDelete={() => handleDelete(product.id)}
                onEdit={() => handleEdit(product)}
                product={product}
              />
            ))}
          </View>
        ) : (
          <View className="mt-3 items-center rounded-lg border border-neo-border bg-neo-surface px-5 py-8">
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={images.emptyProducts}
              style={{ height: 136, width: 176 }}
            />
            <Text className="mt-4 text-center text-[18px] font-bold leading-6 text-neo-text">
              No products added yet
            </Text>
            <Text className="mt-2 text-center text-[14px] leading-5 text-neo-text-muted">
              Add your first item so Neo can answer price and availability
              questions more accurately.
            </Text>
          </View>
        )}

        <View className="mt-6 flex-row items-center gap-4 rounded-lg border border-[#C2D3E4] bg-[#F1F7FC] px-4 py-4">
          <View className="h-14 w-14 items-center justify-center rounded-full border border-neo-info bg-neo-surface">
            <Text className="text-[24px] font-bold leading-7 text-neo-info">i</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold leading-5 text-neo-info">
              Keep it simple.
            </Text>
            <Text className="mt-1 text-[14px] leading-5 text-neo-text">
              Add your top items first. You can add more later.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Save products"
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
            source={images.iconProduct}
            style={{ height: 28, width: 28 }}
          />
          <Text
            className={`text-[18px] font-bold leading-6 ${
              isSubmitting ? "text-neo-text-muted" : "text-neo-surface"
            }`}
          >
            {isSubmitting ? "Saving products" : "Save products"}
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

        <Link asChild href={routes.setup}>
          <Pressable
            accessibilityLabel="Skip product basics for now"
            accessibilityRole="link"
            className="mt-3 min-h-11 items-center justify-center px-5"
          >
            <Text className="text-[15px] font-bold leading-5 text-neo-primary">
              Skip for now
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
