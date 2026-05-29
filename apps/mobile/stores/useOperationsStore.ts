import { create } from "zustand";

export type OperationsAttentionTabName =
  | "today"
  | "inbox"
  | "approvals"
  | "follow-ups"
  | "settings";

export type OperationsAttentionCounts = Record<OperationsAttentionTabName, number>;

type OperationsState = {
  attentionCounts: OperationsAttentionCounts;
};

type OperationsActions = {
  resetOperationsState: () => void;
  setApprovalPendingCount: (count: number) => void;
  setFollowUpAttentionCount: (count: number) => void;
  setInboxUnreadCount: (count: number) => void;
  setTodayUrgentCount: (count: number) => void;
};

export type OperationsStore = OperationsState & OperationsActions;

export const defaultOperationsAttentionCounts: OperationsAttentionCounts = {
  approvals: 4,
  "follow-ups": 5,
  inbox: 8,
  settings: 0,
  today: 5,
};

const defaultOperationsState: OperationsState = {
  attentionCounts: defaultOperationsAttentionCounts,
};

function normalizeCount(count: number) {
  return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
}

function setAttentionCount(
  state: OperationsState,
  tabName: OperationsAttentionTabName,
  count: number,
): OperationsState {
  return {
    attentionCounts: {
      ...state.attentionCounts,
      [tabName]: normalizeCount(count),
    },
  };
}

export const useOperationsStore = create<OperationsStore>()((set) => ({
  ...defaultOperationsState,
  resetOperationsState: () => set(defaultOperationsState),
  setApprovalPendingCount: (count) =>
    set((state) => setAttentionCount(state, "approvals", count)),
  setFollowUpAttentionCount: (count) =>
    set((state) => setAttentionCount(state, "follow-ups", count)),
  setInboxUnreadCount: (count) =>
    set((state) => setAttentionCount(state, "inbox", count)),
  setTodayUrgentCount: (count) =>
    set((state) => setAttentionCount(state, "today", count)),
}));
