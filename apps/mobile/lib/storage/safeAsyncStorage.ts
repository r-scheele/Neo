import AsyncStorage from "@react-native-async-storage/async-storage";

import type { StorageKey } from "./storageKeys";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export async function readJsonValue<Value>(
  key: StorageKey,
  parse: (value: unknown) => Value,
  fallback: Value,
): Promise<Value> {
  try {
    const rawValue = await AsyncStorage.getItem(key);

    if (rawValue === null) {
      return fallback;
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    return parse(parsedValue);
  } catch {
    return fallback;
  }
}

export async function writeJsonValue(key: StorageKey, value: JsonValue): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function removeStorageValue(key: StorageKey): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export { AsyncStorage };
