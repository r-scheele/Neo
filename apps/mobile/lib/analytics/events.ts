import type { MockScreenState } from "@/components/feedback/ScreenState";

import {
  captureAnalyticsEvent,
  type AnalyticsPrimitive,
  type AnalyticsProperties,
} from "./posthogClient";

export type AnalyticsScreenName =
  | "approvals"
  | "conversation_detail"
  | "create_order"
  | "follow_ups"
  | "inbox"
  | "permission_denied"
  | "receipt_review"
  | "settings"
  | "setup"
  | "today";

export type CountBand = "zero" | "one_to_three" | "four_to_ten" | "eleven_plus";
export type ConfidenceBand = "low" | "medium" | "high" | "unknown";
export type AmountBand =
  | "under_10k"
  | "10k_to_50k"
  | "50k_to_100k"
  | "100k_plus"
  | "unknown";
export type ItemCountBand = "one" | "two_to_three" | "four_to_ten" | "eleven_plus";

export type AnalyticsEventProperties = {
  app_opened: {
    is_first_open: boolean;
    platform: string;
  };
  onboarding_started: {
    entry_point: string;
  };
  setup_step_completed: {
    business_type?: string;
    step_id: string;
  };
  onboarding_completed: {
    business_type?: string;
    step_count: number;
  };
  today_viewed: {
    has_urgent_items: boolean;
    queue_count_band: CountBand;
  };
  today_item_opened: {
    item_type: string;
    priority: string;
  };
  inbox_conversation_opened: {
    has_ai_draft: boolean;
    has_unread: boolean;
    source_tab: string;
  };
  ai_draft_reviewed: {
    confidence_band: ConfidenceBand;
    draft_type: string;
  };
  ai_draft_sent: {
    draft_type: string;
    edited_before_send: boolean;
  };
  order_created: {
    item_count_band: ItemCountBand;
    source: string;
  };
  receipt_review_opened: {
    confidence_band: ConfidenceBand;
    source: string;
  };
  receipt_decision_recorded: {
    amount_band: AmountBand;
    confidence_band: ConfidenceBand;
    decision_type: string;
  };
  follow_up_sent: {
    edited_before_send: boolean;
    reason: string;
  };
  permission_denied_seen: {
    action_type: string;
    role_type: string;
  };
  offline_state_seen: {
    has_cached_data: boolean;
    screen: AnalyticsScreenName;
  };
  error_seen: {
    error_category: string;
    screen: AnalyticsScreenName;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventProperties;

const approvedEventPropertyKeys = {
  ai_draft_reviewed: ["confidence_band", "draft_type"],
  ai_draft_sent: ["draft_type", "edited_before_send"],
  app_opened: ["is_first_open", "platform"],
  error_seen: ["error_category", "screen"],
  follow_up_sent: ["edited_before_send", "reason"],
  inbox_conversation_opened: ["has_ai_draft", "has_unread", "source_tab"],
  onboarding_completed: ["business_type", "step_count"],
  onboarding_started: ["entry_point"],
  offline_state_seen: ["has_cached_data", "screen"],
  order_created: ["item_count_band", "source"],
  permission_denied_seen: ["action_type", "role_type"],
  receipt_decision_recorded: [
    "amount_band",
    "confidence_band",
    "decision_type",
  ],
  receipt_review_opened: ["confidence_band", "source"],
  setup_step_completed: ["business_type", "step_id"],
  today_item_opened: ["item_type", "priority"],
  today_viewed: ["has_urgent_items", "queue_count_band"],
} satisfies {
  [EventName in AnalyticsEventName]: readonly (keyof AnalyticsEventProperties[EventName])[];
};

export function trackAnalyticsEvent<EventName extends AnalyticsEventName>(
  eventName: EventName,
  properties: AnalyticsEventProperties[EventName],
) {
  captureAnalyticsEvent(
    eventName,
    filterApprovedProperties(eventName, properties),
  );
}

function filterApprovedProperties<EventName extends AnalyticsEventName>(
  eventName: EventName,
  properties: AnalyticsEventProperties[EventName],
): AnalyticsProperties {
  const approvedKeys = new Set<string>(
    approvedEventPropertyKeys[eventName].map(String),
  );
  const filteredProperties: Record<string, string | number | boolean | null | undefined> =
    {};
  const entries = Object.entries(properties) as [
    string,
    AnalyticsPrimitive | undefined,
  ][];

  entries.forEach(([key, value]) => {
    if (approvedKeys.has(key) && value !== undefined) {
      filteredProperties[key] = value;
    }
  });

  return filteredProperties;
}

export function getCountBand(count: number): CountBand {
  if (count <= 0) {
    return "zero";
  }

  if (count <= 3) {
    return "one_to_three";
  }

  if (count <= 10) {
    return "four_to_ten";
  }

  return "eleven_plus";
}

export function getItemCountBand(count: number): ItemCountBand {
  if (count <= 1) {
    return "one";
  }

  if (count <= 3) {
    return "two_to_three";
  }

  if (count <= 10) {
    return "four_to_ten";
  }

  return "eleven_plus";
}

export function getConfidenceBand(confidence?: number | string): ConfidenceBand {
  if (confidence === undefined) {
    return "unknown";
  }

  if (typeof confidence === "string") {
    if (confidence === "low" || confidence === "medium" || confidence === "high") {
      return confidence;
    }

    return "unknown";
  }

  if (confidence < 50) {
    return "low";
  }

  if (confidence < 80) {
    return "medium";
  }

  return "high";
}

export function getAmountBand(amount?: number): AmountBand {
  if (amount === undefined) {
    return "unknown";
  }

  if (amount < 10000) {
    return "under_10k";
  }

  if (amount < 50000) {
    return "10k_to_50k";
  }

  if (amount < 100000) {
    return "50k_to_100k";
  }

  return "100k_plus";
}

export function trackScreenStateSeen({
  errorCategory = "screen_error",
  hasCachedData,
  screen,
  state,
}: {
  errorCategory?: string;
  hasCachedData: boolean;
  screen: AnalyticsScreenName;
  state: MockScreenState;
}) {
  if (state === "offline") {
    trackAnalyticsEvent("offline_state_seen", {
      has_cached_data: hasCachedData,
      screen,
    });
  }

  if (state === "error") {
    trackAnalyticsEvent("error_seen", {
      error_category: errorCategory,
      screen,
    });
  }
}
