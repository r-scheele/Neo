import { removeStorageValue, storageKeys } from "@/lib/storage";

import { useSetupStore } from "./useSetupStore";
import { useConnectivityStore } from "./useConnectivityStore";
import { useOperationsStore } from "./useOperationsStore";
import { useUserPreferencesStore } from "./useUserPreferencesStore";

export async function clearUserLocalState() {
  useSetupStore.getState().resetSetupState();
  useConnectivityStore.getState().resetConnectivityState();
  useOperationsStore.getState().resetOperationsState();
  useUserPreferencesStore.getState().resetPreferences();

  await Promise.all([
    removeStorageValue(storageKeys.setupProgress),
    removeStorageValue(storageKeys.setupDrafts),
    removeStorageValue(storageKeys.userPreferences),
    removeStorageValue(storageKeys.uiState),
    removeStorageValue(storageKeys.localDrafts),
  ]);
}
