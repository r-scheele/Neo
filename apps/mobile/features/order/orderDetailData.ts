import type { BackendOrderDetail } from "@/lib/api";

// DEV-ONLY FIXTURE DATA: replace with backend-backed order records before release.
export type OrderPaymentState = "awaiting-payment" | "receipt-review" | "paid";
export type OrderDeliveryState = "scheduled" | "in-progress" | "delivered";
export type OrderStatusTone = "success" | "warning" | "info" | "neutral";
export type OrderTimelineTone = "success" | "warning" | "info" | "neutral";

export type OrderDetailItem = {
  description: string;
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variant: string;
};

export type OrderCustomer = {
  customerId: string;
  customerInitials: string;
  customerName: string;
  customerSince: string;
  orderCount: number;
  relationshipLabel: string;
};

export type OrderPayment = {
  actionLabel: string;
  amount: number;
  detail: string;
  receiptId?: string;
  state: OrderPaymentState;
  submittedAt?: string;
  title: string;
  warning: string;
};

export type OrderDelivery = {
  estimate: string;
  fee: number;
  state: OrderDeliveryState;
  stateLabel: string;
  zone: string;
};

export type OrderTimelineEvent = {
  detail?: string;
  id: string;
  statusLabel?: string;
  time: string;
  title: string;
  tone: OrderTimelineTone;
};

export type OrderDetailRecord = {
  conversationId: string;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  displayId: string;
  id: string;
  items: readonly OrderDetailItem[];
  orderDate: string;
  orderTime: string;
  payment: OrderPayment;
  sourceLabel: string;
  sourceTitle: string;
  statusLabel: string;
  statusTone: OrderStatusTone;
  timeline: readonly OrderTimelineEvent[];
};

export type OrderTotals = {
  deliveryFee: number;
  itemCount: number;
  subtotal: number;
  total: number;
};

const baseOrder: OrderDetailRecord = {
  conversationId: "aisha-order-review",
  customer: {
    customerId: "aisha-o",
    customerInitials: "AO",
    customerName: "Aisha O.",
    customerSince: "May 2024",
    orderCount: 3,
    relationshipLabel: "Returning customer",
  },
  delivery: {
    estimate: "Est. delivery: Sat, May 10 by 4:00 PM",
    fee: 1500,
    state: "scheduled",
    stateLabel: "Scheduled",
    zone: "Lagos (Lekki)",
  },
  displayId: "#ORD-2025-0561",
  id: "ord-2025-0561",
  items: [
    {
      description: "Serves 8-10 people",
      id: "jollof-tray-medium",
      name: "Jollof Tray",
      quantity: 2,
      unitPrice: 7000,
      variant: "Medium",
    },
    {
      description: "Sweet, ripe plantain",
      id: "plantain-large",
      name: "Plantain",
      quantity: 1,
      unitPrice: 2500,
      variant: "Large",
    },
  ],
  orderDate: "May 8, 2025",
  orderTime: "10:21 AM",
  payment: {
    actionLabel: "Review receipt",
    amount: 18000,
    detail: "Customer sent payment receipt",
    receiptId: "aisha-receipt-18000",
    state: "receipt-review",
    submittedAt: "May 8, 2025 - 11:02 AM",
    title: "Receipt submitted",
    warning: "Please review the receipt before confirming payment.",
  },
  sourceLabel: "Neo AI from chat",
  sourceTitle: "Jollof trays for Saturday",
  statusLabel: "Awaiting payment",
  statusTone: "warning",
  timeline: [
    {
      id: "receipt-submitted",
      statusLabel: "Needs review",
      time: "May 8, 2025 - 11:02 AM",
      title: "Payment receipt submitted",
      tone: "warning",
    },
    {
      id: "order-created",
      time: "May 8, 2025 - 10:21 AM",
      title: "Order created from chat",
      tone: "success",
    },
    {
      id: "delivery-scheduled",
      time: "May 8, 2025 - 10:21 AM",
      title: "Delivery scheduled",
      tone: "info",
    },
    {
      detail: '"I will like jollof trays for Saturday delivery."',
      id: "customer-requested",
      time: "May 8, 2025 - 10:10 AM",
      title: "Customer requested",
      tone: "success",
    },
  ],
};

const pendingOrder: OrderDetailRecord = {
  ...baseOrder,
  displayId: "#ORD-2025-0562",
  id: "unpaid-today",
  payment: {
    actionLabel: "Send reminder",
    amount: 18000,
    detail: "No payment receipt has been submitted yet",
    state: "awaiting-payment",
    title: "Awaiting payment",
    warning: "Send a polite reminder or wait for the customer to share proof.",
  },
  statusLabel: "Awaiting payment",
  timeline: [
    {
      id: "order-created",
      statusLabel: "Pending",
      time: "May 8, 2025 - 10:21 AM",
      title: "Order created from chat",
      tone: "warning",
    },
    {
      id: "delivery-scheduled",
      time: "May 8, 2025 - 10:21 AM",
      title: "Delivery scheduled",
      tone: "info",
    },
    {
      detail: '"Please confirm the price and delivery fee to Lekki."',
      id: "customer-requested",
      time: "May 8, 2025 - 10:10 AM",
      title: "Customer requested",
      tone: "success",
    },
  ],
};

const paidOrder: OrderDetailRecord = {
  ...baseOrder,
  displayId: "#ORD-2025-0560",
  id: "paid-aisha-jollof",
  payment: {
    actionLabel: "View receipt",
    amount: 18000,
    detail: "Payment marked reviewed by staff",
    receiptId: "aisha-receipt-18000",
    state: "paid",
    submittedAt: "May 8, 2025 - 11:02 AM",
    title: "Payment reviewed",
    warning: "This local mock state assumes a human review happened earlier.",
  },
  statusLabel: "Paid",
  statusTone: "success",
};

const mockOrders: Record<string, OrderDetailRecord> = {
  [baseOrder.id]: baseOrder,
  [pendingOrder.id]: pendingOrder,
  [paidOrder.id]: paidOrder,
};

export function formatOrderNaira(amount: number) {
  return `\u20A6${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

export function calculateOrderTotals(
  items: readonly OrderDetailItem[],
  deliveryFee: number,
): OrderTotals {
  const subtotal = items.reduce(
    (currentTotal, item) => currentTotal + item.unitPrice * item.quantity,
    0,
  );

  return {
    deliveryFee,
    itemCount: items.length,
    subtotal,
    total: subtotal + deliveryFee,
  };
}

export function getOrderDetailById(orderId?: string): OrderDetailRecord | null {
  if (!orderId) {
    return null;
  }

  if (mockOrders[orderId]) {
    return mockOrders[orderId];
  }

  if (orderId.startsWith("local-")) {
    return {
      ...baseOrder,
      displayId: "#LOCAL-ORDER",
      id: orderId,
      statusLabel: "Saved locally",
      statusTone: "info",
    };
  }

  return null;
}

export function normalizeBackendOrderDetail(
  order: BackendOrderDetail,
): OrderDetailRecord {
  return {
    conversationId: order.conversationId,
    customer: order.customer,
    delivery: order.delivery,
    displayId: order.displayId,
    id: order.id,
    items: order.items,
    orderDate: order.orderDate,
    orderTime: order.orderTime,
    payment: order.payment,
    sourceLabel: order.sourceLabel,
    sourceTitle: order.sourceTitle,
    statusLabel: order.statusLabel,
    statusTone: normalizeOrderTone(order.statusTone),
    timeline: order.timeline.map((event) => ({
      ...event,
      tone: normalizeOrderTone(event.tone),
    })),
  };
}

function normalizeOrderTone(tone: BackendOrderDetail["statusTone"]): OrderStatusTone {
  return tone === "error" ? "warning" : tone;
}
