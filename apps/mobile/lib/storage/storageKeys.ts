export const storageKeys = {
  setupProgress: "@neo/setup-progress",
  setupDrafts: "@neo/setup-drafts",
  userPreferences: "@neo/user-preferences",
  uiState: "@neo/ui-state",
  localDrafts: "@neo/local-drafts",
  mockDataVersion: "@neo/mock-data-version",
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
