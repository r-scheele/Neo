import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createNeoPersistStorage, storageKeys } from "@/lib/storage";

export type SettingsToggleId =
  | "aiRoutineApproval"
  | "deliveryQuotePrompt"
  | "smartAlerts"
  | "safePreviewMode";

type UserPreferencesState = {
  settingsToggles: Record<SettingsToggleId, boolean>;
};

type UserPreferencesActions = {
  resetPreferences: () => void;
  setSettingToggle: (toggleId: SettingsToggleId, isEnabled: boolean) => void;
};

type UserPreferencesPersistedState = UserPreferencesState;

export type UserPreferencesStore = UserPreferencesState & UserPreferencesActions;

export const defaultSettingsToggles: Record<SettingsToggleId, boolean> = {
  aiRoutineApproval: true,
  deliveryQuotePrompt: true,
  safePreviewMode: true,
  smartAlerts: true,
};

const defaultUserPreferencesState: UserPreferencesState = {
  settingsToggles: defaultSettingsToggles,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function parseSettingsToggles(value: unknown): Record<SettingsToggleId, boolean> {
  if (!isRecord(value)) {
    return defaultSettingsToggles;
  }

  return {
    aiRoutineApproval: asBoolean(
      value.aiRoutineApproval,
      defaultSettingsToggles.aiRoutineApproval,
    ),
    deliveryQuotePrompt: asBoolean(
      value.deliveryQuotePrompt,
      defaultSettingsToggles.deliveryQuotePrompt,
    ),
    safePreviewMode: asBoolean(
      value.safePreviewMode,
      defaultSettingsToggles.safePreviewMode,
    ),
    smartAlerts: asBoolean(value.smartAlerts, defaultSettingsToggles.smartAlerts),
  };
}

function parseUserPreferencesState(value: unknown): UserPreferencesPersistedState {
  if (!isRecord(value)) {
    return defaultUserPreferencesState;
  }

  return {
    settingsToggles: parseSettingsToggles(value.settingsToggles),
  };
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      ...defaultUserPreferencesState,
      resetPreferences: () => set(defaultUserPreferencesState),
      setSettingToggle: (toggleId, isEnabled) =>
        set((state) => ({
          settingsToggles: {
            ...state.settingsToggles,
            [toggleId]: isEnabled,
          },
        })),
    }),
    {
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...parseUserPreferencesState(persistedState),
      }),
      name: storageKeys.userPreferences,
      partialize: (state): UserPreferencesPersistedState => ({
        settingsToggles: state.settingsToggles,
      }),
      storage: createNeoPersistStorage<UserPreferencesPersistedState>(),
      version: 1,
    },
  ),
);
