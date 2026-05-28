import { fail, isRecord } from "./http.ts";

export type DbResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      response: Response;
    };

type DbRequestOptions = {
  body?: Record<string, unknown> | readonly Record<string, unknown>[];
  method?: "GET" | "POST" | "PATCH";
  prefer?: string;
};

export async function dbRequest<TData>(
  path: string,
  options: DbRequestOptions,
  parseData: (value: unknown) => TData,
): Promise<DbResult<TData>> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    return {
      ok: false,
      response: fail(
        "BACKEND_CONFIG_MISSING",
        "Backend data access is not configured.",
        500,
      ),
    };
  }

  const response = await fetch(`${url}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return {
      ok: false,
      response: fail(
        "BACKEND_DATA_ERROR",
        "Neo could not load backend data.",
        502,
      ),
    };
  }

  try {
    return {
      ok: true,
      data: parseData(body),
    };
  } catch {
    return {
      ok: false,
      response: fail(
        "BACKEND_RESPONSE_INVALID",
        "Neo received an unexpected backend response.",
        502,
      ),
    };
  }
}

export function firstRecord(value: unknown): Record<string, unknown> | null {
  if (!Array.isArray(value)) {
    throw new Error("Expected array response.");
  }

  const first = value[0] as unknown;

  if (first === undefined) {
    return null;
  }

  if (!isRecord(first)) {
    throw new Error("Expected record response.");
  }

  return first;
}

export function records(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected array response.");
  }

  return value.filter(isRecord);
}

export function requiredString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Expected string.");
  }

  return value;
}

export function optionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function requiredNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Expected number.");
  }

  return value;
}

export function safeJsonRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

export function safeJsonArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
