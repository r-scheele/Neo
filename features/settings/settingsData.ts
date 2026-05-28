import type { Href } from "expo-router";
import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";
import { routes } from "@/constants/routes";

export type SettingsStatusTone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted";

export type SettingsToggleId =
  | "aiRoutineApproval"
  | "deliveryQuotePrompt"
  | "smartAlerts"
  | "safePreviewMode";

type BaseSettingsRow = {
  description: string;
  icon: ImageSourcePropType;
  id: string;
  statusLabel?: string;
  statusTone?: SettingsStatusTone;
  title: string;
};

export type SettingsLinkRow = BaseSettingsRow & {
  href: Href;
  kind: "link";
};

export type SettingsToggleRow = BaseSettingsRow & {
  kind: "toggle";
  offStatusLabel: string;
  offStatusTone: SettingsStatusTone;
  onStatusLabel: string;
  onStatusTone: SettingsStatusTone;
  toggleId: SettingsToggleId;
};

export type SettingsLockedRow = BaseSettingsRow & {
  kind: "locked";
  lockedLabel: string;
  notice: string;
};

export type SettingsNoticeRow = BaseSettingsRow & {
  kind: "notice";
  notice: string;
};

export type SettingsRow =
  | SettingsLinkRow
  | SettingsToggleRow
  | SettingsLockedRow
  | SettingsNoticeRow;

export type SettingsSection = {
  id: string;
  rows: readonly SettingsRow[];
  title: string;
};

export type SettingsAccountSummary = {
  accountLabel: string;
  businessName: string;
  healthLabel: string;
  healthTone: SettingsStatusTone;
  initials: string;
  roleLabel: string;
};

export const settingsAccountSummary: SettingsAccountSummary = {
  accountLabel: "Business account",
  businessName: "Aisha's Naturals",
  healthLabel: "All good",
  healthTone: "success",
  initials: "AO",
  roleLabel: "Owner",
};

export const initialSettingsToggles: Record<SettingsToggleId, boolean> = {
  aiRoutineApproval: true,
  deliveryQuotePrompt: true,
  safePreviewMode: true,
  smartAlerts: true,
};

export const settingsSections: readonly SettingsSection[] = [
  {
    id: "business",
    title: "Business",
    rows: [
      {
        description: "Business info, hours, policies",
        href: routes.businessProfile,
        icon: images.iconSettings,
        id: "business-profile",
        kind: "link",
        statusLabel: "Aisha's Naturals",
        statusTone: "muted",
        title: "Business profile",
      },
      {
        description: "Areas, fees, delivery settings",
        href: routes.deliveryZones,
        icon: images.iconDelivery,
        id: "delivery-service",
        kind: "link",
        statusLabel: "Lagos Mainland",
        statusTone: "info",
        title: "Delivery & service",
      },
      {
        description: "Categories, items, pricing",
        href: routes.productBasics,
        icon: images.iconProduct,
        id: "products-services",
        kind: "link",
        statusLabel: "142 items",
        statusTone: "info",
        title: "Products & services",
      },
    ],
  },
  {
    id: "safety-ai",
    title: "Safety & AI",
    rows: [
      {
        description: "Guardrails, approval rules, risk levels",
        icon: images.iconApprovals,
        id: "ai-safety-approvals",
        kind: "toggle",
        offStatusLabel: "Sensitive only",
        offStatusTone: "warning",
        onStatusLabel: "Approval on",
        onStatusTone: "warning",
        title: "AI safety & approvals",
        toggleId: "aiRoutineApproval",
      },
      {
        description: "Tone, style, language, response length",
        href: routes.aiPersonality,
        icon: images.iconAiDraft,
        id: "ai-personality",
        kind: "link",
        statusLabel: "Warm - Helpful",
        statusTone: "info",
        title: "AI personality",
      },
      {
        description: "Manual proof, confirmations, reminders",
        href: routes.paymentRules,
        icon: images.iconReceiptReview,
        id: "payment-rules",
        kind: "link",
        statusLabel: "Manual proof",
        statusTone: "info",
        title: "Payment rules",
      },
      {
        description: "Refunds, discounts, sensitive actions",
        icon: images.iconPermission,
        id: "advanced-safety",
        kind: "locked",
        lockedLabel: "Owner only",
        notice:
          "Advanced safety is shown as a local role gate. Real enforcement needs a trusted backend.",
        statusTone: "muted",
        title: "Advanced safety rules",
      },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    rows: [
      {
        description: "Connection status and quality",
        href: routes.whatsappSetup,
        icon: images.iconInbox,
        id: "whatsapp-connection",
        kind: "link",
        statusLabel: "Connected",
        statusTone: "success",
        title: "WhatsApp connection",
      },
      {
        description: "Ask for quote check before checkout",
        icon: images.iconDelivery,
        id: "delivery-defaults",
        kind: "toggle",
        offStatusLabel: "Manual",
        offStatusTone: "muted",
        onStatusLabel: "Same day",
        onStatusTone: "info",
        title: "Delivery defaults",
        toggleId: "deliveryQuotePrompt",
      },
      {
        description: "Reminders, alerts, quiet hours",
        icon: images.iconFollowUps,
        id: "notifications",
        kind: "toggle",
        offStatusLabel: "Quiet",
        offStatusTone: "muted",
        onStatusLabel: "Smart alerts",
        onStatusTone: "info",
        title: "Notifications",
        toggleId: "smartAlerts",
      },
    ],
  },
  {
    id: "account-access",
    title: "Account & access",
    rows: [
      {
        description: "Add staff, roles, access levels",
        icon: images.iconCustomer,
        id: "team-permissions",
        kind: "locked",
        lockedLabel: "3 members",
        notice:
          "Team permissions are local mock settings for now. Production staff roles need server-side enforcement.",
        statusTone: "info",
        title: "Team & permissions",
      },
      {
        description: "Mask sensitive details in previews",
        icon: images.iconPermission,
        id: "privacy-security",
        kind: "toggle",
        offStatusLabel: "Preview safe",
        offStatusTone: "warning",
        onStatusLabel: "Secure",
        onStatusTone: "success",
        title: "Privacy & security",
        toggleId: "safePreviewMode",
      },
      {
        description: "Guides, FAQs, contact support",
        icon: images.iconSettings,
        id: "help-support",
        kind: "notice",
        notice:
          "Help and support content is a future local knowledge area, not a live support integration yet.",
        title: "Help & support",
      },
    ],
  },
];
