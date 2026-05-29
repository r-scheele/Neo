import type { PersistStorage, StorageValue } from "zustand/middleware";

import { AsyncStorage } from "./safeAsyncStorage";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStorageValue<State>(value: unknown): value is StorageValue<State> {
  if (!isRecord(value) || !("state" in value)) {
    return false;
  }

  return (
    value.version === undefined ||
    typeof value.version === "number"
  );
}

async function removeMalformedValue(name: string) {
  try {
    await AsyncStorage.removeItem(name);
  } catch {
    // Treat cleanup failures like a cache miss; the app should still hydrate.
  }
}

export function createNeoPersistStorage<State>(): PersistStorage<State, Promise<void>> {
  return {
    getItem: async (name) => {
      let rawValue: string | null;

      try {
        rawValue = await AsyncStorage.getItem(name);
      } catch {
        return null;
      }

      if (rawValue === null) {
        return null;
      }

      try {
        const parsedValue: unknown = JSON.parse(rawValue);

        if (isStorageValue<State>(parsedValue)) {
          return parsedValue;
        }
      } catch {
        await removeMalformedValue(name);
        return null;
      }

      await removeMalformedValue(name);
      return null;
    },
    removeItem: async (name) => {
      try {
        await AsyncStorage.removeItem(name);
      } catch {
        // Storage cleanup must not block sign-out or reset flows.
      }
    },
    setItem: async (name, value) => {
      try {
        await AsyncStorage.setItem(name, JSON.stringify(value));
      } catch {
        // Persistence failures should not block the foreground action.
      }
    },
  };
}
