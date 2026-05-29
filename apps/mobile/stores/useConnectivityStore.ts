import { create } from "zustand";

type ConnectivityState = {
  isOnline: boolean;
  lastSyncedLabel: string;
};

type ConnectivityActions = {
  markSynced: (label?: string) => void;
  resetConnectivityState: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
};

export type ConnectivityStore = ConnectivityState & ConnectivityActions;

const defaultConnectivityState: ConnectivityState = {
  isOnline: true,
  lastSyncedLabel: "2m ago",
};

export const useConnectivityStore = create<ConnectivityStore>()((set) => ({
  ...defaultConnectivityState,
  markSynced: (label = "just now") => set({ isOnline: true, lastSyncedLabel: label }),
  resetConnectivityState: () => set(defaultConnectivityState),
  setOnlineStatus: (isOnline) => set({ isOnline }),
}));
