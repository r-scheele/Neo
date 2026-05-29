import type {
  OperationsAttentionCounts,
  OperationsAttentionTabName,
} from "@/stores/useOperationsStore";

export type AttentionTabName = OperationsAttentionTabName;

export type AttentionBadgeCounts = Partial<OperationsAttentionCounts>;

export const attentionBadgeDescriptions: Partial<
  Record<AttentionTabName, string>
> = {
  approvals: "pending approvals",
  "follow-ups": "due follow-ups",
  inbox: "unread messages",
  today: "urgent items",
};

export function getAttentionBadgeValue(count: number | undefined) {
  if (!count || count <= 0) {
    return undefined;
  }

  if (count > 99) {
    return "99+";
  }

  return String(count);
}

export function getTabAttentionAccessibilityLabel({
  count,
  description,
  title,
}: {
  count: number | undefined;
  description: string | undefined;
  title: string;
}) {
  if (!count || count <= 0 || !description) {
    return `${title} tab`;
  }

  const countLabel = count > 99 ? "99 or more" : String(count);

  return `${title} tab, ${countLabel} ${description}`;
}
