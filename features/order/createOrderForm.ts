export type PaymentStatus = "pending" | "paid" | "awaiting-receipt";

export type CreateOrderItem = {
  description: string;
  id: string;
  name: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  variant: string;
};

export type CreateOrderFormSnapshot = {
  deliveryFee: string;
  deliveryZone: string;
  items: readonly CreateOrderItem[];
  paymentStatus: PaymentStatus | null;
};

export type CreateOrderFormErrors = {
  deliveryFee?: string;
  deliveryZone?: string;
  items?: string;
  paymentStatus?: string;
};

export type CreateOrderTotals = {
  deliveryFee: number;
  itemCount: number;
  subtotal: number;
  total: number;
};

export function parseNairaAmount(value: string) {
  const normalizedValue = value
    .replace(/[,\s₦]/g, "")
    .replace(/^NGN/i, "")
    .trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
}

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

export function calculateCreateOrderTotals({
  deliveryFee,
  items,
}: {
  deliveryFee: string;
  items: readonly CreateOrderItem[];
}): CreateOrderTotals {
  const subtotal = items.reduce(
    (currentTotal, item) => currentTotal + item.unitPrice * item.quantity,
    0,
  );
  const parsedDeliveryFee = parseNairaAmount(deliveryFee) ?? 0;
  const itemCount = items.length;

  return {
    deliveryFee: parsedDeliveryFee,
    itemCount,
    subtotal,
    total: subtotal + parsedDeliveryFee,
  };
}

export function validateCreateOrderForm(form: CreateOrderFormSnapshot) {
  const errors: CreateOrderFormErrors = {};
  const parsedDeliveryFee = parseNairaAmount(form.deliveryFee);

  if (form.items.length === 0) {
    errors.items = "Add at least one product before saving this order.";
  } else if (form.items.some((item) => item.quantity < 1)) {
    errors.items = "Every product must have a quantity of at least 1.";
  }

  if (!form.deliveryZone.trim()) {
    errors.deliveryZone = "Choose a delivery zone for this order.";
  }

  if (parsedDeliveryFee === null) {
    errors.deliveryFee = "Enter a valid delivery fee.";
  } else if (parsedDeliveryFee < 0) {
    errors.deliveryFee = "Delivery fee cannot be negative.";
  }

  if (!form.paymentStatus) {
    errors.paymentStatus = "Select the current payment state.";
  }

  return errors;
}
